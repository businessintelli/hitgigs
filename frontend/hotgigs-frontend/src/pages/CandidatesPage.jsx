import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc, 
  ChevronDown, 
  ChevronRight, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Star, 
  Award, 
  Target, 
  TrendingUp, 
  RefreshCw, 
  MoreHorizontal, 
  Users, 
  UserPlus, 
  FileUp, 
  Database, 
  Bot, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Building, 
  GraduationCap, 
  Code, 
  Globe, 
  Linkedin, 
  Github, 
  ExternalLink,
  Flame,
  UserCheck,
  UserX,
  Send,
  MessageSquare,
  Settings,
  BookOpen,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown
} from 'lucide-react'

const CandidatesPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [candidates, setCandidates] = useState([])
  const [hotListCandidates, setHotListCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterBy, setFilterBy] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'hotlist'
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Get initial tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab') || 'all'
    setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    loadCandidates()
    loadHotListCandidates()
  }, [])

  const loadCandidates = async () => {
    try {
      // Sample candidate data - in real implementation, fetch from API
      const sampleCandidates = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1-555-0123',
          location: 'San Francisco, CA',
          title: 'Senior React Developer',
          experience: '5 years',
          skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Node.js'],
          education: 'BS Computer Science - Stanford University',
          salary_expectation: '$130,000 - $150,000',
          availability: 'Available',
          status: 'active',
          source: 'manual',
          added_date: '2024-01-15',
          last_active: '2024-01-20',
          applications: 12,
          interviews: 5,
          offers: 2,
          rejections: 3,
          match_score: 92,
          resume_url: '/resumes/john-smith.pdf',
          portfolio_url: 'https://johnsmith.dev',
          linkedin_url: 'https://linkedin.com/in/johnsmith',
          github_url: 'https://github.com/johnsmith',
          notes: 'Excellent React developer with strong problem-solving skills',
          tags: ['top-performer', 'react-expert'],
          domain_expertise: ['E-commerce', 'FinTech']
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1-555-0124',
          location: 'Remote',
          title: 'Full Stack Developer',
          experience: '6 years',
          skills: ['React', 'Node.js', 'Python', 'AWS', 'GraphQL'],
          education: 'MS Software Engineering - MIT',
          salary_expectation: '$140,000 - $160,000',
          availability: 'Available in 2 weeks',
          status: 'active',
          source: 'imported',
          added_date: '2024-01-10',
          last_active: '2024-01-19',
          applications: 8,
          interviews: 3,
          offers: 1,
          rejections: 2,
          match_score: 89,
          resume_url: '/resumes/sarah-johnson.pdf',
          portfolio_url: 'https://sarahjohnson.com',
          linkedin_url: 'https://linkedin.com/in/sarahjohnson',
          github_url: 'https://github.com/sarahjohnson',
          notes: 'Strong full-stack developer with cloud expertise',
          tags: ['cloud-expert', 'full-stack'],
          domain_expertise: ['Healthcare', 'E-commerce']
        },
        {
          id: 3,
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1-555-0125',
          location: 'New York, NY',
          title: 'Frontend Developer',
          experience: '4 years',
          skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'Figma'],
          education: 'BS Computer Science - UC Berkeley',
          salary_expectation: '$110,000 - $130,000',
          availability: 'Available',
          status: 'active',
          source: 'bulk_import',
          added_date: '2024-01-05',
          last_active: '2024-01-18',
          applications: 15,
          interviews: 7,
          offers: 3,
          rejections: 5,
          match_score: 85,
          resume_url: '/resumes/mike-chen.pdf',
          portfolio_url: 'https://mikechen.design',
          linkedin_url: 'https://linkedin.com/in/mikechen',
          github_url: 'https://github.com/mikechen',
          notes: 'Creative frontend developer with strong design skills',
          tags: ['ui-ux', 'creative'],
          domain_expertise: ['Media', 'Gaming']
        },
        {
          id: 4,
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1-555-0126',
          location: 'Austin, TX',
          title: 'DevOps Engineer',
          experience: '7 years',
          skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Terraform'],
          education: 'MS Computer Engineering - UT Austin',
          salary_expectation: '$150,000 - $170,000',
          availability: 'Available',
          status: 'active',
          source: 'applied',
          added_date: '2024-01-12',
          last_active: '2024-01-20',
          applications: 6,
          interviews: 4,
          offers: 2,
          rejections: 1,
          match_score: 94,
          resume_url: '/resumes/emily-rodriguez.pdf',
          portfolio_url: null,
          linkedin_url: 'https://linkedin.com/in/emilyrodriguez',
          github_url: 'https://github.com/emilyrodriguez',
          notes: 'Highly skilled DevOps engineer with extensive cloud experience',
          tags: ['devops-expert', 'cloud-architect'],
          domain_expertise: ['FinTech', 'Healthcare']
        }
      ]
      setCandidates(sampleCandidates)
    } catch (error) {
      console.error('Failed to load candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadHotListCandidates = async () => {
    try {
      // Sample hot list data - bench candidates (existing employees without jobs)
      const sampleHotList = [
        {
          id: 101,
          name: 'Alex Thompson',
          email: 'alex.thompson@company.com',
          phone: '+1-555-0201',
          location: 'Seattle, WA',
          title: 'Senior Software Engineer',
          experience: '8 years',
          skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'React'],
          current_company: 'TechCorp Inc.',
          employee_id: 'EMP001',
          department: 'Engineering',
          bench_since: '2024-01-01',
          previous_project: 'E-commerce Platform',
          availability: 'Immediately Available',
          status: 'bench',
          billable_rate: '$85/hour',
          utilization: '0%',
          last_project_end: '2023-12-31',
          skills_rating: 4.5,
          performance_rating: 4.8,
          client_feedback: 'Excellent technical skills and communication',
          certifications: ['AWS Solutions Architect', 'Java Oracle Certified'],
          domain_expertise: ['E-commerce', 'FinTech', 'Healthcare']
        },
        {
          id: 102,
          name: 'Lisa Wang',
          email: 'lisa.wang@company.com',
          phone: '+1-555-0202',
          location: 'San Francisco, CA',
          title: 'UI/UX Designer',
          experience: '5 years',
          skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
          current_company: 'TechCorp Inc.',
          employee_id: 'EMP002',
          department: 'Design',
          bench_since: '2024-01-10',
          previous_project: 'Mobile Banking App',
          availability: 'Available in 1 week',
          status: 'bench',
          billable_rate: '$75/hour',
          utilization: '0%',
          last_project_end: '2024-01-05',
          skills_rating: 4.7,
          performance_rating: 4.6,
          client_feedback: 'Creative designer with strong user-centric approach',
          certifications: ['Google UX Design Certificate'],
          domain_expertise: ['FinTech', 'Healthcare', 'E-commerce']
        },
        {
          id: 103,
          name: 'Robert Kim',
          email: 'robert.kim@company.com',
          phone: '+1-555-0203',
          location: 'Chicago, IL',
          title: 'Data Scientist',
          experience: '6 years',
          skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Tableau'],
          current_company: 'TechCorp Inc.',
          employee_id: 'EMP003',
          department: 'Data Science',
          bench_since: '2023-12-15',
          previous_project: 'Predictive Analytics Platform',
          availability: 'Immediately Available',
          status: 'bench',
          billable_rate: '$90/hour',
          utilization: '0%',
          last_project_end: '2023-12-10',
          skills_rating: 4.8,
          performance_rating: 4.9,
          client_feedback: 'Outstanding analytical skills and business acumen',
          certifications: ['AWS Machine Learning Specialty', 'Google Cloud Professional'],
          domain_expertise: ['FinTech', 'Healthcare', 'Retail']
        }
      ]
      setHotListCandidates(sampleHotList)
    } catch (error) {
      console.error('Failed to load hot list candidates:', error)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchParams({ tab })
    setSelectedCandidates([])
  }

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const handleSelectAll = () => {
    const currentCandidates = activeTab === 'all' ? candidates : hotListCandidates
    const allIds = currentCandidates.map(c => c.id)
    setSelectedCandidates(
      selectedCandidates.length === allIds.length ? [] : allIds
    )
  }

  const handleViewCandidate = (candidateId) => {
    navigate(`/candidates/${candidateId}`)
  }

  const handleEditCandidate = (candidateId) => {
    navigate(`/candidates/${candidateId}/edit`)
  }

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        // Delete candidate
        setCandidates(prev => prev.filter(c => c.id !== candidateId))
        setHotListCandidates(prev => prev.filter(c => c.id !== candidateId))
      } catch (error) {
        console.error('Failed to delete candidate:', error)
      }
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedCandidates.length === 0) {
      alert('Please select candidates first.')
      return
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedCandidates.length} candidate(s)?`)) {
          setCandidates(prev => prev.filter(c => !selectedCandidates.includes(c.id)))
          setHotListCandidates(prev => prev.filter(c => !selectedCandidates.includes(c.id)))
          setSelectedCandidates([])
        }
        break
      case 'export':
        // Export selected candidates
        alert(`Exporting ${selectedCandidates.length} candidate(s)...`)
        break
      case 'tag':
        // Add tags to selected candidates
        alert(`Adding tags to ${selectedCandidates.length} candidate(s)...`)
        break
      default:
        break
    }
    setShowBulkActions(false)
  }

  const filteredCandidates = () => {
    const currentCandidates = activeTab === 'all' ? candidates : hotListCandidates
    return currentCandidates.filter(candidate => {
      const matchesSearch = searchTerm === '' || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidate.title.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'available' && candidate.availability.includes('Available')) ||
        (filterBy === 'high-match' && candidate.match_score >= 90) ||
        (filterBy === 'recent' && new Date(candidate.last_active) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      
      return matchesSearch && matchesFilter
    }).sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'match_score' || sortBy === 'applications') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'bench': return 'text-orange-600 bg-orange-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSourceIcon = (source) => {
    switch (source) {
      case 'manual': return <UserPlus className="w-4 h-4" />
      case 'imported': return <FileUp className="w-4 h-4" />
      case 'bulk_import': return <Database className="w-4 h-4" />
      case 'applied': return <Send className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
              <p className="text-gray-600 mt-1">Manage your candidate database and hot list</p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedCandidates.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Bulk Actions ({selectedCandidates.length})
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {showBulkActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={() => handleBulkAction('export')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Selected
                      </button>
                      <button
                        onClick={() => handleBulkAction('tag')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Add Tags
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => navigate('/bulk-resume-upload')}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Candidates
              </button>
              <button
                onClick={() => setShowAddCandidateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                All Candidates ({candidates.length})
              </button>
              <button
                onClick={() => handleTabChange('hotlist')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'hotlist'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Flame className="w-4 h-4 mr-2" />
                Hot List ({hotListCandidates.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
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
                  <option value="name">Name</option>
                  <option value="match_score">Match Score</option>
                  <option value="last_active">Last Active</option>
                  <option value="applications">Applications</option>
                  <option value="added_date">Date Added</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Candidates</option>
                    <option value="available">Available</option>
                    <option value="high-match">High Match (90%+)</option>
                    <option value="recent">Recently Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <input
                    type="text"
                    placeholder="Filter by skills..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Showing {filteredCandidates().length} of {activeTab === 'all' ? candidates.length : hotListCandidates.length} candidates
            </p>
            {selectedCandidates.length > 0 && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCandidates.length === filteredCandidates().length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            )}
          </div>
        </div>

        {/* Candidates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates().map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleCandidateSelect(candidate.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewCandidate(candidate.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditCandidate(candidate.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{candidate.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{candidate.title}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status === 'bench' ? 'Hot List' : candidate.status}
                      </span>
                      {candidate.match_score && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(candidate.match_score)}`}>
                          {candidate.match_score}% Match
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-3 h-3 mr-2" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-2" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-3 h-3 mr-2" />
                      {candidate.experience}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{candidate.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {activeTab === 'all' && (
                    <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-600 border-t border-gray-100 pt-3">
                      <div>
                        <div className="font-semibold text-gray-900">{candidate.applications}</div>
                        <div>Applied</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{candidate.interviews}</div>
                        <div>Interviews</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{candidate.offers}</div>
                        <div>Offers</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{candidate.rejections}</div>
                        <div>Rejected</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'hotlist' && (
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span>Bench Since: {new Date(candidate.bench_since).toLocaleDateString()}</span>
                        <span className="font-semibold">{candidate.billable_rate}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Rating: {candidate.performance_rating}/5</span>
                        <span className="text-orange-600 font-medium">Available</span>
                      </div>
                    </div>
                  )}
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
                      <input
                        type="checkbox"
                        checked={selectedCandidates.length === filteredCandidates().length && filteredCandidates().length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {activeTab === 'all' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statistics
                      </th>
                    )}
                    {activeTab === 'hotlist' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bench Info
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCandidates().map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => handleCandidateSelect(candidate.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.title}</div>
                            <div className="text-xs text-gray-400">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="text-xs text-gray-500">+{candidate.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                            {candidate.status === 'bench' ? 'Hot List' : candidate.status}
                          </span>
                          {candidate.match_score && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMatchScoreColor(candidate.match_score)}`}>
                              {candidate.match_score}% Match
                            </span>
                          )}
                        </div>
                      </td>
                      {activeTab === 'all' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Applied: {candidate.applications}</div>
                            <div>Interviews: {candidate.interviews}</div>
                            <div>Offers: {candidate.offers}</div>
                            <div>Rejected: {candidate.rejections}</div>
                          </div>
                        </td>
                      )}
                      {activeTab === 'hotlist' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="text-xs">
                            <div>Since: {new Date(candidate.bench_since).toLocaleDateString()}</div>
                            <div>Rate: {candidate.billable_rate}</div>
                            <div>Rating: {candidate.performance_rating}/5</div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewCandidate(candidate.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditCandidate(candidate.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCandidate(candidate.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
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
          </div>
        )}

        {/* Empty State */}
        {filteredCandidates().length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filters to find candidates.'
                : 'Get started by adding your first candidate or importing from your existing database.'}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setShowAddCandidateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </button>
              <button
                onClick={() => navigate('/bulk-resume-upload')}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Candidates
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Candidate</h3>
              <button 
                onClick={() => setShowAddCandidateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowAddCandidateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowAddCandidateModal(false)
                    alert('Candidate added successfully!')
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidatesPage

