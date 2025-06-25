import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  User, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone, 
  FileText, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react'

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedJob, setSelectedJob] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    loadApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, selectedStatus, selectedJob, searchTerm])

  const loadApplications = async () => {
    try {
      // For now, show sample applications
      // In real implementation, this would fetch from API
      const sampleApplications = [
        {
          id: '1',
          candidateName: 'John Smith',
          candidateEmail: 'john.smith@email.com',
          candidatePhone: '+1 (555) 123-4567',
          jobTitle: 'Senior React Developer',
          jobId: 'job1',
          appliedAt: '2024-01-16T10:30:00Z',
          status: 'new',
          experience: '5 years',
          location: 'San Francisco, CA',
          resumeUrl: '/resumes/john-smith.pdf',
          coverLetter: 'I am excited to apply for this position...',
          skills: ['React', 'Node.js', 'TypeScript', 'AWS']
        },
        {
          id: '2',
          candidateName: 'Sarah Johnson',
          candidateEmail: 'sarah.j@email.com',
          candidatePhone: '+1 (555) 987-6543',
          jobTitle: 'Product Manager',
          jobId: 'job2',
          appliedAt: '2024-01-15T14:20:00Z',
          status: 'reviewed',
          experience: '7 years',
          location: 'New York, NY',
          resumeUrl: '/resumes/sarah-johnson.pdf',
          coverLetter: 'With my extensive background in product management...',
          skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership']
        },
        {
          id: '3',
          candidateName: 'Michael Chen',
          candidateEmail: 'michael.chen@email.com',
          candidatePhone: '+1 (555) 456-7890',
          jobTitle: 'Senior React Developer',
          jobId: 'job1',
          appliedAt: '2024-01-14T09:15:00Z',
          status: 'interviewed',
          experience: '6 years',
          location: 'Seattle, WA',
          resumeUrl: '/resumes/michael-chen.pdf',
          coverLetter: 'I have been following your company for some time...',
          skills: ['React', 'Vue.js', 'Python', 'Docker']
        },
        {
          id: '4',
          candidateName: 'Emily Davis',
          candidateEmail: 'emily.davis@email.com',
          candidatePhone: '+1 (555) 321-0987',
          jobTitle: 'UX Designer',
          jobId: 'job3',
          appliedAt: '2024-01-13T16:45:00Z',
          status: 'rejected',
          experience: '4 years',
          location: 'Austin, TX',
          resumeUrl: '/resumes/emily-davis.pdf',
          coverLetter: 'Design has always been my passion...',
          skills: ['Figma', 'Sketch', 'User Research', 'Prototyping']
        }
      ]
      
      setApplications(sampleApplications)
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus)
    }

    // Filter by job
    if (selectedJob !== 'all') {
      filtered = filtered.filter(app => app.jobId === selectedJob)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredApplications(filtered)
  }

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      )
      // In real implementation, this would call API to update status
    } catch (error) {
      console.error('Failed to update application status:', error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <Clock size={16} className="status-icon new" />
      case 'reviewed':
        return <Eye size={16} className="status-icon reviewed" />
      case 'interviewed':
        return <User size={16} className="status-icon interviewed" />
      case 'accepted':
        return <CheckCircle size={16} className="status-icon accepted" />
      case 'rejected':
        return <XCircle size={16} className="status-icon rejected" />
      default:
        return <Clock size={16} className="status-icon" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'new':
        return 'New'
      case 'reviewed':
        return 'Reviewed'
      case 'interviewed':
        return 'Interviewed'
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const uniqueJobs = [...new Set(applications.map(app => app.jobTitle))]

  if (loading) {
    return (
      <div className="applications-page">
        <div className="container">
          <div className="loading">Loading applications...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="applications-page">
      <div className="container">
        <div className="page-header">
          <h1>Job Applications</h1>
          <p>Manage and track candidate applications</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search candidates or jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <label>Status:</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewed">Interviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Job:</label>
              <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
                <option value="all">All Jobs</option>
                {uniqueJobs.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} className="empty-icon" />
            <h3>No applications found</h3>
            <p>No applications match your current filters.</p>
          </div>
        ) : (
          <div className="applications-list">
            {filteredApplications.map(application => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="candidate-info">
                    <h3>{application.candidateName}</h3>
                    <div className="candidate-details">
                      <span className="detail">
                        <Mail size={14} />
                        {application.candidateEmail}
                      </span>
                      <span className="detail">
                        <Phone size={14} />
                        {application.candidatePhone}
                      </span>
                    </div>
                  </div>
                  
                  <div className="application-status">
                    {getStatusIcon(application.status)}
                    <span>{getStatusText(application.status)}</span>
                  </div>
                </div>

                <div className="application-body">
                  <div className="job-info">
                    <h4>Applied for: {application.jobTitle}</h4>
                    <div className="application-meta">
                      <span className="detail">
                        <Calendar size={14} />
                        Applied {formatDate(application.appliedAt)}
                      </span>
                      <span className="detail">
                        <User size={14} />
                        {application.experience} experience
                      </span>
                      <span className="detail">
                        📍 {application.location}
                      </span>
                    </div>
                  </div>

                  <div className="skills-section">
                    <strong>Skills:</strong>
                    <div className="skills-list">
                      {application.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="cover-letter">
                      <strong>Cover Letter:</strong>
                      <p>{application.coverLetter.substring(0, 150)}...</p>
                    </div>
                  )}
                </div>

                <div className="application-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => window.open(application.resumeUrl, '_blank')}
                  >
                    <FileText size={14} />
                    View Resume
                  </button>
                  
                  <div className="status-actions">
                    {application.status === 'new' && (
                      <>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                        >
                          Mark Reviewed
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => updateApplicationStatus(application.id, 'interviewed')}
                        >
                          Schedule Interview
                        </button>
                      </>
                    )}
                    
                    {application.status === 'reviewed' && (
                      <>
                        <button 
                          className="btn btn-primary"
                          onClick={() => updateApplicationStatus(application.id, 'interviewed')}
                        >
                          Schedule Interview
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {application.status === 'interviewed' && (
                      <>
                        <button 
                          className="btn btn-success"
                          onClick={() => updateApplicationStatus(application.id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .applications-page {
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

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .page-header p {
          font-size: 18px;
          color: #6b7280;
          margin: 0;
        }

        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-box svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .search-box input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-group {
          display: flex;
          gap: 16px;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-item label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .filter-item select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 24px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .application-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .application-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .candidate-info h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .candidate-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .detail {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: #6b7280;
        }

        .application-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 20px;
          background: #f3f4f6;
        }

        .status-icon.new {
          color: #f59e0b;
        }

        .status-icon.reviewed {
          color: #06b6d4;
        }

        .status-icon.interviewed {
          color: #8b5cf6;
        }

        .status-icon.accepted {
          color: #10b981;
        }

        .status-icon.rejected {
          color: #ef4444;
        }

        .application-body {
          margin-bottom: 20px;
        }

        .job-info h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .application-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .skills-section {
          margin-bottom: 16px;
        }

        .skills-section strong {
          font-size: 14px;
          color: #374151;
          margin-bottom: 8px;
          display: block;
        }

        .skills-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .skill-tag {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .cover-letter {
          background: #f9fafb;
          padding: 12px;
          border-radius: 6px;
        }

        .cover-letter strong {
          font-size: 14px;
          color: #374151;
          margin-bottom: 8px;
          display: block;
        }

        .cover-letter p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .application-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .status-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
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

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover {
          background: #059669;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f9fafb;
        }

        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            min-width: auto;
          }
          
          .filter-group {
            flex-direction: column;
          }
          
          .application-header {
            flex-direction: column;
            gap: 12px;
          }
          
          .candidate-details {
            flex-direction: column;
            gap: 8px;
          }
          
          .application-meta {
            flex-direction: column;
            gap: 8px;
          }
          
          .application-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .status-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default ApplicationsPage

