import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Briefcase, 
  Building, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Heart,
  Calendar,
  Award,
  Send,
  Target,
  TrendingUp,
  DollarSign,
  Upload,
  Zap,
  Shield,
  Database,
  Activity
} from 'lucide-react'

const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Set active menu item based on current path
    const path = location.pathname
    if (path.includes('/dashboard')) setActiveMenuItem('dashboard')
    else if (path.includes('/profile')) setActiveMenuItem('profile')
    else if (path.includes('/jobs')) setActiveMenuItem('jobs')
    else if (path.includes('/applications')) setActiveMenuItem('applications')
    else if (path.includes('/saved-jobs')) setActiveMenuItem('saved-jobs')
    else if (path.includes('/post-job')) setActiveMenuItem('post-job')
    else if (path.includes('/my-jobs')) setActiveMenuItem('my-jobs')
    else if (path.includes('/candidates')) setActiveMenuItem('candidates')
    else if (path.includes('/companies')) setActiveMenuItem('companies')
    else if (path.includes('/analytics')) setActiveMenuItem('analytics')
    else if (path.includes('/settings')) setActiveMenuItem('settings')
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
      { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' }
    ]

    let roleSpecificItems = []

    switch (user?.user_type) {
      case 'candidate':
        roleSpecificItems = [
          { id: 'jobs', label: 'Browse Jobs', icon: <Search size={20} />, path: '/jobs' },
          { id: 'applications', label: 'My Applications', icon: <FileText size={20} />, path: '/my-applications' },
          { id: 'saved-jobs', label: 'Saved Jobs', icon: <Heart size={20} />, path: '/saved-jobs' },
          { id: 'interviews', label: 'Interviews', icon: <Calendar size={20} />, path: '/interviews' },
          { id: 'offers', label: 'Job Offers', icon: <Award size={20} />, path: '/offers' },
          { id: 'ai-assistant', label: 'AI Assistant', icon: <Zap size={20} />, path: '/ai-assistant' },
          { id: 'resume-analysis', label: 'Resume Analysis', icon: <FileText size={20} />, path: '/resume-analysis' },
          { id: 'task-management', label: 'Tasks', icon: <Target size={20} />, path: '/task-management' },
          { id: 'privacy-settings', label: 'Privacy', icon: <Shield size={20} />, path: '/privacy-settings' }
        ]
        break

      case 'company':
        roleSpecificItems = [
          { id: 'post-job', label: 'Post Job', icon: <Send size={20} />, path: '/post-job' },
          { id: 'my-jobs', label: 'My Jobs', icon: <Briefcase size={20} />, path: '/my-jobs' },
          { id: 'applications', label: 'Applications', icon: <FileText size={20} />, path: '/applications' },
          { id: 'candidates', label: 'Candidates', icon: <Users size={20} />, path: '/candidates' },
          { id: 'bulk-upload', label: 'Bulk Resume Upload', icon: <Upload size={20} />, path: '/bulk-resume-upload' },
          { id: 'ai-assistant', label: 'AI Assistant', icon: <Zap size={20} />, path: '/ai-assistant' },
          { id: 'task-management', label: 'Task Management', icon: <Target size={20} />, path: '/task-management' },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
          { id: 'company-profile', label: 'Company Profile', icon: <Building size={20} />, path: '/company-profile' },
          { id: 'privacy-settings', label: 'Privacy', icon: <Shield size={20} />, path: '/privacy-settings' }
        ]
        break

      case 'freelance_recruiter':
        roleSpecificItems = [
          { id: 'clients', label: 'Clients', icon: <Building size={20} />, path: '/clients' },
          { id: 'candidates', label: 'Candidates', icon: <Users size={20} />, path: '/candidates' },
          { id: 'placements', label: 'Placements', icon: <Target size={20} />, path: '/placements' },
          { id: 'pipeline', label: 'Pipeline', icon: <TrendingUp size={20} />, path: '/pipeline' },
          { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} />, path: '/earnings' },
          { id: 'bulk-upload', label: 'Bulk Resume Upload', icon: <Upload size={20} />, path: '/bulk-resume-upload' },
          { id: 'ai-assistant', label: 'AI Assistant', icon: <Zap size={20} />, path: '/ai-assistant' },
          { id: 'resume-analysis', label: 'Resume Analysis', icon: <FileText size={20} />, path: '/resume-analysis' },
          { id: 'task-management', label: 'Task Management', icon: <Target size={20} />, path: '/task-management' },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
          { id: 'privacy-settings', label: 'Privacy', icon: <Shield size={20} />, path: '/privacy-settings' }
        ]
        break

      default:
        if (user?.is_admin) {
          roleSpecificItems = [
            { id: 'users', label: 'Users', icon: <Users size={20} />, path: '/admin/users' },
            { id: 'companies', label: 'Companies', icon: <Building size={20} />, path: '/admin/companies' },
            { id: 'jobs', label: 'Jobs', icon: <Briefcase size={20} />, path: '/admin/jobs' },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, path: '/admin/analytics' },
            { id: 'system', label: 'System', icon: <Database size={20} />, path: '/admin/system' },
            { id: 'logs', label: 'Logs', icon: <Activity size={20} />, path: '/admin/logs' }
          ]
        }
        break
    }

    const settingsItems = [
      { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
      { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, path: '/notifications' }
    ]

    return [...commonItems, ...roleSpecificItems, ...settingsItems]
  }

  const handleMenuClick = (item) => {
    setActiveMenuItem(item.id)
    navigate(item.path)
  }

  const menuItems = getMenuItems()

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo">
            {!sidebarCollapsed && (
              <span className="logo-text">HotGigs.ai</span>
            )}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Info */}
        <div className="user-info">
          <div className="user-avatar">
            <User size={24} />
          </div>
          {!sidebarCollapsed && (
            <div className="user-details">
              <div className="user-name">{user?.first_name} {user?.last_name}</div>
              <div className="user-role">{user?.user_type?.replace('_', ' ')}</div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeMenuItem === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item)}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>{menuItems.find(item => item.id === activeMenuItem)?.label || 'Dashboard'}</h1>
          </div>
          <div className="top-bar-actions">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-menu">
              <div className="user-avatar-small">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {children}
        </div>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          height: 100vh;
          background: #f8fafc;
        }

        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          position: relative;
          z-index: 10;
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          min-height: 80px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #06b6d4;
        }

        .collapse-btn {
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          padding: 8px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .collapse-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .user-avatar {
          background: #06b6d4;
          color: white;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 14px;
          color: #6b7280;
          text-transform: capitalize;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 20px 0;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          margin-bottom: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 20px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .nav-link:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .nav-link.active {
          background: #eff6ff;
          color: #1d4ed8;
          border-right: 3px solid #1d4ed8;
        }

        .nav-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 0;
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          color: #dc2626;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .top-bar {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 32px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .page-title h1 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notification-btn {
          position: relative;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .notification-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .user-avatar-small {
          background: #06b6d4;
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .content-area {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          background: #f8fafc;
        }

        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(${sidebarCollapsed ? '-200px' : '0'});
          }

          .main-content {
            margin-left: ${sidebarCollapsed ? '0' : '280px'};
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            transform: translateX(${sidebarCollapsed ? '-100%' : '0'});
          }

          .main-content {
            margin-left: 0;
          }

          .content-area {
            padding: 20px;
          }

          .top-bar {
            padding: 0 20px;
            height: 60px;
          }

          .page-title h1 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default DashboardLayout

