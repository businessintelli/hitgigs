import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        // Store admin token
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid admin credentials')
      }
    } catch (err) {
      setError('Connection error. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-shield-icon">🛡️</div>
          <h1>Super Admin Access</h1>
          <p>Secure administrative portal for HotGigs.ai</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="admin@hotgigs.ai"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="admin-login-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Authenticating...
              </>
            ) : (
              <>
                <span className="login-icon">🔐</span>
                Access Admin Panel
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <div className="security-notice">
            <span className="security-icon">🔒</span>
            <span>Secure connection • Admin access only</span>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="back-to-site-btn"
          >
            ← Back to Main Site
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .admin-login-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 420px;
          border: 1px solid #e5e7eb;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .admin-shield-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .admin-login-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .admin-login-header p {
          color: #6b7280;
          font-size: 16px;
          margin: 0;
        }

        .admin-login-form {
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
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

        .admin-login-btn {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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

        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .admin-login-btn:disabled {
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .admin-login-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .security-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .back-to-site-btn {
          background: none;
          border: 1px solid #d1d5db;
          color: #6b7280;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-to-site-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        @media (max-width: 480px) {
          .admin-login-card {
            padding: 24px;
            margin: 10px;
          }
          
          .admin-login-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminLogin

