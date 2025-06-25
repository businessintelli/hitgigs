#!/usr/bin/env python3
"""
Fix admin user creation by checking valid enum values and creating admin user
"""

import sys
import os
from pathlib import Path

# Add the src directory to Python path
project_root = Path(__file__).parent.parent
backend_src = project_root / "backend" / "hotgigs-api" / "src"
sys.path.insert(0, str(backend_src))

try:
    from database import get_database_service
    import bcrypt
    from datetime import datetime, timezone
    import uuid
    
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def check_enum_values():
        """Check what user_type enum values are valid"""
        print("🔍 Checking valid user_type enum values...")
        
        try:
            db = get_database_service()
            
            # Get all unique user_type values from existing users
            all_users = db.get_records('users', limit=50)
            user_types = set()
            
            for user in all_users:
                if user.get('user_type'):
                    user_types.add(user.get('user_type'))
            
            print(f"✅ Found user_type values in database: {list(user_types)}")
            
            # Try different potential admin values
            potential_admin_types = ['admin', 'super_admin', 'superadmin', 'company', 'recruiter', 'employer']
            
            print("\n🧪 Testing potential admin user_type values...")
            for user_type in potential_admin_types:
                try:
                    # Try to create a test record (we'll delete it immediately)
                    test_data = {
                        'id': str(uuid.uuid4()),
                        'email': f'test_{user_type}@test.com',
                        'password_hash': hash_password('test123'),
                        'user_type': user_type,
                        'first_name': 'Test',
                        'last_name': 'User',
                        'is_active': True,
                        'is_verified': True,
                        'created_at': datetime.now(timezone.utc).isoformat(),
                        'updated_at': datetime.now(timezone.utc).isoformat()
                    }
                    
                    # Try to create the user
                    result = db.create_user(test_data)
                    if result:
                        print(f"✅ '{user_type}' is VALID - test user created")
                        # Delete the test user immediately
                        db.delete_record('users', result['id'])
                        print(f"🗑️ Test user deleted")
                        return user_type
                    else:
                        print(f"❌ '{user_type}' failed to create user")
                        
                except Exception as e:
                    if "invalid input value for enum" in str(e):
                        print(f"❌ '{user_type}' is NOT valid enum value")
                    else:
                        print(f"⚠️ '{user_type}' error: {e}")
            
            # If no admin-like type works, use 'company' as it's likely to exist
            return 'company'
            
        except Exception as e:
            print(f"❌ Error checking enum values: {e}")
            return 'candidate'  # Fallback to known working value
    
    def create_admin_user_with_valid_type(user_type):
        """Create admin user with valid user_type"""
        print(f"\n🔧 Creating admin user with user_type='{user_type}'...")
        
        try:
            db = get_database_service()
            
            # Check if admin user already exists
            existing_admin = db.get_user_by_email('admin@hotgigs.ai')
            if existing_admin:
                print("⚠️ admin@hotgigs.ai already exists!")
                print(f"   🆔 ID: {existing_admin.get('id')}")
                print(f"   👤 User Type: {existing_admin.get('user_type')}")
                print(f"   🔐 Try password: admin123")
                return existing_admin
            
            # Admin user data with valid user_type
            admin_data = {
                'id': str(uuid.uuid4()),
                'email': 'admin@hotgigs.ai',
                'password_hash': hash_password('admin123'),
                'user_type': user_type,  # Use valid enum value
                'first_name': 'Admin',
                'last_name': 'User',
                'is_active': True,
                'is_verified': True,
                'created_at': datetime.now(timezone.utc).isoformat(),
                'updated_at': datetime.now(timezone.utc).isoformat()
            }
            
            # Add admin-specific fields if user_type is 'company'
            if user_type == 'company':
                admin_data['company_name'] = 'HotGigs Admin'
                admin_data['is_admin'] = True  # Custom field to identify admin
            
            # Create the admin user
            result = db.create_user(admin_data)
            
            if result:
                print("✅ Admin user created successfully!")
                print(f"   📧 Email: admin@hotgigs.ai")
                print(f"   🔐 Password: admin123")
                print(f"   👤 User Type: {user_type}")
                print(f"   🆔 ID: {result.get('id', 'N/A')}")
                
                # If we used 'company' type, also create a company record
                if user_type == 'company':
                    try:
                        company_data = {
                            'id': str(uuid.uuid4()),
                            'name': 'HotGigs Admin Company',
                            'description': 'Administrative company for HotGigs.ai platform',
                            'industry': 'Technology',
                            'size': '1-10',
                            'website': 'https://hotgigs.ai',
                            'created_at': datetime.now(timezone.utc).isoformat(),
                            'updated_at': datetime.now(timezone.utc).isoformat()
                        }
                        company_result = db.create_record('companies', company_data)
                        if company_result:
                            print(f"✅ Admin company created: {company_result.get('id')}")
                    except Exception as e:
                        print(f"⚠️ Could not create admin company: {e}")
                
                return result
            else:
                print("❌ Failed to create admin user")
                return None
                
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            return None
    
    def main():
        print("🚀 HotGigs.ai Admin User Fix")
        print("=" * 40)
        
        # Check valid enum values
        valid_user_type = check_enum_values()
        print(f"\n🎯 Using user_type: '{valid_user_type}'")
        
        # Create admin user with valid type
        result = create_admin_user_with_valid_type(valid_user_type)
        
        if result:
            print("\n🎉 SUCCESS! Admin user is ready!")
            print("\n🌐 Access your admin panel:")
            print("   URL: http://localhost:3002/admin/login")
            print("   Email: admin@hotgigs.ai")
            print("   Password: admin123")
            print(f"   User Type: {valid_user_type}")
            
            if valid_user_type != 'admin':
                print(f"\n💡 Note: User type is '{valid_user_type}' (not 'admin')")
                print("   The frontend should handle this user as admin based on email or is_admin flag")
        else:
            print("\n❌ Failed to create admin user")
            print("   Please check the error messages above")
    
    if __name__ == "__main__":
        main()
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the project root and the backend dependencies are installed.")
except Exception as e:
    print(f"❌ Unexpected error: {e}")

