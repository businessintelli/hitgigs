"""
Jobs routes for HotGigs.ai
Handles job posting, management, and job-related operations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timedelta
import re
from src.models.database import DatabaseService

jobs_bp = Blueprint('jobs', __name__)
db_service = DatabaseService()

# Job validation schemas
class JobCreateSchema(Schema):
    title = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 3)
    company_id = fields.UUID(required=True)
    description = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 50)
    requirements = fields.Str(required=True)
    location = fields.Str(required=True)
    employment_type = fields.Str(required=True, validate=lambda x: x in ['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    experience_level = fields.Str(required=True, validate=lambda x: x in ['entry', 'mid', 'senior', 'executive'])
    salary_min = fields.Int(allow_none=True)
    salary_max = fields.Int(allow_none=True)
    currency = fields.Str(load_default='USD')
    remote_work_allowed = fields.Bool(load_default=False)
    department = fields.Str(allow_none=True)
    skills_required = fields.List(fields.Str(), load_default=[])
    benefits = fields.List(fields.Str(), load_default=[])
    application_deadline = fields.DateTime(allow_none=True)
    is_featured = fields.Bool(load_default=False)

class JobUpdateSchema(Schema):
    title = fields.Str(validate=lambda x: len(x.strip()) >= 3)
    description = fields.Str(validate=lambda x: len(x.strip()) >= 50)
    requirements = fields.Str()
    location = fields.Str()
    employment_type = fields.Str(validate=lambda x: x in ['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    experience_level = fields.Str(validate=lambda x: x in ['entry', 'mid', 'senior', 'executive'])
    salary_min = fields.Int(allow_none=True)
    salary_max = fields.Int(allow_none=True)
    remote_work_allowed = fields.Bool()
    department = fields.Str(allow_none=True)
    skills_required = fields.List(fields.Str())
    benefits = fields.List(fields.Str())
    application_deadline = fields.DateTime(allow_none=True)
    status = fields.Str(validate=lambda x: x in ['draft', 'active', 'paused', 'closed', 'expired'])
    is_featured = fields.Bool()

@jobs_bp.route('/', methods=['GET'])
def get_public_jobs():
    """Get public job listings (no authentication required)"""
    try:
        # Pagination parameters
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 20)), 100)  # Max 100 per page
        
        # Search and filter parameters
        search = request.args.get('search', '').strip()
        location = request.args.get('location', '').strip()
        employment_type = request.args.get('employment_type', '').strip()
        experience_level = request.args.get('experience_level', '').strip()
        remote_work_allowed = request.args.get('remote_work_allowed', '').strip()
        company_id = request.args.get('company_id', '').strip()
        skills = request.args.get('skills', '').strip()
        salary_min = request.args.get('salary_min')
        salary_max = request.args.get('salary_max')
        
        # Sorting parameters
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        offset = (page - 1) * limit
        
        # Build query
        query = db_service.supabase.table('jobs').select("""
            id,
            title,
            description,
            location,
            employment_type,
            experience_level,
            salary_min,
            salary_max,
            currency,
            remote_work_allowed,
            skills_required,
            benefits,
            application_deadline,
            created_at,
            view_count,
            is_featured,
            companies:company_id (
                id,
                name,
                logo_url,
                industry,
                company_size,
                headquarters
            )
        """).eq('status', 'active')
        
        # Apply filters
        if search:
            # Search in title, description, and skills
            query = query.or_(f'title.ilike.%{search}%,description.ilike.%{search}%')
        
        if location:
            query = query.ilike('location', f'%{location}%')
        
        if employment_type:
            query = query.eq('employment_type', employment_type)
        
        if experience_level:
            query = query.eq('experience_level', experience_level)
        
        if remote_work_allowed:
            query = query.eq('remote_work_allowed', remote_work_allowed)
        
        if company_id:
            query = query.eq('company_id', company_id)
        
        if salary_min:
            query = query.gte('salary_min', int(salary_min))
        
        if salary_max:
            query = query.lte('salary_max', int(salary_max))
        
        # Apply sorting
        if sort_by in ['created_at', 'title', 'salary_min', 'view_count']:
            desc = sort_order.lower() == 'desc'
            query = query.order(sort_by, desc=desc)
        else:
            query = query.order('created_at', desc=True)
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1)
        
        result = query.execute()
        jobs = result.data or []
        
        # Get total count for pagination
        count_result = db_service.supabase.table('jobs').select('id', count='exact').eq('status', 'active').execute()
        total_count = count_result.count or 0
        
        return jsonify({
            'jobs': jobs,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'pages': (total_count + limit - 1) // limit
            },
            'filters': {
                'search': search,
                'location': location,
                'employment_type': employment_type,
                'experience_level': experience_level,
                'remote_work_allowed': remote_work_allowed,
                'company_id': company_id,
                'salary_min': salary_min,
                'salary_max': salary_max
            }
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
                website,
                headquarters,
                founded_year
            )
        """).eq('id', job_id).eq('status', 'active').execute()
        
        if not result.data:
            return jsonify({'error': 'Job not found'}), 404
        
        job = result.data[0]
        
        # Increment view count
        try:
            db_service.update_record('jobs', job_id, {
                'view_count': job.get('view_count', 0) + 1
            })
        except:
            pass  # Don't fail if view count update fails
        
        # Get similar jobs (same company or similar skills)
        similar_jobs_result = db_service.supabase.table('jobs').select("""
            id,
            title,
            location,
            employment_type,
            created_at,
            companies:company_id (name, logo_url)
        """).eq('status', 'active').neq('id', job_id).limit(5).execute()
        
        similar_jobs = similar_jobs_result.data or []
        
        return jsonify({
            'job': job,
            'similar_jobs': similar_jobs
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get job details', 'details': str(e)}), 500

@jobs_bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    """Create a new job posting"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = JobCreateSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation failed', 'details': err.messages}), 400
        
        # Check if user has permission to post jobs for this company
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        if not user_result.data:
            return jsonify({'error': 'User not found'}), 404
        
        user_type = user_result.data[0]['user_type']
        
        # Check company access
        if user_type == 'company':
            # Check if user belongs to this company
            company_result = db_service.supabase.table('company_profiles').select('id').eq('user_id', current_user_id).eq('id', data['company_id']).execute()
            if not company_result.data:
                return jsonify({'error': 'Access denied: You can only post jobs for your company'}), 403
        elif user_type == 'recruiter':
            # Check if recruiter has access to this company
            access_result = db_service.supabase.table('recruiter_company_access').select('id').eq('recruiter_id', current_user_id).eq('company_id', data['company_id']).eq('status', 'active').execute()
            if not access_result.data:
                return jsonify({'error': 'Access denied: You do not have access to post jobs for this company'}), 403
        else:
            return jsonify({'error': 'Access denied: Only companies and recruiters can post jobs'}), 403
        
        # Generate slug from title
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', data['title'].lower()).strip('-')
        
        # Check if slug exists and make it unique
        existing_slug = db_service.supabase.table('jobs').select('id').eq('slug', slug).execute()
        if existing_slug.data:
            slug = f"{slug}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Prepare job data
        job_data = {
            **data,
            'posted_by': current_user_id,
            'slug': slug,
            'employment_status': 'open',
            'view_count': 0,
            'application_count': 0
        }
        
        # Create job
        job = db_service.create_record('jobs', job_data)
        
        return jsonify({
            'message': 'Job created successfully',
            'job': job
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to create job', 'details': str(e)}), 500

@jobs_bp.route('/<job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    """Update a job posting"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = JobUpdateSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation failed', 'details': err.messages}), 400
        
        # Check if job exists and user has permission
        job_result = db_service.supabase.table('jobs').select('*').eq('id', job_id).execute()
        if not job_result.data:
            return jsonify({'error': 'Job not found'}), 404
        
        job = job_result.data[0]
        
        # Check permissions
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        user_type = user_result.data[0]['user_type']
        
        has_permission = False
        if user_type == 'company':
            # Check if user owns the company
            company_result = db_service.supabase.table('company_profiles').select('id').eq('user_id', current_user_id).eq('id', job['company_id']).execute()
            has_permission = bool(company_result.data)
        elif user_type == 'recruiter':
            # Check if recruiter has access or posted the job
            if job['posted_by'] == current_user_id:
                has_permission = True
            else:
                access_result = db_service.supabase.table('recruiter_company_access').select('id').eq('recruiter_id', current_user_id).eq('company_id', job['company_id']).eq('status', 'active').execute()
                has_permission = bool(access_result.data)
        
        if not has_permission:
            return jsonify({'error': 'Access denied'}), 403
        
        # Update slug if title changed
        if 'title' in data and data['title'] != job['title']:
            slug = re.sub(r'[^a-zA-Z0-9]+', '-', data['title'].lower()).strip('-')
            existing_slug = db_service.supabase.table('jobs').select('id').eq('slug', slug).neq('id', job_id).execute()
            if existing_slug.data:
                slug = f"{slug}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            data['slug'] = slug
        
        # Update job
        updated_job = db_service.update_record('jobs', job_id, data)
        
        return jsonify({
            'message': 'Job updated successfully',
            'job': updated_job
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update job', 'details': str(e)}), 500

@jobs_bp.route('/<job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    """Delete a job posting"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if job exists and user has permission
        job_result = db_service.supabase.table('jobs').select('*').eq('id', job_id).execute()
        if not job_result.data:
            return jsonify({'error': 'Job not found'}), 404
        
        job = job_result.data[0]
        
        # Check permissions (same logic as update)
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        user_type = user_result.data[0]['user_type']
        
        has_permission = False
        if user_type == 'company':
            company_result = db_service.supabase.table('company_profiles').select('id').eq('user_id', current_user_id).eq('id', job['company_id']).execute()
            has_permission = bool(company_result.data)
        elif user_type == 'recruiter':
            if job['posted_by'] == current_user_id:
                has_permission = True
            else:
                access_result = db_service.supabase.table('recruiter_company_access').select('id').eq('recruiter_id', current_user_id).eq('company_id', job['company_id']).eq('status', 'active').execute()
                has_permission = bool(access_result.data)
        
        if not has_permission:
            return jsonify({'error': 'Access denied'}), 403
        
        # Soft delete by updating status
        db_service.update_record('jobs', job_id, {
            'status': 'closed'
        })
        
        return jsonify({
            'message': 'Job deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to delete job', 'details': str(e)}), 500

@jobs_bp.route('/company/<company_id>', methods=['GET'])
@jwt_required()
def get_company_jobs(company_id):
    """Get jobs for a specific company (authenticated endpoint)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user has access to this company's jobs
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        user_type = user_result.data[0]['user_type']
        
        has_access = False
        if user_type == 'company':
            company_result = db_service.supabase.table('company_profiles').select('id').eq('user_id', current_user_id).eq('id', company_id).execute()
            has_access = bool(company_result.data)
        elif user_type == 'recruiter':
            access_result = db_service.supabase.table('recruiter_company_access').select('id').eq('recruiter_id', current_user_id).eq('company_id', company_id).eq('status', 'active').execute()
            has_access = bool(access_result.data)
        
        if not has_access:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get jobs with application counts
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 20)), 100)
        offset = (page - 1) * limit
        
        result = db_service.supabase.table('jobs').select("""
            *,
            applications:job_applications(count)
        """).eq('company_id', company_id).neq('employment_status', 'deleted').order('created_at', desc=True).range(offset, offset + limit - 1).execute()
        
        jobs = result.data or []
        
        # Get total count
        count_result = db_service.supabase.table('jobs').select('id', count='exact').eq('company_id', company_id).neq('employment_status', 'deleted').execute()
        total_count = count_result.count or 0
        
        return jsonify({
            'jobs': jobs,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'pages': (total_count + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get company jobs', 'details': str(e)}), 500

@jobs_bp.route('/stats', methods=['GET'])
def get_job_stats():
    """Get public job statistics"""
    try:
        # Get total active jobs
        total_result = db_service.supabase.table('jobs').select('id', count='exact').eq('status', 'active').execute()
        total_jobs = total_result.count or 0
        
        # Get jobs by type
        types_result = db_service.supabase.table('jobs').select('employment_type', count='exact').eq('status', 'active').execute()
        
        # Get jobs by location (top 10)
        locations_result = db_service.supabase.table('jobs').select('location', count='exact').eq('status', 'active').limit(10).execute()
        
        # Get recent jobs count (last 7 days)
        week_ago = (datetime.now() - timedelta(days=7)).isoformat()
        recent_result = db_service.supabase.table('jobs').select('id', count='exact').eq('status', 'active').gte('created_at', week_ago).execute()
        recent_jobs = recent_result.count or 0
        
        return jsonify({
            'total_jobs': total_jobs,
            'recent_jobs': recent_jobs,
            'employment_types': types_result.data or [],
            'top_locations': locations_result.data or []
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get job statistics', 'details': str(e)}), 500

