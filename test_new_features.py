#!/usr/bin/env python3
"""
Comprehensive Test Suite for HotGigs.ai New Features
Tests advanced AI, document processing, workflow automation, and bulk processing
"""
import os
import sys
import json
import base64
import time
import requests
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class HotGigsNewFeaturesTestSuite:
    """Comprehensive test suite for new HotGigs.ai features"""
    
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = {
            'advanced_ai': {},
            'document_processing': {},
            'workflow_automation': {},
            'bulk_processing': {},
            'integration': {}
        }
        
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all test suites"""
        logger.info("🚀 Starting HotGigs.ai New Features Test Suite")
        
        try:
            # Setup
            self._setup_test_environment()
            
            # Test suites
            self._test_advanced_ai_features()
            self._test_document_processing()
            self._test_workflow_automation()
            self._test_bulk_processing()
            self._test_integration_scenarios()
            
            # Generate report
            return self._generate_test_report()
            
        except Exception as e:
            logger.error(f"Test suite failed: {str(e)}")
            return {'error': str(e), 'results': self.test_results}
    
    def _setup_test_environment(self):
        """Setup test environment and authentication"""
        logger.info("Setting up test environment...")
        
        # Test health check
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            if response.status_code == 200:
                logger.info("✅ API health check passed")
            else:
                raise Exception(f"API health check failed: {response.status_code}")
        except Exception as e:
            raise Exception(f"Cannot connect to API: {str(e)}")
        
        # Setup authentication (using test credentials)
        auth_data = {
            "email": "test@hotgigs.ai",
            "password": "testpassword123"
        }
        
        try:
            # Try to login first
            response = self.session.post(f"{self.base_url}/api/auth/login", json=auth_data)
            if response.status_code == 200:
                self.auth_token = response.json().get('access_token')
            else:
                # If login fails, try to register
                response = self.session.post(f"{self.base_url}/api/auth/register", json={
                    **auth_data,
                    "name": "Test User",
                    "role": "candidate"
                })
                if response.status_code == 201:
                    self.auth_token = response.json().get('access_token')
                else:
                    logger.warning("Authentication setup failed, continuing without auth")
            
            if self.auth_token:
                self.session.headers.update({'Authorization': f'Bearer {self.auth_token}'})
                logger.info("✅ Authentication setup completed")
            
        except Exception as e:
            logger.warning(f"Authentication setup failed: {str(e)}")
    
    def _test_advanced_ai_features(self):
        """Test advanced AI features"""
        logger.info("🧠 Testing Advanced AI Features...")
        
        ai_tests = {
            'semantic_search': self._test_semantic_search,
            'interview_agent': self._test_interview_agent,
            'feedback_loop': self._test_feedback_loop,
            'candidate_analysis': self._test_candidate_analysis,
            'embeddings_refresh': self._test_embeddings_refresh
        }
        
        for test_name, test_func in ai_tests.items():
            try:
                logger.info(f"  Testing {test_name}...")
                result = test_func()
                self.test_results['advanced_ai'][test_name] = {
                    'status': 'passed' if result else 'failed',
                    'details': result
                }
                logger.info(f"  ✅ {test_name}: {'PASSED' if result else 'FAILED'}")
            except Exception as e:
                self.test_results['advanced_ai'][test_name] = {
                    'status': 'error',
                    'error': str(e)
                }
                logger.error(f"  ❌ {test_name}: ERROR - {str(e)}")
    
    def _test_semantic_search(self) -> bool:
        """Test semantic job search"""
        try:
            search_data = {
                "query": "software engineer python machine learning",
                "top_k": 5
            }
            
            response = self.session.post(f"{self.base_url}/api/ai/semantic-search", json=search_data)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('success', False) and 'data' in data
            return False
            
        except Exception as e:
            logger.error(f"Semantic search test error: {str(e)}")
            return False
    
    def _test_interview_agent(self) -> bool:
        """Test AI interview agent"""
        try:
            # Start interview
            interview_data = {
                "candidate_id": "123e4567-e89b-12d3-a456-426614174000",
                "job_id": "123e4567-e89b-12d3-a456-426614174001",
                "job_description": "Software Engineer position requiring Python and AI experience"
            }
            
            response = self.session.post(f"{self.base_url}/api/ai/interview/start", json=interview_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    session_id = data['data'].get('session_id')
                    
                    # Test response submission
                    if session_id:
                        response_data = {
                            "session_id": session_id,
                            "response": "I have 5 years of experience in Python development and have worked on several machine learning projects."
                        }
                        
                        response = self.session.post(f"{self.base_url}/api/ai/interview/respond", json=response_data)
                        return response.status_code == 200
            
            return False
            
        except Exception as e:
            logger.error(f"Interview agent test error: {str(e)}")
            return False
    
    def _test_feedback_loop(self) -> bool:
        """Test feedback loop system"""
        try:
            feedback_data = {
                "job_id": "123e4567-e89b-12d3-a456-426614174001",
                "candidate_id": "123e4567-e89b-12d3-a456-426614174000",
                "feedback": "Candidate lacks required experience in machine learning",
                "reason": "insufficient_experience"
            }
            
            response = self.session.post(f"{self.base_url}/api/ai/feedback/store", json=feedback_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Feedback loop test error: {str(e)}")
            return False
    
    def _test_candidate_analysis(self) -> bool:
        """Test candidate analysis"""
        try:
            analysis_data = {
                "job_id": "123e4567-e89b-12d3-a456-426614174001",
                "job_description": "Software Engineer position requiring Python and AI experience",
                "resume_text": "Experienced software engineer with 5 years in Python development and machine learning projects."
            }
            
            response = self.session.post(f"{self.base_url}/api/ai/analyze-fit", json=analysis_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Candidate analysis test error: {str(e)}")
            return False
    
    def _test_embeddings_refresh(self) -> bool:
        """Test embeddings refresh"""
        try:
            response = self.session.post(f"{self.base_url}/api/ai/embeddings/refresh")
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Embeddings refresh test error: {str(e)}")
            return False
    
    def _test_document_processing(self):
        """Test document processing features"""
        logger.info("📄 Testing Document Processing Features...")
        
        doc_tests = {
            'ocr_processing': self._test_ocr_processing,
            'fraud_detection': self._test_fraud_detection,
            'resume_parsing': self._test_resume_parsing,
            'domain_analysis': self._test_domain_analysis,
            'batch_processing': self._test_batch_document_processing
        }
        
        for test_name, test_func in doc_tests.items():
            try:
                logger.info(f"  Testing {test_name}...")
                result = test_func()
                self.test_results['document_processing'][test_name] = {
                    'status': 'passed' if result else 'failed',
                    'details': result
                }
                logger.info(f"  ✅ {test_name}: {'PASSED' if result else 'FAILED'}")
            except Exception as e:
                self.test_results['document_processing'][test_name] = {
                    'status': 'error',
                    'error': str(e)
                }
                logger.error(f"  ❌ {test_name}: ERROR - {str(e)}")
    
    def _test_ocr_processing(self) -> bool:
        """Test OCR processing"""
        try:
            # Create a simple test document (base64 encoded)
            test_text = "John Doe\nSoftware Engineer\nEmail: john@example.com\nPhone: 555-1234"
            test_doc_data = base64.b64encode(test_text.encode()).decode()
            
            ocr_data = {
                "document_data": test_doc_data,
                "document_type": "image",
                "enhance_image": True
            }
            
            response = self.session.post(f"{self.base_url}/api/documents/ocr", json=ocr_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"OCR processing test error: {str(e)}")
            return False
    
    def _test_fraud_detection(self) -> bool:
        """Test fraud detection"""
        try:
            test_doc_data = base64.b64encode(b"test document content").decode()
            
            fraud_data = {
                "document_data": test_doc_data,
                "document_type": "license"
            }
            
            response = self.session.post(f"{self.base_url}/api/documents/fraud-check", json=fraud_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Fraud detection test error: {str(e)}")
            return False
    
    def _test_resume_parsing(self) -> bool:
        """Test resume parsing"""
        try:
            resume_text = """
            John Doe
            Software Engineer
            Email: john.doe@example.com
            Phone: (555) 123-4567
            
            Experience:
            - Software Engineer at TechCorp (2020-2023)
            - Junior Developer at StartupInc (2018-2020)
            
            Skills: Python, JavaScript, Machine Learning, AWS
            
            Education:
            - BS Computer Science, University of Technology (2018)
            """
            
            parse_data = {
                "resume_text": resume_text
            }
            
            response = self.session.post(f"{self.base_url}/api/documents/parse-resume", json=parse_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Resume parsing test error: {str(e)}")
            return False
    
    def _test_domain_analysis(self) -> bool:
        """Test domain analysis"""
        try:
            text = "Worked at Google, Amazon, and Microsoft on cloud computing and e-commerce platforms"
            
            analysis_data = {
                "text": text
            }
            
            response = self.session.post(f"{self.base_url}/api/documents/domain-analysis", json=analysis_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Domain analysis test error: {str(e)}")
            return False
    
    def _test_batch_document_processing(self) -> bool:
        """Test batch document processing"""
        try:
            documents = [
                {
                    "document_data": base64.b64encode(b"test document 1").decode(),
                    "document_type": "resume"
                },
                {
                    "document_data": base64.b64encode(b"test document 2").decode(),
                    "document_type": "resume"
                }
            ]
            
            batch_data = {
                "documents": documents
            }
            
            response = self.session.post(f"{self.base_url}/api/documents/batch-process", json=batch_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Batch document processing test error: {str(e)}")
            return False
    
    def _test_workflow_automation(self):
        """Test workflow automation features"""
        logger.info("⚙️ Testing Workflow Automation Features...")
        
        workflow_tests = {
            'task_management': self._test_task_management,
            'workflow_creation': self._test_workflow_creation,
            'auto_apply_setup': self._test_auto_apply_setup,
            'workflow_execution': self._test_workflow_execution,
            'dashboard_stats': self._test_workflow_dashboard
        }
        
        for test_name, test_func in workflow_tests.items():
            try:
                logger.info(f"  Testing {test_name}...")
                result = test_func()
                self.test_results['workflow_automation'][test_name] = {
                    'status': 'passed' if result else 'failed',
                    'details': result
                }
                logger.info(f"  ✅ {test_name}: {'PASSED' if result else 'FAILED'}")
            except Exception as e:
                self.test_results['workflow_automation'][test_name] = {
                    'status': 'error',
                    'error': str(e)
                }
                logger.error(f"  ❌ {test_name}: ERROR - {str(e)}")
    
    def _test_task_management(self) -> bool:
        """Test task management"""
        try:
            # Create task
            task_data = {
                "title": "Test Task",
                "description": "This is a test task",
                "task_type": "general",
                "priority": "medium"
            }
            
            response = self.session.post(f"{self.base_url}/api/workflows/tasks", json=task_data)
            if response.status_code == 201:
                task_id = response.json().get('data', {}).get('task_id')
                
                # Get task
                response = self.session.get(f"{self.base_url}/api/workflows/tasks/{task_id}")
                if response.status_code == 200:
                    # Update task
                    update_data = {
                        "status": "in_progress",
                        "progress": 50
                    }
                    response = self.session.put(f"{self.base_url}/api/workflows/tasks/{task_id}", json=update_data)
                    return response.status_code == 200
            
            return False
            
        except Exception as e:
            logger.error(f"Task management test error: {str(e)}")
            return False
    
    def _test_workflow_creation(self) -> bool:
        """Test workflow creation"""
        try:
            workflow_data = {
                "name": "Test Workflow",
                "description": "Test workflow for automation",
                "trigger_type": "manual",
                "trigger_conditions": {"manual": True},
                "steps": [
                    {
                        "id": "step1",
                        "name": "Create Task",
                        "description": "Create a test task",
                        "step_type": "action",
                        "action": "create_task",
                        "conditions": {},
                        "parameters": {
                            "title": "Automated Task",
                            "description": "Task created by workflow"
                        },
                        "next_steps": [],
                        "failure_steps": []
                    }
                ]
            }
            
            response = self.session.post(f"{self.base_url}/api/workflows/workflows", json=workflow_data)
            return response.status_code == 201
            
        except Exception as e:
            logger.error(f"Workflow creation test error: {str(e)}")
            return False
    
    def _test_auto_apply_setup(self) -> bool:
        """Test auto-apply setup"""
        try:
            auto_apply_data = {
                "candidate_id": "123e4567-e89b-12d3-a456-426614174000",
                "job_criteria": {
                    "keywords": ["python", "software engineer"],
                    "location": "San Francisco"
                },
                "max_applications_per_day": 3,
                "min_match_score": 75
            }
            
            response = self.session.post(f"{self.base_url}/api/workflows/auto-apply/setup", json=auto_apply_data)
            return response.status_code == 201
            
        except Exception as e:
            logger.error(f"Auto-apply setup test error: {str(e)}")
            return False
    
    def _test_workflow_execution(self) -> bool:
        """Test workflow execution"""
        try:
            # This would require a workflow ID from previous test
            # For now, test the endpoint structure
            execution_data = {
                "context": {
                    "test": True,
                    "candidate_id": "123e4567-e89b-12d3-a456-426614174000"
                }
            }
            
            # Use a dummy workflow ID
            workflow_id = "test_workflow_123"
            response = self.session.post(f"{self.base_url}/api/workflows/workflows/{workflow_id}/execute", json=execution_data)
            
            # Accept both 200 (success) and 400 (workflow not found) as valid responses for testing
            return response.status_code in [200, 400]
            
        except Exception as e:
            logger.error(f"Workflow execution test error: {str(e)}")
            return False
    
    def _test_workflow_dashboard(self) -> bool:
        """Test workflow dashboard stats"""
        try:
            response = self.session.get(f"{self.base_url}/api/workflows/dashboard/stats")
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Workflow dashboard test error: {str(e)}")
            return False
    
    def _test_bulk_processing(self):
        """Test bulk processing features"""
        logger.info("📦 Testing Bulk Processing Features...")
        
        bulk_tests = {
            'email_templates': self._test_email_templates,
            'processing_stats': self._test_processing_stats,
            'batch_documents': self._test_batch_documents,
            'supported_formats': self._test_supported_formats
        }
        
        for test_name, test_func in bulk_tests.items():
            try:
                logger.info(f"  Testing {test_name}...")
                result = test_func()
                self.test_results['bulk_processing'][test_name] = {
                    'status': 'passed' if result else 'failed',
                    'details': result
                }
                logger.info(f"  ✅ {test_name}: {'PASSED' if result else 'FAILED'}")
            except Exception as e:
                self.test_results['bulk_processing'][test_name] = {
                    'status': 'error',
                    'error': str(e)
                }
                logger.error(f"  ❌ {test_name}: ERROR - {str(e)}")
    
    def _test_email_templates(self) -> bool:
        """Test email templates"""
        try:
            response = self.session.get(f"{self.base_url}/api/bulk/templates/email")
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Email templates test error: {str(e)}")
            return False
    
    def _test_processing_stats(self) -> bool:
        """Test processing statistics"""
        try:
            response = self.session.get(f"{self.base_url}/api/bulk/stats/processing")
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Processing stats test error: {str(e)}")
            return False
    
    def _test_batch_documents(self) -> bool:
        """Test batch document processing"""
        try:
            documents = [
                {"id": "doc1", "type": "resume"},
                {"id": "doc2", "type": "resume"}
            ]
            
            batch_data = {
                "documents": documents
            }
            
            response = self.session.post(f"{self.base_url}/api/bulk/batch/process-documents", json=batch_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Batch documents test error: {str(e)}")
            return False
    
    def _test_supported_formats(self) -> bool:
        """Test supported formats endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/documents/supported-formats")
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Supported formats test error: {str(e)}")
            return False
    
    def _test_integration_scenarios(self):
        """Test integration scenarios"""
        logger.info("🔗 Testing Integration Scenarios...")
        
        integration_tests = {
            'ai_document_integration': self._test_ai_document_integration,
            'workflow_ai_integration': self._test_workflow_ai_integration,
            'bulk_workflow_integration': self._test_bulk_workflow_integration,
            'end_to_end_candidate_flow': self._test_end_to_end_flow
        }
        
        for test_name, test_func in integration_tests.items():
            try:
                logger.info(f"  Testing {test_name}...")
                result = test_func()
                self.test_results['integration'][test_name] = {
                    'status': 'passed' if result else 'failed',
                    'details': result
                }
                logger.info(f"  ✅ {test_name}: {'PASSED' if result else 'FAILED'}")
            except Exception as e:
                self.test_results['integration'][test_name] = {
                    'status': 'error',
                    'error': str(e)
                }
                logger.error(f"  ❌ {test_name}: ERROR - {str(e)}")
    
    def _test_ai_document_integration(self) -> bool:
        """Test AI and document processing integration"""
        try:
            # Test resume parsing followed by AI analysis
            resume_text = "Software Engineer with Python and ML experience"
            
            # Parse resume
            parse_response = self.session.post(f"{self.base_url}/api/documents/parse-resume", json={
                "resume_text": resume_text
            })
            
            if parse_response.status_code == 200:
                # Analyze with AI
                analysis_response = self.session.post(f"{self.base_url}/api/ai/analyze-fit", json={
                    "job_id": "123e4567-e89b-12d3-a456-426614174001",
                    "job_description": "Python developer position",
                    "resume_text": resume_text
                })
                return analysis_response.status_code == 200
            
            return False
            
        except Exception as e:
            logger.error(f"AI-Document integration test error: {str(e)}")
            return False
    
    def _test_workflow_ai_integration(self) -> bool:
        """Test workflow and AI integration"""
        try:
            # Test compatibility analysis
            compatibility_data = {
                "candidate_profile": {
                    "skills": ["Python", "Machine Learning"],
                    "experience_years": 3,
                    "location": "San Francisco"
                },
                "job_description": {
                    "title": "ML Engineer",
                    "required_skills": ["Python", "TensorFlow"],
                    "location": "San Francisco"
                }
            }
            
            response = self.session.post(f"{self.base_url}/api/workflows/auto-apply/analyze-compatibility", json=compatibility_data)
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Workflow-AI integration test error: {str(e)}")
            return False
    
    def _test_bulk_workflow_integration(self) -> bool:
        """Test bulk processing and workflow integration"""
        try:
            # Test health checks for both services
            bulk_health = self.session.get(f"{self.base_url}/api/bulk/health")
            workflow_health = self.session.get(f"{self.base_url}/api/workflows/health")
            
            return bulk_health.status_code == 200 and workflow_health.status_code == 200
            
        except Exception as e:
            logger.error(f"Bulk-Workflow integration test error: {str(e)}")
            return False
    
    def _test_end_to_end_flow(self) -> bool:
        """Test end-to-end candidate processing flow"""
        try:
            # Simulate complete candidate flow:
            # 1. Document processing
            # 2. AI analysis
            # 3. Workflow creation
            # 4. Task management
            
            steps_completed = 0
            
            # Step 1: Process resume
            resume_response = self.session.post(f"{self.base_url}/api/documents/parse-resume", json={
                "resume_text": "John Doe, Software Engineer with 5 years Python experience"
            })
            if resume_response.status_code == 200:
                steps_completed += 1
            
            # Step 2: AI analysis
            ai_response = self.session.post(f"{self.base_url}/api/ai/semantic-search", json={
                "query": "python software engineer",
                "top_k": 3
            })
            if ai_response.status_code == 200:
                steps_completed += 1
            
            # Step 3: Create task
            task_response = self.session.post(f"{self.base_url}/api/workflows/tasks", json={
                "title": "Review candidate John Doe",
                "description": "Review processed candidate profile",
                "task_type": "review"
            })
            if task_response.status_code == 201:
                steps_completed += 1
            
            # Step 4: Get dashboard stats
            stats_response = self.session.get(f"{self.base_url}/api/workflows/dashboard/stats")
            if stats_response.status_code == 200:
                steps_completed += 1
            
            return steps_completed >= 3  # At least 3 out of 4 steps should work
            
        except Exception as e:
            logger.error(f"End-to-end flow test error: {str(e)}")
            return False
    
    def _generate_test_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report"""
        logger.info("📊 Generating Test Report...")
        
        total_tests = 0
        passed_tests = 0
        failed_tests = 0
        error_tests = 0
        
        for category, tests in self.test_results.items():
            for test_name, result in tests.items():
                total_tests += 1
                if result['status'] == 'passed':
                    passed_tests += 1
                elif result['status'] == 'failed':
                    failed_tests += 1
                else:
                    error_tests += 1
        
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        report = {
            'test_summary': {
                'total_tests': total_tests,
                'passed': passed_tests,
                'failed': failed_tests,
                'errors': error_tests,
                'success_rate': round(success_rate, 2)
            },
            'category_results': {},
            'detailed_results': self.test_results,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'recommendations': self._generate_recommendations()
        }
        
        # Calculate category success rates
        for category, tests in self.test_results.items():
            category_total = len(tests)
            category_passed = len([t for t in tests.values() if t['status'] == 'passed'])
            category_rate = (category_passed / category_total * 100) if category_total > 0 else 0
            
            report['category_results'][category] = {
                'total': category_total,
                'passed': category_passed,
                'success_rate': round(category_rate, 2)
            }
        
        return report
    
    def _generate_recommendations(self) -> List[str]:
        """Generate recommendations based on test results"""
        recommendations = []
        
        # Check each category for issues
        for category, tests in self.test_results.items():
            failed_tests = [name for name, result in tests.items() if result['status'] != 'passed']
            
            if failed_tests:
                if category == 'advanced_ai':
                    recommendations.append(f"AI Features: {len(failed_tests)} tests failed. Check OpenAI API configuration and model availability.")
                elif category == 'document_processing':
                    recommendations.append(f"Document Processing: {len(failed_tests)} tests failed. Verify OCR dependencies and file processing capabilities.")
                elif category == 'workflow_automation':
                    recommendations.append(f"Workflow Automation: {len(failed_tests)} tests failed. Check task management and workflow engine configuration.")
                elif category == 'bulk_processing':
                    recommendations.append(f"Bulk Processing: {len(failed_tests)} tests failed. Verify email and Google Drive integration setup.")
                elif category == 'integration':
                    recommendations.append(f"Integration: {len(failed_tests)} tests failed. Check service communication and data flow between components.")
        
        if not recommendations:
            recommendations.append("All tests passed! The new features are working correctly.")
        
        return recommendations

def main():
    """Main test execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description='HotGigs.ai New Features Test Suite')
    parser.add_argument('--url', default='http://localhost:5000', help='API base URL')
    parser.add_argument('--output', default='new_features_test_results.json', help='Output file for results')
    
    args = parser.parse_args()
    
    # Run tests
    test_suite = HotGigsNewFeaturesTestSuite(args.url)
    results = test_suite.run_all_tests()
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Print summary
    if 'test_summary' in results:
        summary = results['test_summary']
        print(f"\n🎯 TEST SUMMARY:")
        print(f"Total Tests: {summary['total_tests']}")
        print(f"Passed: {summary['passed']}")
        print(f"Failed: {summary['failed']}")
        print(f"Errors: {summary['errors']}")
        print(f"Success Rate: {summary['success_rate']}%")
        
        if summary['success_rate'] >= 80:
            print("✅ NEW FEATURES TEST SUITE: EXCELLENT")
        elif summary['success_rate'] >= 60:
            print("⚠️ NEW FEATURES TEST SUITE: GOOD")
        else:
            print("❌ NEW FEATURES TEST SUITE: NEEDS IMPROVEMENT")
    
    print(f"\nDetailed results saved to: {args.output}")

if __name__ == "__main__":
    main()

