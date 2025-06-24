"""
Optimized Jobs routes for HotGigs.ai
Enhanced with performance optimizations, caching, and better error handling
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_required
from marshmallow import Schema, fields, ValidationError
import re
import html
import time
from datetime import datetime, timezone
from functools import wraps
from src.models.optimized_database import OptimizedSupabaseService

jobs_bp = Blueprint('jobs', __name__)
db_service = OptimizedSupabaseService()

# Performance monitoring decorator
def monitor_performance(operation_name):
    """Decorator to monitor API endpoint performance"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            start_time = time.time()
            try:
                result = f(*args, **kwargs)
                duration = time.time() - start_time
                current_app.logger.info(f"API {operation_name} completed in {duration:.3f}s")
                return result
            except Exception as e:
                duration = time.time() - start_time
                current_app.logger.error(f"API {operation_name} failed in {duration:.3f}s: {str(e)}")
                raise
        return decorated_function
    return decorator

# Input sanitization functions
def sanitize_input(text):
    """Sanitize user input to prevent XSS attacks"""
    if not text:
        return text
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', str(text))
    
    # Escape special characters
    text = html.escape(text)
    
    return text.strip()

def sanitize_job_data(data):
    """Sanitize job data fields"""
    sanitized = {}
    
    text_fields = ['title', 'description', 'requirements', 'location', 'department']
    list_fields = ['skills_required', 'benefits']
    
    for key, value in data.items():
        if key in text_fields and value:
            sanitized[key] = sanitize_input(value)
        elif key in list_fields and value:
            sanitized[key] = [sanitize_input(item) for item in value if item]
        else:
            sanitized[key] = value
    
    return sanitized

