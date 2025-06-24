"""
Workflow Automation and Task Management routes for HotGigs.ai
Handles automated workflows, task management, and intelligent automation
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
import json
from datetime import datetime, timezone, timedelta
from src.models.optimized_database import OptimizedSupabaseService
from src.services.workflow_automation import (
    task_manager, 
    workflow_engine, 
    auto_apply_service,
    TaskStatus,
    TaskPriority,
    WorkflowStatus,
    WorkflowStep
)

workflows_bp = Blueprint('workflows', __name__)
db_service = OptimizedSupabaseService()

# Validation schemas
class TaskCreateSchema(Schema):
    title = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 3)
    description = fields.Str(required=True)
    task_type = fields.Str(required=True, validate=lambda x: x in ['general', 'review', 'interview', 'screening', 'follow_up'])
    assigned_to = fields.UUID(allow_none=True)
    priority = fields.Str(load_default='medium', validate=lambda x: x in ['low', 'medium', 'high', 'urgent'])
    due_date = fields.DateTime(allow_none=True)
    metadata = fields.Dict(load_default=dict)
    dependencies = fields.List(fields.Str(), load_default=list)

class TaskUpdateSchema(Schema):
    status = fields.Str(validate=lambda x: x in ['pending', 'in_progress', 'completed', 'failed', 'cancelled'])
    progress = fields.Float(validate=lambda x: 0 <= x <= 100)
    assigned_to = fields.UUID(allow_none=True)
    priority = fields.Str(validate=lambda x: x in ['low', 'medium', 'high', 'urgent'])

class WorkflowCreateSchema(Schema):
    name = fields.Str(required=True, validate=lambda x: len(x.strip()) >= 3)
    description = fields.Str(required=True)
    trigger_type = fields.Str(required=True, validate=lambda x: x in ['manual', 'scheduled', 'event', 'condition'])
    trigger_conditions = fields.Dict(required=True)
    steps = fields.List(fields.Dict(), required=True)

class AutoApplySetupSchema(Schema):
    candidate_id = fields.UUID(required=True)
    job_criteria = fields.Dict(required=True)
    max_applications_per_day = fields.Int(load_default=5, validate=lambda x: 1 <= x <= 20)
    min_match_score = fields.Int(load_default=70, validate=lambda x: 50 <= x <= 100)
    preferred_locations = fields.List(fields.Str(), load_default=list)
    salary_range = fields.Dict(load_default=dict)

@workflows_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for workflow service"""
    try:
        return jsonify({
            'status': 'healthy',
            'service': 'workflows',
            'active_workflows': len(workflow_engine.workflows),
            'pending_tasks': len(task_manager.get_tasks_by_status(TaskStatus.PENDING)),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'service': 'workflows',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

# Task Management Endpoints
@workflows_bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    """Create a new task"""
    try:
        schema = TaskCreateSchema()
        data = schema.load(request.get_json())
        
        user_id = get_jwt_identity()
        
        # Convert priority string to enum
        priority = TaskPriority(data['priority'])
        
        task_id = task_manager.create_task(
            title=data['title'],
            description=data['description'],
            task_type=data['task_type'],
            assigned_to=str(data['assigned_to']) if data.get('assigned_to') else None,
            created_by=user_id,
            priority=priority,
            due_date=data.get('due_date'),
            metadata=data.get('metadata', {}),
            dependencies=data.get('dependencies', [])
        )
        
        task = task_manager.get_task(task_id)
        
        return jsonify({
            'success': True,
            'data': {
                'task_id': task_id,
                'task': {
                    'id': task.id,
                    'title': task.title,
                    'description': task.description,
                    'status': task.status.value,
                    'priority': task.priority.value,
                    'created_at': task.created_at.isoformat(),
                    'assigned_to': task.assigned_to,
                    'due_date': task.due_date.isoformat() if task.due_date else None
                }
            }
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Create task error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create task'
        }), 500

@workflows_bp.route('/tasks/<task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get task details"""
    try:
        task = task_manager.get_task(task_id)
        
        if not task:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'task_type': task.task_type,
                'status': task.status.value,
                'priority': task.priority.value,
                'assigned_to': task.assigned_to,
                'created_by': task.created_by,
                'created_at': task.created_at.isoformat(),
                'due_date': task.due_date.isoformat() if task.due_date else None,
                'completed_at': task.completed_at.isoformat() if task.completed_at else None,
                'progress': task.progress,
                'metadata': task.metadata,
                'dependencies': task.dependencies
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get task error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve task'
        }), 500

@workflows_bp.route('/tasks/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Update task"""
    try:
        schema = TaskUpdateSchema()
        data = schema.load(request.get_json())
        
        task = task_manager.get_task(task_id)
        if not task:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404
        
        # Update status if provided
        if 'status' in data:
            status = TaskStatus(data['status'])
            progress = data.get('progress')
            task_manager.update_task_status(task_id, status, progress)
        
        # Update other fields
        if 'assigned_to' in data:
            task.assigned_to = str(data['assigned_to']) if data['assigned_to'] else None
        
        if 'priority' in data:
            task.priority = TaskPriority(data['priority'])
        
        updated_task = task_manager.get_task(task_id)
        
        return jsonify({
            'success': True,
            'data': {
                'id': updated_task.id,
                'status': updated_task.status.value,
                'progress': updated_task.progress,
                'priority': updated_task.priority.value,
                'assigned_to': updated_task.assigned_to
            }
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Update task error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to update task'
        }), 500

@workflows_bp.route('/tasks/my-tasks', methods=['GET'])
@jwt_required()
def get_my_tasks():
    """Get tasks assigned to current user"""
    try:
        user_id = get_jwt_identity()
        tasks = task_manager.get_tasks_by_assignee(user_id)
        
        # Filter by status if provided
        status_filter = request.args.get('status')
        if status_filter:
            try:
                status_enum = TaskStatus(status_filter)
                tasks = [task for task in tasks if task.status == status_enum]
            except ValueError:
                pass
        
        task_list = []
        for task in tasks:
            task_list.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'task_type': task.task_type,
                'status': task.status.value,
                'priority': task.priority.value,
                'created_at': task.created_at.isoformat(),
                'due_date': task.due_date.isoformat() if task.due_date else None,
                'progress': task.progress
            })
        
        return jsonify({
            'success': True,
            'data': {
                'tasks': task_list,
                'total_count': len(task_list)
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get my tasks error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve tasks'
        }), 500

@workflows_bp.route('/tasks/overdue', methods=['GET'])
@jwt_required()
def get_overdue_tasks():
    """Get overdue tasks"""
    try:
        overdue_tasks = task_manager.get_overdue_tasks()
        
        task_list = []
        for task in overdue_tasks:
            task_list.append({
                'id': task.id,
                'title': task.title,
                'assigned_to': task.assigned_to,
                'due_date': task.due_date.isoformat(),
                'days_overdue': (datetime.now(timezone.utc) - task.due_date).days,
                'priority': task.priority.value,
                'status': task.status.value
            })
        
        return jsonify({
            'success': True,
            'data': {
                'overdue_tasks': task_list,
                'total_count': len(task_list)
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get overdue tasks error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve overdue tasks'
        }), 500

# Workflow Management Endpoints
@workflows_bp.route('/workflows', methods=['POST'])
@jwt_required()
def create_workflow():
    """Create a new workflow"""
    try:
        schema = WorkflowCreateSchema()
        data = schema.load(request.get_json())
        
        user_id = get_jwt_identity()
        
        # Convert step dictionaries to WorkflowStep objects
        steps = []
        for step_data in data['steps']:
            step = WorkflowStep(
                id=step_data['id'],
                name=step_data['name'],
                description=step_data['description'],
                step_type=step_data['step_type'],
                action=step_data['action'],
                conditions=step_data.get('conditions', {}),
                parameters=step_data.get('parameters', {}),
                next_steps=step_data.get('next_steps', []),
                failure_steps=step_data.get('failure_steps', [])
            )
            steps.append(step)
        
        workflow_id = workflow_engine.create_workflow(
            name=data['name'],
            description=data['description'],
            trigger_type=data['trigger_type'],
            trigger_conditions=data['trigger_conditions'],
            steps=steps,
            created_by=user_id
        )
        
        return jsonify({
            'success': True,
            'data': {
                'workflow_id': workflow_id,
                'name': data['name'],
                'status': 'active'
            }
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Create workflow error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create workflow'
        }), 500

@workflows_bp.route('/workflows/<workflow_id>/execute', methods=['POST'])
@jwt_required()
def execute_workflow(workflow_id):
    """Execute a workflow"""
    try:
        data = request.get_json() or {}
        context = data.get('context', {})
        
        # Add user context
        context['user_id'] = get_jwt_identity()
        context['execution_time'] = datetime.now(timezone.utc).isoformat()
        
        success = workflow_engine.execute_workflow(workflow_id, context)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Workflow execution started',
                'workflow_id': workflow_id
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to start workflow execution'
            }), 400
        
    except Exception as e:
        current_app.logger.error(f"Execute workflow error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to execute workflow'
        }), 500

