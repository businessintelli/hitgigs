"""
User routes for HotGigs.ai
Handles user profile management and user-related operations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from src.models.user import get_user_service

users_bp = Blueprint('users', __name__)

# Validation schemas
class UpdateProfileSchema(Schema):
    first_name = fields.Str(allow_none=True)
    last_name = fields.Str(allow_none=True)
    phone = fields.Str(allow_none=True)
    bio = fields.Str(allow_none=True)
    location = fields.Str(allow_none=True)
    linkedin_url = fields.Url(allow_none=True)
    github_url = fields.Url(allow_none=True)
    website_url = fields.Url(allow_none=True)

class UpdateCandidateProfileSchema(Schema):
    headline = fields.Str(allow_none=True)
    summary = fields.Str(allow_none=True)
    current_title = fields.Str(allow_none=True)
    current_company = fields.Str(allow_none=True)
    experience_years = fields.Int(allow_none=True)
    availability = fields.Str(allow_none=True, validate=lambda x: x in ['immediately', 'within_2_weeks', 'within_month', 'not_looking'])
    desired_salary_min = fields.Int(allow_none=True)
    desired_salary_max = fields.Int(allow_none=True)
    skills = fields.List(fields.Str(), allow_none=True)

class AddExperienceSchema(Schema):
    company_name = fields.Str(required=True)
    job_title = fields.Str(required=True)
    description = fields.Str(allow_none=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(allow_none=True)
    is_current = fields.Bool(load_default=False)
    location = fields.Str(allow_none=True)
    achievements = fields.List(fields.Str(), load_default=[])
    skills_used = fields.List(fields.Str(), load_default=[])

class AddEducationSchema(Schema):
    institution_name = fields.Str(required=True)
    degree = fields.Str(allow_none=True)
    field_of_study = fields.Str(allow_none=True)
    start_date = fields.Date(allow_none=True)
    end_date = fields.Date(allow_none=True)
    gpa = fields.Float(allow_none=True)
    description = fields.Str(allow_none=True)
    achievements = fields.List(fields.Str(), load_default=[])

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user's complete profile"""
    try:
        current_user_id = get_jwt_identity()
        user = get_user_service().get_user_profile(current_user_id)
        
        return jsonify({
            'user': user
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get profile', 'details': str(e)}), 500

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = UpdateProfileSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}
        
        if not data:
            return jsonify({'error': 'No data provided for update'}), 400
        
        user = get_user_service().update_user_profile(current_user_id, data)
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update profile', 'details': str(e)}), 500

@users_bp.route('/candidate-profile', methods=['PUT'])
@jwt_required()
def update_candidate_profile():
    """Update candidate-specific profile"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = UpdateCandidateProfileSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}
        
        if not data:
            return jsonify({'error': 'No data provided for update'}), 400
        
        candidate_profile = get_user_service().update_candidate_profile(current_user_id, data)
        
        return jsonify({
            'message': 'Candidate profile updated successfully',
            'candidate_profile': candidate_profile
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update candidate profile', 'details': str(e)}), 500

@users_bp.route('/experience', methods=['POST'])
@jwt_required()
def add_experience():
    """Add work experience"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = AddExperienceSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        experience = get_user_service().add_candidate_experience(current_user_id, data)
        
        return jsonify({
            'message': 'Experience added successfully',
            'experience': experience
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to add experience', 'details': str(e)}), 500

@users_bp.route('/education', methods=['POST'])
@jwt_required()
def add_education():
    """Add education"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = AddEducationSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        education = get_user_service().add_candidate_education(current_user_id, data)
        
        return jsonify({
            'message': 'Education added successfully',
            'education': education
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to add education', 'details': str(e)}), 500

@users_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users():
    """Search users"""
    try:
        search_term = request.args.get('q', '')
        user_type = request.args.get('type')
        limit = int(request.args.get('limit', 20))
        
        if not search_term:
            return jsonify({'error': 'Search term is required'}), 400
        
        users = get_user_service().search_users(search_term, user_type, limit)
        
        return jsonify({
            'users': users,
            'count': len(users)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Search failed', 'details': str(e)}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    """Get user profile by ID (public information only)"""
    try:
        user = get_user_service().get_user_profile(user_id)
        
        # Return only public information
        public_user = {
            'id': user['id'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'user_type': user['user_type'],
            'profile_image_url': user['profile_image_url'],
            'profile': {
                'bio': user.get('profile', {}).get('bio'),
                'location': user.get('profile', {}).get('location'),
                'linkedin_url': user.get('profile', {}).get('linkedin_url'),
                'github_url': user.get('profile', {}).get('github_url'),
                'website_url': user.get('profile', {}).get('website_url')
            }
        }
        
        # Add candidate-specific public info
        if user['user_type'] == 'candidate' and 'candidate_profile' in user:
            public_user['candidate_profile'] = {
                'headline': user['candidate_profile'].get('headline'),
                'summary': user['candidate_profile'].get('summary'),
                'current_title': user['candidate_profile'].get('current_title'),
                'current_company': user['candidate_profile'].get('current_company'),
                'experience_years': user['candidate_profile'].get('experience_years'),
                'skills': user['candidate_profile'].get('skills', [])
            }
            public_user['experiences'] = user.get('experiences', [])
            public_user['education'] = user.get('education', [])
        
        return jsonify({
            'user': public_user
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user', 'details': str(e)}), 500

