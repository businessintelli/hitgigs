"""
Advanced Document Processing Service for HotGigs.ai
Implements OCR, fraud detection, and automated document processing
"""
import os
import io
import json
import hashlib
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timezone
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import cv2
import numpy as np
from pdf2image import convert_from_bytes
import openai
import re
from dataclasses import dataclass

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@dataclass
class DocumentAnalysis:
    """Data class for document analysis results"""
    text_content: str
    confidence_score: float
    document_type: str
    fraud_indicators: List[str]
    extracted_data: Dict[str, Any]
    processing_metadata: Dict[str, Any]

class OCRService:
    """Optical Character Recognition service for document text extraction"""
    
    def __init__(self):
        self.supported_formats = ['.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp']
        
    def extract_text_from_image(self, image_data: bytes, enhance: bool = True) -> Tuple[str, float]:
        """Extract text from image using OCR"""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Enhance image for better OCR if requested
            if enhance:
                image = self._enhance_image_for_ocr(image)
            
            # Perform OCR
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(image, config=custom_config)
            
            # Get confidence score
            data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
            confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            return text.strip(), avg_confidence / 100.0
            
        except Exception as e:
            logging.error(f"OCR extraction error: {str(e)}")
            return "", 0.0
    
    def extract_text_from_pdf(self, pdf_data: bytes) -> Tuple[str, float]:
        """Extract text from PDF document"""
        try:
            # Convert PDF to images
            images = convert_from_bytes(pdf_data, dpi=300)
            
            all_text = []
            all_confidences = []
            
            for image in images:
                # Convert PIL image to bytes for processing
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format='PNG')
                img_bytes = img_byte_arr.getvalue()
                
                text, confidence = self.extract_text_from_image(img_bytes)
                if text:
                    all_text.append(text)
                    all_confidences.append(confidence)
            
            combined_text = '\n\n'.join(all_text)
            avg_confidence = sum(all_confidences) / len(all_confidences) if all_confidences else 0
            
            return combined_text, avg_confidence
            
        except Exception as e:
            logging.error(f"PDF OCR extraction error: {str(e)}")
            return "", 0.0
    
    def _enhance_image_for_ocr(self, image: Image.Image) -> Image.Image:
        """Enhance image quality for better OCR results"""
        try:
            # Convert to grayscale
            if image.mode != 'L':
                image = image.convert('L')
            
            # Enhance contrast
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(2.0)
            
            # Enhance sharpness
            enhancer = ImageEnhance.Sharpness(image)
            image = enhancer.enhance(2.0)
            
            # Apply noise reduction
            image = image.filter(ImageFilter.MedianFilter(size=3))
            
            return image
            
        except Exception as e:
            logging.error(f"Image enhancement error: {str(e)}")
            return image

