import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adminData, setAdminData] = useState({
    statistics: {},
    users: [],
    companies: [],
    database_schema: [],
    recent_logs: []
  })
  const [userFilter, setUserFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const navigate = useNavigate()

  useEffect(() => {
    loadAdminData()
  }, [])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
      return null
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const loadAdminData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const headers = getAuthHeaders()
      if (!headers) return

      // Load statistics and database info
      const [statsResponse, usersResponse, companiesResponse] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats', { headers }),
        fetch('http://localhost:8000/api/admin/users', { headers }),
        fetch('http://localhost:8000/api/admin/companies', { headers })
      ])

      if (!statsResponse.ok || !usersResponse.ok || !companiesResponse.ok) {
        throw new Error('Failed to load admin data')
      }

      const [statsData, usersData, companiesData] = await Promise.all([
        statsResponse.json(),
        usersResponse.json(),
        companiesResponse.json()
      ])

      setAdminData({
        statistics: statsData.statistics || {},
        database_schema: statsData.database_schema || [],
        recent_logs: statsData.recent_logs || [],
        users: usersData.users || [],
        companies: companiesData.companies || []
      })
    } catch (err) {
      setError('Failed to load admin data: ' + err.message)
      console.error('Admin data loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusChange = async (userId, isActive) => {
    try {
      const headers = getAuthHeaders()
      if (!headers) return

      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ is_active: isActive })
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      // Reload data
      await loadAdminData()
      
      const action = isActive ? 'enabled' : 'disabled'
      alert(`User ${action} successfully`)
    } catch (err) {
      alert('Failed to update user status: ' + err.message)
    }
  }

  const handleCompanyStatusChange = async (companyId, isActive) => {
    try {
      const headers = getAuthHeaders()
      if (!headers) return

      const response = await fetch(`http://localhost:8000/api/admin/companies/${companyId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ is_active: isActive })
      })

      if (!response.ok) {
        throw new Error('Failed to update company status')
      }

      // Reload data
      await loadAdminData()
      
      const action = isActive ? 'enabled' : 'disabled'
      alert(`Company ${action} successfully`)
    } catch (err) {
      alert('Failed to update company status: ' + err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  const filteredUsers = adminData.users.filter(user => {
    const matchesFilter = userFilter === 'all' || user.role === userFilter
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
        <div className="header-content">
          <h1>🛡️ HotGigs.ai Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={() => loadAdminData()} className="refresh-btn">
              🔄 Refresh
            </button>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

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
          👥 Users ({adminData.users.length})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          🏢 Companies ({adminData.companies.length})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'database' ? 'active' : ''}`}
          onClick={() => setActiveTab('database')}
        >
          🗄️ Database
        </button>
        <button 
          className={`nav-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📝 System Logs
        </button>
      </nav>

      {/* Content */}
      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>System Overview</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p className="stat-number">{adminData.statistics.total_users || 0}</p>
                  <span className="stat-detail">
                    {adminData.statistics.active_users || 0} active
                  </span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-info">
                  <h3>Companies</h3>
                  <p className="stat-number">{adminData.statistics.total_companies || 0}</p>
                  <span className="stat-detail">
                    {adminData.statistics.active_companies || 0} active
                  </span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💼</div>
                <div className="stat-info">
                  <h3>Job Listings</h3>
                  <p className="stat-number">{adminData.statistics.total_jobs || 0}</p>
                  <span className="stat-detail">
                    {adminData.statistics.active_jobs || 0} active
                  </span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-info">
                  <h3>Applications</h3>
                  <p className="stat-number">{adminData.statistics.total_applications || 0}</p>
                  <span className="stat-detail">Total submitted</span>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent System Activity</h3>
              <div className="activity-list">
                {adminData.recent_logs.slice(0, 5).map((log, index) => (
                  <div key={index} className="activity-item">
                    <span className={`activity-level ${log.level.toLowerCase()}`}>
                      {log.level}
                    </span>
                    <span className="activity-message">{log.message}</span>
                    <span className="activity-time">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>User Management</h2>
              <div className="section-controls">
                <select 
                  value={userFilter} 
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Users</option>
                  <option value="user">Job Seekers</option>
                  <option value="company">Companies</option>
                  <option value="recruiter">Recruiters</option>
                  <option value="admin">Admins</option>
                </select>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td>
                        <button
                          onClick={() => handleUserStatusChange(user.id, !user.is_active)}
                          className={`action-btn ${user.is_active ? 'disable' : 'enable'}`}
                        >
                          {user.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="companies-section">
            <h2>Company Management</h2>
            
            <div className="companies-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Website</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.companies.map(company => (
                    <tr key={company.id}>
                      <td>{company.id}</td>
                      <td>{company.name}</td>
                      <td>{company.email}</td>
                      <td>
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            {company.website}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${company.is_active ? 'active' : 'inactive'}`}>
                          {company.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(company.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleCompanyStatusChange(company.id, !company.is_active)}
                          className={`action-btn ${company.is_active ? 'disable' : 'enable'}`}
                        >
                          {company.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="database-section">
            <h2>Database Structure</h2>
            
            <div className="database-tables">
              {adminData.database_schema.map(table => (
                <div key={table.name} className="table-info">
                  <div className="table-header">
                    <h3>📋 {table.name}</h3>
                    <span className="row-count">{table.row_count} rows</span>
                  </div>
                  
                  <div className="table-columns">
                    <table>
                      <thead>
                        <tr>
                          <th>Column</th>
                          <th>Type</th>
                          <th>Constraints</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((column, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{column.name}</strong>
                              {column.primary_key && <span className="pk-badge">PK</span>}
                            </td>
                            <td>{column.type}</td>
                            <td>
                              {column.not_null && <span className="constraint">NOT NULL</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-section">
            <h2>System Logs</h2>
            
            <div className="logs-list">
              {adminData.recent_logs.map((log, index) => (
                <div key={index} className={`log-entry ${log.level.toLowerCase()}`}>
                  <div className="log-header">
                    <span className="log-level">{log.level}</span>
                    <span className="log-time">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="log-message">{log.message}</div>
                  {log.details && (
                    <div className="log-details">{log.details}</div>
                  )}
                  {log.user_name && (
                    <div className="log-user">User: {log.user_name}</div>
                  )}
                </div>
              ))}
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
          border-top: 4px solid #06b6d4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 24px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-content h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .refresh-btn, .logout-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .refresh-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .refresh-btn:hover {
          background: #e5e7eb;
        }

        .logout-btn {
          background: #dc2626;
          color: white;
        }

        .logout-btn:hover {
          background: #b91c1c;
        }

        .error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .close-error {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #dc2626;
        }

        .admin-nav {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 24px;
          display: flex;
          gap: 0;
          max-width: 1400px;
          margin: 0 auto;
        }

        .nav-tab {
          padding: 16px 20px;
          border: none;
          background: none;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .nav-tab:hover {
          color: #374151;
          background: #f9fafb;
        }

        .nav-tab.active {
          color: #06b6d4;
          border-bottom-color: #06b6d4;
        }

        .admin-content {
          max-width: 1400px;
          margin: 0 auto;
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
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdff;
          border-radius: 12px;
        }

        .stat-info h3 {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .stat-detail {
          font-size: 12px;
          color: #9ca3af;
        }

        .recent-activity {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
        }

        .recent-activity h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .activity-level {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .activity-level.info {
          background: #dbeafe;
          color: #1e40af;
        }

        .activity-level.error {
          background: #fef2f2;
          color: #dc2626;
        }

        .activity-message {
          flex: 1;
          font-size: 14px;
          color: #374151;
        }

        .activity-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .section-controls {
          display: flex;
          gap: 12px;
        }

        .filter-select, .search-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .search-input {
          width: 200px;
        }

        .users-table, .companies-table {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .users-table table, .companies-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th, .companies-table th,
        .users-table td, .companies-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }

        .users-table th, .companies-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .users-table td, .companies-table td {
          font-size: 14px;
          color: #6b7280;
        }

        .role-badge, .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .role-badge.user {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-badge.company {
          background: #d1fae5;
          color: #065f46;
        }

        .role-badge.recruiter {
          background: #fef3c7;
          color: #92400e;
        }

        .role-badge.admin {
          background: #fce7f3;
          color: #be185d;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .action-btn.enable {
          background: #d1fae5;
          color: #065f46;
        }

        .action-btn.disable {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn:hover {
          opacity: 0.8;
        }

        .database-tables {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .table-info {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .row-count {
          font-size: 14px;
          color: #6b7280;
          background: #e5e7eb;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .table-columns table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-columns th,
        .table-columns td {
          padding: 12px 20px;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
        }

        .table-columns th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .pk-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
          margin-left: 8px;
        }

        .constraint {
          background: #e5e7eb;
          color: #374151;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .log-entry {
          background: white;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-left: 4px solid #d1d5db;
        }

        .log-entry.info {
          border-left-color: #06b6d4;
        }

        .log-entry.error {
          border-left-color: #dc2626;
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .log-level {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .log-message {
          font-size: 14px;
          color: #374151;
          margin-bottom: 4px;
        }

        .log-details {
          font-size: 12px;
          color: #6b7280;
          font-family: monospace;
          background: #f9fafb;
          padding: 8px;
          border-radius: 4px;
          margin-top: 8px;
        }

        .log-user {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 4px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 16px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .section-controls {
            width: 100%;
          }
          
          .search-input {
            width: 100%;
          }
          
          .users-table, .companies-table {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard

