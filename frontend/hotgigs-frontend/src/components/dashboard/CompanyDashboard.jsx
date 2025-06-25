import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp, 
  Eye, 
  Calendar, 
  Award, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Building,
  Send,
  Star
} from 'lucide-react'

const CompanyDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simulate loading company dashboard data
      const dashboardStats = {
        activeJobs: 8,
        totalApplications: 156,
        newApplications: 23,
        interviewsScheduled: 12,
        hiresMade: 3,
        profileViews: 1240,
        avgTimeToHire: 18,
        applicationRate: 85
      }

      const recentJobsData = [
        {
          id: 1,
          title: 'Senior React Developer',
          department: 'Engineering',
          location: 'San Francisco, CA',
          postedDate: '2024-01-15',
          applications: 45,
          views: 234,
          status: 'active'
        },
        {
          id: 2,
          title: 'Product Manager',
          department: 'Product',
          location: 'Remote',
          postedDate: '2024-01-12',
          applications: 67,
          views: 312,
          status: 'active'
        },
        {
          id: 3,
          title: 'UX Designer',
          department: 'Design',
          location: 'New York, NY',
          postedDate: '2024-01-10',
          applications: 23,
          views: 156,
          status: 'paused'
        }
      ]

      const recentApplicationsData = [
        {
          id: 1,
          candidateName: 'John Smith',
          jobTitle: 'Senior React Developer',
          appliedDate: '2024-01-16',
          status: 'new',
          experience: '5 years',
          matchScore: 92
        },
        {
          id: 2,
          candidateName: 'Sarah Johnson',
          jobTitle: 'Product Manager',
          appliedDate: '2024-01-15',
          status: 'reviewed',
          experience: '7 years',
          matchScore: 88
        },
        {
          id: 3,
          candidateName: 'Michael Chen',
          jobTitle: 'Senior React Developer',
          appliedDate: '2024-01-14',
          status: 'interview_scheduled',
          experience: '6 years',
          matchScore: 85
        },
        {
          id: 4,
          candidateName: 'Emily Davis',
          jobTitle: 'UX Designer',
          appliedDate: '2024-01-13',
          status: 'offer_sent',
          experience: '4 years',
          matchScore: 90
        }
      ]

      setStats(dashboardStats)
      setRecentJobs(recentJobsData)
      setRecentApplications(recentApplicationsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <Clock size={16} className="text-blue-500" />
      case 'reviewed':
        return <Eye size={16} className="text-yellow-500" />
      case 'interview_scheduled':
        return <Calendar size={16} className="text-purple-500" />
      case 'offer_sent':
        return <Send size={16} className="text-green-500" />
      case 'hired':
        return <CheckCircle size={16} className="text-green-600" />
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />
      default:
        return <AlertCircle size={16} className="text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'new':
        return 'New Application'
      case 'reviewed':
        return 'Under Review'
      case 'interview_scheduled':
        return 'Interview Scheduled'
      case 'offer_sent':
        return 'Offer Sent'
      case 'hired':
        return 'Hired'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Unknown'
    }
  }

  const getJobStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`status-badge ${statusClasses[status] || statusClasses.active}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="company-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="company-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Company Dashboard</h1>
        <p>Manage your hiring process and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon jobs">
            <Briefcase size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.activeJobs}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon applications">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new-applications">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.newApplications}</div>
            <div className="stat-label">New Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon interviews">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.interviewsScheduled}</div>
            <div className="stat-label">Interviews Scheduled</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon hires">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.hiresMade}</div>
            <div className="stat-label">Hires Made</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon views">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.profileViews}</div>
            <div className="stat-label">Profile Views</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="metrics-section">
        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={20} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.avgTimeToHire} days</div>
            <div className="metric-label">Avg. Time to Hire</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Target size={20} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.applicationRate}%</div>
            <div className="metric-label">Application Rate</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Job Posts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Job Posts</h2>
            <button className="view-all-btn">Manage Jobs</button>
          </div>
          
          <div className="jobs-list">
            {recentJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span className="department">{job.department}</span>
                      <span className="location">{job.location}</span>
                    </div>
                  </div>
                  {getJobStatusBadge(job.status)}
                </div>
                
                <div className="job-stats">
                  <div className="stat-item">
                    <Users size={14} />
                    <span>{job.applications} applications</span>
                  </div>
                  <div className="stat-item">
                    <Eye size={14} />
                    <span>{job.views} views</span>
                  </div>
                  <div className="stat-item">
                    <Calendar size={14} />
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="job-actions">
                  <button className="btn btn-outline">Edit</button>
                  <button className="btn btn-primary">View Applications</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="applications-list">
            {recentApplications.map(application => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="candidate-info">
                    <h3>{application.candidateName}</h3>
                    <div className="application-meta">
                      <span className="job-title">{application.jobTitle}</span>
                      <span className="experience">{application.experience} experience</span>
                    </div>
                  </div>
                  <div className="match-score">
                    <div className="score">{application.matchScore}%</div>
                    <div className="score-label">Match</div>
                  </div>
                </div>
                
                <div className="application-status-section">
                  <div className="status-info">
                    {getStatusIcon(application.status)}
                    <span>{getStatusText(application.status)}</span>
                  </div>
                  <div className="applied-date">
                    Applied {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="application-actions">
                  <button className="btn btn-outline">View Profile</button>
                  <button className="btn btn-primary">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .company-dashboard {
          padding: 0;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #6b7280;
        }

        .welcome-section {
          margin-bottom: 32px;
        }

        .welcome-section h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .welcome-section p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
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

        .stat-icon.jobs {
          background: #06b6d4;
        }

        .stat-icon.applications {
          background: #3b82f6;
        }

        .stat-icon.new-applications {
          background: #f59e0b;
        }

        .stat-icon.interviews {
          background: #8b5cf6;
        }

        .stat-icon.hires {
          background: #10b981;
        }

        .stat-icon.views {
          background: #ef4444;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .metrics-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .metric-icon {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px;
        }

        .metric-value {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .dashboard-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .view-all-btn {
          background: none;
          border: none;
          color: #06b6d4;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .view-all-btn:hover {
          text-decoration: underline;
        }

        .jobs-list, .applications-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .job-card, .application-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }

        .job-card:hover, .application-card:hover {
          border-color: #06b6d4;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.1);
        }

        .job-header, .application-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .job-info h3, .candidate-info h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .job-meta, .application-meta {
          display: flex;
          gap: 12px;
          font-size: 14px;
          color: #6b7280;
        }

        .status-badge {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .job-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .match-score {
          text-align: center;
        }

        .score {
          font-size: 18px;
          font-weight: 700;
          color: #10b981;
        }

        .score-label {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .application-status-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .status-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .applied-date {
          font-size: 12px;
          color: #6b7280;
        }

        .job-actions, .application-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #06b6d4;
          color: white;
        }

        .btn-primary:hover {
          background: #0891b2;
        }

        .btn-outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f9fafb;
        }

        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
          
          .stats-grid, .metrics-section {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .stats-grid, .metrics-section {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .stat-card, .metric-card {
            padding: 16px;
          }
          
          .job-header, .application-header {
            flex-direction: column;
            gap: 8px;
          }
          
          .job-actions, .application-actions {
            flex-direction: column;
          }
          
          .job-stats {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  )
}

export default CompanyDashboard