class DocumentFraudDetector:
    """Service for detecting document tampering and fraud"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
    def analyze_document_authenticity(self, document_data: bytes, document_type: str) -> Dict[str, Any]:
        """Analyze document for signs of tampering or fraud"""
        try:
            fraud_indicators = []
            confidence_score = 1.0
            
            # Perform various fraud detection checks
            metadata_analysis = self._analyze_metadata(document_data)
            visual_analysis = self._analyze_visual_inconsistencies(document_data)
            text_analysis = self._analyze_text_patterns(document_data, document_type)
            
            # Combine all analyses
            fraud_indicators.extend(metadata_analysis.get('indicators', []))
            fraud_indicators.extend(visual_analysis.get('indicators', []))
            fraud_indicators.extend(text_analysis.get('indicators', []))
            
            # Calculate overall confidence score
            if fraud_indicators:
                confidence_score = max(0.0, 1.0 - (len(fraud_indicators) * 0.2))
            
            return {
                'is_authentic': len(fraud_indicators) == 0,
                'confidence_score': confidence_score,
                'fraud_indicators': fraud_indicators,
                'metadata_analysis': metadata_analysis,
                'visual_analysis': visual_analysis,
                'text_analysis': text_analysis,
                'risk_level': self._calculate_risk_level(fraud_indicators)
            }
            
        except Exception as e:
            logging.error(f"Fraud detection error: {str(e)}")
            return {
                'is_authentic': False,
                'confidence_score': 0.0,
                'fraud_indicators': ['Analysis failed'],
                'risk_level': 'high'
            }
    
    def _analyze_metadata(self, document_data: bytes) -> Dict[str, Any]:
        """Analyze document metadata for inconsistencies"""
        indicators = []
        
        try:
            # Check file size patterns
            file_size = len(document_data)
            if file_size < 1000:  # Suspiciously small
                indicators.append("Unusually small file size")
            
            # Check for common metadata tampering signs
            # This is a simplified check - real implementation would be more sophisticated
            data_hash = hashlib.md5(document_data).hexdigest()
            
            return {
                'indicators': indicators,
                'file_size': file_size,
                'hash': data_hash
            }
            
        except Exception as e:
            logging.error(f"Metadata analysis error: {str(e)}")
            return {'indicators': ['Metadata analysis failed']}
    
    def _analyze_visual_inconsistencies(self, document_data: bytes) -> Dict[str, Any]:
        """Analyze visual elements for signs of tampering"""
        indicators = []
        
        try:
            # Convert to image for analysis
            image = Image.open(io.BytesIO(document_data))
            
            # Convert to numpy array for OpenCV processing
            img_array = np.array(image)
            
            # Check for inconsistent fonts/text (simplified)
            # Real implementation would use more sophisticated computer vision
            
            # Check image quality consistency
            if len(img_array.shape) == 3:
                # Check for unusual color patterns that might indicate editing
                color_variance = np.var(img_array, axis=(0, 1))
                if np.max(color_variance) > 10000:  # Threshold for suspicious variance
                    indicators.append("Inconsistent color patterns detected")
            
            return {
                'indicators': indicators,
                'image_dimensions': image.size,
                'color_analysis': 'completed'
            }
            
        except Exception as e:
            logging.error(f"Visual analysis error: {str(e)}")
            return {'indicators': ['Visual analysis failed']}
    
    def _analyze_text_patterns(self, document_data: bytes, document_type: str) -> Dict[str, Any]:
        """Analyze text patterns for inconsistencies"""
        indicators = []
        
        try:
            # Extract text using OCR
            ocr_service = OCRService()
            text, confidence = ocr_service.extract_text_from_image(document_data)
            
            if confidence < 0.5:
                indicators.append("Low OCR confidence - possible image quality issues")
            
            # Check for common fraud patterns using AI
            if text and len(text) > 50:
                ai_analysis = self._ai_text_analysis(text, document_type)
                indicators.extend(ai_analysis.get('fraud_indicators', []))
            
            return {
                'indicators': indicators,
                'text_length': len(text),
                'ocr_confidence': confidence
            }
            
        except Exception as e:
            logging.error(f"Text pattern analysis error: {str(e)}")
            return {'indicators': ['Text analysis failed']}
    
    def _ai_text_analysis(self, text: str, document_type: str) -> Dict[str, Any]:
        """Use AI to analyze text for fraud indicators"""
        try:
            prompt = f"""
            Analyze the following {document_type} text for potential signs of fraud or tampering:
            
            Text: {text[:1000]}...
            
            Look for:
            1. Inconsistent formatting or fonts
            2. Unusual date patterns
            3. Inconsistent personal information
            4. Signs of text replacement or editing
            5. Unrealistic or suspicious content
            
            Return a JSON response with:
            - fraud_indicators: list of specific issues found
            - authenticity_score: 0-1 score
            - concerns: list of areas requiring manual review
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a document fraud detection expert."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.1
            )
            
            analysis_text = response.choices[0].message.content
            
            try:
                analysis = json.loads(analysis_text)
            except:
                # Fallback if JSON parsing fails
                analysis = {
                    'fraud_indicators': [],
                    'authenticity_score': 0.8,
                    'concerns': ['AI analysis completed but format unclear']
                }
            
            return analysis
            
        except Exception as e:
            logging.error(f"AI text analysis error: {str(e)}")
            return {
                'fraud_indicators': [],
                'authenticity_score': 0.5,
                'concerns': ['AI analysis failed']
            }
    
    def _calculate_risk_level(self, fraud_indicators: List[str]) -> str:
        """Calculate overall risk level based on fraud indicators"""
        if not fraud_indicators:
            return 'low'
        elif len(fraud_indicators) <= 2:
            return 'medium'
        else:
            return 'high'

class ResumeParser:
    """Advanced resume parsing with domain knowledge identification"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.domain_keywords = {
            'automobile': ['automotive', 'car', 'vehicle', 'ford', 'gm', 'toyota', 'honda', 'bmw'],
            'ecommerce': ['amazon', 'ebay', 'shopify', 'ecommerce', 'online retail', 'marketplace'],
            'government': ['government', 'federal', 'state', 'municipal', 'public sector', 'dod'],
            'defense': ['defense', 'military', 'army', 'navy', 'air force', 'pentagon', 'lockheed'],
            'healthcare': ['hospital', 'medical', 'healthcare', 'pharma', 'clinic', 'patient'],
            'banking': ['bank', 'financial', 'credit', 'loan', 'mortgage', 'jpmorgan', 'wells fargo'],
            'finance': ['investment', 'trading', 'portfolio', 'hedge fund', 'private equity', 'goldman'],
            'technology': ['software', 'tech', 'programming', 'development', 'google', 'microsoft'],
            'consulting': ['consulting', 'advisory', 'mckinsey', 'deloitte', 'accenture', 'pwc']
        }
    
    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        """Parse resume and extract structured information"""
        try:
            # Use AI to extract structured data
            structured_data = self._ai_resume_parsing(resume_text)
            
            # Identify domain knowledge
            domain_expertise = self._identify_domain_knowledge(resume_text)
            
            # Extract skills and experience
            skills = self._extract_skills(resume_text)
            experience = self._extract_experience(resume_text)
            education = self._extract_education(resume_text)
            
            return {
                'structured_data': structured_data,
                'domain_expertise': domain_expertise,
                'skills': skills,
                'experience': experience,
                'education': education,
                'parsing_confidence': self._calculate_parsing_confidence(structured_data)
            }
            
        except Exception as e:
            logging.error(f"Resume parsing error: {str(e)}")
            return {
                'structured_data': {},
                'domain_expertise': [],
                'skills': [],
                'experience': [],
                'education': [],
                'parsing_confidence': 0.0
            }
    
    def _ai_resume_parsing(self, resume_text: str) -> Dict[str, Any]:
        """Use AI to parse resume into structured format"""
        try:
            prompt = f"""
            Parse the following resume text and extract structured information:
            
            Resume: {resume_text[:2000]}...
            
            Extract and return JSON with:
            - name: candidate name
            - email: email address
            - phone: phone number
            - location: current location
            - summary: professional summary
            - work_experience: list of jobs with company, title, dates, description
            - education: list of degrees with school, degree, year
            - skills: list of technical and soft skills
            - certifications: list of certifications
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert resume parser. Extract accurate structured data."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.1
            )
            
            parsed_text = response.choices[0].message.content
            
            try:
                parsed_data = json.loads(parsed_text)
            except:
                # Fallback parsing
                parsed_data = self._fallback_parsing(resume_text)
            
            return parsed_data
            
        except Exception as e:
            logging.error(f"AI resume parsing error: {str(e)}")
            return self._fallback_parsing(resume_text)
    
    def _identify_domain_knowledge(self, resume_text: str) -> List[Dict[str, Any]]:
        """Identify domain expertise based on company names and experience"""
        domain_expertise = []
        text_lower = resume_text.lower()
        
        for domain, keywords in self.domain_keywords.items():
            matches = []
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    matches.append(keyword)
            
            if matches:
                # Calculate confidence based on number of matches
                confidence = min(1.0, len(matches) / 3.0)
                domain_expertise.append({
                    'domain': domain,
                    'confidence': confidence,
                    'evidence': matches[:5]  # Top 5 matches
                })
        
        # Sort by confidence
        domain_expertise.sort(key=lambda x: x['confidence'], reverse=True)
        
        return domain_expertise[:3]  # Top 3 domains
    
    def _extract_skills(self, resume_text: str) -> List[str]:
        """Extract skills from resume text"""
        # Common skill patterns
        skill_patterns = [
            r'(?i)skills?[:\s]*([^\n]+)',
            r'(?i)technologies?[:\s]*([^\n]+)',
            r'(?i)programming languages?[:\s]*([^\n]+)',
            r'(?i)tools?[:\s]*([^\n]+)'
        ]
        
        skills = set()
        for pattern in skill_patterns:
            matches = re.findall(pattern, resume_text)
            for match in matches:
                # Split by common delimiters
                skill_list = re.split(r'[,;|•\n]', match)
                for skill in skill_list:
                    skill = skill.strip()
                    if skill and len(skill) > 2:
                        skills.add(skill)
        
        return list(skills)[:20]  # Limit to top 20 skills
    
    def _extract_experience(self, resume_text: str) -> List[Dict[str, str]]:
        """Extract work experience from resume"""
        # This is a simplified extraction - real implementation would be more sophisticated
        experience = []
        
        # Look for common experience patterns
        exp_patterns = [
            r'(?i)(\d{4})\s*[-–]\s*(\d{4}|\w+)\s*[:\s]*([^\n]+)',
            r'(?i)(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|\w+)\s*[:\s]*([^\n]+)'
        ]
        
        for pattern in exp_patterns:
            matches = re.findall(pattern, resume_text)
            for match in matches:
                if len(match) >= 3:
                    experience.append({
                        'start_date': match[0],
                        'end_date': match[1],
                        'description': match[2].strip()
                    })
        
        return experience[:10]  # Limit to 10 entries
    
    def _extract_education(self, resume_text: str) -> List[Dict[str, str]]:
        """Extract education information from resume"""
        education = []
        
        # Look for degree patterns
        degree_patterns = [
            r'(?i)(bachelor|master|phd|doctorate|associate)[^\n]*(\d{4})',
            r'(?i)(b\.?s\.?|m\.?s\.?|m\.?b\.?a\.?|ph\.?d\.?)[^\n]*(\d{4})',
            r'(?i)university|college[^\n]*(\d{4})'
        ]
        
        for pattern in degree_patterns:
            matches = re.findall(pattern, resume_text)
            for match in matches:
                if isinstance(match, tuple) and len(match) >= 2:
                    education.append({
                        'degree': match[0] if len(match) > 1 else 'Degree',
                        'year': match[-1],
                        'institution': 'Not specified'
                    })
        
        return education[:5]  # Limit to 5 entries
    
    def _fallback_parsing(self, resume_text: str) -> Dict[str, Any]:
        """Fallback parsing when AI parsing fails"""
        return {
            'name': 'Not extracted',
            'email': self._extract_email(resume_text),
            'phone': self._extract_phone(resume_text),
            'location': 'Not specified',
            'summary': resume_text[:200] + '...' if len(resume_text) > 200 else resume_text,
            'work_experience': [],
            'education': [],
            'skills': [],
            'certifications': []
        }
    
    def _extract_email(self, text: str) -> str:
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else 'Not found'
    
    def _extract_phone(self, text: str) -> str:
        """Extract phone number from text"""
        phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        matches = re.findall(phone_pattern, text)
        return ''.join(matches[0]) if matches else 'Not found'
    
    def _calculate_parsing_confidence(self, structured_data: Dict[str, Any]) -> float:
        """Calculate confidence score for parsing results"""
        score = 0.0
        total_fields = 8
        
        if structured_data.get('name') and structured_data['name'] != 'Not extracted':
            score += 1
        if structured_data.get('email') and '@' in structured_data['email']:
            score += 1
        if structured_data.get('phone') and structured_data['phone'] != 'Not found':
            score += 1
        if structured_data.get('summary'):
            score += 1
        if structured_data.get('work_experience'):
            score += 1
        if structured_data.get('education'):
            score += 1
        if structured_data.get('skills'):
            score += 1
        if structured_data.get('certifications'):
            score += 1
        
        return score / total_fields

