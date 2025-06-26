import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const { login, setUser } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed')
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update auth context - set user directly instead of calling login
      if (setUser) {
        setUser(data.user)
      }

      // Redirect to dashboard page
      navigate('/dashboard')
      
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your HotGigs.ai account</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="signin-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="signin-footer">
          <p>
            Don't have an account? 
            <Link to="/signup" className="signup-link">Sign Up</Link>
          </p>
          
          <div className="demo-accounts">
            <h3>Demo Accounts</h3>
            <div className="demo-list">
              <div className="demo-account">
                <strong>Job Seeker:</strong> john@example.com / user123
              </div>
              <div className="demo-account">
                <strong>Company:</strong> hr@techcorp.com / company123
              </div>
              <div className="demo-account">
                <strong>Recruiter:</strong> alice@recruiter.com / recruiter123
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signin-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 100%);
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .signin-container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          width: 100%;
          max-width: 400px;
        }

        .signin-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .signin-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .signin-header p {
          color: #6b7280;
          font-size: 16px;
          margin: 0;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .signin-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .form-group input {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .form-group input:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .signin-button {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .signin-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
          transform: translateY(-1px);
        }

        .signin-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .signin-footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        .signin-footer p {
          margin: 0 0 24px 0;
        }

        .signup-link {
          color: #06b6d4;
          text-decoration: none;
          font-weight: 500;
          margin-left: 4px;
        }

        .signup-link:hover {
          text-decoration: underline;
        }

        .demo-accounts {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          text-align: left;
        }

        .demo-accounts h3 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px 0;
          text-align: center;
        }

        .demo-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .demo-account {
          font-size: 12px;
          color: #6b7280;
          padding: 6px 8px;
          background: white;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .demo-account strong {
          color: #374151;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .signin-container {
            padding: 24px;
            margin: 16px;
          }
          
          .signin-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}

export default SignInPage

