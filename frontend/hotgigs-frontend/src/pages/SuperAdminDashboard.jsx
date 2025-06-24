import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  Activity, 
  AlertTriangle,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Clock,
  Globe
} from 'lucide-react'

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-06-24 10:30 AM',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'company',
      status: 'active',
      lastLogin: '2024-06-24 09:15 AM',
      joinDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@recruiter.com',
      role: 'recruiter',
      status: 'suspended',
      lastLogin: '2024-06-20 02:45 PM',
      joinDate: '2024-03-10'
    }
  ])

  const [systemStats, setSystemStats] = useState({
    totalUsers: 15420,
    activeUsers: 12350,
    totalJobs: 8750,
    totalApplications: 45600,
    systemUptime: '99.9%',
    avgResponseTime: '120ms',
    errorRate: '0.1%',
    storageUsed: '2.4TB'
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleUserAction = (userId, action) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'activate':
            return { ...user, status: 'active' }
          case 'suspend':
            return { ...user, status: 'suspended' }
          case 'delete':
            return null
          default:
            return user
        }
      }
      return user
    }).filter(Boolean))
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'User Management', icon: <Users size={20} /> },
    { id: 'system', label: 'System Settings', icon: <Settings size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'database', label: 'Database', icon: <Database size={20} /> }
  ]

  const renderOverview = () => (
    <div className="space-y-8">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{systemStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="icon-container bg-blue-100">
              <Users size={24} color="#2563eb" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{systemStats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="icon-container bg-green-100">
              <UserCheck size={24} color="#16a34a" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-purple-600">{systemStats.totalJobs.toLocaleString()}</p>
            </div>
            <div className="icon-container bg-purple-100">
              <TrendingUp size={24} color="#9333ea" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-orange-600">{systemStats.totalApplications.toLocaleString()}</p>
            </div>
            <div className="icon-container bg-orange-100">
              <Activity size={24} color="#ea580c" />
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Uptime</span>
              <span className="font-semibold text-green-600">{systemStats.systemUptime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Response Time</span>
              <span className="font-semibold text-blue-600">{systemStats.avgResponseTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Error Rate</span>
              <span className="font-semibold text-green-600">{systemStats.errorRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Storage Used</span>
              <span className="font-semibold text-yellow-600">{systemStats.storageUsed}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New user registration: jane@example.com</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Job posted: Senior Developer at TechCorp</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">System maintenance completed</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Security alert: Failed login attempts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3" size={20} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3" size={20} color="#9ca3af" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input pl-10"
            >
              <option value="all">All Roles</option>
              <option value="user">Job Seekers</option>
              <option value="company">Companies</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Login</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge" style={{
                      backgroundColor: user.role === 'admin' ? '#dbeafe' : 
                                     user.role === 'company' ? '#dcfce7' : 
                                     user.role === 'recruiter' ? '#fef3c7' : '#f3f4f6',
                      color: user.role === 'admin' ? '#1d4ed8' : 
                             user.role === 'company' ? '#166534' : 
                             user.role === 'recruiter' ? '#92400e' : '#374151'
                    }}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${user.status === 'active' ? 'badge-success' : ''}`} style={{
                      backgroundColor: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: user.status === 'active' ? '#166534' : '#dc2626'
                    }}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                        >
                          <UserX size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <UserCheck size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input type="text" defaultValue="HotGigs.ai" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Mode</label>
              <select className="input">
                <option>Disabled</option>
                <option>Enabled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max File Upload Size</label>
              <input type="text" defaultValue="10MB" className="input" />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
              <input type="text" defaultValue="smtp.hotgigs.ai" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
              <input type="email" defaultValue="noreply@hotgigs.ai" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Notifications</label>
              <select className="input">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (requests/minute)</label>
            <input type="number" defaultValue="1000" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Version</label>
            <input type="text" defaultValue="v1" className="input" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary">Save Settings</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container bg-red-100">
              <Shield size={24} color="#dc2626" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600">Manage and monitor the entire HotGigs.ai platform</p>
            </div>
          </div>
          
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle size={20} color="#dc2626" />
            <div>
              <p className="text-red-800 font-medium">Super Admin Access</p>
              <p className="text-red-600 text-sm">You have full administrative privileges. Use with caution.</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'security' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <p className="text-gray-600">Security configuration panel coming soon...</p>
            </div>
          )}
          {activeTab === 'database' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Management</h3>
              <p className="text-gray-600">Database administration tools coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard

