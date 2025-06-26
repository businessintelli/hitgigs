import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, 
  MapPin, 
  Filter, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Star, 
  Heart, 
  Eye, 
  Send, 
  Building, 
  Users, 
  Calendar, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react'

const JobsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    salaryRange: '',
    experience: '',
    remote: false
  })
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadJobs()
    loadUserPreferences()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchFilters, sortBy])

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
          salary: '$120,000 - $180,000',
          type: 'Full-time',
          remote: true,
          posted: '2 days ago',
          description: 'We are looking for a Senior React Developer to join our dynamic team. You will be responsible for developing user interface components and implementing them following well-known React.js workflows.',
          skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
          experience: 'Senior',
          matchScore: 92,
          applicants: 45,
          views: 234,
          featured: true,
          urgent: false,
          benefits: ['Health Insurance', 'Remote Work', '401k', 'Stock Options'],
          requirements: [
            '5+ years of React development experience',
            'Strong TypeScript skills',
            'Experience with modern build tools',
            'Knowledge of testing frameworks'
          ]
        },
        {
          id: 2,
          title: 'Frontend Engineer',
          company: 'StartupXYZ',
          companyLogo: '/api/placeholder/48/48',
          location: 'Remote',
          salary: '$100,000 - $150,000',
          type: 'Full-time',
          remote: true,
          posted: '1 day ago',
          description: 'Join our fast-growing startup as a Frontend Engineer. You will work on cutting-edge web applications using modern JavaScript frameworks and contribute to our product development.',
          skills: ['Vue.js', 'JavaScript', 'CSS', 'Webpack', 'Docker'],
          experience: 'Mid-level',
          matchScore: 87,
          applicants: 23,
          views: 156,
          featured: false,
          urgent: true,
          benefits: ['Flexible Hours', 'Remote Work', 'Learning Budget', 'Equity'],
          requirements: [
            '3+ years of frontend development',
            'Proficiency in Vue.js or React',
            'Strong CSS and responsive design skills',
            'Experience with version control (Git)'
          ]
        },
        {
          id: 3,
          title: 'Full Stack Developer',
          company: 'InnovateLab',
          companyLogo: '/api/placeholder/48/48',
          location: 'New York, NY',
          salary: '$110,000 - $160,000',
          type: 'Full-time',
          remote: false,
          posted: '3 days ago',
          description: 'We are seeking a talented Full Stack Developer to work on both frontend and backend development. You will be part of a collaborative team building scalable web applications.',
          skills: ['React', 'Python', 'PostgreSQL', 'Django', 'Redis'],
          experience: 'Mid-level',
          matchScore: 84,
          applicants: 67,
          views: 289,
          featured: true,
          urgent: false,
          benefits: ['Health Insurance', 'Gym Membership', 'Catered Meals', 'PTO'],
          requirements: [
            '4+ years of full stack development',
            'Experience with React and Python',
            'Database design and optimization',
            'RESTful API development'
          ]
        },
        {
          id: 4,
          title: 'UI/UX Designer',
          company: 'DesignStudio',
          companyLogo: '/api/placeholder/48/48',
          location: 'Los Angeles, CA',
          salary: '$90,000 - $130,000',
          type: 'Full-time',
          remote: true,
          posted: '5 days ago',
          description: 'Creative UI/UX Designer needed to design intuitive and engaging user experiences. You will work closely with product managers and developers to create beautiful interfaces.',
          skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
          experience: 'Mid-level',
          matchScore: 78,
          applicants: 34,
          views: 178,
          featured: false,
          urgent: false,
          benefits: ['Creative Freedom', 'Remote Work', 'Design Tools Budget', 'Conferences'],
          requirements: [
            '3+ years of UI/UX design experience',
            'Proficiency in design tools (Figma, Sketch)',
            'Portfolio demonstrating design process',
            'Understanding of user-centered design'
          ]
        },
        {
          id: 5,
          title: 'DevOps Engineer',
          company: 'CloudTech Solutions',
          companyLogo: '/api/placeholder/48/48',
          location: 'Austin, TX',
          salary: '$130,000 - $170,000',
          type: 'Full-time',
          remote: true,
          posted: '1 week ago',
          description: 'Experienced DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will work with cutting-edge technologies to ensure scalable and reliable systems.',
          skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins'],
          experience: 'Senior',
          matchScore: 89,
          applicants: 28,
          views: 145,
          featured: true,
          urgent: true,
          benefits: ['High Salary', 'Stock Options', 'Remote Work', 'Tech Budget'],
          requirements: [
            '5+ years of DevOps experience',
            'Strong AWS and Kubernetes knowledge',
            'Experience with Infrastructure as Code',
            'CI/CD pipeline management'
          ]
        }
      ]

      setJobs(sampleJobs)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserPreferences = async () => {
    try {
      // Load user's saved jobs and applications
      const savedJobIds = new Set([1, 3]) // Sample saved jobs
      const appliedJobIds = new Set([2]) // Sample applied jobs
      
      setSavedJobs(savedJobIds)
      setAppliedJobs(appliedJobIds)
    } catch (error) {
      console.error('Failed to load user preferences:', error)
    }
  }

  const filterJobs = () => {
    let filtered = [...jobs]

    // Apply search filters
    if (searchFilters.keyword) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchFilters.keyword.toLowerCase()))
      )
    }

    if (searchFilters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      )
    }

    if (searchFilters.jobType) {
      filtered = filtered.filter(job => job.type === searchFilters.jobType)
    }

    if (searchFilters.experience) {
      filtered = filtered.filter(job => job.experience === searchFilters.experience)
    }

    if (searchFilters.remote) {
      filtered = filtered.filter(job => job.remote)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.posted) - new Date(a.posted))
        break
      case 'salary_high':
        filtered.sort((a, b) => {
          const aSalary = parseInt(a.salary.split(' - ')[1].replace(/[^0-9]/g, ''))
          const bSalary = parseInt(b.salary.split(' - ')[1].replace(/[^0-9]/g, ''))
          return bSalary - aSalary
        })
        break
      case 'match_score':
        filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        break
      default: // relevance
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredJobs(filtered)
  }

  const handleSearch = () => {
    filterJobs()
  }

  const handleFilterChange = (key, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`)
  }

  const handleApplyNow = async (jobId) => {
    if (!user) {
      navigate('/signin')
      return
    }

    try {
      // Simulate API call to apply for job
      setAppliedJobs(prev => new Set([...prev, jobId]))
      
      // Show success notification
      alert('Application submitted successfully!')
      
      // Navigate to application tracking
      navigate('/my-applications')
    } catch (error) {
      console.error('Failed to apply for job:', error)
      alert('Failed to submit application. Please try again.')
    }
  }

  const handleSaveJob = async (jobId) => {
    if (!user) {
      navigate('/signin')
      return
    }

    try {
      const newSavedJobs = new Set(savedJobs)
      
      if (savedJobs.has(jobId)) {
        newSavedJobs.delete(jobId)
        alert('Job removed from saved jobs')
      } else {
        newSavedJobs.add(jobId)
        alert('Job saved successfully!')
      }
      
      setSavedJobs(newSavedJobs)
    } catch (error) {
      console.error('Failed to save job:', error)
      alert('Failed to save job. Please try again.')
    }
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className="jobs-page">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="page-header mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and aspirations</p>
        </div>

        {/* Search and Filters */}
        <div className="search-section mb-8">
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3" size={20} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="input pl-10"
                  value={searchFilters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3" size={20} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  className="input pl-10"
                  value={searchFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3" size={20} color="#9ca3af" />
                <select 
                  className="input pl-10"
                  value={searchFilters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Search Jobs
                  </>
                )}
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex justify-between items-center">
              <button
                className="btn btn-secondary flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                {showFilters ? 'Hide Filters' : 'More Filters'}
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  className="input-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="salary_high">Salary (High to Low)</option>
                  <option value="match_score">Match Score</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="advanced-filters mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      className="input"
                      value={searchFilters.experience}
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    >
                      <option value="">All Levels</option>
                      <option value="Entry-level">Entry Level</option>
                      <option value="Mid-level">Mid Level</option>
                      <option value="Senior">Senior</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <select
                      className="input"
                      value={searchFilters.salaryRange}
                      onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                    >
                      <option value="">Any Salary</option>
                      <option value="50k-80k">$50k - $80k</option>
                      <option value="80k-120k">$80k - $120k</option>
                      <option value="120k-160k">$120k - $160k</option>
                      <option value="160k+">$160k+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remote Work
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={searchFilters.remote}
                        onChange={(e) => handleFilterChange('remote', e.target.checked)}
                      />
                      Remote jobs only
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
              {searchFilters.keyword && ` for "${searchFilters.keyword}"`}
              {searchFilters.location && ` in ${searchFilters.location}`}
            </p>
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

        {/* Job Results */}
        <div className="jobs-list space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="empty-state text-center py-12">
              <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all available positions
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchFilters({
                    keyword: '',
                    location: '',
                    jobType: '',
                    salaryRange: '',
                    experience: '',
                    remote: false
                  })
                  setSortBy('relevance')
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="job-card card transition-all duration-200 hover:shadow-lg">
                {/* Job Header */}
                <div className="job-header flex justify-between items-start mb-4">
                  <div className="job-info flex items-start">
                    <div className="company-logo mr-4">
                      <img 
                        src={job.companyLogo} 
                        alt={job.company}
                        className="w-12 h-12 rounded-lg border border-gray-200"
                      />
                    </div>
                    <div className="job-details">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        {job.featured && (
                          <span className="badge bg-yellow-100 text-yellow-800 text-xs">Featured</span>
                        )}
                        {job.urgent && (
                          <span className="badge bg-red-100 text-red-800 text-xs">Urgent</span>
                        )}
                      </div>
                      <p className="text-gray-600 font-medium">{job.company}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {job.posted}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={16} />
                          {job.applicants} applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={16} />
                          {job.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="job-meta text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-success">{job.type}</span>
                      {job.remote && (
                        <span className="badge bg-blue-100 text-blue-800">Remote</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-lg font-semibold text-gray-900 mb-2">
                      <DollarSign size={20} />
                      {job.salary}
                    </div>
                    {job.matchScore && user && (
                      <div className={`flex items-center gap-1 text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                        <Star size={14} />
                        {job.matchScore}% match
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Job Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                
                {/* Skills */}
                <div className="skills-section mb-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="skill-tag badge bg-gray-100 text-gray-700">
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
                
                {/* Job Actions */}
                <div className="job-actions flex justify-between items-center">
                  <div className="action-buttons flex gap-3">
                    <button 
                      className="btn btn-secondary flex items-center gap-2"
                      onClick={() => handleViewJob(job.id)}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    
                    <button 
                      className={`btn ${savedJobs.has(job.id) ? 'btn-danger' : 'btn-secondary'} flex items-center gap-2`}
                      onClick={() => handleSaveJob(job.id)}
                    >
                      {savedJobs.has(job.id) ? (
                        <>
                          <BookmarkCheck size={16} />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark size={16} />
                          Save Job
                        </>
                      )}
                    </button>
                  </div>
                  
                  <button 
                    className={`btn ${appliedJobs.has(job.id) ? 'btn-success' : 'btn-primary'} flex items-center gap-2`}
                    onClick={() => handleApplyNow(job.id)}
                    disabled={appliedJobs.has(job.id)}
                  >
                    {appliedJobs.has(job.id) ? (
                      <>
                        <CheckCircle size={16} />
                        Applied
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Apply Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="load-more text-center mt-8">
            <button className="btn btn-secondary">
              Load More Jobs
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .jobs-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .container {
          max-width: 1200px;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .job-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }

        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .input-sm {
          padding: 6px 8px;
          font-size: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
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
          text-decoration: none;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #8b5cf6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #7c3aed;
        }

        .btn-secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f8fafc;
        }

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #059669;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }

        .skill-tag {
          font-size: 11px;
          padding: 3px 6px;
          text-transform: none;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .job-header {
            flex-direction: column;
            gap: 16px;
          }

          .job-meta {
            text-align: left;
          }

          .job-actions {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .action-buttons {
            justify-content: stretch;
          }

          .action-buttons .btn {
            flex: 1;
            justify-content: center;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default JobsPage