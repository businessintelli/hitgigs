"""
Applications routes for HotGigs.ai
Handles job applications and application tracking
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime
from src.models.database import DatabaseService

applications_bp = Blueprint('applications', __name__)
db_service = DatabaseService()

# Application validation schemas
class ApplicationCreateSchema(Schema):
    job_id = fields.UUID(required=True)
    cover_letter = fields.Str(allow_none=True)
    resume_url = fields.Str(allow_none=True)
    additional_documents = fields.List(fields.Str(), load_default=[])
    expected_salary = fields.Int(allow_none=True)
    availability_date = fields.DateTime(allow_none=True)
    custom_responses = fields.Dict(load_default={})

class ApplicationUpdateSchema(Schema):
    status = fields.Str(validate=lambda x: x in ['applied', 'reviewing', 'interview_scheduled', 'interviewed', 'offer_extended', 'hired', 'rejected', 'withdrawn'])
    notes = fields.Str(allow_none=True)
    interview_date = fields.DateTime(allow_none=True)
    interview_type = fields.Str(validate=lambda x: x in ['phone', 'video', 'in-person', 'technical'])
    interview_notes = fields.Str(allow_none=True)
    rejection_reason = fields.Str(allow_none=True)
    offer_details = fields.Dict(allow_none=True)

@applications_bp.route('/', methods=['POST'])
@jwt_required()
def apply_to_job():
    """Apply to a job"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = ApplicationCreateSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation failed', 'details': err.messages}), 400
        
        # Check if user is a candidate
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        if not user_result.data or user_result.data[0]['user_type'] != 'candidate':
            return jsonify({'error': 'Only candidates can apply to jobs'}), 403
        
        # Get candidate profile
        candidate_result = db_service.supabase.table('candidate_profiles').select('id').eq('user_id', current_user_id).execute()
        if not candidate_result.data:
            return jsonify({'error': 'Candidate profile not found'}), 400
        
        candidate_id = candidate_result.data[0]['id']
        
        # Check if job exists and is open
        job_result = db_service.supabase.table('jobs').select('id, employment_status, application_deadline').eq('id', data['job_id']).execute()
        if not job_result.data:
            return jsonify({'error': 'Job not found'}), 404
        
        job = job_result.data[0]
        if job['employment_status'] != 'open':
            return jsonify({'error': 'This job is no longer accepting applications'}), 400
        
        # Check application deadline
        if job['application_deadline']:
            deadline = datetime.fromisoformat(job['application_deadline'].replace('Z', '+00:00'))
            if datetime.now(deadline.tzinfo) > deadline:
                return jsonify({'error': 'Application deadline has passed'}), 400
        
        # Check if already applied
        existing_application = db_service.supabase.table('job_applications').select('id').eq('job_id', data['job_id']).eq('candidate_id', candidate_id).execute()
        if existing_application.data:
            return jsonify({'error': 'You have already applied to this job'}), 400
        
        # Prepare application data
        application_data = {
            'job_id': data['job_id'],
            'candidate_id': candidate_id,
            'cover_letter': data.get('cover_letter'),
            'resume_url': data.get('resume_url'),
            'additional_documents': data.get('additional_documents', []),
            'expected_salary': data.get('expected_salary'),
            'availability_date': data.get('availability_date'),
            'custom_responses': data.get('custom_responses', {}),
            'status': 'applied',
            'applied_at': datetime.utcnow().isoformat()
        }
        
        # Create application
        application = db_service.create_record('job_applications', application_data)
        
        # Update job application count
        try:
            current_count_result = db_service.supabase.table('jobs').select('application_count').eq('id', data['job_id']).execute()
            current_count = current_count_result.data[0]['application_count'] if current_count_result.data else 0
            db_service.update_record('jobs', data['job_id'], {
                'application_count': (current_count or 0) + 1
            })
        except:
            pass  # Don't fail if count update fails
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to submit application', 'details': str(e)}), 500

