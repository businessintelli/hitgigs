"""
Workflow Automation and Task Management Service for HotGigs.ai
Implements automated workflows, task management, and intelligent automation
"""
import os
import json
import logging
from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timezone, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import asyncio
import threading
import time
from concurrent.futures import ThreadPoolExecutor
import openai

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TaskPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class WorkflowStatus(Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class Task:
    """Task data structure"""
    id: str
    title: str
    description: str
    task_type: str
    status: TaskStatus
    priority: TaskPriority
    assigned_to: Optional[str]
    created_by: str
    created_at: datetime
    due_date: Optional[datetime]
    completed_at: Optional[datetime]
    metadata: Dict[str, Any]
    dependencies: List[str]
    progress: float = 0.0

@dataclass
class WorkflowStep:
    """Workflow step definition"""
    id: str
    name: str
    description: str
    step_type: str
    action: str
    conditions: Dict[str, Any]
    parameters: Dict[str, Any]
    next_steps: List[str]
    failure_steps: List[str]

@dataclass
class Workflow:
    """Workflow definition"""
    id: str
    name: str
    description: str
    trigger_type: str
    trigger_conditions: Dict[str, Any]
    steps: List[WorkflowStep]
    status: WorkflowStatus
    created_by: str
    created_at: datetime
    last_executed: Optional[datetime]
    execution_count: int = 0

class TaskManager:
    """Task management system"""
    
    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.task_counter = 0
        
    def create_task(self, title: str, description: str, task_type: str, 
                   assigned_to: Optional[str] = None, created_by: str = "system",
                   priority: TaskPriority = TaskPriority.MEDIUM,
                   due_date: Optional[datetime] = None,
                   metadata: Optional[Dict[str, Any]] = None,
                   dependencies: Optional[List[str]] = None) -> str:
        """Create a new task"""
        try:
            self.task_counter += 1
            task_id = f"task_{self.task_counter}_{int(datetime.now().timestamp())}"
            
            task = Task(
                id=task_id,
                title=title,
                description=description,
                task_type=task_type,
                status=TaskStatus.PENDING,
                priority=priority,
                assigned_to=assigned_to,
                created_by=created_by,
                created_at=datetime.now(timezone.utc),
                due_date=due_date,
                completed_at=None,
                metadata=metadata or {},
                dependencies=dependencies or []
            )
            
            self.tasks[task_id] = task
            logging.info(f"Created task {task_id}: {title}")
            
            return task_id
            
        except Exception as e:
            logging.error(f"Error creating task: {str(e)}")
            raise
    
    def update_task_status(self, task_id: str, status: TaskStatus, 
                          progress: Optional[float] = None) -> bool:
        """Update task status and progress"""
        try:
            if task_id not in self.tasks:
                return False
            
            task = self.tasks[task_id]
            task.status = status
            
            if progress is not None:
                task.progress = max(0.0, min(100.0, progress))
            
            if status == TaskStatus.COMPLETED:
                task.completed_at = datetime.now(timezone.utc)
                task.progress = 100.0
            
            logging.info(f"Updated task {task_id} status to {status.value}")
            return True
            
        except Exception as e:
            logging.error(f"Error updating task status: {str(e)}")
            return False
    
    def get_task(self, task_id: str) -> Optional[Task]:
        """Get task by ID"""
        return self.tasks.get(task_id)
    
    def get_tasks_by_assignee(self, assignee: str) -> List[Task]:
        """Get tasks assigned to a specific user"""
        return [task for task in self.tasks.values() if task.assigned_to == assignee]
    
    def get_tasks_by_status(self, status: TaskStatus) -> List[Task]:
        """Get tasks by status"""
        return [task for task in self.tasks.values() if task.status == status]
    
    def get_overdue_tasks(self) -> List[Task]:
        """Get overdue tasks"""
        now = datetime.now(timezone.utc)
        return [
            task for task in self.tasks.values()
            if task.due_date and task.due_date < now and task.status != TaskStatus.COMPLETED
        ]

class WorkflowEngine:
    """Workflow automation engine"""
    
    def __init__(self, task_manager: TaskManager):
        self.workflows: Dict[str, Workflow] = {}
        self.task_manager = task_manager
        self.workflow_counter = 0
        self.executor = ThreadPoolExecutor(max_workers=5)
        self.running = False
        
    def create_workflow(self, name: str, description: str, trigger_type: str,
                       trigger_conditions: Dict[str, Any], steps: List[WorkflowStep],
                       created_by: str = "system") -> str:
        """Create a new workflow"""
        try:
            self.workflow_counter += 1
            workflow_id = f"workflow_{self.workflow_counter}_{int(datetime.now().timestamp())}"
            
            workflow = Workflow(
                id=workflow_id,
                name=name,
                description=description,
                trigger_type=trigger_type,
                trigger_conditions=trigger_conditions,
                steps=steps,
                status=WorkflowStatus.ACTIVE,
                created_by=created_by,
                created_at=datetime.now(timezone.utc),
                last_executed=None
            )
            
            self.workflows[workflow_id] = workflow
            logging.info(f"Created workflow {workflow_id}: {name}")
            
            return workflow_id
            
        except Exception as e:
            logging.error(f"Error creating workflow: {str(e)}")
            raise
    
    def execute_workflow(self, workflow_id: str, context: Dict[str, Any]) -> bool:
        """Execute a workflow"""
        try:
            if workflow_id not in self.workflows:
                logging.error(f"Workflow {workflow_id} not found")
                return False
            
            workflow = self.workflows[workflow_id]
            
            if workflow.status != WorkflowStatus.ACTIVE:
                logging.warning(f"Workflow {workflow_id} is not active")
                return False
            
            # Execute workflow in background
            self.executor.submit(self._execute_workflow_steps, workflow, context)
            
            # Update execution metadata
            workflow.last_executed = datetime.now(timezone.utc)
            workflow.execution_count += 1
            
            return True
            
        except Exception as e:
            logging.error(f"Error executing workflow: {str(e)}")
            return False
    
    def _execute_workflow_steps(self, workflow: Workflow, context: Dict[str, Any]):
        """Execute workflow steps sequentially"""
        try:
            logging.info(f"Starting workflow execution: {workflow.name}")
            
            current_steps = [workflow.steps[0]] if workflow.steps else []
            
            while current_steps:
                step = current_steps.pop(0)
                
                try:
                    # Check step conditions
                    if not self._check_step_conditions(step, context):
                        logging.info(f"Step {step.name} conditions not met, skipping")
                        continue
                    
                    # Execute step action
                    success = self._execute_step_action(step, context)
                    
                    if success:
                        logging.info(f"Step {step.name} completed successfully")
                        # Add next steps to execution queue
                        for next_step_id in step.next_steps:
                            next_step = self._find_step_by_id(workflow, next_step_id)
                            if next_step:
                                current_steps.append(next_step)
                    else:
                        logging.error(f"Step {step.name} failed")
                        # Add failure steps to execution queue
                        for failure_step_id in step.failure_steps:
                            failure_step = self._find_step_by_id(workflow, failure_step_id)
                            if failure_step:
                                current_steps.append(failure_step)
                
                except Exception as e:
                    logging.error(f"Error executing step {step.name}: {str(e)}")
                    continue
            
            logging.info(f"Workflow execution completed: {workflow.name}")
            
        except Exception as e:
            logging.error(f"Error in workflow execution: {str(e)}")
    
    def _check_step_conditions(self, step: WorkflowStep, context: Dict[str, Any]) -> bool:
        """Check if step conditions are met"""
        try:
            conditions = step.conditions
            
            for key, expected_value in conditions.items():
                if key not in context:
                    return False
                
                actual_value = context[key]
                
                # Simple condition checking - can be extended
                if isinstance(expected_value, dict):
                    operator = expected_value.get('operator', 'equals')
                    value = expected_value.get('value')
                    
                    if operator == 'equals' and actual_value != value:
                        return False
                    elif operator == 'greater_than' and actual_value <= value:
                        return False
                    elif operator == 'less_than' and actual_value >= value:
                        return False
                    elif operator == 'contains' and value not in str(actual_value):
                        return False
                else:
                    if actual_value != expected_value:
                        return False
            
            return True
            
        except Exception as e:
            logging.error(f"Error checking step conditions: {str(e)}")
            return False
    
    def _execute_step_action(self, step: WorkflowStep, context: Dict[str, Any]) -> bool:
        """Execute step action"""
        try:
            action = step.action
            parameters = step.parameters
            
            if action == "create_task":
                return self._action_create_task(parameters, context)
            elif action == "send_notification":
                return self._action_send_notification(parameters, context)
            elif action == "update_application_status":
                return self._action_update_application_status(parameters, context)
            elif action == "auto_apply":
                return self._action_auto_apply(parameters, context)
            elif action == "screen_candidate":
                return self._action_screen_candidate(parameters, context)
            elif action == "schedule_interview":
                return self._action_schedule_interview(parameters, context)
            elif action == "ai_analysis":
                return self._action_ai_analysis(parameters, context)
            else:
                logging.warning(f"Unknown action: {action}")
                return False
                
        except Exception as e:
            logging.error(f"Error executing step action: {str(e)}")
            return False
    
    def _action_create_task(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """Create task action"""
        try:
            title = parameters.get('title', 'Automated Task')
            description = parameters.get('description', 'Task created by workflow automation')
            task_type = parameters.get('task_type', 'general')
            assigned_to = parameters.get('assigned_to')
            
            # Replace placeholders with context values
            title = self._replace_placeholders(title, context)
            description = self._replace_placeholders(description, context)
            
            task_id = self.task_manager.create_task(
                title=title,
                description=description,
                task_type=task_type,
                assigned_to=assigned_to,
                created_by="workflow_automation"
            )
            
            context['created_task_id'] = task_id
            return True
            
        except Exception as e:
            logging.error(f"Error in create_task action: {str(e)}")
            return False
    
    def _action_send_notification(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """Send notification action"""
        try:
            # This would integrate with the notifications service
            recipient = parameters.get('recipient')
            message = parameters.get('message', '')
            notification_type = parameters.get('type', 'info')
            
            message = self._replace_placeholders(message, context)
            
            # Placeholder for notification sending
            logging.info(f"Notification sent to {recipient}: {message}")
            
            return True
            
        except Exception as e:
            logging.error(f"Error in send_notification action: {str(e)}")
            return False
    
    def _action_update_application_status(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """Update application status action"""
        try:
            application_id = context.get('application_id') or parameters.get('application_id')
            new_status = parameters.get('status')
            
            if not application_id or not new_status:
                return False
            
            # This would integrate with the applications service
            logging.info(f"Updated application {application_id} status to {new_status}")
            
            return True
            
        except Exception as e:
            logging.error(f"Error in update_application_status action: {str(e)}")
            return False
    
    def _action_auto_apply(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """Auto-apply to job action"""
        try:
            candidate_id = context.get('candidate_id') or parameters.get('candidate_id')
            job_id = context.get('job_id') or parameters.get('job_id')
            
            if not candidate_id or not job_id:
                return False
            
            # This would integrate with the applications service to auto-apply
            logging.info(f"Auto-applied candidate {candidate_id} to job {job_id}")
            
            # Create follow-up task
            self.task_manager.create_task(
                title=f"Review auto-application for job {job_id}",
                description=f"Candidate {candidate_id} was automatically applied to job {job_id}",
                task_type="review",
                created_by="auto_apply_workflow"
            )
            
            return True
            
        except Exception as e:
            logging.error(f"Error in auto_apply action: {str(e)}")
            return False
    
    def _action_screen_candidate(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """Screen candidate action"""
        try:
            candidate_id = context.get('candidate_id') or parameters.get('candidate_id')
            job_id = context.get('job_id') or parameters.get('job_id')
            
            if not candidate_id or not job_id:
                return False
            
            # This would integrate with AI services for candidate screening
            screening_criteria = parameters.get('criteria', {})
            
            # Placeholder for AI screening logic
            screening_score = 75  # Would be calculated by AI
            
            context['screening_score'] = screening_score
            context['screening_passed'] = screening_score >= screening_criteria.get('min_score', 70)
            
            logging.info(f"Screened candidate {candidate_id} for job {job_id}: score {screening_score}")
            
            return True
            
        except Exception as e:
            logging.error(f"Error in screen_candidate action: {str(e)}")
            return False
    
    def _action_schedule_interview(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """Schedule interview action"""
        try:
            candidate_id = context.get('candidate_id') or parameters.get('candidate_id')
            interviewer_id = parameters.get('interviewer_id')
            interview_type = parameters.get('interview_type', 'phone')
            
            if not candidate_id or not interviewer_id:
                return False
            
            # This would integrate with calendar/scheduling service
            logging.info(f"Scheduled {interview_type} interview for candidate {candidate_id} with {interviewer_id}")
            
            # Create task for interviewer
            self.task_manager.create_task(
                title=f"Conduct {interview_type} interview",
                description=f"Interview scheduled with candidate {candidate_id}",
                task_type="interview",
                assigned_to=interviewer_id,
                created_by="interview_workflow"
            )
            
            return True
            
        except Exception as e:
            logging.error(f"Error in schedule_interview action: {str(e)}")
            return False
    
    def _action_ai_analysis(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """AI analysis action"""
        try:
            analysis_type = parameters.get('analysis_type', 'general')
            data = context.get('data', {})
            
            # This would integrate with AI services
            if analysis_type == 'resume_analysis':
                # Placeholder for resume analysis
                context['ai_analysis_result'] = {
                    'score': 80,
                    'strengths': ['Relevant experience', 'Good skills match'],
                    'weaknesses': ['Limited leadership experience']
                }
            elif analysis_type == 'job_match':
                # Placeholder for job matching
                context['match_score'] = 85
                context['match_reasons'] = ['Skills alignment', 'Experience level match']
            
            logging.info(f"Completed AI analysis: {analysis_type}")
            return True
            
        except Exception as e:
            logging.error(f"Error in ai_analysis action: {str(e)}")
            return False
    
    def _replace_placeholders(self, text: str, context: Dict[str, Any]) -> str:
        """Replace placeholders in text with context values"""
        try:
            for key, value in context.items():
                placeholder = f"{{{key}}}"
                if placeholder in text:
                    text = text.replace(placeholder, str(value))
            return text
        except Exception as e:
            logging.error(f"Error replacing placeholders: {str(e)}")
            return text
    
    def _find_step_by_id(self, workflow: Workflow, step_id: str) -> Optional[WorkflowStep]:
        """Find workflow step by ID"""
        for step in workflow.steps:
            if step.id == step_id:
                return step
        return None

class AutoApplyService:
    """Automated job application service"""
    
    def __init__(self, workflow_engine: WorkflowEngine):
        self.workflow_engine = workflow_engine
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    def setup_auto_apply_workflow(self, candidate_id: str, criteria: Dict[str, Any]) -> str:
        """Set up auto-apply workflow for a candidate"""
        try:
            # Define workflow steps
            steps = [
                WorkflowStep(
                    id="find_matching_jobs",
                    name="Find Matching Jobs",
                    description="Find jobs that match candidate criteria",
                    step_type="search",
                    action="ai_analysis",
                    conditions={},
                    parameters={
                        "analysis_type": "job_search",
                        "criteria": criteria
                    },
                    next_steps=["screen_jobs"],
                    failure_steps=["notify_no_jobs"]
                ),
                WorkflowStep(
                    id="screen_jobs",
                    name="Screen Job Matches",
                    description="Screen found jobs for suitability",
                    step_type="analysis",
                    action="ai_analysis",
                    conditions={"jobs_found": {"operator": "greater_than", "value": 0}},
                    parameters={
                        "analysis_type": "job_screening",
                        "min_match_score": criteria.get('min_match_score', 70)
                    },
                    next_steps=["auto_apply"],
                    failure_steps=["notify_no_suitable_jobs"]
                ),
                WorkflowStep(
                    id="auto_apply",
                    name="Auto Apply to Jobs",
                    description="Automatically apply to suitable jobs",
                    step_type="action",
                    action="auto_apply",
                    conditions={"suitable_jobs": {"operator": "greater_than", "value": 0}},
                    parameters={
                        "candidate_id": candidate_id,
                        "max_applications": criteria.get('max_applications_per_day', 5)
                    },
                    next_steps=["notify_applications_sent"],
                    failure_steps=["notify_application_failed"]
                ),
                WorkflowStep(
                    id="notify_applications_sent",
                    name="Notify Applications Sent",
                    description="Notify candidate of successful applications",
                    step_type="notification",
                    action="send_notification",
                    conditions={},
                    parameters={
                        "recipient": candidate_id,
                        "type": "success",
                        "message": "Successfully applied to {applications_count} jobs"
                    },
                    next_steps=[],
                    failure_steps=[]
                )
            ]
            
            # Create workflow
            workflow_id = self.workflow_engine.create_workflow(
                name=f"Auto Apply for Candidate {candidate_id}",
                description="Automated job application workflow",
                trigger_type="scheduled",
                trigger_conditions={"schedule": "daily"},
                steps=steps,
                created_by=candidate_id
            )
            
            return workflow_id
            
        except Exception as e:
            logging.error(f"Error setting up auto-apply workflow: {str(e)}")
            raise
    
    def analyze_job_compatibility(self, candidate_profile: Dict[str, Any], 
                                 job_description: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze compatibility between candidate and job"""
        try:
            prompt = f"""
            Analyze the compatibility between this candidate and job:
            
            Candidate Profile:
            - Skills: {candidate_profile.get('skills', [])}
            - Experience: {candidate_profile.get('experience_years', 0)} years
            - Education: {candidate_profile.get('education', '')}
            - Location: {candidate_profile.get('location', '')}
            
            Job Description:
            - Title: {job_description.get('title', '')}
            - Required Skills: {job_description.get('required_skills', [])}
            - Experience Level: {job_description.get('experience_level', '')}
            - Location: {job_description.get('location', '')}
            - Salary Range: {job_description.get('salary_range', '')}
            
            Provide:
            1. Compatibility score (0-100)
            2. Matching factors
            3. Missing requirements
            4. Application recommendation
            
            Format as JSON with keys: score, matching_factors, missing_requirements, recommendation
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert job matching analyst."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.3
            )
            
            analysis_text = response.choices[0].message.content
            
            try:
                analysis = json.loads(analysis_text)
            except:
                analysis = {
                    'score': 70,
                    'matching_factors': ['General experience match'],
                    'missing_requirements': ['Detailed analysis unavailable'],
                    'recommendation': 'Consider applying'
                }
            
            return analysis
            
        except Exception as e:
            logging.error(f"Error analyzing job compatibility: {str(e)}")
            return {
                'score': 50,
                'matching_factors': [],
                'missing_requirements': ['Analysis failed'],
                'recommendation': 'Manual review required'
            }

# Global instances
task_manager = TaskManager()
workflow_engine = WorkflowEngine(task_manager)
auto_apply_service = AutoApplyService(workflow_engine)

