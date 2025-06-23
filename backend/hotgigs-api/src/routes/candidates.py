"""
Candidates routes for HotGigs.ai
Handles candidate search and management
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.database import DatabaseService

candidates_bp = Blueprint('candidates', __name__)
db_service = DatabaseService()

@candidates_bp.route('/search', methods=['GET'])
@jwt_required()
def search_candidates():
    """Search candidates (for companies and recruiters)"""
    try:
        search_term = request.args.get('q', '')
        skills = request.args.get('skills', '')
        location = request.args.get('location', '')
        limit = int(request.args.get('limit', 20))
        
        # Basic candidate search - will be expanded with AI features
        query = db_service.supabase.table('candidate_profiles').select("""
            *,
            users:user_id (
                id,
                first_name,
                last_name,
                profile_image_url
            )
        """)
        
        if search_term:
            query = query.ilike('headline', f'%{search_term}%')
        
        query = query.limit(limit)
        result = query.execute()
        
        return jsonify({
            'candidates': result.data or []
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to search candidates', 'details': str(e)}), 500

