import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user token and data
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        
        // Redirect based on user role
        if (data.user.role === 'company') {
          navigate('/company-dashboard')
        } else if (data.user.role === 'recruiter') {
          navigate('/recruiter-dashboard')
        } else {
          navigate('/user-dashboard')
        }
      } else {
        setError(data.detail || 'Registration failed')
      }
    } catch (err) {
      setError('Connection error. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignup = (provider) => {
    // Placeholder for social signup implementation
    alert(`${provider} signup will be implemented soon!`)
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Join HotGigs.ai</h1>
          <p>Create your account and start your career journey</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="user">Job Seeker</option>
              <option value="company">Company</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
              minLength="6"
            />
          </div>

          <div className="terms-agreement">
            <label className="terms-checkbox">
              <input type="checkbox" required />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="terms-link">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or sign up with</span>
        </div>

        <div className="social-signup">
          <button 
            onClick={() => handleSocialSignup('Google')} 
            className="social-btn google"
          >
            <span className="social-icon">🔍</span>
            Google
          </button>
          <button 
            onClick={() => handleSocialSignup('LinkedIn')} 
            className="social-btn linkedin"
          >
            <span className="social-icon">💼</span>
            LinkedIn
          </button>
          <button 
            onClick={() => handleSocialSignup('GitHub')} 
            className="social-btn github"
          >
            <span className="social-icon">🐙</span>
            GitHub
          </button>
        </div>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/signin" className="signin-link">
              Sign in here
            </Link>
          </p>
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .signup-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #e8f5e8 0%, #e0f2fe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .signup-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 420px;
          border: 1px solid #e5e7eb;
        }

        .signup-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .signup-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .signup-header p {
          color: #6b7280;
          font-size: 16px;
          margin: 0;
        }

        .signup-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .terms-agreement {
          margin-bottom: 24px;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
          cursor: pointer;
          line-height: 1.5;
        }

        .terms-checkbox input {
          width: auto;
          margin: 0;
          margin-top: 2px;
        }

        .terms-link {
          color: #10b981;
          text-decoration: none;
          font-weight: 500;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .signup-btn {
          width: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
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

        .signup-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }

        .signup-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .divider {
          text-align: center;
          margin: 24px 0;
          position: relative;
          color: #6b7280;
          font-size: 14px;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
          z-index: 1;
        }

        .divider span {
          background: white;
          padding: 0 16px;
          position: relative;
          z-index: 2;
        }

        .social-signup {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .social-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 8px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }

        .social-btn:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .social-icon {
          font-size: 20px;
        }

        .signup-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .signup-footer p {
          margin: 0 0 16px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .signin-link {
          color: #10b981;
          text-decoration: none;
          font-weight: 600;
        }

        .signin-link:hover {
          text-decoration: underline;
        }

        .back-home {
          color: #6b7280;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .back-home:hover {
          color: #374151;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .signup-card {
            padding: 24px;
            margin: 10px;
          }
          
          .signup-header h1 {
            font-size: 24px;
          }
          
          .social-signup {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default SignUpPage

