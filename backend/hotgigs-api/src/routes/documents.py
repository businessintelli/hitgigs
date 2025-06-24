"""
Documents routes for HotGigs.ai
Handles document upload, management, and document-related operations
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
import re
import html
import base64
from datetime import datetime, timezone
from src.models.optimized_database import OptimizedSupabaseService
from src.services.document_processing import document_processor

documents_bp = Blueprint('documents', __name__)
db_service = OptimizedSupabaseService()

# Document validation schemas
class DocumentUploadSchema(Schema):
    document_type = fields.Str(required=True, validate=lambda x: x in ['resume', 'cover_letter', 'portfolio', 'certificate', 'reference', 'other'])
    title = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 3)
    description = fields.Str(allow_none=True)
    file_url = fields.Str(required=True)
    file_size = fields.Int(allow_none=True)
    file_format = fields.Str(allow_none=True)

def sanitize_input(text):
    """Sanitize user input to prevent XSS attacks"""
    if not text:
        return text
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', str(text))
    
    # Escape special characters
    text = html.escape(text)
    
    return text.strip()

@documents_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for documents service"""
    try:
        return jsonify({
            'status': 'healthy',
            'service': 'documents',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'documents',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@documents_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_documents():
    """Get all documents for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user documents
        documents = db_service.get_records_optimized(
            'documents',
            {'user_id': current_user_id},
            order_by='created_at',
            ascending=False
        )
        
        return jsonify({
            'documents': documents,
            'total': len(documents),
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting user documents: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve documents',
            'message': 'An error occurred while fetching your documents',
            'status': 'error'
        }), 500

@documents_bp.route('/', methods=['POST'])
@jwt_required()
def upload_document():
    """Upload a new document"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = DocumentUploadSchema()
        try:
            document_data = schema.load(request.json)
        except ValidationError as e:
            return jsonify({
                'error': 'Validation failed',
                'details': e.messages,
                'status': 'error'
            }), 400
        
        # Sanitize input data
        document_data['title'] = sanitize_input(document_data['title'])
        if document_data.get('description'):
            document_data['description'] = sanitize_input(document_data['description'])
        
        # Add metadata
        document_data.update({
            'user_id': current_user_id,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat()
        })
        
        # Create the document record
        document = db_service.create_record('documents', document_data)
        
        if not document:
            return jsonify({
                'error': 'Failed to upload document',
                'status': 'error'
            }), 500
        
        return jsonify({
            'document': document,
            'message': 'Document uploaded successfully',
            'status': 'success'
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error uploading document: {str(e)}")
        return jsonify({
            'error': 'Failed to upload document',
            'message': 'An error occurred while uploading your document',
            'status': 'error'
        }), 500

@documents_bp.route('/<document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
    """Get a specific document by ID"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get document
        document = db_service.get_record_by_id('documents', document_id)
        
        if not document:
            return jsonify({
                'error': 'Document not found',
                'status': 'error'
            }), 404
        
        # Check if user owns the document
        if document['user_id'] != current_user_id:
            return jsonify({
                'error': 'Access denied',
                'message': 'You do not have permission to access this document',
                'status': 'error'
            }), 403
        
        return jsonify({
            'document': document,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting document: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve document',
            'status': 'error'
        }), 500

@documents_bp.route('/<document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    """Delete a document"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get document to check ownership
        document = db_service.get_record_by_id('documents', document_id)
        
        if not document:
            return jsonify({
                'error': 'Document not found',
                'status': 'error'
            }), 404
        
        # Check if user owns the document
        if document['user_id'] != current_user_id:
            return jsonify({
                'error': 'Access denied',
                'message': 'You do not have permission to delete this document',
                'status': 'error'
            }), 403
        
        # Delete the document
        db_service.delete_record('documents', document_id)
        
        return jsonify({
            'message': 'Document deleted successfully',
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting document: {str(e)}")
        return jsonify({
            'error': 'Failed to delete document',
            'status': 'error'
        }), 500

@documents_bp.route('/types', methods=['GET'])
def get_document_types():
    """Get available document types"""
    try:
        document_types = [
            {'value': 'resume', 'label': 'Resume/CV'},
            {'value': 'cover_letter', 'label': 'Cover Letter'},
            {'value': 'portfolio', 'label': 'Portfolio'},
            {'value': 'certificate', 'label': 'Certificate'},
            {'value': 'reference', 'label': 'Reference Letter'},
            {'value': 'other', 'label': 'Other'}
        ]
        
        return jsonify({
            'document_types': document_types,
            'status': 'success'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get document types',
            'status': 'error'
        }), 500

# Error handlers
@documents_bp.errorhandler(ValidationError)
def handle_validation_error(e):
    return jsonify({
        'error': 'Validation failed',
        'details': e.messages,
        'status': 'error'
    }), 400

@documents_bp.errorhandler(Exception)
def handle_general_error(e):
    current_app.logger.error(f"Unhandled error in documents route: {str(e)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred',
        'status': 'error'
    }), 500


# Advanced document processing schemas
class DocumentProcessingSchema(Schema):
    document_data = fields.Str(required=True)  # Base64 encoded document
    document_type = fields.Str(required=True, validate=lambda x: x in ['pdf', 'image', 'resume', 'cv', 'license', 'certificate'])
    perform_ocr = fields.Bool(load_default=True)
    check_fraud = fields.Bool(load_default=True)
    extract_data = fields.Bool(load_default=True)

class OCRSchema(Schema):
    document_data = fields.Str(required=True)  # Base64 encoded
    document_type = fields.Str(required=True)
    enhance_image = fields.Bool(load_default=True)

class FraudDetectionSchema(Schema):
    document_data = fields.Str(required=True)  # Base64 encoded
    document_type = fields.Str(required=True, validate=lambda x: x in ['license', 'passport', 'certificate', 'resume', 'other'])

@documents_bp.route('/process', methods=['POST'])
@jwt_required()
def process_document():
    """Process document with OCR, fraud detection, and data extraction"""
    try:
        schema = DocumentProcessingSchema()
        data = schema.load(request.get_json())
        
        # Decode base64 document data
        try:
            document_bytes = base64.b64decode(data['document_data'])
        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Invalid base64 document data'
            }), 400
        
        # Process document
        analysis = document_processor.process_document(
            document_bytes,
            data['document_type'],
            data['perform_ocr'],
            data['check_fraud']
        )
        
        # Prepare response
        response_data = {
            'text_content': analysis.text_content,
            'confidence_score': analysis.confidence_score,
            'document_type': analysis.document_type,
            'fraud_indicators': analysis.fraud_indicators,
            'extracted_data': analysis.extracted_data,
            'processing_metadata': analysis.processing_metadata,
            'is_authentic': len(analysis.fraud_indicators) == 0,
            'processing_successful': True
        }
        
        # Store processing results if user wants to save
        user_id = get_jwt_identity()
        if data.get('save_results', False):
            # Save to database (implementation would depend on your schema)
            pass
        
        return jsonify({
            'success': True,
            'data': response_data
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Document processing error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Document processing failed'
        }), 500

@documents_bp.route('/ocr', methods=['POST'])
@jwt_required()
def extract_text_ocr():
    """Extract text from document using OCR"""
    try:
        schema = OCRSchema()
        data = schema.load(request.get_json())
        
        # Decode document data
        try:
            document_bytes = base64.b64decode(data['document_data'])
        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Invalid base64 document data'
            }), 400
        
        # Perform OCR
        if data['document_type'].lower() == 'pdf':
            text, confidence = document_processor.ocr_service.extract_text_from_pdf(document_bytes)
        else:
            text, confidence = document_processor.ocr_service.extract_text_from_image(
                document_bytes, 
                data['enhance_image']
            )
        
        return jsonify({
            'success': True,
            'data': {
                'extracted_text': text,
                'confidence_score': confidence,
                'text_length': len(text),
                'document_type': data['document_type']
            }
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"OCR error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'OCR processing failed'
        }), 500

@documents_bp.route('/fraud-check', methods=['POST'])
@jwt_required()
def check_document_fraud():
    """Check document for signs of fraud or tampering"""
    try:
        schema = FraudDetectionSchema()
        data = schema.load(request.get_json())
        
        # Decode document data
        try:
            document_bytes = base64.b64decode(data['document_data'])
        except Exception as e:
            return jsonify({
                'success': False,
                'error': 'Invalid base64 document data'
            }), 400
        
        # Perform fraud detection
        fraud_analysis = document_processor.fraud_detector.analyze_document_authenticity(
            document_bytes,
            data['document_type']
        )
        
        return jsonify({
            'success': True,
            'data': fraud_analysis
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Fraud detection error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Fraud detection failed'
        }), 500

@documents_bp.route('/parse-resume', methods=['POST'])
@jwt_required()
def parse_resume():
    """Parse resume and extract structured information"""
    try:
        data = request.get_json()
        resume_text = data.get('resume_text', '')
        
        if not resume_text:
            # If no text provided, try to extract from document
            document_data = data.get('document_data', '')
            if document_data:
                try:
                    document_bytes = base64.b64decode(document_data)
                    document_type = data.get('document_type', 'pdf')
                    
                    if document_type.lower() == 'pdf':
                        resume_text, _ = document_processor.ocr_service.extract_text_from_pdf(document_bytes)
                    else:
                        resume_text, _ = document_processor.ocr_service.extract_text_from_image(document_bytes)
                except Exception as e:
                    return jsonify({
                        'success': False,
                        'error': 'Failed to extract text from document'
                    }), 400
        
        if not resume_text or len(resume_text.strip()) < 50:
            return jsonify({
                'success': False,
                'error': 'Resume text is too short or empty'
            }), 400
        
        # Parse resume
        parsed_data = document_processor.resume_parser.parse_resume(resume_text)
        
        return jsonify({
            'success': True,
            'data': parsed_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Resume parsing error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Resume parsing failed'
        }), 500

@documents_bp.route('/domain-analysis', methods=['POST'])
@jwt_required()
def analyze_domain_expertise():
    """Analyze domain expertise from resume or text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Text is required for domain analysis'
            }), 400
        
        # Analyze domain expertise
        domain_expertise = document_processor.resume_parser._identify_domain_knowledge(text)
        
        return jsonify({
            'success': True,
            'data': {
                'domain_expertise': domain_expertise,
                'total_domains_identified': len(domain_expertise),
                'text_length': len(text)
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Domain analysis error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Domain analysis failed'
        }), 500

@documents_bp.route('/batch-process', methods=['POST'])
@jwt_required()
def batch_process_documents():
    """Process multiple documents in batch"""
    try:
        data = request.get_json()
        documents = data.get('documents', [])
        
        if not documents or len(documents) > 10:  # Limit batch size
            return jsonify({
                'success': False,
                'error': 'Invalid batch size (1-10 documents allowed)'
            }), 400
        
        results = []
        
        for i, doc in enumerate(documents):
            try:
                # Decode document
                document_bytes = base64.b64decode(doc.get('document_data', ''))
                document_type = doc.get('document_type', 'pdf')
                
                # Process document
                analysis = document_processor.process_document(
                    document_bytes,
                    document_type,
                    doc.get('perform_ocr', True),
                    doc.get('check_fraud', True)
                )
                
                results.append({
                    'index': i,
                    'success': True,
                    'text_content': analysis.text_content[:500] + '...' if len(analysis.text_content) > 500 else analysis.text_content,
                    'confidence_score': analysis.confidence_score,
                    'fraud_indicators': analysis.fraud_indicators,
                    'extracted_data': analysis.extracted_data,
                    'is_authentic': len(analysis.fraud_indicators) == 0
                })
                
            except Exception as e:
                results.append({
                    'index': i,
                    'success': False,
                    'error': str(e)
                })
        
        # Calculate batch statistics
        successful_count = sum(1 for r in results if r.get('success', False))
        
        return jsonify({
            'success': True,
            'data': {
                'results': results,
                'total_documents': len(documents),
                'successful_count': successful_count,
                'failed_count': len(documents) - successful_count,
                'success_rate': successful_count / len(documents) if documents else 0
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Batch processing error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Batch processing failed'
        }), 500

@documents_bp.route('/supported-formats', methods=['GET'])
def get_supported_formats():
    """Get list of supported document formats"""
    return jsonify({
        'success': True,
        'data': {
            'supported_formats': document_processor.ocr_service.supported_formats,
            'document_types': ['pdf', 'image', 'resume', 'cv', 'license', 'certificate', 'passport'],
            'max_file_size_mb': 10,
            'batch_limit': 10
        }
    }), 200

