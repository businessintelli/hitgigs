#!/usr/bin/env python3
"""
Fix Authentication and Registration Issues

This script fixes the authentication and registration issues:
1. Fix create_user method to accept individual parameters
2. Add proper password hashing for registration
3. Create test users for demo accounts
4. Fix any other authentication-related issues
"""

import os
import sys

# Add the backend src directory to path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'hotgigs-api', 'src')
sys.path.append(backend_dir)

def fix_create_user_method():
    """Fix the create_user method to accept individual parameters and handle password hashing"""
    
    database_file = os.path.join(backend_dir, 'database.py')
    
    # Read the current file
    with open(database_file, 'r') as f:
        content = f.read()
    
    # Find and replace the create_user method
    old_method = '''    def create_user(self, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new user"""
        return self.create_record('users', user_data)'''
    
    new_method = '''    def create_user(self, name: str = None, email: str = None, password: str = None, 
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
            return None'''
    
    # Replace the method
    if old_method in content:
        content = content.replace(old_method, new_method)
        
        # Write back to file
        with open(database_file, 'w') as f:
            f.write(content)
        
        print("✅ Fixed create_user method")
        return True
    else:
        print("❌ Could not find create_user method to replace")
        return False

def add_missing_imports():
    """Add missing imports for bcrypt and datetime"""
    
    database_file = os.path.join(backend_dir, 'database.py')
    
    # Read the current file
    with open(database_file, 'r') as f:
        content = f.read()
    
    # Check if bcrypt import exists
    if 'import bcrypt' not in content:
        # Find the import section and add bcrypt
        import_section = content.split('\n')
        for i, line in enumerate(import_section):
            if line.startswith('from datetime import'):
                import_section.insert(i + 1, 'import bcrypt')
                break
        
        content = '\n'.join(import_section)
        
        # Write back to file
        with open(database_file, 'w') as f:
            f.write(content)
        
        print("✅ Added bcrypt import")
        return True
    else:
        print("✅ bcrypt import already exists")
        return True

def create_demo_users_script():
    """Create a script to add demo users to the database"""
    
    script_content = """#!/usr/bin/env python3
# Create Demo Users for Testing

import os
import sys

# Add the backend src directory to path
backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend', 'hotgigs-api', 'src')
sys.path.append(backend_dir)

from database import get_database_service

def create_demo_users():
    db = get_database_service()
    
    demo_users = [
        {
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'user123',
            'role': 'candidate'
        },
        {
            'name': 'HR Manager',
            'email': 'hr@techcorp.com',
            'password': 'company123',
            'role': 'candidate'
        },
        {
            'name': 'Alice Recruiter',
            'email': 'alice@recruiter.com',
            'password': 'recruiter123',
            'role': 'candidate'
        },
        {
            'name': 'Test User',
            'email': 'test@hotgigs.ai',
            'password': 'test123',
            'role': 'candidate'
        }
    ]
    
    print("🔧 Creating demo users...")
    print("=" * 40)
    
    created_count = 0
    for user in demo_users:
        try:
            user_id = db.create_user(
                name=user['name'],
                email=user['email'],
                password=user['password'],
                role=user['role']
            )
            
            if user_id:
                print(f"✅ Created user: {user['email']}")
                created_count += 1
            else:
                print(f"⚠️ User already exists: {user['email']}")
                
        except Exception as e:
            print(f"❌ Failed to create {user['email']}: {str(e)}")
    
    print("=" * 40)
    print(f"🎉 Created {created_count} new demo users!")
    print("\\n📋 Demo Accounts:")
    for user in demo_users:
        print(f"   📧 {user['email']} / {user['password']}")
    
    return created_count

if __name__ == "__main__":
    create_demo_users()
"""
    
    script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'scripts', 'create-demo-users.py')
    
    with open(script_path, 'w') as f:
        f.write(script_content)
    
    # Make executable
    os.chmod(script_path, 0o755)
    
    print("✅ Created demo users script")
    return True

def main():
    """Main function to fix all authentication issues"""
    print("🔧 Fixing Authentication and Registration Issues...")
    print("=" * 50)
    
    success_count = 0
    
    # Add missing imports
    if add_missing_imports():
        success_count += 1
    
    # Fix create_user method
    if fix_create_user_method():
        success_count += 1
    
    # Create demo users script
    if create_demo_users_script():
        success_count += 1
    
    print("=" * 50)
    if success_count == 3:
        print("🎉 All authentication issues fixed successfully!")
        print("\n📋 Next steps:")
        print("1. Restart your backend server")
        print("2. Run: python scripts/create-demo-users.py")
        print("3. Test sign-in with demo accounts")
        print("4. Test user registration")
    else:
        print(f"⚠️ Fixed {success_count}/3 issues. Some manual fixes may be needed.")
    
    return success_count == 3

if __name__ == "__main__":
    main()

