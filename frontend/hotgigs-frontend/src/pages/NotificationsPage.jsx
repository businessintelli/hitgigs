import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Trash2, 
  Filter, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Star, 
  Heart, 
  Send, 
  Settings, 
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Archive,
  MoreVertical
} from 'lucide-react'

const NotificationsPage = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    messageNotifications: true,
    systemUpdates: false,
    marketingEmails: false
  })

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, filterType, searchQuery])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      // Simulate loading notifications from API
      const sampleNotifications = [
        {
          id: 1,
          type: 'job_match',
          title: 'New Job Match Found',
          message: 'We found 3 new jobs that match your profile: Senior React Developer, Full Stack Engineer, Frontend Lead',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          priority: 'high',
          actionUrl: '/jobs?matched=true',
          icon: <Briefcase size={20} />,
          color: 'blue'
        },
        {
          id: 2,
          type: 'application_update',
          title: 'Application Status Update',
          message: 'Your application for "Senior Developer at TechCorp" has been moved to the interview stage',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          priority: 'high',
          actionUrl: '/my-applications',
          icon: <FileText size={20} />,
          color: 'green'
        },
        {
          id: 3,
          type: 'interview_scheduled',
          title: 'Interview Scheduled',
          message: 'Your interview with StartupXYZ is scheduled for tomorrow at 2:00 PM',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          read: true,
          priority: 'high',
          actionUrl: '/interviews',
          icon: <Calendar size={20} />,
          color: 'purple'
        },
        {
          id: 4,
          type: 'message',
          title: 'New Message from Recruiter',
          message: 'Sarah Johnson from TalentCorp sent you a message about the Frontend Developer position',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          read: true,
          priority: 'medium',
          actionUrl: '/messages',
          icon: <MessageSquare size={20} />,
          color: 'orange'
        },
        {
          id: 5,
          type: 'profile_view',
          title: 'Profile Viewed',
          message: '5 recruiters viewed your profile in the last 24 hours',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          read: true,
          priority: 'low',
          actionUrl: '/profile',
          icon: <Eye size={20} />,
          color: 'gray'
        },
        {
          id: 6,
          type: 'system',
          title: 'System Update',
          message: 'New AI-powered resume analysis feature is now available',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          priority: 'low',
          actionUrl: '/resume-analysis',
          icon: <Info size={20} />,
          color: 'blue'
        }
      ]

      // Adjust notifications based on user type
      if (user?.user_type === 'company') {
        sampleNotifications.push(
          {
            id: 7,
            type: 'new_application',
            title: 'New Job Application',
            message: '12 new applications received for "Senior Developer" position',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            read: false,
            priority: 'high',
            actionUrl: '/applications',
            icon: <FileText size={20} />,
            color: 'green'
          },
          {
            id: 8,
            type: 'candidate_match',
            title: 'AI Candidate Match',
            message: 'Found 5 highly qualified candidates for your "Frontend Lead" position',
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            read: false,
            priority: 'high',
            actionUrl: '/candidates',
            icon: <Star size={20} />,
            color: 'yellow'
          }
        )
      }

      setNotifications(sampleNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = notifications

    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'unread') {
        filtered = filtered.filter(n => !n.read)
      } else if (filterType === 'read') {
        filtered = filtered.filter(n => n.read)
      } else {
        filtered = filtered.filter(n => n.type === filterType)
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }

  const markAsUnread = async (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: false } : n
      )
    )
  }

  const deleteNotification = async (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteSelected = async () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
    setSelectedNotifications([])
  }

  const toggleSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id))
  }

  const deselectAll = () => {
    setSelectedNotifications([])
  }

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job_match': return <Briefcase size={20} />
      case 'application_update': return <FileText size={20} />
      case 'interview_scheduled': return <Calendar size={20} />
      case 'message': return <MessageSquare size={20} />
      case 'profile_view': return <Eye size={20} />
      case 'system': return <Info size={20} />
      case 'new_application': return <FileText size={20} />
      case 'candidate_match': return <Star size={20} />
      default: return <Bell size={20} />
    }
  }

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'red'
    if (priority === 'medium') return 'orange'
    return 'gray'
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Bell size={32} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>
            <div>
              <h1>Notifications</h1>
              <p>Stay updated with your job search and application progress</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn secondary"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} />
              Settings
            </button>
            <button 
              className="btn secondary"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check size={16} />
              Mark All Read
            </button>
            <button 
              className="btn primary"
              onClick={loadNotifications}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Notification Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-header">
              <h3>Notification Settings</h3>
              <button 
                className="close-btn"
                onClick={() => setShowSettings(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="settings-content">
              <div className="settings-grid">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="setting-item">
                    <div className="setting-info">
                      <div className="setting-title">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-tabs">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'job_match', label: 'Job Matches', count: notifications.filter(n => n.type === 'job_match').length },
              { key: 'application_update', label: 'Applications', count: notifications.filter(n => n.type === 'application_update').length },
              { key: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length }
            ].map(tab => (
              <button
                key={tab.key}
                className={`filter-tab ${filterType === tab.key ? 'active' : ''}`}
                onClick={() => setFilterType(tab.key)}
              >
                {tab.label}
                {tab.count > 0 && <span className="count">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bulk-actions">
            <div className="selection-info">
              {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
            </div>
            <div className="bulk-buttons">
              <button className="btn-link" onClick={deselectAll}>
                Deselect All
              </button>
              <button className="btn-link" onClick={selectAll}>
                Select All
              </button>
              <button className="btn-link" onClick={deleteSelected}>
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={48} />
              <h3>No notifications found</h3>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search or filter criteria'
                  : 'You\'re all caught up! New notifications will appear here.'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''} ${selectedNotifications.includes(notification.id) ? 'selected' : ''}`}
              >
                <div className="notification-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelection(notification.id)}
                  />
                </div>
                
                <div 
                  className="notification-content"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`notification-icon ${notification.color}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-body">
                    <div className="notification-header">
                      <h4 className="notification-title">{notification.title}</h4>
                      <div className="notification-meta">
                        <span className="timestamp">{formatTimestamp(notification.timestamp)}</span>
                        {notification.priority === 'high' && (
                          <span className="priority-badge high">High</span>
                        )}
                      </div>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                  </div>
                </div>

                <div className="notification-actions">
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)
                    }}
                    title={notification.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {notification.read ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .notifications-page {
          padding: 0;
        }

        .page-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 24px;
          margin-bottom: 24px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .header-info h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .header-info p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          border: none;
        }

        .btn.primary {
          background: #3b82f6;
          color: white;
        }

        .btn.primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn.secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .btn.secondary:hover {
          background: #f8fafc;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-link {
          background: transparent;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: underline;
        }

        .btn-link:hover {
          opacity: 0.8;
        }

        .page-content {
          padding: 0 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-panel {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .settings-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .close-btn:hover {
          background: #e2e8f0;
        }

        .settings-content {
          padding: 24px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .setting-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: 0.3s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #3b82f6;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .search-bar {
          position: relative;
          max-width: 400px;
        }

        .search-bar svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-bar input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          background: white;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .filter-tab:hover {
          background: #f8fafc;
        }

        .filter-tab.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .filter-tab .count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
        }

        .filter-tab.active .count {
          background: rgba(255, 255, 255, 0.3);
        }

        .bulk-actions {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .selection-info {
          font-size: 14px;
          color: #0369a1;
          font-weight: 500;
        }

        .bulk-buttons {
          display: flex;
          gap: 16px;
        }

        .notifications-list {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .notification-item {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
          cursor: pointer;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item:hover {
          background: #f8fafc;
        }

        .notification-item.unread {
          background: #fefce8;
          border-left: 4px solid #eab308;
        }

        .notification-item.selected {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
        }

        .notification-checkbox {
          margin-right: 12px;
        }

        .notification-checkbox input {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .notification-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .notification-icon.blue { background: #3b82f6; }
        .notification-icon.green { background: #10b981; }
        .notification-icon.purple { background: #8b5cf6; }
        .notification-icon.orange { background: #f59e0b; }
        .notification-icon.red { background: #ef4444; }
        .notification-icon.yellow { background: #eab308; }
        .notification-icon.gray { background: #6b7280; }

        .notification-body {
          flex: 1;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }

        .notification-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .timestamp {
          font-size: 12px;
          color: #64748b;
        }

        .priority-badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: #fef2f2;
          color: #dc2626;
        }

        .notification-message {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        .notification-actions {
          display: flex;
          gap: 8px;
          margin-left: 12px;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f1f5f9;
          color: #374151;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          font-size: 14px;
          margin: 0;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .page-content {
            padding: 0 16px 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .filter-tabs {
            overflow-x: auto;
            padding-bottom: 8px;
          }

          .notification-item {
            padding: 12px 16px;
          }

          .notification-header {
            flex-direction: column;
            gap: 4px;
            align-items: flex-start;
          }

          .notification-actions {
            margin-left: 8px;
          }

          .bulk-actions {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

export default NotificationsPage

