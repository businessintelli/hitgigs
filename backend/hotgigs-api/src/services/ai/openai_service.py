"""
OpenAI Service for HotGigs.ai
Handles all AI-powered features including job matching, resume analysis, and interview agent
"""

import os
import json
import openai
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self):
        """Initialize OpenAI service with API key"""
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        
        openai.api_key = self.api_key
        self.client = openai.OpenAI(api_key=self.api_key)
        
        # Model configurations
        self.models = {
            'chat': 'gpt-4o-mini',
            'analysis': 'gpt-4o-mini',
            'matching': 'gpt-4o-mini'
        }
    
    def analyze_resume(self, resume_text: str, job_description: str = None) -> Dict[str, Any]:
        """
        Analyze resume and extract key information including skills, experience, and domain expertise
        """
        try:
            prompt = f"""
            Analyze the following resume and provide a comprehensive analysis in JSON format:

            Resume Text:
            {resume_text}

            Please provide analysis in the following JSON structure:
            {{
                "skills": {{
                    "technical": ["list of technical skills"],
                    "soft": ["list of soft skills"],
                    "languages": ["programming languages"],
                    "tools": ["tools and technologies"]
                }},
                "experience": {{
                    "total_years": "estimated total years of experience",
                    "positions": [
                        {{
                            "title": "job title",
                            "company": "company name",
                            "duration": "duration",
                            "domain": "identified industry domain (e.g., healthcare, finance, e-commerce, automotive, government, defense, banking)",
                            "key_achievements": ["list of achievements"]
                        }}
                    ]
                }},
                "education": [
                    {{
                        "degree": "degree name",
                        "institution": "institution name",
                        "year": "graduation year"
                    }}
                ],
                "domain_expertise": {{
                    "primary_domains": ["main industry domains based on work experience"],
                    "secondary_domains": ["additional domains"],
                    "domain_years": {{
                        "domain_name": "years of experience in this domain"
                    }}
                }},
                "strengths": ["key strengths and unique selling points"],
                "improvement_areas": ["areas for potential improvement"],
                "overall_score": "score out of 100",
                "summary": "brief professional summary"
            }}

            Focus on identifying domain expertise by analyzing the companies worked for, even if not explicitly mentioned.
            """

            if job_description:
                prompt += f"""
                
                Job Description for Comparison:
                {job_description}
                
                Also provide:
                {{
                    "job_match": {{
                        "compatibility_score": "score out of 100",
                        "matching_skills": ["skills that match the job"],
                        "missing_skills": ["skills required but not found"],
                        "recommendations": ["specific recommendations to improve match"]
                    }}
                }}
                """

            response = self.client.chat.completions.create(
                model=self.models['analysis'],
                messages=[
                    {"role": "system", "content": "You are an expert HR analyst and resume reviewer. Provide detailed, accurate analysis in valid JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )

            analysis_text = response.choices[0].message.content
            
            # Parse JSON response
            try:
                analysis = json.loads(analysis_text)
            except json.JSONDecodeError:
                # If JSON parsing fails, create a basic structure
                analysis = {
                    "error": "Failed to parse AI response",
                    "raw_response": analysis_text,
                    "overall_score": "75",
                    "summary": "Resume analysis completed with parsing issues"
                }

            return {
                "success": True,
                "analysis": analysis,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Resume analysis failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    def calculate_job_match_score(self, candidate_profile: Dict, job_description: str) -> Dict[str, Any]:
        """
        Calculate compatibility score between candidate and job
        """
        try:
            prompt = f"""
            Calculate the job match score between the candidate and job description.

            Candidate Profile:
            {json.dumps(candidate_profile, indent=2)}

            Job Description:
            {job_description}

            Provide analysis in JSON format:
            {{
                "match_score": "overall compatibility score (0-100)",
                "skill_match": {{
                    "score": "skill compatibility score (0-100)",
                    "matching_skills": ["skills that match"],
                    "missing_critical_skills": ["critical skills missing"],
                    "transferable_skills": ["skills that could transfer"]
                }},
                "experience_match": {{
                    "score": "experience compatibility score (0-100)",
                    "relevant_experience": "years of relevant experience",
                    "domain_match": "how well candidate's domain expertise matches"
                }},
                "cultural_fit": {{
                    "score": "estimated cultural fit score (0-100)",
                    "reasoning": "explanation of cultural fit assessment"
                }},
                "recommendations": {{
                    "for_candidate": ["recommendations for the candidate"],
                    "for_recruiter": ["recommendations for the recruiter"],
                    "interview_focus": ["areas to focus on during interview"]
                }},
                "decision_recommendation": "hire/interview/reject with reasoning"
            }}
            """

            response = self.client.chat.completions.create(
                model=self.models['matching'],
                messages=[
                    {"role": "system", "content": "You are an expert talent acquisition specialist. Provide accurate job matching analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=1500
            )

            match_analysis = json.loads(response.choices[0].message.content)
            
            return {
                "success": True,
                "match_analysis": match_analysis,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Job match calculation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    def generate_interview_questions(self, job_description: str, candidate_resume: str, question_count: int = 10) -> Dict[str, Any]:
        """
        Generate personalized interview questions based on job and candidate
        """
        try:
            prompt = f"""
            Generate {question_count} personalized interview questions for this candidate and job.

            Job Description:
            {job_description}

            Candidate Resume:
            {candidate_resume}

            Provide questions in JSON format:
            {{
                "questions": [
                    {{
                        "id": 1,
                        "category": "technical/behavioral/situational/experience",
                        "question": "the interview question",
                        "purpose": "what this question aims to assess",
                        "expected_answer_points": ["key points to look for in answer"],
                        "follow_up_questions": ["potential follow-up questions"]
                    }}
                ],
                "interview_focus_areas": ["main areas to focus on"],
                "assessment_criteria": ["criteria for evaluating responses"],
                "estimated_duration": "estimated interview duration in minutes"
            }}

            Mix different question types: technical skills, behavioral, situational, and experience-based.
            """

            response = self.client.chat.completions.create(
                model=self.models['chat'],
                messages=[
                    {"role": "system", "content": "You are an expert interviewer and talent assessor. Generate thoughtful, relevant interview questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=2000
            )

            questions_data = json.loads(response.choices[0].message.content)
            
            return {
                "success": True,
                "questions_data": questions_data,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Interview question generation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    def conduct_ai_interview(self, question: str, candidate_response: str, context: Dict = None) -> Dict[str, Any]:
        """
        AI Interview Agent - Analyze candidate response and provide next question or feedback
        """
        try:
            context_str = json.dumps(context, indent=2) if context else "No previous context"
            
            prompt = f"""
            You are an AI interview agent conducting a professional interview.

            Current Question: {question}
            Candidate Response: {candidate_response}
            Interview Context: {context_str}

            Analyze the response and provide feedback in JSON format:
            {{
                "response_analysis": {{
                    "quality_score": "score out of 10",
                    "strengths": ["positive aspects of the response"],
                    "areas_for_improvement": ["areas that could be better"],
                    "completeness": "how complete the answer was",
                    "relevance": "how relevant the answer was to the question"
                }},
                "follow_up": {{
                    "type": "clarification/deep_dive/next_question/wrap_up",
                    "question": "follow-up question or next question",
                    "reasoning": "why this follow-up is appropriate"
                }},
                "assessment_notes": "notes for the interviewer",
                "red_flags": ["any concerning aspects"],
                "positive_indicators": ["strong positive signals"]
            }}

            Be professional, encouraging, and constructive in your analysis.
            """

            response = self.client.chat.completions.create(
                model=self.models['chat'],
                messages=[
                    {"role": "system", "content": "You are a professional AI interview agent. Be thorough but encouraging in your analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )

            interview_analysis = json.loads(response.choices[0].message.content)
            
            return {
                "success": True,
                "analysis": interview_analysis,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"AI interview analysis failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    def generate_job_description(self, job_title: str, company_info: str, requirements: List[str] = None) -> Dict[str, Any]:
        """
        Generate comprehensive job description using AI
        """
        try:
            requirements_str = "\n".join(requirements) if requirements else "Standard requirements for the role"
            
            prompt = f"""
            Generate a comprehensive job description for the following position:

            Job Title: {job_title}
            Company Information: {company_info}
            Specific Requirements: {requirements_str}

            Provide the job description in JSON format:
            {{
                "job_title": "formatted job title",
                "company_overview": "brief company description",
                "role_summary": "2-3 sentence role summary",
                "key_responsibilities": ["list of main responsibilities"],
                "required_qualifications": {{
                    "education": ["education requirements"],
                    "experience": ["experience requirements"],
                    "technical_skills": ["technical skills needed"],
                    "soft_skills": ["soft skills needed"]
                }},
                "preferred_qualifications": ["nice-to-have qualifications"],
                "benefits": ["company benefits and perks"],
                "growth_opportunities": ["career growth opportunities"],
                "work_environment": "description of work environment",
                "salary_range": "estimated salary range",
                "location_details": "location and remote work options"
            }}

            Make it engaging and comprehensive while being realistic about requirements.
            """

            response = self.client.chat.completions.create(
                model=self.models['chat'],
                messages=[
                    {"role": "system", "content": "You are an expert HR professional and job description writer. Create compelling, accurate job descriptions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=1500
            )

            job_description = json.loads(response.choices[0].message.content)
            
            return {
                "success": True,
                "job_description": job_description,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Job description generation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    def provide_career_advice(self, candidate_profile: Dict, career_goals: str) -> Dict[str, Any]:
        """
        Provide AI-powered career advice and path recommendations
        """
        try:
            prompt = f"""
            Provide comprehensive career advice for this candidate:

            Candidate Profile:
            {json.dumps(candidate_profile, indent=2)}

            Career Goals:
            {career_goals}

            Provide advice in JSON format:
            {{
                "career_assessment": {{
                    "current_level": "junior/mid/senior/executive",
                    "strengths": ["key professional strengths"],
                    "growth_areas": ["areas for development"],
                    "market_position": "how competitive they are in the market"
                }},
                "recommended_paths": [
                    {{
                        "path_name": "career path name",
                        "description": "path description",
                        "timeline": "estimated timeline",
                        "required_skills": ["skills to develop"],
                        "next_steps": ["immediate action items"]
                    }}
                ],
                "skill_development": {{
                    "priority_skills": ["most important skills to develop"],
                    "learning_resources": ["recommended learning resources"],
                    "certifications": ["valuable certifications to pursue"]
                }},
                "job_search_strategy": {{
                    "target_companies": ["types of companies to target"],
                    "networking_advice": ["networking recommendations"],
                    "application_tips": ["job application tips"]
                }},
                "salary_insights": {{
                    "current_market_value": "estimated current market value",
                    "growth_potential": "salary growth potential",
                    "negotiation_tips": ["salary negotiation tips"]
                }}
            }}
            """

            response = self.client.chat.completions.create(
                model=self.models['chat'],
                messages=[
                    {"role": "system", "content": "You are an expert career counselor and industry advisor. Provide practical, actionable career advice."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )

            career_advice = json.loads(response.choices[0].message.content)
            
            return {
                "success": True,
                "advice": career_advice,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Career advice generation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

# Create global instance
def get_openai_service():
    """Get OpenAI service instance"""
    return OpenAIService()

