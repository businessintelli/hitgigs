import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [adminUser, setAdminUser] = useState(null)
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [errors, setErrors] = useState([])
  const [dbTables, setDbTables] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (!token || !user) {
      navigate('/admin/login')
      return
    }

    setAdminUser(JSON.parse(user))
    loadDashboardData()
  }, [navigate])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // Load all admin data
      const [statsRes, usersRes, companiesRes, errorsRes, tablesRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats', { headers }),
        fetch('http://localhost:8000/api/admin/users', { headers }),
        fetch('http://localhost:8000/api/admin/companies', { headers }),
        fetch('http://localhost:8000/api/admin/errors', { headers }),
        fetch('http://localhost:8000/api/admin/database/tables', { headers })
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (usersRes.ok) setUsers((await usersRes.json()).users || [])
      if (companiesRes.ok) setCompanies((await companiesRes.json()).companies || [])
      if (errorsRes.ok) setErrors((await errorsRes.json()).errors || [])
      if (tablesRes.ok) setDbTables((await tablesRes.json()).tables || [])

    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        loadDashboardData() // Reload data
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error)
    }
  }

  const handleCompanyAction = async (companyId, action) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:8000/api/admin/companies/${companyId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        loadDashboardData() // Reload data
      }
    } catch (error) {
      console.error(`Failed to ${action} company:`, error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>🛡️ Super Admin Dashboard</h1>
          <span className="admin-subtitle">HotGigs.ai Management Portal</span>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">Welcome, {adminUser?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`nav-tab ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          🏢 Companies
        </button>
        <button 
          className={`nav-tab ${activeTab === 'errors' ? 'active' : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          🚨 Errors
        </button>
        <button 
          className={`nav-tab ${activeTab === 'database' ? 'active' : ''}`}
          onClick={() => setActiveTab('database')}
        >
          🗄️ Database
        </button>
        <button 
          className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      {/* Content */}
      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.total_users || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-info">
                  <h3>{stats.total_companies || 0}</h3>
                  <p>Companies</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💼</div>
                <div className="stat-info">
                  <h3>{stats.total_jobs || 0}</h3>
                  <p>Active Jobs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>{stats.total_applications || 0}</h3>
                  <p>Applications</p>
                </div>
              </div>
            </div>

            <div className="system-health">
              <h2>System Health</h2>
              <div className="health-metrics">
                <div className="metric">
                  <span className="metric-label">Uptime:</span>
                  <span className="metric-value">{stats.system_uptime || '99.9%'}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Response Time:</span>
                  <span className="metric-value">{stats.avg_response_time || '120ms'}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Error Rate:</span>
                  <span className="metric-value">{stats.error_rate || '0.1%'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="tab-header">
              <h2>User Management</h2>
              <div className="user-stats">
                <span>Total: {users.length}</span>
                <span>Active: {users.filter(u => u.status === 'active').length}</span>
                <span>Suspended: {users.filter(u => u.status === 'suspended').length}</span>
              </div>
            </div>
            
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status}`}>{user.status}</span>
                      </td>
                      <td>{user.last_login || 'Never'}</td>
                      <td>
                        <div className="action-buttons">
                          {user.status === 'active' ? (
                            <button 
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              className="action-btn suspend"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUserAction(user.id, 'activate')}
                              className="action-btn activate"
                            >
                              Activate
                            </button>
                          )}
                          <button 
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="action-btn delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="companies-tab">
            <div className="tab-header">
              <h2>Company Management</h2>
              <div className="company-stats">
                <span>Total: {companies.length}</span>
                <span>Active: {companies.filter(c => c.status === 'active').length}</span>
                <span>Suspended: {companies.filter(c => c.status === 'suspended').length}</span>
              </div>
            </div>
            
            <div className="companies-table">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Jobs Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(company => (
                    <tr key={company.id}>
                      <td>
                        <div className="company-info">
                          <div className="company-logo">{company.name?.[0]?.toUpperCase()}</div>
                          <span>{company.name}</span>
                        </div>
                      </td>
                      <td>{company.industry}</td>
                      <td>{company.size}</td>
                      <td>
                        <span className={`status-badge ${company.status}`}>{company.status}</span>
                      </td>
                      <td>{company.jobs_count || 0}</td>
                      <td>
                        <div className="action-buttons">
                          {company.status === 'active' ? (
                            <button 
                              onClick={() => handleCompanyAction(company.id, 'suspend')}
                              className="action-btn suspend"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleCompanyAction(company.id, 'activate')}
                              className="action-btn activate"
                            >
                              Activate
                            </button>
                          )}
                          <button 
                            onClick={() => handleCompanyAction(company.id, 'delete')}
                            className="action-btn delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="errors-tab">
            <div className="tab-header">
              <h2>Application Errors</h2>
              <div className="error-stats">
                <span>Total: {errors.length}</span>
                <span>Critical: {errors.filter(e => e.level === 'critical').length}</span>
                <span>Warnings: {errors.filter(e => e.level === 'warning').length}</span>
              </div>
            </div>
            
            <div className="errors-list">
              {errors.map(error => (
                <div key={error.id} className={`error-item ${error.level}`}>
                  <div className="error-header">
                    <span className="error-level">{error.level.toUpperCase()}</span>
                    <span className="error-time">{error.timestamp}</span>
                  </div>
                  <div className="error-message">{error.message}</div>
                  <div className="error-details">
                    <span>File: {error.file}</span>
                    <span>Line: {error.line}</span>
                    <span>User: {error.user_id || 'Anonymous'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="database-tab">
            <div className="tab-header">
              <h2>Database Structure</h2>
              <div className="db-stats">
                <span>Tables: {dbTables.length}</span>
                <span>Total Records: {dbTables.reduce((sum, table) => sum + (table.row_count || 0), 0)}</span>
              </div>
            </div>
            
            <div className="tables-grid">
              {dbTables.map(table => (
                <div key={table.name} className="table-card">
                  <div className="table-header">
                    <h3>{table.name}</h3>
                    <span className="table-count">{table.row_count || 0} rows</span>
                  </div>
                  <div className="table-columns">
                    {table.columns?.map(column => (
                      <div key={column.name} className="column-item">
                        <span className="column-name">{column.name}</span>
                        <span className="column-type">{column.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="tab-header">
              <h2>System Settings</h2>
            </div>
            
            <div className="settings-sections">
              <div className="settings-section">
                <h3>Application Settings</h3>
                <div className="setting-item">
                  <label>Maintenance Mode</label>
                  <button className="toggle-btn">Disabled</button>
                </div>
                <div className="setting-item">
                  <label>User Registration</label>
                  <button className="toggle-btn active">Enabled</button>
                </div>
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <button className="toggle-btn active">Enabled</button>
                </div>
              </div>

              <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="setting-item">
                  <label>Two-Factor Authentication</label>
                  <button className="toggle-btn">Disabled</button>
                </div>
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input type="number" value="30" className="setting-input" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .admin-subtitle {
          color: #6b7280;
          font-size: 14px;
        }

        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-user {
          color: #374151;
          font-weight: 500;
        }

        .logout-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .admin-nav {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 24px;
          display: flex;
          gap: 8px;
        }

        .nav-tab {
          background: none;
          border: none;
          padding: 16px 20px;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .nav-tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .admin-content {
          padding: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          background: #f3f4f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .stat-info p {
          color: #6b7280;
          margin: 4px 0 0 0;
        }

        .system-health {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
        }

        .system-health h2 {
          margin: 0 0 16px 0;
          color: #1f2937;
        }

        .health-metrics {
          display: flex;
          gap: 32px;
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-label {
          color: #6b7280;
          font-size: 14px;
        }

        .metric-value {
          font-weight: 600;
          color: #1f2937;
          font-size: 18px;
        }

        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .tab-header h2 {
          margin: 0;
          color: #1f2937;
        }

        .user-stats, .company-stats, .error-stats, .db-stats {
          display: flex;
          gap: 16px;
          color: #6b7280;
          font-size: 14px;
        }

        .users-table, .companies-table {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }

        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .user-info, .company-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar, .company-logo {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .role-badge, .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .role-badge.admin { background: #fef3c7; color: #92400e; }
        .role-badge.user { background: #dbeafe; color: #1e40af; }
        .role-badge.company { background: #d1fae5; color: #065f46; }

        .status-badge.active { background: #d1fae5; color: #065f46; }
        .status-badge.suspended { background: #fee2e2; color: #dc2626; }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
        }

        .action-btn.activate { background: #d1fae5; color: #065f46; }
        .action-btn.suspend { background: #fef3c7; color: #92400e; }
        .action-btn.delete { background: #fee2e2; color: #dc2626; }

        .errors-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .error-item {
          background: white;
          border-radius: 8px;
          padding: 16px;
          border-left: 4px solid #6b7280;
        }

        .error-item.critical { border-left-color: #dc2626; }
        .error-item.warning { border-left-color: #f59e0b; }

        .error-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .error-level {
          font-weight: 600;
          font-size: 12px;
        }

        .error-time {
          color: #6b7280;
          font-size: 12px;
        }

        .error-message {
          color: #1f2937;
          margin-bottom: 8px;
        }

        .error-details {
          display: flex;
          gap: 16px;
          color: #6b7280;
          font-size: 12px;
        }

        .tables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .table-card {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 16px;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .table-header h3 {
          margin: 0;
          color: #1f2937;
        }

        .table-count {
          color: #6b7280;
          font-size: 12px;
        }

        .table-columns {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .column-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: #f9fafb;
          border-radius: 4px;
        }

        .column-name {
          font-weight: 500;
          color: #374151;
        }

        .column-type {
          color: #6b7280;
          font-size: 12px;
          font-family: monospace;
        }

        .settings-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .settings-section {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 24px;
        }

        .settings-section h3 {
          margin: 0 0 16px 0;
          color: #1f2937;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .toggle-btn {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 12px;
        }

        .toggle-btn.active {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .setting-input {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          width: 80px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          
          .admin-nav {
            overflow-x: auto;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .health-metrics {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard

