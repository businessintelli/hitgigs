#!/usr/bin/env python3
"""
Check existing admin users in Supabase and create admin user if needed
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
    
    def check_admin_users():
        """Check existing admin users"""
        print("🔍 Checking existing admin users in Supabase...")
        
        try:
            db = get_database_service()
            
            # Check for admin users
            print("\n📊 Searching for admin users...")
            
            # Method 1: Look for users with admin role
            try:
                admin_users = db.get_records('users', {'user_type': 'admin'})
                if admin_users:
                    print(f"✅ Found {len(admin_users)} admin user(s) with user_type='admin':")
                    for user in admin_users:
                        print(f"   📧 Email: {user.get('email', 'N/A')}")
                        print(f"   🆔 ID: {user.get('id', 'N/A')}")
                        print(f"   📅 Created: {user.get('created_at', 'N/A')}")
                        print()
                else:
                    print("❌ No users found with user_type='admin'")
            except Exception as e:
                print(f"⚠️ Error checking admin users: {e}")
            
            # Method 2: Look for specific admin email
            try:
                admin_user = db.get_user_by_email('admin@hotgigs.ai')
                if admin_user:
                    print("✅ Found admin@hotgigs.ai user:")
                    print(f"   🆔 ID: {admin_user.get('id', 'N/A')}")
                    print(f"   👤 User Type: {admin_user.get('user_type', 'N/A')}")
                    print(f"   🔐 Has Password: {'Yes' if admin_user.get('password_hash') else 'No'}")
                    print(f"   📅 Created: {admin_user.get('created_at', 'N/A')}")
                    print()
                else:
                    print("❌ admin@hotgigs.ai user not found")
            except Exception as e:
                print(f"⚠️ Error checking admin@hotgigs.ai: {e}")
            
            # Method 3: Show all users (first 10)
            try:
                all_users = db.get_records('users', limit=10)
                print(f"📋 First 10 users in database:")
                for i, user in enumerate(all_users, 1):
                    print(f"   {i}. 📧 {user.get('email', 'N/A')} | 👤 {user.get('user_type', 'N/A')} | 🆔 {user.get('id', 'N/A')[:8]}...")
                print()
            except Exception as e:
                print(f"⚠️ Error listing users: {e}")
            
            return admin_users if 'admin_users' in locals() else []
            
        except Exception as e:
            print(f"❌ Error connecting to database: {e}")
            return []
    
    def create_admin_user():
        """Create a new admin user"""
        print("🔧 Creating new admin user...")
        
        try:
            db = get_database_service()
            
            # Admin user data
            admin_data = {
                'id': str(uuid.uuid4()),
                'email': 'admin@hotgigs.ai',
                'password_hash': hash_password('admin123'),
                'user_type': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_active': True,
                'is_verified': True,
                'created_at': datetime.now(timezone.utc).isoformat(),
                'updated_at': datetime.now(timezone.utc).isoformat()
            }
            
            # Create the admin user
            result = db.create_user(admin_data)
            
            if result:
                print("✅ Admin user created successfully!")
                print(f"   📧 Email: admin@hotgigs.ai")
                print(f"   🔐 Password: admin123")
                print(f"   🆔 ID: {result.get('id', 'N/A')}")
                print()
                print("🌐 You can now login to the admin panel:")
                print("   URL: http://localhost:3002/admin/login")
                print("   Email: admin@hotgigs.ai")
                print("   Password: admin123")
                return True
            else:
                print("❌ Failed to create admin user")
                return False
                
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            return False
    
    def main():
        print("🚀 HotGigs.ai Admin User Management")
        print("=" * 50)
        
        # Check existing admin users
        admin_users = check_admin_users()
        
        if admin_users:
            print("✅ Admin users already exist. Try these credentials:")
            for user in admin_users:
                print(f"   📧 Email: {user.get('email')}")
                print(f"   🔐 Password: Try 'admin123' or check your records")
            print()
            
            create_new = input("Do you want to create a new admin user anyway? (y/N): ").strip().lower()
            if create_new == 'y':
                create_admin_user()
        else:
            print("❌ No admin users found. Creating new admin user...")
            create_admin_user()
    
    if __name__ == "__main__":
        main()
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the project root and the backend dependencies are installed.")
except Exception as e:
    print(f"❌ Unexpected error: {e}")

