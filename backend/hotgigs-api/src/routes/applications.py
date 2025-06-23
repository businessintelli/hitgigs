"""
Applications routes for HotGigs.ai
Handles job applications and application tracking
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.database import DatabaseService

applications_bp = Blueprint('applications', __name__)
db_service = DatabaseService()

@applications_bp.route('/', methods=['POST'])
@jwt_required()
def apply_to_job():
    """Apply to a job"""
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        
        if not data or not data.get('job_id'):
            return jsonify({'error': 'job_id is required'}), 400
        
        # Get candidate profile
        candidate_result = db_service.supabase.table('candidate_profiles').select('id').eq('user_id', current_user_id).execute()
        if not candidate_result.data:
            return jsonify({'error': 'Candidate profile not found'}), 400
        
        candidate_id = candidate_result.data[0]['id']
        
        # Check if already applied
        existing_application = db_service.supabase.table('applications').select('id').eq('job_id', data['job_id']).eq('candidate_id', candidate_id).execute()
        if existing_application.data:
            return jsonify({'error': 'Already applied to this job'}), 400
        
        application_data = {
            'job_id': data['job_id'],
            'candidate_id': candidate_id,
            'cover_letter': data.get('cover_letter'),
            'resume_url': data.get('resume_url'),
            'status': 'applied'
        }
        
        application = db_service.create_record('applications', application_data)
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to submit application', 'details': str(e)}), 500

@applications_bp.route('/', methods=['GET'])
@jwt_required()
def get_applications():
    """Get applications for current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get candidate applications
        candidate_result = db_service.supabase.table('candidate_profiles').select('id').eq('user_id', current_user_id).execute()
        if candidate_result.data:
            candidate_id = candidate_result.data[0]['id']
            applications_result = db_service.supabase.table('applications').select("""
                *,
                jobs:job_id (
                    id,
                    title,
                    company_id,
                    companies:company_id (name, logo_url)
                )
            """).eq('candidate_id', candidate_id).order('applied_at', desc=True).execute()
            
            return jsonify({
                'applications': applications_result.data or []
            }), 200
        
        return jsonify({'applications': []}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get applications', 'details': str(e)}), 500

