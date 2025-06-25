import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Bookmark, MapPin, DollarSign, Calendar, ExternalLink } from 'lucide-react'

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadSavedJobs()
  }, [])

  const loadSavedJobs = async () => {
    try {
      // For now, show sample saved jobs
      // In real implementation, this would fetch from API
      setSavedJobs([
        {
          id: '1',
          title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          salary: '$120,000 - $180,000',
          savedAt: '2024-01-15',
          description: 'We are looking for an experienced React developer...'
        },
        {
          id: '2',
          title: 'Product Manager',
          company: 'StartupXYZ',
          location: 'New York, NY',
          salary: '$100,000 - $150,000',
          savedAt: '2024-01-14',
          description: 'Join our product team to drive innovation...'
        }
      ])
    } catch (error) {
      console.error('Failed to load saved jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeSavedJob = async (jobId) => {
    try {
      setSavedJobs(prev => prev.filter(job => job.id !== jobId))
      // In real implementation, this would call API to remove saved job
    } catch (error) {
      console.error('Failed to remove saved job:', error)
    }
  }

  if (loading) {
    return (
      <div className="saved-jobs-page">
        <div className="container">
          <div className="loading">Loading saved jobs...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="saved-jobs-page">
      <div className="container">
        <div className="page-header">
          <h1>Saved Jobs</h1>
          <p>Jobs you've bookmarked for later review</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="empty-state">
            <Bookmark size={48} className="empty-icon" />
            <h3>No saved jobs yet</h3>
            <p>Start browsing jobs and save the ones that interest you!</p>
            <a href="/jobs" className="btn btn-primary">Browse Jobs</a>
          </div>
        ) : (
          <div className="jobs-grid">
            {savedJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <button 
                    onClick={() => removeSavedJob(job.id)}
                    className="remove-btn"
                    title="Remove from saved"
                  >
                    ×
                  </button>
                </div>
                
                <div className="job-company">{job.company}</div>
                
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
                    <span>Saved {job.savedAt}</span>
                  </div>
                </div>
                
                <div className="job-description">
                  {job.description}
                </div>
                
                <div className="job-actions">
                  <button className="btn btn-primary">
                    <ExternalLink size={16} />
                    View Job
                  </button>
                  <button className="btn btn-secondary">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .saved-jobs-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 0;
        }

        .container {
          max-width: 1200px;
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

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .job-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .job-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .job-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          flex: 1;
        }

        .remove-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .remove-btn:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .job-company {
          font-size: 16px;
          font-weight: 500;
          color: #06b6d4;
          margin-bottom: 16px;
        }

        .job-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .job-description {
          font-size: 14px;
          color: #374151;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .job-actions {
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

        @media (max-width: 768px) {
          .jobs-grid {
            grid-template-columns: 1fr;
          }
          
          .job-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default SavedJobsPage