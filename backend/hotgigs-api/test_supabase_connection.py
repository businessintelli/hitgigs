#!/usr/bin/env python3
"""
Supabase Connection Test Script for HotGigs.ai
This script tests the connection to Supabase and helps retrieve API keys
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_supabase_connection():
    """Test basic connection to Supabase"""
    
    supabase_url = os.getenv('SUPABASE_URL')
    
    if not supabase_url:
        print("❌ SUPABASE_URL not found in environment variables")
        return False
    
    print(f"✅ Supabase URL found: {supabase_url}")
    
    # Try to make a basic HTTP request to check if the URL is accessible
    try:
        import requests
        response = requests.get(f"{supabase_url}/rest/v1/", timeout=10)
        print(f"✅ Supabase endpoint accessible: {response.status_code}")
        
        # Check if we get a proper response
        if response.status_code == 401:
            print("🔑 Authentication required - need API keys")
            return True
        elif response.status_code == 200:
            print("✅ Supabase connection successful")
            return True
        else:
            print(f"⚠️  Unexpected response: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return False

def get_supabase_info():
    """Get information about Supabase project"""
    
    supabase_url = os.getenv('SUPABASE_URL')
    
    if not supabase_url:
        print("❌ SUPABASE_URL not found")
        return
    
    # Extract project ID from URL
    if 'supabase.co' in supabase_url:
        project_id = supabase_url.split('//')[1].split('.')[0]
        print(f"📋 Project ID: {project_id}")
        
        print("\n🔑 To get your API keys:")
        print("1. Go to https://supabase.com/dashboard")
        print(f"2. Select your project: {project_id}")
        print("3. Go to Settings > API")
        print("4. Copy the 'anon public' key for SUPABASE_ANON_KEY")
        print("5. Copy the 'service_role' key for SUPABASE_SERVICE_ROLE_KEY")
        
        print(f"\n📝 Your Supabase URL: {supabase_url}")
        print(f"📝 Your JWT Secret: {os.getenv('JWT_SECRET_KEY', 'Not set')}")

def main():
    """Main function"""
    print("🚀 HotGigs.ai Supabase Connection Test")
    print("=" * 50)
    
    # Test connection
    if test_supabase_connection():
        print("\n✅ Basic connection test passed")
    else:
        print("\n❌ Connection test failed")
        return
    
    # Get project info
    print("\n📋 Project Information:")
    get_supabase_info()
    
    print("\n🔧 Next Steps:")
    print("1. Get your API keys from Supabase dashboard")
    print("2. Update the .env file with SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY")
    print("3. Run the database schema creation script")
    print("4. Test the full integration")

if __name__ == "__main__":
    main()

