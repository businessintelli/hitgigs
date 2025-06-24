"""
Analytics routes for HotGigs.ai
Handles analytics dashboard, metrics, and reporting functionality
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timezone, timedelta
from src.models.optimized_database import OptimizedSupabaseService

analytics_bp = Blueprint('analytics', __name__)
db_service = OptimizedSupabaseService()

@analytics_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for analytics service"""
    try:
        return jsonify({
            'status': 'healthy',
            'service': 'analytics',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'analytics',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_analytics():
    """Get analytics dashboard data for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user information to determine user type
        user = db_service.get_record_by_id('users', current_user_id)
        if not user:
            return jsonify({
                'error': 'User not found',
                'status': 'error'
            }), 404
        
        user_type = user.get('user_type')
        dashboard_data = {}
        
        if user_type == 'candidate':
            dashboard_data = get_candidate_analytics(current_user_id)
        elif user_type == 'company':
            dashboard_data = get_company_analytics(current_user_id)
        elif user_type == 'freelance_recruiter':
            dashboard_data = get_recruiter_analytics(current_user_id)
        else:
            dashboard_data = get_general_analytics()
        
        return jsonify({
            'dashboard': dashboard_data,
            'user_type': user_type,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting dashboard analytics: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve analytics',
            'message': 'An error occurred while fetching dashboard data',
            'status': 'error'
        }), 500

def get_candidate_analytics(user_id: str) -> dict:
    """Get analytics for candidate users"""
    try:
        # Get candidate profile
        candidate_profiles = db_service.get_records_optimized(
            'candidate_profiles',
            {'user_id': user_id},
            limit=1
        )
        
        if not candidate_profiles:
            return {
                'profile_completion': 0,
                'applications': {'total': 0, 'pending': 0, 'interviewing': 0, 'offers': 0},
                'job_matches': 0,
                'profile_views': 0
            }
        
        candidate_id = candidate_profiles[0]['id']
        
        # Get application statistics
        applications = db_service.get_records_optimized(
            'job_applications',
            {'candidate_id': candidate_id}
        )
        
        app_stats = {
            'total': len(applications),
            'pending': len([a for a in applications if a.get('status') == 'pending']),
            'interviewing': len([a for a in applications if a.get('status') == 'interviewing']),
            'offers': len([a for a in applications if a.get('status') == 'offered']),
            'hired': len([a for a in applications if a.get('status') == 'hired']),
            'rejected': len([a for a in applications if a.get('status') == 'rejected'])
        }
        
        # Calculate profile completion
        profile = candidate_profiles[0]
        completion_fields = ['bio', 'location', 'experience_level', 'desired_salary_min']
        completed_fields = sum(1 for field in completion_fields if profile.get(field))
        profile_completion = (completed_fields / len(completion_fields)) * 100
        
        # Get recent activity
        recent_applications = applications[-5:] if applications else []
        
        return {
            'profile_completion': round(profile_completion, 1),
            'applications': app_stats,
            'job_matches': 0,  # Placeholder for AI matching
            'profile_views': 0,  # Placeholder for profile views
            'recent_activity': recent_applications
        }
        
    except Exception as e:
        current_app.logger.error(f"Error getting candidate analytics: {str(e)}")
        return {}

def get_company_analytics(user_id: str) -> dict:
    """Get analytics for company users"""
    try:
        # Get user's companies
        company_memberships = db_service.get_records_optimized(
            'company_members',
            {'user_id': user_id}
        )
        
        if not company_memberships:
            return {
                'jobs': {'total': 0, 'active': 0, 'draft': 0, 'closed': 0},
                'applications': {'total': 0, 'pending': 0, 'interviewing': 0, 'hired': 0},
                'companies': 0
            }
        
        company_ids = [cm['company_id'] for cm in company_memberships]
        
        # Get job statistics
        all_jobs = []
        all_applications = []
        
        for company_id in company_ids:
            # Get company jobs
            jobs = db_service.get_records_optimized(
                'jobs',
                {'company_id': company_id}
            )
            all_jobs.extend(jobs)
            
            # Get applications for company jobs
            for job in jobs:
                applications = db_service.get_records_optimized(
                    'job_applications',
                    {'job_id': job['id']}
                )
                all_applications.extend(applications)
        
        # Calculate job statistics
        job_stats = {
            'total': len(all_jobs),
            'active': len([j for j in all_jobs if j.get('status') == 'active']),
            'draft': len([j for j in all_jobs if j.get('status') == 'draft']),
            'closed': len([j for j in all_jobs if j.get('status') == 'closed']),
            'paused': len([j for j in all_jobs if j.get('status') == 'paused'])
        }
        
        # Calculate application statistics
        app_stats = {
            'total': len(all_applications),
            'pending': len([a for a in all_applications if a.get('status') == 'pending']),
            'interviewing': len([a for a in all_applications if a.get('status') == 'interviewing']),
            'hired': len([a for a in all_applications if a.get('status') == 'hired']),
            'rejected': len([a for a in all_applications if a.get('status') == 'rejected'])
        }
        
        # Get recent activity
        recent_applications = sorted(all_applications, key=lambda x: x.get('applied_at', ''), reverse=True)[:5]
        
        return {
            'jobs': job_stats,
            'applications': app_stats,
            'companies': len(company_ids),
            'recent_activity': recent_applications
        }
        
    except Exception as e:
        current_app.logger.error(f"Error getting company analytics: {str(e)}")
        return {}

def get_recruiter_analytics(user_id: str) -> dict:
    """Get analytics for recruiter users"""
    try:
        # Placeholder for recruiter analytics
        return {
            'placements': {'total': 0, 'this_month': 0, 'pending': 0},
            'clients': 0,
            'candidates': 0,
            'commission_earned': 0
        }
        
    except Exception as e:
        current_app.logger.error(f"Error getting recruiter analytics: {str(e)}")
        return {}

def get_general_analytics() -> dict:
    """Get general platform analytics"""
    try:
        # Get platform-wide statistics
        total_users = db_service.count_records('users')
        total_jobs = db_service.count_records('jobs', {'status': 'active'})
        total_companies = db_service.count_records('companies')
        total_applications = db_service.count_records('job_applications')
        
        return {
            'platform': {
                'total_users': total_users,
                'active_jobs': total_jobs,
                'companies': total_companies,
                'applications': total_applications
            }
        }
        
    except Exception as e:
        current_app.logger.error(f"Error getting general analytics: {str(e)}")
        return {}

@analytics_bp.route('/metrics', methods=['GET'])
@jwt_required()
def get_metrics():
    """Get detailed metrics for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get time range from query parameters
        days = request.args.get('days', 30, type=int)
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Get user type
        user = db_service.get_record_by_id('users', current_user_id)
        user_type = user.get('user_type') if user else None
        
        metrics = {}
        
        if user_type == 'candidate':
            metrics = get_candidate_metrics(current_user_id, start_date)
        elif user_type == 'company':
            metrics = get_company_metrics(current_user_id, start_date)
        
        return jsonify({
            'metrics': metrics,
            'time_range': {
                'days': days,
                'start_date': start_date.isoformat(),
                'end_date': datetime.now(timezone.utc).isoformat()
            },
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting metrics: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve metrics',
            'status': 'error'
        }), 500

def get_candidate_metrics(user_id: str, start_date: datetime) -> dict:
    """Get detailed metrics for candidates"""
    try:
        # Get candidate profile
        candidate_profiles = db_service.get_records_optimized(
            'candidate_profiles',
            {'user_id': user_id},
            limit=1
        )
        
        if not candidate_profiles:
            return {}
        
        candidate_id = candidate_profiles[0]['id']
        
        # Get applications in time range
        applications = db_service.get_records_optimized(
            'job_applications',
            {'candidate_id': candidate_id}
        )
        
        # Filter by date range
        recent_applications = [
            app for app in applications 
            if app.get('applied_at') and 
            datetime.fromisoformat(app['applied_at'].replace('Z', '+00:00')) >= start_date
        ]
        
        return {
            'applications_submitted': len(recent_applications),
            'response_rate': 0,  # Placeholder
            'interview_rate': 0,  # Placeholder
            'offer_rate': 0  # Placeholder
        }
        
    except Exception as e:
        current_app.logger.error(f"Error getting candidate metrics: {str(e)}")
        return {}

def get_company_metrics(user_id: str, start_date: datetime) -> dict:
    """Get detailed metrics for companies"""
    try:
        # Get user's companies
        company_memberships = db_service.get_records_optimized(
            'company_members',
            {'user_id': user_id}
        )
        
        if not company_memberships:
            return {}
        
        company_ids = [cm['company_id'] for cm in company_memberships]
        
        # Get jobs created in time range
        recent_jobs = []
        for company_id in company_ids:
            jobs = db_service.get_records_optimized(
                'jobs',
                {'company_id': company_id}
            )
            
            # Filter by date range
            for job in jobs:
                if job.get('created_at') and \
                   datetime.fromisoformat(job['created_at'].replace('Z', '+00:00')) >= start_date:
                    recent_jobs.append(job)
        
        return {
            'jobs_posted': len(recent_jobs),
            'applications_received': 0,  # Placeholder
            'hires_made': 0,  # Placeholder
            'time_to_hire': 0  # Placeholder
        }
        
    except Exception as e:
        current_app.logger.error(f"Error getting company metrics: {str(e)}")
        return {}

@analytics_bp.route('/reports', methods=['GET'])
@jwt_required()
def get_reports():
    """Get available reports for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user type
        user = db_service.get_record_by_id('users', current_user_id)
        user_type = user.get('user_type') if user else None
        
        available_reports = []
        
        if user_type == 'candidate':
            available_reports = [
                {'id': 'application_history', 'name': 'Application History', 'description': 'Track your job applications over time'},
                {'id': 'skill_analysis', 'name': 'Skill Analysis', 'description': 'Analyze your skills against market demand'},
                {'id': 'salary_insights', 'name': 'Salary Insights', 'description': 'Compare your salary expectations with market rates'}
            ]
        elif user_type == 'company':
            available_reports = [
                {'id': 'hiring_funnel', 'name': 'Hiring Funnel', 'description': 'Track candidates through your hiring process'},
                {'id': 'job_performance', 'name': 'Job Performance', 'description': 'Analyze the performance of your job postings'},
                {'id': 'candidate_pipeline', 'name': 'Candidate Pipeline', 'description': 'Monitor your candidate pipeline'}
            ]
        
        return jsonify({
            'reports': available_reports,
            'user_type': user_type,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting reports: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve reports',
            'status': 'error'
        }), 500

# Error handlers
@analytics_bp.errorhandler(Exception)
def handle_general_error(e):
    current_app.logger.error(f"Unhandled error in analytics route: {str(e)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred',
        'status': 'error'
    }), 500

