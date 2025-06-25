import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const SignInPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
        body: JSON.stringify(credentials),
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
        setError(data.detail || 'Invalid credentials')
      }
    } catch (err) {
      setError('Connection error. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    // Placeholder for social login implementation
    alert(`${provider} login will be implemented soon!`)
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your HotGigs.ai account</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="signin-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          <button 
            onClick={() => handleSocialLogin('Google')} 
            className="social-btn google"
          >
            <span className="social-icon">🔍</span>
            Google
          </button>
          <button 
            onClick={() => handleSocialLogin('LinkedIn')} 
            className="social-btn linkedin"
          >
            <span className="social-icon">💼</span>
            LinkedIn
          </button>
          <button 
            onClick={() => handleSocialLogin('GitHub')} 
            className="social-btn github"
          >
            <span className="social-icon">🐙</span>
            GitHub
          </button>
        </div>

        <div className="signin-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up for free
            </Link>
          </p>
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .signin-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f2fe 0%, #e8f5e8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .signin-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 420px;
          border: 1px solid #e5e7eb;
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

        .signin-form {
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

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
          cursor: pointer;
        }

        .remember-me input {
          width: auto;
          margin: 0;
        }

        .forgot-password {
          color: #06b6d4;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .forgot-password:hover {
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

        .signin-btn {
          width: 100%;
          background: linear-gradient(135deg, #06b6d4, #0891b2);
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

        .signin-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(6, 182, 212, 0.3);
        }

        .signin-btn:disabled {
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

        .social-login {
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
          border-color: #06b6d4;
          background: #f0fdff;
        }

        .social-icon {
          font-size: 20px;
        }

        .signin-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .signin-footer p {
          margin: 0 0 16px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .signup-link {
          color: #06b6d4;
          text-decoration: none;
          font-weight: 600;
        }

        .signup-link:hover {
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
          .signin-card {
            padding: 24px;
            margin: 10px;
          }
          
          .signin-header h1 {
            font-size: 24px;
          }
          
          .social-login {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default SignInPage

