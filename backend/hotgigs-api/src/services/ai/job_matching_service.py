"""
Job Matching Service for HotGigs.ai
Implements AI-powered job matching algorithms with feedback loop and recommendation system
"""

import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from .openai_service import get_openai_service
from ..database import get_database_service

logger = logging.getLogger(__name__)

class JobMatchingService:
    def __init__(self):
        """Initialize job matching service"""
        self.openai_service = get_openai_service()
        self.db_service = get_database_service()
    
    def find_matching_jobs(self, candidate_id: str, limit: int = 20) -> Dict[str, Any]:
        """
        Find jobs that match a candidate's profile using AI analysis
        """
        try:
            # Get candidate profile
            candidate = self.db_service.get_record_by_id('candidate_profiles', candidate_id)
            if not candidate:
                return {"success": False, "error": "Candidate not found"}
            
            # Get candidate's resume and skills
            candidate_data = {
                "skills": candidate.get('skills', []),
                "experience": candidate.get('experience_years', 0),
                "education": candidate.get('education', []),
                "preferences": candidate.get('job_preferences', {}),
                "resume_text": candidate.get('resume_text', '')
            }
            
            # Get active jobs
            active_jobs = self.db_service.get_records('jobs', {
                'status': 'active',
                'limit': 100  # Get more jobs for better matching
            })
            
            job_matches = []
            
            for job in active_jobs:
                # Calculate match score using AI
                match_result = self.openai_service.calculate_job_match_score(
                    candidate_data, 
                    job.get('description', '')
                )
                
                if match_result['success']:
                    match_analysis = match_result['match_analysis']
                    match_score = float(match_analysis.get('match_score', 0))
                    
                    # Apply additional filters based on candidate preferences
                    if self._meets_candidate_preferences(job, candidate.get('job_preferences', {})):
                        job_matches.append({
                            'job_id': job['id'],
                            'job_title': job['title'],
                            'company_name': job['company_name'],
                            'location': job['location'],
                            'salary_range': {
                                'min': job.get('salary_min'),
                                'max': job.get('salary_max')
                            },
                            'job_type': job.get('job_type'),
                            'match_score': match_score,
                            'match_analysis': match_analysis,
                            'posted_date': job.get('created_at'),
                            'application_deadline': job.get('application_deadline')
                        })
            
            # Sort by match score and limit results
            job_matches.sort(key=lambda x: x['match_score'], reverse=True)
            job_matches = job_matches[:limit]
            
            return {
                "success": True,
                "matches": job_matches,
                "total_analyzed": len(active_jobs),
                "total_matches": len(job_matches),
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Job matching failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def find_matching_candidates(self, job_id: str, limit: int = 20) -> Dict[str, Any]:
        """
        Find candidates that match a job posting using AI analysis
        """
        try:
            # Get job details
            job = self.db_service.get_record_by_id('jobs', job_id)
            if not job:
                return {"success": False, "error": "Job not found"}
            
            # Get active candidates
            candidates = self.db_service.get_records('candidate_profiles', {
                'status': 'active',
                'limit': 100
            })
            
            candidate_matches = []
            
            for candidate in candidates:
                candidate_data = {
                    "skills": candidate.get('skills', []),
                    "experience": candidate.get('experience_years', 0),
                    "education": candidate.get('education', []),
                    "resume_text": candidate.get('resume_text', ''),
                    "location": candidate.get('location', ''),
                    "availability": candidate.get('availability', {})
                }
                
                # Calculate match score using AI
                match_result = self.openai_service.calculate_job_match_score(
                    candidate_data, 
                    job.get('description', '')
                )
                
                if match_result['success']:
                    match_analysis = match_result['match_analysis']
                    match_score = float(match_analysis.get('match_score', 0))
                    
                    # Get historical feedback for this job if available
                    feedback_score = self._get_feedback_enhanced_score(
                        job_id, candidate_data, match_score
                    )
                    
                    candidate_matches.append({
                        'candidate_id': candidate['id'],
                        'candidate_name': f"{candidate.get('first_name', '')} {candidate.get('last_name', '')}",
                        'email': candidate.get('email'),
                        'location': candidate.get('location'),
                        'experience_years': candidate.get('experience_years', 0),
                        'current_title': candidate.get('current_title'),
                        'match_score': match_score,
                        'feedback_enhanced_score': feedback_score,
                        'match_analysis': match_analysis,
                        'profile_updated': candidate.get('updated_at'),
                        'availability': candidate.get('availability', {})
                    })
            
            # Sort by feedback-enhanced score, then by match score
            candidate_matches.sort(
                key=lambda x: (x['feedback_enhanced_score'], x['match_score']), 
                reverse=True
            )
            candidate_matches = candidate_matches[:limit]
            
            return {
                "success": True,
                "matches": candidate_matches,
                "total_analyzed": len(candidates),
                "total_matches": len(candidate_matches),
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Candidate matching failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_resume_improvement_suggestions(self, candidate_id: str, job_id: str) -> Dict[str, Any]:
        """
        Provide AI-powered resume improvement suggestions based on job requirements and historical feedback
        """
        try:
            # Get candidate and job data
            candidate = self.db_service.get_record_by_id('candidate_profiles', candidate_id)
            job = self.db_service.get_record_by_id('jobs', job_id)
            
            if not candidate or not job:
                return {"success": False, "error": "Candidate or job not found"}
            
            # Get historical rejection feedback for this job
            historical_feedback = self._get_historical_feedback(job_id)
            
            # Analyze resume against job requirements
            resume_analysis = self.openai_service.analyze_resume(
                candidate.get('resume_text', ''),
                job.get('description', '')
            )
            
            if not resume_analysis['success']:
                return resume_analysis
            
            # Generate improvement suggestions using historical feedback
            improvement_prompt = f"""
            Based on the resume analysis and historical feedback for similar positions, provide specific improvement suggestions:

            Resume Analysis:
            {json.dumps(resume_analysis['analysis'], indent=2)}

            Job Description:
            {job.get('description', '')}

            Historical Rejection Feedback:
            {json.dumps(historical_feedback, indent=2)}

            Provide suggestions in JSON format:
            {{
                "priority_improvements": [
                    {{
                        "area": "specific area to improve",
                        "current_issue": "what's currently lacking",
                        "suggestion": "specific improvement suggestion",
                        "impact": "high/medium/low",
                        "based_on": "job_requirements/historical_feedback/both"
                    }}
                ],
                "skill_gaps": [
                    {{
                        "skill": "missing skill",
                        "importance": "critical/important/nice-to-have",
                        "how_to_acquire": "suggestion for acquiring this skill"
                    }}
                ],
                "resume_optimization": {{
                    "keywords_to_add": ["important keywords missing"],
                    "sections_to_enhance": ["sections that need improvement"],
                    "formatting_suggestions": ["formatting improvements"]
                }},
                "success_probability": {{
                    "current_score": "current probability of success (0-100)",
                    "improved_score": "potential score after improvements (0-100)",
                    "key_factors": ["main factors affecting success probability"]
                }}
            }}
            """
            
            improvement_result = self.openai_service.client.chat.completions.create(
                model=self.openai_service.models['analysis'],
                messages=[
                    {"role": "system", "content": "You are an expert resume consultant and career advisor. Provide actionable, specific improvement suggestions."},
                    {"role": "user", "content": improvement_prompt}
                ],
                temperature=0.3,
                max_tokens=1500
            )
            
            suggestions = json.loads(improvement_result.choices[0].message.content)
            
            return {
                "success": True,
                "suggestions": suggestions,
                "historical_feedback_used": len(historical_feedback) > 0,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Resume improvement suggestions failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def store_application_feedback(self, application_id: str, feedback_data: Dict) -> Dict[str, Any]:
        """
        Store feedback from rejected applications for future matching improvements
        """
        try:
            feedback_record = {
                "application_id": application_id,
                "feedback_type": feedback_data.get('type', 'rejection'),
                "feedback_text": feedback_data.get('feedback', ''),
                "rejection_reasons": feedback_data.get('reasons', []),
                "missing_skills": feedback_data.get('missing_skills', []),
                "experience_gap": feedback_data.get('experience_gap', ''),
                "cultural_fit_issues": feedback_data.get('cultural_fit_issues', []),
                "interviewer_notes": feedback_data.get('interviewer_notes', ''),
                "created_at": datetime.utcnow().isoformat(),
                "created_by": feedback_data.get('created_by')
            }
            
            # Store in application_feedback table
            result = self.db_service.create_record('application_feedback', feedback_record)
            
            return {
                "success": True,
                "feedback_id": result.get('id'),
                "message": "Feedback stored successfully"
            }
            
        except Exception as e:
            logger.error(f"Storing application feedback failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def _meets_candidate_preferences(self, job: Dict, preferences: Dict) -> bool:
        """
        Check if job meets candidate's preferences
        """
        try:
            # Check location preference
            if preferences.get('preferred_locations'):
                job_location = job.get('location', '').lower()
                preferred_locations = [loc.lower() for loc in preferences['preferred_locations']]
                if not any(loc in job_location for loc in preferred_locations) and 'remote' not in job_location:
                    return False
            
            # Check salary preference
            if preferences.get('min_salary'):
                job_salary_max = job.get('salary_max', 0)
                if job_salary_max and job_salary_max < preferences['min_salary']:
                    return False
            
            # Check job type preference
            if preferences.get('job_types'):
                if job.get('job_type') not in preferences['job_types']:
                    return False
            
            # Check company size preference
            if preferences.get('company_sizes'):
                company_size = job.get('company_size', 'unknown')
                if company_size not in preferences['company_sizes']:
                    return False
            
            return True
            
        except Exception:
            return True  # If preference checking fails, don't filter out the job
    
    def _get_historical_feedback(self, job_id: str) -> List[Dict]:
        """
        Get historical rejection feedback for a specific job
        """
        try:
            # Get applications for this job that were rejected
            rejected_applications = self.db_service.get_records('applications', {
                'job_id': job_id,
                'status': 'rejected',
                'limit': 50
            })
            
            feedback_list = []
            for app in rejected_applications:
                feedback = self.db_service.get_records('application_feedback', {
                    'application_id': app['id']
                })
                feedback_list.extend(feedback)
            
            return feedback_list
            
        except Exception as e:
            logger.error(f"Getting historical feedback failed: {str(e)}")
            return []
    
    def _get_feedback_enhanced_score(self, job_id: str, candidate_data: Dict, base_score: float) -> float:
        """
        Enhance match score based on historical feedback for this job
        """
        try:
            historical_feedback = self._get_historical_feedback(job_id)
            
            if not historical_feedback:
                return base_score
            
            # Analyze common rejection patterns
            common_issues = {}
            for feedback in historical_feedback:
                for reason in feedback.get('rejection_reasons', []):
                    common_issues[reason] = common_issues.get(reason, 0) + 1
                
                for skill in feedback.get('missing_skills', []):
                    skill_key = f"missing_skill_{skill}"
                    common_issues[skill_key] = common_issues.get(skill_key, 0) + 1
            
            # Calculate adjustment based on whether candidate has common issues
            adjustment = 0
            candidate_skills = [skill.lower() for skill in candidate_data.get('skills', [])]
            
            for issue, frequency in common_issues.items():
                weight = frequency / len(historical_feedback)  # How common this issue is
                
                if issue.startswith('missing_skill_'):
                    skill = issue.replace('missing_skill_', '').lower()
                    if skill in candidate_skills:
                        adjustment += weight * 10  # Boost score if candidate has commonly missing skill
                    else:
                        adjustment -= weight * 15  # Reduce score if candidate lacks commonly needed skill
                
                elif issue in ['insufficient_experience', 'experience_gap']:
                    if candidate_data.get('experience', 0) >= 3:  # Assuming 3+ years is good
                        adjustment += weight * 5
                    else:
                        adjustment -= weight * 10
            
            # Apply adjustment (cap between -20 and +20)
            adjustment = max(-20, min(20, adjustment))
            enhanced_score = max(0, min(100, base_score + adjustment))
            
            return enhanced_score
            
        except Exception as e:
            logger.error(f"Feedback enhancement failed: {str(e)}")
            return base_score

# Create global instance
def get_job_matching_service():
    """Get job matching service instance"""
    return JobMatchingService()

