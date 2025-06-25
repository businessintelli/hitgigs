import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const HomePage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/jobs?limit=6')
      const data = await response.json()
      
      if (response.ok) {
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
      const response = await fetch(`http://localhost:8000/api/jobs?limit=20${searchQuery}`)
      const data = await response.json()
      
      if (response.ok) {
        let filteredJobs = data.jobs || []
        
        // Filter by location if specified
        if (location) {
          filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(location.toLowerCase())
          )
        }
        
        setJobs(filteredJobs)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      alert('Please sign in to save jobs')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        if (savedJobs.has(jobId)) {
          setSavedJobs(prev => {
            const newSet = new Set(prev)
            newSet.delete(jobId)
            return newSet
          })
        } else {
          setSavedJobs(prev => new Set([...prev, jobId]))
        }
        alert(data.message)
      } else {
        throw new Error(data.detail || 'Failed to save job')
      }
    } catch (error) {
      console.error('Save job error:', error)
      alert('Failed to save job: ' + error.message)
    }
  }

  const handleApplyJob = async (jobId) => {
    if (!isAuthenticated) {
      alert('Please sign in to apply for jobs')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        setAppliedJobs(prev => new Set([...prev, jobId]))
        alert(data.message)
      } else {
        throw new Error(data.detail || 'Failed to apply for job')
      }
    } catch (error) {
      console.error('Apply job error:', error)
      alert('Failed to apply: ' + error.message)
    }
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Job with AI-Powered Matching</h1>
          <p>Connect with top companies and discover opportunities that match your skills and aspirations</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? '🔄' : '🔍'} Search Jobs
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose HotGigs.ai?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Matching</h3>
              <p>Our advanced AI analyzes your skills and preferences to find the perfect job matches</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Top Companies</h3>
              <p>Connect with leading companies across various industries and career levels</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Opportunities</h3>
              <p>Explore remote and on-site opportunities from companies worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Job Opportunities</h2>
            <Link to="/jobs" className="view-all-link">View All Jobs →</Link>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading amazing opportunities...</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <div className="job-company">{job.company}</div>
                  </div>
                  
                  <div className="job-details">
                    <div className="job-location">📍 {job.location}</div>
                    <div className="job-type">💼 {job.type}</div>
                    {job.salary && (
                      <div className="job-salary">💰 {job.salary}</div>
                    )}
                  </div>
                  
                  <div className="job-description">
                    {job.description.length > 150 
                      ? job.description.substring(0, 150) + '...'
                      : job.description
                    }
                  </div>
                  
                  <div className="job-actions">
                    <button
                      onClick={() => handleSaveJob(job.id)}
                      className={`save-button ${savedJobs.has(job.id) ? 'saved' : ''}`}
                      title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
                    >
                      {savedJobs.has(job.id) ? '❤️' : '🤍'} 
                      {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                    </button>
                    
                    <button
                      onClick={() => handleApplyJob(job.id)}
                      className={`apply-button ${appliedJobs.has(job.id) ? 'applied' : ''}`}
                      disabled={appliedJobs.has(job.id)}
                    >
                      {appliedJobs.has(job.id) ? '✅ Applied' : '📝 Apply Now'}
                    </button>
                  </div>
                  
                  <div className="job-posted">
                    Posted: {new Date(job.posted_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && jobs.length === 0 && (
            <div className="no-jobs">
              <div className="no-jobs-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or check back later for new opportunities</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Career Journey?</h2>
            <p>Join thousands of professionals who have found their dream jobs through HotGigs.ai</p>
            <div className="cta-buttons">
              {isAuthenticated ? (
                <Link to="/jobs" className="cta-button primary">
                  Browse All Jobs
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="cta-button primary">
                    Get Started Free
                  </Link>
                  <Link to="/signin" className="cta-button secondary">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .hero-section {
          background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 100%);
          padding: 80px 20px;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }

        .hero-content p {
          font-size: 20px;
          color: #6b7280;
          margin: 0 0 40px 0;
          line-height: 1.6;
        }

        .search-form {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .search-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: end;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .search-input {
          padding: 14px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .search-button {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .search-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
          transform: translateY(-1px);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .features-section {
          padding: 80px 20px;
          background: white;
        }

        .features-section h2 {
          text-align: center;
          font-size: 36px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 48px 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .feature-card {
          text-align: center;
          padding: 32px 24px;
          border-radius: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .feature-card h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .feature-card p {
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .jobs-section {
          padding: 80px 20px;
          background: #f9fafb;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
        }

        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .view-all-link {
          color: #06b6d4;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #06b6d4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .job-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .job-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .job-company {
          color: #06b6d4;
          font-weight: 500;
          font-size: 14px;
        }

        .job-details {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 14px;
          color: #6b7280;
        }

        .job-description {
          color: #374151;
          line-height: 1.6;
          font-size: 14px;
        }

        .job-actions {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }

        .save-button, .apply-button {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .save-button {
          background: #f3f4f6;
          color: #374151;
          flex: 1;
        }

        .save-button.saved {
          background: #fef2f2;
          color: #dc2626;
        }

        .save-button:hover {
          background: #e5e7eb;
        }

        .apply-button {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
          flex: 2;
        }

        .apply-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
        }

        .apply-button.applied {
          background: #d1fae5;
          color: #065f46;
          cursor: default;
        }

        .apply-button:disabled {
          cursor: not-allowed;
        }

        .job-posted {
          font-size: 12px;
          color: #9ca3af;
          text-align: right;
        }

        .no-jobs {
          text-align: center;
          padding: 60px 20px;
        }

        .no-jobs-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .no-jobs h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .no-jobs p {
          color: #6b7280;
          margin: 0;
        }

        .cta-section {
          padding: 80px 20px;
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .cta-content p {
          font-size: 18px;
          opacity: 0.9;
          margin: 0 0 32px 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }

        .cta-button.primary {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
        }

        .cta-button.primary:hover {
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
          transform: translateY(-1px);
        }

        .cta-button.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .cta-button.secondary:hover {
          background: white;
          color: #1f2937;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 32px;
          }
          
          .hero-content p {
            font-size: 16px;
          }
          
          .search-inputs {
            grid-template-columns: 1fr;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .jobs-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .cta-button {
            width: 200px;
          }
        }
      `}</style>
    </div>
  )
}

export default HomePage

