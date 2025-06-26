import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  Calendar, 
  Filter, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Trash2,
  Copy,
  Share,
  Mail,
  Users,
  Briefcase,
  Building,
  BarChart3,
  FileSpreadsheet,
  FileImage,
  Archive,
  Shield,
  Globe,
  Search,
  Plus,
  Edit,
  Save,
  X,
  Info,
  Star,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react'

const DataExportPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('exports')
  const [showCreateExportModal, setShowCreateExportModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [exportHistory, setExportHistory] = useState([
    {
      id: 1,
      name: 'Candidate Database Export',
      type: 'candidates',
      format: 'csv',
      status: 'completed',
      created_at: '2024-01-15T10:30:00Z',
      completed_at: '2024-01-15T10:32:15Z',
      file_size: '2.4 MB',
      records_count: 1250,
      download_url: '/exports/candidates_20240115.csv',
      created_by: 'John Smith'
    },
    {
      id: 2,
      name: 'Job Applications Report',
      type: 'applications',
      format: 'xlsx',
      status: 'completed',
      created_at: '2024-01-14T15:20:00Z',
      completed_at: '2024-01-14T15:23:45Z',
      file_size: '5.8 MB',
      records_count: 3420,
      download_url: '/exports/applications_20240114.xlsx',
      created_by: 'Sarah Johnson'
    },
    {
      id: 3,
      name: 'Monthly Analytics Export',
      type: 'analytics',
      format: 'pdf',
      status: 'processing',
      created_at: '2024-01-15T09:15:00Z',
      completed_at: null,
      file_size: null,
      records_count: null,
      download_url: null,
      created_by: 'Mike Chen'
    },
    {
      id: 4,
      name: 'Interview Data Export',
      type: 'interviews',
      format: 'csv',
      status: 'failed',
      created_at: '2024-01-13T14:45:00Z',
      completed_at: null,
      file_size: null,
      records_count: null,
      download_url: null,
      created_by: 'Emily Davis',
      error_message: 'Insufficient permissions to access interview data'
    }
  ])

  const [scheduledExports, setScheduledExports] = useState([
    {
      id: 1,
      name: 'Weekly Candidate Report',
      type: 'candidates',
      format: 'xlsx',
      schedule: 'weekly',
      next_run: '2024-01-22T09:00:00Z',
      status: 'active',
      created_by: 'John Smith',
      recipients: ['hr@techcorp.com', 'manager@techcorp.com']
    },
    {
      id: 2,
      name: 'Monthly Analytics Dashboard',
      type: 'analytics',
      format: 'pdf',
      schedule: 'monthly',
      next_run: '2024-02-01T08:00:00Z',
      status: 'active',
      created_by: 'Sarah Johnson',
      recipients: ['ceo@techcorp.com', 'hr@techcorp.com']
    }
  ])

  const [newExport, setNewExport] = useState({
    name: '',
    type: 'candidates',
    format: 'csv',
    date_range: 'all_time',
    start_date: '',
    end_date: '',
    filters: {
      status: 'all',
      department: 'all',
      location: 'all'
    },
    include_fields: []
  })

  const exportTypes = [
    { 
      value: 'candidates', 
      label: 'Candidates', 
      icon: Users, 
      description: 'Export candidate profiles and resumes',
      fields: ['Personal Info', 'Contact Details', 'Skills', 'Experience', 'Education', 'Resume', 'Application History']
    },
    { 
      value: 'applications', 
      label: 'Job Applications', 
      icon: Briefcase, 
      description: 'Export job application data and status',
      fields: ['Application Details', 'Job Info', 'Candidate Info', 'Status', 'Timeline', 'Interview Notes', 'Feedback']
    },
    { 
      value: 'jobs', 
      label: 'Job Postings', 
      icon: Building, 
      description: 'Export job postings and requirements',
      fields: ['Job Details', 'Requirements', 'Benefits', 'Application Stats', 'Performance Metrics']
    },
    { 
      value: 'interviews', 
      label: 'Interviews', 
      icon: Calendar, 
      description: 'Export interview schedules and feedback',
      fields: ['Interview Details', 'Participants', 'Feedback', 'Scores', 'Notes', 'Recordings']
    },
    { 
      value: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'Export performance analytics and reports',
      fields: ['Performance Metrics', 'Hiring Stats', 'Time-to-Hire', 'Source Analytics', 'Team Performance']
    },
    { 
      value: 'team', 
      label: 'Team Data', 
      icon: Users, 
      description: 'Export team member information',
      fields: ['Member Details', 'Roles', 'Permissions', 'Activity Logs', 'Performance']
    }
  ]

  const formats = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values for spreadsheets' },
    { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format with formatting' },
    { value: 'pdf', label: 'PDF', icon: FileImage, description: 'Formatted report document' },
    { value: 'json', label: 'JSON', icon: Database, description: 'Structured data format for developers' }
  ]

  const dateRanges = [
    { value: 'all_time', label: 'All Time' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const handleCreateExport = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      const exportItem = {
        id: Date.now(),
        ...newExport,
        status: 'processing',
        created_at: new Date().toISOString(),
        completed_at: null,
        file_size: null,
        records_count: null,
        download_url: null,
        created_by: `${user.first_name} ${user.last_name}`
      }
      setExportHistory(prev => [exportItem, ...prev])
      setNewExport({
        name: '',
        type: 'candidates',
        format: 'csv',
        date_range: 'all_time',
        start_date: '',
        end_date: '',
        filters: {
          status: 'all',
          department: 'all',
          location: 'all'
        },
        include_fields: []
      })
      setShowCreateExportModal(false)
    } catch (error) {
      console.error('Failed to create export:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (exportItem) => {
    // Simulate download
    const link = document.createElement('a')
    link.href = exportItem.download_url
    link.download = `${exportItem.name.replace(/\s+/g, '_')}.${exportItem.format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteExport = (exportId) => {
    if (window.confirm('Are you sure you want to delete this export?')) {
      setExportHistory(prev => prev.filter(exp => exp.id !== exportId))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredExports = exportHistory.filter(exp =>
    exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: 'exports', label: 'Export History', icon: Download },
    { id: 'scheduled', label: 'Scheduled Exports', icon: Clock },
    { id: 'templates', label: 'Export Templates', icon: FileText },
    { id: 'settings', label: 'Export Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Export</h1>
              <p className="text-gray-600 mt-1">Export and manage your company data</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule Export
              </button>
              <button
                onClick={() => setShowCreateExportModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Create Export
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Download className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Exports</p>
                  <p className="text-2xl font-bold text-blue-900">{exportHistory.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-900">
                    {exportHistory.filter(e => e.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <RefreshCw className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">Processing</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {exportHistory.filter(e => e.status === 'processing').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Scheduled</p>
                  <p className="text-2xl font-bold text-purple-900">{scheduledExports.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Export History Tab */}
            {activeTab === 'exports' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search exports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                    <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Export List */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Export Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type & Format
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size & Records
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredExports.map((exportItem) => {
                          const typeInfo = exportTypes.find(t => t.value === exportItem.type)
                          const TypeIcon = typeInfo?.icon || FileText
                          
                          return (
                            <tr key={exportItem.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <TypeIcon className="w-8 h-8 text-gray-400 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{exportItem.name}</div>
                                    <div className="text-sm text-gray-500">by {exportItem.created_by}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{typeInfo?.label || exportItem.type}</div>
                                <div className="text-sm text-gray-500">{exportItem.format.toUpperCase()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exportItem.status)}`}>
                                  {getStatusIcon(exportItem.status)}
                                  <span className="ml-1">{exportItem.status}</span>
                                </span>
                                {exportItem.error_message && (
                                  <div className="text-xs text-red-600 mt-1">{exportItem.error_message}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(exportItem.created_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{exportItem.file_size || 'N/A'}</div>
                                <div className="text-sm text-gray-500">
                                  {exportItem.records_count ? `${exportItem.records_count.toLocaleString()} records` : 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  {exportItem.status === 'completed' && (
                                    <button
                                      onClick={() => handleDownload(exportItem)}
                                      className="text-blue-600 hover:text-blue-900"
                                      title="Download"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    className="text-gray-600 hover:text-gray-900"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-gray-600 hover:text-gray-900"
                                    title="Copy Link"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExport(exportItem.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Scheduled Exports Tab */}
            {activeTab === 'scheduled' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scheduledExports.map((schedule) => {
                    const typeInfo = exportTypes.find(t => t.value === schedule.type)
                    const TypeIcon = typeInfo?.icon || FileText
                    
                    return (
                      <div key={schedule.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <TypeIcon className="w-6 h-6 text-gray-400 mr-3" />
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{schedule.name}</h4>
                              <p className="text-sm text-gray-500">{typeInfo?.label} • {schedule.format.toUpperCase()}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {schedule.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Next run: {formatDate(schedule.next_run)}</span>
                          </div>
                          <div className="flex items-center">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            <span>Schedule: {schedule.schedule}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{schedule.recipients.length} recipient(s)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-2 mt-4">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            {schedule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Export Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exportTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <div key={type.value} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <Icon className="w-8 h-8 text-blue-600 mr-3" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{type.label}</h4>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium text-gray-700">Available Fields:</p>
                          <div className="flex flex-wrap gap-1">
                            {type.fields.slice(0, 3).map((field, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {field}
                              </span>
                            ))}
                            {type.fields.length > 3 && (
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{type.fields.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setNewExport(prev => ({ ...prev, type: type.value }))
                            setShowCreateExportModal(true)
                          }}
                          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Create Export
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Export Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Default Export Format</label>
                        <p className="text-sm text-gray-500">Choose the default format for new exports</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="csv">CSV</option>
                        <option value="xlsx">Excel</option>
                        <option value="pdf">PDF</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Auto-delete Exports</label>
                        <p className="text-sm text-gray-500">Automatically delete exports after specified time</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="never">Never</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                        <p className="text-sm text-gray-500">Receive email when exports are completed</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Include Personal Data</label>
                        <p className="text-sm text-gray-500">Include personally identifiable information in exports</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Anonymize Data</label>
                        <p className="text-sm text-gray-500">Replace sensitive data with anonymized values</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Export Modal */}
        {showCreateExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Export</h3>
                <button
                  onClick={() => setShowCreateExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Export Name</label>
                  <input
                    type="text"
                    value={newExport.name}
                    onChange={(e) => setNewExport(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter export name..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                    <select
                      value={newExport.type}
                      onChange={(e) => setNewExport(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {exportTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <select
                      value={newExport.format}
                      onChange={(e) => setNewExport(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {formats.map(format => (
                        <option key={format.value} value={format.value}>{format.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={newExport.date_range}
                    onChange={(e) => setNewExport(prev => ({ ...prev, date_range: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {dateRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {newExport.date_range === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={newExport.start_date}
                        onChange={(e) => setNewExport(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={newExport.end_date}
                        onChange={(e) => setNewExport(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Include Fields</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {exportTypes.find(t => t.value === newExport.type)?.fields.map((field, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          defaultChecked
                        />
                        <span className="text-sm text-gray-700">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateExportModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExport}
                  disabled={loading || !newExport.name}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Export'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataExportPage

