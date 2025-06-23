"""
Jobs routes for HotGigs.ai
Handles job posting, management, and job-related operations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_required
from marshmallow import Schema, fields, ValidationError
from src.models.database import DatabaseService

jobs_bp = Blueprint('jobs', __name__)
db_service = DatabaseService()

@jobs_bp.route('/', methods=['GET'])
def get_public_jobs():
    """Get public job listings (no authentication required)"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        search = request.args.get('search', '')
        location = request.args.get('location', '')
        job_type = request.args.get('job_type', '')
        
        offset = (page - 1) * limit
        
        # Build filters
        filters = {'is_public': True, 'employment_status': 'open'}
        
        # Get jobs with company information
        query = db_service.supabase.table('jobs').select("""
            *,
            companies:company_id (
                id,
                name,
                logo_url,
                industry,
                company_size
            )
        """).eq('is_public', True).eq('employment_status', 'open')
        
        # Apply search filter
        if search:
            query = query.ilike('title', f'%{search}%')
        
        # Apply location filter
        if location:
            query = query.ilike('location', f'%{location}%')
        
        # Apply job type filter
        if job_type:
            query = query.eq('job_type', job_type)
        
        # Apply pagination and ordering
        query = query.order('created_at', desc=True).range(offset, offset + limit - 1)
        
        result = query.execute()
        jobs = result.data or []
        
        return jsonify({
            'jobs': jobs,
            'page': page,
            'limit': limit,
            'total': len(jobs)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get jobs', 'details': str(e)}), 500

@jobs_bp.route('/<job_id>', methods=['GET'])
def get_job_details(job_id):
    """Get job details (public endpoint)"""
    try:
        # Get job with company information
        result = db_service.supabase.table('jobs').select("""
            *,
            companies:company_id (
                id,
                name,
                logo_url,
                industry,
                company_size,
                description,
                website_url
            )
        """).eq('id', job_id).eq('is_public', True).execute()
        
        if not result.data:
            return jsonify({'error': 'Job not found'}), 404
        
        job = result.data[0]
        
        # Increment view count
        db_service.update_record('jobs', job_id, {
            'view_count': job.get('view_count', 0) + 1
        })
        
        return jsonify({
            'job': job
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get job details', 'details': str(e)}), 500

@jobs_bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    """Create a new job posting"""
    try:
        current_user_id = get_jwt_identity()
        
        # Basic validation - will be expanded in later phases
        data = request.json
        if not data or not data.get('title') or not data.get('company_id'):
            return jsonify({'error': 'Title and company_id are required'}), 400
        
        # Check if user has permission to post jobs for this company
        if not db_service.check_user_permission(current_user_id, data['company_id'], 'recruiter'):
            return jsonify({'error': 'Access denied'}), 403
        
        # Add posting user
        data['posted_by'] = current_user_id
        
        # Generate slug
        import re
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', data['title'].lower()).strip('-')
        data['slug'] = slug
        
        job = db_service.create_record('jobs', data)
        
        return jsonify({
            'message': 'Job created successfully',
            'job': job
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to create job', 'details': str(e)}), 500

