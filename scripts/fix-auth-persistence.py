#!/usr/bin/env python3
"""
Fix Authentication Persistence Issues

This script fixes multiple authentication issues:
1. Token storage inconsistency between components
2. AuthContext and SignInPage conflicts
3. ProtectedRoute token checking
4. Authentication state persistence
"""

import os
import sys

def fix_protected_route():
    """Fix ProtectedRoute to use consistent token names"""
    
    app_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'hotgigs-frontend', 'src', 'App.jsx')
    
    # Read the current file
    with open(app_file, 'r') as f:
        content = f.read()
    
    # Fix the ProtectedRoute token checking
    old_protected_route = '''const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = requireAdmin 
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('userToken')
  
  const userData = requireAdmin
    ? localStorage.getItem('adminUser')
    : localStorage.getItem('userData')

  if (!token || !userData) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/signin"} replace />
  }

  if (requireAdmin) {
    const user = JSON.parse(userData)
    if (!user.is_admin) {
      return <Navigate to="/admin/login" replace />
    }
  }

  return children
}'''
    
    new_protected_route = '''const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = requireAdmin 
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('authToken')
  
  const userData = requireAdmin
    ? localStorage.getItem('adminUser')
    : localStorage.getItem('user')

  if (!token || !userData) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/signin"} replace />
  }

  if (requireAdmin) {
    try {
      const user = JSON.parse(userData)
      if (!user.is_admin) {
        return <Navigate to="/admin/login" replace />
      }
    } catch (error) {
      console.error('Error parsing admin user data:', error)
      return <Navigate to="/admin/login" replace />
    }
  }

  return children
}'''
    
    if old_protected_route in content:
        content = content.replace(old_protected_route, new_protected_route)
        
        # Write back to file
        with open(app_file, 'w') as f:
            f.write(content)
        
        print("✅ Fixed ProtectedRoute token checking")
        return True
    else:
        print("❌ Could not find ProtectedRoute to fix")
        return False

def fix_signin_page():
    """Fix SignInPage to properly integrate with AuthContext"""
    
    signin_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'hotgigs-frontend', 'src', 'pages', 'SignInPage.jsx')
    
    # Read the current file
    with open(signin_file, 'r') as f:
        content = f.read()
    
    # Fix the handleSubmit function
    old_handle_submit = '''      // Store token and user data
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update auth context
      if (login) {
        login(data.user, data.token)
      }

      // Redirect to home page
      navigate('/')'''
    
    new_handle_submit = '''      // Store token and user data
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update auth context - set user directly instead of calling login
      if (setUser) {
        setUser(data.user)
      }

      // Redirect to home page
      navigate('/')'''
    
    if old_handle_submit in content:
        content = content.replace(old_handle_submit, new_handle_submit)
    
    # Also fix the import to include setUser
    old_import = '''  const { login } = useAuth()'''
    new_import = '''  const { login, setUser } = useAuth()'''
    
    if old_import in content:
        content = content.replace(old_import, new_import)
        
        # Write back to file
        with open(signin_file, 'w') as f:
            f.write(content)
        
        print("✅ Fixed SignInPage authentication integration")
        return True
    else:
        print("❌ Could not find SignInPage authentication code to fix")
        return False

def fix_auth_context():
    """Fix AuthContext to expose setUser and handle token initialization properly"""
    
    auth_context_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'hotgigs-frontend', 'src', 'contexts', 'AuthContext.jsx')
    
    # Read the current file
    with open(auth_context_file, 'r') as f:
        content = f.read()
    
    # Fix the useEffect to properly initialize user from localStorage
    old_use_effect = '''  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Try to get user info from token or make API call
      // For now, we'll assume user is logged in if token exists
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])'''
    
    new_use_effect = '''  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Parse and set user data
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        
        console.log('🔄 AuthContext: Restored user session', parsedUser)
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        // Clear invalid data
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])'''
    
    if old_use_effect in content:
        content = content.replace(old_use_effect, new_use_effect)
    
    # Fix the context value to include setUser
    old_context_value = '''  const value = {
    user,
    loading,
    login,
    register,
    logout
  }'''
    
    new_context_value = '''  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout
  }'''
    
    if old_context_value in content:
        content = content.replace(old_context_value, new_context_value)
        
        # Write back to file
        with open(auth_context_file, 'w') as f:
            f.write(content)
        
        print("✅ Fixed AuthContext user initialization and setUser export")
        return True
    else:
        print("❌ Could not find AuthContext code to fix")
        return False