@applications_bp.route('/', methods=['GET'])
@jwt_required()
def get_applications():
    """Get applications for current user (candidate view)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user is a candidate
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        if not user_result.data or user_result.data[0]['user_type'] != 'candidate':
            return jsonify({'error': 'Only candidates can view their applications'}), 403
        
        # Get candidate profile
        candidate_result = db_service.supabase.table('candidate_profiles').select('id').eq('user_id', current_user_id).execute()
        if not candidate_result.data:
            return jsonify({'error': 'Candidate profile not found'}), 400
        
        candidate_id = candidate_result.data[0]['id']
        
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 20)), 100)
        status_filter = request.args.get('status', '')
        
        offset = (page - 1) * limit
        
        # Build query
        query = db_service.supabase.table('job_applications').select("""
            *,
            jobs:job_id (
                id,
                title,
                location,
                job_type,
                employment_status,
                companies:company_id (
                    id,
                    name,
                    logo_url,
                    industry
                )
            )
        """).eq('candidate_id', candidate_id)
        
        # Apply status filter
        if status_filter:
            query = query.eq('status', status_filter)
        
        # Apply pagination and ordering
        query = query.order('applied_at', desc=True).range(offset, offset + limit - 1)
        
        result = query.execute()
        applications = result.data or []
        
        # Get total count
        count_query = db_service.supabase.table('job_applications').select('id', count='exact').eq('candidate_id', candidate_id)
        if status_filter:
            count_query = count_query.eq('status', status_filter)
        count_result = count_query.execute()
        total_count = count_result.count or 0
        
        return jsonify({
            'applications': applications,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'pages': (total_count + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get applications', 'details': str(e)}), 500

@applications_bp.route('/<application_id>', methods=['GET'])
@jwt_required()
def get_application_details(application_id):
    """Get detailed application information"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get application with full details
        result = db_service.supabase.table('job_applications').select("""
            *,
            jobs:job_id (
                *,
                companies:company_id (
                    id,
                    name,
                    logo_url,
                    industry,
                    description,
                    website
                )
            ),
            candidate_profiles:candidate_id (
                *,
                users:user_id (
                    first_name,
                    last_name,
                    email
                )
            )
        """).eq('id', application_id).execute()
        
        if not result.data:
            return jsonify({'error': 'Application not found'}), 404
        
        application = result.data[0]
        
        # Check permissions
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        user_type = user_result.data[0]['user_type']
        
        has_permission = False
        if user_type == 'candidate':
            # Check if this is the candidate's application
            candidate_result = db_service.supabase.table('candidate_profiles').select('id').eq('user_id', current_user_id).execute()
            if candidate_result.data and candidate_result.data[0]['id'] == application['candidate_id']:
                has_permission = True
        elif user_type in ['company', 'recruiter']:
            # Check if user has access to the company
            company_id = application['jobs']['company_id']
            if user_type == 'company':
                company_result = db_service.supabase.table('company_profiles').select('id').eq('user_id', current_user_id).eq('id', company_id).execute()
                has_permission = bool(company_result.data)
            elif user_type == 'recruiter':
                access_result = db_service.supabase.table('recruiter_company_access').select('id').eq('recruiter_id', current_user_id).eq('company_id', company_id).eq('status', 'active').execute()
                has_permission = bool(access_result.data)
        
        if not has_permission:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({
            'application': application
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get application details', 'details': str(e)}), 500

@applications_bp.route('/<application_id>', methods=['PUT'])
@jwt_required()
def update_application(application_id):
    """Update application status (company/recruiter only)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = ApplicationUpdateSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation failed', 'details': err.messages}), 400
        
        # Get application
        app_result = db_service.supabase.table('job_applications').select("""
            *,
            jobs:job_id (company_id)
        """).eq('id', application_id).execute()
        
        if not app_result.data:
            return jsonify({'error': 'Application not found'}), 404
        
        application = app_result.data[0]
        company_id = application['jobs']['company_id']
        
        # Check permissions (only company/recruiter can update)
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        user_type = user_result.data[0]['user_type']
        
        has_permission = False
        if user_type == 'company':
            company_result = db_service.supabase.table('company_profiles').select('id').eq('user_id', current_user_id).eq('id', company_id).execute()
            has_permission = bool(company_result.data)
        elif user_type == 'recruiter':
            access_result = db_service.supabase.table('recruiter_company_access').select('id').eq('recruiter_id', current_user_id).eq('company_id', company_id).eq('status', 'active').execute()
            has_permission = bool(access_result.data)
        
        if not has_permission:
            return jsonify({'error': 'Access denied: Only company representatives can update applications'}), 403
        
        # Add update metadata
        update_data = {
            **data,
            'updated_by': current_user_id,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # Update application
        updated_application = db_service.update_record('job_applications', application_id, update_data)
        
        return jsonify({
            'message': 'Application updated successfully',
            'application': updated_application
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update application', 'details': str(e)}), 500

@applications_bp.route('/<application_id>', methods=['DELETE'])
@jwt_required()
def withdraw_application(application_id):
    """Withdraw application (candidate only)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get application
        app_result = db_service.supabase.table('job_applications').select('*').eq('id', application_id).execute()
        if not app_result.data:
            return jsonify({'error': 'Application not found'}), 404
        
        application = app_result.data[0]
        
        # Check if user is the candidate who applied
        candidate_result = db_service.supabase.table('candidate_profiles').select('id').eq('user_id', current_user_id).execute()
        if not candidate_result.data or candidate_result.data[0]['id'] != application['candidate_id']:
            return jsonify({'error': 'Access denied: You can only withdraw your own applications'}), 403
        
        # Check if application can be withdrawn
        if application['status'] in ['hired', 'rejected']:
            return jsonify({'error': 'Cannot withdraw application with current status'}), 400
        
        # Update status to withdrawn
        db_service.update_record('job_applications', application_id, {
            'status': 'withdrawn',
            'updated_at': datetime.utcnow().isoformat()
        })
        
        return jsonify({
            'message': 'Application withdrawn successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to withdraw application', 'details': str(e)}), 500

@applications_bp.route('/job/<job_id>', methods=['GET'])
@jwt_required()
def get_job_applications(job_id):
    """Get applications for a specific job (company/recruiter view)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if job exists and user has permission
        job_result = db_service.supabase.table('jobs').select('company_id').eq('id', job_id).execute()
        if not job_result.data:
            return jsonify({'error': 'Job not found'}), 404
        
        company_id = job_result.data[0]['company_id']
        
        # Check permissions
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        user_type = user_result.data[0]['user_type']
        
        has_permission = False
        if user_type == 'company':
            company_result = db_service.supabase.table('company_profiles').select('id').eq('user_id', current_user_id).eq('id', company_id).execute()
            has_permission = bool(company_result.data)
        elif user_type == 'recruiter':
            access_result = db_service.supabase.table('recruiter_company_access').select('id').eq('recruiter_id', current_user_id).eq('company_id', company_id).eq('status', 'active').execute()
            has_permission = bool(access_result.data)
        
        if not has_permission:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get pagination and filter parameters
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 20)), 100)
        status_filter = request.args.get('status', '')
        sort_by = request.args.get('sort_by', 'applied_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        offset = (page - 1) * limit
        
        # Build query
        query = db_service.supabase.table('job_applications').select("""
            *,
            candidate_profiles:candidate_id (
                *,
                users:user_id (
                    first_name,
                    last_name,
                    email,
                    profile_picture_url
                )
            )
        """).eq('job_id', job_id)
        
        # Apply status filter
        if status_filter:
            query = query.eq('status', status_filter)
        
        # Apply sorting
        if sort_by in ['applied_at', 'status', 'updated_at']:
            desc = sort_order.lower() == 'desc'
            query = query.order(sort_by, desc=desc)
        else:
            query = query.order('applied_at', desc=True)
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1)
        
        result = query.execute()
        applications = result.data or []
        
        # Get total count
        count_query = db_service.supabase.table('job_applications').select('id', count='exact').eq('job_id', job_id)
        if status_filter:
            count_query = count_query.eq('status', status_filter)
        count_result = count_query.execute()
        total_count = count_result.count or 0
        
        # Get status summary
        status_summary = {}
        for status in ['applied', 'reviewing', 'interview_scheduled', 'interviewed', 'offer_extended', 'hired', 'rejected', 'withdrawn']:
            status_count_result = db_service.supabase.table('job_applications').select('id', count='exact').eq('job_id', job_id).eq('status', status).execute()
            status_summary[status] = status_count_result.count or 0
        
        return jsonify({
            'applications': applications,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'pages': (total_count + limit - 1) // limit
            },
            'status_summary': status_summary
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get job applications', 'details': str(e)}), 500

@applications_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_application_stats():
    """Get application statistics for current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check user type
        user_result = db_service.supabase.table('users').select('user_type').eq('id', current_user_id).execute()
        user_type = user_result.data[0]['user_type']
        
        if user_type == 'candidate':
            # Get candidate stats
            candidate_result = db_service.supabase.table('candidate_profiles').select('id').eq('user_id', current_user_id).execute()
            if not candidate_result.data:
                return jsonify({'error': 'Candidate profile not found'}), 400
            
            candidate_id = candidate_result.data[0]['id']
            
            # Get application counts by status
            stats = {}
            for status in ['applied', 'reviewing', 'interview_scheduled', 'interviewed', 'offer_extended', 'hired', 'rejected', 'withdrawn']:
                count_result = db_service.supabase.table('job_applications').select('id', count='exact').eq('candidate_id', candidate_id).eq('status', status).execute()
                stats[status] = count_result.count or 0
            
            # Get total applications
            total_result = db_service.supabase.table('job_applications').select('id', count='exact').eq('candidate_id', candidate_id).execute()
            stats['total'] = total_result.count or 0
            
            return jsonify({
                'stats': stats,
                'user_type': 'candidate'
            }), 200
            
        elif user_type in ['company', 'recruiter']:
            # Get company/recruiter stats
            if user_type == 'company':
                company_result = db_service.supabase.table('company_profiles').select('id').eq('user_id', current_user_id).execute()
                if not company_result.data:
                    return jsonify({'error': 'Company profile not found'}), 400
                company_ids = [company_result.data[0]['id']]
            else:  # recruiter
                access_result = db_service.supabase.table('recruiter_company_access').select('company_id').eq('recruiter_id', current_user_id).eq('status', 'active').execute()
                company_ids = [access['company_id'] for access in access_result.data]
            
            if not company_ids:
                return jsonify({'stats': {}, 'user_type': user_type}), 200
            
            # Get job IDs for these companies
            jobs_result = db_service.supabase.table('jobs').select('id').in_('company_id', company_ids).execute()
            job_ids = [job['id'] for job in jobs_result.data]
            
            if not job_ids:
                return jsonify({'stats': {}, 'user_type': user_type}), 200
            
            # Get application counts by status
            stats = {}
            for status in ['applied', 'reviewing', 'interview_scheduled', 'interviewed', 'offer_extended', 'hired', 'rejected', 'withdrawn']:
                count_result = db_service.supabase.table('job_applications').select('id', count='exact').in_('job_id', job_ids).eq('status', status).execute()
                stats[status] = count_result.count or 0
            
            # Get total applications
            total_result = db_service.supabase.table('job_applications').select('id', count='exact').in_('job_id', job_ids).execute()
            stats['total'] = total_result.count or 0
            
            return jsonify({
                'stats': stats,
                'user_type': user_type
            }), 200
        
        else:
            return jsonify({'error': 'Invalid user type'}), 400
        
    except Exception as e:
        return jsonify({'error': 'Failed to get application statistics', 'details': str(e)}), 500

