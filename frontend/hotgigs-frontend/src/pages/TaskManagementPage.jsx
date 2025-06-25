import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Flag, 
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  MessageSquare,
  Paperclip,
  Bell,
  Target,
  TrendingUp,
  BarChart3,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

const TaskManagementPage = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedAssignee, setSelectedAssignee] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('list') // list, board, calendar, timeline
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [expandedTasks, setExpandedTasks] = useState(new Set())

  // Sample data
  useEffect(() => {
    loadProjects()
    loadTasks()
  }, [])

  const loadProjects = () => {
    const sampleProjects = [
      {
        id: 1,
        name: 'Q1 Hiring Campaign',
        description: 'Recruit 50 software engineers for Q1',
        status: 'active',
        progress: 65,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        tasksCount: 24,
        completedTasks: 16
      },
      {
        id: 2,
        name: 'Resume Database Migration',
        description: 'Migrate legacy resume database to new system',
        status: 'active',
        progress: 80,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        teamMembers: ['Alice Brown', 'Bob Wilson'],
        tasksCount: 12,
        completedTasks: 10
      },
      {
        id: 3,
        name: 'AI Model Training',
        description: 'Train new AI models for resume analysis',
        status: 'planning',
        progress: 25,
        startDate: '2024-02-01',
        endDate: '2024-04-30',
        teamMembers: ['Dr. Sarah Lee', 'Tom Chen'],
        tasksCount: 18,
        completedTasks: 4
      }
    ]
    setProjects(sampleProjects)
  }

  const loadTasks = () => {
    const sampleTasks = [
      {
        id: 1,
        title: 'Review candidate applications for Senior Developer role',
        description: 'Screen and shortlist candidates for the senior developer position',
        status: 'in-progress',
        priority: 'high',
        assignee: 'John Doe',
        assigneeAvatar: '/api/placeholder/32/32',
        projectId: 1,
        projectName: 'Q1 Hiring Campaign',
        dueDate: '2024-01-20',
        createdDate: '2024-01-15',
        estimatedHours: 8,
        actualHours: 5,
        tags: ['recruitment', 'screening'],
        attachments: 2,
        comments: 3,
        subtasks: [
          { id: 11, title: 'Review resumes', completed: true },
          { id: 12, title: 'Conduct phone screens', completed: true },
          { id: 13, title: 'Schedule technical interviews', completed: false }
        ],
        dependencies: [],
        watchers: ['Jane Smith', 'HR Manager']
      },
      {
        id: 2,
        title: 'Update job posting templates',
        description: 'Refresh job posting templates with new company branding',
        status: 'todo',
        priority: 'medium',
        assignee: 'Jane Smith',
        assigneeAvatar: '/api/placeholder/32/32',
        projectId: 1,
        projectName: 'Q1 Hiring Campaign',
        dueDate: '2024-01-25',
        createdDate: '2024-01-16',
        estimatedHours: 4,
        actualHours: 0,
        tags: ['templates', 'branding'],
        attachments: 1,
        comments: 1,
        subtasks: [
          { id: 21, title: 'Review current templates', completed: false },
          { id: 22, title: 'Apply new branding', completed: false },
          { id: 23, title: 'Test templates', completed: false }
        ],
        dependencies: [],
        watchers: ['Marketing Team']
      },
      {
        id: 3,
        title: 'Migrate candidate data from old system',
        description: 'Transfer all candidate profiles and resumes to new database',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Alice Brown',
        assigneeAvatar: '/api/placeholder/32/32',
        projectId: 2,
        projectName: 'Resume Database Migration',
        dueDate: '2024-01-30',
        createdDate: '2024-01-10',
        estimatedHours: 16,
        actualHours: 12,
        tags: ['migration', 'database'],
        attachments: 0,
        comments: 5,
        subtasks: [
          { id: 31, title: 'Export data from old system', completed: true },
          { id: 32, title: 'Clean and validate data', completed: true },
          { id: 33, title: 'Import to new system', completed: false },
          { id: 34, title: 'Verify data integrity', completed: false }
        ],
        dependencies: [],
        watchers: ['Bob Wilson', 'Tech Lead']
      },
      {
        id: 4,
        title: 'Train AI model on new resume dataset',
        description: 'Use the latest resume dataset to improve AI matching accuracy',
        status: 'todo',
        priority: 'medium',
        assignee: 'Dr. Sarah Lee',
        assigneeAvatar: '/api/placeholder/32/32',
        projectId: 3,
        projectName: 'AI Model Training',
        dueDate: '2024-02-15',
        createdDate: '2024-01-18',
        estimatedHours: 24,
        actualHours: 0,
        tags: ['ai', 'machine-learning'],
        attachments: 3,
        comments: 2,
        subtasks: [
          { id: 41, title: 'Prepare training dataset', completed: false },
          { id: 42, title: 'Configure training parameters', completed: false },
          { id: 43, title: 'Run training process', completed: false },
          { id: 44, title: 'Evaluate model performance', completed: false }
        ],
        dependencies: [3],
        watchers: ['Tom Chen', 'AI Team']
      },
      {
        id: 5,
        title: 'Conduct user acceptance testing',
        description: 'Test new features with beta users and collect feedback',
        status: 'completed',
        priority: 'high',
        assignee: 'Mike Johnson',
        assigneeAvatar: '/api/placeholder/32/32',
        projectId: 2,
        projectName: 'Resume Database Migration',
        dueDate: '2024-01-18',
        createdDate: '2024-01-12',
        estimatedHours: 12,
        actualHours: 14,
        tags: ['testing', 'uat'],
        attachments: 1,
        comments: 8,
        subtasks: [
          { id: 51, title: 'Recruit beta testers', completed: true },
          { id: 52, title: 'Prepare test scenarios', completed: true },
          { id: 53, title: 'Conduct testing sessions', completed: true },
          { id: 54, title: 'Compile feedback report', completed: true }
        ],
        dependencies: [],
        watchers: ['Product Manager', 'QA Team']
      }
    ]
    setTasks(sampleTasks)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      case 'urgent': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low': return <Flag size={14} className="text-green-600" />
      case 'medium': return <Flag size={14} className="text-yellow-600" />
      case 'high': return <Flag size={14} className="text-red-600" />
      case 'urgent': return <Flag size={14} className="text-purple-600" />
      default: return <Flag size={14} className="text-gray-600" />
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo': return <Circle size={16} className="text-gray-500" />
      case 'in-progress': return <Clock size={16} className="text-blue-500" />
      case 'completed': return <CheckCircle size={16} className="text-green-500" />
      case 'blocked': return <AlertCircle size={16} className="text-red-500" />
      default: return <Circle size={16} className="text-gray-500" />
    }
  }

  const toggleTaskExpansion = (taskId) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.projectId.toString() === selectedProject
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    const matchesAssignee = selectedAssignee === 'all' || task.assignee === selectedAssignee
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesProject && matchesStatus && matchesPriority && matchesAssignee && matchesSearch
  })

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    
    return { total, completed, inProgress, overdue }
  }

  const stats = getTaskStats()

  return (
    <div className="task-management-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Target size={32} />
            </div>
            <div>
              <h1>Task Management</h1>
              <p>Organize, assign, and track tasks across all your projects</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn secondary"
              onClick={() => setShowCreateProject(true)}
            >
              <Plus size={16} />
              New Project
            </button>
            <button 
              className="btn primary"
              onClick={() => setShowCreateTask(true)}
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <AlertCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.overdue}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Projects Overview */}
        <div className="projects-section">
          <h2>Active Projects</h2>
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-progress">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="project-stats">
                  <div className="project-stat">
                    <Target size={16} />
                    <span>{project.completedTasks}/{project.tasksCount} tasks</span>
                  </div>
                  <div className="project-stat">
                    <Users size={16} />
                    <span>{project.teamMembers.length} members</span>
                  </div>
                  <div className="project-stat">
                    <Calendar size={16} />
                    <span>Due {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="controls-section">
          <div className="filters-row">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filters">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id.toString()}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="view-modes">
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`view-btn ${viewMode === 'board' ? 'active' : ''}`}
                onClick={() => setViewMode('board')}
              >
                Board
              </button>
              <button 
                className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-section">
          <div className="tasks-header">
            <h2>Tasks ({filteredTasks.length})</h2>
          </div>

          <div className="tasks-list">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-main">
                  <div className="task-left">
                    <button 
                      className="expand-btn"
                      onClick={() => toggleTaskExpansion(task.id)}
                    >
                      {expandedTasks.has(task.id) ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                    </button>
                    {getStatusIcon(task.status)}
                    <div className="task-content">
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                      <div className="task-meta">
                        <span className="project-name">{task.projectName}</span>
                        <div className="task-tags">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="task-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="task-right">
                    <div className="task-info">
                      <div className="task-assignee">
                        <div className="assignee-avatar">
                          <User size={16} />
                        </div>
                        <span>{task.assignee}</span>
                      </div>
                      
                      <div className="task-priority">
                        {getPriorityIcon(task.priority)}
                        <span className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </span>
                      </div>

                      <div className="task-due-date">
                        <Calendar size={14} />
                        <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600' : ''}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>

                      <span className={`status-badge ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="task-actions">
                      <div className="task-indicators">
                        {task.attachments > 0 && (
                          <div className="indicator">
                            <Paperclip size={14} />
                            <span>{task.attachments}</span>
                          </div>
                        )}
                        {task.comments > 0 && (
                          <div className="indicator">
                            <MessageSquare size={14} />
                            <span>{task.comments}</span>
                          </div>
                        )}
                        {task.subtasks.length > 0 && (
                          <div className="indicator">
                            <CheckCircle size={14} />
                            <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                          </div>
                        )}
                      </div>

                      <button className="action-btn">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Task Details */}
                {expandedTasks.has(task.id) && (
                  <div className="task-details">
                    <div className="details-grid">
                      <div className="details-section">
                        <h4>Subtasks</h4>
                        <div className="subtasks-list">
                          {task.subtasks.map(subtask => (
                            <div key={subtask.id} className="subtask-item">
                              {subtask.completed ? 
                                <CheckCircle size={16} className="text-green-500" /> :
                                <Circle size={16} className="text-gray-400" />
                              }
                              <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="details-section">
                        <h4>Time Tracking</h4>
                        <div className="time-info">
                          <div className="time-item">
                            <span>Estimated:</span>
                            <span>{task.estimatedHours}h</span>
                          </div>
                          <div className="time-item">
                            <span>Actual:</span>
                            <span>{task.actualHours}h</span>
                          </div>
                          <div className="time-item">
                            <span>Remaining:</span>
                            <span>{Math.max(0, task.estimatedHours - task.actualHours)}h</span>
                          </div>
                        </div>
                      </div>

                      <div className="details-section">
                        <h4>Watchers</h4>
                        <div className="watchers-list">
                          {task.watchers.map((watcher, index) => (
                            <div key={index} className="watcher-item">
                              <User size={14} />
                              <span>{watcher}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="task-actions-expanded">
                      <button className="btn secondary">
                        <Edit size={14} />
                        Edit Task
                      </button>
                      <button className="btn secondary">
                        <MessageSquare size={14} />
                        Add Comment
                      </button>
                      <button className="btn secondary">
                        <Bell size={14} />
                        Set Reminder
                      </button>
                      <button className="btn danger">
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .task-management-page {
          padding: 0;
        }

        .page-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 24px;
          margin-bottom: 24px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .header-info h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .header-info p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          border: none;
        }

        .btn.primary {
          background: #8b5cf6;
          color: white;
        }

        .btn.primary:hover {
          background: #7c3aed;
        }

        .btn.secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .btn.secondary:hover {
          background: #f8fafc;
        }

        .btn.danger {
          background: transparent;
          color: #ef4444;
          border: 1px solid #fecaca;
        }

        .btn.danger:hover {
          background: #fef2f2;
        }

        .stats-section {
          padding: 0 24px 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .page-content {
          padding: 0 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .projects-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .projects-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 20px 0;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .project-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .project-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .project-description {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .project-progress {
          margin-bottom: 16px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          color: #374151;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #8b5cf6;
          transition: width 0.3s ease;
        }

        .project-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .project-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #64748b;
        }

        .controls-section {
          background: white;
          border-radius: 12px;
          padding: 20px 24px;
          border: 1px solid #e2e8f0;
        }

        .filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 300px;
        }

        .search-box svg {
          position: absolute;
          left: 12px;
          color: #64748b;
        }

        .search-box input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .filters {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .view-modes {
          display: flex;
          background: #f1f5f9;
          border-radius: 6px;
          padding: 2px;
        }

        .view-btn {
          padding: 6px 12px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .view-btn.active {
          background: white;
          color: #8b5cf6;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .tasks-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .tasks-header {
          margin-bottom: 20px;
        }

        .tasks-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .task-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .task-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
        }

        .task-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .expand-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .expand-btn:hover {
          background: #e2e8f0;
        }

        .task-content {
          flex: 1;
        }

        .task-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .task-description {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .project-name {
          font-size: 12px;
          color: #8b5cf6;
          font-weight: 500;
        }

        .task-tags {
          display: flex;
          gap: 6px;
        }

        .task-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;
        }

        .task-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .task-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #374151;
        }

        .assignee-avatar {
          width: 24px;
          height: 24px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .task-priority {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .task-due-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #64748b;
        }

        .task-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .task-indicators {
          display: flex;
          gap: 8px;
        }

        .indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #64748b;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #e2e8f0;
          color: #374151;
        }

        .task-details {
          border-top: 1px solid #e2e8f0;
          padding: 20px;
          background: white;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 20px;
        }

        .details-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 12px 0;
        }

        .subtasks-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .subtask-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
        }

        .time-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .time-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #374151;
        }

        .watchers-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .watcher-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #374151;
        }

        .task-actions-expanded {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .text-red-600 {
          color: #dc2626;
        }

        .text-gray-400 {
          color: #9ca3af;
        }

        .text-gray-500 {
          color: #6b7280;
        }

        .text-green-500 {
          color: #10b981;
        }

        .line-through {
          text-decoration: line-through;
        }

        @media (max-width: 1200px) {
          .filters-row {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .search-box {
            max-width: none;
          }

          .filters {
            justify-content: space-between;
          }

          .view-modes {
            align-self: center;
          }
        }

        @media (max-width: 768px) {
          .page-content {
            padding: 0 16px 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .task-main {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .task-right {
            width: 100%;
            justify-content: space-between;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .task-actions-expanded {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default TaskManagementPage

