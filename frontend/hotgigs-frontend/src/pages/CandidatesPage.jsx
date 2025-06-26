import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  ExternalLink 
} from 'lucide-react'

const CandidatesPage = () => {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [filteredCandidates, setFilteredCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // list or grid
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCandidates, setSelectedCandidates] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    experience: 'all',
    skills: '',
    education: 'all',
    availability: 'all',
    salaryRange: 'all',
    domain: 'all',
    status: 'all'
  })
  
  const [sortBy, setSortBy] = useState('relevance')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCandidates()
  }, [])

  useEffect(() => {
    filterAndSortCandidates()
  }, [candidates, filters, sortBy, searchTerm])

  const loadCandidates = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to load candidates
      const sampleCandidates = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          title: 'Senior React Developer',
          experience: 5,
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'AWS'],
          education: 'Bachelor\'s in Computer Science',
          university: 'Stanford University',
          currentSalary: 120000,
          expectedSalary: 150000,
          availability: 'Immediately',
          status: 'Active',
          profilePicture: '/api/placeholder/64/64',
          resumeUrl: '/resumes/john-smith-resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/johnsmith',
          githubUrl: 'https://github.com/johnsmith',
          portfolioUrl: 'https://johnsmith.dev',
          lastActive: '2024-01-15',
          joinDate: '2023-06-15',
          matchScore: 95,
          applications: 12,
          interviews: 5,
          offers: 2,
          domain: ['Technology', 'E-commerce'],
          workExperience: [
            {
              company: 'TechCorp Inc.',
              position: 'Senior Frontend Developer',
              duration: '2021-Present',
              description: 'Led frontend development team, built scalable React applications'
            },
            {
              company: 'StartupXYZ',
              position: 'Frontend Developer',
              duration: '2019-2021',
              description: 'Developed user interfaces for web applications'
            }
          ],
          certifications: ['AWS Certified Developer', 'React Professional'],
          languages: ['English (Native)', 'Spanish (Conversational)'],
          rating: 4.8,
          reviews: 15,
          isVerified: true,
          isTopTalent: true
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 234-5678',
          location: 'New York, NY',
          title: 'Full Stack Developer',
          experience: 3,
          skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'Kubernetes'],
          education: 'Master\'s in Software Engineering',
          university: 'MIT',
          currentSalary: 95000,
          expectedSalary: 120000,
          availability: '2 weeks notice',
          status: 'Active',
          profilePicture: '/api/placeholder/64/64',
          resumeUrl: '/resumes/sarah-johnson-resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          githubUrl: 'https://github.com/sarahjohnson',
          portfolioUrl: 'https://sarahjohnson.dev',
          lastActive: '2024-01-14',
          joinDate: '2023-08-20',
          matchScore: 88,
          applications: 8,
          interviews: 3,
          offers: 1,
          domain: ['Healthcare', 'Finance'],
          workExperience: [
            {
              company: 'HealthTech Solutions',
              position: 'Full Stack Developer',
              duration: '2022-Present',
              description: 'Built healthcare management systems using Python and React'
            },
            {
              company: 'FinanceApp Inc.',
              position: 'Junior Developer',
              duration: '2021-2022',
              description: 'Developed financial tracking applications'
            }
          ],
          certifications: ['Python Professional', 'Docker Certified'],
          languages: ['English (Native)', 'French (Fluent)'],
          rating: 4.6,
          reviews: 12,
          isVerified: true,
          isTopTalent: false
        },
        {
          id: 3,
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          phone: '+1 (555) 345-6789',
          location: 'Seattle, WA',
          title: 'DevOps Engineer',
          experience: 7,
          skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python'],
          education: 'Bachelor\'s in Computer Engineering',
          university: 'University of Washington',
          currentSalary: 140000,
          expectedSalary: 170000,
          availability: '1 month notice',
          status: 'Passive',
          profilePicture: '/api/placeholder/64/64',
          resumeUrl: '/resumes/michael-chen-resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/michaelchen',
          githubUrl: 'https://github.com/michaelchen',
          portfolioUrl: null,
          lastActive: '2024-01-10',
          joinDate: '2023-04-10',
          matchScore: 92,
          applications: 15,
          interviews: 8,
          offers: 3,
          domain: ['Cloud Computing', 'DevOps'],
          workExperience: [
            {
              company: 'CloudTech Solutions',
              position: 'Senior DevOps Engineer',
              duration: '2020-Present',
              description: 'Managed cloud infrastructure and CI/CD pipelines'
            },
            {
              company: 'TechStartup',
              position: 'DevOps Engineer',
              duration: '2018-2020',
              description: 'Built automated deployment systems'
            }
          ],
          certifications: ['AWS Solutions Architect', 'Kubernetes Administrator'],
          languages: ['English (Native)', 'Mandarin (Native)'],
          rating: 4.9,
          reviews: 20,
          isVerified: true,
          isTopTalent: true
        },
        {
          id: 4,
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 456-7890',
          location: 'Austin, TX',
          title: 'UX/UI Designer',
          experience: 4,
          skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS'],
          education: 'Bachelor\'s in Design',
          university: 'Art Institute of Austin',
          currentSalary: 85000,
          expectedSalary: 105000,
          availability: 'Immediately',
          status: 'Active',
          profilePicture: '/api/placeholder/64/64',
          resumeUrl: '/resumes/emily-rodriguez-resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
          githubUrl: null,
          portfolioUrl: 'https://emilyrodriguez.design',
          lastActive: '2024-01-16',
          joinDate: '2023-09-05',
          matchScore: 85,
          applications: 10,
          interviews: 4,
          offers: 1,
          domain: ['Design', 'E-commerce'],
          workExperience: [
            {
              company: 'DesignStudio Pro',
              position: 'Senior UX Designer',
              duration: '2022-Present',
              description: 'Led UX design for mobile and web applications'
            },
            {
              company: 'Creative Agency',
              position: 'UI Designer',
              duration: '2020-2022',
              description: 'Designed user interfaces for various clients'
            }
          ],
          certifications: ['Google UX Design Certificate', 'Adobe Certified Expert'],
          languages: ['English (Native)', 'Spanish (Native)'],
          rating: 4.7,
          reviews: 18,
          isVerified: true,
          isTopTalent: false
        },
        {
          id: 5,
          name: 'David Kim',
          email: 'david.kim@email.com',
          phone: '+1 (555) 567-8901',
          location: 'Los Angeles, CA',
          title: 'Data Scientist',
          experience: 6,
          skills: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'SQL', 'Tableau'],
          education: 'PhD in Data Science',
          university: 'UCLA',
          currentSalary: 130000,
          expectedSalary: 160000,
          availability: '3 weeks notice',
          status: 'Active',
          profilePicture: '/api/placeholder/64/64',
          resumeUrl: '/resumes/david-kim-resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/davidkim',
          githubUrl: 'https://github.com/davidkim',
          portfolioUrl: 'https://davidkim.ai',
          lastActive: '2024-01-13',
          joinDate: '2023-07-12',
          matchScore: 94,
          applications: 18,
          interviews: 9,
          offers: 4,
          domain: ['Data Science', 'AI/ML'],
          workExperience: [
            {
              company: 'DataCorp Analytics',
              position: 'Senior Data Scientist',
              duration: '2021-Present',
              description: 'Built predictive models and data pipelines'
            },
            {
              company: 'AI Research Lab',
              position: 'Data Scientist',
              duration: '2019-2021',
              description: 'Conducted research on machine learning algorithms'
            }
          ],
          certifications: ['Google Cloud ML Engineer', 'AWS ML Specialty'],
          languages: ['English (Fluent)', 'Korean (Native)'],
          rating: 4.8,
          reviews: 22,
          isVerified: true,
          isTopTalent: true
        }
      ]

      setCandidates(sampleCandidates)
    } catch (error) {
      console.error('Failed to load candidates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortCandidates = () => {
    let filtered = [...candidates]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Apply experience filter
    if (filters.experience !== 'all') {
      const [min, max] = filters.experience.split('-').map(Number)
      filtered = filtered.filter(candidate => {
        if (max) {
          return candidate.experience >= min && candidate.experience <= max
        } else {
          return candidate.experience >= min
        }
      })
    }

    // Apply skills filter
    if (filters.skills) {
      const skillsArray = filters.skills.toLowerCase().split(',').map(s => s.trim())
      filtered = filtered.filter(candidate =>
        skillsArray.some(skill =>
          candidate.skills.some(candidateSkill => candidateSkill.toLowerCase().includes(skill))
        )
      )
    }

    // Apply education filter
    if (filters.education !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.education.toLowerCase().includes(filters.education.toLowerCase())
      )
    }

    // Apply availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter(candidate => candidate.availability === filters.availability)
    }

    // Apply salary range filter
    if (filters.salaryRange !== 'all') {
      const [min, max] = filters.salaryRange.split('-').map(Number)
      filtered = filtered.filter(candidate => {
        const salary = candidate.expectedSalary || candidate.currentSalary
        if (max) {
          return salary >= min && salary <= max
        } else {
          return salary >= min
        }
      })
    }

    // Apply domain filter
    if (filters.domain !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.domain.some(d => d.toLowerCase().includes(filters.domain.toLowerCase()))
      )
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.matchScore || 0) - (a.matchScore || 0)
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'experience_desc':
          return b.experience - a.experience
        case 'experience_asc':
          return a.experience - b.experience
        case 'salary_desc':
          return (b.expectedSalary || b.currentSalary) - (a.expectedSalary || a.currentSalary)
        case 'salary_asc':
          return (a.expectedSalary || a.currentSalary) - (b.expectedSalary || b.currentSalary)
        case 'date_desc':
          return new Date(b.joinDate) - new Date(a.joinDate)
        case 'date_asc':
          return new Date(a.joinDate) - new Date(b.joinDate)
        default:
          return 0
      }
    })

    setFilteredCandidates(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSelectCandidate = (candidateId) => {
    const newSelected = new Set(selectedCandidates)
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId)
    } else {
      newSelected.add(candidateId)
    }
    setSelectedCandidates(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedCandidates.size === paginatedCandidates.length) {
      setSelectedCandidates(new Set())
    } else {
      setSelectedCandidates(new Set(paginatedCandidates.map(c => c.id)))
    }
  }

  const handleViewCandidate = (candidateId) => {
    navigate(`/candidates/${candidateId}`)
  }

  const handleDownloadResume = (candidate) => {
    // Simulate resume download
    const link = document.createElement('a')
    link.href = candidate.resumeUrl
    link.download = `${candidate.name.replace(' ', '-')}-resume.pdf`
    link.click()
  }

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)

  const renderCandidateCard = (candidate) => (
    <div key={candidate.id} className="candidate-card card hover:shadow-lg transition-all duration-200">
      {/* Selection Checkbox */}
      <div className="candidate-selection">
        <input
          type="checkbox"
          checked={selectedCandidates.has(candidate.id)}
          onChange={() => handleSelectCandidate(candidate.id)}
          className="checkbox"
        />
      </div>

      {/* Candidate Header */}
      <div className="candidate-header">
        <div className="candidate-avatar">
          <img 
            src={candidate.profilePicture} 
            alt={candidate.name}
            className="w-16 h-16 rounded-full border-2 border-gray-200"
          />
          {candidate.isVerified && (
            <div className="verified-badge">
              <CheckCircle size={16} className="text-green-500" />
            </div>
          )}
        </div>
        
        <div className="candidate-info flex-1">
          <div className="candidate-name-section">
            <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
            {candidate.isTopTalent && (
              <span className="top-talent-badge">
                <Star size={12} />
                Top Talent
              </span>
            )}
          </div>
          
          <p className="text-gray-600 font-medium mb-2">{candidate.title}</p>
          
          <div className="candidate-details grid grid-cols-2 gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {candidate.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {candidate.experience} years exp
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} />
              {candidate.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={14} />
              {candidate.phone}
            </span>
          </div>
        </div>

        <div className="candidate-meta text-right">
          <div className="match-score mb-2">
            <span className="text-2xl font-bold text-blue-600">{candidate.matchScore}%</span>
            <p className="text-xs text-gray-500">Match Score</p>
          </div>
          
          <div className="candidate-stats text-xs text-gray-500">
            <div>{candidate.applications} applications</div>
            <div>{candidate.interviews} interviews</div>
            <div>{candidate.offers} offers</div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="candidate-skills mb-4">
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 6).map((skill, index) => (
            <span key={index} className="skill-tag badge bg-blue-100 text-blue-800 text-xs">
              {skill}
            </span>
          ))}
          {candidate.skills.length > 6 && (
            <span className="text-sm text-gray-500">
              +{candidate.skills.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Salary & Availability */}
      <div className="candidate-salary-availability mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Expected Salary:</span>
            <p className="font-semibold text-gray-900">{formatSalary(candidate.expectedSalary)}</p>
          </div>
          <div>
            <span className="text-gray-500">Availability:</span>
            <p className="font-semibold text-gray-900">{candidate.availability}</p>
          </div>
        </div>
      </div>

      {/* Domain Expertise */}
      <div className="candidate-domains mb-4">
        <span className="text-sm text-gray-500">Domain Expertise:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {candidate.domain.map((domain, index) => (
            <span key={index} className="badge bg-purple-100 text-purple-800 text-xs">
              {domain}
            </span>
          ))}
        </div>
      </div>

      {/* Status & Rating */}
      <div className="candidate-status-rating mb-4">
        <div className="flex justify-between items-center">
          <span className={`status-badge ${candidate.status.toLowerCase()}`}>
            {candidate.status}
          </span>
          <div className="rating flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{candidate.rating}</span>
            <span className="text-xs text-gray-500">({candidate.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="candidate-actions flex justify-between items-center">
        <div className="action-buttons flex gap-2">
          <button 
            className="btn btn-secondary btn-sm flex items-center gap-2"
            onClick={() => handleViewCandidate(candidate.id)}
          >
            <Eye size={14} />
            View Profile
          </button>
          
          <button 
            className="btn btn-secondary btn-sm flex items-center gap-2"
            onClick={() => handleDownloadResume(candidate)}
          >
            <Download size={14} />
            Resume
          </button>
        </div>
        
        <div className="contact-buttons flex gap-2">
          {candidate.linkedinUrl && (
            <a 
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <Linkedin size={14} />
            </a>
          )}
          
          {candidate.githubUrl && (
            <a 
              href={candidate.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <Github size={14} />
            </a>
          )}
          
          <button className="btn btn-primary btn-sm">
            <Mail size={14} />
            Contact
          </button>
        </div>
      </div>
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {paginatedCandidates.map(candidate => renderCandidateCard(candidate))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {paginatedCandidates.map(candidate => renderCandidateCard(candidate))}
    </div>
  )

  return (
    <div className="candidates-page">
      <div className="page-header mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Candidate Database</h1>
            <p className="text-gray-600">
              Manage and discover talented candidates for your organization
            </p>
          </div>
          
          <div className="header-actions flex items-center gap-3">
            <button
              className="btn btn-secondary"
              onClick={loadCandidates}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            
            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/candidates/add')}
              >
                <UserPlus size={16} />
                Add Candidate
              </button>
              
              <button
                className="btn btn-primary"
                onClick={() => navigate('/candidates/import')}
              >
                <FileUp size={16} />
                Import
              </button>
              
              <button
                className="btn btn-primary"
                onClick={() => navigate('/candidates/bulk-import')}
              >
                <Database size={16} />
                Bulk Import
              </button>
            </div>
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
                  placeholder="Search candidates by name, email, skills, or location..."
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
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="experience_desc">Most Experienced</option>
                <option value="experience_asc">Least Experienced</option>
                <option value="salary_desc">Highest Salary</option>
                <option value="salary_asc">Lowest Salary</option>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
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
                    Experience
                  </label>
                  <select
                    className="input"
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                  >
                    <option value="all">All Experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10">10+ years</option>
                  </select>
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <select
                    className="input"
                    value={filters.education}
                    onChange={(e) => setFilters(prev => ({ ...prev, education: e.target.value }))}
                  >
                    <option value="all">All Education</option>
                    <option value="bachelor">Bachelor's</option>
                    <option value="master">Master's</option>
                    <option value="phd">PhD</option>
                    <option value="bootcamp">Bootcamp</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    className="input"
                    value={filters.availability}
                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                  >
                    <option value="all">All Availability</option>
                    <option value="Immediately">Immediately</option>
                    <option value="2 weeks notice">2 weeks notice</option>
                    <option value="1 month notice">1 month notice</option>
                    <option value="3 weeks notice">3 weeks notice</option>
                  </select>
                </div>
                
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
                    <option value="50000-80000">$50k - $80k</option>
                    <option value="80000-120000">$80k - $120k</option>
                    <option value="120000-160000">$120k - $160k</option>
                    <option value="160000">$160k+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <select
                    className="input"
                    value={filters.domain}
                    onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
                  >
                    <option value="all">All Domains</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="input"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Passive">Passive</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary and View Toggle */}
      <div className="results-header mb-6">
        <div className="flex justify-between items-center">
          <div className="results-summary flex items-center gap-4">
            <p className="text-gray-600">
              Showing {paginatedCandidates.length} of {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            
            {selectedCandidates.size > 0 && (
              <div className="selected-actions flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedCandidates.size} selected
                </span>
                <button className="btn btn-secondary btn-sm">
                  <Mail size={14} />
                  Email Selected
                </button>
                <button className="btn btn-secondary btn-sm">
                  <Download size={14} />
                  Export Selected
                </button>
              </div>
            )}
          </div>
          
          <div className="view-controls flex items-center gap-4">
            <div className="bulk-select">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCandidates.size === paginatedCandidates.length && paginatedCandidates.length > 0}
                  onChange={handleSelectAll}
                  className="checkbox"
                />
                Select All
              </label>
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
      </div>

      {/* Candidates List/Grid */}
      <div className="candidates-content">
        {isLoading ? (
          <div className="loading-state text-center py-12">
            <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Candidates...</h3>
            <p className="text-gray-600">Please wait while we fetch the candidate database</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="empty-state text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Candidates Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') 
                ? 'Try adjusting your search criteria or filters'
                : 'No candidates are currently in the database. Start by adding or importing candidates!'
              }
            </p>
            {(searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')) ? (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('')
                  setFilters({
                    location: '',
                    experience: 'all',
                    skills: '',
                    education: 'all',
                    availability: 'all',
                    salaryRange: 'all',
                    domain: 'all',
                    status: 'all'
                  })
                }}
              >
                Clear All Filters
              </button>
            ) : (
              <div className="flex gap-3 justify-center">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/candidates/add')}
                >
                  <UserPlus size={16} />
                  Add Candidate
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/candidates/import')}
                >
                  <FileUp size={16} />
                  Import Candidates
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-section mt-8">
                <div className="flex justify-between items-center">
                  <div className="pagination-info text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates
                  </div>
                  
                  <div className="pagination flex items-center gap-2">
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    <div className="pagination-pages flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        )
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="pagination-ellipsis">...</span>
                          <button
                            className={`pagination-page ${currentPage === totalPages ? 'active' : ''}`}
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .candidates-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 24px;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .candidate-card {
          position: relative;
          transition: all 0.2s ease;
        }

        .candidate-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }

        .candidate-selection {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
        }

        .candidate-header {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          padding-left: 32px;
        }

        .candidate-avatar {
          position: relative;
        }

        .verified-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: white;
          border-radius: 50%;
          padding: 2px;
        }

        .candidate-name-section {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .top-talent-badge {
          background: #f59e0b;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 2px;
          text-transform: uppercase;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.passive {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.unavailable {
          background: #fee2e2;
          color: #991b1b;
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

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
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

        .btn-group {
          display: flex;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #d1d5db;
        }

        .btn-group .btn {
          border-radius: 0;
          border: none;
          border-right: 1px solid #d1d5db;
        }

        .btn-group .btn:last-child {
          border-right: none;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .skill-tag {
          font-size: 10px;
          padding: 2px 6px;
          text-transform: none;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
        }

        .checkbox:checked {
          background: #8b5cf6;
          border-color: #8b5cf6;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pagination-btn {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #64748b;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8fafc;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-page {
          width: 40px;
          height: 40px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #64748b;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pagination-page:hover {
          background: #f8fafc;
        }

        .pagination-page.active {
          background: #8b5cf6;
          color: white;
          border-color: #8b5cf6;
        }

        .pagination-ellipsis {
          padding: 8px 4px;
          color: #64748b;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .candidates-page {
            padding: 16px;
          }

          .candidate-header {
            flex-direction: column;
            gap: 12px;
          }

          .candidate-meta {
            text-align: left;
          }

          .candidate-actions {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .action-buttons,
          .contact-buttons {
            justify-content: stretch;
          }

          .action-buttons .btn,
          .contact-buttons .btn {
            flex: 1;
            justify-content: center;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .pagination {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default CandidatesPage

