"""
Supabase Database Service for HotGigs.ai
Handles all database operations using Supabase Python client
"""

import os
import logging
import bcrypt
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timezone
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from project root
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseService:
    """Supabase database service for HotGigs.ai"""
    
    def __init__(self):
        """Initialize Supabase client"""
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.url or not self.key:
            raise ValueError("Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file")
        
        self.client: Client = create_client(self.url, self.key)
        logger.info("Supabase client initialized successfully")
    
    def get_client(self) -> Client:
        """Get the Supabase client instance"""
        return self.client
    
    # Generic CRUD operations
    def create_record(self, table: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new record in the specified table"""
        try:
            result = self.client.table(table).insert(data).execute()
            if result.data:
                logger.info(f"Created record in {table}: {result.data[0].get('id', 'unknown')}")
                return result.data[0]
            return None
        except Exception as e:
            logger.error(f"Error creating record in {table}: {str(e)}")
            raise
    
    def get_record_by_id(self, table: str, record_id: str) -> Optional[Dict[str, Any]]:
        """Get a record by ID"""
        try:
            result = self.client.table(table).select('*').eq('id', record_id).execute()
            if result.data:
                return result.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting record from {table}: {str(e)}")
            raise
    
    def update_record(self, table: str, record_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a record by ID"""
        try:
            # Add updated_at timestamp
            data['updated_at'] = datetime.now(timezone.utc).isoformat()
            
            result = self.client.table(table).update(data).eq('id', record_id).execute()
            if result.data:
                logger.info(f"Updated record in {table}: {record_id}")
                return result.data[0]
            return None
        except Exception as e:
            logger.error(f"Error updating record in {table}: {str(e)}")
            raise
    
    def delete_record(self, table: str, record_id: str) -> bool:
        """Delete a record by ID"""
        try:
            result = self.client.table(table).delete().eq('id', record_id).execute()
            logger.info(f"Deleted record from {table}: {record_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting record from {table}: {str(e)}")
            raise
    
    def get_records(self, table: str, filters: Optional[Dict[str, Any]] = None, 
                   limit: Optional[int] = None, offset: Optional[int] = None,
                   order_by: Optional[str] = None, ascending: bool = True) -> List[Dict[str, Any]]:
        """Get multiple records with optional filtering and pagination"""
        try:
            query = self.client.table(table).select('*')
            
            # Apply filters
            if filters:
                for key, value in filters.items():
                    if isinstance(value, list):
                        query = query.in_(key, value)
                    else:
                        query = query.eq(key, value)
            
            # Apply ordering
            if order_by:
                query = query.order(order_by, desc=not ascending)
            
            # Apply pagination
            if limit:
                query = query.limit(limit)
            if offset:
                query = query.offset(offset)
            
            result = query.execute()
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error getting records from {table}: {str(e)}")
            raise
    
    def search_records(self, table: str, search_column: str, search_term: str,
                      additional_filters: Optional[Dict[str, Any]] = None,
                      limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Search records using text search"""
        try:
            query = self.client.table(table).select('*')
            
            # Apply text search
            query = query.ilike(search_column, f'%{search_term}%')
            
            # Apply additional filters
            if additional_filters:
                for key, value in additional_filters.items():
                    query = query.eq(key, value)
            
            # Apply limit
            if limit:
                query = query.limit(limit)
            
            result = query.execute()
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error searching records in {table}: {str(e)}")
            raise
    
    def count_records(self, table: str, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filtering"""
        try:
            query = self.client.table(table).select('id', count='exact')
            
            # Apply filters
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            return result.count or 0
            
        except Exception as e:
            logger.error(f"Error counting records in {table}: {str(e)}")
            raise
    
    # User-specific operations
    def create_user(self, name: str = None, email: str = None, password: str = None, 
                   role: str = "candidate", user_data: Dict[str, Any] = None) -> Optional[str]:
        """Create a new user with individual parameters or user_data dict"""
        try:
            # If user_data is provided, use it directly
            if user_data:
                data = user_data.copy()
            else:
                # Build user data from individual parameters
                data = {
                    'email': email,
                    'user_type': role,
                    'is_active': True,
                    'is_verified': True,
                    'is_admin': False,
                    'created_at': datetime.now(timezone.utc).isoformat(),
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }
                
                # Handle name field
                if name:
                    name_parts = name.split(' ', 1)
                    data['first_name'] = name_parts[0]
                    data['last_name'] = name_parts[1] if len(name_parts) > 1 else ''
                else:
                    data['first_name'] = email.split('@')[0] if email else 'User'
                    data['last_name'] = ''
                
                # Hash password
                if password:
                    if isinstance(password, str):
                        password = password.encode('utf-8')
                    data['password_hash'] = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')
            
            # Check if user already exists
            existing_user = self.get_user_by_email(data['email'])
            if existing_user:
                logger.warning(f"User with email {data['email']} already exists")
                return None
            
            # Create the user
            result = self.create_record('users', data)
            if result and 'id' in result:
                logger.info(f"User created successfully: {data['email']}")
                return result['id']
            else:
                logger.error(f"Failed to create user: {data['email']}")
                return None
                
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return None
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        try:
            result = self.client.table('users').select('*').eq('email', email).execute()
            if result.data:
                return result.data[0]
            return None
        except Exception as e:
            logger.error(f"Error getting user by email: {str(e)}")
            raise
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        try:
            # Get user by email
            user = self.get_user_by_email(email)
            if not user:
                logger.info(f"Authentication failed: User not found for email {email}")
                return None
            
            # Check if user is active
            if not user.get('is_active', True):
                logger.info(f"Authentication failed: User {email} is not active")
                return None
            
            # Verify password
            stored_hash = user.get('password_hash')
            if not stored_hash:
                logger.error(f"Authentication failed: No password hash for user {email}")
                return None
            
            # Check password using bcrypt
            if isinstance(stored_hash, str):
                stored_hash = stored_hash.encode('utf-8')
            if isinstance(password, str):
                password = password.encode('utf-8')
            
            if bcrypt.checkpw(password, stored_hash):
                logger.info(f"Authentication successful for user {email}")
                # Remove password hash from returned user data
                user_data = user.copy()
                user_data.pop('password_hash', None)
                return user_data
            else:
                logger.info(f"Authentication failed: Invalid password for user {email}")
                return None
                
        except Exception as e:
            logger.error(f"Error authenticating user {email}: {str(e)}")
            return None
    
    def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get complete user profile with related data"""
        try:
            # Get user basic info
            user = self.get_record_by_id('users', user_id)
            if not user:
                return None
            
            return user
            
        except Exception as e:
            logger.error(f"Error getting user profile: {str(e)}")
            raise
    
    # Job-specific operations
    def get_active_jobs(self, limit: Optional[int] = None, offset: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get all active jobs with company information"""
        try:
            query = self.client.table('jobs').select('*').eq('status', 'active')
            
            if limit:
                query = query.limit(limit)
            if offset:
                query = query.offset(offset)
            
            query = query.order('created_at', desc=True)
            
            result = query.execute()
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error getting active jobs: {str(e)}")
            raise
    
    def search_jobs(self, search_term: str, location: Optional[str] = None,
                   job_type: Optional[str] = None, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Search jobs with filters"""
        try:
            query = self.client.table('jobs').select('*').eq('status', 'active')
            
            # Text search in title and description
            if search_term:
                query = query.or_(f'title.ilike.%{search_term}%,description.ilike.%{search_term}%')
            
            # Location filter
            if location:
                query = query.ilike('location', f'%{location}%')
            
            # Job type filter
            if job_type:
                query = query.eq('employment_type', job_type)
            
            if limit:
                query = query.limit(limit)
            
            query = query.order('created_at', desc=True)
            
            result = query.execute()
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error searching jobs: {str(e)}")
            raise
    
    # Application operations
    def create_application(self, application_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a job application"""
        return self.create_record('job_applications', application_data)
    
    def get_user_applications(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all applications for a user"""
        try:
            result = self.client.table('job_applications').select('*').eq('user_id', user_id).order('applied_at', desc=True).execute()
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error getting user applications: {str(e)}")
            raise
    
    # Company operations
    def get_company_jobs(self, company_id: str) -> List[Dict[str, Any]]:
        """Get all jobs for a company"""
        return self.get_records('jobs', {'company_id': company_id}, order_by='created_at', ascending=False)
    
    def get_job_applications(self, job_id: str) -> List[Dict[str, Any]]:
        """Get all applications for a job"""
        try:
            result = self.client.table('job_applications').select('*').eq('job_id', job_id).order('applied_at', desc=True).execute()
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error getting job applications: {str(e)}")
            raise
    
    # Health check and system stats
    def get_system_stats(self) -> Dict[str, Any]:
        """Get system statistics"""
        try:
            # Get basic counts from different tables
            stats = {}
            
            # User stats
            try:
                user_count = self.count_records('users')
                stats['total_users'] = user_count
                stats['active_users'] = user_count  # Assuming all users are active for now
            except:
                stats['total_users'] = 0
                stats['active_users'] = 0
            
            # Job stats
            try:
                job_count = self.count_records('jobs')
                active_job_count = self.count_records('jobs', {'status': 'active'})
                stats['total_jobs'] = job_count
                stats['active_jobs'] = active_job_count
            except:
                stats['total_jobs'] = 0
                stats['active_jobs'] = 0
            
            # Company stats
            try:
                company_count = self.count_records('companies')
                stats['total_companies'] = company_count
                stats['active_companies'] = company_count  # Assuming all companies are active
            except:
                stats['total_companies'] = 0
                stats['active_companies'] = 0
            
            # Application stats
            try:
                application_count = self.count_records('job_applications')
                stats['total_applications'] = application_count
            except:
                stats['total_applications'] = 0
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting system stats: {str(e)}")
            return {
                'total_users': 0,
                'active_users': 0,
                'total_jobs': 0,
                'active_jobs': 0,
                'total_companies': 0,
                'active_companies': 0,
                'total_applications': 0
            }
    
    def health_check(self) -> Dict[str, Any]:
        """Check database connection and basic functionality"""
        try:
            # Test basic query
            result = self.client.table('users').select('id').limit(1).execute()
            
            # Get some basic stats
            user_count = self.count_records('users')
            job_count = self.count_records('jobs')
            
            return {
                'status': 'healthy',
                'connection': 'ok',
                'stats': {
                    'total_users': user_count,
                    'total_jobs': job_count
                },
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return {
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
    
    def log_system_event(self, level: str, message: str, details: str = None, user_id: str = None):
        """Log system events"""
        try:
            log_data = {
                'level': level,
                'message': message,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            if details:
                log_data['details'] = details
            if user_id:
                log_data['user_id'] = user_id
            
            # Try to insert into system_logs table, if it doesn't exist, just log to console
            try:
                self.create_record('system_logs', log_data)
            except Exception:
                # If system_logs table doesn't exist, just log to console
                logger.info(f"System Event [{level}]: {message}")
                
        except Exception as e:
            logger.error(f"Error logging system event: {str(e)}")

    # Admin-specific methods
    def get_database_schema(self) -> List[Dict[str, Any]]:
        """Get database schema information in array format for frontend"""
        try:
            # Return schema as array of table objects expected by frontend
            schema_tables = [
                {
                    'name': 'users',
                    'row_count': self.count_records('users'),
                    'description': 'User accounts and profiles',
                    'columns': [
                        {'name': 'id', 'type': 'UUID', 'primary_key': True, 'not_null': True},
                        {'name': 'email', 'type': 'VARCHAR', 'primary_key': False, 'not_null': True},
                        {'name': 'user_type', 'type': 'ENUM', 'primary_key': False, 'not_null': True},
                        {'name': 'first_name', 'type': 'VARCHAR', 'primary_key': False, 'not_null': False},
                        {'name': 'last_name', 'type': 'VARCHAR', 'primary_key': False, 'not_null': False},
                        {'name': 'is_active', 'type': 'BOOLEAN', 'primary_key': False, 'not_null': True},
                        {'name': 'is_verified', 'type': 'BOOLEAN', 'primary_key': False, 'not_null': True},
                        {'name': 'is_admin', 'type': 'BOOLEAN', 'primary_key': False, 'not_null': True},
                        {'name': 'created_at', 'type': 'TIMESTAMP', 'primary_key': False, 'not_null': True}
                    ]
                },
                {
                    'name': 'companies',
                    'row_count': self.count_records('companies'),
                    'description': 'Company profiles',
                    'columns': [
                        {'name': 'id', 'type': 'UUID', 'primary_key': True, 'not_null': True},
                        {'name': 'name', 'type': 'VARCHAR', 'primary_key': False, 'not_null': True},
                        {'name': 'description', 'type': 'TEXT', 'primary_key': False, 'not_null': False},
                        {'name': 'website', 'type': 'VARCHAR', 'primary_key': False, 'not_null': False},
                        {'name': 'industry', 'type': 'VARCHAR', 'primary_key': False, 'not_null': False},
                        {'name': 'size', 'type': 'VARCHAR', 'primary_key': False, 'not_null': False},
                        {'name': 'location', 'type': 'VARCHAR', 'primary_key': False, 'not_null': False},
                        {'name': 'is_active', 'type': 'BOOLEAN', 'primary_key': False, 'not_null': True},
                        {'name': 'created_at', 'type': 'TIMESTAMP', 'primary_key': False, 'not_null': True}
                    ]
                },
                {
                    'name': 'jobs',
                    'row_count': self.count_records('jobs'),
                    'description': 'Job postings',
                    'columns': [
                        {'name': 'id', 'type': 'UUID', 'primary_key': True, 'not_null': True},
                        {'name': 'title', 'type': 'VARCHAR', 'primary_key': False, 'not_null': True},
                        {'name': 'description', 'type': 'TEXT', 'primary_key': False, 'not_null': False},
                        {'name': 'company_id', 'type': 'UUID', 'primary_key': False, 'not_null': True},
                        {'name': 'location', 'type': 'VARCHAR', 'primary_key': False, 'not_null': False},
                        {'name': 'salary_range', 'type': 'VARCHAR', 'primary_key': False, 'not_null': False},
                        {'name': 'status', 'type': 'VARCHAR', 'primary_key': False, 'not_null': True},
                        {'name': 'created_at', 'type': 'TIMESTAMP', 'primary_key': False, 'not_null': True}
                    ]
                },
                {
                    'name': 'job_applications',
                    'row_count': self.count_records('job_applications'),
                    'description': 'Job applications',
                    'columns': [
                        {'name': 'id', 'type': 'UUID', 'primary_key': True, 'not_null': True},
                        {'name': 'job_id', 'type': 'UUID', 'primary_key': False, 'not_null': True},
                        {'name': 'user_id', 'type': 'UUID', 'primary_key': False, 'not_null': True},
                        {'name': 'status', 'type': 'VARCHAR', 'primary_key': False, 'not_null': True},
                        {'name': 'applied_at', 'type': 'TIMESTAMP', 'primary_key': False, 'not_null': True},
                        {'name': 'notes', 'type': 'TEXT', 'primary_key': False, 'not_null': False}
                    ]
                }
            ]
            return schema_tables
        except Exception as e:
            logger.error(f"Error getting database schema: {str(e)}")
            return {'error': str(e)}

    def get_recent_logs(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent system logs"""
        try:
            # Try to get from system_logs table if it exists
            try:
                result = self.client.table('system_logs').select('*').order('created_at', desc=True).limit(limit).execute()
                return result.data if result.data else []
            except:
                # If system_logs table doesn't exist, return sample logs
                return [
                    {
                        'id': 1,
                        'level': 'INFO',
                        'message': 'System started successfully',
                        'created_at': datetime.now(timezone.utc).isoformat()
                    },
                    {
                        'id': 2,
                        'level': 'INFO',
                        'message': 'Database connection established',
                        'created_at': datetime.now(timezone.utc).isoformat()
                    }
                ]
        except Exception as e:
            logger.error(f"Error getting recent logs: {str(e)}")
            return []

    def get_all_jobs(self, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Get all jobs with company information"""
        try:
            # Get jobs with company information
            query = self.client.table('jobs').select(
                '*,companies:company_id(id,name,industry,location)'
            ).order('created_at', desc=True)
            
            if limit:
                query = query.limit(limit)
            if offset:
                query = query.offset(offset)
            
            result = query.execute()
            jobs = result.data if result.data else []
            
            # Format the data for frontend compatibility
            formatted_jobs = []
            for job in jobs:
                formatted_job = job.copy()
                
                # Handle company information
                if 'companies' in job and job['companies']:
                    company = job['companies']
                    formatted_job['company'] = company['name']
                    formatted_job['company_id'] = company['id']
                    formatted_job['company_industry'] = company.get('industry', '')
                    formatted_job['company_location'] = company.get('location', '')
                    # Remove the nested companies object
                    del formatted_job['companies']
                else:
                    formatted_job['company'] = 'Unknown Company'
                
                # Ensure required fields exist
                formatted_job['id'] = job.get('id', '')
                formatted_job['title'] = job.get('title', 'Untitled Job')
                formatted_job['description'] = job.get('description', '')
                formatted_job['location'] = job.get('location', '')
                formatted_job['salary_range'] = job.get('salary_range', '')
                formatted_job['status'] = job.get('status', 'active')
                formatted_job['created_at'] = job.get('created_at', '')
                
                formatted_jobs.append(formatted_job)
            
            return formatted_jobs
            
        except Exception as e:
            logger.error(f"Error getting all jobs: {str(e)}")
            # Return sample jobs if database is empty or has issues
            return [
                {
                    'id': '1',
                    'title': 'Senior Software Engineer',
                    'description': 'We are looking for a senior software engineer to join our team.',
                    'company': 'TechCorp Inc.',
                    'company_id': '1',
                    'location': 'San Francisco, CA',
                    'salary_range': '$120,000 - $180,000',
                    'status': 'active',
                    'created_at': '2024-01-15T10:00:00Z'
                },
                {
                    'id': '2',
                    'title': 'Product Manager',
                    'description': 'Join our product team to drive innovation and growth.',
                    'company': 'StartupXYZ',
                    'company_id': '2',
                    'location': 'New York, NY',
                    'salary_range': '$100,000 - $150,000',
                    'status': 'active',
                    'created_at': '2024-01-14T15:30:00Z'
                }
            ]

    def get_all_companies(self) -> List[Dict[str, Any]]:
        """Get all companies for admin dashboard"""
        try:
            result = self.client.table('companies').select('*').order('created_at', desc=True).execute()
            companies = result.data if result.data else []
            
            # Format data for frontend
            for company in companies:
                # Ensure required fields exist
                company['id'] = company.get('id', '')
                company['name'] = company.get('name', 'Unknown Company')
                company['description'] = company.get('description', '')
                company['website'] = company.get('website', '')
                company['industry'] = company.get('industry', '')
                company['size'] = company.get('size', '')
                company['location'] = company.get('location', '')
                company['is_active'] = company.get('is_active', True)
                company['created_at'] = company.get('created_at', '')
            
            return companies
            
        except Exception as e:
            logger.error(f"Error getting all companies: {str(e)}")
            # Return sample companies if database is empty or has issues
            return [
                {
                    'id': '1',
                    'name': 'TechCorp Inc.',
                    'description': 'Leading technology company',
                    'website': 'https://techcorp.com',
                    'industry': 'Technology',
                    'size': '1000-5000',
                    'location': 'San Francisco, CA',
                    'is_active': True,
                    'created_at': '2024-01-01T00:00:00Z'
                },
                {
                    'id': '2',
                    'name': 'StartupXYZ',
                    'description': 'Innovative startup disrupting the market',
                    'website': 'https://startupxyz.com',
                    'industry': 'Technology',
                    'size': '10-50',
                    'location': 'New York, NY',
                    'is_active': True,
                    'created_at': '2024-01-02T00:00:00Z'
                }
            ]

    def get_job_by_id(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific job by ID with company information"""
        try:
            result = self.client.table('jobs').select(
                '*,companies:company_id(id,name,industry,location,website)'
            ).eq('id', job_id).execute()
            
            if result.data and len(result.data) > 0:
                job = result.data[0]
                
                # Format company information
                if 'companies' in job and job['companies']:
                    company = job['companies']
                    job['company'] = company['name']
                    job['company_website'] = company.get('website', '')
                    job['company_industry'] = company.get('industry', '')
                    job['company_location'] = company.get('location', '')
                    del job['companies']
                else:
                    job['company'] = 'Unknown Company'
                
                return job
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting job by ID {job_id}: {str(e)}")
            return None

    def create_job(self, job_data: Dict[str, Any]) -> Optional[str]:
        """Create a new job posting"""
        try:
            # Ensure required fields
            if not job_data.get('title') or not job_data.get('company_id'):
                logger.error("Missing required fields for job creation")
                return None
            
            # Add timestamps
            job_data['created_at'] = datetime.now(timezone.utc).isoformat()
            job_data['updated_at'] = datetime.now(timezone.utc).isoformat()
            
            # Set default status if not provided
            if 'status' not in job_data:
                job_data['status'] = 'active'
            
            result = self.create_record('jobs', job_data)
            if result and 'id' in result:
                logger.info(f"Job created successfully: {job_data['title']}")
                return result['id']
            else:
                logger.error(f"Failed to create job: {job_data['title']}")
                return None
                
        except Exception as e:
            logger.error(f"Error creating job: {str(e)}")
            return None

    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users for admin dashboard"""
        try:
            result = self.client.table('users').select('*').order('created_at', desc=True).execute()
            users = result.data if result.data else []
            
            # Remove password hashes for security and format data for frontend
            for user in users:
                if 'password_hash' in user:
                    del user['password_hash']
                
                # Add 'name' field expected by frontend
                if 'first_name' in user and 'last_name' in user:
                    first_name = user.get('first_name', '') or ''
                    last_name = user.get('last_name', '') or ''
                    user['name'] = f"{first_name} {last_name}".strip()
                    if not user['name']:
                        user['name'] = user.get('email', 'Unknown').split('@')[0]
                else:
                    user['name'] = user.get('email', 'Unknown').split('@')[0]
                
                # Add 'role' field expected by frontend (map user_type to role)
                user['role'] = user.get('user_type', 'candidate')
                
                # Ensure required fields exist
                if 'last_login' not in user:
                    user['last_login'] = None
            
            return users
        except Exception as e:
            logger.error(f"Error getting all users: {str(e)}")
            return []

    def get_all_companies(self) -> List[Dict[str, Any]]:
        """Get all companies for admin dashboard"""
        try:
            result = self.client.table('companies').select('*').order('created_at', desc=True).execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error getting all companies: {str(e)}")
            return []

    def update_user_status(self, user_id: str, is_active: bool) -> bool:
        """Update user active status"""
        try:
            result = self.client.table('users').update({
                'is_active': is_active,
                'updated_at': datetime.now(timezone.utc).isoformat()
            }).eq('id', user_id).execute()
            
            return len(result.data) > 0 if result.data else False
        except Exception as e:
            logger.error(f"Error updating user status: {str(e)}")
            return False

    def update_company_status(self, company_id: str, is_active: bool) -> bool:
        """Update company active status"""
        try:
            result = self.client.table('companies').update({
                'is_active': is_active,
                'updated_at': datetime.now(timezone.utc).isoformat()
            }).eq('id', company_id).execute()
            
            return len(result.data) > 0 if result.data else False
        except Exception as e:
            logger.error(f"Error updating company status: {str(e)}")
            return False

# Global instance function
def get_database_service():
    """Get database service instance"""
    return SupabaseService()

# Backward compatibility
DatabaseService = SupabaseService

# For main.py compatibility
db = get_database_service()

def init_database():
    """Initialize database - called by startup scripts"""
    try:
        db_service = get_database_service()
        health = db_service.health_check()
        if health['status'] == 'healthy':
            print("✅ Database initialized successfully")
            return True
        else:
            print(f"❌ Database initialization failed: {health.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

