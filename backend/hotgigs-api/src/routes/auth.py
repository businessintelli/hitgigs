"""
Authentication routes for HotGigs.ai
Handles user registration, login, OAuth, and JWT token management
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from marshmallow import Schema, fields, ValidationError
import requests
from datetime import datetime
from src.models.user import get_user_service

auth_bp = Blueprint('auth', __name__)

# Validation schemas
class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 8)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    user_type = fields.Str(required=True, validate=lambda x: x in ['candidate', 'company', 'freelance_recruiter'])
    phone = fields.Str(allow_none=True)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class OAuthSchema(Schema):
    provider = fields.Str(required=True, validate=lambda x: x in ['google', 'github', 'linkedin'])
    access_token = fields.Str(required=True)
    user_type = fields.Str(required=True, validate=lambda x: x in ['candidate', 'company', 'freelance_recruiter'])

class PasswordResetSchema(Schema):
    email = fields.Email(required=True)

class PasswordChangeSchema(Schema):
    current_password = fields.Str(required=True)
    new_password = fields.Str(required=True, validate=lambda x: len(x) >= 8)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user account"""
    try:
        # Validate request data
        schema = RegisterSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        # Create user
        user = get_user_service().create_user(data)
        
        # Generate tokens
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login with email and password"""
    try:
        # Validate request data
        schema = LoginSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        # Authenticate user
        user = get_user_service().authenticate_user(data['email'], data['password'])
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user['is_active']:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Generate tokens
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        
        return jsonify({
            'message': 'Login successful',
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/oauth', methods=['POST'])
def oauth_login():
    """Login or register using OAuth provider"""
    try:
        # Validate request data
        schema = OAuthSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        provider = data['provider']
        access_token = data['access_token']
        user_type = data['user_type']
        
        # Get user info from OAuth provider
        user_info = None
        
        if provider == 'google':
            user_info = get_google_user_info(access_token)
        elif provider == 'github':
            user_info = get_github_user_info(access_token)
        elif provider == 'linkedin':
            user_info = get_linkedin_user_info(access_token)
        
        if not user_info:
            return jsonify({'error': 'Failed to get user information from OAuth provider'}), 400
        
        # Check if user exists with OAuth
        existing_user = get_user_service().get_user_by_oauth(provider, user_info['id'])
        
        if existing_user:
            # User exists, login
            user = existing_user
        else:
            # Check if user exists with email
            existing_email_user = get_user_service().get_user_by_email(user_info['email'])
            
            if existing_email_user:
                # Link OAuth account to existing user
                get_user_service().create_oauth_account(existing_email_user['id'], {
                    'provider': provider,
                    'provider_user_id': user_info['id'],
                    'access_token': access_token
                })
                user = existing_email_user
            else:
                # Create new user
                new_user_data = {
                    'email': user_info['email'],
                    'first_name': user_info.get('first_name', ''),
                    'last_name': user_info.get('last_name', ''),
                    'user_type': user_type,
                    'is_verified': True,
                    'email_verified_at': datetime.utcnow().isoformat(),
                    'profile_image_url': user_info.get('picture')
                }
                
                user = get_user_service().create_user(new_user_data)
                
                # Create OAuth account link
                get_user_service().create_oauth_account(user['id'], {
                    'provider': provider,
                    'provider_user_id': user_info['id'],
                    'access_token': access_token
                })
        
        # Generate tokens
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        
        return jsonify({
            'message': 'OAuth login successful',
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'OAuth login failed', 'details': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user to ensure they still exist and are active
        user = get_user_service().get_record_by_id('users', current_user_id)
        if not user or not user['is_active']:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        # Generate new access token
        access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = get_user_service().get_user_profile(current_user_id)
        
        return jsonify({
            'user': user
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user profile', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client-side token removal)"""
    try:
        # In a production environment, you might want to blacklist the token
        # For now, we'll just return a success message
        return jsonify({
            'message': 'Logout successful'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    """Verify user email address"""
    try:
        # In a production environment, you would decode the token and verify the user
        # For now, we'll implement a basic verification
        return jsonify({
            'message': 'Email verification endpoint - implement token verification'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Email verification failed', 'details': str(e)}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset"""
    try:
        schema = PasswordResetSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        # Check if user exists
        user = get_user_service().get_user_by_email(data['email'])
        if not user:
            # Don't reveal if email exists or not for security
            return jsonify({'message': 'If the email exists, a password reset link has been sent'}), 200
        
        # In production, send password reset email
        # For now, return success message
        return jsonify({
            'message': 'Password reset email sent'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Password reset failed', 'details': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = PasswordChangeSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        # Verify current password
        user = get_user_service().get_record_by_id('users', current_user_id)
        if not get_user_service().authenticate_user(user['email'], data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Change password
        get_user_service().change_user_password(current_user_id, data['new_password'])
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Password change failed', 'details': str(e)}), 500

# OAuth helper functions
def get_google_user_info(access_token):
    """Get user information from Google OAuth"""
    try:
        response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                'id': data['id'],
                'email': data['email'],
                'first_name': data.get('given_name', ''),
                'last_name': data.get('family_name', ''),
                'picture': data.get('picture')
            }
        return None
    except Exception:
        return None

def get_github_user_info(access_token):
    """Get user information from GitHub OAuth"""
    try:
        response = requests.get(
            'https://api.github.com/user',
            headers={'Authorization': f'token {access_token}'}
        )
        
        if response.status_code == 200:
            data = response.json()
            name_parts = (data.get('name') or '').split(' ', 1)
            return {
                'id': str(data['id']),
                'email': data.get('email', ''),
                'first_name': name_parts[0] if name_parts else '',
                'last_name': name_parts[1] if len(name_parts) > 1 else '',
                'picture': data.get('avatar_url')
            }
        return None
    except Exception:
        return None

def get_linkedin_user_info(access_token):
    """Get user information from LinkedIn OAuth"""
    try:
        # Get basic profile
        profile_response = requests.get(
            'https://api.linkedin.com/v2/people/~',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        # Get email
        email_response = requests.get(
            'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if profile_response.status_code == 200:
            profile_data = profile_response.json()
            email_data = email_response.json() if email_response.status_code == 200 else {}
            
            email = ''
            if email_data.get('elements'):
                email = email_data['elements'][0]['handle~']['emailAddress']
            
            return {
                'id': profile_data['id'],
                'email': email,
                'first_name': profile_data.get('localizedFirstName', ''),
                'last_name': profile_data.get('localizedLastName', ''),
                'picture': None  # LinkedIn profile pictures require additional API calls
            }
        return None
    except Exception:
        return None

