"""
User model and service for HotGigs.ai
Handles user management, authentication, and profiles
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
import bcrypt
from src.models.database import DatabaseService


class UserService(DatabaseService):
    """Service class for user operations"""
    
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user account"""
        try:
            # Hash password if provided
            if 'password' in user_data:
                password_hash = bcrypt.hashpw(
                    user_data['password'].encode('utf-8'), 
                    bcrypt.gensalt()
                ).decode('utf-8')
                user_data['password_hash'] = password_hash
                del user_data['password']
            
            # Validate required fields
            required_fields = ['email', 'user_type']
            for field in required_fields:
                if field not in user_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Check if user already exists
            existing_user = self.get_user_by_email(user_data['email'])
            if existing_user:
                raise ValueError("User with this email already exists")
            
            # Create user record
            user = self.create_record('users', user_data)
            
            # Create user profile
            profile_data = {
                'user_id': user['id'],
                'notification_preferences': {
                    'email_notifications': True,
                    'job_alerts': True,
                    'application_updates': True
                },
                'privacy_settings': {
                    'profile_visibility': 'public',
                    'contact_visibility': 'registered_users'
                }
            }
            self.create_record('user_profiles', profile_data)
            
            # Create role-specific profile
            if user_data['user_type'] == 'candidate':
                self.create_candidate_profile(user['id'])
            elif user_data['user_type'] == 'freelance_recruiter':
                self.create_freelance_recruiter_profile(user['id'])
            
            # Remove sensitive data from response
            if 'password_hash' in user:
                del user['password_hash']
            
            return user
            
        except Exception as e:
            raise Exception(f"Failed to create user: {str(e)}")
    
    def create_candidate_profile(self, user_id: str) -> Dict[str, Any]:
        """Create a candidate profile for a user"""
        profile_data = {
            'user_id': user_id,
            'availability': 'not_looking',
            'desired_salary_currency': 'USD',
            'skills': [],
            'languages': [],
            'ai_score': {},
            'visibility_settings': {
                'profile_public': True,
                'salary_visible': False,
                'contact_visible': True
            }
        }
        return self.create_record('candidate_profiles', profile_data)
    
    def create_freelance_recruiter_profile(self, user_id: str) -> Dict[str, Any]:
        """Create a freelance recruiter profile for a user"""
        profile_data = {
            'user_id': user_id,
            'specializations': [],
            'commission_rate': 10.00,
            'total_placements': 0,
            'total_earnings': 0.00,
            'payment_info': {},
            'is_verified': False
        }
        return self.create_record('freelance_recruiters', profile_data)
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        try:
            user = self.get_user_by_email(email)
            if not user:
                return None
            
            if not user.get('password_hash'):
                return None
            
            # Verify password
            if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                # Update last login
                self.update_record('users', user['id'], {
                    'last_login_at': datetime.utcnow().isoformat()
                })
                
                # Remove sensitive data
                del user['password_hash']
                return user
            
            return None
            
        except Exception as e:
            raise Exception(f"Authentication failed: {str(e)}")
    
    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get complete user profile with all related data"""
        try:
            # Get user basic info
            user = self.get_record_by_id('users', user_id)
            if not user:
                raise ValueError("User not found")
            
            # Remove sensitive data
            if 'password_hash' in user:
                del user['password_hash']
            
            # Get user profile
            profile_result = self.supabase.table('user_profiles').select("*").eq("user_id", user_id).execute()
            user['profile'] = profile_result.data[0] if profile_result.data else {}
            
            # Get role-specific profile
            if user['user_type'] == 'candidate':
                candidate_result = self.supabase.table('candidate_profiles').select("*").eq("user_id", user_id).execute()
                user['candidate_profile'] = candidate_result.data[0] if candidate_result.data else {}
                
                # Get candidate experiences
                experiences_result = self.supabase.table('candidate_experiences').select("*").eq("candidate_id", user['candidate_profile'].get('id')).order('start_date', desc=True).execute()
                user['experiences'] = experiences_result.data or []
                
                # Get candidate education
                education_result = self.supabase.table('candidate_education').select("*").eq("candidate_id", user['candidate_profile'].get('id')).order('start_date', desc=True).execute()
                user['education'] = education_result.data or []
                
            elif user['user_type'] == 'freelance_recruiter':
                recruiter_result = self.supabase.table('freelance_recruiters').select("*").eq("user_id", user_id).execute()
                user['recruiter_profile'] = recruiter_result.data[0] if recruiter_result.data else {}
            
            elif user['user_type'] == 'company':
                # Get company memberships
                user['companies'] = self.get_user_companies(user_id)
            
            return user
            
        except Exception as e:
            raise Exception(f"Failed to get user profile: {str(e)}")
    
    def update_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile information"""
        try:
            # Separate user data from profile data
            user_fields = ['first_name', 'last_name', 'phone', 'profile_image_url']
            user_data = {k: v for k, v in profile_data.items() if k in user_fields}
            profile_fields = {k: v for k, v in profile_data.items() if k not in user_fields}
            
            # Update user record
            if user_data:
                self.update_record('users', user_id, user_data)
            
            # Update user profile
            if profile_fields:
                # Check if profile exists
                existing_profile = self.supabase.table('user_profiles').select("id").eq("user_id", user_id).execute()
                
                if existing_profile.data:
                    self.update_record('user_profiles', existing_profile.data[0]['id'], profile_fields)
                else:
                    profile_fields['user_id'] = user_id
                    self.create_record('user_profiles', profile_fields)
            
            return self.get_user_profile(user_id)
            
        except Exception as e:
            raise Exception(f"Failed to update user profile: {str(e)}")
    
    def update_candidate_profile(self, user_id: str, candidate_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update candidate-specific profile information"""
        try:
            # Get candidate profile
            candidate_result = self.supabase.table('candidate_profiles').select("id").eq("user_id", user_id).execute()
            
            if not candidate_result.data:
                raise ValueError("Candidate profile not found")
            
            candidate_id = candidate_result.data[0]['id']
            
            # Update candidate profile
            return self.update_record('candidate_profiles', candidate_id, candidate_data)
            
        except Exception as e:
            raise Exception(f"Failed to update candidate profile: {str(e)}")
    
    def add_candidate_experience(self, user_id: str, experience_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add work experience to candidate profile"""
        try:
            # Get candidate profile
            candidate_result = self.supabase.table('candidate_profiles').select("id").eq("user_id", user_id).execute()
            
            if not candidate_result.data:
                raise ValueError("Candidate profile not found")
            
            experience_data['candidate_id'] = candidate_result.data[0]['id']
            
            # Validate required fields
            required_fields = ['company_name', 'job_title', 'start_date']
            for field in required_fields:
                if field not in experience_data:
                    raise ValueError(f"Missing required field: {field}")
            
            return self.create_record('candidate_experiences', experience_data)
            
        except Exception as e:
            raise Exception(f"Failed to add experience: {str(e)}")
    
    def add_candidate_education(self, user_id: str, education_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add education to candidate profile"""
        try:
            # Get candidate profile
            candidate_result = self.supabase.table('candidate_profiles').select("id").eq("user_id", user_id).execute()
            
            if not candidate_result.data:
                raise ValueError("Candidate profile not found")
            
            education_data['candidate_id'] = candidate_result.data[0]['id']
            
            # Validate required fields
            required_fields = ['institution_name']
            for field in required_fields:
                if field not in education_data:
                    raise ValueError(f"Missing required field: {field}")
            
            return self.create_record('candidate_education', education_data)
            
        except Exception as e:
            raise Exception(f"Failed to add education: {str(e)}")
    
    def create_oauth_account(self, user_id: str, oauth_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create OAuth account link for user"""
        try:
            oauth_data['user_id'] = user_id
            
            # Check if OAuth account already exists
            existing_oauth = self.supabase.table('oauth_accounts').select("id").eq("user_id", user_id).eq("provider", oauth_data['provider']).execute()
            
            if existing_oauth.data:
                # Update existing OAuth account
                return self.update_record('oauth_accounts', existing_oauth.data[0]['id'], oauth_data)
            else:
                # Create new OAuth account
                return self.create_record('oauth_accounts', oauth_data)
                
        except Exception as e:
            raise Exception(f"Failed to create OAuth account: {str(e)}")
    
    def get_user_by_oauth(self, provider: str, provider_user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by OAuth provider information"""
        try:
            oauth_result = self.supabase.table('oauth_accounts').select("""
                *,
                users:user_id (*)
            """).eq("provider", provider).eq("provider_user_id", provider_user_id).execute()
            
            if oauth_result.data:
                user = oauth_result.data[0]['users']
                if 'password_hash' in user:
                    del user['password_hash']
                return user
            
            return None
            
        except Exception as e:
            raise Exception(f"Failed to get user by OAuth: {str(e)}")
    
    def search_users(self, search_term: str, user_type: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        """Search users by name or email"""
        try:
            query = self.supabase.table('users').select("""
                id,
                email,
                first_name,
                last_name,
                user_type,
                profile_image_url,
                is_active
            """)
            
            # Apply search filter
            query = query.or_(f"first_name.ilike.%{search_term}%,last_name.ilike.%{search_term}%,email.ilike.%{search_term}%")
            
            # Apply user type filter
            if user_type:
                query = query.eq("user_type", user_type)
            
            # Apply limit
            query = query.limit(limit)
            
            result = query.execute()
            return result.data or []
            
        except Exception as e:
            raise Exception(f"Failed to search users: {str(e)}")
    
    def deactivate_user(self, user_id: str) -> bool:
        """Deactivate user account"""
        try:
            self.update_record('users', user_id, {'is_active': False})
            return True
        except Exception as e:
            raise Exception(f"Failed to deactivate user: {str(e)}")
    
    def verify_user_email(self, user_id: str) -> bool:
        """Mark user email as verified"""
        try:
            self.update_record('users', user_id, {
                'is_verified': True,
                'email_verified_at': datetime.utcnow().isoformat()
            })
            return True
        except Exception as e:
            raise Exception(f"Failed to verify user email: {str(e)}")
    
    def change_user_password(self, user_id: str, new_password: str) -> bool:
        """Change user password"""
        try:
            password_hash = bcrypt.hashpw(
                new_password.encode('utf-8'), 
                bcrypt.gensalt()
            ).decode('utf-8')
            
            self.update_record('users', user_id, {'password_hash': password_hash})
            return True
        except Exception as e:
            raise Exception(f"Failed to change password: {str(e)}")


# Create global instance function
def get_user_service():
    """Get user service instance"""
    return UserService()

