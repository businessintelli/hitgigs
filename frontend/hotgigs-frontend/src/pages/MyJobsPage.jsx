import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Copy, 
  Trash2, 
  Share, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play, 
  BarChart3, 
  Download, 
  Upload, 
  FileText, 
  Grid, 
  List, 
  Star, 
  Target, 
  Activity, 
  Briefcase,
  Building,
  Globe,
  Mail,
  Phone,
  RefreshCw,
  Settings,
  Archive,
  BookOpen,
  Award,
  Zap,
  Heart,
  MessageSquare,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  Bookmark,
  Flag,
  Timer,
  Layers,
  Database,
  PieChart,
  LineChart
} from 'lucide-react'

const MyJobsPage = () => {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_date')
  const [loading, setLoading] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Mock job data - replace with actual API call
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary_min: 120000,
      salary_max: 160000,
      status: 'active',
      applications_count: 45,
      views_count: 234,
      created_date: '2024-01-15',
      expires_date: '2024-02-15',
      priority: 'high',
      remote_allowed: true,
      experience_level: 'Senior',
      skills: ['React', 'JavaScript', 'Node.js', 'TypeScript'],
      description: 'We are looking for a Senior React Developer to join our growing team...',
      requirements: ['5+ years React experience', 'Strong JavaScript skills', 'Team leadership experience'],
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours'],
      hiring_manager: 'John Smith',
      posted_by: 'Sarah Johnson',
      last_activity: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      salary_min: 100000,
      salary_max: 140000,
      status: 'paused',
      applications_count: 28,
      views_count: 156,
      created_date: '2024-01-10',
      expires_date: '2024-02-10',
      priority: 'medium',
      remote_allowed: false,
      experience_level: 'Mid-level',
      skills: ['Product Management', 'Analytics', 'Agile', 'Roadmapping'],
      description: 'Join our product team to drive innovation and user experience...',
      requirements: ['3+ years product management', 'Analytics experience', 'Agile methodology'],
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Learning Budget'],
      hiring_manager: 'Emily Davis',
      posted_by: 'Mike Chen',
      last_activity: '2024-01-18T14:20:00Z'
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'Austin, TX',
      type: 'Contract',
      salary_min: 80000,
      salary_max: 110000,
      status: 'draft',
      applications_count: 0,
      views_count: 0,
      created_date: '2024-01-20',
      expires_date: '2024-03-20',
      priority: 'low',
      remote_allowed: true,
      experience_level: 'Mid-level',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      description: 'We need a talented UX Designer to enhance our user experience...',
      requirements: ['3+ years UX design', 'Figma proficiency', 'User research experience'],
      benefits: ['Flexible Schedule', 'Remote Work', 'Design Tools Budget'],
      hiring_manager: 'Lisa Wang',
      posted_by: 'David Brown',
      last_activity: '2024-01-20T09:15:00Z'
    },
    {
      id: 4,
      title: 'Data Scientist',
      department: 'Analytics',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary_min: 130000,
      salary_max: 170000,
      status: 'closed',
      applications_count: 67,
      views_count: 445,
      created_date: '2023-12-15',
      expires_date: '2024-01-15',
      priority: 'high',
      remote_allowed: true,
      experience_level: 'Senior',
      skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      description: 'Looking for a Data Scientist to drive insights and analytics...',
      requirements: ['PhD or Masters in related field', '5+ years experience', 'Python/R proficiency'],
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Conference Budget'],
      hiring_manager: 'Alex Thompson',
      posted_by: 'Rachel Green',
      last_activity: '2024-01-15T16:45:00Z'
    }
  ])

  const jobStats = {
    total: jobs.length,
    active: jobs.filter(job => job.status === 'active').length,
    paused: jobs.filter(job => job.status === 'paused').length,
    draft: jobs.filter(job => job.status === 'draft').length,
    closed: jobs.filter(job => job.status === 'closed').length,
    total_applications: jobs.reduce((sum, job) => sum + job.applications_count, 0),
    total_views: jobs.reduce((sum, job) => sum + job.views_count, 0),
    avg_applications: Math.round(jobs.reduce((sum, job) => sum + job.applications_count, 0) / jobs.length)
  }

  const statusOptions = [
    { value: 'all', label: 'All Jobs', count: jobStats.total },
    { value: 'active', label: 'Active', count: jobStats.active },
    { value: 'paused', label: 'Paused', count: jobStats.paused },
    { value: 'draft', label: 'Draft', count: jobStats.draft },
    { value: 'closed', label: 'Closed', count: jobStats.closed }
  ]

  const sortOptions = [
    { value: 'created_date', label: 'Created Date' },
    { value: 'title', label: 'Job Title' },
    { value: 'applications_count', label: 'Applications' },
    { value: 'views_count', label: 'Views' },
    { value: 'expires_date', label: 'Expiry Date' },
    { value: 'priority', label: 'Priority' }
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleJobAction = (action, jobId) => {
    switch (action) {
      case 'edit':
        // Navigate to edit job page
        window.location.href = `/post-job?edit=${jobId}`
        break
      case 'view':
        // Navigate to job details page
        window.location.href = `/jobs/${jobId}`
        break
      case 'duplicate':
        // Duplicate job logic
        const jobToDuplicate = jobs.find(job => job.id === jobId)
        if (jobToDuplicate) {
          const newJob = {
            ...jobToDuplicate,
            id: Date.now(),
            title: `${jobToDuplicate.title} (Copy)`,
            status: 'draft',
            applications_count: 0,
            views_count: 0,
            created_date: new Date().toISOString().split('T')[0]
          }
          setJobs(prev => [newJob, ...prev])
        }
        break
      case 'pause':
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: 'paused' } : job
        ))
        break
      case 'activate':
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: 'active' } : job
        ))
        break
      case 'close':
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: 'closed' } : job
        ))
        break
      case 'delete':
        if (window.confirm('Are you sure you want to delete this job?')) {
          setJobs(prev => prev.filter(job => job.id !== jobId))
        }
        break
      default:
        break
    }
  }

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        setJobs(prev => prev.map(job => 
          selectedJobs.includes(job.id) ? { ...job, status: 'active' } : job
        ))
        break
      case 'pause':
        setJobs(prev => prev.map(job => 
          selectedJobs.includes(job.id) ? { ...job, status: 'paused' } : job
        ))
        break
      case 'close':
        setJobs(prev => prev.map(job => 
          selectedJobs.includes(job.id) ? { ...job, status: 'closed' } : job
        ))
        break
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedJobs.length} jobs?`)) {
          setJobs(prev => prev.filter(job => !selectedJobs.includes(job.id)))
        }
        break
      default:
        break
    }
    setSelectedJobs([])
    setShowBulkActions(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'closed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'paused':
        return <Pause className="w-4 h-4" />
      case 'draft':
        return <Edit className="w-4 h-4" />
      case 'closed':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatSalary = (min, max) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
              <p className="text-gray-600 mt-1">Manage your company's job postings</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/analytics'}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
              <button
                onClick={() => window.location.href = '/post-job'}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-blue-900">{jobStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-green-900">{jobStats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Total Applications</p>
                  <p className="text-2xl font-bold text-purple-900">{jobStats.total_applications}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">Total Views</p>
                  <p className="text-2xl font-bold text-orange-900">{jobStats.total_views}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              {/* Bulk Actions */}
              {selectedJobs.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedJobs.length} selected</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Actions
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {showBulkActions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleBulkAction('activate')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Activate Jobs
                        </button>
                        <button
                          onClick={() => handleBulkAction('pause')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Pause Jobs
                        </button>
                        <button
                          onClick={() => handleBulkAction('close')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Close Jobs
                        </button>
                        <button
                          onClick={() => handleBulkAction('delete')}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete Jobs
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={() => setLoading(true)}
                className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Grid/List */}
        <div className="bg-white rounded-lg shadow-sm">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedJobs(prev => [...prev, job.id])
                          } else {
                            setSelectedJobs(prev => prev.filter(id => id !== job.id))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.department}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {/* Dropdown menu would go here */}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                      {job.remote_allowed && <span className="ml-2 text-blue-600">(Remote OK)</span>}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {formatSalary(job.salary_min, job.salary_max)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Posted {formatDate(job.created_date)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1">{job.status}</span>
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(job.priority)}`}>
                      {job.priority} priority
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {job.applications_count} applications
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {job.views_count} views
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleJobAction('view', job.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleJobAction('edit', job.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedJobs(filteredJobs.map(job => job.id))
                          } else {
                            setSelectedJobs([])
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedJobs(prev => [...prev, job.id])
                            } else {
                              setSelectedJobs(prev => prev.filter(id => id !== job.id))
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.department} • {job.location}</div>
                            <div className="text-sm text-gray-500">{formatSalary(job.salary_min, job.salary_max)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="ml-1">{job.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.applications_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.views_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(job.created_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleJobAction('view', job.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Job"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleJobAction('edit', job.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleJobAction('duplicate', job.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Duplicate Job"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleJobAction('delete', job.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by posting your first job'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => window.location.href = '/post-job'}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Job
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyJobsPage

