"""
Base database service for HotGigs.ai
Provides common database operations using Supabase
"""

from typing import Dict, List, Optional, Any
from flask import current_app
from supabase import Client
import uuid
from datetime import datetime


class DatabaseService:
    """Base service class for database operations"""
    
    def __init__(self):
        pass
    
    @property
    def supabase(self) -> Client:
        """Get Supabase client from current app"""
        return current_app.supabase
    
    def create_record(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record in the specified table"""
        try:
            # Add created_at timestamp if not present
            if 'created_at' not in data:
                data['created_at'] = datetime.utcnow().isoformat()
            
            result = self.supabase.table(table).insert(data).execute()
            if result.data:
                return result.data[0]
            else:
                raise Exception("Failed to create record")
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def get_record_by_id(self, table: str, record_id: str) -> Optional[Dict[str, Any]]:
        """Get a record by ID"""
        try:
            result = self.supabase.table(table).select("*").eq("id", record_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def get_records(self, table: str, filters: Optional[Dict[str, Any]] = None, 
                   limit: Optional[int] = None, offset: Optional[int] = None,
                   order_by: Optional[str] = None, ascending: bool = True) -> List[Dict[str, Any]]:
        """Get multiple records with optional filtering and pagination"""
        try:
            query = self.supabase.table(table).select("*")
            
            # Apply filters
            if filters:
                for key, value in filters.items():
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
            raise Exception(f"Database error: {str(e)}")
    
    def update_record(self, table: str, record_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a record by ID"""
        try:
            # Add updated_at timestamp
            data['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.supabase.table(table).update(data).eq("id", record_id).execute()
            if result.data:
                return result.data[0]
            else:
                raise Exception("Failed to update record")
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def delete_record(self, table: str, record_id: str) -> bool:
        """Delete a record by ID"""
        try:
            result = self.supabase.table(table).delete().eq("id", record_id).execute()
            return True
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def search_records(self, table: str, search_column: str, search_term: str,
                      additional_filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Search records using text search"""
        try:
            query = self.supabase.table(table).select("*").ilike(search_column, f"%{search_term}%")
            
            # Apply additional filters
            if additional_filters:
                for key, value in additional_filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            return result.data or []
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def count_records(self, table: str, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filtering"""
        try:
            query = self.supabase.table(table).select("id", count="exact")
            
            # Apply filters
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            return result.count or 0
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def execute_rpc(self, function_name: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """Execute a stored procedure/function"""
        try:
            result = self.supabase.rpc(function_name, params or {}).execute()
            return result.data
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def generate_uuid(self) -> str:
        """Generate a new UUID"""
        return str(uuid.uuid4())
    
    def batch_insert(self, table: str, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Insert multiple records in a batch"""
        try:
            # Add created_at timestamp to all records
            for record in records:
                if 'created_at' not in record:
                    record['created_at'] = datetime.utcnow().isoformat()
            
            result = self.supabase.table(table).insert(records).execute()
            return result.data or []
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email address"""
        try:
            result = self.supabase.table('users').select("*").eq("email", email).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def get_company_members(self, company_id: str, active_only: bool = True) -> List[Dict[str, Any]]:
        """Get all members of a company"""
        try:
            query = self.supabase.table('company_members').select("""
                *,
                users:user_id (
                    id,
                    email,
                    first_name,
                    last_name,
                    profile_image_url
                )
            """).eq("company_id", company_id)
            
            if active_only:
                query = query.eq("is_active", True)
            
            result = query.execute()
            return result.data or []
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def get_user_companies(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all companies a user is a member of"""
        try:
            result = self.supabase.table('company_members').select("""
                *,
                companies:company_id (
                    id,
                    name,
                    slug,
                    logo_url,
                    industry
                )
            """).eq("user_id", user_id).eq("is_active", True).execute()
            
            return result.data or []
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def check_user_permission(self, user_id: str, company_id: str, required_role: str = None) -> bool:
        """Check if user has permission to access company resources"""
        try:
            query = self.supabase.table('company_members').select("role").eq("user_id", user_id).eq("company_id", company_id).eq("is_active", True)
            
            result = query.execute()
            if not result.data:
                return False
            
            user_role = result.data[0]['role']
            
            # Role hierarchy: admin > recruiter > account_manager > viewer
            role_hierarchy = {
                'admin': 4,
                'recruiter': 3,
                'account_manager': 2,
                'viewer': 1
            }
            
            if required_role:
                return role_hierarchy.get(user_role, 0) >= role_hierarchy.get(required_role, 0)
            
            return True
        except Exception as e:
            return False



# Create global instance function
def get_database_service():
    """Get database service instance"""
    return DatabaseService()

