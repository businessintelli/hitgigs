"""
AI routes for HotGigs.ai
Handles AI-powered features including job matching, resume analysis, and interview agent
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
import logging

# Import AI services
from src.services.ai.openai_service import get_openai_service
from src.services.ai.job_matching_service import get_job_matching_service
from src.services.ai.interview_agent import get_ai_interview_agent

logger = logging.getLogger(__name__)

ai_bp = Blueprint('ai', __name__)

# Validation schemas
class ResumeAnalysisSchema(Schema):
    resume_text = fields.Str(required=True)
    job_description = fields.Str(allow_none=True)

class JobMatchingSchema(Schema):
    candidate_id = fields.Str(allow_none=True)
    job_id = fields.Str(allow_none=True)
    limit = fields.Int(allow_none=True)

class InterviewSessionSchema(Schema):
    application_id = fields.Str(required=True)
    interview_type = fields.Str(allow_none=True)

class InterviewResponseSchema(Schema):
    session_id = fields.Str(required=True)
    response_text = fields.Str(required=True)

class JobDescriptionGeneratorSchema(Schema):
    job_title = fields.Str(required=True)
    company_info = fields.Str(required=True)
    requirements = fields.List(fields.Str(), allow_none=True)

class CareerAdviceSchema(Schema):
    candidate_profile = fields.Dict(required=True)
    career_goals = fields.Str(required=True)

class FeedbackSchema(Schema):
    application_id = fields.Str(required=True)
    feedback_type = fields.Str(allow_none=True)
    feedback = fields.Str(required=True)
    reasons = fields.List(fields.Str(), allow_none=True)
    missing_skills = fields.List(fields.Str(), allow_none=True)
    experience_gap = fields.Str(allow_none=True)
    cultural_fit_issues = fields.List(fields.Str(), allow_none=True)
    interviewer_notes = fields.Str(allow_none=True)

# Initialize services lazily
def get_services():
    """Get AI services instances"""
    return {
        'openai': get_openai_service(),
        'job_matching': get_job_matching_service(),
        'interview_agent': get_ai_interview_agent()
    }

@ai_bp.route('/analyze-resume', methods=['POST'])
@jwt_required()
def analyze_resume():
    """
    Analyze resume and extract key information including skills, experience, and domain expertise
    """
    try:
        schema = ResumeAnalysisSchema()
        data = schema.load(request.json)
        
        services = get_services()
        result = services['openai'].analyze_resume(
            data['resume_text'],
            data.get('job_description')
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "details": e.messages}), 400
    except Exception as e:
        logger.error(f"Resume analysis error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/job-matching/candidates', methods=['POST'])
@jwt_required()
def find_matching_jobs():
    """
    Find jobs that match a candidate's profile using AI analysis
    """
    try:
        schema = JobMatchingSchema()
        data = schema.load(request.json)
        
        candidate_id = data.get('candidate_id') or get_jwt_identity()
        
        services = get_services()
        result = services['job_matching'].find_matching_jobs(
            candidate_id,
            data.get('limit', 20)
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "details": e.messages}), 400
    except Exception as e:
        logger.error(f"Job matching error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/job-matching/jobs', methods=['POST'])
@jwt_required()
def find_matching_candidates():
    """
    Find candidates that match a job posting using AI analysis
    """
    try:
        schema = JobMatchingSchema()
        data = schema.load(request.json)
        
        if not data.get('job_id'):
            return jsonify({"success": False, "error": "job_id is required"}), 400
        
        services = get_services()
        result = services['job_matching'].find_matching_candidates(
            data['job_id'],
            data.get('limit', 20)
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "details": e.messages}), 400
    except Exception as e:
        logger.error(f"Candidate matching error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/resume-improvement', methods=['POST'])
@jwt_required()
def get_resume_improvement_suggestions():
    """
    Provide AI-powered resume improvement suggestions based on job requirements and historical feedback
    """
    try:
        data = request.json
        candidate_id = data.get('candidate_id') or get_jwt_identity()
        job_id = data.get('job_id')
        
        if not job_id:
            return jsonify({"success": False, "error": "job_id is required"}), 400
        
        result = job_matching_service.get_resume_improvement_suggestions(
            candidate_id,
            job_id
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except Exception as e:
        logger.error(f"Resume improvement suggestions error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/interview/create', methods=['POST'])
@jwt_required()
def create_interview_session():
    """
    Create a new AI interview session for a candidate
    """
    try:
        schema = InterviewSessionSchema()
        data = schema.load(request.json)
        
        result = interview_agent.create_interview_session(
            data['application_id'],
            data.get('interview_type', 'comprehensive')
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "details": e.messages}), 400
    except Exception as e:
        logger.error(f"Interview creation error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/interview/<session_id>/start', methods=['POST'])
@jwt_required()
def start_interview(session_id):
    """
    Start an AI interview session
    """
    try:
        result = interview_agent.start_interview(session_id)
        return jsonify(result), 200 if result['success'] else 400
        
    except Exception as e:
        logger.error(f"Interview start error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/interview/respond', methods=['POST'])
@jwt_required()
def submit_interview_response():
    """
    Submit candidate response and get next question or feedback
    """
    try:
        schema = InterviewResponseSchema()
        data = schema.load(request.json)
        
        result = interview_agent.submit_response(
            data['session_id'],
            data['response_text']
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "details": e.messages}), 400
    except Exception as e:
        logger.error(f"Interview response error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/interview/<session_id>/status', methods=['GET'])
@jwt_required()
def get_interview_status(session_id):
    """
    Get current status of an interview session
    """
    try:
        result = interview_agent.get_interview_status(session_id)
        return jsonify(result), 200 if result['success'] else 400
        
    except Exception as e:
        logger.error(f"Interview status error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/interview/<session_id>/report', methods=['GET'])
@jwt_required()
def get_interview_report(session_id):
    """
    Generate comprehensive interview report
    """
    try:
        result = interview_agent.get_interview_report(session_id)
        return jsonify(result), 200 if result['success'] else 400
        
    except Exception as e:
        logger.error(f"Interview report error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/generate-job-description', methods=['POST'])
@jwt_required()
def generate_job_description():
    """
    Generate comprehensive job description using AI
    """
    try:
        schema = JobDescriptionGeneratorSchema()
        data = schema.load(request.json)
        
        result = openai_service.generate_job_description(
            data['job_title'],
            data['company_info'],
            data.get('requirements', [])
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "details": e.messages}), 400
    except Exception as e:
        logger.error(f"Job description generation error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/career-advice', methods=['POST'])
@jwt_required()
def provide_career_advice():
    """
    Provide AI-powered career advice and path recommendations
    """
    try:
        schema = CareerAdviceSchema()
        data = schema.load(request.json)
        
        result = openai_service.provide_career_advice(
            data['candidate_profile'],
            data['career_goals']
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "details": e.messages}), 400
    except Exception as e:
        logger.error(f"Career advice error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/feedback/store', methods=['POST'])
@jwt_required()
def store_application_feedback():
    """
    Store feedback from rejected applications for future matching improvements
    """
    try:
        schema = FeedbackSchema()
        data = schema.load(request.json)
        
        # Add current user as feedback creator
        data['created_by'] = get_jwt_identity()
        
        result = job_matching_service.store_application_feedback(
            data['application_id'],
            data
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except ValidationError as e:
        return jsonify({"success": False, "error": "Validation error", "details": e.messages}), 400
    except Exception as e:
        logger.error(f"Feedback storage error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/match-score', methods=['POST'])
@jwt_required()
def calculate_match_score():
    """
    Calculate compatibility score between candidate and job
    """
    try:
        data = request.json
        candidate_profile = data.get('candidate_profile')
        job_description = data.get('job_description')
        
        if not candidate_profile or not job_description:
            return jsonify({"success": False, "error": "candidate_profile and job_description are required"}), 400
        
        result = openai_service.calculate_job_match_score(
            candidate_profile,
            job_description
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except Exception as e:
        logger.error(f"Match score calculation error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/generate-questions', methods=['POST'])
@jwt_required()
def generate_interview_questions():
    """
    Generate personalized interview questions based on job and candidate
    """
    try:
        data = request.json
        job_description = data.get('job_description')
        candidate_resume = data.get('candidate_resume')
        question_count = data.get('question_count', 10)
        
        if not job_description or not candidate_resume:
            return jsonify({"success": False, "error": "job_description and candidate_resume are required"}), 400
        
        result = openai_service.generate_interview_questions(
            job_description,
            candidate_resume,
            question_count
        )
        
        return jsonify(result), 200 if result['success'] else 400
        
    except Exception as e:
        logger.error(f"Question generation error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@ai_bp.route('/health', methods=['GET'])
def ai_health_check():
    """
    Health check for AI services
    """
    try:
        # Test OpenAI connection
        services = get_services()
        test_result = services['openai'].client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=5
        )
        
        return jsonify({
            "success": True,
            "status": "healthy",
            "services": {
                "openai": "connected",
                "job_matching": "available",
                "interview_agent": "available"
            },
            "timestamp": "2024-01-01T00:00:00Z"
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "status": "unhealthy",
            "error": str(e),
            "timestamp": "2024-01-01T00:00:00Z"
        }), 500

# Error handlers
@ai_bp.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404

@ai_bp.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"success": False, "error": "Method not allowed"}), 405

@ai_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "error": "Internal server error"}), 500

