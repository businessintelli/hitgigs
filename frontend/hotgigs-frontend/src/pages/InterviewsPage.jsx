import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  User, 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Send, 
  Download, 
  Upload, 
  Filter, 
  Search, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight, 
  Star, 
  MessageSquare, 
  Link, 
  Copy, 
  ExternalLink,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share,
  Settings,
  Bell,
  BellOff
} from 'lucide-react'

const InterviewsPage = () => {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [filteredInterviews, setFilteredInterviews] = useState([])
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'

  useEffect(() => {
    loadInterviews()
  }, [])

  useEffect(() => {
    filterInterviews()
  }, [interviews, filterStatus, filterType, searchQuery])

  const loadInterviews = async () => {
    setIsLoading(true)
    try {
      // Simulate loading interviews from API
      const sampleInterviews = [
        {
          id: 1,
          jobTitle: 'Senior React Developer',
          company: 'TechCorp Inc.',
          companyLogo: '/api/placeholder/40/40',
          candidateName: user?.user_type === 'candidate' ? null : 'John Smith',
          candidateEmail: user?.user_type === 'candidate' ? null : 'john.smith@email.com',
          interviewerName: user?.user_type === 'candidate' ? 'Sarah Johnson' : null,
          interviewerTitle: user?.user_type === 'candidate' ? 'Senior Engineering Manager' : null,
          date: new Date('2024-01-25T14:00:00'),
          duration: 60,
          type: 'video',
          status: 'scheduled',
          round: 'Technical Interview',
          location: 'Google Meet',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          notes: 'Focus on React, TypeScript, and system design. Prepare coding challenges.',
          attachments: ['job_description.pdf', 'candidate_resume.pdf'],
          reminders: ['1 day before', '1 hour before'],
          feedback: null,
          rating: null
        },
        {
          id: 2,
          jobTitle: 'Frontend Lead',
          company: 'StartupXYZ',
          companyLogo: '/api/placeholder/40/40',
          candidateName: user?.user_type === 'candidate' ? null : 'Emily Davis',
          candidateEmail: user?.user_type === 'candidate' ? null : 'emily.davis@email.com',
          interviewerName: user?.user_type === 'candidate' ? 'Mike Chen' : null,
          interviewerTitle: user?.user_type === 'candidate' ? 'CTO' : null,
          date: new Date('2024-01-26T10:30:00'),
          duration: 45,
          type: 'phone',
          status: 'completed',
          round: 'Initial Screening',
          location: 'Phone Call',
          meetingLink: null,
          notes: 'Cultural fit assessment and role overview.',
          attachments: ['company_overview.pdf'],
          reminders: [],
          feedback: 'Great communication skills and enthusiasm. Strong technical background.',
          rating: 4.5
        },
        {
          id: 3,
          jobTitle: 'Full Stack Engineer',
          company: 'InnovateLabs',
          companyLogo: '/api/placeholder/40/40',
          candidateName: user?.user_type === 'candidate' ? null : 'Alex Rodriguez',
          candidateEmail: user?.user_type === 'candidate' ? null : 'alex.rodriguez@email.com',
          interviewerName: user?.user_type === 'candidate' ? 'Lisa Wang' : null,
          interviewerTitle: user?.user_type === 'candidate' ? 'Head of Engineering' : null,
          date: new Date('2024-01-24T16:00:00'),
          duration: 90,
          type: 'in-person',
          status: 'cancelled',
          round: 'Final Interview',
          location: '123 Tech Street, San Francisco, CA',
          meetingLink: null,
          notes: 'Cancelled due to candidate accepting another offer.',
          attachments: [],
          reminders: [],
          feedback: null,
          rating: null
        },
        {
          id: 4,
          jobTitle: 'UI/UX Designer',
          company: 'DesignStudio',
          companyLogo: '/api/placeholder/40/40',
          candidateName: user?.user_type === 'candidate' ? null : 'Maria Garcia',
          candidateEmail: user?.user_type === 'candidate' ? null : 'maria.garcia@email.com',
          interviewerName: user?.user_type === 'candidate' ? 'David Kim' : null,
          interviewerTitle: user?.user_type === 'candidate' ? 'Design Director' : null,
          date: new Date('2024-01-27T13:00:00'),
          duration: 75,
          type: 'video',
          status: 'scheduled',
          round: 'Portfolio Review',
          location: 'Zoom',
          meetingLink: 'https://zoom.us/j/123456789',
          notes: 'Portfolio presentation and design process discussion.',
          attachments: ['design_brief.pdf', 'portfolio_guidelines.pdf'],
          reminders: ['2 hours before'],
          feedback: null,
          rating: null
        }
      ]

      setInterviews(sampleInterviews)
    } catch (error) {
      console.error('Failed to load interviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterInterviews = () => {
    let filtered = interviews

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(interview => interview.status === filterStatus)
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(interview => interview.type === filterType)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(interview => 
        interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (interview.candidateName && interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (interview.interviewerName && interview.interviewerName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date))

    setFilteredInterviews(filtered)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'blue'
      case 'completed': return 'green'
      case 'cancelled': return 'red'
      case 'rescheduled': return 'orange'
      default: return 'gray'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={16} />
      case 'phone': return <Phone size={16} />
      case 'in-person': return <MapPin size={16} />
      default: return <Calendar size={16} />
    }
  }

  const formatDateTime = (date) => {
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  const getTimeUntil = (date) => {
    const now = new Date()
    const diff = date - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (diff < 0) return 'Past'
    if (days > 0) return `In ${days} day${days !== 1 ? 's' : ''}`
    if (hours > 0) return `In ${hours} hour${hours !== 1 ? 's' : ''}`
    if (minutes > 0) return `In ${minutes} minute${minutes !== 1 ? 's' : ''}`
    return 'Now'
  }

  const joinMeeting = (interview) => {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, '_blank')
    }
  }

  const copyMeetingLink = (link) => {
    navigator.clipboard.writeText(link)
    alert('Meeting link copied to clipboard!')
  }

  const rescheduleInterview = (interviewId) => {
    // Implement reschedule logic
    alert('Reschedule functionality would be implemented here')
  }

  const cancelInterview = (interviewId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this interview?')
    if (confirmed) {
      setInterviews(prev => 
        prev.map(interview => 
          interview.id === interviewId 
            ? { ...interview, status: 'cancelled' }
            : interview
        )
      )
    }
  }

  const submitFeedback = (interviewId, feedback, rating) => {
    setInterviews(prev => 
      prev.map(interview => 
        interview.id === interviewId 
          ? { ...interview, feedback, rating, status: 'completed' }
          : interview
      )
    )
    setSelectedInterview(null)
  }

  const upcomingInterviews = filteredInterviews.filter(interview => 
    interview.status === 'scheduled' && new Date(interview.date) > new Date()
  )

  const todayInterviews = filteredInterviews.filter(interview => {
    const today = new Date()
    const interviewDate = new Date(interview.date)
    return interviewDate.toDateString() === today.toDateString()
  })

  return (
    <div className="interviews-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Calendar size={32} />
            </div>
            <div>
              <h1>Interviews</h1>
              <p>Manage your interview schedule and track progress</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </button>
            </div>
            {user?.user_type !== 'candidate' && (
              <button 
                className="btn primary"
                onClick={() => setShowScheduleModal(true)}
              >
                <Plus size={16} />
                Schedule Interview
              </button>
            )}
            <button 
              className="btn secondary"
              onClick={loadInterviews}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{upcomingInterviews.length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{todayInterviews.length}</div>
              <div className="stat-label">Today</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {interviews.filter(i => i.status === 'completed').length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <Video size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {interviews.filter(i => i.type === 'video').length}
              </div>
              <div className="stat-label">Video Calls</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="in-person">In Person</option>
            </select>
          </div>
        </div>

        {/* Today's Interviews */}
        {todayInterviews.length > 0 && (
          <div className="today-section">
            <h2>Today's Interviews</h2>
            <div className="today-interviews">
              {todayInterviews.map(interview => (
                <div key={interview.id} className="today-interview-card">
                  <div className="interview-time">
                    <div className="time">{formatDateTime(interview.date).time}</div>
                    <div className="duration">{interview.duration}min</div>
                  </div>
                  <div className="interview-details">
                    <h4>{interview.jobTitle}</h4>
                    <p>{interview.company}</p>
                    <div className="interview-meta">
                      {getTypeIcon(interview.type)}
                      <span>{interview.round}</span>
                    </div>
                  </div>
                  <div className="interview-actions">
                    {interview.meetingLink && (
                      <button 
                        className="btn primary small"
                        onClick={() => joinMeeting(interview)}
                      >
                        <ExternalLink size={14} />
                        Join
                      </button>
                    )}
                    <button 
                      className="btn secondary small"
                      onClick={() => setSelectedInterview(interview)}
                    >
                      <Eye size={14} />
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviews List */}
        <div className="interviews-section">
          <div className="section-header">
            <h2>All Interviews</h2>
            <div className="results-count">
              {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''}
            </div>
          </div>

          {filteredInterviews.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>No interviews found</h3>
              <p>
                {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your interviews will appear here once scheduled'
                }
              </p>
            </div>
          ) : (
            <div className="interviews-list">
              {filteredInterviews.map(interview => (
                <div key={interview.id} className="interview-card">
                  <div className="interview-header">
                    <div className="interview-basic-info">
                      <div className="company-logo">
                        <img src={interview.companyLogo} alt={interview.company} />
                      </div>
                      <div className="interview-title-info">
                        <h3>{interview.jobTitle}</h3>
                        <p>{interview.company}</p>
                        <div className="interview-round">{interview.round}</div>
                      </div>
                    </div>
                    <div className="interview-status">
                      <span className={`status-badge ${getStatusColor(interview.status)}`}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                      <div className="time-until">
                        {getTimeUntil(interview.date)}
                      </div>
                    </div>
                  </div>

                  <div className="interview-details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>{formatDateTime(interview.date).date}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{formatDateTime(interview.date).time} ({interview.duration}min)</span>
                    </div>
                    <div className="detail-item">
                      {getTypeIcon(interview.type)}
                      <span>{interview.location}</span>
                    </div>
                    {(interview.candidateName || interview.interviewerName) && (
                      <div className="detail-item">
                        <User size={16} />
                        <span>
                          {interview.candidateName 
                            ? `Candidate: ${interview.candidateName}`
                            : `Interviewer: ${interview.interviewerName}`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {interview.notes && (
                    <div className="interview-notes">
                      <FileText size={16} />
                      <span>{interview.notes}</span>
                    </div>
                  )}

                  {interview.feedback && (
                    <div className="interview-feedback">
                      <div className="feedback-header">
                        <MessageSquare size={16} />
                        <span>Feedback</span>
                        {interview.rating && (
                          <div className="rating">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < Math.floor(interview.rating) ? 'filled' : ''}
                              />
                            ))}
                            <span>({interview.rating})</span>
                          </div>
                        )}
                      </div>
                      <p>{interview.feedback}</p>
                    </div>
                  )}

                  <div className="interview-actions">
                    <button 
                      className="btn secondary small"
                      onClick={() => setSelectedInterview(interview)}
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                    
                    {interview.status === 'scheduled' && (
                      <>
                        {interview.meetingLink && (
                          <button 
                            className="btn primary small"
                            onClick={() => joinMeeting(interview)}
                          >
                            <ExternalLink size={14} />
                            Join Meeting
                          </button>
                        )}
                        <button 
                          className="btn secondary small"
                          onClick={() => rescheduleInterview(interview.id)}
                        >
                          <Edit size={14} />
                          Reschedule
                        </button>
                        <button 
                          className="btn danger small"
                          onClick={() => cancelInterview(interview.id)}
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      </>
                    )}

                    {interview.status === 'completed' && !interview.feedback && user?.user_type !== 'candidate' && (
                      <button 
                        className="btn primary small"
                        onClick={() => setSelectedInterview(interview)}
                      >
                        <MessageSquare size={14} />
                        Add Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div className="modal-overlay" onClick={() => setSelectedInterview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Interview Details</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedInterview(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="interview-detail-section">
                <h3>{selectedInterview.jobTitle}</h3>
                <p className="company-name">{selectedInterview.company}</p>
                <div className="detail-grid">
                  <div className="detail-row">
                    <strong>Date & Time:</strong>
                    <span>
                      {formatDateTime(selectedInterview.date).date} at {formatDateTime(selectedInterview.date).time}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Duration:</strong>
                    <span>{selectedInterview.duration} minutes</span>
                  </div>
                  <div className="detail-row">
                    <strong>Type:</strong>
                    <span className="type-badge">
                      {getTypeIcon(selectedInterview.type)}
                      {selectedInterview.type.charAt(0).toUpperCase() + selectedInterview.type.slice(1)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Round:</strong>
                    <span>{selectedInterview.round}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Location:</strong>
                    <span>{selectedInterview.location}</span>
                  </div>
                  {selectedInterview.meetingLink && (
                    <div className="detail-row">
                      <strong>Meeting Link:</strong>
                      <div className="link-actions">
                        <a 
                          href={selectedInterview.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="meeting-link"
                        >
                          {selectedInterview.meetingLink}
                        </a>
                        <button 
                          className="copy-btn"
                          onClick={() => copyMeetingLink(selectedInterview.meetingLink)}
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedInterview.notes && (
                <div className="interview-detail-section">
                  <h4>Notes</h4>
                  <p>{selectedInterview.notes}</p>
                </div>
              )}

              {selectedInterview.attachments && selectedInterview.attachments.length > 0 && (
                <div className="interview-detail-section">
                  <h4>Attachments</h4>
                  <div className="attachments-list">
                    {selectedInterview.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-item">
                        <FileText size={16} />
                        <span>{attachment}</span>
                        <button className="download-btn">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInterview.status === 'completed' && !selectedInterview.feedback && user?.user_type !== 'candidate' && (
                <div className="interview-detail-section">
                  <h4>Add Feedback</h4>
                  <div className="feedback-form">
                    <div className="rating-input">
                      <label>Rating:</label>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} className="star-btn">
                            <Star size={20} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="feedback-input">
                      <label>Feedback:</label>
                      <textarea 
                        placeholder="Share your thoughts about the interview..."
                        rows={4}
                      />
                    </div>
                    <div className="feedback-actions">
                      <button className="btn primary">
                        <Send size={16} />
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedInterview.feedback && (
                <div className="interview-detail-section">
                  <h4>Feedback</h4>
                  {selectedInterview.rating && (
                    <div className="rating-display">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(selectedInterview.rating) ? 'filled' : ''}
                        />
                      ))}
                      <span>({selectedInterview.rating}/5)</span>
                    </div>
                  )}
                  <p>{selectedInterview.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .interviews-page {
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
          align-items: center;
          gap: 12px;
        }

        .view-toggle {
          display: flex;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 2px;
        }

        .toggle-btn {
          padding: 6px 12px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background: white;
          color: #1e293b;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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

        .btn.small {
          padding: 6px 12px;
          font-size: 12px;
        }

        .btn.primary {
          background: #8b5cf6;
          color: white;
        }

        .btn.primary:hover:not(:disabled) {
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
          background: #ef4444;
          color: white;
        }

        .btn.danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-content {
          padding: 0 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.blue { background: #3b82f6; }
        .stat-icon.green { background: #10b981; }
        .stat-icon.purple { background: #8b5cf6; }
        .stat-icon.orange { background: #f59e0b; }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
        }

        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .search-bar {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-bar svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-bar input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .filter-controls {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          min-width: 120px;
        }

        .today-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .today-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .today-interviews {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .today-interview-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .interview-time {
          text-align: center;
          min-width: 80px;
        }

        .time {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .duration {
          font-size: 12px;
          color: #64748b;
        }

        .interview-details {
          flex: 1;
        }

        .interview-details h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .interview-details p {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 8px 0;
        }

        .interview-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
        }

        .interview-actions {
          display: flex;
          gap: 8px;
        }

        .interviews-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .results-count {
          font-size: 14px;
          color: #64748b;
        }

        .interviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .interview-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          background: #fafbfc;
          transition: all 0.2s;
        }

        .interview-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }

        .interview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .interview-basic-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .company-logo {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .company-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .interview-title-info h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .interview-title-info p {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 4px 0;
        }

        .interview-round {
          font-size: 12px;
          color: #8b5cf6;
          font-weight: 500;
        }

        .interview-status {
          text-align: right;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: inline-block;
        }

        .status-badge.blue {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-badge.green {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.red {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.orange {
          background: #fed7aa;
          color: #9a3412;
        }

        .time-until {
          font-size: 12px;
          color: #64748b;
        }

        .interview-details {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #64748b;
        }

        .interview-notes {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          background: #f1f5f9;
          border-radius: 8px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #374151;
        }

        .interview-feedback {
          padding: 12px;
          background: #f0f9ff;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .feedback-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #0369a1;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: auto;
        }

        .rating .filled {
          color: #fbbf24;
        }

        .interview-feedback p {
          font-size: 14px;
          color: #374151;
          margin: 0;
        }

        .interview-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          font-size: 14px;
          margin: 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
        }

        .close-btn:hover {
          color: #374151;
        }

        .modal-body {
          padding: 24px;
        }

        .interview-detail-section {
          margin-bottom: 24px;
        }

        .interview-detail-section h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .company-name {
          font-size: 16px;
          color: #64748b;
          margin: 0 0 16px 0;
        }

        .interview-detail-section h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 12px 0;
        }

        .detail-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .detail-row strong {
          color: #374151;
          font-weight: 500;
        }

        .type-badge {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .link-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .meeting-link {
          color: #8b5cf6;
          text-decoration: none;
          font-size: 14px;
        }

        .meeting-link:hover {
          text-decoration: underline;
        }

        .copy-btn {
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 4px;
          cursor: pointer;
          color: #64748b;
        }

        .copy-btn:hover {
          background: #f8fafc;
        }

        .attachments-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .attachment-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .download-btn {
          background: transparent;
          border: none;
          color: #8b5cf6;
          cursor: pointer;
          padding: 4px;
          margin-left: auto;
        }

        .download-btn:hover {
          opacity: 0.8;
        }

        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rating-input label,
        .feedback-input label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
          display: block;
        }

        .star-rating {
          display: flex;
          gap: 4px;
        }

        .star-btn {
          background: transparent;
          border: none;
          color: #d1d5db;
          cursor: pointer;
          padding: 2px;
        }

        .star-btn:hover,
        .star-btn.active {
          color: #fbbf24;
        }

        .feedback-input textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
        }

        .feedback-input textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .feedback-actions {
          display: flex;
          justify-content: flex-end;
        }

        .rating-display {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .rating-display .filled {
          color: #fbbf24;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .page-content {
            padding: 0 16px 16px;
          }

          .filters-section {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filter-controls {
            justify-content: stretch;
          }

          .filter-select {
            flex: 1;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .interview-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .interview-details {
            flex-direction: column;
            gap: 8px;
          }

          .interview-actions {
            justify-content: stretch;
          }

          .interview-actions .btn {
            flex: 1;
            justify-content: center;
          }

          .today-interview-card {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .modal-content {
            margin: 10px;
            max-height: calc(100vh - 20px);
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  )
}

export default InterviewsPage