@workflows_bp.route('/workflows', methods=['GET'])
@jwt_required()
def get_workflows():
    """Get user's workflows"""
    try:
        user_id = get_jwt_identity()
        
        user_workflows = []
        for workflow in workflow_engine.workflows.values():
            if workflow.created_by == user_id:
                user_workflows.append({
                    'id': workflow.id,
                    'name': workflow.name,
                    'description': workflow.description,
                    'trigger_type': workflow.trigger_type,
                    'status': workflow.status.value,
                    'created_at': workflow.created_at.isoformat(),
                    'last_executed': workflow.last_executed.isoformat() if workflow.last_executed else None,
                    'execution_count': workflow.execution_count,
                    'step_count': len(workflow.steps)
                })
        
        return jsonify({
            'success': True,
            'data': {
                'workflows': user_workflows,
                'total_count': len(user_workflows)
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get workflows error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve workflows'
        }), 500

# Auto-Apply Functionality
@workflows_bp.route('/auto-apply/setup', methods=['POST'])
@jwt_required()
def setup_auto_apply():
    """Set up auto-apply workflow for candidate"""
    try:
        schema = AutoApplySetupSchema()
        data = schema.load(request.get_json())
        
        user_id = get_jwt_identity()
        
        # Prepare auto-apply criteria
        criteria = {
            'job_criteria': data['job_criteria'],
            'max_applications_per_day': data['max_applications_per_day'],
            'min_match_score': data['min_match_score'],
            'preferred_locations': data.get('preferred_locations', []),
            'salary_range': data.get('salary_range', {})
        }
        
        # Set up auto-apply workflow
        workflow_id = auto_apply_service.setup_auto_apply_workflow(
            str(data['candidate_id']),
            criteria
        )
        
        return jsonify({
            'success': True,
            'data': {
                'workflow_id': workflow_id,
                'candidate_id': str(data['candidate_id']),
                'criteria': criteria,
                'status': 'active'
            }
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        current_app.logger.error(f"Setup auto-apply error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to set up auto-apply'
        }), 500

@workflows_bp.route('/auto-apply/analyze-compatibility', methods=['POST'])
@jwt_required()
def analyze_job_compatibility():
    """Analyze compatibility between candidate and job"""
    try:
        data = request.get_json()
        candidate_profile = data.get('candidate_profile', {})
        job_description = data.get('job_description', {})
        
        if not candidate_profile or not job_description:
            return jsonify({
                'success': False,
                'error': 'Both candidate_profile and job_description are required'
            }), 400
        
        analysis = auto_apply_service.analyze_job_compatibility(
            candidate_profile,
            job_description
        )
        
        return jsonify({
            'success': True,
            'data': analysis
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Analyze compatibility error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to analyze compatibility'
        }), 500

@workflows_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_workflow_dashboard_stats():
    """Get workflow and task statistics for dashboard"""
    try:
        user_id = get_jwt_identity()
        
        # Get task statistics
        user_tasks = task_manager.get_tasks_by_assignee(user_id)
        pending_tasks = len([t for t in user_tasks if t.status == TaskStatus.PENDING])
        in_progress_tasks = len([t for t in user_tasks if t.status == TaskStatus.IN_PROGRESS])
        completed_tasks = len([t for t in user_tasks if t.status == TaskStatus.COMPLETED])
        overdue_tasks = len(task_manager.get_overdue_tasks())
        
        # Get workflow statistics
        user_workflows = [w for w in workflow_engine.workflows.values() if w.created_by == user_id]
        active_workflows = len([w for w in user_workflows if w.status == WorkflowStatus.ACTIVE])
        
        return jsonify({
            'success': True,
            'data': {
                'tasks': {
                    'pending': pending_tasks,
                    'in_progress': in_progress_tasks,
                    'completed': completed_tasks,
                    'overdue': overdue_tasks,
                    'total': len(user_tasks)
                },
                'workflows': {
                    'active': active_workflows,
                    'total': len(user_workflows)
                },
                'recent_activity': {
                    'tasks_created_today': len([t for t in user_tasks if t.created_at.date() == datetime.now().date()]),
                    'workflows_executed_today': len([w for w in user_workflows if w.last_executed and w.last_executed.date() == datetime.now().date()])
                }
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get dashboard stats error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve dashboard statistics'
        }), 500

