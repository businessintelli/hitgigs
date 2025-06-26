import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Building, 
  Star, 
  Heart, 
  Eye, 
  Send, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  TrendingUp, 
  Award, 
  Target, 
  Zap, 
  Calendar, 
  Users, 
  Globe, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Share2, 
  MoreHorizontal,
  Plus,
  Bot,
  FileUp,
  FileTemplate,
  Edit,
  Trash2,
  Copy,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Database,
  Lightbulb,
  Sparkles,
  Wand2,
  Save,
  ArrowRight
} from 'lucide-react'

const JobsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [salaryFilter, setSalaryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('posted_date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState([])
  const [showJobCreationModal, setShowJobCreationModal] = useState(false)
  const [showAIJobModal, setShowAIJobModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [jobCreationType, setJobCreationType] = useState('manual') // 'manual', 'template', 'ai', 'import'

  // Check if user can manage jobs (recruiter or company)
  const canManageJobs = user && (user.user_type === 'recruiter' || user.user_type === 'company')

  useEffect(() => {
    loadJobs()
    if (user) {
      loadSavedJobs()
    }
  }, [user])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, locationFilter, salaryFilter, typeFilter, experienceFilter, sortBy, sortOrder])

  const loadJobs = async () => {
    setIsLoading(true)
    try {
      // Sample job data - in real implementation, fetch from API
      const sampleJobs = [
        {
          id: 1,
          title: 'Senior React Developer',
          company: {
            name: 'TechCorp Inc.',
            logo: null,
            size: '100-500 employees',
            industry: 'Technology'
          },
          location: 'San Francisco, CA',
          remote: true,
          salary: '$130,000 - $160,000',
          employment_type: 'Full-time',
          experience_level: 'Senior Level',
          posted_date: '2024-01-15',
          deadline: '2024-02-15',
          description: 'We are seeking a talented Senior React Developer...',
          skills: ['React', 'JavaScript', 'TypeScript', 'Redux'],
          status: 'active',
          applications: 45,
          views: 1247,
          created_by: user?.user_type === 'company' ? user.id : null,
          ai_generated: false
        },
        {
          id: 2,
          title: 'Full Stack Engineer',
          company: {
            name: 'StartupXYZ',
            logo: null,
            size: '10-50 employees',
            industry: 'FinTech'
          },
          location: 'New York, NY',
          remote: false,
          salary: '$120,000 - $150,000',
          employment_type: 'Full-time',
          experience_level: 'Mid Level',
          posted_date: '2024-01-18',
          deadline: '2024-02-18',
          description: 'Join our growing team as a Full Stack Engineer...',
          skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
          status: 'active',
          applications: 32,
          views: 892,
          created_by: null,
          ai_generated: false
        },
        {
          id: 3,
          title: 'Frontend Developer',
          company: {
            name: 'DesignStudio',
            logo: null,
            size: '50-100 employees',
            industry: 'Design'
          },
          location: 'Remote',
          remote: true,
          salary: '$90,000 - $120,000',
          employment_type: 'Full-time',
          experience_level: 'Junior Level',
          posted_date: '2024-01-20',
          deadline: '2024-02-20',
          description: 'We are looking for a creative Frontend Developer...',
          skills: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
          status: 'active',
          applications: 67,
          views: 1456,
          created_by: null,
          ai_generated: true
        }
      ]
      setJobs(sampleJobs)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSavedJobs = async () => {
    try {
      // Load user's saved jobs
      setSavedJobs([1, 3]) // Sample saved job IDs
    } catch (error) {
      console.error('Failed to load saved jobs:', error)
    }
  }

  const filterJobs = () => {
    let filtered = [...jobs]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Employment type filter
    if (typeFilter) {
      filtered = filtered.filter(job => job.employment_type === typeFilter)
    }

    // Experience level filter
    if (experienceFilter) {
      filtered = filtered.filter(job => job.experience_level === experienceFilter)
    }

    // Salary filter
    if (salaryFilter) {
      // Simple salary filtering logic
      filtered = filtered.filter(job => {
        const salaryRange = job.salary.match(/\$(\d+),?(\d+)? - \$(\d+),?(\d+)?/)
        if (salaryRange) {
          const minSalary = parseInt(salaryRange[1] + (salaryRange[2] || ''))
          const maxSalary = parseInt(salaryRange[3] + (salaryRange[4] || ''))
          
          switch (salaryFilter) {
            case '0-50k': return maxSalary <= 50000
            case '50k-100k': return minSalary >= 50000 && maxSalary <= 100000
            case '100k-150k': return minSalary >= 100000 && maxSalary <= 150000
            case '150k+': return minSalary >= 150000
            default: return true
          }
        }
        return true
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'posted_date') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else if (sortBy === 'applications' || sortBy === 'views') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredJobs(filtered)
  }

  const handleSaveJob = async (jobId) => {
    if (!user) {
      navigate('/signin')
      return
    }

    try {
      if (savedJobs.includes(jobId)) {
        setSavedJobs(prev => prev.filter(id => id !== jobId))
      } else {
        setSavedJobs(prev => [...prev, jobId])
      }
    } catch (error) {
      console.error('Failed to save/unsave job:', error)
    }
  }

  const handleJobCreation = (type) => {
    setJobCreationType(type)
    switch (type) {
      case 'manual':
        setShowJobCreationModal(true)
        break
      case 'ai':
        setShowAIJobModal(true)
        break
      case 'import':
        setShowImportModal(true)
        break
      case 'template':
        // Navigate to template selection
        navigate('/jobs/create/template')
        break
      default:
        break
    }
  }

  const handleEditJob = (jobId) => {
    navigate(`/jobs/${jobId}/edit`)
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        setJobs(prev => prev.filter(job => job.id !== jobId))
      } catch (error) {
        console.error('Failed to delete job:', error)
      }
    }
  }

  const handleDuplicateJob = async (jobId) => {
    try {
      const jobToDuplicate = jobs.find(job => job.id === jobId)
      if (jobToDuplicate) {
        const duplicatedJob = {
          ...jobToDuplicate,
          id: Date.now(), // Temporary ID
          title: `${jobToDuplicate.title} (Copy)`,
          posted_date: new Date().toISOString().split('T')[0],
          applications: 0,
          views: 0
        }
        setJobs(prev => [duplicatedJob, ...prev])
      }
    } catch (error) {
      console.error('Failed to duplicate job:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const daysAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24))
    return days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
              <p className="text-gray-600 mt-1">
                {canManageJobs ? 'Manage your job postings and find the best candidates' : 'Discover your next career opportunity'}
              </p>
            </div>
            
            {canManageJobs && (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowJobCreationModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Job
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <button
                  onClick={() => navigate('/jobs/analytics')}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="posted_date">Date Posted</option>
                  <option value="title">Job Title</option>
                  <option value="applications">Applications</option>
                  <option value="views">Views</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="City, State, or Remote"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Junior Level">Junior Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <select
                    value={salaryFilter}
                    onChange={(e) => setSalaryFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Salaries</option>
                    <option value="0-50k">$0 - $50k</option>
                    <option value="50k-100k">$50k - $100k</option>
                    <option value="100k-150k">$100k - $150k</option>
                    <option value="150k+">$150k+</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
          {canManageJobs && (
            <div className="text-sm text-gray-600">
              Your jobs: {jobs.filter(job => job.created_by === user?.id).length}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading jobs...</span>
          </div>
        )}

        {/* Jobs Grid/List */}
        {!isLoading && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Building className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                            <p className="text-gray-600">{job.company.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {job.ai_generated && (
                            <div className="p-1 bg-purple-100 rounded-full" title="AI Generated">
                              <Bot className="w-3 h-3 text-purple-600" />
                            </div>
                          )}
                          {canManageJobs && job.created_by === user?.id && (
                            <div className="relative">
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                          {job.remote && (
                            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.employment_type} • {job.experience_level}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {daysAgo(job.posted_date)}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {canManageJobs && job.created_by === user?.id && (
                        <div className="grid grid-cols-2 gap-4 mb-4 text-center text-xs text-gray-600 border-t border-gray-100 pt-3">
                          <div>
                            <div className="font-semibold text-gray-900">{job.applications}</div>
                            <div>Applications</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{job.views}</div>
                            <div>Views</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!canManageJobs && (
                            <button
                              onClick={() => handleSaveJob(job.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                savedJobs.includes(job.id)
                                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                            </button>
                          )}
                          {canManageJobs && job.created_by === user?.id ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEditJob(job.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                                title="Edit Job"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicateJob(job.id)}
                                className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                                title="Duplicate Job"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                title="Delete Job"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => navigate(`/jobs/${job.id}`)}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Apply
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posted
                        </th>
                        {canManageJobs && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stats
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Building className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                <div className="text-sm text-gray-500">{job.employment_type} • {job.experience_level}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{job.company.name}</div>
                            <div className="text-sm text-gray-500">{job.company.industry}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{job.location}</div>
                            {job.remote && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Remote
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {job.salary}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {daysAgo(job.posted_date)}
                          </td>
                          {canManageJobs && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {job.created_by === user?.id ? (
                                <div className="text-xs">
                                  <div>{job.applications} applications</div>
                                  <div>{job.views} views</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {!canManageJobs && (
                                <button
                                  onClick={() => handleSaveJob(job.id)}
                                  className={`${
                                    savedJobs.includes(job.id)
                                      ? 'text-red-600 hover:text-red-900'
                                      : 'text-gray-400 hover:text-red-600'
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                                </button>
                              )}
                              {canManageJobs && job.created_by === user?.id && (
                                <>
                                  <button
                                    onClick={() => handleEditJob(job.id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && filteredJobs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || locationFilter || typeFilter || experienceFilter || salaryFilter
                ? 'Try adjusting your search criteria to find more jobs.'
                : canManageJobs
                ? 'Get started by creating your first job posting.'
                : 'Check back later for new opportunities.'}
            </p>
            {canManageJobs && (
              <button
                onClick={() => setShowJobCreationModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </button>
            )}
          </div>
        )}
      </div>

      {/* Job Creation Modal */}
      {showJobCreationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Job</h3>
              <button 
                onClick={() => setShowJobCreationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleJobCreation('manual')}
                className="w-full flex items-center p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Create Manually</h4>
                  <p className="text-sm text-gray-600">Build a job posting from scratch</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </button>

              <button
                onClick={() => handleJobCreation('ai')}
                className="w-full flex items-center p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI-Generated Job</h4>
                  <p className="text-sm text-gray-600">Let AI create a job description for you</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </button>

              <button
                onClick={() => handleJobCreation('template')}
                className="w-full flex items-center p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <FileTemplate className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Use Template</h4>
                  <p className="text-sm text-gray-600">Start with a pre-built template</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </button>

              <button
                onClick={() => handleJobCreation('import')}
                className="w-full flex items-center p-4 text-left border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Upload className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Import Job Data</h4>
                  <p className="text-sm text-gray-600">Upload job details from a file</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Job Creation Modal */}
      {showAIJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                AI Job Creation
              </h3>
              <button 
                onClick={() => setShowAIJobModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Senior React Developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Skill</label>
                  <input
                    type="text"
                    placeholder="e.g., React"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Skills</label>
                  <input
                    type="text"
                    placeholder="e.g., JavaScript, TypeScript"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Select Domain</option>
                    <option value="fintech">FinTech</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="education">Education</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Select Level</option>
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead/Principal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g., $120k - $150k"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Any specific requirements or preferences..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Lightbulb className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-900">AI will generate:</h4>
                </div>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Comprehensive job description</li>
                  <li>• Required and preferred qualifications</li>
                  <li>• Responsibilities and expectations</li>
                  <li>• Company benefits and perks</li>
                  <li>• Interview questions suggestions</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowAIJobModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowAIJobModal(false)
                    alert('AI job generation started! You will be redirected to the job editor.')
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Job with AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Import Job Data</h3>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Job File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">JSON, CSV, or Excel files</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-semibold mb-2">Supported formats:</h4>
                <ul className="space-y-1">
                  <li>• JSON with job schema</li>
                  <li>• CSV with job details</li>
                  <li>• Excel spreadsheet</li>
                  <li>• Job board exports</li>
                </ul>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowImportModal(false)
                    alert('Job import started! Processing your file...')
                  }}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Import Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobsPage

