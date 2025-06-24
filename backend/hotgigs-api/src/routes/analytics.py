"""
Analytics routes for HotGigs.ai
Handles advanced analytics, reporting, and AI-powered insights
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from src.models.database import DatabaseService
from src.services.ai.openai_service import OpenAIService
import json
from typing import Dict, List, Any

analytics_bp = Blueprint('analytics', __name__)
db = DatabaseService()
ai_service = OpenAIService()

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    """Get comprehensive dashboard analytics data"""
    try:
        current_user = get_jwt_identity()
        user_role = current_user.get('role', 'candidate')
        user_id = current_user.get('user_id')
        
        if user_role == 'company':
            return get_company_analytics(user_id)
        elif user_role == 'recruiter':
            return get_recruiter_analytics(user_id)
        else:
            return get_candidate_analytics(user_id)
            
    except Exception as e:
        return jsonify({'error': 'Failed to get analytics data', 'details': str(e)}), 500

def get_company_analytics(company_id: str) -> Dict[str, Any]:
    """Get comprehensive analytics for companies"""
    try:
        # Time periods for analysis
        today = datetime.utcnow()
        last_30_days = today - timedelta(days=30)
        last_90_days = today - timedelta(days=90)
        
        # Job posting analytics
        jobs_data = db.query("""
            SELECT 
                COUNT(*) as total_jobs,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_jobs,
                COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_jobs,
                COUNT(CASE WHEN created_at >= %s THEN 1 END) as jobs_last_30_days,
                AVG(CASE WHEN status = 'closed' AND filled_at IS NOT NULL 
                    THEN EXTRACT(EPOCH FROM (filled_at - created_at))/86400 END) as avg_time_to_fill
            FROM jobs 
            WHERE company_id = %s
        """, (last_30_days, company_id))
        
        # Application analytics
        applications_data = db.query("""
            SELECT 
                COUNT(*) as total_applications,
                COUNT(CASE WHEN status = 'applied' THEN 1 END) as new_applications,
                COUNT(CASE WHEN status = 'reviewing' THEN 1 END) as under_review,
                COUNT(CASE WHEN status = 'interview' THEN 1 END) as in_interview,
                COUNT(CASE WHEN status = 'hired' THEN 1 END) as hired,
                COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN a.created_at >= %s THEN 1 END) as applications_last_30_days
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE j.company_id = %s
        """, (last_30_days, company_id))
        
        # Candidate quality metrics
        candidate_metrics = db.query("""
            SELECT 
                AVG(CAST(ai_analysis->>'overall_score' AS FLOAT)) as avg_candidate_score,
                COUNT(CASE WHEN CAST(ai_analysis->>'overall_score' AS FLOAT) >= 80 THEN 1 END) as high_quality_candidates,
                COUNT(DISTINCT a.candidate_id) as unique_candidates
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN documents d ON a.candidate_id = d.user_id AND d.document_type = 'resume'
            WHERE j.company_id = %s AND d.ai_analysis IS NOT NULL
        """, (company_id,))
        
        # Hiring funnel analytics
        funnel_data = db.query("""
            SELECT 
                status,
                COUNT(*) as count,
                AVG(CASE WHEN ai_analysis IS NOT NULL 
                    THEN CAST(ai_analysis->>'overall_score' AS FLOAT) END) as avg_score
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            LEFT JOIN documents d ON a.candidate_id = d.user_id AND d.document_type = 'resume'
            WHERE j.company_id = %s
            GROUP BY status
            ORDER BY 
                CASE status 
                    WHEN 'applied' THEN 1
                    WHEN 'reviewing' THEN 2
                    WHEN 'interview' THEN 3
                    WHEN 'hired' THEN 4
                    WHEN 'rejected' THEN 5
                END
        """, (company_id,))
        
        # Top performing jobs
        top_jobs = db.query("""
            SELECT 
                j.title,
                j.id,
                COUNT(a.id) as application_count,
                COUNT(CASE WHEN a.status = 'hired' THEN 1 END) as hired_count,
                AVG(CASE WHEN d.ai_analysis IS NOT NULL 
                    THEN CAST(d.ai_analysis->>'overall_score' AS FLOAT) END) as avg_candidate_quality
            FROM jobs j
            LEFT JOIN applications a ON j.id = a.job_id
            LEFT JOIN documents d ON a.candidate_id = d.user_id AND d.document_type = 'resume'
            WHERE j.company_id = %s
            GROUP BY j.id, j.title
            ORDER BY application_count DESC
            LIMIT 10
        """, (company_id,))
        
        # Skills in demand
        skills_demand = db.query("""
            SELECT 
                skill,
                COUNT(*) as job_count,
                AVG(CASE WHEN a.status = 'hired' THEN 1.0 ELSE 0.0 END) as hire_rate
            FROM (
                SELECT j.id, jsonb_array_elements_text(j.required_skills) as skill
                FROM jobs j
                WHERE j.company_id = %s AND j.required_skills IS NOT NULL
            ) skills
            LEFT JOIN applications a ON skills.id = a.job_id
            GROUP BY skill
            ORDER BY job_count DESC
            LIMIT 15
        """, (company_id,))
        
        return jsonify({
            'success': True,
            'analytics': {
                'overview': {
                    'total_jobs': jobs_data[0]['total_jobs'] if jobs_data else 0,
                    'active_jobs': jobs_data[0]['active_jobs'] if jobs_data else 0,
                    'total_applications': applications_data[0]['total_applications'] if applications_data else 0,
                    'new_applications_30d': applications_data[0]['applications_last_30_days'] if applications_data else 0,
                    'avg_time_to_fill': round(jobs_data[0]['avg_time_to_fill'] or 0, 1) if jobs_data else 0,
                    'avg_candidate_score': round(candidate_metrics[0]['avg_candidate_score'] or 0, 1) if candidate_metrics else 0
                },
                'hiring_funnel': [dict(row) for row in funnel_data] if funnel_data else [],
                'top_jobs': [dict(row) for row in top_jobs] if top_jobs else [],
                'skills_demand': [dict(row) for row in skills_demand] if skills_demand else [],
                'candidate_quality': {
                    'high_quality_count': candidate_metrics[0]['high_quality_candidates'] if candidate_metrics else 0,
                    'unique_candidates': candidate_metrics[0]['unique_candidates'] if candidate_metrics else 0,
                    'avg_score': round(candidate_metrics[0]['avg_candidate_score'] or 0, 1) if candidate_metrics else 0
                }
            },
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get company analytics', 'details': str(e)}), 500

def get_recruiter_analytics(recruiter_id: str) -> Dict[str, Any]:
    """Get comprehensive analytics for recruiters"""
    try:
        today = datetime.utcnow()
        last_30_days = today - timedelta(days=30)
        
        # Recruiter performance metrics
        performance_data = db.query("""
            SELECT 
                COUNT(DISTINCT a.job_id) as jobs_worked,
                COUNT(a.id) as total_placements,
                COUNT(CASE WHEN a.status = 'hired' THEN 1 END) as successful_placements,
                SUM(CASE WHEN a.status = 'hired' THEN a.commission_amount ELSE 0 END) as total_earnings,
                AVG(CASE WHEN a.status = 'hired' AND a.placed_at IS NOT NULL 
                    THEN EXTRACT(EPOCH FROM (a.placed_at - a.created_at))/86400 END) as avg_time_to_place
            FROM applications a
            WHERE a.recruiter_id = %s
        """, (recruiter_id,))
        
        # Monthly performance trend
        monthly_trend = db.query("""
            SELECT 
                DATE_TRUNC('month', a.created_at) as month,
                COUNT(a.id) as applications,
                COUNT(CASE WHEN a.status = 'hired' THEN 1 END) as placements,
                SUM(CASE WHEN a.status = 'hired' THEN a.commission_amount ELSE 0 END) as earnings
            FROM applications a
            WHERE a.recruiter_id = %s AND a.created_at >= %s
            GROUP BY DATE_TRUNC('month', a.created_at)
            ORDER BY month DESC
        """, (recruiter_id, last_30_days))
        
        # Client companies
        client_companies = db.query("""
            SELECT 
                c.name as company_name,
                c.id as company_id,
                COUNT(DISTINCT a.job_id) as jobs_worked,
                COUNT(CASE WHEN a.status = 'hired' THEN 1 END) as placements,
                SUM(CASE WHEN a.status = 'hired' THEN a.commission_amount ELSE 0 END) as total_earnings
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            WHERE a.recruiter_id = %s
            GROUP BY c.id, c.name
            ORDER BY placements DESC
        """, (recruiter_id,))
        
        # Candidate pipeline
        candidate_pipeline = db.query("""
            SELECT 
                a.status,
                COUNT(*) as count,
                AVG(CASE WHEN d.ai_analysis IS NOT NULL 
                    THEN CAST(d.ai_analysis->>'overall_score' AS FLOAT) END) as avg_candidate_score
            FROM applications a
            LEFT JOIN documents d ON a.candidate_id = d.user_id AND d.document_type = 'resume'
            WHERE a.recruiter_id = %s
            GROUP BY a.status
        """, (recruiter_id,))
        
        return jsonify({
            'success': True,
            'analytics': {
                'performance': {
                    'jobs_worked': performance_data[0]['jobs_worked'] if performance_data else 0,
                    'total_placements': performance_data[0]['total_placements'] if performance_data else 0,
                    'successful_placements': performance_data[0]['successful_placements'] if performance_data else 0,
                    'total_earnings': float(performance_data[0]['total_earnings'] or 0) if performance_data else 0,
                    'avg_time_to_place': round(performance_data[0]['avg_time_to_place'] or 0, 1) if performance_data else 0,
                    'success_rate': round((performance_data[0]['successful_placements'] / max(performance_data[0]['total_placements'], 1)) * 100, 1) if performance_data else 0
                },
                'monthly_trend': [dict(row) for row in monthly_trend] if monthly_trend else [],
                'client_companies': [dict(row) for row in client_companies] if client_companies else [],
                'candidate_pipeline': [dict(row) for row in candidate_pipeline] if candidate_pipeline else []
            },
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get recruiter analytics', 'details': str(e)}), 500

def get_candidate_analytics(candidate_id: str) -> Dict[str, Any]:
    """Get comprehensive analytics for candidates"""
    try:
        # Application history and status
        application_data = db.query("""
            SELECT 
                COUNT(*) as total_applications,
                COUNT(CASE WHEN status = 'applied' THEN 1 END) as pending_applications,
                COUNT(CASE WHEN status = 'reviewing' THEN 1 END) as under_review,
                COUNT(CASE WHEN status = 'interview' THEN 1 END) as interviews,
                COUNT(CASE WHEN status = 'hired' THEN 1 END) as offers_received,
                COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejections
            FROM applications
            WHERE candidate_id = %s
        """, (candidate_id,))
        
        # Profile completeness and AI analysis
        profile_data = db.query("""
            SELECT 
                COUNT(CASE WHEN document_type = 'resume' THEN 1 END) as has_resume,
                COUNT(CASE WHEN document_type = 'cover_letter' THEN 1 END) as has_cover_letter,
                COUNT(CASE WHEN document_type = 'portfolio' THEN 1 END) as has_portfolio,
                AVG(CASE WHEN ai_analysis IS NOT NULL 
                    THEN CAST(ai_analysis->>'overall_score' AS FLOAT) END) as avg_profile_score
            FROM documents
            WHERE user_id = %s
        """, (candidate_id,))
        
        # Job match recommendations
        job_matches = db.query("""
            SELECT 
                j.id,
                j.title,
                j.company_id,
                c.name as company_name,
                j.location,
                j.salary_min,
                j.salary_max,
                j.required_skills,
                j.experience_level
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            WHERE j.status = 'active'
            ORDER BY j.created_at DESC
            LIMIT 10
        """)
        
        # Application timeline
        application_timeline = db.query("""
            SELECT 
                a.id,
                j.title as job_title,
                c.name as company_name,
                a.status,
                a.created_at,
                a.updated_at
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            WHERE a.candidate_id = %s
            ORDER BY a.created_at DESC
            LIMIT 20
        """, (candidate_id,))
        
        return jsonify({
            'success': True,
            'analytics': {
                'application_summary': {
                    'total_applications': application_data[0]['total_applications'] if application_data else 0,
                    'pending_applications': application_data[0]['pending_applications'] if application_data else 0,
                    'under_review': application_data[0]['under_review'] if application_data else 0,
                    'interviews': application_data[0]['interviews'] if application_data else 0,
                    'offers_received': application_data[0]['offers_received'] if application_data else 0,
                    'rejections': application_data[0]['rejections'] if application_data else 0
                },
                'profile_insights': {
                    'has_resume': bool(profile_data[0]['has_resume']) if profile_data else False,
                    'has_cover_letter': bool(profile_data[0]['has_cover_letter']) if profile_data else False,
                    'has_portfolio': bool(profile_data[0]['has_portfolio']) if profile_data else False,
                    'avg_profile_score': round(profile_data[0]['avg_profile_score'] or 0, 1) if profile_data else 0,
                    'profile_completeness': calculate_profile_completeness(profile_data[0] if profile_data else {})
                },
                'recommended_jobs': [dict(row) for row in job_matches] if job_matches else [],
                'application_timeline': [dict(row) for row in application_timeline] if application_timeline else []
            },
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get candidate analytics', 'details': str(e)}), 500

def calculate_profile_completeness(profile_data: Dict) -> int:
    """Calculate profile completeness percentage"""
    score = 0
    if profile_data.get('has_resume'):
        score += 40
    if profile_data.get('has_cover_letter'):
        score += 20
    if profile_data.get('has_portfolio'):
        score += 20
    if profile_data.get('avg_profile_score', 0) > 0:
        score += 20
    return min(score, 100)

@analytics_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_ai_recommendations():
    """Get AI-powered recommendations for users"""
    try:
        current_user = get_jwt_identity()
        user_role = current_user.get('role', 'candidate')
        user_id = current_user.get('user_id')
        
        if user_role == 'candidate':
            return get_candidate_recommendations(user_id)
        elif user_role == 'company':
            return get_company_recommendations(user_id)
        else:
            return get_recruiter_recommendations(user_id)
            
    except Exception as e:
        return jsonify({'error': 'Failed to get recommendations', 'details': str(e)}), 500

def get_candidate_recommendations(candidate_id: str) -> Dict[str, Any]:
    """Get AI-powered job recommendations for candidates"""
    try:
        # Get candidate's resume and profile
        candidate_profile = db.query("""
            SELECT 
                d.ai_analysis,
                u.first_name,
                u.last_name,
                u.email
            FROM documents d
            JOIN users u ON d.user_id = u.id
            WHERE d.user_id = %s AND d.document_type = 'resume' AND d.is_primary = true
            LIMIT 1
        """, (candidate_id,))
        
        if not candidate_profile:
            return jsonify({
                'success': False,
                'error': 'No resume found for recommendations'
            }), 404
        
        # Get active jobs for matching
        active_jobs = db.query("""
            SELECT 
                j.id,
                j.title,
                j.description,
                j.required_skills,
                j.experience_level,
                j.location,
                j.salary_min,
                j.salary_max,
                c.name as company_name
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            WHERE j.status = 'active'
            ORDER BY j.created_at DESC
            LIMIT 50
        """)
        
        recommendations = []
        profile_analysis = candidate_profile[0]['ai_analysis'] if candidate_profile else {}
        
        for job in active_jobs:
            # Calculate AI match score
            match_result = ai_service.calculate_job_match_score(
                profile_analysis, 
                job['description']
            )
            
            if match_result['success']:
                match_score = int(match_result['match_analysis'].get('match_score', 0))
                recommendations.append({
                    'job_id': job['id'],
                    'job_title': job['title'],
                    'company_name': job['company_name'],
                    'location': job['location'],
                    'salary_range': f"${job['salary_min']:,} - ${job['salary_max']:,}" if job['salary_min'] and job['salary_max'] else "Competitive",
                    'match_score': match_score,
                    'match_analysis': match_result['match_analysis'],
                    'required_skills': job['required_skills'],
                    'experience_level': job['experience_level']
                })
        
        # Sort by match score and take top 10
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        top_recommendations = recommendations[:10]
        
        return jsonify({
            'success': True,
            'recommendations': top_recommendations,
            'total_jobs_analyzed': len(active_jobs),
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get candidate recommendations', 'details': str(e)}), 500

def get_company_recommendations(company_id: str) -> Dict[str, Any]:
    """Get AI-powered candidate recommendations for companies"""
    try:
        # Get company's active jobs
        active_jobs = db.query("""
            SELECT id, title, description, required_skills
            FROM jobs
            WHERE company_id = %s AND status = 'active'
        """, (company_id,))
        
        if not active_jobs:
            return jsonify({
                'success': True,
                'recommendations': [],
                'message': 'No active jobs found'
            }), 200
        
        recommendations = []
        
        for job in active_jobs:
            # Get candidates who haven't applied to this job
            available_candidates = db.query("""
                SELECT DISTINCT
                    u.id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    d.ai_analysis
                FROM users u
                JOIN documents d ON u.id = d.user_id
                WHERE u.role = 'candidate' 
                AND d.document_type = 'resume' 
                AND d.is_primary = true
                AND u.id NOT IN (
                    SELECT candidate_id 
                    FROM applications 
                    WHERE job_id = %s
                )
                LIMIT 20
            """, (job['id'],))
            
            job_recommendations = []
            for candidate in available_candidates:
                if candidate['ai_analysis']:
                    # Calculate match score
                    match_result = ai_service.calculate_job_match_score(
                        candidate['ai_analysis'],
                        job['description']
                    )
                    
                    if match_result['success']:
                        match_score = int(match_result['match_analysis'].get('match_score', 0))
                        if match_score >= 70:  # Only recommend high-quality matches
                            job_recommendations.append({
                                'candidate_id': candidate['id'],
                                'candidate_name': f"{candidate['first_name']} {candidate['last_name']}",
                                'candidate_email': candidate['email'],
                                'match_score': match_score,
                                'match_analysis': match_result['match_analysis']
                            })
            
            # Sort by match score and take top 5 per job
            job_recommendations.sort(key=lambda x: x['match_score'], reverse=True)
            
            if job_recommendations:
                recommendations.append({
                    'job_id': job['id'],
                    'job_title': job['title'],
                    'recommended_candidates': job_recommendations[:5]
                })
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get company recommendations', 'details': str(e)}), 500

def get_recruiter_recommendations(recruiter_id: str) -> Dict[str, Any]:
    """Get AI-powered recommendations for recruiters"""
    try:
        # Get jobs the recruiter is working on
        recruiter_jobs = db.query("""
            SELECT DISTINCT
                j.id,
                j.title,
                j.description,
                j.company_id,
                c.name as company_name
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            JOIN applications a ON j.id = a.job_id
            WHERE a.recruiter_id = %s AND j.status = 'active'
        """, (recruiter_id,))
        
        recommendations = {
            'high_potential_candidates': [],
            'job_opportunities': [],
            'performance_insights': []
        }
        
        # Get high-potential candidates for recruiter's jobs
        for job in recruiter_jobs:
            potential_candidates = db.query("""
                SELECT 
                    u.id,
                    u.first_name,
                    u.last_name,
                    d.ai_analysis
                FROM users u
                JOIN documents d ON u.id = d.user_id
                WHERE u.role = 'candidate' 
                AND d.document_type = 'resume'
                AND d.is_primary = true
                AND u.id NOT IN (
                    SELECT candidate_id 
                    FROM applications 
                    WHERE job_id = %s
                )
                LIMIT 10
            """, (job['id'],))
            
            for candidate in potential_candidates:
                if candidate['ai_analysis']:
                    match_result = ai_service.calculate_job_match_score(
                        candidate['ai_analysis'],
                        job['description']
                    )
                    
                    if match_result['success']:
                        match_score = int(match_result['match_analysis'].get('match_score', 0))
                        if match_score >= 80:
                            recommendations['high_potential_candidates'].append({
                                'candidate_id': candidate['id'],
                                'candidate_name': f"{candidate['first_name']} {candidate['last_name']}",
                                'job_title': job['title'],
                                'company_name': job['company_name'],
                                'match_score': match_score
                            })
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get recruiter recommendations', 'details': str(e)}), 500

@analytics_bp.route('/feedback-loop', methods=['POST'])
@jwt_required()
def submit_feedback():
    """Submit feedback for rejected candidates to improve future recommendations"""
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        application_id = data.get('application_id')
        feedback_type = data.get('feedback_type')  # 'rejection', 'improvement', 'positive'
        feedback_text = data.get('feedback_text')
        feedback_categories = data.get('categories', [])  # skills, experience, cultural_fit, etc.
        
        if not all([application_id, feedback_type, feedback_text]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Store feedback in database
        feedback_id = db.insert('application_feedback', {
            'application_id': application_id,
            'feedback_type': feedback_type,
            'feedback_text': feedback_text,
            'feedback_categories': json.dumps(feedback_categories),
            'submitted_by': current_user.get('user_id'),
            'created_at': datetime.utcnow()
        })
        
        # Update application with feedback reference
        db.update('applications', application_id, {
            'feedback_id': feedback_id,
            'updated_at': datetime.utcnow()
        })
        
        return jsonify({
            'success': True,
            'feedback_id': feedback_id,
            'message': 'Feedback submitted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to submit feedback', 'details': str(e)}), 500

@analytics_bp.route('/market-insights', methods=['GET'])
@jwt_required()
def get_market_insights():
    """Get market insights and salary analytics"""
    try:
        # Salary analytics by role and location
        salary_insights = db.query("""
            SELECT 
                j.title,
                j.location,
                AVG(j.salary_min) as avg_salary_min,
                AVG(j.salary_max) as avg_salary_max,
                COUNT(*) as job_count
            FROM jobs j
            WHERE j.salary_min IS NOT NULL AND j.salary_max IS NOT NULL
            GROUP BY j.title, j.location
            HAVING COUNT(*) >= 3
            ORDER BY avg_salary_max DESC
            LIMIT 20
        """)
        
        # Skills in demand
        skills_demand = db.query("""
            SELECT 
                skill,
                COUNT(*) as demand_count,
                AVG(j.salary_max) as avg_salary
            FROM (
                SELECT j.id, j.salary_max, jsonb_array_elements_text(j.required_skills) as skill
                FROM jobs j
                WHERE j.required_skills IS NOT NULL AND j.created_at >= NOW() - INTERVAL '90 days'
            ) skills
            JOIN jobs j ON skills.id = j.id
            GROUP BY skill
            ORDER BY demand_count DESC
            LIMIT 15
        """)
        
        # Industry trends
        industry_trends = db.query("""
            SELECT 
                c.industry,
                COUNT(j.id) as job_postings,
                COUNT(a.id) as total_applications,
                AVG(CASE WHEN a.status = 'hired' THEN 1.0 ELSE 0.0 END) as hire_rate
            FROM companies c
            LEFT JOIN jobs j ON c.id = j.company_id
            LEFT JOIN applications a ON j.id = a.job_id
            WHERE j.created_at >= NOW() - INTERVAL '90 days'
            GROUP BY c.industry
            ORDER BY job_postings DESC
            LIMIT 10
        """)
        
        return jsonify({
            'success': True,
            'market_insights': {
                'salary_insights': [dict(row) for row in salary_insights] if salary_insights else [],
                'skills_demand': [dict(row) for row in skills_demand] if skills_demand else [],
                'industry_trends': [dict(row) for row in industry_trends] if industry_trends else []
            },
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get market insights', 'details': str(e)}), 500

@analytics_bp.route('/auto-apply', methods=['POST'])
@jwt_required()
def setup_auto_apply():
    """Set up auto-apply functionality for candidates"""
    try:
        current_user = get_jwt_identity()
        candidate_id = current_user.get('user_id')
        data = request.get_json()
        
        # Auto-apply preferences
        preferences = {
            'enabled': data.get('enabled', False),
            'min_match_score': data.get('min_match_score', 70),
            'max_applications_per_day': data.get('max_applications_per_day', 5),
            'preferred_locations': data.get('preferred_locations', []),
            'preferred_job_types': data.get('preferred_job_types', []),
            'salary_min': data.get('salary_min'),
            'excluded_companies': data.get('excluded_companies', []),
            'auto_apply_message': data.get('auto_apply_message', '')
        }
        
        # Store auto-apply preferences
        db.upsert('candidate_auto_apply_preferences', {
            'candidate_id': candidate_id,
            'preferences': json.dumps(preferences),
            'updated_at': datetime.utcnow()
        }, ['candidate_id'])
        
        return jsonify({
            'success': True,
            'message': 'Auto-apply preferences updated successfully',
            'preferences': preferences
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to setup auto-apply', 'details': str(e)}), 500

@analytics_bp.route('/auto-apply/status', methods=['GET'])
@jwt_required()
def get_auto_apply_status():
    """Get auto-apply status and recent applications"""
    try:
        current_user = get_jwt_identity()
        candidate_id = current_user.get('user_id')
        
        # Get auto-apply preferences
        preferences = db.query("""
            SELECT preferences, updated_at
            FROM candidate_auto_apply_preferences
            WHERE candidate_id = %s
        """, (candidate_id,))
        
        # Get recent auto-applied jobs
        recent_applications = db.query("""
            SELECT 
                a.id,
                j.title,
                c.name as company_name,
                a.created_at,
                a.status
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            WHERE a.candidate_id = %s AND a.auto_applied = true
            ORDER BY a.created_at DESC
            LIMIT 10
        """, (candidate_id,))
        
        return jsonify({
            'success': True,
            'auto_apply_preferences': json.loads(preferences[0]['preferences']) if preferences else None,
            'recent_auto_applications': [dict(row) for row in recent_applications] if recent_applications else [],
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get auto-apply status', 'details': str(e)}), 500

