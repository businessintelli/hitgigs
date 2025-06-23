"""
AI Interview Agent Service for HotGigs.ai
Conducts interviews like a real person, asks questions, collects responses, and provides assessments
"""

import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from .openai_service import get_openai_service
from ..database import get_database_service

logger = logging.getLogger(__name__)

class AIInterviewAgent:
    def __init__(self):
        """Initialize AI Interview Agent"""
        self.openai_service = get_openai_service()
        self.db_service = get_database_service()
        
        # Interview configuration
        self.interview_types = {
            'screening': {
                'duration': 15,
                'question_count': 5,
                'focus': 'basic qualifications and fit'
            },
            'technical': {
                'duration': 45,
                'question_count': 8,
                'focus': 'technical skills and problem-solving'
            },
            'behavioral': {
                'duration': 30,
                'question_count': 6,
                'focus': 'soft skills and cultural fit'
            },
            'comprehensive': {
                'duration': 60,
                'question_count': 12,
                'focus': 'complete assessment'
            }
        }
    
    def create_interview_session(self, application_id: str, interview_type: str = 'comprehensive') -> Dict[str, Any]:
        """
        Create a new AI interview session for a candidate
        """
        try:
            # Get application details
            application = self.db_service.get_record_by_id('applications', application_id)
            if not application:
                return {"success": False, "error": "Application not found"}
            
            # Get job and candidate details
            job = self.db_service.get_record_by_id('jobs', application['job_id'])
            candidate = self.db_service.get_record_by_id('candidate_profiles', application['candidate_id'])
            
            if not job or not candidate:
                return {"success": False, "error": "Job or candidate not found"}
            
            # Generate interview questions
            questions_result = self.openai_service.generate_interview_questions(
                job.get('description', ''),
                candidate.get('resume_text', ''),
                self.interview_types[interview_type]['question_count']
            )
            
            if not questions_result['success']:
                return questions_result
            
            # Create interview session record
            session_data = {
                "application_id": application_id,
                "job_id": application['job_id'],
                "candidate_id": application['candidate_id'],
                "interview_type": interview_type,
                "status": "scheduled",
                "questions": questions_result['questions_data']['questions'],
                "interview_config": self.interview_types[interview_type],
                "current_question_index": 0,
                "responses": [],
                "assessments": [],
                "overall_score": None,
                "created_at": datetime.utcnow().isoformat(),
                "scheduled_for": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
                "estimated_duration": self.interview_types[interview_type]['duration']
            }
            
            # Store session in database
            session_result = self.db_service.create_record('interview_sessions', session_data)
            
            return {
                "success": True,
                "session_id": session_result['id'],
                "interview_type": interview_type,
                "estimated_duration": session_data['estimated_duration'],
                "question_count": len(session_data['questions']),
                "scheduled_for": session_data['scheduled_for'],
                "first_question": session_data['questions'][0] if session_data['questions'] else None
            }
            
        except Exception as e:
            logger.error(f"Creating interview session failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def start_interview(self, session_id: str) -> Dict[str, Any]:
        """
        Start an AI interview session
        """
        try:
            # Get session details
            session = self.db_service.get_record_by_id('interview_sessions', session_id)
            if not session:
                return {"success": False, "error": "Interview session not found"}
            
            if session['status'] != 'scheduled':
                return {"success": False, "error": f"Interview is in '{session['status']}' status, cannot start"}
            
            # Update session status
            self.db_service.update_record('interview_sessions', session_id, {
                'status': 'in_progress',
                'started_at': datetime.utcnow().isoformat()
            })
            
            # Get first question
            first_question = session['questions'][0] if session['questions'] else None
            
            # Generate personalized welcome message
            welcome_message = self._generate_welcome_message(session)
            
            return {
                "success": True,
                "session_id": session_id,
                "status": "in_progress",
                "welcome_message": welcome_message,
                "first_question": first_question,
                "total_questions": len(session['questions']),
                "estimated_duration": session['estimated_duration']
            }
            
        except Exception as e:
            logger.error(f"Starting interview failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def submit_response(self, session_id: str, response_text: str) -> Dict[str, Any]:
        """
        Submit candidate response and get next question or feedback
        """
        try:
            # Get session details
            session = self.db_service.get_record_by_id('interview_sessions', session_id)
            if not session:
                return {"success": False, "error": "Interview session not found"}
            
            if session['status'] != 'in_progress':
                return {"success": False, "error": "Interview is not in progress"}
            
            current_index = session['current_question_index']
            questions = session['questions']
            
            if current_index >= len(questions):
                return {"success": False, "error": "No more questions available"}
            
            current_question = questions[current_index]
            
            # Analyze the response using AI
            analysis_result = self.openai_service.conduct_ai_interview(
                current_question['question'],
                response_text,
                {
                    "question_context": current_question,
                    "interview_type": session['interview_type'],
                    "previous_responses": session.get('responses', [])
                }
            )
            
            if not analysis_result['success']:
                return analysis_result
            
            # Store response and analysis
            response_record = {
                "question_id": current_question['id'],
                "question": current_question['question'],
                "response": response_text,
                "analysis": analysis_result['analysis'],
                "timestamp": datetime.utcnow().isoformat(),
                "response_time_seconds": None  # Could be calculated if needed
            }
            
            # Update session with new response
            updated_responses = session.get('responses', [])
            updated_responses.append(response_record)
            
            # Determine next action
            next_index = current_index + 1
            is_interview_complete = next_index >= len(questions)
            
            update_data = {
                'responses': updated_responses,
                'current_question_index': next_index
            }
            
            if is_interview_complete:
                # Complete the interview
                final_assessment = self._generate_final_assessment(session_id, updated_responses)
                update_data.update({
                    'status': 'completed',
                    'completed_at': datetime.utcnow().isoformat(),
                    'final_assessment': final_assessment,
                    'overall_score': final_assessment.get('overall_score', 0)
                })
            
            # Update session
            self.db_service.update_record('interview_sessions', session_id, update_data)
            
            # Prepare response
            result = {
                "success": True,
                "session_id": session_id,
                "response_analysis": analysis_result['analysis'],
                "question_completed": current_index + 1,
                "total_questions": len(questions),
                "is_complete": is_interview_complete
            }
            
            if is_interview_complete:
                result.update({
                    "final_assessment": final_assessment,
                    "overall_score": final_assessment.get('overall_score', 0),
                    "recommendation": final_assessment.get('recommendation', 'review')
                })
            else:
                # Get next question
                next_question = questions[next_index]
                result["next_question"] = next_question
            
            return result
            
        except Exception as e:
            logger.error(f"Submitting response failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_interview_status(self, session_id: str) -> Dict[str, Any]:
        """
        Get current status of an interview session
        """
        try:
            session = self.db_service.get_record_by_id('interview_sessions', session_id)
            if not session:
                return {"success": False, "error": "Interview session not found"}
            
            # Calculate progress
            total_questions = len(session.get('questions', []))
            completed_questions = len(session.get('responses', []))
            progress_percentage = (completed_questions / total_questions * 100) if total_questions > 0 else 0
            
            # Calculate duration if started
            duration_minutes = None
            if session.get('started_at'):
                start_time = datetime.fromisoformat(session['started_at'].replace('Z', '+00:00'))
                if session['status'] == 'completed' and session.get('completed_at'):
                    end_time = datetime.fromisoformat(session['completed_at'].replace('Z', '+00:00'))
                else:
                    end_time = datetime.utcnow()
                duration_minutes = (end_time - start_time).total_seconds() / 60
            
            return {
                "success": True,
                "session_id": session_id,
                "status": session['status'],
                "interview_type": session['interview_type'],
                "progress": {
                    "completed_questions": completed_questions,
                    "total_questions": total_questions,
                    "percentage": round(progress_percentage, 1)
                },
                "timing": {
                    "estimated_duration": session['estimated_duration'],
                    "actual_duration": round(duration_minutes, 1) if duration_minutes else None,
                    "started_at": session.get('started_at'),
                    "completed_at": session.get('completed_at')
                },
                "current_question": session.get('questions', [])[session.get('current_question_index', 0)] if session.get('current_question_index', 0) < len(session.get('questions', [])) else None,
                "overall_score": session.get('overall_score'),
                "final_assessment": session.get('final_assessment') if session['status'] == 'completed' else None
            }
            
        except Exception as e:
            logger.error(f"Getting interview status failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_interview_report(self, session_id: str) -> Dict[str, Any]:
        """
        Generate comprehensive interview report
        """
        try:
            session = self.db_service.get_record_by_id('interview_sessions', session_id)
            if not session:
                return {"success": False, "error": "Interview session not found"}
            
            if session['status'] != 'completed':
                return {"success": False, "error": "Interview not completed yet"}
            
            # Get application and candidate details
            application = self.db_service.get_record_by_id('applications', session['application_id'])
            candidate = self.db_service.get_record_by_id('candidate_profiles', session['candidate_id'])
            job = self.db_service.get_record_by_id('jobs', session['job_id'])
            
            # Compile comprehensive report
            report = {
                "interview_details": {
                    "session_id": session_id,
                    "interview_type": session['interview_type'],
                    "conducted_on": session.get('started_at'),
                    "duration_minutes": self._calculate_duration(session),
                    "total_questions": len(session.get('questions', [])),
                    "responses_count": len(session.get('responses', []))
                },
                "candidate_info": {
                    "name": f"{candidate.get('first_name', '')} {candidate.get('last_name', '')}",
                    "email": candidate.get('email'),
                    "experience_years": candidate.get('experience_years', 0),
                    "current_title": candidate.get('current_title')
                },
                "job_info": {
                    "title": job.get('title'),
                    "company": job.get('company_name'),
                    "location": job.get('location')
                },
                "assessment_summary": session.get('final_assessment', {}),
                "detailed_responses": session.get('responses', []),
                "overall_score": session.get('overall_score', 0),
                "recommendation": session.get('final_assessment', {}).get('recommendation', 'review'),
                "key_strengths": session.get('final_assessment', {}).get('strengths', []),
                "areas_for_improvement": session.get('final_assessment', {}).get('improvement_areas', []),
                "next_steps": session.get('final_assessment', {}).get('next_steps', [])
            }
            
            return {
                "success": True,
                "report": report,
                "generated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Generating interview report failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def _generate_welcome_message(self, session: Dict) -> str:
        """
        Generate personalized welcome message for the interview
        """
        try:
            # Get candidate and job info
            candidate = self.db_service.get_record_by_id('candidate_profiles', session['candidate_id'])
            job = self.db_service.get_record_by_id('jobs', session['job_id'])
            
            candidate_name = candidate.get('first_name', 'Candidate')
            job_title = job.get('title', 'the position')
            company_name = job.get('company_name', 'our company')
            
            welcome_message = f"""
            Hello {candidate_name}! Welcome to your AI-powered interview for the {job_title} position at {company_name}.

            I'm your AI interview agent, and I'll be conducting this {session['interview_type']} interview with you today. 
            This interview is designed to assess your qualifications, skills, and fit for the role.

            Here's what to expect:
            • We'll have {len(session.get('questions', []))} questions to discuss
            • The interview should take approximately {session['estimated_duration']} minutes
            • Please answer each question thoughtfully and provide specific examples when possible
            • There are no right or wrong answers - I'm here to understand your experience and potential

            Are you ready to begin? Let's start with our first question.
            """
            
            return welcome_message.strip()
            
        except Exception:
            return "Welcome to your AI interview! Let's begin with the first question."
    
    def _generate_final_assessment(self, session_id: str, responses: List[Dict]) -> Dict[str, Any]:
        """
        Generate comprehensive final assessment based on all responses
        """
        try:
            # Compile all responses for analysis
            response_summary = []
            total_score = 0
            
            for response in responses:
                analysis = response.get('analysis', {})
                response_analysis = analysis.get('response_analysis', {})
                score = float(response_analysis.get('quality_score', 5))
                total_score += score
                
                response_summary.append({
                    "question": response['question'],
                    "response": response['response'],
                    "score": score,
                    "strengths": response_analysis.get('strengths', []),
                    "improvements": response_analysis.get('areas_for_improvement', [])
                })
            
            # Calculate overall score
            overall_score = (total_score / len(responses) * 10) if responses else 0
            
            # Generate comprehensive assessment using AI
            assessment_prompt = f"""
            Generate a comprehensive final assessment for this interview:

            Interview Responses Summary:
            {json.dumps(response_summary, indent=2)}

            Overall Score: {overall_score}/100

            Provide assessment in JSON format:
            {{
                "overall_score": {overall_score},
                "performance_breakdown": {{
                    "technical_skills": "score and assessment",
                    "communication": "score and assessment",
                    "problem_solving": "score and assessment",
                    "cultural_fit": "score and assessment",
                    "experience_relevance": "score and assessment"
                }},
                "strengths": ["key strengths demonstrated"],
                "improvement_areas": ["areas for development"],
                "red_flags": ["any concerning aspects"],
                "positive_indicators": ["strong positive signals"],
                "recommendation": "hire/interview_further/reject",
                "confidence_level": "high/medium/low",
                "next_steps": ["recommended next steps"],
                "interviewer_notes": "additional notes for hiring manager"
            }}
            """
            
            assessment_result = self.openai_service.client.chat.completions.create(
                model=self.openai_service.models['analysis'],
                messages=[
                    {"role": "system", "content": "You are an expert interview assessor. Provide thorough, fair, and constructive evaluations."},
                    {"role": "user", "content": assessment_prompt}
                ],
                temperature=0.2,
                max_tokens=1500
            )
            
            final_assessment = json.loads(assessment_result.choices[0].message.content)
            final_assessment["assessment_date"] = datetime.utcnow().isoformat()
            
            return final_assessment
            
        except Exception as e:
            logger.error(f"Generating final assessment failed: {str(e)}")
            return {
                "overall_score": overall_score if 'overall_score' in locals() else 50,
                "recommendation": "review",
                "error": "Assessment generation failed",
                "assessment_date": datetime.utcnow().isoformat()
            }
    
    def _calculate_duration(self, session: Dict) -> Optional[float]:
        """
        Calculate interview duration in minutes
        """
        try:
            if session.get('started_at') and session.get('completed_at'):
                start_time = datetime.fromisoformat(session['started_at'].replace('Z', '+00:00'))
                end_time = datetime.fromisoformat(session['completed_at'].replace('Z', '+00:00'))
                return round((end_time - start_time).total_seconds() / 60, 1)
            return None
        except Exception:
            return None

# Create global instance
def get_ai_interview_agent():
    """Get AI interview agent instance"""
    return AIInterviewAgent()

