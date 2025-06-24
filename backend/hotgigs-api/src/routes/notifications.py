"""
Notifications routes for HotGigs.ai
Handles user notifications, alerts, and messaging functionality
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
import re
import html
from datetime import datetime, timezone
from src.models.optimized_database import OptimizedSupabaseService

notifications_bp = Blueprint('notifications', __name__)
db_service = OptimizedSupabaseService()

# Notification validation schemas
class NotificationCreateSchema(Schema):
    recipient_id = fields.UUID(required=True)
    title = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 3)
    message = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 10)
    notification_type = fields.Str(required=True, validate=lambda x: x in ['info', 'success', 'warning', 'error', 'job_alert', 'application_update', 'message'])
    action_url = fields.Str(allow_none=True)
    priority = fields.Str(load_default='normal', validate=lambda x: x in ['low', 'normal', 'high', 'urgent'])

class NotificationUpdateSchema(Schema):
    is_read = fields.Bool(allow_none=True)
    read_at = fields.DateTime(allow_none=True)

def sanitize_input(text):
    """Sanitize user input to prevent XSS attacks"""
    if not text:
        return text
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', str(text))
    
    # Escape special characters
    text = html.escape(text)
    
    return text.strip()

@notifications_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for notifications service"""
    try:
        return jsonify({
            'status': 'healthy',
            'service': 'notifications',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'notifications',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_notifications():
    """Get notifications for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        notification_type = request.args.get('type')
        
        # Build filters
        filters = {'user_id': current_user_id}
        
        if unread_only:
            filters['is_read'] = False
        
        if notification_type:
            filters['notification_type'] = notification_type
        
        # Get notifications
        notifications = db_service.get_records_optimized(
            'notifications',
            filters=filters,
            limit=limit,
            offset=offset,
            order_by='created_at',
            ascending=False
        )
        
        # Get unread count
        unread_count = db_service.count_records(
            'notifications',
            {'user_id': current_user_id, 'is_read': False}
        )
        
        return jsonify({
            'notifications': notifications,
            'total': len(notifications),
            'unread_count': unread_count,
            'pagination': {
                'limit': limit,
                'offset': offset
            },
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting user notifications: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve notifications',
            'message': 'An error occurred while fetching your notifications',
            'status': 'error'
        }), 500

@notifications_bp.route('/', methods=['POST'])
@jwt_required()
def create_notification():
    """Create a new notification (admin/system use)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user has permission to create notifications
        user = db_service.get_record_by_id('users', current_user_id)
        if not user:
            return jsonify({
                'error': 'User not found',
                'status': 'error'
            }), 404
        
        # For now, allow companies and recruiters to send notifications
        if user.get('user_type') not in ['company', 'freelance_recruiter']:
            return jsonify({
                'error': 'Access denied',
                'message': 'You do not have permission to create notifications',
                'status': 'error'
            }), 403
        
        # Validate input data
        schema = NotificationCreateSchema()
        try:
            notification_data = schema.load(request.json)
        except ValidationError as e:
            return jsonify({
                'error': 'Validation failed',
                'details': e.messages,
                'status': 'error'
            }), 400
        
        # Sanitize input data
        notification_data['title'] = sanitize_input(notification_data['title'])
        notification_data['message'] = sanitize_input(notification_data['message'])
        
        # Add metadata
        notification_data.update({
            'sender_id': current_user_id,
            'is_read': False,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat()
        })
        
        # Create the notification
        notification = db_service.create_record('notifications', notification_data)
        
        if not notification:
            return jsonify({
                'error': 'Failed to create notification',
                'status': 'error'
            }), 500
        
        return jsonify({
            'notification': notification,
            'message': 'Notification created successfully',
            'status': 'success'
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error creating notification: {str(e)}")
        return jsonify({
            'error': 'Failed to create notification',
            'message': 'An error occurred while creating the notification',
            'status': 'error'
        }), 500

@notifications_bp.route('/<notification_id>', methods=['GET'])
@jwt_required()
def get_notification(notification_id):
    """Get a specific notification by ID"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get notification
        notification = db_service.get_record_by_id('notifications', notification_id)
        
        if not notification:
            return jsonify({
                'error': 'Notification not found',
                'status': 'error'
            }), 404
        
        # Check if user owns the notification
        if notification['user_id'] != current_user_id:
            return jsonify({
                'error': 'Access denied',
                'message': 'You do not have permission to access this notification',
                'status': 'error'
            }), 403
        
        return jsonify({
            'notification': notification,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting notification: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve notification',
            'status': 'error'
        }), 500

@notifications_bp.route('/<notification_id>', methods=['PUT'])
@jwt_required()
def update_notification(notification_id):
    """Update a notification (mark as read/unread)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get notification to check ownership
        notification = db_service.get_record_by_id('notifications', notification_id)
        
        if not notification:
            return jsonify({
                'error': 'Notification not found',
                'status': 'error'
            }), 404
        
        # Check if user owns the notification
        if notification['user_id'] != current_user_id:
            return jsonify({
                'error': 'Access denied',
                'message': 'You do not have permission to update this notification',
                'status': 'error'
            }), 403
        
        # Validate input data
        schema = NotificationUpdateSchema()
        try:
            update_data = schema.load(request.json)
        except ValidationError as e:
            return jsonify({
                'error': 'Validation failed',
                'details': e.messages,
                'status': 'error'
            }), 400
        
        # Add read timestamp if marking as read
        if update_data.get('is_read') and not notification.get('is_read'):
            update_data['read_at'] = datetime.now(timezone.utc).isoformat()
        
        # Update the notification
        updated_notification = db_service.update_record('notifications', notification_id, update_data)
        
        if not updated_notification:
            return jsonify({
                'error': 'Failed to update notification',
                'status': 'error'
            }), 500
        
        return jsonify({
            'notification': updated_notification,
            'message': 'Notification updated successfully',
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating notification: {str(e)}")
        return jsonify({
            'error': 'Failed to update notification',
            'status': 'error'
        }), 500

@notifications_bp.route('/<notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Delete a notification"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get notification to check ownership
        notification = db_service.get_record_by_id('notifications', notification_id)
        
        if not notification:
            return jsonify({
                'error': 'Notification not found',
                'status': 'error'
            }), 404
        
        # Check if user owns the notification
        if notification['user_id'] != current_user_id:
            return jsonify({
                'error': 'Access denied',
                'message': 'You do not have permission to delete this notification',
                'status': 'error'
            }), 403
        
        # Delete the notification
        db_service.delete_record('notifications', notification_id)
        
        return jsonify({
            'message': 'Notification deleted successfully',
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting notification: {str(e)}")
        return jsonify({
            'error': 'Failed to delete notification',
            'status': 'error'
        }), 500

@notifications_bp.route('/mark-all-read', methods=['POST'])
@jwt_required()
def mark_all_read():
    """Mark all notifications as read for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get all unread notifications for the user
        unread_notifications = db_service.get_records_optimized(
            'notifications',
            {'user_id': current_user_id, 'is_read': False}
        )
        
        # Update all to read
        updated_count = 0
        for notification in unread_notifications:
            update_data = {
                'is_read': True,
                'read_at': datetime.now(timezone.utc).isoformat()
            }
            
            updated = db_service.update_record('notifications', notification['id'], update_data)
            if updated:
                updated_count += 1
        
        return jsonify({
            'message': f'Marked {updated_count} notifications as read',
            'updated_count': updated_count,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error marking all notifications as read: {str(e)}")
        return jsonify({
            'error': 'Failed to mark notifications as read',
            'status': 'error'
        }), 500

@notifications_bp.route('/clear-all', methods=['DELETE'])
@jwt_required()
def clear_all_notifications():
    """Clear all notifications for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get all notifications for the user
        user_notifications = db_service.get_records_optimized(
            'notifications',
            {'user_id': current_user_id}
        )
        
        # Delete all notifications
        deleted_count = 0
        for notification in user_notifications:
            try:
                db_service.delete_record('notifications', notification['id'])
                deleted_count += 1
            except:
                continue
        
        return jsonify({
            'message': f'Cleared {deleted_count} notifications',
            'deleted_count': deleted_count,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error clearing all notifications: {str(e)}")
        return jsonify({
            'error': 'Failed to clear notifications',
            'status': 'error'
        }), 500

@notifications_bp.route('/preferences', methods=['GET'])
@jwt_required()
def get_notification_preferences():
    """Get notification preferences for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user preferences (placeholder - could be stored in user_preferences table)
        default_preferences = {
            'email_notifications': True,
            'push_notifications': True,
            'job_alerts': True,
            'application_updates': True,
            'messages': True,
            'marketing': False,
            'frequency': 'immediate'  # immediate, daily, weekly
        }
        
        return jsonify({
            'preferences': default_preferences,
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting notification preferences: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve notification preferences',
            'status': 'error'
        }), 500

@notifications_bp.route('/preferences', methods=['PUT'])
@jwt_required()
def update_notification_preferences():
    """Update notification preferences for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate preferences (basic validation)
        preferences = request.json
        
        if not isinstance(preferences, dict):
            return jsonify({
                'error': 'Invalid preferences format',
                'status': 'error'
            }), 400
        
        # Here you would typically save to a user_preferences table
        # For now, just return success
        
        return jsonify({
            'preferences': preferences,
            'message': 'Notification preferences updated successfully',
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error updating notification preferences: {str(e)}")
        return jsonify({
            'error': 'Failed to update notification preferences',
            'status': 'error'
        }), 500

@notifications_bp.route('/types', methods=['GET'])
def get_notification_types():
    """Get available notification types"""
    try:
        notification_types = [
            {'value': 'info', 'label': 'Information', 'description': 'General information notifications'},
            {'value': 'success', 'label': 'Success', 'description': 'Success confirmations'},
            {'value': 'warning', 'label': 'Warning', 'description': 'Warning messages'},
            {'value': 'error', 'label': 'Error', 'description': 'Error notifications'},
            {'value': 'job_alert', 'label': 'Job Alert', 'description': 'New job opportunities'},
            {'value': 'application_update', 'label': 'Application Update', 'description': 'Updates on job applications'},
            {'value': 'message', 'label': 'Message', 'description': 'Direct messages from other users'}
        ]
        
        return jsonify({
            'notification_types': notification_types,
            'status': 'success'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get notification types',
            'status': 'error'
        }), 500

@notifications_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_notification_stats():
    """Get notification statistics for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get total notifications
        total_notifications = db_service.count_records(
            'notifications',
            {'user_id': current_user_id}
        )
        
        # Get unread notifications
        unread_notifications = db_service.count_records(
            'notifications',
            {'user_id': current_user_id, 'is_read': False}
        )
        
        # Get notifications by type
        notification_types = ['info', 'success', 'warning', 'error', 'job_alert', 'application_update', 'message']
        type_stats = {}
        
        for notification_type in notification_types:
            count = db_service.count_records(
                'notifications',
                {'user_id': current_user_id, 'notification_type': notification_type}
            )
            type_stats[notification_type] = count
        
        return jsonify({
            'statistics': {
                'total_notifications': total_notifications,
                'unread_notifications': unread_notifications,
                'read_notifications': total_notifications - unread_notifications,
                'by_type': type_stats
            },
            'status': 'success'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting notification stats: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve notification statistics',
            'status': 'error'
        }), 500

# Utility function to create system notifications
def create_system_notification(user_id: str, title: str, message: str, 
                             notification_type: str = 'info', action_url: str = None):
    """Create a system notification for a user"""
    try:
        notification_data = {
            'user_id': user_id,
            'title': title,
            'message': message,
            'notification_type': notification_type,
            'action_url': action_url,
            'priority': 'normal',
            'is_read': False,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat()
        }
        
        return db_service.create_record('notifications', notification_data)
        
    except Exception as e:
        current_app.logger.error(f"Error creating system notification: {str(e)}")
        return None

# Error handlers
@notifications_bp.errorhandler(ValidationError)
def handle_validation_error(e):
    return jsonify({
        'error': 'Validation failed',
        'details': e.messages,
        'status': 'error'
    }), 400

@notifications_bp.errorhandler(Exception)
def handle_general_error(e):
    current_app.logger.error(f"Unhandled error in notifications route: {str(e)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred',
        'status': 'error'
    }), 500

