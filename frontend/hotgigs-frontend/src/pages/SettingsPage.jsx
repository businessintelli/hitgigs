import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  FileText, 
  Camera, 
  Upload, 
  Download, 
  Trash2, 
  Save, 
  RefreshCw, 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Key, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX,
  Languages,
  CreditCard,
  Database,
  Activity,
  Zap,
  Clock
} from 'lucide-react'

const SettingsPage = () => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
    profileImage: null
  })

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    searchableByEmail: true,
    searchableByPhone: false,
    showOnlineStatus: true,
    allowDirectMessages: true,
    shareActivityStatus: false
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    messageNotifications: true,
    systemUpdates: false,
    marketingEmails: false,
    weeklyDigest: true,
    instantAlerts: false
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: '24h',
    allowedDevices: 'unlimited',
    passwordLastChanged: new Date('2024-01-15'),
    activeSessions: 3
  })

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC-8',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    soundEnabled: true,
    animationsEnabled: true,
    compactMode: false
  })

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    accountType: user?.user_type || 'candidate',
    subscriptionPlan: 'free',
    dataRetention: '7 years',
    autoBackup: true,
    exportFormat: 'json'
  })

  useEffect(() => {
    loadUserSettings()
  }, [])

  const loadUserSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate loading user settings from API
      // In real implementation, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate saving settings to API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update profile if on profile tab
      if (activeTab === 'profile') {
        await updateProfile({
          first_name: profileSettings.firstName,
          last_name: profileSettings.lastName,
          email: profileSettings.email
        })
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileSettings(prev => ({
          ...prev,
          profileImage: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const resetPassword = async () => {
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Password reset email sent to your email address.')
    } catch (error) {
      alert('Failed to send password reset email.')
    }
  }

  const enable2FA = async () => {
    try {
      // Simulate 2FA setup
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }))
      alert('Two-factor authentication has been enabled.')
    } catch (error) {
      alert('Failed to enable two-factor authentication.')
    }
  }

  const exportData = async () => {
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const exportData = {
        profile: profileSettings,
        settings: {
          privacy: privacySettings,
          notifications: notificationSettings,
          security: securitySettings,
          appearance: appearanceSettings
        },
        exportDate: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hotgigs-settings-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert('Settings exported successfully!')
    } catch (error) {
      alert('Failed to export settings.')
    }
  }

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    
    if (confirmed) {
      try {
        // Simulate account deletion
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert('Account deletion request submitted. You will receive a confirmation email.')
      } catch (error) {
        alert('Failed to process account deletion request.')
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'security', label: 'Security', icon: <Lock size={20} /> },
    { id: 'appearance', label: 'Appearance', icon: <Monitor size={20} /> },
    { id: 'account', label: 'Account', icon: <Settings size={20} /> }
  ]

  const renderProfileSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Profile Information</h2>
        <p>Update your personal information and profile details</p>
      </div>

      <div className="profile-image-section">
        <div className="current-image">
          {profileSettings.profileImage ? (
            <img src={profileSettings.profileImage} alt="Profile" />
          ) : (
            <div className="placeholder-image">
              <User size={32} />
            </div>
          )}
        </div>
        <div className="image-actions">
          <label className="btn secondary">
            <Camera size={16} />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn-link">Remove</button>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={profileSettings.firstName}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, firstName: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={profileSettings.lastName}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, lastName: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={profileSettings.email}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={profileSettings.phone}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="form-group full-width">
          <label>Location</label>
          <input
            type="text"
            value={profileSettings.location}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, State, Country"
          />
        </div>
        <div className="form-group full-width">
          <label>Bio</label>
          <textarea
            value={profileSettings.bio}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            value={profileSettings.website}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://yourwebsite.com"
          />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            value={profileSettings.linkedin}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, linkedin: e.target.value }))}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div className="form-group">
          <label>GitHub</label>
          <input
            type="url"
            value={profileSettings.github}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, github: e.target.value }))}
            placeholder="https://github.com/username"
          />
        </div>
        <div className="form-group">
          <label>Portfolio</label>
          <input
            type="url"
            value={profileSettings.portfolio}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, portfolio: e.target.value }))}
            placeholder="https://portfolio.com"
          />
        </div>
      </div>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Privacy & Visibility</h2>
        <p>Control who can see your profile and personal information</p>
      </div>

      <div className="settings-grid">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Globe size={16} />
              Profile Visibility
            </div>
            <div className="setting-description">
              Choose who can view your complete profile
            </div>
          </div>
          <select
            value={privacySettings.profileVisibility}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
            className="setting-select"
          >
            <option value="public">Public - Anyone can view</option>
            <option value="contacts-only">Contacts Only</option>
            <option value="private">Private - Only me</option>
          </select>
        </div>

        {[
          { key: 'searchableByEmail', label: 'Searchable by Email', icon: <Mail size={16} />, description: 'Allow others to find you using your email address' },
          { key: 'searchableByPhone', label: 'Searchable by Phone', icon: <Phone size={16} />, description: 'Allow others to find you using your phone number' },
          { key: 'showOnlineStatus', label: 'Show Online Status', icon: <Activity size={16} />, description: 'Display when you\'re online to other users' },
          { key: 'allowDirectMessages', label: 'Allow Direct Messages', icon: <Mail size={16} />, description: 'Let recruiters and companies message you directly' },
          { key: 'shareActivityStatus', label: 'Share Activity Status', icon: <Activity size={16} />, description: 'Share your job search activity with your network' }
        ].map((setting) => (
          <div key={setting.key} className="setting-item">
            <div className="setting-info">
              <div className="setting-title">
                {setting.icon}
                {setting.label}
              </div>
              <div className="setting-description">
                {setting.description}
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacySettings[setting.key]}
                onChange={(e) => setPrivacySettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Notification Preferences</h2>
        <p>Choose how and when you want to be notified</p>
      </div>

      <div className="settings-grid">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', icon: <Mail size={16} />, description: 'Receive notifications via email' },
          { key: 'pushNotifications', label: 'Push Notifications', icon: <Smartphone size={16} />, description: 'Receive push notifications in your browser' },
          { key: 'jobAlerts', label: 'Job Alerts', icon: <Briefcase size={16} />, description: 'Get notified about relevant job opportunities' },
          { key: 'applicationUpdates', label: 'Application Updates', icon: <FileText size={16} />, description: 'Updates on your job applications' },
          { key: 'messageNotifications', label: 'Message Notifications', icon: <Mail size={16} />, description: 'New messages from recruiters and companies' },
          { key: 'systemUpdates', label: 'System Updates', icon: <Info size={16} />, description: 'Platform updates and maintenance notifications' },
          { key: 'marketingEmails', label: 'Marketing Emails', icon: <Mail size={16} />, description: 'Promotional emails and newsletters' },
          { key: 'weeklyDigest', label: 'Weekly Digest', icon: <Calendar size={16} />, description: 'Weekly summary of your activity and opportunities' },
          { key: 'instantAlerts', label: 'Instant Alerts', icon: <Zap size={16} />, description: 'Real-time alerts for urgent notifications' }
        ].map((setting) => (
          <div key={setting.key} className="setting-item">
            <div className="setting-info">
              <div className="setting-title">
                {setting.icon}
                {setting.label}
              </div>
              <div className="setting-description">
                {setting.description}
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings[setting.key]}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Security & Access</h2>
        <p>Manage your account security and access controls</p>
      </div>

      <div className="security-overview">
        <div className="security-card">
          <div className="security-icon">
            <Shield size={24} />
          </div>
          <div className="security-info">
            <h4>Account Security Score</h4>
            <div className="security-score">
              <div className="score-bar">
                <div className="score-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="score-text">Good (75%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Key size={16} />
              Password
            </div>
            <div className="setting-description">
              Last changed: {securitySettings.passwordLastChanged.toLocaleDateString()}
            </div>
          </div>
          <button className="btn secondary" onClick={resetPassword}>
            Change Password
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Smartphone size={16} />
              Two-Factor Authentication
            </div>
            <div className="setting-description">
              {securitySettings.twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
            </div>
          </div>
          {securitySettings.twoFactorEnabled ? (
            <button className="btn secondary">
              Manage 2FA
            </button>
          ) : (
            <button className="btn primary" onClick={enable2FA}>
              Enable 2FA
            </button>
          )}
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Monitor size={16} />
              Active Sessions
            </div>
            <div className="setting-description">
              {securitySettings.activeSessions} active sessions
            </div>
          </div>
          <button className="btn secondary">
            Manage Sessions
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Bell size={16} />
              Login Alerts
            </div>
            <div className="setting-description">
              Get notified of new login attempts
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={securitySettings.loginAlerts}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAlerts: e.target.checked }))}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Clock size={16} />
              Session Timeout
            </div>
            <div className="setting-description">
              Automatically log out after inactivity
            </div>
          </div>
          <select
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
            className="setting-select"
          >
            <option value="1h">1 hour</option>
            <option value="8h">8 hours</option>
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Appearance & Preferences</h2>
        <p>Customize how the platform looks and behaves</p>
      </div>

      <div className="settings-grid">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              {appearanceSettings.theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
              Theme
            </div>
            <div className="setting-description">
              Choose your preferred color scheme
            </div>
          </div>
          <select
            value={appearanceSettings.theme}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, theme: e.target.value }))}
            className="setting-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Languages size={16} />
              Language
            </div>
            <div className="setting-description">
              Select your preferred language
            </div>
          </div>
          <select
            value={appearanceSettings.language}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
            className="setting-select"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Globe size={16} />
              Timezone
            </div>
            <div className="setting-description">
              Your local timezone for scheduling
            </div>
          </div>
          <select
            value={appearanceSettings.timezone}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, timezone: e.target.value }))}
            className="setting-select"
          >
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">UTC</option>
            <option value="UTC+1">Central European Time (UTC+1)</option>
            <option value="UTC+8">China Standard Time (UTC+8)</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Calendar size={16} />
              Date Format
            </div>
            <div className="setting-description">
              How dates are displayed
            </div>
          </div>
          <select
            value={appearanceSettings.dateFormat}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
            className="setting-select"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <CreditCard size={16} />
              Currency
            </div>
            <div className="setting-description">
              Default currency for salary displays
            </div>
          </div>
          <select
            value={appearanceSettings.currency}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, currency: e.target.value }))}
            className="setting-select"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>

        {[
          { key: 'soundEnabled', label: 'Sound Effects', icon: <Volume2 size={16} />, description: 'Play sounds for notifications and interactions' },
          { key: 'animationsEnabled', label: 'Animations', icon: <Zap size={16} />, description: 'Enable smooth animations and transitions' },
          { key: 'compactMode', label: 'Compact Mode', icon: <Monitor size={16} />, description: 'Use a more compact layout to fit more content' }
        ].map((setting) => (
          <div key={setting.key} className="setting-item">
            <div className="setting-info">
              <div className="setting-title">
                {setting.icon}
                {setting.label}
              </div>
              <div className="setting-description">
                {setting.description}
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={appearanceSettings[setting.key]}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAccountSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Account Management</h2>
        <p>Manage your account, subscription, and data</p>
      </div>

      <div className="account-overview">
        <div className="account-card">
          <div className="account-info">
            <h4>Account Type</h4>
            <p className="account-type">{accountSettings.accountType.charAt(0).toUpperCase() + accountSettings.accountType.slice(1)}</p>
          </div>
          <div className="account-info">
            <h4>Subscription Plan</h4>
            <p className="subscription-plan">{accountSettings.subscriptionPlan.charAt(0).toUpperCase() + accountSettings.subscriptionPlan.slice(1)}</p>
          </div>
          <div className="account-info">
            <h4>Member Since</h4>
            <p>January 2024</p>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Database size={16} />
              Data Retention
            </div>
            <div className="setting-description">
              How long we keep your data
            </div>
          </div>
          <select
            value={accountSettings.dataRetention}
            onChange={(e) => setAccountSettings(prev => ({ ...prev, dataRetention: e.target.value }))}
            className="setting-select"
          >
            <option value="1 year">1 year</option>
            <option value="3 years">3 years</option>
            <option value="7 years">7 years</option>
            <option value="indefinite">Indefinite</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Database size={16} />
              Auto Backup
            </div>
            <div className="setting-description">
              Automatically backup your data
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accountSettings.autoBackup}
              onChange={(e) => setAccountSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-title">
              <Download size={16} />
              Export Data
            </div>
            <div className="setting-description">
              Download all your data
            </div>
          </div>
          <button className="btn secondary" onClick={exportData}>
            Export Data
          </button>
        </div>
      </div>

      <div className="danger-zone">
        <div className="danger-header">
          <h3>
            <AlertTriangle size={20} />
            Danger Zone
          </h3>
          <p>Irreversible actions that will permanently affect your account</p>
        </div>
        <div className="danger-actions">
          <button className="btn danger" onClick={deleteAccount}>
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings()
      case 'privacy': return renderPrivacySettings()
      case 'notifications': return renderNotificationSettings()
      case 'security': return renderSecuritySettings()
      case 'appearance': return renderAppearanceSettings()
      case 'account': return renderAccountSettings()
      default: return renderProfileSettings()
    }
  }

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Settings size={32} />
            </div>
            <div>
              <h1>Settings</h1>
              <p>Manage your account preferences and privacy settings</p>
            </div>
          </div>
          <div className="header-actions">
            {showSuccess && (
              <div className="success-message">
                <Check size={16} />
                Settings saved successfully!
              </div>
            )}
            <button 
              className="btn primary"
              onClick={saveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Settings Navigation */}
        <div className="settings-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {isLoading ? (
            <div className="loading-state">
              <RefreshCw size={32} className="animate-spin" />
              <p>Loading settings...</p>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>

      <style jsx>{`
        .settings-page {
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
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
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
          align-items: center;
          gap: 12px;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #10b981;
          font-size: 14px;
          font-weight: 500;
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
          background: #6366f1;
          color: white;
        }

        .btn.primary:hover:not(:disabled) {
          background: #4f46e5;
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
          color: #6366f1;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
        }

        .btn-link:hover {
          opacity: 0.8;
        }

        .page-content {
          padding: 0 24px 24px;
          display: flex;
          gap: 24px;
        }

        .settings-nav {
          width: 240px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 8px;
          height: fit-content;
          position: sticky;
          top: 24px;
        }

        .nav-tab {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          text-align: left;
        }

        .nav-tab:hover {
          background: #f8fafc;
          color: #374151;
        }

        .nav-tab.active {
          background: #6366f1;
          color: white;
        }

        .settings-content {
          flex: 1;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 32px;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .loading-state svg {
          margin-bottom: 16px;
        }

        .loading-state p {
          font-size: 16px;
          margin: 0;
        }

        .settings-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .section-header p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .profile-image-section {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .current-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #e2e8f0;
        }

        .current-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .image-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .setting-info {
          flex: 1;
        }

        .setting-title {
          font-size: 16px;
          font-weight: 600;
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
          min-width: 150px;
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
          background-color: #6366f1;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .security-overview {
          margin-bottom: 24px;
        }

        .security-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 12px;
        }

        .security-icon {
          width: 48px;
          height: 48px;
          background: #0ea5e9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .security-info h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .security-score {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .score-bar {
          width: 120px;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.3s;
        }

        .score-text {
          font-size: 14px;
          font-weight: 500;
          color: #10b981;
        }

        .account-overview {
          margin-bottom: 24px;
        }

        .account-card {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 24px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .account-info h4 {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .account-info p {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .account-type {
          color: #6366f1 !important;
        }

        .subscription-plan {
          color: #10b981 !important;
        }

        .danger-zone {
          margin-top: 40px;
          padding: 24px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
        }

        .danger-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #dc2626;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .danger-header p {
          font-size: 14px;
          color: #991b1b;
          margin: 0 0 16px 0;
        }

        .danger-actions {
          display: flex;
          gap: 12px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .page-content {
            flex-direction: column;
            padding: 0 16px 16px;
          }

          .settings-nav {
            width: 100%;
            position: static;
            display: flex;
            overflow-x: auto;
            padding: 4px;
          }

          .nav-tab {
            white-space: nowrap;
            min-width: fit-content;
          }

          .settings-content {
            padding: 24px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .account-card {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .profile-image-section {
            flex-direction: column;
            text-align: center;
          }

          .setting-item {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .setting-select {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default SettingsPage

