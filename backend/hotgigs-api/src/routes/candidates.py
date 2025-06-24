"""
Candidates routes for HotGigs.ai
Handles candidate profiles, search, and candidate-related operations
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
import re
import html
from datetime import datetime, timezone
from src.models.optimized_database import OptimizedSupabaseService

candidates_bp = Blueprint('candidates', __name__)
db_service = OptimizedSupabaseService()

# Candidate validation schemas
class CandidateProfileSchema(Schema):
    bio = fields.Str(allow_none=True, validate=lambda x: x is None or len(x.strip()) <= 1000)
    location = fields.Str(allow_none=True, validate=lambda x: x is None or len(x.strip()) <= 100)
    experience_level = fields.Str(allow_none=True, validate=lambda x: x is None or x in ['entry', 'mid', 'senior', 'executive'])
    desired_salary_min = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    desired_salary_max = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    currency = fields.Str(load_default='USD', validate=lambda x: x in ['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    availability = fields.Str(allow_none=True, validate=lambda x: x is None or x in ['immediate', '2_weeks', '1_month', '3_months'])
    remote_preference = fields.Bool(load_default=False)
    willing_to_relocate = fields.Bool(load_default=False)
    linkedin_url = fields.Str(allow_none=True)
    github_url = fields.Str(allow_none=True)
    portfolio_url = fields.Str(allow_none=True)

class CandidateSearchSchema(Schema):
    skills = fields.List(fields.Str(), allow_none=True)
    location = fields.Str(allow_none=True)
    experience_level = fields.Str(allow_none=True, validate=lambda x: x is None or x in ['entry', 'mid', 'senior', 'executive'])
    availability = fields.Str(allow_none=True, validate=lambda x: x is None or x in ['immediate', '2_weeks', '1_month', '3_months'])
    salary_min = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    salary_max = fields.Int(allow_none=True, validate=lambda x: x is None or x >= 0)
    remote_only = fields.Bool(load_default=False)
    limit = fields.Int(load_default=20, validate=lambda x: 1 <= x <= 100)
    offset = fields.Int(load_default=0, validate=lambda x: x >= 0)

def sanitize_input(text):
    """Sanitize user input to prevent XSS attacks"""
    if not text:
        return text
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', str(text))
    
    # Escape special characters
    text = html.escape(text)
    
    return text.strip()

@candidates_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for candidates service"""
    try:
        return jsonify({
            'status': 'healthy',
            'service': 'candidates',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'candidates',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@candidates_bp.route('/', methods=['GET'])
@jwt_required()
def search_candidates():
    """Search candidates with filters (for companies and recruiters)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user has permission to search candidates
        user = db_service.get_record_by_id('users', current_user_id)
        if not user or user.get('user_type') not in ['company', 'freelance_recruiter']:
            return jsonify({
                'error': 'Access denied',
                'message': 'Only companies and recruiters can search candidates',
                'status': 'error'
            }), 403
        
        # Validate query parameters
        schema = CandidateSearchSchema()
        try:
            search_params = schema.load(request.args)
        except ValidationError as e:
            return jsonify({
                'error': 'Validation failed',
                'details': e.messages,
                'status': 'error'
            }), 400
        
        # Build search query
        candidates = search_candidate_profiles(search_params)
        
        return jsonify({
            'candidates': candidates,
            'total': len(candidates),
            'search_params': search_params,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error searching candidates: {str(e)}")
        return jsonify({
            'error': 'Failed to search candidates',
            'message': 'An error occurred while searching candidates',
            'status': 'error'
        }), 500

def search_candidate_profiles(search_params: dict) -> list:
    """Search candidate profiles based on criteria"""
    try:
        # Start with all candidate profiles
        filters = {}
        
        # Apply filters
        if search_params.get('location'):
            filters['location'] = search_params['location']
        
        if search_params.get('experience_level'):
            filters['experience_level'] = search_params['experience_level']
        
        if search_params.get('availability'):
            filters['availability'] = search_params['availability']
        
        # Get candidate profiles
        candidate_profiles = db_service.get_records_optimized(
            'candidate_profiles',
            filters=filters,
            limit=search_params.get('limit', 20),
            offset=search_params.get('offset', 0),
            order_by='updated_at',
            ascending=False
        )
        
        # Enrich with user data and skills
        enriched_candidates = []
        for profile in candidate_profiles:
            # Get user data
            user = db_service.get_record_by_id('users', profile['user_id'])
            if not user:
                continue
            
            # Get candidate skills
            skills = db_service.get_records_optimized(
                'candidate_skills',
                {'candidate_id': profile['id']},
                select_fields='skill_name, proficiency_level'
            )
            
            # Get work experience count
            experience_count = db_service.count_records(
                'work_experiences',
                {'candidate_id': profile['id']}
            )
            
            # Build candidate data
            candidate_data = {
                'id': profile['id'],
                'user_id': profile['user_id'],
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
                'email': user.get('email'),  # Only for authorized users
                'profile_image_url': user.get('profile_image_url'),
                'bio': profile.get('bio'),
                'location': profile.get('location'),
                'experience_level': profile.get('experience_level'),
                'desired_salary_min': profile.get('desired_salary_min'),
                'desired_salary_max': profile.get('desired_salary_max'),
                'currency': profile.get('currency'),
                'availability': profile.get('availability'),
                'remote_preference': profile.get('remote_preference'),
                'willing_to_relocate': profile.get('willing_to_relocate'),
                'linkedin_url': profile.get('linkedin_url'),
                'github_url': profile.get('github_url'),
                'portfolio_url': profile.get('portfolio_url'),
                'skills': skills,
                'experience_count': experience_count,
                'updated_at': profile.get('updated_at')
            }
            
            # Apply skill filter if specified
            if search_params.get('skills'):
                candidate_skills = [skill['skill_name'].lower() for skill in skills]
                search_skills = [skill.lower() for skill in search_params['skills']]
                
                # Check if candidate has any of the required skills
                if not any(skill in candidate_skills for skill in search_skills):
                    continue
            
            # Apply salary filter if specified
            if search_params.get('salary_min') and profile.get('desired_salary_max'):
                if profile['desired_salary_max'] < search_params['salary_min']:
                    continue
            
            if search_params.get('salary_max') and profile.get('desired_salary_min'):
                if profile['desired_salary_min'] > search_params['salary_max']:
                    continue
            
            # Apply remote filter
            if search_params.get('remote_only') and not profile.get('remote_preference'):
                continue
            
            enriched_candidates.append(candidate_data)
        
        return enriched_candidates
        
    except Exception as e:
        current_app.logger.error(f"Error in candidate search: {str(e)}")
        return []

@candidates_bp.route('/<candidate_id>', methods=['GET'])
@jwt_required()
def get_candidate_profile(candidate_id):
    """Get detailed candidate profile"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user has permission to view candidate profiles
        user = db_service.get_record_by_id('users', current_user_id)
        if not user or user.get('user_type') not in ['company', 'freelance_recruiter']:
            return jsonify({
                'error': 'Access denied',
                'message': 'Only companies and recruiters can view candidate profiles',
                'status': 'error'
            }), 403
        
        # Get candidate profile
        profile = db_service.get_record_by_id('candidate_profiles', candidate_id)
        if not profile:
            return jsonify({
                'error': 'Candidate not found',
                'status': 'error'
            }), 404
        
        # Get user data
        candidate_user = db_service.get_record_by_id('users', profile['user_id'])
        if not candidate_user:
            return jsonify({
                'error': 'Candidate user not found',
                'status': 'error'
            }), 404
        
        # Get candidate skills
        skills = db_service.get_records_optimized(
            'candidate_skills',
            {'candidate_id': candidate_id},
            order_by='proficiency_level',
            ascending=False
        )
        
        # Get work experience
        work_experiences = db_service.get_records_optimized(
            'work_experiences',
            {'candidate_id': candidate_id},
            order_by='start_date',
            ascending=False
        )
        
        # Get education
        education = db_service.get_records_optimized(
            'education',
            {'candidate_id': candidate_id},
            order_by='start_date',
            ascending=False
        )
        
        # Get documents (resumes, portfolios, etc.)
        documents = db_service.get_records_optimized(
            'documents',
            {'user_id': profile['user_id']},
            order_by='created_at',
            ascending=False
        )
        
        # Build complete profile
        complete_profile = {
            'id': profile['id'],
            'user_id': profile['user_id'],
            'first_name': candidate_user.get('first_name'),
            'last_name': candidate_user.get('last_name'),
            'email': candidate_user.get('email'),
            'profile_image_url': candidate_user.get('profile_image_url'),
            'bio': profile.get('bio'),
            'location': profile.get('location'),
            'experience_level': profile.get('experience_level'),
            'desired_salary_min': profile.get('desired_salary_min'),
            'desired_salary_max': profile.get('desired_salary_max'),
            'currency': profile.get('currency'),
            'availability': profile.get('availability'),
            'remote_preference': profile.get('remote_preference'),
            'willing_to_relocate': profile.get('willing_to_relocate'),
            'linkedin_url': profile.get('linkedin_url'),
            'github_url': profile.get('github_url'),
            'portfolio_url': profile.get('portfolio_url'),
            'skills': skills,
            'work_experiences': work_experiences,
            'education': education,
            'documents': documents,
            'created_at': profile.get('created_at'),
            'updated_at': profile.get('updated_at')
        }
        
        return jsonify({
            'candidate': complete_profile,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting candidate profile: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve candidate profile',
            'status': 'error'
        }), 500

@candidates_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_my_profile():
    """Get current user's candidate profile"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user is a candidate
        user = db_service.get_record_by_id('users', current_user_id)
        if not user or user.get('user_type') != 'candidate':
            return jsonify({
                'error': 'Access denied',
                'message': 'Only candidates can access this endpoint',
                'status': 'error'
            }), 403
        
        # Get candidate profile
        profiles = db_service.get_records_optimized(
            'candidate_profiles',
            {'user_id': current_user_id},
            limit=1
        )
        
        if not profiles:
            return jsonify({
                'error': 'Candidate profile not found',
                'message': 'Please create your candidate profile first',
                'status': 'error'
            }), 404
        
        profile = profiles[0]
        
        # Get additional data
        skills = db_service.get_records_optimized(
            'candidate_skills',
            {'candidate_id': profile['id']}
        )
        
        work_experiences = db_service.get_records_optimized(
            'work_experiences',
            {'candidate_id': profile['id']},
            order_by='start_date',
            ascending=False
        )
        
        education = db_service.get_records_optimized(
            'education',
            {'candidate_id': profile['id']},
            order_by='start_date',
            ascending=False
        )
        
        # Build profile response
        profile_data = {
            **profile,
            'user': {
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
                'email': user.get('email'),
                'profile_image_url': user.get('profile_image_url')
            },
            'skills': skills,
            'work_experiences': work_experiences,
            'education': education
        }
        
        return jsonify({
            'profile': profile_data,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting candidate profile: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve profile',
            'status': 'error'
        }), 500

@candidates_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_my_profile():
    """Update current user's candidate profile"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user is a candidate
        user = db_service.get_record_by_id('users', current_user_id)
        if not user or user.get('user_type') != 'candidate':
            return jsonify({
                'error': 'Access denied',
                'message': 'Only candidates can update candidate profiles',
                'status': 'error'
            }), 403
        
        # Validate input data
        schema = CandidateProfileSchema()
        try:
            profile_data = schema.load(request.json)
        except ValidationError as e:
            return jsonify({
                'error': 'Validation failed',
                'details': e.messages,
                'status': 'error'
            }), 400
        
        # Sanitize input data
        if profile_data.get('bio'):
            profile_data['bio'] = sanitize_input(profile_data['bio'])
        if profile_data.get('location'):
            profile_data['location'] = sanitize_input(profile_data['location'])
        
        # Validate salary range
        if (profile_data.get('desired_salary_min') and 
            profile_data.get('desired_salary_max') and
            profile_data['desired_salary_min'] > profile_data['desired_salary_max']):
            return jsonify({
                'error': 'Minimum salary cannot be greater than maximum salary',
                'status': 'error'
            }), 400
        
        # Get existing profile
        profiles = db_service.get_records_optimized(
            'candidate_profiles',
            {'user_id': current_user_id},
            limit=1
        )
        
        if profiles:
            # Update existing profile
            profile_id = profiles[0]['id']
            updated_profile = db_service.update_record('candidate_profiles', profile_id, profile_data)
        else:
            # Create new profile
            profile_data['user_id'] = current_user_id
            profile_data['created_at'] = datetime.now(timezone.utc).isoformat()
            updated_profile = db_service.create_record('candidate_profiles', profile_data)
        
        if not updated_profile:
            return jsonify({
                'error': 'Failed to update profile',
                'status': 'error'
            }), 500
        
        return jsonify({
            'profile': updated_profile,
            'message': 'Profile updated successfully',
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating candidate profile: {str(e)}")
        return jsonify({
            'error': 'Failed to update profile',
            'status': 'error'
        }), 500

@candidates_bp.route('/stats', methods=['GET'])
def get_candidate_stats():
    """Get candidate statistics for platform analytics"""
    try:
        # Get general candidate statistics
        total_candidates = db_service.count_records('candidate_profiles')
        
        # Get candidates by experience level
        experience_levels = ['entry', 'mid', 'senior', 'executive']
        experience_stats = {}
        
        for level in experience_levels:
            count = db_service.count_records('candidate_profiles', {'experience_level': level})
            experience_stats[level] = count
        
        # Get candidates by availability
        availability_options = ['immediate', '2_weeks', '1_month', '3_months']
        availability_stats = {}
        
        for availability in availability_options:
            count = db_service.count_records('candidate_profiles', {'availability': availability})
            availability_stats[availability] = count
        
        return jsonify({
            'statistics': {
                'total_candidates': total_candidates,
                'by_experience_level': experience_stats,
                'by_availability': availability_stats
            },
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting candidate stats: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve candidate statistics',
            'status': 'error'
        }), 500

# Error handlers
@candidates_bp.errorhandler(ValidationError)
def handle_validation_error(e):
    return jsonify({
        'error': 'Validation failed',
        'details': e.messages,
        'status': 'error'
    }), 400

@candidates_bp.errorhandler(Exception)
def handle_general_error(e):
    current_app.logger.error(f"Unhandled error in candidates route: {str(e)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred',
        'status': 'error'
    }), 500

