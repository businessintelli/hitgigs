"""
User service for HotGigs.ai
Handles user management, authentication, and profile operations
"""

import bcrypt
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
from src.models.database import get_database_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserService:
    """User service for managing user accounts and profiles"""
    
    def __init__(self):
        """Initialize user service"""
        self.db = get_database_service()
        logger.info("User service initialized")
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def create_user(self, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new user account"""
        try:
            # Hash password if provided
            if 'password' in user_data:
                user_data['password_hash'] = self.hash_password(user_data['password'])
                del user_data['password']
            
            # Set default values
            user_data.setdefault('is_active', True)
            user_data.setdefault('is_verified', False)
            user_data.setdefault('created_at', datetime.now(timezone.utc).isoformat())
            
            # Create user
            user = self.db.create_user(user_data)
            if not user:
                return None
            
            # Create profile based on user type
            if user['user_type'] == 'candidate':
                self.create_candidate_profile(user['id'])
            elif user['user_type'] == 'freelance_recruiter':
                self.create_recruiter_profile(user['id'])
            
            logger.info(f"Created user: {user['email']} ({user['user_type']})")
            return user
            
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        try:
            user = self.db.get_user_by_email(email)
            if not user:
                return None
            
            if not user.get('is_active', False):
                return None
            
            if not user.get('password_hash'):
                return None
            
            if not self.verify_password(password, user['password_hash']):
                return None
            
            # Update last login
            self.db.update_record('users', user['id'], {
                'last_login_at': datetime.now(timezone.utc).isoformat()
            })
            
            logger.info(f"User authenticated: {email}")
            return user
            
        except Exception as e:
            logger.error(f"Error authenticating user: {str(e)}")
            raise
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        return self.db.get_user_by_email(email)
    
    def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get complete user profile"""
        return self.db.get_user_profile(user_id)
    
    def update_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user profile"""
        try:
            # Remove sensitive fields
            profile_data.pop('password', None)
            profile_data.pop('password_hash', None)
            profile_data.pop('id', None)
            profile_data.pop('created_at', None)
            
            return self.db.update_record('users', user_id, profile_data)
            
        except Exception as e:
            logger.error(f"Error updating user profile: {str(e)}")
            raise
    
    def create_candidate_profile(self, user_id: str, profile_data: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """Create candidate profile"""
        try:
            data = profile_data or {}
            data['user_id'] = user_id
            data.setdefault('created_at', datetime.now(timezone.utc).isoformat())
            
            return self.db.create_record('candidate_profiles', data)
            
        except Exception as e:
            logger.error(f"Error creating candidate profile: {str(e)}")
            raise
    
    def update_candidate_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update candidate profile"""
        try:
            # Get candidate profile
            profiles = self.db.get_records('candidate_profiles', {'user_id': user_id})
            if not profiles:
                return self.create_candidate_profile(user_id, profile_data)
            
            profile_id = profiles[0]['id']
            return self.db.update_record('candidate_profiles', profile_id, profile_data)
            
        except Exception as e:
            logger.error(f"Error updating candidate profile: {str(e)}")
            raise
    
    def add_candidate_experience(self, user_id: str, experience_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Add work experience to candidate profile"""
        try:
            # Get candidate profile
            profiles = self.db.get_records('candidate_profiles', {'user_id': user_id})
            if not profiles:
                return None
            
            experience_data['candidate_id'] = profiles[0]['id']
            experience_data.setdefault('created_at', datetime.now(timezone.utc).isoformat())
            
            return self.db.create_record('work_experiences', experience_data)
            
        except Exception as e:
            logger.error(f"Error adding candidate experience: {str(e)}")
            raise
    
    def add_candidate_education(self, user_id: str, education_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Add education to candidate profile"""
        try:
            # Get candidate profile
            profiles = self.db.get_records('candidate_profiles', {'user_id': user_id})
            if not profiles:
                return None
            
            education_data['candidate_id'] = profiles[0]['id']
            education_data.setdefault('created_at', datetime.now(timezone.utc).isoformat())
            
            return self.db.create_record('education', education_data)
            
        except Exception as e:
            logger.error(f"Error adding candidate education: {str(e)}")
            raise
    
    def create_recruiter_profile(self, user_id: str, profile_data: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """Create freelance recruiter profile"""
        try:
            data = profile_data or {}
            data['user_id'] = user_id
            data.setdefault('total_placements', 0)
            data.setdefault('is_verified', False)
            data.setdefault('created_at', datetime.now(timezone.utc).isoformat())
            
            return self.db.create_record('freelance_recruiter_profiles', data)
            
        except Exception as e:
            logger.error(f"Error creating recruiter profile: {str(e)}")
            raise
    
    def get_user_by_oauth(self, provider: str, provider_user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by OAuth provider information"""
        try:
            oauth_records = self.db.get_records('oauth_providers', {
                'provider': provider,
                'provider_user_id': provider_user_id
            })
            
            if not oauth_records:
                return None
            
            user_id = oauth_records[0]['user_id']
            return self.db.get_record_by_id('users', user_id)
            
        except Exception as e:
            logger.error(f"Error getting user by OAuth: {str(e)}")
            raise
    
    def create_oauth_user(self, provider: str, provider_data: Dict[str, Any], user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create user from OAuth provider data"""
        try:
            # Create user
            user = self.create_user(user_data)
            if not user:
                return None
            
            # Create OAuth provider record
            oauth_data = {
                'user_id': user['id'],
                'provider': provider,
                'provider_user_id': provider_data['id'],
                'access_token': provider_data.get('access_token'),
                'refresh_token': provider_data.get('refresh_token'),
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            self.db.create_record('oauth_providers', oauth_data)
            
            logger.info(f"Created OAuth user: {user['email']} via {provider}")
            return user
            
        except Exception as e:
            logger.error(f"Error creating OAuth user: {str(e)}")
            raise
    
    def search_users(self, search_term: str, user_type: Optional[str] = None, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Search users by name or email"""
        try:
            filters = {}
            if user_type:
                filters['user_type'] = user_type
            
            # Search in first_name, last_name, and email
            users = []
            
            # Search by first name
            first_name_results = self.db.search_records('users', 'first_name', search_term, filters, limit)
            users.extend(first_name_results)
            
            # Search by last name
            last_name_results = self.db.search_records('users', 'last_name', search_term, filters, limit)
            users.extend(last_name_results)
            
            # Search by email
            email_results = self.db.search_records('users', 'email', search_term, filters, limit)
            users.extend(email_results)
            
            # Remove duplicates
            seen_ids = set()
            unique_users = []
            for user in users:
                if user['id'] not in seen_ids:
                    seen_ids.add(user['id'])
                    unique_users.append(user)
            
            return unique_users[:limit] if limit else unique_users
            
        except Exception as e:
            logger.error(f"Error searching users: {str(e)}")
            raise
    
    def change_password(self, user_id: str, old_password: str, new_password: str) -> bool:
        """Change user password"""
        try:
            user = self.db.get_record_by_id('users', user_id)
            if not user:
                return False
            
            if not user.get('password_hash'):
                return False
            
            if not self.verify_password(old_password, user['password_hash']):
                return False
            
            new_hash = self.hash_password(new_password)
            result = self.db.update_record('users', user_id, {'password_hash': new_hash})
            
            logger.info(f"Password changed for user: {user['email']}")
            return result is not None
            
        except Exception as e:
            logger.error(f"Error changing password: {str(e)}")
            raise
    
    def deactivate_user(self, user_id: str) -> bool:
        """Deactivate user account"""
        try:
            result = self.db.update_record('users', user_id, {'is_active': False})
            logger.info(f"User deactivated: {user_id}")
            return result is not None
            
        except Exception as e:
            logger.error(f"Error deactivating user: {str(e)}")
            raise
    
    def get_user_applications(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all job applications for a user"""
        return self.db.get_user_applications(user_id)
    
    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get user statistics"""
        try:
            user = self.db.get_record_by_id('users', user_id)
            if not user:
                return {}
            
            stats = {
                'user_type': user['user_type'],
                'member_since': user['created_at'],
                'last_login': user.get('last_login_at'),
                'is_verified': user.get('is_verified', False)
            }
            
            if user['user_type'] == 'candidate':
                applications = self.get_user_applications(user_id)
                stats.update({
                    'total_applications': len(applications),
                    'pending_applications': len([a for a in applications if a['status'] == 'pending']),
                    'interview_count': len([a for a in applications if a['status'] == 'interviewing'])
                })
            
            elif user['user_type'] == 'company':
                # Get company jobs and applications
                memberships = self.db.get_records('company_members', {'user_id': user_id})
                if memberships:
                    company_id = memberships[0]['company_id']
                    jobs = self.db.get_company_jobs(company_id)
                    total_applications = sum(job.get('application_count', 0) for job in jobs)
                    
                    stats.update({
                        'total_jobs_posted': len(jobs),
                        'active_jobs': len([j for j in jobs if j['status'] == 'active']),
                        'total_applications_received': total_applications
                    })
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting user stats: {str(e)}")
            return {}

# Create global instance function
def get_user_service():
    """Get user service instance"""
    return UserService()

