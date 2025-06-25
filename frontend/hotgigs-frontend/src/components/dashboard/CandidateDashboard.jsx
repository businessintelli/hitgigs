import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Briefcase, 
  Heart, 
  FileText, 
  Calendar, 
  Award, 
  TrendingUp, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Target,
  Star,
  MapPin,
  DollarSign
} from 'lucide-react'

const CandidateDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simulate loading dashboard data
      // In real implementation, this would fetch from API
      const dashboardStats = {
        totalApplications: 12,
        pendingApplications: 5,
        interviewsScheduled: 2,
        offersReceived: 1,
        profileViews: 34,
        matchedJobs: 8,
        savedJobs: 6,
        rejections: 4
      }

      const recentJobsData = [
        {
          id: 1,
          title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          salary: '$120,000 - $180,000',
          matchScore: 92,
          postedDate: '2024-01-15',
          isNew: true
        },
        {
          id: 2,
          title: 'Frontend Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          salary: '$100,000 - $150,000',
          matchScore: 87,
          postedDate: '2024-01-14',
          isNew: true
        },
        {
          id: 3,
          title: 'Full Stack Developer',
          company: 'InnovateLab',
          location: 'New York, NY',
          salary: '$110,000 - $160,000',
          matchScore: 84,
          postedDate: '2024-01-13',
          isNew: false
        }
      ]

      const applicationsData = [
        {
          id: 1,
          jobTitle: 'Senior React Developer',
          company: 'TechCorp Inc.',
          appliedDate: '2024-01-10',
          status: 'interview_scheduled',
          interviewDate: '2024-01-20'
        },
        {
          id: 2,
          jobTitle: 'Frontend Engineer',
          company: 'StartupXYZ',
          appliedDate: '2024-01-08',
          status: 'under_review',
          lastUpdate: '2024-01-12'
        },
        {
          id: 3,
          jobTitle: 'UI/UX Developer',
          company: 'DesignCo',
          appliedDate: '2024-01-05',
          status: 'offer_received',
          offerAmount: '$125,000'
        }
      ]

      setStats(dashboardStats)
      setRecentJobs(recentJobsData)
      setApplications(applicationsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />
      case 'under_review':
        return <Eye size={16} className="text-blue-500" />
      case 'interview_scheduled':
        return <Calendar size={16} className="text-purple-500" />
      case 'offer_received':
        return <Award size={16} className="text-green-500" />
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />
      default:
        return <AlertCircle size={16} className="text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'under_review':
        return 'Under Review'
      case 'interview_scheduled':
        return 'Interview Scheduled'
      case 'offer_received':
        return 'Offer Received'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="candidate-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="candidate-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back, {user?.first_name}!</h1>
        <p>Here's your job search overview</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
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
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pendingApplications}</div>
            <div className="stat-label">Pending Reviews</div>
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
          <div className="stat-icon offers">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.offersReceived}</div>
            <div className="stat-label">Job Offers</div>
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

        <div className="stat-card">
          <div className="stat-icon matched">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.matchedJobs}</div>
            <div className="stat-label">Matched Jobs</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Job Matches */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Job Matches</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="jobs-list">
            {recentJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <div className="company-info">
                      <span className="company-name">{job.company}</span>
                      {job.isNew && <span className="new-badge">New</span>}
                    </div>
                  </div>
                  <div className="match-score">
                    <div className="score">{job.matchScore}%</div>
                    <div className="score-label">Match</div>
                  </div>
                </div>
                
                <div className="job-details">
                  <div className="detail-item">
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>
                  <div className="detail-item">
                    <DollarSign size={14} />
                    <span>{job.salary}</span>
                  </div>
                </div>
                
                <div className="job-actions">
                  <button className="btn btn-outline">
                    <Heart size={14} />
                    Save
                  </button>
                  <button className="btn btn-primary">
                    Apply Now
                  </button>
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
            {applications.map(application => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="application-info">
                    <h3>{application.jobTitle}</h3>
                    <span className="company-name">{application.company}</span>
                  </div>
                  <div className="application-status">
                    {getStatusIcon(application.status)}
                    <span>{getStatusText(application.status)}</span>
                  </div>
                </div>
                
                <div className="application-details">
                  <div className="detail-item">
                    <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                  </div>
                  {application.interviewDate && (
                    <div className="detail-item interview-date">
                      <Calendar size={14} />
                      <span>Interview: {new Date(application.interviewDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {application.offerAmount && (
                    <div className="detail-item offer-amount">
                      <Award size={14} />
                      <span>Offer: {application.offerAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .candidate-dashboard {
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
          margin-bottom: 32px;
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

        .stat-icon.applications {
          background: #06b6d4;
        }

        .stat-icon.pending {
          background: #f59e0b;
        }

        .stat-icon.interviews {
          background: #8b5cf6;
        }

        .stat-icon.offers {
          background: #10b981;
        }

        .stat-icon.views {
          background: #3b82f6;
        }

        .stat-icon.matched {
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

        .job-info h3, .application-info h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .company-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .company-name {
          font-size: 14px;
          color: #6b7280;
        }

        .new-badge {
          background: #10b981;
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          text-transform: uppercase;
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

        .job-details, .application-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .detail-item.interview-date {
          color: #8b5cf6;
          font-weight: 500;
        }

        .detail-item.offer-amount {
          color: #10b981;
          font-weight: 500;
        }

        .job-actions {
          display: flex;
          gap: 8px;
        }

        .application-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
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
          
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .stat-card {
            padding: 16px;
          }
          
          .job-header, .application-header {
            flex-direction: column;
            gap: 8px;
          }
          
          .job-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default CandidateDashboard

