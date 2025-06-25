import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Briefcase, 
  Users, 
  Eye, 
  Plus, 
  TrendingUp, 
  Calendar,
  MapPin,
  DollarSign,
  FileText
} from 'lucide-react'

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    viewsThisMonth: 0,
    hiredCandidates: 0
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // For now, show sample data
      // In real implementation, this would fetch from API
      setStats({
        activeJobs: 5,
        totalApplications: 23,
        viewsThisMonth: 156,
        hiredCandidates: 3
      })

      setRecentJobs([
        {
          id: '1',
          title: 'Senior React Developer',
          location: 'San Francisco, CA',
          salary: '$120,000 - $180,000',
          applications: 8,
          views: 45,
          postedAt: '2024-01-15',
          status: 'active'
        },
        {
          id: '2',
          title: 'Product Manager',
          location: 'New York, NY',
          salary: '$100,000 - $150,000',
          applications: 12,
          views: 67,
          postedAt: '2024-01-10',
          status: 'active'
        }
      ])

      setRecentApplications([
        {
          id: '1',
          candidateName: 'John Smith',
          jobTitle: 'Senior React Developer',
          appliedAt: '2024-01-16',
          status: 'new',
          experience: '5 years'
        },
        {
          id: '2',
          candidateName: 'Sarah Johnson',
          jobTitle: 'Product Manager',
          appliedAt: '2024-01-15',
          status: 'reviewed',
          experience: '7 years'
        }
      ])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="company-dashboard">
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="company-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Company Dashboard</h1>
          <p>Welcome back, {user?.first_name || user?.name || 'Company'}!</p>
          <button className="btn btn-primary">
            <Plus size={16} />
            Post New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Briefcase size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.activeJobs}</div>
              <div className="stat-label">Active Jobs</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalApplications}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Eye size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.viewsThisMonth}</div>
              <div className="stat-label">Views This Month</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.hiredCandidates}</div>
              <div className="stat-label">Hired This Month</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Jobs */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Job Posts</h2>
              <a href="/my-jobs" className="view-all">View All</a>
            </div>
            
            <div className="jobs-list">
              {recentJobs.map(job => (
                <div key={job.id} className="job-item">
                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <div className="job-details">
                      <span className="detail">
                        <MapPin size={14} />
                        {job.location}
                      </span>
                      <span className="detail">
                        <DollarSign size={14} />
                        {job.salary}
                      </span>
                      <span className="detail">
                        <Calendar size={14} />
                        Posted {job.postedAt}
                      </span>
                    </div>
                  </div>
                  
                  <div className="job-stats">
                    <div className="stat">
                      <span className="stat-number">{job.applications}</span>
                      <span className="stat-label">Applications</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{job.views}</span>
                      <span className="stat-label">Views</span>
                    </div>
                  </div>
                  
                  <div className="job-actions">
                    <button className="btn btn-secondary">Edit</button>
                    <button className="btn btn-outline">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Applications</h2>
              <a href="/applications" className="view-all">View All</a>
            </div>
            
            <div className="applications-list">
              {recentApplications.map(application => (
                <div key={application.id} className="application-item">
                  <div className="candidate-info">
                    <h4>{application.candidateName}</h4>
                    <div className="application-details">
                      <span>Applied for: {application.jobTitle}</span>
                      <span>Experience: {application.experience}</span>
                      <span>Applied: {application.appliedAt}</span>
                    </div>
                  </div>
                  
                  <div className="application-status">
                    <span className={`status-badge ${application.status}`}>
                      {application.status === 'new' ? 'New' : 'Reviewed'}
                    </span>
                  </div>
                  
                  <div className="application-actions">
                    <button className="btn btn-primary">Review</button>
                    <button className="btn btn-outline">
                      <FileText size={14} />
                      Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .company-dashboard {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #6b7280;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .dashboard-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .dashboard-header p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          background: #eff6ff;
          color: #2563eb;
          padding: 12px;
          border-radius: 10px;
        }

        .stat-number {
          font-size: 28px;
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
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .view-all {
          color: #06b6d4;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        .jobs-list, .applications-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .job-item, .application-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
        }

        .job-info, .candidate-info {
          flex: 1;
        }

        .job-info h3, .candidate-info h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .job-details, .application-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        .application-details span {
          font-size: 12px;
          color: #6b7280;
        }

        .job-stats {
          display: flex;
          gap: 16px;
        }

        .stat {
          text-align: center;
        }

        .stat .stat-number {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .stat .stat-label {
          font-size: 11px;
          color: #6b7280;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.new {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-badge.reviewed {
          background: #d1fae5;
          color: #059669;
        }

        .job-actions, .application-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          border: none;
        }

        .btn-primary {
          background: #06b6d4;
          color: white;
        }

        .btn-primary:hover {
          background: #0891b2;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
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
          
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .job-item, .application-item {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .job-actions, .application-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  )
}

export default CompanyDashboard

