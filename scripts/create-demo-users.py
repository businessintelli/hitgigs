#!/usr/bin/env python3
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
    print("\n📋 Demo Accounts:")
    for user in demo_users:
        print(f"   📧 {user['email']} / {user['password']}")
    
    return created_count

if __name__ == "__main__":
    create_demo_users()
