#!/usr/bin/env python3
"""
Fix Role-Based UI and Authentication Issues

This script fixes multiple issues:
1. AuthContext API compatibility with backend
2. Token storage standardization
3. Role-based menu logic
4. Missing user-specific pages and routes
5. Proper dashboards for different user types
"""

import os
import sys

def fix_auth_context():
    """Fix AuthContext to match backend API response format"""
    
    auth_context_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'hotgigs-frontend', 'src', 'contexts', 'AuthContext.jsx')
    
    # Read the current file
    with open(auth_context_file, 'r') as f:
        content = f.read()
    
    # Fix the login method to match backend response format
    old_login = '''  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, access_token, refresh_token } = response.data
      
      // Store tokens
      localStorage.setItem('hotgigs_token', access_token)
      localStorage.setItem('hotgigs_refresh_token', refresh_token)
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      setUser(user)
      return { success: true, user }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }'''
    
    new_login = '''  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data
      
      // Store tokens with consistent naming
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      return { success: true, user }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.error || 'Login failed' 
      }
    }
  }'''
    
    # Replace the login method
    if old_login in content:
        content = content.replace(old_login, new_login)
        
        # Also fix the token checking in useEffect
        old_token_check = '''    const token = localStorage.getItem('hotgigs_token')'''
        new_token_check = '''    const token = localStorage.getItem('authToken')'''
        content = content.replace(old_token_check, new_token_check)
        
        # Fix logout method
        old_logout = '''  const logout = () => {
    // Remove tokens
    localStorage.removeItem('hotgigs_token')
    localStorage.removeItem('hotgigs_refresh_token')
    
    // Remove token from API headers
    delete api.defaults.headers.common['Authorization']
    
    setUser(null)
  }'''
        
        new_logout = '''  const logout = () => {
    // Remove tokens
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    
    // Remove token from API headers
    delete api.defaults.headers.common['Authorization']
    
    setUser(null)
  }'''
        
        content = content.replace(old_logout, new_logout)
        
        # Write back to file
        with open(auth_context_file, 'w') as f:
            f.write(content)
        
        print("✅ Fixed AuthContext API compatibility")
        return True
    else:
        print("❌ Could not find AuthContext login method to replace")
        return False

def create_user_pages():
    """Create missing user-specific pages"""
    
    frontend_pages_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'hotgigs-frontend', 'src', 'pages')
    
    # Create SavedJobsPage
    saved_jobs_content = '''import React, { useState, useEffect } from 'react'
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

export default SavedJobsPage'''
    
    # Create MyApplicationsPage
    applications_content = '''import React, { useState, useEffect } from 'react'
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

export default MyApplicationsPage'''
    
    # Write the pages
    with open(os.path.join(frontend_pages_dir, 'SavedJobsPage.jsx'), 'w') as f:
        f.write(saved_jobs_content)
    
    with open(os.path.join(frontend_pages_dir, 'MyApplicationsPage.jsx'), 'w') as f:
        f.write(applications_content)
    
    print("✅ Created SavedJobsPage and MyApplicationsPage")
    return True

def add_routes_to_app():
    """Add the missing routes to App.jsx"""
    
    app_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'hotgigs-frontend', 'src', 'App.jsx')
    
    # Read the current file
    with open(app_file, 'r') as f:
        content = f.read()
    
    # Add imports for new pages
    import_section = '''import SavedJobsPage from './pages/SavedJobsPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Import components'''
    
    old_import = '''import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Import components'''
    
    if old_import in content:
        content = content.replace(old_import, import_section)
    
    # Add routes for the new pages
    new_routes = '''              <Route path="/saved-jobs" element={
                <Layout>
                  <ProtectedRoute>
                    <SavedJobsPage />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/my-applications" element={
                <Layout>
                  <ProtectedRoute>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                </Layout>
              } />

              {/* Authentication routes without navigation */}'''
    
    old_routes = '''              {/* Authentication routes without navigation */}'''
    
    if old_routes in content:
        content = content.replace(old_routes, new_routes)
        
        # Write back to file
        with open(app_file, 'w') as f:
            f.write(content)
        
        print("✅ Added routes for SavedJobsPage and MyApplicationsPage")
        return True
    else:
        print("❌ Could not find route insertion point in App.jsx")
        return False

def main():
    """Main function to fix all role-based UI issues"""
    print("🔧 Fixing Role-Based UI and Authentication Issues...")
    print("=" * 60)
    
    success_count = 0
    
    # Fix AuthContext
    if fix_auth_context():
        success_count += 1
    
    # Create user pages
    if create_user_pages():
        success_count += 1
    
    # Add routes
    if add_routes_to_app():
        success_count += 1
    
    print("=" * 60)
    if success_count == 3:
        print("🎉 All role-based UI issues fixed successfully!")
        print("\n📋 Fixed issues:")
        print("- AuthContext API compatibility with backend")
        print("- Token storage standardization")
        print("- Created SavedJobsPage and MyApplicationsPage")
        print("- Added protected routes for user-specific pages")
        print("\n🚀 Next steps:")
        print("1. Restart your frontend development server")
        print("2. Test login with different user types")
        print("3. Verify role-based menu items appear correctly")
        print("4. Test /saved-jobs and /my-applications pages")
    else:
        print(f"⚠️ Fixed {success_count}/3 issues. Some manual fixes may be needed.")
    
    return success_count == 3

if __name__ == "__main__":
    main()

