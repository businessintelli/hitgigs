#!/usr/bin/env python3
"""
HotGigs.ai Performance Testing Script
Tests API response times, concurrent requests, and system performance
"""

import time
import requests
import threading
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import json

class PerformanceTestSuite:
    def __init__(self, base_url="http://localhost:5001"):
        self.base_url = base_url
        self.session = requests.Session()
        self.results = []
        
    def log_result(self, test_name: str, response_time: float, status_code: int, success: bool):
        """Log performance test result"""
        result = {
            'test_name': test_name,
            'response_time_ms': round(response_time * 1000, 2),
            'status_code': status_code,
            'success': success,
            'timestamp': datetime.now().isoformat()
        }
        self.results.append(result)
        
        status_icon = "✅" if success else "❌"
        print(f"{status_icon} {test_name}: {result['response_time_ms']}ms (Status: {status_code})")
        
    def test_endpoint_performance(self, endpoint: str, method: str = "GET", data: dict = None, expected_status: int = 200) -> dict:
        """Test single endpoint performance"""
        start_time = time.time()
        
        try:
            if method == "GET":
                response = self.session.get(f"{self.base_url}{endpoint}")
            elif method == "POST":
                response = self.session.post(f"{self.base_url}{endpoint}", json=data)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            end_time = time.time()
            response_time = end_time - start_time
            success = response.status_code == expected_status
            
            return {
                'response_time': response_time,
                'status_code': response.status_code,
                'success': success
            }
            
        except Exception as e:
            end_time = time.time()
            response_time = end_time - start_time
            return {
                'response_time': response_time,
                'status_code': 0,
                'success': False,
                'error': str(e)
            }
    
    def test_concurrent_requests(self, endpoint: str, num_requests: int = 10, max_workers: int = 5) -> dict:
        """Test concurrent request handling"""
        print(f"\n🔄 Testing {num_requests} concurrent requests to {endpoint}")
        
        response_times = []
        status_codes = []
        errors = 0
        
        def make_request():
            return self.test_endpoint_performance(endpoint)
        
        start_time = time.time()
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [executor.submit(make_request) for _ in range(num_requests)]
            
            for future in as_completed(futures):
                result = future.result()
                response_times.append(result['response_time'])
                status_codes.append(result['status_code'])
                if not result['success']:
                    errors += 1
        
        total_time = time.time() - start_time
        
        return {
            'total_requests': num_requests,
            'total_time': total_time,
            'avg_response_time': statistics.mean(response_times),
            'min_response_time': min(response_times),
            'max_response_time': max(response_times),
            'median_response_time': statistics.median(response_times),
            'requests_per_second': num_requests / total_time,
            'error_rate': errors / num_requests,
            'status_codes': status_codes
        }
    
    def run_basic_performance_tests(self):
        """Run basic performance tests on key endpoints"""
        print("🚀 Starting HotGigs.ai Performance Tests")
        print("=" * 60)
        
        # Test individual endpoints
        endpoints = [
            ("/api/health", "GET", None, 200),
            ("/api/jobs/?search=software", "GET", None, 200),
            ("/api/jobs/?limit=5", "GET", None, 200),
            ("/api/auth/register", "POST", {
                "email": f"perf_test_{int(time.time())}@example.com",
                "password": "password123",
                "user_type": "candidate",
                "first_name": "Performance",
                "last_name": "Test"
            }, 201)
        ]
        
        print("\n📊 Individual Endpoint Performance:")
        print("-" * 60)
        
        for endpoint, method, data, expected_status in endpoints:
            result = self.test_endpoint_performance(endpoint, method, data, expected_status)
            test_name = f"{method} {endpoint}"
            self.log_result(test_name, result['response_time'], result['status_code'], result['success'])
        
        # Test concurrent requests
        print("\n⚡ Concurrent Request Performance:")
        print("-" * 60)
        
        concurrent_tests = [
            ("/api/health", 20, 10),
            ("/api/jobs/?search=engineer", 15, 5),
            ("/api/jobs/?limit=10", 10, 5)
        ]
        
        for endpoint, num_requests, max_workers in concurrent_tests:
            result = self.test_concurrent_requests(endpoint, num_requests, max_workers)
            
            print(f"\n📈 {endpoint} Concurrent Test Results:")
            print(f"   Total Requests: {result['total_requests']}")
            print(f"   Total Time: {result['total_time']:.2f}s")
            print(f"   Requests/Second: {result['requests_per_second']:.2f}")
            print(f"   Avg Response Time: {result['avg_response_time']*1000:.2f}ms")
            print(f"   Min Response Time: {result['min_response_time']*1000:.2f}ms")
            print(f"   Max Response Time: {result['max_response_time']*1000:.2f}ms")
            print(f"   Median Response Time: {result['median_response_time']*1000:.2f}ms")
            print(f"   Error Rate: {result['error_rate']*100:.1f}%")
    
    def test_database_performance(self):
        """Test database query performance"""
        print("\n💾 Database Performance Tests:")
        print("-" * 60)
        
        # Test different query patterns
        db_tests = [
            ("/api/jobs/?limit=1", "Small result set"),
            ("/api/jobs/?limit=50", "Medium result set"),
            ("/api/jobs/?search=software&limit=20", "Search query"),
            ("/api/jobs/?employment_type=full-time&limit=20", "Filter query")
        ]
        
        for endpoint, description in db_tests:
            result = self.test_endpoint_performance(endpoint)
            self.log_result(f"DB Query - {description}", result['response_time'], result['status_code'], result['success'])
    
    def generate_performance_report(self):
        """Generate comprehensive performance report"""
        if not self.results:
            print("No performance data to report")
            return
        
        print("\n📋 Performance Test Summary")
        print("=" * 60)
        
        successful_tests = [r for r in self.results if r['success']]
        failed_tests = [r for r in self.results if not r['success']]
        
        if successful_tests:
            response_times = [r['response_time_ms'] for r in successful_tests]
            
            print(f"✅ Successful Tests: {len(successful_tests)}")
            print(f"❌ Failed Tests: {len(failed_tests)}")
            print(f"📊 Success Rate: {len(successful_tests)/len(self.results)*100:.1f}%")
            print(f"⚡ Average Response Time: {statistics.mean(response_times):.2f}ms")
            print(f"🚀 Fastest Response: {min(response_times):.2f}ms")
            print(f"🐌 Slowest Response: {max(response_times):.2f}ms")
            print(f"📈 Median Response Time: {statistics.median(response_times):.2f}ms")
            
            # Performance categories
            fast_responses = len([t for t in response_times if t < 100])
            medium_responses = len([t for t in response_times if 100 <= t < 500])
            slow_responses = len([t for t in response_times if t >= 500])
            
            print(f"\n🏃 Response Time Distribution:")
            print(f"   Fast (<100ms): {fast_responses} ({fast_responses/len(response_times)*100:.1f}%)")
            print(f"   Medium (100-500ms): {medium_responses} ({medium_responses/len(response_times)*100:.1f}%)")
            print(f"   Slow (>500ms): {slow_responses} ({slow_responses/len(response_times)*100:.1f}%)")
        
        if failed_tests:
            print(f"\n❌ Failed Tests Details:")
            for test in failed_tests:
                print(f"   - {test['test_name']}: Status {test['status_code']}")
        
        # Save detailed results
        with open('/home/ubuntu/hotgigs-ai/performance_test_results.json', 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\n💾 Detailed results saved to: performance_test_results.json")

def main():
    """Run performance test suite"""
    tester = PerformanceTestSuite()
    
    try:
        # Run all performance tests
        tester.run_basic_performance_tests()
        tester.test_database_performance()
        
        # Generate comprehensive report
        tester.generate_performance_report()
        
        print("\n🎉 Performance testing completed!")
        
    except KeyboardInterrupt:
        print("\n⚠️ Performance testing interrupted by user")
    except Exception as e:
        print(f"\n❌ Performance testing failed: {str(e)}")

if __name__ == "__main__":
    main()