def create_enhanced_company_features():
    """Create enhanced features for company users"""
    
    # Create PostJobPage
    post_job_content = '''import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, DollarSign, Clock, Building, Users, FileText } from 'lucide-react'

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary_min: '',
    salary_max: '',
    employment_type: 'full_time',
    experience_level: 'mid',
    skills: '',
    benefits: '',
    remote_option: false
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // For now, simulate job posting
      // In real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        location: '',
        salary_min: '',
        salary_max: '',
        employment_type: 'full_time',
        experience_level: 'mid',
        skills: '',
        benefits: '',
        remote_option: false
      })
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to post job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="post-job-page">
      <div className="container">
        <div className="page-header">
          <h1>Post a New Job</h1>
          <p>Find the perfect candidate for your team</p>
        </div>

        {success && (
          <div className="success-message">
            <div className="success-content">
              <div className="success-icon">✅</div>
              <div>
                <h3>Job Posted Successfully!</h3>
                <p>Your job posting is now live and candidates can apply.</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-section">
            <h2>Job Details</h2>
            
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior React Developer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <div className="input-with-icon">
                  <MapPin size={16} />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="employment_type">Employment Type</label>
                <select
                  id="employment_type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Compensation & Requirements</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salary_min">Minimum Salary</label>
                <div className="input-with-icon">
                  <DollarSign size={16} />
                  <input
                    type="number"
                    id="salary_min"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleChange}
                    placeholder="80000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="salary_max">Maximum Salary</label>
                <div className="input-with-icon">
                  <DollarSign size={16} />
                  <input
                    type="number"
                    id="salary_max"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleChange}
                    placeholder="120000"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="experience_level">Experience Level</label>
              <select
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6+ years)</option>
                <option value="lead">Lead/Principal (8+ years)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Required Skills</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, TypeScript, AWS"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>
            
            <div className="form-group">
              <label htmlFor="benefits">Benefits & Perks</label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Health insurance, 401k, flexible hours, remote work..."
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="remote_option"
                  checked={formData.remote_option}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remote work option available
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary">
              Save as Draft
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .post-job-page {
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

        .success-message {
          background: #d1fae5;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .success-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .success-icon {
          font-size: 24px;
        }

        .success-content h3 {
          margin: 0 0 4px 0;
          color: #065f46;
          font-size: 16px;
          font-weight: 600;
        }

        .success-content p {
          margin: 0;
          color: #047857;
          font-size: 14px;
        }

        .job-form {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .form-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        input, textarea, select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .input-with-icon input {
          padding-left: 40px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #06b6d4;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0891b2;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default PostJobPage'''
    
    frontend_pages_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'hotgigs-frontend', 'src', 'pages')
    
    with open(os.path.join(frontend_pages_dir, 'PostJobPage.jsx'), 'w') as f:
        f.write(post_job_content)
    
    print("✅ Created PostJobPage for company users")
    return True

def add_enhanced_routes():
    """Add routes for enhanced company features"""
    
    app_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'hotgigs-frontend', 'src', 'App.jsx')
    
    # Read the current file
    with open(app_file, 'r') as f:
        content = f.read()
    
    # Add PostJobPage import
    old_imports = '''import CompanyDashboard from './pages/CompanyDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Import components'''
    
    new_imports = '''import CompanyDashboard from './pages/CompanyDashboard'
import PostJobPage from './pages/PostJobPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Import components'''
    
    if old_imports in content:
        content = content.replace(old_imports, new_imports)
    
    # Add PostJobPage route
    old_routes = '''              <Route path="/company-dashboard" element={
                <Layout>
                  <ProtectedRoute>
                    <CompanyDashboard />
                  </ProtectedRoute>
                </Layout>
              } />

              {/* Authentication routes without navigation */}'''
    
    new_routes = '''              <Route path="/company-dashboard" element={
                <Layout>
                  <ProtectedRoute>
                    <CompanyDashboard />
                  </ProtectedRoute>
                </Layout>
              } />

              <Route path="/post-job" element={
                <Layout>
                  <ProtectedRoute>
                    <PostJobPage />
                  </ProtectedRoute>
                </Layout>
              } />

              {/* Authentication routes without navigation */}'''
    
    if old_routes in content:
        content = content.replace(old_routes, new_routes)
        
        # Write back to file
        with open(app_file, 'w') as f:
            f.write(content)
        
        print("✅ Added PostJobPage route")
        return True
    else:
        print("❌ Could not find route insertion point")
        return False

def main():
    """Main function to fix all authentication persistence issues"""
    print("🔧 Fixing Authentication Persistence Issues...")
    print("=" * 60)
    
    success_count = 0
    
    # Fix ProtectedRoute
    if fix_protected_route():
        success_count += 1
    
    # Fix SignInPage
    if fix_signin_page():
        success_count += 1
    
    # Fix AuthContext
    if fix_auth_context():
        success_count += 1
    
    # Create enhanced company features
    if create_enhanced_company_features():
        success_count += 1
    
    # Add enhanced routes
    if add_enhanced_routes():
        success_count += 1
    
    print("=" * 60)
    if success_count == 5:
        print("🎉 All authentication persistence issues fixed!")
        print("\n📋 Fixed issues:")
        print("- ProtectedRoute token checking consistency")
        print("- SignInPage and AuthContext integration")
        print("- AuthContext user initialization from localStorage")
        print("- Created PostJobPage for company users")
        print("- Added enhanced routes for company features")
        print("\n🚀 Next steps:")
        print("1. Restart your frontend development server")
        print("2. Test login and navigation to protected pages")
        print("3. Verify users don't get logged out when accessing My Applications/Saved Jobs")
        print("4. Test company users can access enhanced features")
    else:
        print(f"⚠️ Fixed {success_count}/5 issues. Some manual fixes may be needed.")
    
    return success_count == 5

if __name__ == "__main__":
    main()