class DocumentProcessor:
    """Main document processing service that orchestrates all components"""
    
    def __init__(self):
        self.ocr_service = OCRService()
        self.fraud_detector = DocumentFraudDetector()
        self.resume_parser = ResumeParser()
    
    def process_document(self, document_data: bytes, document_type: str, 
                        perform_ocr: bool = True, check_fraud: bool = True) -> DocumentAnalysis:
        """Process document with OCR, fraud detection, and parsing"""
        try:
            processing_start = datetime.now(timezone.utc)
            
            # Initialize results
            text_content = ""
            confidence_score = 0.0
            fraud_indicators = []
            extracted_data = {}
            
            # Perform OCR if requested
            if perform_ocr:
                if document_type.lower() == 'pdf':
                    text_content, confidence_score = self.ocr_service.extract_text_from_pdf(document_data)
                else:
                    text_content, confidence_score = self.ocr_service.extract_text_from_image(document_data)
            
            # Perform fraud detection if requested
            fraud_analysis = {}
            if check_fraud:
                fraud_analysis = self.fraud_detector.analyze_document_authenticity(
                    document_data, document_type
                )
                fraud_indicators = fraud_analysis.get('fraud_indicators', [])
            
            # Parse resume if it's a resume document
            if document_type.lower() in ['resume', 'cv'] and text_content:
                extracted_data = self.resume_parser.parse_resume(text_content)
            
            # Calculate processing time
            processing_end = datetime.now(timezone.utc)
            processing_time = (processing_end - processing_start).total_seconds()
            
            # Create processing metadata
            processing_metadata = {
                'processing_time_seconds': processing_time,
                'ocr_performed': perform_ocr,
                'fraud_check_performed': check_fraud,
                'document_size_bytes': len(document_data),
                'processed_at': processing_end.isoformat(),
                'fraud_analysis': fraud_analysis
            }
            
            return DocumentAnalysis(
                text_content=text_content,
                confidence_score=confidence_score,
                document_type=document_type,
                fraud_indicators=fraud_indicators,
                extracted_data=extracted_data,
                processing_metadata=processing_metadata
            )
            
        except Exception as e:
            logging.error(f"Document processing error: {str(e)}")
            return DocumentAnalysis(
                text_content="",
                confidence_score=0.0,
                document_type=document_type,
                fraud_indicators=[f"Processing error: {str(e)}"],
                extracted_data={},
                processing_metadata={'error': str(e)}
            )

# Global instance
document_processor = DocumentProcessor()

