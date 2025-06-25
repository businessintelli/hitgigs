import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FileText, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      // For now, show sample applications
      // In real implementation, this would fetch from API
      setApplications([
        {
          id: '1',
          jobTitle: 'Senior React Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          appliedAt: '2024-01-15',
          status: 'under_review',
          notes: 'Application submitted successfully'
        },
        {
          id: '2',
          jobTitle: 'Product Manager',
          company: 'StartupXYZ',
          location: 'New York, NY',
          appliedAt: '2024-01-10',
          status: 'interview_scheduled',
          notes: 'Interview scheduled for next week'
        },
        {
          id: '3',
          jobTitle: 'Frontend Developer',
          company: 'WebCorp',
          location: 'Remote',
          appliedAt: '2024-01-05',
          status: 'rejected',
          notes: 'Thank you for your interest. We decided to move forward with another candidate.'
        }
      ])
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'under_review':
        return <Clock size={16} className="status-icon review" />
      case 'interview_scheduled':
        return <AlertCircle size={16} className="status-icon interview" />
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
      case 'under_review':
        return 'Under Review'
      case 'interview_scheduled':
        return 'Interview Scheduled'
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Not Selected'
      default:
        return 'Pending'
    }
  }

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
          <h1>My Applications</h1>
          <p>Track the status of your job applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <h3>No applications yet</h3>
            <p>Start applying to jobs to track your applications here!</p>
            <a href="/jobs" className="btn btn-primary">Browse Jobs</a>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map(application => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="job-info">
                    <h3>{application.jobTitle}</h3>
                    <div className="company">{application.company}</div>
                  </div>
                  <div className="status">
                    {getStatusIcon(application.status)}
                    <span>{getStatusText(application.status)}</span>
                  </div>
                </div>
                
                <div className="application-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{application.location}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Applied {application.appliedAt}</span>
                  </div>
                </div>
                
                {application.notes && (
                  <div className="application-notes">
                    <strong>Notes:</strong> {application.notes}
                  </div>
                )}
                
                <div className="application-actions">
                  <button className="btn btn-secondary">View Job</button>
                  <button className="btn btn-outline">Withdraw</button>
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
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
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

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #6b7280;
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
          margin: 0 0 24px 0;
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

        .job-info h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .company {
          font-size: 16px;
          font-weight: 500;
          color: #06b6d4;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 20px;
          background: #f3f4f6;
        }

        .status-icon.review {
          color: #f59e0b;
        }

        .status-icon.interview {
          color: #06b6d4;
        }

        .status-icon.accepted {
          color: #10b981;
        }

        .status-icon.rejected {
          color: #ef4444;
        }

        .application-details {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .application-notes {
          font-size: 14px;
          color: #374151;
          background: #f9fafb;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
        }

        .application-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          border: none;
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

        @media (max-width: 768px) {
          .application-header {
            flex-direction: column;
            gap: 12px;
          }
          
          .application-details {
            flex-direction: column;
            gap: 8px;
          }
          
          .application-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default MyApplicationsPage