"""
Documents routes for HotGigs.ai
Handles document upload, management, and document-related operations
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
import re
import html
from datetime import datetime, timezone
from src.models.optimized_database import OptimizedSupabaseService

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

