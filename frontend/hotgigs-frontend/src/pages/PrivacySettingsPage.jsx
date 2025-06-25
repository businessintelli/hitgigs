import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Globe, 
  Users, 
  Database, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Info, 
  ExternalLink,
  Save,
  RefreshCw,
  Bell,
  UserCheck,
  UserX,
  Key,
  Fingerprint
} from 'lucide-react'

const PrivacySettingsPage = () => {
  const { user } = useAuth()
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, private, contacts-only
    searchableByEmail: true,
    searchableByPhone: false,
    showOnlineStatus: true,
    allowDirectMessages: true,
    shareActivityStatus: false,
    dataProcessingConsent: true,
    marketingEmails: false,
    jobAlerts: true,
    profileAnalytics: true,
    resumeDownloadable: true,
    contactInfoVisible: false,
    workHistoryVisible: true,
    educationVisible: true,
    skillsVisible: true,
    certificationsVisible: true,
    portfolioVisible: true,
    referencesVisible: false,
    salaryExpectationsVisible: false
  })

  const [dataExportSettings, setDataExportSettings] = useState({
    includeProfile: true,
    includeResume: true,
    includeApplications: true,
    includeMessages: false,
    includeActivityLogs: false,
    includeAnalytics: false,
    format: 'json' // json, csv, pdf
  })

  const [deletionSettings, setDeletionSettings] = useState({
    deleteProfile: false,
    deleteResume: false,
    deleteApplications: false,
    deleteMessages: false,
    deleteActivityLogs: false,
    confirmDeletion: false,
    reason: ''
  })

  const [consentHistory, setConsentHistory] = useState([])
  const [dataUsageStats, setDataUsageStats] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    loadPrivacySettings()
    loadConsentHistory()
    loadDataUsageStats()
  }, [])

  const loadPrivacySettings = () => {
    // Simulate loading privacy settings from API
    // In real implementation, this would fetch from backend
  }

  const loadConsentHistory = () => {
    const sampleHistory = [
      {
        id: 1,
        type: 'Data Processing Consent',
        action: 'Granted',
        date: '2024-01-15T10:30:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0'
      },
      {
        id: 2,
        type: 'Marketing Communications',
        action: 'Declined',
        date: '2024-01-15T10:31:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0'
      },
      {
        id: 3,
        type: 'Profile Visibility',
        action: 'Updated to Public',
        date: '2024-01-10T14:22:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0'
      }
    ]
    setConsentHistory(sampleHistory)
  }

  const loadDataUsageStats = () => {
    const sampleStats = {
      profileViews: 156,
      resumeDownloads: 23,
      searchAppearances: 89,
      dataSharedWith: ['Company A', 'Recruiter B', 'Platform Analytics'],
      lastDataExport: '2023-12-15',
      dataRetentionPeriod: '7 years',
      storageUsed: '2.3 MB',
      storageLimit: '100 MB'
    }
    setDataUsageStats(sampleStats)
  }

  const handlePrivacySettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleDataExportSettingChange = (setting, value) => {
    setDataExportSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleDeletionSettingChange = (setting, value) => {
    setDeletionSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const savePrivacySettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add to consent history
      const newConsent = {
        id: Date.now(),
        type: 'Privacy Settings Update',
        action: 'Updated',
        date: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: navigator.userAgent
      }
      setConsentHistory(prev => [newConsent, ...prev])
      
      alert('Privacy settings saved successfully!')
    } catch (error) {
      alert('Failed to save privacy settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async () => {
    setIsLoading(true)
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const exportData = {
        profile: dataExportSettings.includeProfile ? {
          name: user?.name || 'John Doe',
          email: user?.email || 'john@example.com',
          phone: '+1-555-0123',
          location: 'San Francisco, CA'
        } : null,
        resume: dataExportSettings.includeResume ? {
          fileName: 'resume.pdf',
          uploadDate: '2024-01-15',
          size: '1.2 MB'
        } : null,
        applications: dataExportSettings.includeApplications ? [
          { jobTitle: 'Senior Developer', company: 'Tech Corp', date: '2024-01-10' },
          { jobTitle: 'Full Stack Engineer', company: 'StartupXYZ', date: '2024-01-08' }
        ] : null,
        exportDate: new Date().toISOString(),
        format: dataExportSettings.format
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hotgigs-data-export-${new Date().toISOString().split('T')[0]}.${dataExportSettings.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setShowExportModal(false)
      alert('Data export completed successfully!')
    } catch (error) {
      alert('Failed to export data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!deletionSettings.confirmDeletion) {
      alert('Please confirm account deletion by checking the confirmation box.')
      return
    }

    setIsLoading(true)
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Account deletion request submitted. You will receive a confirmation email within 24 hours.')
      setShowDeleteConfirmation(false)
    } catch (error) {
      alert('Failed to process deletion request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public': return <Globe size={16} className="text-green-600" />
      case 'private': return <Lock size={16} className="text-red-600" />
      case 'contacts-only': return <Users size={16} className="text-blue-600" />
      default: return <Eye size={16} className="text-gray-600" />
    }
  }

  return (
    <div className="privacy-settings-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Shield size={32} />
            </div>
            <div>
              <h1>Privacy & Data Control</h1>
              <p>Manage your privacy settings and control how your data is used</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn secondary"
              onClick={() => setShowExportModal(true)}
            >
              <Download size={16} />
              Export Data
            </button>
            <button 
              className="btn primary"
              onClick={savePrivacySettings}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Data Usage Overview */}
        <div className="overview-section">
          <h2>Data Usage Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Eye size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{dataUsageStats.profileViews}</div>
                <div className="stat-label">Profile Views</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Download size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{dataUsageStats.resumeDownloads}</div>
                <div className="stat-label">Resume Downloads</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Database size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{dataUsageStats.storageUsed}</div>
                <div className="stat-label">Storage Used</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{dataUsageStats.dataRetentionPeriod}</div>
                <div className="stat-label">Data Retention</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Visibility Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Profile Visibility</h2>
            <p>Control who can see your profile and personal information</p>
          </div>

          <div className="settings-grid">
            <div className="setting-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">
                    {getVisibilityIcon(privacySettings.profileVisibility)}
                    Profile Visibility
                  </div>
                  <div className="setting-description">
                    Choose who can view your complete profile
                  </div>
                </div>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => handlePrivacySettingChange('profileVisibility', e.target.value)}
                  className="setting-select"
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="contacts-only">Contacts Only</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <Mail size={16} />
                    Searchable by Email
                  </div>
                  <div className="setting-description">
                    Allow others to find you using your email address
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.searchableByEmail}
                    onChange={(e) => handlePrivacySettingChange('searchableByEmail', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <Phone size={16} />
                    Searchable by Phone
                  </div>
                  <div className="setting-description">
                    Allow others to find you using your phone number
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.searchableByPhone}
                    onChange={(e) => handlePrivacySettingChange('searchableByPhone', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <UserCheck size={16} />
                    Show Online Status
                  </div>
                  <div className="setting-description">
                    Display when you're online to other users
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.showOnlineStatus}
                    onChange={(e) => handlePrivacySettingChange('showOnlineStatus', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sharing Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Data Sharing & Communications</h2>
            <p>Manage how your data is shared and communication preferences</p>
          </div>

          <div className="settings-grid">
            <div className="setting-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <Bell size={16} />
                    Marketing Emails
                  </div>
                  <div className="setting-description">
                    Receive promotional emails and newsletters
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.marketingEmails}
                    onChange={(e) => handlePrivacySettingChange('marketingEmails', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <Bell size={16} />
                    Job Alerts
                  </div>
                  <div className="setting-description">
                    Receive notifications about relevant job opportunities
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.jobAlerts}
                    onChange={(e) => handlePrivacySettingChange('jobAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <Database size={16} />
                    Data Processing Consent
                  </div>
                  <div className="setting-description">
                    Allow processing of your data for platform functionality
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.dataProcessingConsent}
                    onChange={(e) => handlePrivacySettingChange('dataProcessingConsent', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <FileText size={16} />
                    Resume Downloadable
                  </div>
                  <div className="setting-description">
                    Allow recruiters to download your resume
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.resumeDownloadable}
                    onChange={(e) => handlePrivacySettingChange('resumeDownloadable', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Visibility */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Profile Information Visibility</h2>
            <p>Choose which parts of your profile are visible to others</p>
          </div>

          <div className="visibility-grid">
            {[
              { key: 'contactInfoVisible', label: 'Contact Information', icon: <Phone size={16} /> },
              { key: 'workHistoryVisible', label: 'Work History', icon: <FileText size={16} /> },
              { key: 'educationVisible', label: 'Education', icon: <FileText size={16} /> },
              { key: 'skillsVisible', label: 'Skills', icon: <Settings size={16} /> },
              { key: 'certificationsVisible', label: 'Certifications', icon: <CheckCircle size={16} /> },
              { key: 'portfolioVisible', label: 'Portfolio', icon: <FileText size={16} /> },
              { key: 'referencesVisible', label: 'References', icon: <Users size={16} /> },
              { key: 'salaryExpectationsVisible', label: 'Salary Expectations', icon: <FileText size={16} /> }
            ].map((item) => (
              <div key={item.key} className="visibility-item">
                <div className="visibility-info">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings[item.key]}
                    onChange={(e) => handlePrivacySettingChange(item.key, e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sharing Partners */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Data Sharing Partners</h2>
            <p>Organizations that have access to your data</p>
          </div>

          <div className="partners-list">
            {dataUsageStats.dataSharedWith?.map((partner, index) => (
              <div key={index} className="partner-item">
                <div className="partner-info">
                  <div className="partner-icon">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="partner-name">{partner}</div>
                    <div className="partner-description">
                      {partner.includes('Company') ? 'Potential employer' : 
                       partner.includes('Recruiter') ? 'Recruitment agency' : 
                       'Platform analytics'}
                    </div>
                  </div>
                </div>
                <div className="partner-actions">
                  <button className="btn-link">View Details</button>
                  <button className="btn-link danger">Revoke Access</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consent History */}
        <div className="settings-section">
          <div className="section-header">
            <h2>Consent History</h2>
            <p>Track all privacy-related actions and consent changes</p>
          </div>

          <div className="consent-history">
            {consentHistory.map((consent) => (
              <div key={consent.id} className="consent-item">
                <div className="consent-info">
                  <div className="consent-type">{consent.type}</div>
                  <div className="consent-action">{consent.action}</div>
                  <div className="consent-date">
                    {new Date(consent.date).toLocaleString()}
                  </div>
                </div>
                <div className="consent-details">
                  <div className="consent-meta">
                    IP: {consent.ipAddress}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="section-header">
            <h2>
              <AlertTriangle size={20} />
              Danger Zone
            </h2>
            <p>Irreversible actions that will permanently affect your account</p>
          </div>

          <div className="danger-actions">
            <button 
              className="btn danger"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Export Data Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Export Your Data</h3>
              <button 
                className="modal-close"
                onClick={() => setShowExportModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Choose what data to include in your export:</p>
              
              <div className="export-options">
                {[
                  { key: 'includeProfile', label: 'Profile Information' },
                  { key: 'includeResume', label: 'Resume & Documents' },
                  { key: 'includeApplications', label: 'Job Applications' },
                  { key: 'includeMessages', label: 'Messages & Communications' },
                  { key: 'includeActivityLogs', label: 'Activity Logs' },
                  { key: 'includeAnalytics', label: 'Analytics Data' }
                ].map((option) => (
                  <label key={option.key} className="export-option">
                    <input
                      type="checkbox"
                      checked={dataExportSettings[option.key]}
                      onChange={(e) => handleDataExportSettingChange(option.key, e.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="format-selection">
                <label>Export Format:</label>
                <select
                  value={dataExportSettings.format}
                  onChange={(e) => handleDataExportSettingChange('format', e.target.value)}
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn secondary"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn primary"
                onClick={exportData}
                disabled={isLoading}
              >
                {isLoading ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                <AlertTriangle size={20} />
                Delete Account
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="warning-message">
                <AlertTriangle size={24} />
                <div>
                  <strong>This action cannot be undone.</strong>
                  <p>Deleting your account will permanently remove all your data, including your profile, resume, applications, and messages.</p>
                </div>
              </div>

              <div className="deletion-options">
                <h4>What would you like to delete?</h4>
                {[
                  { key: 'deleteProfile', label: 'Profile Information' },
                  { key: 'deleteResume', label: 'Resume & Documents' },
                  { key: 'deleteApplications', label: 'Job Applications' },
                  { key: 'deleteMessages', label: 'Messages' },
                  { key: 'deleteActivityLogs', label: 'Activity Logs' }
                ].map((option) => (
                  <label key={option.key} className="deletion-option">
                    <input
                      type="checkbox"
                      checked={deletionSettings[option.key]}
                      onChange={(e) => handleDeletionSettingChange(option.key, e.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="deletion-reason">
                <label>Reason for deletion (optional):</label>
                <textarea
                  value={deletionSettings.reason}
                  onChange={(e) => handleDeletionSettingChange('reason', e.target.value)}
                  placeholder="Help us improve by telling us why you're leaving..."
                  rows={3}
                />
              </div>

              <label className="confirmation-checkbox">
                <input
                  type="checkbox"
                  checked={deletionSettings.confirmDeletion}
                  onChange={(e) => handleDeletionSettingChange('confirmDeletion', e.target.checked)}
                />
                <span>I understand that this action cannot be undone and I want to permanently delete my account.</span>
              </label>
            </div>
            <div className="modal-actions">
              <button 
                className="btn secondary"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="btn danger"
                onClick={deleteAccount}
                disabled={isLoading || !deletionSettings.confirmDeletion}
              >
                {isLoading ? 'Processing...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .privacy-settings-page {
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
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
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
          background: #10b981;
          color: white;
        }

        .btn.primary:hover:not(:disabled) {
          background: #059669;
        }

        .btn.secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .btn.secondary:hover {
          background: #f8fafc;
        }

        .btn.danger {
          background: #ef4444;
          color: white;
        }

        .btn.danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-link {
          background: transparent;
          border: none;
          color: #10b981;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
        }

        .btn-link.danger {
          color: #ef4444;
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

        .overview-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .overview-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 20px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: #e0f2fe;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0891b2;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .settings-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .settings-section.danger-zone {
          border-color: #fecaca;
          background: #fef2f2;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-header p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .setting-info {
          flex: 1;
        }

        .setting-title {
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .setting-description {
          font-size: 14px;
          color: #64748b;
        }

        .setting-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
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
          background-color: #10b981;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .visibility-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .visibility-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .visibility-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
        }

        .partners-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .partner-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .partner-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .partner-icon {
          width: 40px;
          height: 40px;
          background: #e0f2fe;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0891b2;
        }

        .partner-name {
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
        }

        .partner-description {
          font-size: 14px;
          color: #64748b;
        }

        .partner-actions {
          display: flex;
          gap: 12px;
        }

        .consent-history {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .consent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .consent-type {
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
        }

        .consent-action {
          font-size: 14px;
          color: #10b981;
          font-weight: 500;
        }

        .consent-date {
          font-size: 12px;
          color: #64748b;
        }

        .consent-meta {
          font-size: 12px;
          color: #64748b;
        }

        .danger-actions {
          display: flex;
          gap: 12px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-close {
          background: transparent;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          padding: 24px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e2e8f0;
        }

        .export-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 16px 0;
        }

        .export-option {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }

        .format-selection {
          margin-top: 16px;
        }

        .format-selection label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .format-selection select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .warning-message {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          margin-bottom: 20px;
          color: #991b1b;
        }

        .deletion-options {
          margin: 20px 0;
        }

        .deletion-options h4 {
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
          margin: 0 0 12px 0;
        }

        .deletion-option {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          margin-bottom: 8px;
        }

        .deletion-reason {
          margin: 20px 0;
        }

        .deletion-reason label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .deletion-reason textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
        }

        .confirmation-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          margin-top: 20px;
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

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .visibility-grid {
            grid-template-columns: 1fr;
          }

          .setting-item {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .partner-item {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .consent-item {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }

          .modal {
            width: 95%;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default PrivacySettingsPage

