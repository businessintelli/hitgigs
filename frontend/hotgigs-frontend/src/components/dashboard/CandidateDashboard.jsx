import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  TrendingUp, 
  Eye, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText, 
  Send, 
  Heart, 
  Target, 
  Award, 
  ChevronRight, 
  Filter, 
  Search, 
  RefreshCw,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

const CandidateDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [recentJobs, setRecentJobs] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedView, setSelectedView] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulate loading dashboard data
      const statsData = {
        totalApplications: 24,
        pendingReviews: 8,
        interviewsScheduled: 3,
        jobOffers: 2,
        profileViews: 156,
        matchedJobs: 47,
        savedJobs: 12,
        rejectedApplications: 6,
        shortlistedApplications: 5,
        selectedApplications: 2
      }

      const jobsData = [
        {
          id: 1,
          title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          salary: '$120,000 - $180,000',
          matchScore: 92,
          postedDate: '2024-01-15',
          isNew: true,
          type: 'Full-time',
          remote: false,
          skills: ['React', 'TypeScript', 'Node.js']
        },
        {
          id: 2,
          title: 'Frontend Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          salary: '$100,000 - $150,000',
          matchScore: 87,
          postedDate: '2024-01-14',
          isNew: true,
          type: 'Full-time',
          remote: true,
          skills: ['Vue.js', 'JavaScript', 'CSS']
        },
        {
          id: 3,
          title: 'Full Stack Developer',
          company: 'InnovateLab',
          location: 'New York, NY',
          salary: '$110,000 - $160,000',
          matchScore: 84,
          postedDate: '2024-01-13',
          isNew: false,
          type: 'Full-time',
          remote: false,
          skills: ['React', 'Python', 'PostgreSQL']
        }
      ]

      const applicationsData = [
        {
          id: 1,
          jobTitle: 'Senior React Developer',
          company: 'TechCorp Inc.',
          appliedDate: '2024-01-10',
          status: 'interview_scheduled',
          interviewDate: '2024-01-20',
          salary: '$120,000 - $180,000',
          location: 'San Francisco, CA'
        },
        {
          id: 2,
          jobTitle: 'Frontend Engineer',
          company: 'StartupXYZ',
          appliedDate: '2024-01-08',
          status: 'under_review',
          lastUpdate: '2024-01-12',
          salary: '$100,000 - $150,000',
          location: 'Remote'
        },
        {
          id: 3,
          jobTitle: 'UI/UX Developer',
          company: 'DesignCo',
          appliedDate: '2024-01-05',
          status: 'rejected',
          lastUpdate: '2024-01-15',
          salary: '$90,000 - $130,000',
          location: 'Los Angeles, CA'
        }
      ]

      setStats(statsData)
      setRecentJobs(jobsData)
      setRecentApplications(applicationsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatClick = (statType) => {
    setSelectedView(statType)
    setCurrentPage(1)
  }

  const getDetailedData = (statType) => {
    // Generate sample detailed data based on stat type
    const baseData = []
    const count = stats[statType] || 0
    
    for (let i = 1; i <= count; i++) {
      switch (statType) {
        case 'totalApplications':
          baseData.push({
            id: i,
            jobTitle: `Job Position ${i}`,
            company: `Company ${i}`,
            appliedDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: ['pending', 'under_review', 'interview_scheduled', 'rejected', 'accepted'][i % 5],
            salary: `$${80 + i * 5},000 - $${120 + i * 5},000`,
            location: ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Seattle, WA'][i % 5]
          })
          break
        case 'matchedJobs':
          baseData.push({
            id: i,
            title: `Matched Job ${i}`,
            company: `Company ${i}`,
            matchScore: 95 - i,
            location: ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Seattle, WA'][i % 5],
            salary: `$${90 + i * 3},000 - $${130 + i * 3},000`,
            postedDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          })
          break
        case 'savedJobs':
          baseData.push({
            id: i,
            title: `Saved Job ${i}`,
            company: `Company ${i}`,
            savedDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            location: ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Seattle, WA'][i % 5],
            salary: `$${85 + i * 4},000 - $${125 + i * 4},000`
          })
          break
        default:
          baseData.push({
            id: i,
            title: `Item ${i}`,
            description: `Description for item ${i}`,
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          })
      }
    }
    
    return baseData
  }

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange'
      case 'under_review': return 'blue'
      case 'interview_scheduled': return 'purple'
      case 'rejected': return 'red'
      case 'accepted': return 'green'
      default: return 'gray'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (selectedView) {
    const detailedData = getDetailedData(selectedView)
    const paginatedData = getPaginatedData(detailedData)
    const totalPages = getTotalPages(detailedData)

    return (
      <div className="detailed-view">
        <div className="detailed-header">
          <button 
            className="back-btn"
            onClick={() => setSelectedView(null)}
          >
            ← Back to Dashboard
          </button>
          <h2>{selectedView.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
          <div className="view-stats">
            Showing {paginatedData.length} of {detailedData.length} items
          </div>
        </div>

        <div className="detailed-content">
          {selectedView === 'totalApplications' && (
            <div className="applications-list">
              {paginatedData.map(application => (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <div className="job-info">
                      <h3>{application.jobTitle}</h3>
                      <p>{application.company}</p>
                    </div>
                    <div className="application-status">
                      <span className={`status-badge ${getStatusColor(application.status)}`}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="application-details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>Applied: {formatDate(application.appliedDate)}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{application.location}</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={16} />
                      <span>{application.salary}</span>
                    </div>
                  </div>
                  <div className="application-actions">
                    <button className="btn secondary small">View Details</button>
                    <button className="btn primary small">Message</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedView === 'matchedJobs' && (
            <div className="jobs-list">
              {paginatedData.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="job-info">
                      <h3>{job.title}</h3>
                      <p>{job.company}</p>
                    </div>
                    <div className="match-score">
                      <Star size={16} className="star-icon" />
                      <span>{job.matchScore}% Match</span>
                    </div>
                  </div>
                  <div className="job-details">
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={16} />
                      <span>{job.salary}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>Posted: {formatDate(job.postedDate)}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button className="btn secondary small">View Job</button>
                    <button className="btn primary small">Apply Now</button>
                    <button className="btn secondary small">Save</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedView === 'savedJobs' && (
            <div className="saved-jobs-list">
              {paginatedData.map(job => (
                <div key={job.id} className="saved-job-card">
                  <div className="job-header">
                    <div className="job-info">
                      <h3>{job.title}</h3>
                      <p>{job.company}</p>
                    </div>
                    <div className="saved-date">
                      <Heart size={16} className="heart-icon" />
                      <span>Saved: {formatDate(job.savedDate)}</span>
                    </div>
                  </div>
                  <div className="job-details">
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={16} />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button className="btn secondary small">View Job</button>
                    <button className="btn primary small">Apply Now</button>
                    <button className="btn danger small">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .detailed-view {
            padding: 0;
          }

          .detailed-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 0;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 24px;
          }

          .back-btn {
            background: transparent;
            border: 1px solid #d1d5db;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            color: #64748b;
            font-size: 14px;
          }

          .back-btn:hover {
            background: #f8fafc;
          }

          .detailed-header h2 {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
          }

          .view-stats {
            font-size: 14px;
            color: #64748b;
          }

          .detailed-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .application-card,
          .job-card,
          .saved-job-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s;
          }

          .application-card:hover,
          .job-card:hover,
          .saved-job-card:hover {
            border-color: #8b5cf6;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
          }

          .application-header,
          .job-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .job-info h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 4px 0;
          }

          .job-info p {
            font-size: 14px;
            color: #64748b;
            margin: 0;
          }

          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
          }

          .status-badge.orange {
            background: #fed7aa;
            color: #9a3412;
          }

          .status-badge.blue {
            background: #dbeafe;
            color: #1d4ed8;
          }

          .status-badge.purple {
            background: #e9d5ff;
            color: #7c3aed;
          }

          .status-badge.red {
            background: #fee2e2;
            color: #991b1b;
          }

          .status-badge.green {
            background: #d1fae5;
            color: #065f46;
          }

          .match-score {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #f59e0b;
            font-weight: 500;
          }

          .star-icon {
            color: #f59e0b;
          }

          .saved-date {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #ef4444;
            font-size: 14px;
          }

          .heart-icon {
            color: #ef4444;
          }

          .application-details,
          .job-details {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 16px;
          }

          .detail-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #64748b;
          }

          .application-actions,
          .job-actions {
            display: flex;
            gap: 8px;
          }

          .btn {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
          }

          .btn.small {
            padding: 6px 12px;
            font-size: 12px;
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
            background: #ef4444;
            color: white;
          }

          .btn.danger:hover {
            background: #dc2626;
          }

          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
            padding: 20px 0;
            border-top: 1px solid #e2e8f0;
            margin-top: 24px;
          }

          .pagination-btn {
            padding: 8px 16px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            color: #374151;
            font-size: 14px;
          }

          .pagination-btn:hover:not(:disabled) {
            background: #f8fafc;
          }

          .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .pagination-info {
            font-size: 14px;
            color: #64748b;
          }

          @media (max-width: 768px) {
            .detailed-header {
              flex-direction: column;
              gap: 12px;
              align-items: flex-start;
            }

            .application-header,
            .job-header {
              flex-direction: column;
              gap: 8px;
              align-items: flex-start;
            }

            .application-details,
            .job-details {
              flex-direction: column;
              gap: 8px;
            }

            .application-actions,
            .job-actions {
              flex-direction: column;
            }

            .btn {
              text-align: center;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="candidate-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, {user?.first_name || 'Candidate'}!</h1>
          <p>Here's your job search progress and latest opportunities</p>
        </div>
        <div className="quick-actions">
          <button 
            className="btn primary"
            onClick={() => navigate('/jobs')}
          >
            <Search size={16} />
            Browse Jobs
          </button>
          <button 
            className="btn secondary"
            onClick={() => navigate('/profile')}
          >
            <FileText size={16} />
            Update Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div 
          className="stat-card clickable"
          onClick={() => handleStatClick('totalApplications')}
        >
          <div className="stat-icon blue">
            <Send size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalApplications || 0}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div 
          className="stat-card clickable"
          onClick={() => handleStatClick('pendingReviews')}
        >
          <div className="stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingReviews || 0}</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
          <div className="stat-arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div 
          className="stat-card clickable"
          onClick={() => handleStatClick('interviewsScheduled')}
        >
          <div className="stat-icon purple">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.interviewsScheduled || 0}</div>
            <div className="stat-label">Interviews Scheduled</div>
          </div>
          <div className="stat-arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div 
          className="stat-card clickable"
          onClick={() => handleStatClick('jobOffers')}
        >
          <div className="stat-icon green">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.jobOffers || 0}</div>
            <div className="stat-label">Job Offers</div>
          </div>
          <div className="stat-arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div 
          className="stat-card clickable"
          onClick={() => handleStatClick('profileViews')}
        >
          <div className="stat-icon indigo">
            <Eye size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.profileViews || 0}</div>
            <div className="stat-label">Profile Views</div>
          </div>
          <div className="stat-arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div 
          className="stat-card clickable"
          onClick={() => handleStatClick('matchedJobs')}
        >
          <div className="stat-icon pink">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.matchedJobs || 0}</div>
            <div className="stat-label">Matched Jobs</div>
          </div>
          <div className="stat-arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div 
          className="stat-card clickable"
          onClick={() => handleStatClick('savedJobs')}
        >
          <div className="stat-icon red">
            <Heart size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.savedJobs || 0}</div>
            <div className="stat-label">Saved Jobs</div>
          </div>
          <div className="stat-arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div 
          className="stat-card clickable"
          onClick={() => handleStatClick('shortlistedApplications')}
        >
          <div className="stat-icon teal">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.shortlistedApplications || 0}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
          <div className="stat-arrow">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button 
            className="btn secondary"
            onClick={loadDashboardData}
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

        <div className="activity-grid">
          {/* Recent Job Matches */}
          <div className="activity-card">
            <div className="card-header">
              <h3>Latest Job Matches</h3>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/jobs')}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="job-matches">
              {recentJobs.slice(0, 3).map(job => (
                <div key={job.id} className="job-match-item">
                  <div className="job-match-info">
                    <h4>{job.title}</h4>
                    <p>{job.company}</p>
                    <div className="job-match-meta">
                      <span className="match-score">
                        <Star size={12} />
                        {job.matchScore}% match
                      </span>
                      <span className="location">{job.location}</span>
                    </div>
                  </div>
                  <div className="job-match-actions">
                    <button className="btn primary small">Apply</button>
                    <button className="btn secondary small">Save</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="activity-card">
            <div className="card-header">
              <h3>Recent Applications</h3>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/my-applications')}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="recent-applications">
              {recentApplications.slice(0, 3).map(application => (
                <div key={application.id} className="application-item">
                  <div className="application-info">
                    <h4>{application.jobTitle}</h4>
                    <p>{application.company}</p>
                    <div className="application-meta">
                      <span className="applied-date">
                        Applied {formatDate(application.appliedDate)}
                      </span>
                    </div>
                  </div>
                  <div className="application-status">
                    <span className={`status-badge ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .candidate-dashboard {
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .welcome-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 16px;
          color: white;
        }

        .welcome-content h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .welcome-content p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }

        .quick-actions {
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

        .btn.small {
          padding: 6px 12px;
          font-size: 12px;
        }

        .btn.primary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn.primary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .btn.secondary {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
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
          transition: all 0.2s;
          position: relative;
        }

        .stat-card.clickable {
          cursor: pointer;
        }

        .stat-card.clickable:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
          transform: translateY(-2px);
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
        .stat-icon.orange { background: #f59e0b; }
        .stat-icon.purple { background: #8b5cf6; }
        .stat-icon.green { background: #10b981; }
        .stat-icon.indigo { background: #6366f1; }
        .stat-icon.pink { background: #ec4899; }
        .stat-icon.red { background: #ef4444; }
        .stat-icon.teal { background: #14b8a6; }

        .stat-info {
          flex: 1;
        }

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

        .stat-arrow {
          color: #8b5cf6;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .stat-card.clickable:hover .stat-arrow {
          opacity: 1;
        }

        .activity-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .activity-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .view-all-btn {
          background: transparent;
          border: none;
          color: #8b5cf6;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .view-all-btn:hover {
          opacity: 0.8;
        }

        .job-matches,
        .recent-applications {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .job-match-item,
        .application-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .job-match-info h4,
        .application-info h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .job-match-info p,
        .application-info p {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 4px 0;
        }

        .job-match-meta,
        .application-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: #64748b;
        }

        .match-score {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #f59e0b;
        }

        .job-match-actions {
          display: flex;
          gap: 6px;
        }

        .application-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.orange {
          background: #fed7aa;
          color: #9a3412;
        }

        .status-badge.blue {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-badge.purple {
          background: #e9d5ff;
          color: #7c3aed;
        }

        .status-badge.red {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.green {
          background: #d1fae5;
          color: #065f46;
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

          .activity-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .welcome-section {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .quick-actions {
            justify-content: center;
          }

          .job-match-item,
          .application-item {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }

          .job-match-actions {
            width: 100%;
            justify-content: stretch;
          }

          .job-match-actions .btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default CandidateDashboard

