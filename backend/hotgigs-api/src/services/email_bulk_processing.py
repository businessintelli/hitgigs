"""
Email Integration and Bulk Processing Service for HotGigs.ai
Implements email resume ingestion, Google Drive integration, and bulk processing
"""
import os
import io
import json
import logging
import email
import imaplib
import smtplib
import base64
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timezone
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import zipfile
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import time

# Google Drive integration
try:
    from googleapiclient.discovery import build
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    import pickle
    GOOGLE_DRIVE_AVAILABLE = True
except ImportError:
    GOOGLE_DRIVE_AVAILABLE = False
    logging.warning("Google Drive integration not available. Install google-api-python-client to enable.")

from src.services.document_processing import document_processor
from src.services.workflow_automation import task_manager, TaskPriority

class EmailService:
    """Email service for resume ingestion and communication"""
    
    def __init__(self):
        self.imap_server = os.getenv('IMAP_SERVER', 'imap.gmail.com')
        self.imap_port = int(os.getenv('IMAP_PORT', '993'))
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.email_address = os.getenv('EMAIL_ADDRESS')
        self.email_password = os.getenv('EMAIL_PASSWORD')
        self.supported_attachments = ['.pdf', '.doc', '.docx', '.txt']
        
    def connect_imap(self) -> Optional[imaplib.IMAP4_SSL]:
        """Connect to IMAP server"""
        try:
            if not self.email_address or not self.email_password:
                logging.error("Email credentials not configured")
                return None
            
            mail = imaplib.IMAP4_SSL(self.imap_server, self.imap_port)
            mail.login(self.email_address, self.email_password)
            return mail
            
        except Exception as e:
            logging.error(f"IMAP connection error: {str(e)}")
            return None
    
    def fetch_resume_emails(self, folder: str = 'INBOX', 
                           subject_filter: str = 'resume') -> List[Dict[str, Any]]:
        """Fetch emails with resume attachments"""
        try:
            mail = self.connect_imap()
            if not mail:
                return []
            
            mail.select(folder)
            
            # Search for emails with subject containing filter
            search_criteria = f'(SUBJECT "{subject_filter}")'
            status, messages = mail.search(None, search_criteria)
            
            if status != 'OK':
                logging.error("Failed to search emails")
                return []
            
            email_ids = messages[0].split()
            resume_emails = []
            
            for email_id in email_ids[-50:]:  # Process last 50 emails
                try:
                    status, msg_data = mail.fetch(email_id, '(RFC822)')
                    if status != 'OK':
                        continue
                    
                    email_body = msg_data[0][1]
                    email_message = email.message_from_bytes(email_body)
                    
                    # Extract email metadata
                    email_info = {
                        'email_id': email_id.decode(),
                        'subject': email_message['Subject'],
                        'from': email_message['From'],
                        'date': email_message['Date'],
                        'attachments': [],
                        'body': ''
                    }
                    
                    # Extract body text
                    if email_message.is_multipart():
                        for part in email_message.walk():
                            if part.get_content_type() == "text/plain":
                                email_info['body'] = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                                break
                    else:
                        email_info['body'] = email_message.get_payload(decode=True).decode('utf-8', errors='ignore')
                    
                    # Extract attachments
                    attachments = self._extract_attachments(email_message)
                    email_info['attachments'] = attachments
                    
                    if attachments:  # Only include emails with attachments
                        resume_emails.append(email_info)
                
                except Exception as e:
                    logging.error(f"Error processing email {email_id}: {str(e)}")
                    continue
            
            mail.close()
            mail.logout()
            
            return resume_emails
            
        except Exception as e:
            logging.error(f"Error fetching resume emails: {str(e)}")
            return []
    
    def _extract_attachments(self, email_message) -> List[Dict[str, Any]]:
        """Extract attachments from email message"""
        attachments = []
        
        try:
            for part in email_message.walk():
                if part.get_content_disposition() == 'attachment':
                    filename = part.get_filename()
                    if filename:
                        # Check if it's a supported file type
                        file_ext = os.path.splitext(filename)[1].lower()
                        if file_ext in self.supported_attachments:
                            attachment_data = part.get_payload(decode=True)
                            
                            attachments.append({
                                'filename': filename,
                                'file_extension': file_ext,
                                'size_bytes': len(attachment_data),
                                'data': base64.b64encode(attachment_data).decode('utf-8')
                            })
        
        except Exception as e:
            logging.error(f"Error extracting attachments: {str(e)}")
        
        return attachments
    
    def process_resume_email(self, email_info: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single resume email"""
        try:
            results = {
                'email_id': email_info['email_id'],
                'processed_attachments': [],
                'errors': [],
                'candidate_data': {}
            }
            
            for attachment in email_info['attachments']:
                try:
                    # Decode attachment data
                    attachment_data = base64.b64decode(attachment['data'])
                    
                    # Process document
                    analysis = document_processor.process_document(
                        attachment_data,
                        'resume',
                        perform_ocr=True,
                        check_fraud=True
                    )
                    
                    # Extract candidate information
                    if analysis.extracted_data:
                        candidate_info = analysis.extracted_data.get('structured_data', {})
                        
                        # Merge with email information
                        if not candidate_info.get('email'):
                            candidate_info['email'] = self._extract_email_from_sender(email_info['from'])
                        
                        results['candidate_data'] = candidate_info
                    
                    results['processed_attachments'].append({
                        'filename': attachment['filename'],
                        'text_content': analysis.text_content[:500] + '...' if len(analysis.text_content) > 500 else analysis.text_content,
                        'confidence_score': analysis.confidence_score,
                        'fraud_indicators': analysis.fraud_indicators,
                        'domain_expertise': analysis.extracted_data.get('domain_expertise', [])
                    })
                
                except Exception as e:
                    results['errors'].append(f"Error processing {attachment['filename']}: {str(e)}")
            
            return results
            
        except Exception as e:
            logging.error(f"Error processing resume email: {str(e)}")
            return {
                'email_id': email_info.get('email_id', 'unknown'),
                'processed_attachments': [],
                'errors': [str(e)],
                'candidate_data': {}
            }
    
    def _extract_email_from_sender(self, sender: str) -> str:
        """Extract email address from sender field"""
        try:
            import re
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            matches = re.findall(email_pattern, sender)
            return matches[0] if matches else ''
        except:
            return ''
    
    def send_email(self, to_email: str, subject: str, body: str, 
                   attachments: Optional[List[Dict[str, Any]]] = None) -> bool:
        """Send email with optional attachments"""
        try:
            if not self.email_address or not self.email_password:
                logging.error("Email credentials not configured")
                return False
            
            msg = MIMEMultipart()
            msg['From'] = self.email_address
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Add attachments if provided
            if attachments:
                for attachment in attachments:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment['data'])
                    encoders.encode_base64(part)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {attachment["filename"]}'
                    )
                    msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_address, self.email_password)
            text = msg.as_string()
            server.sendmail(self.email_address, to_email, text)
            server.quit()
            
            return True
            
        except Exception as e:
            logging.error(f"Error sending email: {str(e)}")
            return False

class GoogleDriveService:
    """Google Drive integration for bulk resume import"""
    
    def __init__(self):
        self.scopes = ['https://www.googleapis.com/auth/drive.readonly']
        self.credentials = None
        self.service = None
        
    def authenticate(self, credentials_file: str = 'credentials.json', 
                    token_file: str = 'token.pickle') -> bool:
        """Authenticate with Google Drive API"""
        try:
            if not GOOGLE_DRIVE_AVAILABLE:
                logging.error("Google Drive integration not available")
                return False
            
            # Load existing token
            if os.path.exists(token_file):
                with open(token_file, 'rb') as token:
                    self.credentials = pickle.load(token)
            
            # If there are no valid credentials, get new ones
            if not self.credentials or not self.credentials.valid:
                if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                    self.credentials.refresh(Request())
                else:
                    if not os.path.exists(credentials_file):
                        logging.error(f"Credentials file {credentials_file} not found")
                        return False
                    
                    flow = InstalledAppFlow.from_client_secrets_file(
                        credentials_file, self.scopes)
                    self.credentials = flow.run_local_server(port=0)
                
                # Save credentials for next run
                with open(token_file, 'wb') as token:
                    pickle.dump(self.credentials, token)
            
            self.service = build('drive', 'v3', credentials=self.credentials)
            return True
            
        except Exception as e:
            logging.error(f"Google Drive authentication error: {str(e)}")
            return False
    
    def list_files_in_folder(self, folder_id: str, 
                           file_types: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """List files in a Google Drive folder"""
        try:
            if not self.service:
                logging.error("Google Drive service not authenticated")
                return []
            
            if not file_types:
                file_types = ['pdf', 'doc', 'docx', 'txt']
            
            # Build query for file types
            mime_types = []
            for file_type in file_types:
                if file_type == 'pdf':
                    mime_types.append("mimeType='application/pdf'")
                elif file_type == 'doc':
                    mime_types.append("mimeType='application/msword'")
                elif file_type == 'docx':
                    mime_types.append("mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'")
                elif file_type == 'txt':
                    mime_types.append("mimeType='text/plain'")
            
            query = f"'{folder_id}' in parents and ({' or '.join(mime_types)})"
            
            results = self.service.files().list(
                q=query,
                pageSize=1000,
                fields="nextPageToken, files(id, name, size, mimeType, modifiedTime)"
            ).execute()
            
            files = results.get('files', [])
            
            return files
            
        except Exception as e:
            logging.error(f"Error listing Google Drive files: {str(e)}")
            return []
    
    def download_file(self, file_id: str) -> Optional[bytes]:
        """Download file from Google Drive"""
        try:
            if not self.service:
                logging.error("Google Drive service not authenticated")
                return None
            
            request = self.service.files().get_media(fileId=file_id)
            file_data = request.execute()
            
            return file_data
            
        except Exception as e:
            logging.error(f"Error downloading file {file_id}: {str(e)}")
            return None
    
    def bulk_download_resumes(self, folder_id: str, 
                             max_files: int = 1000) -> List[Dict[str, Any]]:
        """Bulk download resumes from Google Drive folder"""
        try:
            files = self.list_files_in_folder(folder_id)
            
            if not files:
                logging.warning("No files found in folder")
                return []
            
            # Limit number of files
            files = files[:max_files]
            
            downloaded_files = []
            
            # Use ThreadPoolExecutor for parallel downloads
            with ThreadPoolExecutor(max_workers=5) as executor:
                future_to_file = {
                    executor.submit(self._download_and_process_file, file_info): file_info 
                    for file_info in files
                }
                
                for future in as_completed(future_to_file):
                    file_info = future_to_file[future]
                    try:
                        result = future.result()
                        if result:
                            downloaded_files.append(result)
                    except Exception as e:
                        logging.error(f"Error processing file {file_info['name']}: {str(e)}")
            
            return downloaded_files
            
        except Exception as e:
            logging.error(f"Error in bulk download: {str(e)}")
            return []
    
    def _download_and_process_file(self, file_info: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Download and process a single file"""
        try:
            file_data = self.download_file(file_info['id'])
            if not file_data:
                return None
            
            # Process the document
            analysis = document_processor.process_document(
                file_data,
                'resume',
                perform_ocr=True,
                check_fraud=False  # Skip fraud detection for bulk processing
            )
            
            return {
                'file_info': file_info,
                'analysis': {
                    'text_content': analysis.text_content[:500] + '...' if len(analysis.text_content) > 500 else analysis.text_content,
                    'confidence_score': analysis.confidence_score,
                    'extracted_data': analysis.extracted_data,
                    'processing_metadata': analysis.processing_metadata
                }
            }
            
        except Exception as e:
            logging.error(f"Error downloading and processing file: {str(e)}")
            return None

class BulkProcessingService:
    """Service for bulk processing operations"""
    
    def __init__(self):
        self.email_service = EmailService()
        self.drive_service = GoogleDriveService()
        self.max_concurrent_jobs = 10
        
    def process_email_resumes(self, folder: str = 'INBOX', 
                             subject_filter: str = 'resume') -> Dict[str, Any]:
        """Process resumes from email"""
        try:
            # Fetch resume emails
            resume_emails = self.email_service.fetch_resume_emails(folder, subject_filter)
            
            if not resume_emails:
                return {
                    'success': True,
                    'message': 'No resume emails found',
                    'processed_count': 0,
                    'results': []
                }
            
            # Process emails in parallel
            results = []
            with ThreadPoolExecutor(max_workers=self.max_concurrent_jobs) as executor:
                future_to_email = {
                    executor.submit(self.email_service.process_resume_email, email_info): email_info
                    for email_info in resume_emails
                }
                
                for future in as_completed(future_to_email):
                    email_info = future_to_email[future]
                    try:
                        result = future.result()
                        results.append(result)
                        
                        # Create task for manual review if needed
                        if result['errors']:
                            task_manager.create_task(
                                title=f"Review email processing errors",
                                description=f"Email {result['email_id']} had processing errors: {', '.join(result['errors'])}",
                                task_type="review",
                                priority=TaskPriority.MEDIUM,
                                created_by="bulk_processing"
                            )
                    
                    except Exception as e:
                        logging.error(f"Error processing email: {str(e)}")
                        results.append({
                            'email_id': email_info.get('email_id', 'unknown'),
                            'processed_attachments': [],
                            'errors': [str(e)],
                            'candidate_data': {}
                        })
            
            # Calculate statistics
            successful_count = len([r for r in results if not r['errors']])
            total_attachments = sum(len(r['processed_attachments']) for r in results)
            
            return {
                'success': True,
                'processed_count': len(results),
                'successful_count': successful_count,
                'total_attachments': total_attachments,
                'results': results
            }
            
        except Exception as e:
            logging.error(f"Error processing email resumes: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'processed_count': 0,
                'results': []
            }
    
    def process_google_drive_resumes(self, folder_id: str, 
                                   max_files: int = 1000) -> Dict[str, Any]:
        """Process resumes from Google Drive folder"""
        try:
            # Authenticate with Google Drive
            if not self.drive_service.authenticate():
                return {
                    'success': False,
                    'error': 'Failed to authenticate with Google Drive',
                    'processed_count': 0
                }
            
            # Bulk download and process resumes
            processed_files = self.drive_service.bulk_download_resumes(folder_id, max_files)
            
            if not processed_files:
                return {
                    'success': True,
                    'message': 'No files found or processed',
                    'processed_count': 0,
                    'results': []
                }
            
            # Extract candidate data from processed files
            candidates = []
            for file_result in processed_files:
                try:
                    extracted_data = file_result['analysis']['extracted_data']
                    if extracted_data and extracted_data.get('structured_data'):
                        candidate_data = extracted_data['structured_data']
                        candidate_data['source_file'] = file_result['file_info']['name']
                        candidate_data['drive_file_id'] = file_result['file_info']['id']
                        candidate_data['processing_confidence'] = file_result['analysis']['confidence_score']
                        candidate_data['domain_expertise'] = extracted_data.get('domain_expertise', [])
                        
                        candidates.append(candidate_data)
                
                except Exception as e:
                    logging.error(f"Error extracting candidate data: {str(e)}")
            
            # Create summary task
            task_manager.create_task(
                title=f"Review Google Drive bulk import",
                description=f"Processed {len(processed_files)} files from Google Drive, extracted {len(candidates)} candidate profiles",
                task_type="review",
                priority=TaskPriority.HIGH,
                created_by="bulk_processing"
            )
            
            return {
                'success': True,
                'processed_count': len(processed_files),
                'candidates_extracted': len(candidates),
                'folder_id': folder_id,
                'results': processed_files,
                'candidates': candidates
            }
            
        except Exception as e:
            logging.error(f"Error processing Google Drive resumes: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'processed_count': 0
            }
    
    def export_candidates_to_excel(self, candidates: List[Dict[str, Any]], 
                                  filename: str = None) -> str:
        """Export candidate data to Excel file"""
        try:
            if not filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"candidates_export_{timestamp}.xlsx"
            
            # Prepare data for Excel
            excel_data = []
            for candidate in candidates:
                row = {
                    'Name': candidate.get('name', ''),
                    'Email': candidate.get('email', ''),
                    'Phone': candidate.get('phone', ''),
                    'Location': candidate.get('location', ''),
                    'Summary': candidate.get('summary', ''),
                    'Skills': ', '.join(candidate.get('skills', [])),
                    'Experience_Years': len(candidate.get('work_experience', [])),
                    'Education': ', '.join([edu.get('degree', '') for edu in candidate.get('education', [])]),
                    'Domain_Expertise': ', '.join([domain.get('domain', '') for domain in candidate.get('domain_expertise', [])]),
                    'Source_File': candidate.get('source_file', ''),
                    'Processing_Confidence': candidate.get('processing_confidence', 0),
                    'Processed_Date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                excel_data.append(row)
            
            # Create DataFrame and save to Excel
            df = pd.DataFrame(excel_data)
            df.to_excel(filename, index=False)
            
            return filename
            
        except Exception as e:
            logging.error(f"Error exporting to Excel: {str(e)}")
            raise

# Global instances
email_service = EmailService()
google_drive_service = GoogleDriveService()
bulk_processing_service = BulkProcessingService()

