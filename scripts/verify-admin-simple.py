#!/usr/bin/env python3
"""
Simple Admin User Verification - Run from backend/hotgigs-api directory
"""

import sys
import os
sys.path.append('src')

def main():
    print("🔍 HotGigs.ai Admin User Verification")
    print("=" * 50)
    
    try:
        # Import after adding src to path
        from database import get_database_service
        import bcrypt
        
        # Get database service
        db = get_database_service()
        
        # Check admin user
        print("📧 Looking for admin@hotgigs.ai...")
        admin_user = db.get_user_by_email('admin@hotgigs.ai')
        
        if not admin_user:
            print("❌ Admin user not found!")
            print("\n💡 Try running the SQL script to create admin user:")
            print("   1. Go to: https://app.supabase.com/project/nrpvyjwnqvxipjmdjlim/sql")
            print("   2. Run the SQL from scripts/create-admin-user.sql")
            return
        
        print(f"✅ Admin user found!")
        print(f"   🆔 ID: {admin_user['id']}")
        print(f"   📧 Email: {admin_user['email']}")
        print(f"   👤 User Type: {admin_user['user_type']}")
        print(f"   🔐 Is Admin: {admin_user.get('is_admin', False)}")
        print(f"   ✅ Is Active: {admin_user.get('is_active', False)}")
        print(f"   📅 Created: {admin_user.get('created_at', 'N/A')}")
        
        # Test password verification
        print("\n🔐 Testing password verification...")
        stored_hash = admin_user.get('password_hash')
        if stored_hash:
            print(f"   📝 Password hash exists: {stored_hash[:20]}...")
            
            # Test with admin123
            test_password = "admin123"
            if isinstance(stored_hash, str):
                stored_hash_bytes = stored_hash.encode('utf-8')
            else:
                stored_hash_bytes = stored_hash
                
            if isinstance(test_password, str):
                test_password_bytes = test_password.encode('utf-8')
            else:
                test_password_bytes = test_password
            
            try:
                password_match = bcrypt.checkpw(test_password_bytes, stored_hash_bytes)
                if password_match:
                    print("   ✅ Password 'admin123' matches!")
                else:
                    print("   ❌ Password 'admin123' does NOT match!")
                    print("   💡 The password hash might be incorrect.")
            except Exception as e:
                print(f"   ❌ Password verification error: {e}")
        else:
            print("   ❌ No password hash found!")
        
        # Test authentication method
        print("\n🧪 Testing authenticate_user method...")
        auth_result = db.authenticate_user('admin@hotgigs.ai', 'admin123')
        if auth_result:
            print("   ✅ authenticate_user() successful!")
            print(f"   👤 Returned user: {auth_result.get('email')}")
            print(f"   🔐 Is admin: {auth_result.get('is_admin')}")
        else:
            print("   ❌ authenticate_user() failed!")
            print("   💡 This explains why admin login returns 'invalid credentials'")
        
        print("\n🌐 Frontend URLs to try:")
        print("   📱 Regular Login: http://localhost:3002/signin")
        print("   🔐 Admin Login: http://localhost:3002/admin/login")
        print("   📊 Admin Dashboard: http://localhost:3002/admin/dashboard")
        
        print("\n🎯 Credentials to use:")
        print("   📧 Email: admin@hotgigs.ai")
        print("   🔐 Password: admin123")
        
        if not auth_result:
            print("\n🔧 TO FIX INVALID CREDENTIALS:")
            print("   1. The password hash in database might be wrong")
            print("   2. Re-run the SQL script to recreate admin user")
            print("   3. Or check if bcrypt is working properly")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

