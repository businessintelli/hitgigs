import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [savedJobs, setSavedJobs] = useState(new Set())

  useEffect(() => {
    loadJobs()
    loadSavedJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/jobs?limit=6')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSavedJobs = () => {
    const saved = localStorage.getItem('savedJobs')
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)))
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const searchParams = new URLSearchParams()
      if (searchTerm) searchParams.append('search', searchTerm)
      
      const response = await fetch(`http://localhost:8000/api/jobs?${searchParams.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveJob = async (jobId) => {
    const token = localStorage.getItem('userToken')
    
    if (!token) {
      alert('Please sign in to save jobs')
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const newSavedJobs = new Set(savedJobs)
        if (savedJobs.has(jobId)) {
          newSavedJobs.delete(jobId)
        } else {
          newSavedJobs.add(jobId)
        }
        setSavedJobs(newSavedJobs)
        localStorage.setItem('savedJobs', JSON.stringify([...newSavedJobs]))
      }
    } catch (error) {
      console.error('Failed to save job:', error)
    }
  }

  const handleApplyJob = async (jobId) => {
    const token = localStorage.getItem('userToken')
    
    if (!token) {
      alert('Please sign in to apply for jobs')
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        alert('Application submitted successfully!')
      } else {
        alert('Failed to submit application')
      }
    } catch (error) {
      console.error('Failed to apply for job:', error)
      alert('Failed to submit application')
    }
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job with AI</h1>
          <p>Discover opportunities that match your skills and aspirations with our intelligent job matching platform</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              <div className="input-group">
                <span className="input-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="input-icon">📍</span>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="search-btn">
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose HotGigs.ai?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Matching</h3>
              <p>Our advanced AI analyzes your profile and matches you with the most relevant opportunities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Applications</h3>
              <p>Apply to multiple jobs with one click using our streamlined application process</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Top Companies</h3>
              <p>Connect with leading companies and startups looking for talented professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Career Growth</h3>
              <p>Get personalized career advice and skill recommendations to advance your career</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Job Opportunities</h2>
            <Link to="/jobs" className="view-all-btn">View All Jobs</Link>
          </div>
          
          {loading ? (
            <div className="loading-jobs">
              <div className="loading-spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="company-logo">{job.company[0]}</div>
                    <div className="job-info">
                      <h3>{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                      <p className="job-location">{job.location}</p>
                    </div>
                    <button 
                      onClick={() => handleSaveJob(job.id)}
                      className={`save-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                    >
                      {savedJobs.has(job.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  
                  <div className="job-details">
                    <div className="job-meta">
                      <span className="job-type">{job.type}</span>
                      <span className="job-salary">{job.salary}</span>
                    </div>
                    <p className="job-description">{job.description}</p>
                  </div>
                  
                  <div className="job-actions">
                    <button 
                      onClick={() => handleApplyJob(job.id)}
                      className="apply-btn"
                    >
                      Apply Now
                    </button>
                    <span className="posted-date">Posted {job.posted_date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of professionals who found their dream jobs through HotGigs.ai</p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-btn primary">Get Started Free</Link>
              <Link to="/jobs" className="cta-btn secondary">Browse Jobs</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .homepage {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #e0f2fe 0%, #e8f5e8 100%);
          padding: 80px 20px;
          text-align: center;
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
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .search-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .search-inputs {
          display: grid;
          grid-template-columns: 2fr 1fr auto;
          gap: 12px;
          background: white;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          font-size: 18px;
          z-index: 1;
        }

        .input-group input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          background: #f9fafb;
          transition: all 0.2s;
        }

        .input-group input:focus {
          outline: none;
          background: white;
          box-shadow: 0 0 0 2px #06b6d4;
        }

        .search-btn {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(6, 182, 212, 0.3);
        }

        /* Features Section */
        .features {
          padding: 80px 20px;
          background: white;
        }

        .features h2 {
          text-align: center;
          font-size: 36px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 48px 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          text-align: center;
          padding: 32px 24px;
          border-radius: 16px;
          background: #f9fafb;
          transition: all 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
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

        /* Jobs Section */
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

        .view-all-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }

        .loading-jobs {
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
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 24px;
        }

        .job-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .job-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        .company-logo {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
          flex-shrink: 0;
        }

        .job-info {
          flex: 1;
        }

        .job-info h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .company-name {
          color: #6b7280;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .job-location {
          color: #9ca3af;
          font-size: 14px;
          margin: 0;
        }

        .save-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .save-btn:hover {
          background: #f3f4f6;
        }

        .job-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .job-type {
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .job-salary {
          background: #d1fae5;
          color: #065f46;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .job-description {
          color: #6b7280;
          line-height: 1.5;
          margin: 0 0 20px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .job-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
        }

        .apply-btn {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .apply-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(6, 182, 212, 0.3);
        }

        .posted-date {
          color: #9ca3af;
          font-size: 12px;
        }

        /* CTA Section */
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

        .cta-btn {
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }

        .cta-btn.primary {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          color: white;
        }

        .cta-btn.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 36px;
          }
          
          .hero-content p {
            font-size: 18px;
          }
          
          .search-inputs {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .jobs-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
}

export default HomePage

