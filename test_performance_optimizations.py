#!/usr/bin/env python3
"""
HotGigs.ai Performance Testing Suite - Phase 4 Optimizations
Tests the performance improvements implemented in the optimization phase
"""

import requests
import time
import json
import statistics
import concurrent.futures
import threading
from datetime import datetime
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class PerformanceTestSuite:
    """Comprehensive performance testing for HotGigs.ai optimizations"""
    
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url
        self.results = []
        self.session = requests.Session()
        self.auth_token = None
        
        # Test configuration
        self.test_config = {
            'concurrent_users': [1, 5, 10, 20],
            'test_duration': 30,  # seconds
            'warmup_requests': 5,
            'timeout': 10
        }
        
        print(f"🚀 Performance Test Suite initialized for {base_url}")
    
    def log_result(self, test_name: str, duration: float, status_code: int, 
                   success: bool, details: Dict[str, Any] = None):
        """Log test result"""
        result = {
            'test_name': test_name,
            'duration_ms': round(duration * 1000, 2),
            'status_code': status_code,
            'success': success,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.results.append(result)
        
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {result['duration_ms']}ms (HTTP {status_code})")
    
    def setup_test_data(self):
        """Setup test data and authentication"""
        print("\n🔧 Setting up test data...")
        
        try:
            # Test basic connectivity
            response = self.session.get(f"{self.base_url}/api/health", timeout=self.test_config['timeout'])
            if response.status_code == 200:
                print("✅ API connectivity confirmed")
            else:
                print(f"⚠️ API health check returned {response.status_code}")
        except Exception as e:
            print(f"❌ Failed to connect to API: {e}")
            return False
        
        return True
    
    def test_health_endpoint_performance(self):
        """Test health endpoint performance"""
        print("\n📊 Testing Health Endpoint Performance...")
        
        durations = []
        for i in range(10):
            start_time = time.time()
            try:
                response = self.session.get(f"{self.base_url}/api/health", timeout=self.test_config['timeout'])
                duration = time.time() - start_time
                success = response.status_code == 200
                
                durations.append(duration)
                self.log_result(f"health_check_{i+1}", duration, response.status_code, success)
                
            except Exception as e:
                duration = time.time() - start_time
                self.log_result(f"health_check_{i+1}", duration, 0, False, {'error': str(e)})
        
        if durations:
            avg_duration = statistics.mean(durations)
            print(f"📈 Health endpoint average response time: {avg_duration*1000:.2f}ms")
    
    def test_jobs_search_performance(self):
        """Test optimized jobs search performance"""
        print("\n🔍 Testing Optimized Jobs Search Performance...")
        
        search_queries = [
            "",  # Get all jobs
            "?search=software",
            "?search=developer",
            "?search=python",
            "?location=New York",
            "?employment_type=full-time",
            "?limit=5",
            "?limit=20",
            "?search=software&location=San Francisco",
            "?search=developer&employment_type=full-time&limit=10"
        ]
        
        for query in search_queries:
            start_time = time.time()
            try:
                response = self.session.get(
                    f"{self.base_url}/api/jobs/{query}", 
                    timeout=self.test_config['timeout']
                )
                duration = time.time() - start_time
                success = response.status_code == 200
                
                details = {}
                if success:
                    data = response.json()
                    details = {
                        'jobs_count': len(data.get('jobs', [])),
                        'has_pagination': 'pagination' in data,
                        'has_filters': 'filters_applied' in data
                    }
                
                test_name = f"jobs_search_{query.replace('?', '').replace('&', '_').replace('=', '_') or 'all'}"
                self.log_result(test_name, duration, response.status_code, success, details)
                
            except Exception as e:
                duration = time.time() - start_time
                test_name = f"jobs_search_{query.replace('?', '').replace('&', '_').replace('=', '_') or 'all'}"
                self.log_result(test_name, duration, 0, False, {'error': str(e)})
    
    def test_concurrent_load(self, concurrent_users: int = 10, duration: int = 30):
        """Test concurrent load performance"""
        print(f"\n⚡ Testing Concurrent Load: {concurrent_users} users for {duration}s...")
        
        results = []
        start_time = time.time()
        end_time = start_time + duration
        
        def worker():
            """Worker function for concurrent testing"""
            local_results = []
            session = requests.Session()
            
            while time.time() < end_time:
                # Test different endpoints
                endpoints = [
                    "/api/health",
                    "/api/jobs/",
                    "/api/jobs/?search=software",
                    "/api/jobs/?limit=5"
                ]
                
                for endpoint in endpoints:
                    request_start = time.time()
                    try:
                        response = session.get(
                            f"{self.base_url}{endpoint}", 
                            timeout=self.test_config['timeout']
                        )
                        request_duration = time.time() - request_start
                        
                        local_results.append({
                            'endpoint': endpoint,
                            'duration': request_duration,
                            'status_code': response.status_code,
                            'success': response.status_code == 200
                        })
                        
                    except Exception as e:
                        request_duration = time.time() - request_start
                        local_results.append({
                            'endpoint': endpoint,
                            'duration': request_duration,
                            'status_code': 0,
                            'success': False,
                            'error': str(e)
                        })
                
                # Small delay to prevent overwhelming
                time.sleep(0.1)
            
            return local_results
        
        # Run concurrent workers
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
            futures = [executor.submit(worker) for _ in range(concurrent_users)]
            
            for future in concurrent.futures.as_completed(futures):
                try:
                    worker_results = future.result()
                    results.extend(worker_results)
                except Exception as e:
                    print(f"Worker failed: {e}")
        
        # Analyze results
        if results:
            total_requests = len(results)
            successful_requests = len([r for r in results if r['success']])
            success_rate = (successful_requests / total_requests) * 100
            
            durations = [r['duration'] for r in results if r['success']]
            if durations:
                avg_duration = statistics.mean(durations)
                max_duration = max(durations)
                min_duration = min(durations)
                
                print(f"📊 Concurrent Load Results ({concurrent_users} users):")
                print(f"   Total Requests: {total_requests}")
                print(f"   Successful: {successful_requests} ({success_rate:.1f}%)")
                print(f"   Avg Response Time: {avg_duration*1000:.2f}ms")
                print(f"   Min Response Time: {min_duration*1000:.2f}ms")
                print(f"   Max Response Time: {max_duration*1000:.2f}ms")
                print(f"   Requests/sec: {total_requests/duration:.1f}")
                
                # Log summary result
                self.log_result(
                    f"concurrent_load_{concurrent_users}_users",
                    avg_duration,
                    200,
                    success_rate > 95,
                    {
                        'total_requests': total_requests,
                        'success_rate': success_rate,
                        'requests_per_second': total_requests/duration,
                        'max_duration_ms': max_duration*1000,
                        'min_duration_ms': min_duration*1000
                    }
                )
    
    def test_database_optimization_impact(self):
        """Test the impact of database optimizations"""
        print("\n🗄️ Testing Database Optimization Impact...")
        
        # Test performance metrics endpoint
        start_time = time.time()
        try:
            response = self.session.get(f"{self.base_url}/api/performance", timeout=self.test_config['timeout'])
            duration = time.time() - start_time
            success = response.status_code == 200
            
            details = {}
            if success:
                data = response.json()
                details = data.get('database_performance', {})
            
            self.log_result("database_performance_metrics", duration, response.status_code, success, details)
            
        except Exception as e:
            duration = time.time() - start_time
            self.log_result("database_performance_metrics", duration, 0, False, {'error': str(e)})
        
        # Test cache performance
        print("Testing cache performance...")
        
        # First request (cache miss)
        start_time = time.time()
        try:
            response = self.session.get(f"{self.base_url}/api/jobs/?search=python", timeout=self.test_config['timeout'])
            first_duration = time.time() - start_time
            
            # Second request (cache hit)
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/api/jobs/?search=python", timeout=self.test_config['timeout'])
            second_duration = time.time() - start_time
            
            cache_improvement = ((first_duration - second_duration) / first_duration) * 100
            
            self.log_result(
                "cache_performance_test",
                second_duration,
                response.status_code,
                response.status_code == 200,
                {
                    'first_request_ms': first_duration * 1000,
                    'second_request_ms': second_duration * 1000,
                    'cache_improvement_percent': cache_improvement
                }
            )
            
            print(f"📈 Cache Performance: {cache_improvement:.1f}% improvement on second request")
            
        except Exception as e:
            print(f"❌ Cache performance test failed: {e}")
    
    def test_memory_and_resource_usage(self):
        """Test memory and resource usage"""
        print("\n💾 Testing Memory and Resource Usage...")
        
        try:
            # Get system metrics from health endpoint
            response = self.session.get(f"{self.base_url}/api/health", timeout=self.test_config['timeout'])
            
            if response.status_code == 200:
                data = response.json()
                system_metrics = data.get('system', {})
                
                print(f"📊 System Metrics:")
                print(f"   CPU Usage: {system_metrics.get('cpu_percent', 'N/A')}%")
                print(f"   Memory Usage: {system_metrics.get('memory_percent', 'N/A')}%")
                print(f"   Disk Usage: {system_metrics.get('disk_percent', 'N/A')}%")
                
                # Log as test result
                self.log_result(
                    "system_resource_usage",
                    0,
                    200,
                    True,
                    system_metrics
                )
            
        except Exception as e:
            print(f"❌ Resource usage test failed: {e}")
    
    def run_all_tests(self):
        """Run all performance tests"""
        print("🎯 Starting HotGigs.ai Performance Test Suite - Phase 4 Optimizations")
        print("=" * 70)
        
        if not self.setup_test_data():
            print("❌ Failed to setup test data. Aborting tests.")
            return
        
        # Run individual tests
        self.test_health_endpoint_performance()
        self.test_jobs_search_performance()
        self.test_database_optimization_impact()
        self.test_memory_and_resource_usage()
        
        # Run concurrent load tests
        for users in self.test_config['concurrent_users']:
            self.test_concurrent_load(users, 15)  # Shorter duration for multiple tests
        
        # Generate final report
        self.generate_performance_report()
    
    def generate_performance_report(self):
        """Generate comprehensive performance report"""
        print("\n" + "=" * 70)
        print("📊 PERFORMANCE TEST RESULTS - PHASE 4 OPTIMIZATIONS")
        print("=" * 70)
        
        if not self.results:
            print("❌ No test results to analyze")
            return
        
        # Overall statistics
        total_tests = len(self.results)
        successful_tests = len([r for r in self.results if r['success']])
        success_rate = (successful_tests / total_tests) * 100
        
        # Response time statistics
        successful_durations = [r['duration_ms'] for r in self.results if r['success']]
        
        if successful_durations:
            avg_response_time = statistics.mean(successful_durations)
            median_response_time = statistics.median(successful_durations)
            max_response_time = max(successful_durations)
            min_response_time = min(successful_durations)
            
            print(f"\n📈 OVERALL PERFORMANCE METRICS:")
            print(f"   Total Tests: {total_tests}")
            print(f"   Success Rate: {success_rate:.1f}%")
            print(f"   Average Response Time: {avg_response_time:.2f}ms")
            print(f"   Median Response Time: {median_response_time:.2f}ms")
            print(f"   Fastest Response: {min_response_time:.2f}ms")
            print(f"   Slowest Response: {max_response_time:.2f}ms")
        
        # Performance benchmarks
        print(f"\n🎯 PERFORMANCE BENCHMARKS:")
        
        # Health endpoint performance
        health_results = [r for r in self.results if 'health_check' in r['test_name'] and r['success']]
        if health_results:
            health_avg = statistics.mean([r['duration_ms'] for r in health_results])
            health_status = "✅ EXCELLENT" if health_avg < 50 else "⚠️ GOOD" if health_avg < 100 else "❌ NEEDS IMPROVEMENT"
            print(f"   Health Endpoint: {health_avg:.2f}ms avg {health_status}")
        
        # Jobs search performance
        jobs_results = [r for r in self.results if 'jobs_search' in r['test_name'] and r['success']]
        if jobs_results:
            jobs_avg = statistics.mean([r['duration_ms'] for r in jobs_results])
            jobs_status = "✅ EXCELLENT" if jobs_avg < 200 else "⚠️ GOOD" if jobs_avg < 500 else "❌ NEEDS IMPROVEMENT"
            print(f"   Jobs Search: {jobs_avg:.2f}ms avg {jobs_status}")
        
        # Concurrent load performance
        concurrent_results = [r for r in self.results if 'concurrent_load' in r['test_name'] and r['success']]
        if concurrent_results:
            for result in concurrent_results:
                details = result.get('details', {})
                users = result['test_name'].split('_')[2]
                success_rate = details.get('success_rate', 0)
                rps = details.get('requests_per_second', 0)
                
                load_status = "✅ EXCELLENT" if success_rate > 95 else "⚠️ GOOD" if success_rate > 90 else "❌ NEEDS IMPROVEMENT"
                print(f"   {users} Users Load: {success_rate:.1f}% success, {rps:.1f} req/s {load_status}")
        
        # Cache performance
        cache_results = [r for r in self.results if 'cache_performance' in r['test_name'] and r['success']]
        if cache_results:
            cache_result = cache_results[0]
            cache_improvement = cache_result.get('details', {}).get('cache_improvement_percent', 0)
            cache_status = "✅ EXCELLENT" if cache_improvement > 20 else "⚠️ GOOD" if cache_improvement > 10 else "❌ NEEDS IMPROVEMENT"
            print(f"   Cache Performance: {cache_improvement:.1f}% improvement {cache_status}")
        
        # Save results to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"performance_test_results_phase4_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump({
                'test_suite': 'HotGigs.ai Performance Tests - Phase 4 Optimizations',
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'total_tests': total_tests,
                    'success_rate': success_rate,
                    'avg_response_time_ms': avg_response_time if successful_durations else 0
                },
                'results': self.results
            }, f, indent=2)
        
        print(f"\n💾 Detailed results saved to: {filename}")
        
        # Performance recommendations
        print(f"\n🚀 OPTIMIZATION RECOMMENDATIONS:")
        
        if avg_response_time > 500:
            print("   ⚠️ Consider implementing additional database indexes")
            print("   ⚠️ Review query optimization opportunities")
        
        if success_rate < 95:
            print("   ⚠️ Investigate error handling and retry mechanisms")
            print("   ⚠️ Consider implementing circuit breakers")
        
        if any(r.get('details', {}).get('cache_improvement_percent', 0) < 10 for r in cache_results):
            print("   ⚠️ Review caching strategy and TTL settings")
        
        print("\n✅ Performance testing completed!")

def main():
    """Main function to run performance tests"""
    import argparse
    
    parser = argparse.ArgumentParser(description='HotGigs.ai Performance Test Suite')
    parser.add_argument('--url', default='http://localhost:5000', help='Base URL for API')
    parser.add_argument('--users', type=int, nargs='+', default=[1, 5, 10], help='Concurrent user counts to test')
    parser.add_argument('--duration', type=int, default=30, help='Test duration in seconds')
    
    args = parser.parse_args()
    
    # Create and run test suite
    test_suite = PerformanceTestSuite(args.url)
    test_suite.test_config['concurrent_users'] = args.users
    test_suite.test_config['test_duration'] = args.duration
    
    test_suite.run_all_tests()

if __name__ == "__main__":
    main()

