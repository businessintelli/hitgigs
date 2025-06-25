"""
Supabase Database Service for HotGigs.ai
Handles all database operations using Supabase Python client
"""

import os
import logging
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
    def create_user(self, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new user"""
        return self.create_record('users', user_data)
    
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
    
    # Health check
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

