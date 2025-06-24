"""
AI services routes for HotGigs.ai
Handles AI-powered job matching, resume analysis, and other AI features
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
import os
from datetime import datetime, timezone
from src.models.optimized_database import OptimizedSupabaseService
from src.services.advanced_ai import (
    vector_service, 
    interview_agent, 
    feedback_loop, 
    predictive_analytics
)

ai_bp = Blueprint('ai', __name__)
db_service = OptimizedSupabaseService()

# AI service validation schemas
class JobMatchSchema(Schema):
    skills = fields.List(fields.Str(), required=True, validate=lambda x: len(x) > 0)
    experience_level = fields.Str(required=True, validate=lambda x: x in ['entry', 'mid', 'senior', 'executive'])
    location_preference = fields.Str(allow_none=True)
    salary_min = fields.Int(allow_none=True)
    salary_max = fields.Int(allow_none=True)
    remote_preference = fields.Bool(load_default=False)

class ResumeAnalysisSchema(Schema):
    resume_text = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 100)
    target_job_id = fields.UUID(allow_none=True)

@ai_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for AI services"""
    try:
        # Check if OpenAI API key is configured
        openai_configured = bool(os.getenv('OPENAI_API_KEY'))
        
        return jsonify({
            'status': 'healthy',
            'service': 'ai',
            'openai_configured': openai_configured,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'ai',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@ai_bp.route('/match-jobs', methods=['POST'])
@jwt_required()
def match_jobs():
    """AI-powered job matching based on candidate preferences and skills"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = JobMatchSchema()
        try:
            match_data = schema.load(request.json)
        except ValidationError as e:
            return jsonify({
                'error': 'Validation failed',
                'details': e.messages,
                'status': 'error'
            }), 400
        
        # Get active jobs for matching
        jobs = db_service.search_jobs_optimized(
            location=match_data.get('location_preference'),
            experience_level=match_data.get('experience_level'),
            salary_min=match_data.get('salary_min'),
            salary_max=match_data.get('salary_max'),
            limit=50
        )
        
        # Simple skill-based matching algorithm
        matched_jobs = []
        user_skills = [skill.lower() for skill in match_data['skills']]
        
        for job in jobs:
            match_score = calculate_job_match_score(job, user_skills, match_data)
            
            if match_score > 0.3:  # Minimum match threshold
                job['match_score'] = round(match_score * 100, 1)
                job['match_reasons'] = get_match_reasons(job, user_skills, match_data)
                matched_jobs.append(job)
        
        # Sort by match score
        matched_jobs.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Limit to top 20 matches
        matched_jobs = matched_jobs[:20]
        
        # Store AI analysis for future reference
        analysis_data = {
            'user_id': current_user_id,
            'analysis_type': 'job_matching',
            'input_data': match_data,
            'results': {
                'total_jobs_analyzed': len(jobs),
                'matched_jobs_count': len(matched_jobs),
                'top_match_score': matched_jobs[0]['match_score'] if matched_jobs else 0
            },
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        # Store in AI feedback table if it exists
        try:
            db_service.create_record('ai_feedback', analysis_data)
        except:
            pass  # Table might not exist yet
        
        return jsonify({
            'matched_jobs': matched_jobs,
            'total_matches': len(matched_jobs),
            'analysis_summary': {
                'skills_analyzed': match_data['skills'],
                'experience_level': match_data['experience_level'],
                'jobs_analyzed': len(jobs)
            },
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in AI job matching: {str(e)}")
        return jsonify({
            'error': 'AI job matching failed',
            'message': 'An error occurred while matching jobs',
            'status': 'error'
        }), 500

def calculate_job_match_score(job: dict, user_skills: list, match_data: dict) -> float:
    """Calculate match score between job and candidate"""
    score = 0.0
    
    # Skill matching (40% weight)
    job_title = job.get('title', '').lower()
    job_description = job.get('description', '').lower()
    job_requirements = job.get('requirements', '').lower()
    
    skill_matches = 0
    for skill in user_skills:
        if (skill in job_title or 
            skill in job_description or 
            skill in job_requirements):
            skill_matches += 1
    
    if user_skills:
        skill_score = skill_matches / len(user_skills)
        score += skill_score * 0.4
    
    # Experience level matching (20% weight)
    job_experience = job.get('experience_level', '').lower()
    user_experience = match_data.get('experience_level', '').lower()
    
    if job_experience == user_experience:
        score += 0.2
    elif (job_experience == 'entry' and user_experience in ['mid', 'senior']) or \
         (job_experience == 'mid' and user_experience == 'senior'):
        score += 0.1
    
    # Location matching (15% weight)
    if match_data.get('location_preference'):
        job_location = job.get('location', '').lower()
        user_location = match_data['location_preference'].lower()
        
        if user_location in job_location or job_location in user_location:
            score += 0.15
        elif 'remote' in job_location and match_data.get('remote_preference'):
            score += 0.15
    
    # Salary matching (15% weight)
    if match_data.get('salary_min') and job.get('salary_max'):
        if job['salary_max'] >= match_data['salary_min']:
            score += 0.15
    
    # Remote work preference (10% weight)
    if match_data.get('remote_preference') and job.get('remote_work_allowed'):
        score += 0.1
    
    return min(score, 1.0)  # Cap at 1.0

def get_match_reasons(job: dict, user_skills: list, match_data: dict) -> list:
    """Get reasons why this job matches the candidate"""
    reasons = []
    
    # Check skill matches
    job_text = f"{job.get('title', '')} {job.get('description', '')} {job.get('requirements', '')}".lower()
    matched_skills = [skill for skill in user_skills if skill in job_text]
    
    if matched_skills:
        reasons.append(f"Skills match: {', '.join(matched_skills[:3])}")
    
    # Check experience level
    if job.get('experience_level') == match_data.get('experience_level'):
        reasons.append(f"Experience level: {job.get('experience_level')}")
    
    # Check location
    if match_data.get('location_preference'):
        job_location = job.get('location', '').lower()
        user_location = match_data['location_preference'].lower()
        
        if user_location in job_location or job_location in user_location:
            reasons.append(f"Location match: {job.get('location')}")
    
    # Check remote work
    if match_data.get('remote_preference') and job.get('remote_work_allowed'):
        reasons.append("Remote work available")
    
    # Check salary
    if match_data.get('salary_min') and job.get('salary_max'):
        if job['salary_max'] >= match_data['salary_min']:
            reasons.append(f"Salary range: ${job.get('salary_min', 0):,} - ${job.get('salary_max', 0):,}")
    
    return reasons

@ai_bp.route('/analyze-resume', methods=['POST'])
@jwt_required()
def analyze_resume():
    """AI-powered resume analysis and improvement suggestions"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = ResumeAnalysisSchema()
        try:
            analysis_data = schema.load(request.json)
        except ValidationError as e:
            return jsonify({
                'error': 'Validation failed',
                'details': e.messages,
                'status': 'error'
            }), 400
        
        resume_text = analysis_data['resume_text']
        
        # Simple resume analysis (placeholder for actual AI analysis)
        analysis_results = perform_resume_analysis(resume_text)
        
        # If target job is specified, provide job-specific recommendations
        if analysis_data.get('target_job_id'):
            job = db_service.get_record_by_id('jobs', analysis_data['target_job_id'])
            if job:
                job_specific_analysis = analyze_resume_for_job(resume_text, job)
                analysis_results['job_specific'] = job_specific_analysis
        
        # Store analysis results
        analysis_record = {
            'user_id': current_user_id,
            'analysis_type': 'resume_analysis',
            'input_data': {'resume_length': len(resume_text)},
            'results': analysis_results,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        try:
            db_service.create_record('ai_feedback', analysis_record)
        except:
            pass  # Table might not exist yet
        
        return jsonify({
            'analysis': analysis_results,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in resume analysis: {str(e)}")
        return jsonify({
            'error': 'Resume analysis failed',
            'message': 'An error occurred while analyzing the resume',
            'status': 'error'
        }), 500

def perform_resume_analysis(resume_text: str) -> dict:
    """Perform basic resume analysis"""
    # Simple analysis without external AI API
    word_count = len(resume_text.split())
    
    # Check for common sections
    sections = {
        'contact_info': any(keyword in resume_text.lower() for keyword in ['email', 'phone', '@']),
        'experience': any(keyword in resume_text.lower() for keyword in ['experience', 'work', 'employment']),
        'education': any(keyword in resume_text.lower() for keyword in ['education', 'degree', 'university', 'college']),
        'skills': any(keyword in resume_text.lower() for keyword in ['skills', 'technologies', 'programming'])
    }
    
    # Calculate completeness score
    completeness_score = sum(sections.values()) / len(sections) * 100
    
    # Generate suggestions
    suggestions = []
    if word_count < 200:
        suggestions.append("Consider adding more detail to your experience and achievements")
    if word_count > 800:
        suggestions.append("Consider condensing your resume to focus on the most relevant information")
    if not sections['contact_info']:
        suggestions.append("Make sure to include your contact information")
    if not sections['skills']:
        suggestions.append("Add a skills section to highlight your technical abilities")
    
    return {
        'completeness_score': round(completeness_score, 1),
        'word_count': word_count,
        'sections_present': sections,
        'suggestions': suggestions,
        'strengths': [
            "Resume contains relevant keywords",
            "Good structure and organization"
        ] if completeness_score > 75 else ["Resume has basic information"],
        'overall_rating': 'Excellent' if completeness_score > 90 else 
                         'Good' if completeness_score > 75 else 
                         'Needs Improvement'
    }

def analyze_resume_for_job(resume_text: str, job: dict) -> dict:
    """Analyze resume against specific job requirements"""
    job_requirements = job.get('requirements', '').lower()
    job_title = job.get('title', '').lower()
    resume_lower = resume_text.lower()
    
    # Check for keyword matches
    job_keywords = extract_keywords(f"{job_title} {job_requirements}")
    resume_keywords = extract_keywords(resume_lower)
    
    matching_keywords = set(job_keywords) & set(resume_keywords)
    missing_keywords = set(job_keywords) - set(resume_keywords)
    
    match_percentage = len(matching_keywords) / len(job_keywords) * 100 if job_keywords else 0
    
    return {
        'match_percentage': round(match_percentage, 1),
        'matching_keywords': list(matching_keywords)[:10],
        'missing_keywords': list(missing_keywords)[:10],
        'recommendations': [
            f"Consider adding experience with {', '.join(list(missing_keywords)[:3])}" if missing_keywords else "Great keyword match!",
            f"Highlight your experience with {', '.join(list(matching_keywords)[:3])}" if matching_keywords else "Focus on relevant skills"
        ]
    }

def extract_keywords(text: str) -> list:
    """Extract relevant keywords from text"""
    # Simple keyword extraction
    common_tech_keywords = [
        'python', 'javascript', 'java', 'react', 'node', 'sql', 'aws', 'docker',
        'kubernetes', 'git', 'agile', 'scrum', 'api', 'database', 'frontend',
        'backend', 'fullstack', 'devops', 'machine learning', 'ai', 'data'
    ]
    
    found_keywords = []
    for keyword in common_tech_keywords:
        if keyword in text:
            found_keywords.append(keyword)
    
    return found_keywords

@ai_bp.route('/job-recommendations', methods=['GET'])
@jwt_required()
def get_job_recommendations():
    """Get AI-powered job recommendations for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user's candidate profile
        candidate_profiles = db_service.get_records_optimized(
            'candidate_profiles',
            {'user_id': current_user_id},
            limit=1
        )
        
        if not candidate_profiles:
            return jsonify({
                'error': 'Candidate profile not found',
                'message': 'Please complete your profile to get job recommendations',
                'status': 'error'
            }), 404
        
        profile = candidate_profiles[0]
        
        # Get user's skills
        candidate_skills = db_service.get_records_optimized(
            'candidate_skills',
            {'candidate_id': profile['id']}
        )
        
        skills = [skill['skill_name'] for skill in candidate_skills]
        
        # Create match criteria from profile
        match_criteria = {
            'skills': skills or ['general'],
            'experience_level': profile.get('experience_level', 'entry'),
            'location_preference': profile.get('location'),
            'salary_min': profile.get('desired_salary_min'),
            'remote_preference': True  # Default to allowing remote
        }
        
        # Get job matches
        jobs = db_service.search_jobs_optimized(
            location=match_criteria.get('location_preference'),
            experience_level=match_criteria.get('experience_level'),
            salary_min=match_criteria.get('salary_min'),
            limit=20
        )
        
        # Calculate match scores
        recommended_jobs = []
        user_skills_lower = [skill.lower() for skill in skills]
        
        for job in jobs:
            match_score = calculate_job_match_score(job, user_skills_lower, match_criteria)
            
            if match_score > 0.2:  # Lower threshold for recommendations
                job['match_score'] = round(match_score * 100, 1)
                job['match_reasons'] = get_match_reasons(job, user_skills_lower, match_criteria)
                recommended_jobs.append(job)
        
        # Sort by match score
        recommended_jobs.sort(key=lambda x: x['match_score'], reverse=True)
        
        return jsonify({
            'recommended_jobs': recommended_jobs[:10],  # Top 10 recommendations
            'total_recommendations': len(recommended_jobs),
            'profile_data': {
                'skills': skills,
                'experience_level': profile.get('experience_level'),
                'location': profile.get('location')
            },
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting job recommendations: {str(e)}")
        return jsonify({
            'error': 'Failed to get job recommendations',
            'message': 'An error occurred while generating recommendations',
            'status': 'error'
        }), 500

@ai_bp.route('/feedback', methods=['GET'])
@jwt_required()
def get_ai_feedback():
    """Get AI feedback history for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get AI feedback records
        feedback_records = db_service.get_records_optimized(
            'ai_feedback',
            {'user_id': current_user_id},
            order_by='created_at',
            ascending=False,
            limit=20
        )
        
        return jsonify({
            'feedback_history': feedback_records,
            'total_records': len(feedback_records),
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting AI feedback: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve AI feedback',
            'status': 'error'
        }), 500

# Error handlers
@ai_bp.errorhandler(ValidationError)
def handle_validation_error(e):
    return jsonify({
        'error': 'Validation failed',
        'details': e.messages,
        'status': 'error'
    }), 400

@ai_bp.errorhandler(Exception)
def handle_general_error(e):
    current_app.logger.error(f"Unhandled error in AI route: {str(e)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred',
        'status': 'error'
    }), 500



# Advanced AI validation schemas
class SemanticSearchSchema(Schema):
    query = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 3)
    top_k = fields.Int(load_default=10, validate=lambda x: 1 <= x <= 50)

class InterviewStartSchema(Schema):
    candidate_id = fields.UUID(required=True)
    job_id = fields.UUID(required=True)
    job_description = fields.Str(required=True)

class InterviewResponseSchema(Schema):
    session_id = fields.Str(required=True)
    response = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 10)

class FeedbackSchema(Schema):
    job_id = fields.UUID(required=True)
    candidate_id = fields.UUID(required=True)
    feedback = fields.Str(required=True)
    reason = fields.Str(required=True)

class CandidateAnalysisSchema(Schema):
    job_id = fields.UUID(required=True)
    job_description = fields.Str(required=True)
    resume_text = fields.Str(required=True)

@ai_bp.route('/semantic-search', methods=['POST'])
@jwt_required()
def semantic_job_search():
    """Perform semantic search for jobs using vector embeddings"""
    try:
        schema = SemanticSearchSchema()
        data = schema.load(request.get_json())
        
        # Get all jobs for embedding if not already done
        jobs_response = db_service.get_jobs()
        if jobs_response.get('success'):
            jobs = jobs_response.get('data', [])
            
            # Create embeddings if needed
            if vector_service.job_vectors is None:
                vector_service.create_job_embeddings(jobs)
            
            # Perform semantic search
            results = vector_service.semantic_job_search(
                data['query'], 
                data['top_k']
            )
            
            return jsonify({
                'success': True,
                'data': results,
                'total_results': len(results),
                'query': data['query']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to retrieve jobs for search'
            }), 500
            
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Semantic search error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@ai_bp.route('/find-candidates', methods=['POST'])
@jwt_required()
def find_similar_candidates():
    """Find candidates similar to job requirements using vector embeddings"""
    try:
        data = request.get_json()
        job_description = data.get('job_description', '')
        top_k = data.get('top_k', 10)
        
        if not job_description:
            return jsonify({
                'success': False,
                'error': 'Job description is required'
            }), 400
        
        # Get candidate resumes for embedding if not already done
        # This would typically come from a candidates/resumes table
        # For now, we'll use a placeholder
        candidates = []  # Would fetch from database
        
        if vector_service.resume_vectors is None and candidates:
            vector_service.create_resume_embeddings(candidates)
        
        # Find similar candidates
        results = vector_service.find_similar_candidates(job_description, top_k)
        
        return jsonify({
            'success': True,
            'data': results,
            'total_results': len(results),
            'job_description_length': len(job_description)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Find candidates error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@ai_bp.route('/interview/start', methods=['POST'])
@jwt_required()
def start_ai_interview():
    """Start an AI-powered interview session"""
    try:
        schema = InterviewStartSchema()
        data = schema.load(request.get_json())
        
        # Start interview session
        result = interview_agent.start_interview(
            str(data['candidate_id']),
            str(data['job_id']),
            data['job_description']
        )
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Start interview error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@ai_bp.route('/interview/respond', methods=['POST'])
@jwt_required()
def submit_interview_response():
    """Submit response to AI interview question"""
    try:
        schema = InterviewResponseSchema()
        data = schema.load(request.get_json())
        
        # Submit response and get next question or assessment
        result = interview_agent.submit_response(
            data['session_id'],
            data['response']
        )
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Submit response error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@ai_bp.route('/interview/<session_id>', methods=['GET'])
@jwt_required()
def get_interview_session(session_id):
    """Get interview session details"""
    try:
        session = interview_agent.get_interview_session(session_id)
        
        if not session:
            return jsonify({
                'success': False,
                'error': 'Interview session not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': session
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get interview session error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@ai_bp.route('/feedback/store', methods=['POST'])
@jwt_required()
def store_rejection_feedback():
    """Store rejection feedback for learning"""
    try:
        schema = FeedbackSchema()
        data = schema.load(request.get_json())
        
        # Store feedback for future learning
        feedback_loop.store_rejection_feedback(
            str(data['job_id']),
            str(data['candidate_id']),
            data['feedback'],
            data['reason']
        )
        
        return jsonify({
            'success': True,
            'message': 'Feedback stored successfully'
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Store feedback error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@ai_bp.route('/analyze-fit', methods=['POST'])
@jwt_required()
def analyze_candidate_fit():
    """Analyze candidate fit using historical feedback"""
    try:
        schema = CandidateAnalysisSchema()
        data = schema.load(request.get_json())
        
        # Analyze candidate fit with historical feedback
        analysis = feedback_loop.analyze_candidate_fit(
            str(data['job_id']),
            data['job_description'],
            data['resume_text']
        )
        
        return jsonify({
            'success': True,
            'data': analysis
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Analyze fit error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@ai_bp.route('/predict-success', methods=['POST'])
@jwt_required()
def predict_hiring_success():
    """Predict hiring success using predictive analytics"""
    try:
        data = request.get_json()
        candidate_data = data.get('candidate_data', {})
        job_data = data.get('job_data', {})
        
        if not candidate_data or not job_data:
            return jsonify({
                'success': False,
                'error': 'Both candidate_data and job_data are required'
            }), 400
        
        # Get historical data (would come from database)
        historical_data = []  # Placeholder for historical hiring data
        
        # Generate prediction
        prediction = predictive_analytics.predict_hiring_success(
            candidate_data,
            job_data,
            historical_data
        )
        
        return jsonify({
            'success': True,
            'data': prediction
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Predict success error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@ai_bp.route('/embeddings/refresh', methods=['POST'])
@jwt_required()
def refresh_embeddings():
    """Refresh vector embeddings for jobs and resumes"""
    try:
        # Get fresh data from database
        jobs_response = db_service.get_jobs()
        
        if jobs_response.get('success'):
            jobs = jobs_response.get('data', [])
            vector_service.create_job_embeddings(jobs)
            
            # Would also refresh resume embeddings if we had resume data
            
            return jsonify({
                'success': True,
                'message': f'Refreshed embeddings for {len(jobs)} jobs',
                'jobs_processed': len(jobs)
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to retrieve jobs for embedding refresh'
            }), 500
            
    except Exception as e:
        current_app.logger.error(f"Refresh embeddings error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

