#!/usr/bin/env python3
"""
Authentication test script for HotGigs.ai API
Tests basic authentication endpoints and OAuth integration
"""

import requests
import json
import sys
import time
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:5000/api"

def test_health_check():
    """Test API health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/../api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False

def test_api_info():
    """Test API info endpoint"""
    try:
        response = requests.get(f"{BASE_URL}")
        if response.status_code == 200:
            print("✅ API info endpoint working")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ API info failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API info error: {str(e)}")
        return False

def test_user_registration():
    """Test user registration endpoint"""
    try:
        test_user = {
            "email": f"test_{int(time.time())}@example.com",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User",
            "user_type": "candidate"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
        
        if response.status_code == 201:
            print("✅ User registration successful")
            data = response.json()
            print(f"   User ID: {data['user']['id']}")
            print(f"   Access token received: {'access_token' in data}")
            return data
        else:
            print(f"❌ User registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ User registration error: {str(e)}")
        return None

def test_user_login(email, password):
    """Test user login endpoint"""
    try:
        login_data = {
            "email": email,
            "password": password
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        
        if response.status_code == 200:
            print("✅ User login successful")
            data = response.json()
            print(f"   User ID: {data['user']['id']}")
            print(f"   Access token received: {'access_token' in data}")
            return data
        else:
            print(f"❌ User login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ User login error: {str(e)}")
        return None

def test_protected_endpoint(access_token):
    """Test protected endpoint with JWT token"""
    try:
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        
        if response.status_code == 200:
            print("✅ Protected endpoint access successful")
            data = response.json()
            print(f"   User email: {data['user']['email']}")
            return True
        else:
            print(f"❌ Protected endpoint failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Protected endpoint error: {str(e)}")
        return False

def test_token_refresh(refresh_token):
    """Test token refresh endpoint"""
    try:
        headers = {
            "Authorization": f"Bearer {refresh_token}"
        }
        
        response = requests.post(f"{BASE_URL}/auth/refresh", headers=headers)
        
        if response.status_code == 200:
            print("✅ Token refresh successful")
            data = response.json()
            print(f"   New access token received: {'access_token' in data}")
            return data
        else:
            print(f"❌ Token refresh failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Token refresh error: {str(e)}")
        return None

def test_oauth_endpoints():
    """Test OAuth endpoints (without actual OAuth flow)"""
    try:
        # Test OAuth endpoint with invalid data to check if it's accessible
        oauth_data = {
            "provider": "google",
            "access_token": "invalid_token",
            "user_type": "candidate"
        }
        
        response = requests.post(f"{BASE_URL}/auth/oauth", json=oauth_data)
        
        # We expect this to fail with 400 (bad request) not 404 (not found)
        if response.status_code == 400:
            print("✅ OAuth endpoint accessible (expected failure with invalid token)")
            return True
        elif response.status_code == 404:
            print("❌ OAuth endpoint not found")
            return False
        else:
            print(f"⚠️  OAuth endpoint returned unexpected status: {response.status_code}")
            return True
    except Exception as e:
        print(f"❌ OAuth endpoint error: {str(e)}")
        return False

def run_authentication_tests():
    """Run all authentication tests"""
    print("🚀 Starting HotGigs.ai Authentication Tests")
    print("=" * 50)
    
    # Test basic endpoints
    if not test_health_check():
        print("❌ Basic health check failed. Is the server running?")
        return False
    
    if not test_api_info():
        print("❌ API info endpoint failed")
        return False
    
    # Test OAuth endpoints
    test_oauth_endpoints()
    
    # Test user registration and login flow
    print("\n📝 Testing User Registration and Login Flow")
    print("-" * 40)
    
    # Register a new user
    registration_data = test_user_registration()
    if not registration_data:
        print("❌ Cannot proceed without successful registration")
        return False
    
    user_email = registration_data['user']['email']
    access_token = registration_data['access_token']
    refresh_token = registration_data['refresh_token']
    
    # Test login with the same user
    login_data = test_user_login(user_email, "testpassword123")
    if not login_data:
        print("❌ Login test failed")
        return False
    
    # Test protected endpoint
    if not test_protected_endpoint(access_token):
        print("❌ Protected endpoint test failed")
        return False
    
    # Test token refresh
    refresh_data = test_token_refresh(refresh_token)
    if not refresh_data:
        print("❌ Token refresh test failed")
        return False
    
    print("\n🎉 All authentication tests completed successfully!")
    print("=" * 50)
    return True

if __name__ == "__main__":
    success = run_authentication_tests()
    sys.exit(0 if success else 1)

