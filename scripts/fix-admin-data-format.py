#!/usr/bin/env python3
"""
Fix Admin Dashboard Data Format Issues

This script fixes the data format issues causing 500 errors in admin endpoints:
1. Fix get_database_schema to return array format expected by frontend
2. Fix user data format to include 'name' and 'role' fields
3. Fix any other data format mismatches
"""

import os
import sys

# Add the backend src directory to path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'hotgigs-api', 'src')
sys.path.append(backend_dir)

def fix_database_schema_format():
    """Fix the get_database_schema method to return the correct format"""
    
    database_file = os.path.join(backend_dir, 'database.py')
    
    # Read the current file
    with open(database_file, 'r') as f:
        content = f.read()
    
    # Find and replace the get_database_schema method
    old_method = '''    def get_database_schema(self) -> Dict[str, Any]:
        """Get database schema information"""
        try:
            # Get table information from Supabase
            schema_info = {
                'tables': {
                    'users': {
                        'columns': ['id', 'email', 'user_type', 'first_name', 'last_name', 'is_active', 'is_verified', 'is_admin', 'created_at'],
                        'description': 'User accounts and profiles'
                    },
                    'companies': {
                        'columns': ['id', 'name', 'description', 'website', 'industry', 'size', 'location', 'is_active', 'created_at'],
                        'description': 'Company profiles'
                    },
                    'jobs': {
                        'columns': ['id', 'title', 'description', 'company_id', 'location', 'salary_range', 'status', 'created_at'],
                        'description': 'Job postings'
                    },
                    'job_applications': {
                        'columns': ['id', 'job_id', 'user_id', 'status', 'applied_at', 'notes'],
                        'description': 'Job applications'
                    }
                },
                'total_tables': 4,
                'database_type': 'PostgreSQL (Supabase)',
                'last_updated': datetime.now(timezone.utc).isoformat()
            }
            return schema_info'''
    
    new_method = '''    def get_database_schema(self) -> List[Dict[str, Any]]:
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
            return schema_tables'''
    
    # Replace the method
    if old_method in content:
        content = content.replace(old_method, new_method)
        
        # Write back to file
        with open(database_file, 'w') as f:
            f.write(content)
        
        print("✅ Fixed get_database_schema method format")
        return True
    else:
        print("❌ Could not find get_database_schema method to replace")
        return False

def fix_user_data_format():
    """Fix the get_all_users method to include name and role fields"""
    
    database_file = os.path.join(backend_dir, 'database.py')
    
    # Read the current file
    with open(database_file, 'r') as f:
        content = f.read()
    
    # Find and replace the get_all_users method
    old_method = '''    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users for admin dashboard"""
        try:
            result = self.client.table('users').select('*').order('created_at', desc=True).execute()
            users = result.data if result.data else []
            
            # Remove password hashes for security
            for user in users:
                if 'password_hash' in user:
                    del user['password_hash']
            
            return users'''
    
    new_method = '''    def get_all_users(self) -> List[Dict[str, Any]]:
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
            
            return users'''
    
    # Replace the method
    if old_method in content:
        content = content.replace(old_method, new_method)
        
        # Write back to file
        with open(database_file, 'w') as f:
            f.write(content)
        
        print("✅ Fixed get_all_users method format")
        return True
    else:
        print("❌ Could not find get_all_users method to replace")
        return False

def main():
    """Main function to fix all admin data format issues"""
    print("🔧 Fixing Admin Dashboard Data Format Issues...")
    print("=" * 50)
    
    success_count = 0
    
    # Fix database schema format
    if fix_database_schema_format():
        success_count += 1
    
    # Fix user data format
    if fix_user_data_format():
        success_count += 1
    
    print("=" * 50)
    if success_count == 2:
        print("🎉 All admin data format issues fixed successfully!")
        print("\n📋 Next steps:")
        print("1. Restart your backend server")
        print("2. Refresh the admin dashboard")
        print("3. Check that data now displays correctly")
    else:
        print(f"⚠️ Fixed {success_count}/2 issues. Some manual fixes may be needed.")
    
    return success_count == 2

if __name__ == "__main__":
    main()