# Enhanced validation schemas
class JobCreateSchema(Schema):
    title = fields.Str(required=True, validate=lambda x: 3 <= len(x.strip()) <= 200)
    company_id = fields.UUID(required=True)
    description = fields.Str(required=True, validate=lambda x: 50 <= len(x.strip()) <= 5000)
    requirements = fields.Str(required=True, validate=lambda x: 10 <= len(x.strip()) <= 3000)
    location = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 2)
    employment_type = fields.Str(required=True, validate=lambda x: x in ['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    experience_level = fields.Str(required=True, validate=lambda x: x in ['entry', 'mid', 'senior', 'executive'])
    salary_min = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    salary_max = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    currency = fields.Str(load_default='USD', validate=lambda x: x in ['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    remote_work_allowed = fields.Bool(load_default=False)
    department = fields.Str(allow_none=True, validate=lambda x: x is None or len(x.strip()) <= 100)
    skills_required = fields.List(fields.Str(), load_default=[], validate=lambda x: len(x) <= 20)
    benefits = fields.List(fields.Str(), load_default=[], validate=lambda x: len(x) <= 15)
    application_deadline = fields.DateTime(allow_none=True)
    is_featured = fields.Bool(load_default=False)

class JobUpdateSchema(Schema):
    title = fields.Str(validate=lambda x: 3 <= len(x.strip()) <= 200)
    description = fields.Str(validate=lambda x: 50 <= len(x.strip()) <= 5000)
    requirements = fields.Str(validate=lambda x: 10 <= len(x.strip()) <= 3000)
    location = fields.Str(validate=lambda x: len(x.strip()) >= 2)
    employment_type = fields.Str(validate=lambda x: x in ['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    experience_level = fields.Str(validate=lambda x: x in ['entry', 'mid', 'senior', 'executive'])
    salary_min = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    salary_max = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    remote_work_allowed = fields.Bool()
    department = fields.Str(allow_none=True, validate=lambda x: x is None or len(x.strip()) <= 100)
    skills_required = fields.List(fields.Str(), validate=lambda x: len(x) <= 20)
    benefits = fields.List(fields.Str(), validate=lambda x: len(x) <= 15)
    application_deadline = fields.DateTime(allow_none=True)
    status = fields.Str(validate=lambda x: x in ['draft', 'active', 'paused', 'closed', 'expired'])
    is_featured = fields.Bool()

class JobSearchSchema(Schema):
    search = fields.Str(allow_none=True, validate=lambda x: x is None or len(x.strip()) <= 200)
    location = fields.Str(allow_none=True, validate=lambda x: x is None or len(x.strip()) <= 100)
    employment_type = fields.Str(allow_none=True, validate=lambda x: x is None or x in ['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    experience_level = fields.Str(allow_none=True, validate=lambda x: x is None or x in ['entry', 'mid', 'senior', 'executive'])
    salary_min = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    salary_max = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    remote_only = fields.Bool(load_default=False)
    limit = fields.Int(load_default=20, validate=lambda x: 1 <= x <= 100)
    offset = fields.Int(load_default=0, validate=lambda x: x >= 0)
    sort_by = fields.Str(load_default='created_at', validate=lambda x: x in ['created_at', 'relevance', 'salary'])
    order = fields.Str(load_default='desc', validate=lambda x: x in ['asc', 'desc'])

# Error handling
def handle_validation_error(e):
    """Handle marshmallow validation errors"""
    return jsonify({
        'error': 'Validation failed',
        'details': e.messages,
        'status': 'error'
    }), 400

def handle_database_error(e):
    """Handle database errors"""
    current_app.logger.error(f"Database error: {str(e)}")
    return jsonify({
        'error': 'Database operation failed',
        'message': 'An error occurred while processing your request',
        'status': 'error'
    }), 500

# Routes

@jobs_bp.route('/health', methods=['GET'])
@monitor_performance('jobs_health_check')
def health_check():
    """Health check endpoint for jobs service"""
    try:
        health_data = db_service.health_check()
        performance_stats = db_service.get_performance_stats()
        
        return jsonify({
            'status': 'healthy',
            'service': 'jobs',
            'database': health_data,
            'performance': performance_stats,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'jobs',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@jobs_bp.route('/', methods=['GET'])
@monitor_performance('get_jobs')
def get_jobs():
    """Get jobs with advanced search and filtering - OPTIMIZED"""
    try:
        # Validate query parameters
        schema = JobSearchSchema()
        try:
            args = schema.load(request.args)
        except ValidationError as e:
            return handle_validation_error(e)
        
        # Sanitize search input
        search_term = sanitize_input(args.get('search')) if args.get('search') else None
        location = sanitize_input(args.get('location')) if args.get('location') else None
        
        # Use optimized search function
        jobs = db_service.search_jobs_optimized(
            search_term=search_term,
            location=location,
            employment_type=args.get('employment_type'),
            experience_level=args.get('experience_level'),
            salary_min=args.get('salary_min'),
            salary_max=args.get('salary_max'),
            limit=args.get('limit', 20),
            offset=args.get('offset', 0)
        )
        
        # Add metadata
        response_data = {
            'jobs': jobs,
            'pagination': {
                'limit': args.get('limit', 20),
                'offset': args.get('offset', 0),
                'total': len(jobs)
            },
            'filters_applied': {
                'search': search_term,
                'location': location,
                'employment_type': args.get('employment_type'),
                'experience_level': args.get('experience_level'),
                'salary_range': {
                    'min': args.get('salary_min'),
                    'max': args.get('salary_max')
                }
            },
            'status': 'success'
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return handle_database_error(e)

@jobs_bp.route('/<job_id>', methods=['GET'])
@monitor_performance('get_job_by_id')
def get_job(job_id):
    """Get a specific job by ID with related data"""
    try:
        # Get job with company information
        job = db_service.get_record_by_id('jobs', job_id)
        
        if not job:
            return jsonify({
                'error': 'Job not found',
                'status': 'error'
            }), 404
        
        # Get company information
        if job.get('company_id'):
            company = db_service.get_record_by_id('companies', job['company_id'])
            if company:
                job['company'] = {
                    'id': company['id'],
                    'name': company['name'],
                    'logo_url': company.get('logo_url'),
                    'industry': company.get('industry'),
                    'location': company.get('location'),
                    'company_size': company.get('company_size')
                }
        
        # Get job skills if available
        job_skills = db_service.get_records_optimized(
            'job_skills', 
            {'job_id': job_id},
            select_fields='skill_name, proficiency_level'
        )
        job['skills'] = job_skills
        
        # Get application count (for analytics)
        application_count = db_service.count_records('job_applications', {'job_id': job_id})
        job['application_count'] = application_count
        
        return jsonify({
            'job': job,
            'status': 'success'
        }), 200
        
    except Exception as e:
        return handle_database_error(e)

@jobs_bp.route('/', methods=['POST'])
@jwt_required()
@monitor_performance('create_job')
def create_job():
    """Create a new job posting"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = JobCreateSchema()
        try:
            job_data = schema.load(request.json)
        except ValidationError as e:
            return handle_validation_error(e)
        
        # Sanitize input data
        job_data = sanitize_job_data(job_data)
        
        # Validate salary range
        if job_data.get('salary_min') and job_data.get('salary_max'):
            if job_data['salary_min'] > job_data['salary_max']:
                return jsonify({
                    'error': 'Minimum salary cannot be greater than maximum salary',
                    'status': 'error'
                }), 400
        
        # Verify user has permission to post for this company
        company_member = db_service.get_records_optimized(
            'company_members',
            {'user_id': current_user_id, 'company_id': job_data['company_id']},
            limit=1
        )
        
        if not company_member:
            return jsonify({
                'error': 'You do not have permission to post jobs for this company',
                'status': 'error'
            }), 403
        
        # Add metadata
        job_data.update({
            'created_by': current_user_id,
            'status': 'draft',  # Default to draft
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat()
        })
        
        # Create the job
        job = db_service.create_record('jobs', job_data)
        
        if not job:
            return jsonify({
                'error': 'Failed to create job',
                'status': 'error'
            }), 500
        
        # Create job skills if provided
        if job_data.get('skills_required'):
            skill_records = []
            for skill in job_data['skills_required']:
                skill_records.append({
                    'job_id': job['id'],
                    'skill_name': skill,
                    'proficiency_level': 'required',
                    'created_at': datetime.now(timezone.utc).isoformat()
                })
            
            if skill_records:
                db_service.create_records_batch('job_skills', skill_records)
        
        return jsonify({
            'job': job,
            'message': 'Job created successfully',
            'status': 'success'
        }), 201
        
    except Exception as e:
        return handle_database_error(e)

@jobs_bp.route('/<job_id>', methods=['PUT'])
@jwt_required()
@monitor_performance('update_job')
def update_job(job_id):
    """Update an existing job"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if job exists
        job = db_service.get_record_by_id('jobs', job_id)
        if not job:
            return jsonify({
                'error': 'Job not found',
                'status': 'error'
            }), 404
        
        # Verify user has permission to update this job
        company_member = db_service.get_records_optimized(
            'company_members',
            {'user_id': current_user_id, 'company_id': job['company_id']},
            limit=1
        )
        
        if not company_member:
            return jsonify({
                'error': 'You do not have permission to update this job',
                'status': 'error'
            }), 403
        
        # Validate input data
        schema = JobUpdateSchema()
        try:
            update_data = schema.load(request.json)
        except ValidationError as e:
            return handle_validation_error(e)
        
        # Sanitize input data
        update_data = sanitize_job_data(update_data)
        
        # Validate salary range if both provided
        if update_data.get('salary_min') and update_data.get('salary_max'):
            if update_data['salary_min'] > update_data['salary_max']:
                return jsonify({
                    'error': 'Minimum salary cannot be greater than maximum salary',
                    'status': 'error'
                }), 400
        
        # Update the job
        updated_job = db_service.update_record('jobs', job_id, update_data)
        
        if not updated_job:
            return jsonify({
                'error': 'Failed to update job',
                'status': 'error'
            }), 500
        
        # Update job skills if provided
        if 'skills_required' in update_data:
            # Delete existing skills
            existing_skills = db_service.get_records_optimized('job_skills', {'job_id': job_id})
            for skill in existing_skills:
                db_service.delete_record('job_skills', skill['id'])
            
            # Add new skills
            if update_data['skills_required']:
                skill_records = []
                for skill in update_data['skills_required']:
                    skill_records.append({
                        'job_id': job_id,
                        'skill_name': skill,
                        'proficiency_level': 'required',
                        'created_at': datetime.now(timezone.utc).isoformat()
                    })
                
                if skill_records:
                    db_service.create_records_batch('job_skills', skill_records)
        
        return jsonify({
            'job': updated_job,
            'message': 'Job updated successfully',
            'status': 'success'
        }), 200
        
    except Exception as e:
        return handle_database_error(e)

@jobs_bp.route('/<job_id>', methods=['DELETE'])
@jwt_required()
@monitor_performance('delete_job')
def delete_job(job_id):
    """Delete a job (soft delete by setting status to closed)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if job exists
        job = db_service.get_record_by_id('jobs', job_id)
        if not job:
            return jsonify({
                'error': 'Job not found',
                'status': 'error'
            }), 404
        
        # Verify user has permission to delete this job
        company_member = db_service.get_records_optimized(
            'company_members',
            {'user_id': current_user_id, 'company_id': job['company_id']},
            limit=1
        )
        
        if not company_member:
            return jsonify({
                'error': 'You do not have permission to delete this job',
                'status': 'error'
            }), 403
        
        # Soft delete by updating status
        update_data = {
            'status': 'closed',
            'closed_at': datetime.now(timezone.utc).isoformat()
        }
        
        updated_job = db_service.update_record('jobs', job_id, update_data)
        
        return jsonify({
            'message': 'Job deleted successfully',
            'status': 'success'
        }), 200
        
    except Exception as e:
        return handle_database_error(e)

@jobs_bp.route('/<job_id>/applications', methods=['GET'])
@jwt_required()
@monitor_performance('get_job_applications')
def get_job_applications(job_id):
    """Get applications for a specific job"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if job exists
        job = db_service.get_record_by_id('jobs', job_id)
        if not job:
            return jsonify({
                'error': 'Job not found',
                'status': 'error'
            }), 404
        
        # Verify user has permission to view applications
        company_member = db_service.get_records_optimized(
            'company_members',
            {'user_id': current_user_id, 'company_id': job['company_id']},
            limit=1
        )
        
        if not company_member:
            return jsonify({
                'error': 'You do not have permission to view applications for this job',
                'status': 'error'
            }), 403
        
        # Get applications with candidate information
        applications = db_service.get_job_applications(job_id)
        
        return jsonify({
            'applications': applications,
            'job': {
                'id': job['id'],
                'title': job['title'],
                'company_id': job['company_id']
            },
            'total': len(applications),
            'status': 'success'
        }), 200
        
    except Exception as e:
        return handle_database_error(e)

@jobs_bp.route('/stats', methods=['GET'])
@jwt_required()
@monitor_performance('get_job_stats')
def get_job_stats():
    """Get job statistics for analytics"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user's companies
        user_companies = db_service.get_records_optimized(
            'company_members',
            {'user_id': current_user_id},
            select_fields='company_id'
        )
        
        if not user_companies:
            return jsonify({
                'error': 'No companies found for user',
                'status': 'error'
            }), 404
        
        company_ids = [cm['company_id'] for cm in user_companies]
        
        # Get statistics for user's companies
        stats = {}
        for company_id in company_ids:
            company_stats = db_service.get_company_stats_optimized(company_id)
            company = db_service.get_record_by_id('companies', company_id)
            
            stats[company_id] = {
                'company_name': company['name'] if company else 'Unknown',
                'statistics': company_stats
            }
        
        return jsonify({
            'company_stats': stats,
            'status': 'success'
        }), 200
        
    except Exception as e:
        return handle_database_error(e)

@jobs_bp.route('/performance', methods=['GET'])
@monitor_performance('get_performance_metrics')
def get_performance_metrics():
    """Get performance metrics for the jobs service"""
    try:
        performance_stats = db_service.get_performance_stats()
        
        return jsonify({
            'performance_metrics': performance_stats,
            'service': 'jobs',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'status': 'success'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get performance metrics',
            'details': str(e),
            'status': 'error'
        }), 500

# Register error handlers
@jobs_bp.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    return handle_validation_error(e)

@jobs_bp.errorhandler(Exception)
def handle_general_error(e):
    current_app.logger.error(f"Unhandled error in jobs route: {str(e)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred',
        'status': 'error'
    }), 500

