#!/usr/bin/env python3
"""
HotGigs.ai Integration Test Suite
Tests Supabase database integration and API functionality
"""

import os
import sys
import json
import requests
import time
from datetime import datetime
from dotenv import load_dotenv

# Add src to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from models.database import get_database_service
from models.user import get_user_service

# Load environment variables
load_dotenv()

class IntegrationTester:
    """Integration test suite for HotGigs.ai"""
    
    def __init__(self):
        """Initialize test suite"""
        self.db = None
        self.user_service = None
        self.api_base_url = "http://localhost:5000/api"
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
    
    def test_database_connection(self):
        """Test Supabase database connection"""
        print("\n🔗 Testing Database Connection")
        print("=" * 50)
        
        try:
            self.db = get_database_service()
            health = self.db.health_check()
            
            if health['status'] == 'healthy':
                self.log_test("Database Connection", True, f"Connected successfully")
                self.log_test("Database Stats", True, f"Users: {health['stats']['total_users']}, Jobs: {health['stats']['active_jobs']}")
                return True
            else:
                self.log_test("Database Connection", False, health.get('error', 'Unknown error'))
                return False
                
        except Exception as e:
            self.log_test("Database Connection", False, str(e))
            return False
    
    def test_user_service(self):
        """Test user service operations"""
        print("\n👤 Testing User Service")
        print("=" * 50)
        
        try:
            self.user_service = get_user_service()
            
            # Test user creation
            test_user_data = {
                'email': f'test_{int(time.time())}@hotgigs.ai',
                'password': 'testpassword123',
                'first_name': 'Test',
                'last_name': 'User',
                'user_type': 'candidate'
            }
            
            user = self.user_service.create_user(test_user_data)
            if user:
                self.log_test("User Creation", True, f"Created user: {user['email']}")
                
                # Test authentication
                auth_user = self.user_service.authenticate_user(test_user_data['email'], 'testpassword123')
                if auth_user:
                    self.log_test("User Authentication", True, "Authentication successful")
                    
                    # Test profile retrieval
                    profile = self.user_service.get_user_profile(user['id'])
                    if profile:
                        self.log_test("Profile Retrieval", True, f"Retrieved profile for {profile['email']}")
                    else:
                        self.log_test("Profile Retrieval", False, "Could not retrieve profile")
                    
                    # Clean up test user
                    self.db.delete_record('users', user['id'])
                    self.log_test("User Cleanup", True, "Test user deleted")
                    
                else:
                    self.log_test("User Authentication", False, "Authentication failed")
            else:
                self.log_test("User Creation", False, "Could not create user")
                
            return True
            
        except Exception as e:
            self.log_test("User Service", False, str(e))
            return False
    
    def test_api_endpoints(self):
        """Test API endpoints"""
        print("\n🌐 Testing API Endpoints")
        print("=" * 50)
        
        try:
            # Test health endpoint
            response = requests.get(f"{self.api_base_url}/health", timeout=10)
            if response.status_code == 200:
                self.log_test("API Health Check", True, f"Status: {response.status_code}")
            else:
                self.log_test("API Health Check", False, f"Status: {response.status_code}")
            
            # Test jobs endpoint
            response = requests.get(f"{self.api_base_url}/jobs", timeout=10)
            if response.status_code == 200:
                jobs = response.json()
                self.log_test("Jobs Endpoint", True, f"Retrieved {len(jobs.get('jobs', []))} jobs")
            else:
                self.log_test("Jobs Endpoint", False, f"Status: {response.status_code}")
            
            # Test AI health endpoint
            response = requests.get(f"{self.api_base_url}/ai/health", timeout=10)
            if response.status_code == 200:
                self.log_test("AI Health Check", True, f"AI services available")
            else:
                self.log_test("AI Health Check", False, f"Status: {response.status_code}")
            
            return True
            
        except requests.exceptions.ConnectionError:
            self.log_test("API Connection", False, "Could not connect to API server")
            return False
        except Exception as e:
            self.log_test("API Endpoints", False, str(e))
            return False
    
    def test_job_operations(self):
        """Test job-related operations"""
        print("\n💼 Testing Job Operations")
        print("=" * 50)
        
        try:
            # Test getting active jobs
            jobs = self.db.get_active_jobs(limit=5)
            self.log_test("Get Active Jobs", True, f"Retrieved {len(jobs)} active jobs")
            
            # Test job search
            search_results = self.db.search_jobs("engineer", limit=3)
            self.log_test("Job Search", True, f"Found {len(search_results)} jobs for 'engineer'")
            
            return True
            
        except Exception as e:
            self.log_test("Job Operations", False, str(e))
            return False
    
    def test_schema_validation(self):
        """Test database schema validation"""
        print("\n🗄️ Testing Database Schema")
        print("=" * 50)
        
        try:
            # Test if main tables exist by querying them
            tables_to_test = [
                'users', 'companies', 'candidate_profiles', 
                'jobs', 'job_applications', 'documents'
            ]
            
            for table in tables_to_test:
                try:
                    result = self.db.get_records(table, limit=1)
                    self.log_test(f"Table: {table}", True, f"Table exists and accessible")
                except Exception as e:
                    if "does not exist" in str(e):
                        self.log_test(f"Table: {table}", False, "Table does not exist - run schema.sql")
                    else:
                        self.log_test(f"Table: {table}", False, str(e))
            
            return True
            
        except Exception as e:
            self.log_test("Schema Validation", False, str(e))
            return False
    
    def run_all_tests(self):
        """Run all integration tests"""
        print("🚀 HotGigs.ai Integration Test Suite")
        print("=" * 60)
        print(f"Testing at: {datetime.now().isoformat()}")
        print(f"API Base URL: {self.api_base_url}")
        
        # Run tests
        tests = [
            self.test_database_connection,
            self.test_schema_validation,
            self.test_user_service,
            self.test_job_operations,
            self.test_api_endpoints
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test failed with exception: {str(e)}")
        
        # Summary
        print("\n📊 Test Summary")
        print("=" * 50)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['success']])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ Failed Tests:")
            for test in self.test_results:
                if not test['success']:
                    print(f"  • {test['test']}: {test['message']}")
        
        print("\n🎯 Next Steps:")
        if failed_tests == 0:
            print("✅ All tests passed! Integration is successful.")
        else:
            print("1. If schema tables don't exist, run the schema.sql in Supabase SQL Editor")
            print("2. If API endpoints fail, ensure Flask server is running")
            print("3. Check environment variables are properly configured")
        
        return failed_tests == 0

def main():
    """Main function"""
    tester = IntegrationTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 Integration test completed successfully!")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    exit(main())

