"""
Notifications routes for HotGigs.ai
Handles user notifications and alerts
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.database import DatabaseService

notifications_bp = Blueprint('notifications', __name__)
db_service = DatabaseService()

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get user notifications"""
    try:
        current_user_id = get_jwt_identity()
        
        notifications = db_service.get_records(
            'notifications',
            filters={'user_id': current_user_id},
            order_by='created_at',
            ascending=False,
            limit=50
        )
        
        return jsonify({
            'notifications': notifications
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get notifications', 'details': str(e)}), 500

@notifications_bp.route('/<notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark notification as read"""
    try:
        current_user_id = get_jwt_identity()
        
        # Verify notification belongs to current user
        notification = db_service.get_record_by_id('notifications', notification_id)
        if not notification or notification['user_id'] != current_user_id:
            return jsonify({'error': 'Notification not found'}), 404
        
        db_service.update_record('notifications', notification_id, {
            'is_read': True,
            'read_at': db_service.supabase.table('notifications').select('NOW()').execute().data[0]['now']
        })
        
        return jsonify({
            'message': 'Notification marked as read'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to mark notification as read', 'details': str(e)}), 500

