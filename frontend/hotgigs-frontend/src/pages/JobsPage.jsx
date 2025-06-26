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
  MoreHorizontal 
} from 'lucide-react'

const JobsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // list or grid
  const [showFilters, setShowFilters] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [applyWithoutLogin, setApplyWithoutLogin] = useState(false)
  const [savedJobs, setSavedJobs] = useState(new Set())
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    jobType: 'all',
    experienceLevel: 'all',
    salaryRange: 'all',
    remote: 'all',
    company: '',
    skills: '',
    datePosted: 'all'
  })
  
  const [sortBy, setSortBy] = useState('relevance')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Application form states
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    resumeText: '',
    coverLetter: '',
    uploadMethod: 'upload' // upload or paste
  })

  useEffect(() => {
    loadJobs()
    loadSavedJobs()
  }, [])

  useEffect(() => {
    filterAndSortJobs()
  }, [jobs, filters, sortBy, searchTerm])

  const loadJobs = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to load jobs
      const sampleJobs = [
        {
          id: 1,
          title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          companyLogo: '/api/placeholder/48/48',
          location: 'San Francisco, CA',
          remote: true,
          jobType: 'Full-time',
          experienceLevel: 'Senior',
          salary: {
            min: 120000,
            max: 180000,
            currency: 'USD',
            period: 'yearly'
          },
          description: 'We are looking for a Senior React Developer to join our dynamic team. You will be responsible for developing user interface components and implementing them following well-known React.js workflows.',
          requirements: [
            '5+ years of experience with React.js',
            'Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model',
            'Thorough understanding of React.js and its core principles',
            'Experience with popular React.js workflows (such as Flux or Redux)',
            'Familiarity with newer specifications of EcmaScript',
            'Experience with data structure libraries',
            'Knowledge of isomorphic React is a plus'
          ],
          skills: ['React', 'JavaScript', 'Redux', 'HTML', 'CSS', 'Node.js'],
          benefits: [
            'Health Insurance',
            'Dental & Vision',
            '401(k) with matching',
            'Stock Options',
            'Remote Work',
            'Flexible Hours',
            'Learning Budget',
            'Gym Membership'
          ],
          postedDate: '2024-01-15',
          applicationDeadline: '2024-02-15',
          applicants: 45,
          views: 234,
          matchScore: 92,
          featured: true,
          urgent: false,
          companySize: '100-500',
          industry: 'Technology',
          companyRating: 4.5,
          workingHours: '40 hours/week',
          vacationDays: 25,
          startDate: 'Immediate',
          reportingTo: 'Engineering Manager',
          team: 'Frontend Development',
          department: 'Engineering'
        },
        {
          id: 2,
          title: 'Frontend Engineer',
          company: 'StartupXYZ',
          companyLogo: '/api/placeholder/48/48',
          location: 'Remote',
          remote: true,
          jobType: 'Full-time',
          experienceLevel: 'Mid-level',
          salary: {
            min: 90000,
            max: 130000,
            currency: 'USD',
            period: 'yearly'
          },
          description: 'Join our fast-growing startup as a Frontend Engineer. You\'ll work on cutting-edge web applications and help shape the future of our product.',
          requirements: [
            '3+ years of frontend development experience',
            'Proficiency in React, Vue.js, or Angular',
            'Strong understanding of HTML, CSS, and JavaScript',
            'Experience with responsive design and cross-browser compatibility',
            'Knowledge of version control systems (Git)',
            'Understanding of RESTful APIs and AJAX'
          ],
          skills: ['React', 'Vue.js', 'JavaScript', 'HTML', 'CSS', 'Git'],
          benefits: [
            'Health Insurance',
            'Equity Package',
            'Remote Work',
            'Flexible Hours',
            'Learning Budget',
            'Home Office Setup'
          ],
          postedDate: '2024-01-12',
          applicationDeadline: '2024-02-12',
          applicants: 28,
          views: 156,
          matchScore: 87,
          featured: false,
          urgent: true,
          companySize: '10-50',
          industry: 'Technology',
          companyRating: 4.2,
          workingHours: 'Flexible',
          vacationDays: 20,
          startDate: '2024-02-01',
          reportingTo: 'CTO',
          team: 'Product Development',
          department: 'Engineering'
        },
        {
          id: 3,
          title: 'Full Stack Developer',
          company: 'InnovateLab',
          companyLogo: '/api/placeholder/48/48',
          location: 'New York, NY',
          remote: false,
          jobType: 'Full-time',
          experienceLevel: 'Mid-level',
          salary: {
            min: 100000,
            max: 140000,
            currency: 'USD',
            period: 'yearly'
          },
          description: 'We\'re seeking a talented Full Stack Developer to join our innovative team. You\'ll work on both frontend and backend technologies to build scalable web applications.',
          requirements: [
            '4+ years of full stack development experience',
            'Proficiency in both frontend and backend technologies',
            'Experience with React, Node.js, and databases',
            'Knowledge of cloud platforms (AWS, Azure, or GCP)',
            'Understanding of DevOps practices',
            'Strong problem-solving skills'
          ],
          skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
          benefits: [
            'Health Insurance',
            'Dental & Vision',
            '401(k)',
            'Gym Membership',
            'Catered Meals',
            'Transit Benefits'
          ],
          postedDate: '2024-01-10',
          applicationDeadline: '2024-02-10',
          applicants: 67,
          views: 289,
          matchScore: 84,
          featured: true,
          urgent: false,
          companySize: '50-100',
          industry: 'Technology',
          companyRating: 4.3,
          workingHours: '40 hours/week',
          vacationDays: 22,
          startDate: '2024-02-15',
          reportingTo: 'Lead Developer',
          team: 'Full Stack Development',
          department: 'Engineering'
        },
        {
          id: 4,
          title: 'DevOps Engineer',
          company: 'CloudTech Solutions',
          companyLogo: '/api/placeholder/48/48',
          location: 'Austin, TX',
          remote: true,
          jobType: 'Full-time',
          experienceLevel: 'Senior',
          salary: {
            min: 130000,
            max: 170000,
            currency: 'USD',
            period: 'yearly'
          },
          description: 'Join our DevOps team to build and maintain scalable infrastructure. You\'ll work with cutting-edge cloud technologies and automation tools.',
          requirements: [
            '5+ years of DevOps experience',
            'Strong knowledge of AWS/Azure/GCP',
            'Experience with containerization (Docker, Kubernetes)',
            'Proficiency in Infrastructure as Code (Terraform, CloudFormation)',
            'Knowledge of CI/CD pipelines',
            'Experience with monitoring and logging tools'
          ],
          skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python'],
          benefits: [
            'Health Insurance',
            'Stock Options',
            'Remote Work',
            'Tech Budget',
            'Conference Budget',
            'Flexible PTO'
          ],
          postedDate: '2024-01-08',
          applicationDeadline: '2024-02-08',
          applicants: 34,
          views: 178,
          matchScore: 89,
          featured: false,
          urgent: false,
          companySize: '200-500',
          industry: 'Technology',
          companyRating: 4.4,
          workingHours: 'Flexible',
          vacationDays: 'Unlimited',
          startDate: '2024-02-20',
          reportingTo: 'DevOps Manager',
          team: 'DevOps',
          department: 'Infrastructure'
        },
        {
          id: 5,
          title: 'UI/UX Designer',
          company: 'DesignStudio Pro',
          companyLogo: '/api/placeholder/48/48',
          location: 'Los Angeles, CA',
          remote: true,
          jobType: 'Full-time',
          experienceLevel: 'Mid-level',
          salary: {
            min: 80000,
            max: 120000,
            currency: 'USD',
            period: 'yearly'
          },
          description: 'We\'re looking for a creative UI/UX Designer to create amazing user experiences. You\'ll work closely with our development team to bring designs to life.',
          requirements: [
            '3+ years of UI/UX design experience',
            'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
            'Strong understanding of user-centered design principles',
            'Experience with prototyping and wireframing',
            'Knowledge of responsive design',
            'Portfolio showcasing design projects'
          ],
          skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS'],
          benefits: [
            'Health Insurance',
            'Creative Budget',
            'Remote Work',
            'Flexible Hours',
            'Design Conferences',
            'Equipment Allowance'
          ],
          postedDate: '2024-01-14',
          applicationDeadline: '2024-02-14',
          applicants: 52,
          views: 201,
          matchScore: 76,
          featured: false,
          urgent: true,
          companySize: '20-50',
          industry: 'Design',
          companyRating: 4.1,
          workingHours: 'Flexible',
          vacationDays: 18,
          startDate: '2024-02-05',
          reportingTo: 'Design Director',
          team: 'Design',
          department: 'Product'
        },
        {
          id: 6,
          title: 'Data Scientist',
          company: 'DataCorp Analytics',
          companyLogo: '/api/placeholder/48/48',
          location: 'Seattle, WA',
          remote: false,
          jobType: 'Full-time',
          experienceLevel: 'Senior',
          salary: {
            min: 140000,
            max: 190000,
            currency: 'USD',
            period: 'yearly'
          },
          description: 'Join our data science team to extract insights from large datasets and build predictive models. You\'ll work on exciting projects that drive business decisions.',
          requirements: [
            '5+ years of data science experience',
            'Strong proficiency in Python and R',
            'Experience with machine learning frameworks',
            'Knowledge of statistical analysis and modeling',
            'Experience with big data technologies',
            'PhD in relevant field preferred'
          ],
          skills: ['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'],
          benefits: [
            'Health Insurance',
            'Research Budget',
            'Conference Attendance',
            'Stock Options',
            'Sabbatical Program',
            'Continuing Education'
          ],
          postedDate: '2024-01-11',
          applicationDeadline: '2024-02-11',
          applicants: 23,
          views: 134,
          matchScore: 91,
          featured: true,
          urgent: false,
          companySize: '500+',
          industry: 'Analytics',
          companyRating: 4.6,
          workingHours: '40 hours/week',
          vacationDays: 28,
          startDate: '2024-03-01',
          reportingTo: 'Head of Data Science',
          team: 'Data Science',
          department: 'Analytics'
        }
      ]

      setJobs(sampleJobs)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSavedJobs = () => {
    // Load saved jobs from localStorage
    const saved = localStorage.getItem('savedJobs')
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)))
    }
  }

  const filterAndSortJobs = () => {
    let filtered = [...jobs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Apply job type filter
    if (filters.jobType !== 'all') {
      filtered = filtered.filter(job => job.jobType === filters.jobType)
    }

    // Apply experience level filter
    if (filters.experienceLevel !== 'all') {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel)
    }

    // Apply salary range filter
    if (filters.salaryRange !== 'all') {
      const [min, max] = filters.salaryRange.split('-').map(Number)
      filtered = filtered.filter(job => {
        const jobMin = job.salary.min
        const jobMax = job.salary.max
        if (max) {
          return jobMin >= min && jobMax <= max
        } else {
          return jobMin >= min
        }
      })
    }

    // Apply remote filter
    if (filters.remote !== 'all') {
      const isRemote = filters.remote === 'remote'
      filtered = filtered.filter(job => job.remote === isRemote)
    }

    // Apply company filter
    if (filters.company) {
      filtered = filtered.filter(job =>
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      )
    }

    // Apply skills filter
    if (filters.skills) {
      const skillsArray = filters.skills.toLowerCase().split(',').map(s => s.trim())
      filtered = filtered.filter(job =>
        skillsArray.some(skill =>
          job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill))
        )
      )
    }

    // Apply date posted filter
    if (filters.datePosted !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (filters.datePosted) {
        case 'today':
          filterDate.setDate(now.getDate())
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        default:
          break
      }
      
      if (filters.datePosted !== 'all') {
        filtered = filtered.filter(job => new Date(job.postedDate) >= filterDate)
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.matchScore || 0) - (a.matchScore || 0)
        case 'date_desc':
          return new Date(b.postedDate) - new Date(a.postedDate)
        case 'date_asc':
          return new Date(a.postedDate) - new Date(b.postedDate)
        case 'salary_desc':
          return b.salary.max - a.salary.max
        case 'salary_asc':
          return a.salary.min - b.salary.min
        case 'company_asc':
          return a.company.localeCompare(b.company)
        case 'company_desc':
          return b.company.localeCompare(a.company)
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
  }

  const handleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
    localStorage.setItem('savedJobs', JSON.stringify([...newSavedJobs]))
  }

  const handleApplyClick = (job) => {
    setSelectedJob(job)
    setShowApplyModal(true)
    setApplyWithoutLogin(false)
    setApplicationForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      resume: null,
      resumeText: '',
      coverLetter: '',
      uploadMethod: 'upload'
    })
  }

  const handleApplyWithoutLogin = () => {
    setApplyWithoutLogin(true)
    setApplicationForm({
      name: '',
      email: '',
      phone: '',
      resume: null,
      resumeText: '',
      coverLetter: '',
      uploadMethod: 'upload'
    })
  }

  const handleLoginRedirect = () => {
    setShowApplyModal(false)
    navigate('/signin')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setApplicationForm(prev => ({ ...prev, resume: file }))
    }
  }

  const handleSubmitApplication = async () => {
    try {
      // Validate form
      if (!applicationForm.name || !applicationForm.email || !applicationForm.phone) {
        alert('Please fill in all required fields')
        return
      }

      if (applicationForm.uploadMethod === 'upload' && !applicationForm.resume) {
        alert('Please upload your resume')
        return
      }

      if (applicationForm.uploadMethod === 'paste' && !applicationForm.resumeText) {
        alert('Please paste your resume content')
        return
      }

      // Simulate API call
      console.log('Submitting application:', {
        jobId: selectedJob.id,
        applicant: applicationForm,
        withoutLogin: applyWithoutLogin
      })

      alert('Application submitted successfully!')
      setShowApplyModal(false)
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert('Failed to submit application. Please try again.')
    }
  }

  const formatSalary = (salary) => {
    const min = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary.min)

    const max = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary.max)

    return `${min} - ${max}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const renderJobCard = (job) => (
    <div key={job.id} className={`job-card card hover:shadow-lg transition-all duration-200 ${job.featured ? 'featured' : ''}`}>
      {job.featured && (
        <div className="featured-badge">
          <Star size={12} />
          Featured
        </div>
      )}
      
      {job.urgent && (
        <div className="urgent-badge">
          <AlertCircle size={12} />
          Urgent
        </div>
      )}

      {/* Job Header */}
      <div className="job-header flex justify-between items-start mb-4">
        <div className="job-info flex items-start">
          <img 
            src={job.companyLogo} 
            alt={job.company}
            className="w-12 h-12 rounded-lg border border-gray-200 mr-4"
          />
          <div className="job-details">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-600 font-medium">{job.company}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={14} />
                {job.jobType}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(job.postedDate)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="job-meta text-right">
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {formatSalary(job.salary)}
          </div>
          {job.matchScore && (
            <div className="text-sm text-blue-600 font-medium mb-2">
              {job.matchScore}% match
            </div>
          )}
          <div className="flex items-center gap-2">
            {job.remote && (
              <span className="badge bg-green-100 text-green-800 text-xs">Remote</span>
            )}
            <span className="badge bg-gray-100 text-gray-700 text-xs">{job.experienceLevel}</span>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="job-description mb-4">
        <p className="text-gray-700 text-sm line-clamp-3">{job.description}</p>
      </div>

      {/* Skills */}
      <div className="job-skills mb-4">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill, index) => (
            <span key={index} className="skill-tag badge bg-blue-100 text-blue-800 text-xs">
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-sm text-gray-500">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Job Stats */}
      <div className="job-stats mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users size={14} />
            {job.applicants} applicants
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {job.views} views
          </span>
          <span className="flex items-center gap-1">
            <Star size={14} />
            {job.companyRating}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="job-actions flex justify-between items-center">
        <div className="action-buttons flex gap-2">
          <button 
            className="btn btn-secondary btn-sm flex items-center gap-2"
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <Eye size={14} />
            View Details
          </button>
          
          <button 
            className={`btn btn-sm flex items-center gap-2 ${
              savedJobs.has(job.id) 
                ? 'btn-primary' 
                : 'btn-secondary'
            }`}
            onClick={() => handleSaveJob(job.id)}
          >
            {savedJobs.has(job.id) ? (
              <>
                <BookmarkCheck size={14} />
                Saved
              </>
            ) : (
              <>
                <Bookmark size={14} />
                Save
              </>
            )}
          </button>
        </div>
        
        <button 
          className="btn btn-primary btn-sm flex items-center gap-2"
          onClick={() => handleApplyClick(job)}
        >
          <Send size={14} />
          Apply Now
        </button>
      </div>
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredJobs.map(job => renderJobCard(job))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {filteredJobs.map(job => renderJobCard(job))}
    </div>
  )

  return (
    <div className="jobs-page">
      <div className="page-header mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
            <p className="text-gray-600">
              Discover opportunities that match your skills and career goals
            </p>
          </div>
          
          <div className="header-actions flex items-center gap-3">
            <button
              className="btn btn-secondary"
              onClick={loadJobs}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section mb-6">
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="search-box flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3" size={16} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, skills, or location..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-controls flex items-center gap-3">
              <select
                className="input-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Most Relevant</option>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="salary_desc">Highest Salary</option>
                <option value="salary_asc">Lowest Salary</option>
              </select>
              
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="advanced-filters pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, State, or Country"
                    className="input"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    className="input"
                    value={filters.jobType}
                    onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    className="input"
                    value={filters.experienceLevel}
                    onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  >
                    <option value="all">All Levels</option>
                    <option value="Entry-level">Entry Level</option>
                    <option value="Mid-level">Mid Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remote Work
                  </label>
                  <select
                    className="input"
                    value={filters.remote}
                    onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.value }))}
                  >
                    <option value="all">All Options</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">On-site Only</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <select
                    className="input"
                    value={filters.salaryRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                  >
                    <option value="all">Any Salary</option>
                    <option value="40000-60000">$40k - $60k</option>
                    <option value="60000-80000">$60k - $80k</option>
                    <option value="80000-120000">$80k - $120k</option>
                    <option value="120000-160000">$120k - $160k</option>
                    <option value="160000">$160k+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company name"
                    className="input"
                    value={filters.company}
                    onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="React, Python, etc."
                    className="input"
                    value={filters.skills}
                    onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary and View Toggle */}
      <div className="results-header mb-6">
        <div className="flex justify-between items-center">
          <div className="results-summary">
            <p className="text-gray-600">
              Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
          
          <div className="view-toggle flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="btn-group">
              <button
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
                List
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} />
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List/Grid */}
      <div className="jobs-content">
        {isLoading ? (
          <div className="loading-state text-center py-12">
            <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Jobs...</h3>
            <p className="text-gray-600">Please wait while we fetch the latest opportunities</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') 
                ? 'Try adjusting your search criteria or filters'
                : 'No jobs are currently available. Check back later for new opportunities!'
              }
            </p>
            {(searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')) && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('')
                  setFilters({
                    location: '',
                    jobType: 'all',
                    experienceLevel: 'all',
                    salaryRange: 'all',
                    remote: 'all',
                    company: '',
                    skills: '',
                    datePosted: 'all'
                  })
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          viewMode === 'grid' ? renderGridView() : renderListView()
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-semibold">Apply for {selectedJob.title}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowApplyModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {!user && !applyWithoutLogin ? (
                <div className="login-prompt text-center py-8">
                  <User size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-4">Ready to Apply?</h3>
                  <p className="text-gray-600 mb-6">
                    Choose how you'd like to proceed with your application
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      className="btn btn-primary"
                      onClick={handleLoginRedirect}
                    >
                      Sign In to Apply
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleApplyWithoutLogin}
                    >
                      Apply Without Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="application-form">
                  <div className="form-section mb-6">
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={applicationForm.name}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="input"
                          value={applicationForm.email}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          className="input"
                          value={applicationForm.phone}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section mb-6">
                    <h3 className="text-lg font-medium mb-4">Resume</h3>
                    <div className="resume-upload-options mb-4">
                      <div className="btn-group">
                        <button
                          className={`btn ${applicationForm.uploadMethod === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setApplicationForm(prev => ({ ...prev, uploadMethod: 'upload' }))}
                        >
                          <Upload size={16} />
                          Upload File
                        </button>
                        <button
                          className={`btn ${applicationForm.uploadMethod === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setApplicationForm(prev => ({ ...prev, uploadMethod: 'paste' }))}
                        >
                          <FileText size={16} />
                          Paste Text
                        </button>
                      </div>
                    </div>

                    {applicationForm.uploadMethod === 'upload' ? (
                      <div className="file-upload">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label 
                          htmlFor="resume-upload"
                          className="file-upload-area"
                        >
                          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            {applicationForm.resume 
                              ? applicationForm.resume.name 
                              : 'Click to upload your resume (PDF, DOC, DOCX)'
                            }
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="resume-text">
                        <textarea
                          className="input"
                          rows={8}
                          placeholder="Paste your resume content here..."
                          value={applicationForm.resumeText}
                          onChange={(e) => setApplicationForm(prev => ({ ...prev, resumeText: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-section mb-6">
                    <h3 className="text-lg font-medium mb-4">Cover Letter (Optional)</h3>
                    <textarea
                      className="input"
                      rows={6}
                      placeholder="Write a brief cover letter explaining why you're interested in this position..."
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {(user || applyWithoutLogin) && (
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmitApplication}
                >
                  Submit Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default JobsPage

