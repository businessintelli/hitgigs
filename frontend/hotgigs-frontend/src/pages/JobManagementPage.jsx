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
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  Users, 
  Building, 
  Target, 
  TrendingUp, 
  RefreshCw, 
  MoreHorizontal, 
  Bot, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Award, 
  Send, 
  Copy, 
  ExternalLink, 
  FileUp, 
  Database, 
  Template, 
  Wand2, 
  Sparkles, 
  Code, 
  Globe, 
  Layers, 
  Settings, 
  BarChart3, 
  PieChart, 
  Activity, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Mail, 
  Phone, 
  Linkedin, 
  Github 
} from 'lucide-react'

const JobManagementPage = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // list or grid
  const [showFilters, setShowFilters] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    jobType: 'all',
    experience: 'all',
    skills: '',
    department: 'all',
    salaryRange: 'all',
    remote: 'all',
    status: 'all',
    urgency: 'all'
  })
  
  const [sortBy, setSortBy] = useState('date_desc')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadJobs()
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
          department: 'Engineering',
          location: 'San Francisco, CA',
          jobType: 'Full-time',
          experience: 'Senior',
          salaryMin: 120000,
          salaryMax: 180000,
          currency: 'USD',
          remote: true,
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
          description: 'We are looking for a Senior React Developer to join our dynamic engineering team...',
          requirements: [
            '5+ years of React development experience',
            'Strong knowledge of JavaScript and TypeScript',
            'Experience with modern frontend tools and frameworks',
            'Familiarity with cloud platforms (AWS preferred)'
          ],
          benefits: [
            'Competitive salary and equity',
            'Health, dental, and vision insurance',
            'Flexible work arrangements',
            '401(k) with company matching'
          ],
          status: 'Active',
          urgency: 'High',
          postedDate: '2024-01-15',
          deadline: '2024-02-15',
          applications: 45,
          views: 234,
          shortlisted: 12,
          interviewed: 5,
          hired: 0,
          recruiter: 'Sarah Johnson',
          recruiterEmail: 'sarah@techcorp.com',
          isPromoted: true,
          isFeatured: false,
          tags: ['Frontend', 'React', 'Senior'],
          domain: 'Technology',
          workModel: 'Hybrid',
          teamSize: '10-20',
          reportingTo: 'Engineering Manager',
          travelRequired: 'None',
          securityClearance: false,
          visaSponsorship: true,
          equalOpportunity: true,
          diversityFocused: false,
          startDate: '2024-03-01',
          contractLength: null,
          probationPeriod: '3 months',
          noticePeriod: '2 weeks',
          interviewProcess: [
            'Phone screening (30 min)',
            'Technical assessment (2 hours)',
            'Technical interview (1 hour)',
            'Cultural fit interview (45 min)',
            'Final interview with manager (30 min)'
          ],
          companySize: '100-500',
          industry: 'Software',
          fundingStage: 'Series B',
          companyDescription: 'TechCorp is a leading software company...',
          perks: ['Free lunch', 'Gym membership', 'Learning budget'],
          workingHours: '9 AM - 6 PM',
          timeZone: 'PST',
          languages: ['English'],
          certifications: ['AWS Certified Developer (preferred)'],
          portfolio: true,
          githubRequired: true,
          coverLetterRequired: false,
          questionsRequired: true,
          customQuestions: [
            'Describe your experience with React hooks',
            'How do you handle state management in large applications?'
          ],
          aiGenerated: false,
          template: 'Senior Developer Template',
          lastUpdated: '2024-01-15',
          createdBy: 'John Smith',
          approvedBy: 'HR Manager',
          publishedOn: ['Company Website', 'LinkedIn', 'Indeed'],
          analytics: {
            impressions: 1250,
            clicks: 234,
            clickRate: 18.7,
            applicationRate: 19.2,
            qualityScore: 8.5
          }
        },
        {
          id: 2,
          title: 'Product Manager',
          company: 'InnovateLab',
          department: 'Product',
          location: 'New York, NY',
          jobType: 'Full-time',
          experience: 'Mid-level',
          salaryMin: 100000,
          salaryMax: 140000,
          currency: 'USD',
          remote: false,
          skills: ['Product Management', 'Agile', 'Data Analysis', 'User Research', 'Roadmapping'],
          description: 'Join our product team to drive innovation and deliver exceptional user experiences...',
          requirements: [
            '3-5 years of product management experience',
            'Strong analytical and problem-solving skills',
            'Experience with Agile methodologies',
            'Excellent communication and leadership skills'
          ],
          benefits: [
            'Competitive salary and bonus',
            'Comprehensive health benefits',
            'Professional development opportunities',
            'Stock options'
          ],
          status: 'Active',
          urgency: 'Medium',
          postedDate: '2024-01-12',
          deadline: '2024-02-12',
          applications: 32,
          views: 189,
          shortlisted: 8,
          interviewed: 3,
          hired: 0,
          recruiter: 'Mike Chen',
          recruiterEmail: 'mike@innovatelab.com',
          isPromoted: false,
          isFeatured: true,
          tags: ['Product', 'Management', 'Strategy'],
          domain: 'Product',
          workModel: 'On-site',
          teamSize: '5-10',
          reportingTo: 'VP of Product',
          travelRequired: 'Occasional',
          securityClearance: false,
          visaSponsorship: false,
          equalOpportunity: true,
          diversityFocused: true,
          startDate: '2024-02-15',
          contractLength: null,
          probationPeriod: '6 months',
          noticePeriod: '4 weeks',
          interviewProcess: [
            'Initial screening (45 min)',
            'Case study presentation (2 hours)',
            'Team interview (1 hour)',
            'Executive interview (45 min)'
          ],
          companySize: '50-100',
          industry: 'Technology',
          fundingStage: 'Series A',
          companyDescription: 'InnovateLab is a fast-growing startup...',
          perks: ['Flexible PTO', 'Remote work options', 'Team events'],
          workingHours: '9 AM - 6 PM',
          timeZone: 'EST',
          languages: ['English'],
          certifications: ['Product Management Certification (preferred)'],
          portfolio: true,
          githubRequired: false,
          coverLetterRequired: true,
          questionsRequired: false,
          customQuestions: [],
          aiGenerated: true,
          template: 'Product Manager Template',
          lastUpdated: '2024-01-12',
          createdBy: 'Emily Rodriguez',
          approvedBy: 'VP Product',
          publishedOn: ['Company Website', 'AngelList'],
          analytics: {
            impressions: 890,
            clicks: 189,
            clickRate: 21.2,
            applicationRate: 16.9,
            qualityScore: 7.8
          }
        },
        {
          id: 3,
          title: 'DevOps Engineer',
          company: 'CloudTech Solutions',
          department: 'Infrastructure',
          location: 'Seattle, WA',
          jobType: 'Full-time',
          experience: 'Senior',
          salaryMin: 130000,
          salaryMax: 170000,
          currency: 'USD',
          remote: true,
          skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python', 'Monitoring'],
          description: 'We need an experienced DevOps Engineer to scale our cloud infrastructure...',
          requirements: [
            '5+ years of DevOps/Infrastructure experience',
            'Expert knowledge of AWS services',
            'Experience with container orchestration (Kubernetes)',
            'Infrastructure as Code experience (Terraform)'
          ],
          benefits: [
            'Top-tier compensation package',
            'Unlimited PTO',
            'Remote-first culture',
            'Learning and development budget'
          ],
          status: 'Active',
          urgency: 'High',
          postedDate: '2024-01-10',
          deadline: '2024-02-10',
          applications: 28,
          views: 156,
          shortlisted: 10,
          interviewed: 4,
          hired: 1,
          recruiter: 'David Kim',
          recruiterEmail: 'david@cloudtech.com',
          isPromoted: true,
          isFeatured: true,
          tags: ['DevOps', 'Cloud', 'Infrastructure'],
          domain: 'Infrastructure',
          workModel: 'Remote',
          teamSize: '5-10',
          reportingTo: 'Infrastructure Lead',
          travelRequired: 'Rare',
          securityClearance: false,
          visaSponsorship: true,
          equalOpportunity: true,
          diversityFocused: false,
          startDate: '2024-02-01',
          contractLength: null,
          probationPeriod: '3 months',
          noticePeriod: '2 weeks',
          interviewProcess: [
            'Technical screening (1 hour)',
            'System design interview (1.5 hours)',
            'Practical assessment (3 hours)',
            'Team fit interview (45 min)'
          ],
          companySize: '200-500',
          industry: 'Cloud Services',
          fundingStage: 'Series C',
          companyDescription: 'CloudTech Solutions provides enterprise cloud services...',
          perks: ['Home office setup', 'Conference attendance', 'Wellness program'],
          workingHours: 'Flexible',
          timeZone: 'PST',
          languages: ['English'],
          certifications: ['AWS Solutions Architect', 'Kubernetes Administrator'],
          portfolio: false,
          githubRequired: true,
          coverLetterRequired: false,
          questionsRequired: true,
          customQuestions: [
            'Describe your experience with Kubernetes in production',
            'How do you approach infrastructure monitoring and alerting?'
          ],
          aiGenerated: false,
          template: 'DevOps Engineer Template',
          lastUpdated: '2024-01-10',
          createdBy: 'Alex Johnson',
          approvedBy: 'CTO',
          publishedOn: ['Company Website', 'Stack Overflow Jobs', 'LinkedIn'],
          analytics: {
            impressions: 980,
            clicks: 156,
            clickRate: 15.9,
            applicationRate: 17.9,
            qualityScore: 9.1
          }
        },
        {
          id: 4,
          title: 'UX Designer',
          company: 'DesignStudio Pro',
          department: 'Design',
          location: 'Austin, TX',
          jobType: 'Contract',
          experience: 'Mid-level',
          salaryMin: 80000,
          salaryMax: 110000,
          currency: 'USD',
          remote: true,
          skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
          description: 'We are seeking a talented UX Designer to create intuitive and engaging user experiences...',
          requirements: [
            '3-5 years of UX design experience',
            'Proficiency in design tools (Figma, Sketch)',
            'Strong portfolio demonstrating UX process',
            'Experience with user research and testing'
          ],
          benefits: [
            'Competitive hourly rate',
            'Flexible schedule',
            'Creative freedom',
            'Potential for full-time conversion'
          ],
          status: 'Active',
          urgency: 'Medium',
          postedDate: '2024-01-08',
          deadline: '2024-02-08',
          applications: 22,
          views: 134,
          shortlisted: 6,
          interviewed: 2,
          hired: 0,
          recruiter: 'Lisa Wang',
          recruiterEmail: 'lisa@designstudio.com',
          isPromoted: false,
          isFeatured: false,
          tags: ['UX', 'Design', 'Contract'],
          domain: 'Design',
          workModel: 'Remote',
          teamSize: '3-5',
          reportingTo: 'Design Lead',
          travelRequired: 'None',
          securityClearance: false,
          visaSponsorship: false,
          equalOpportunity: true,
          diversityFocused: true,
          startDate: '2024-02-01',
          contractLength: '6 months',
          probationPeriod: null,
          noticePeriod: '1 week',
          interviewProcess: [
            'Portfolio review (1 hour)',
            'Design challenge (2 hours)',
            'Team interview (45 min)'
          ],
          companySize: '20-50',
          industry: 'Design Agency',
          fundingStage: 'Bootstrapped',
          companyDescription: 'DesignStudio Pro is a boutique design agency...',
          perks: ['Creative environment', 'Latest design tools', 'Flexible hours'],
          workingHours: 'Flexible',
          timeZone: 'CST',
          languages: ['English'],
          certifications: ['Google UX Design Certificate (preferred)'],
          portfolio: true,
          githubRequired: false,
          coverLetterRequired: true,
          questionsRequired: false,
          customQuestions: [],
          aiGenerated: true,
          template: 'UX Designer Template',
          lastUpdated: '2024-01-08',
          createdBy: 'Maria Garcia',
          approvedBy: 'Creative Director',
          publishedOn: ['Company Website', 'Dribbble', 'Behance'],
          analytics: {
            impressions: 670,
            clicks: 134,
            clickRate: 20.0,
            applicationRate: 16.4,
            qualityScore: 7.5
          }
        },
        {
          id: 5,
          title: 'Data Scientist',
          company: 'DataCorp Analytics',
          department: 'Data Science',
          location: 'Remote',
          jobType: 'Full-time',
          experience: 'Senior',
          salaryMin: 140000,
          salaryMax: 190000,
          currency: 'USD',
          remote: true,
          skills: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'SQL', 'Tableau', 'Statistics'],
          description: 'Join our data science team to build predictive models and drive data-driven decisions...',
          requirements: [
            'PhD or Master\'s in Data Science, Statistics, or related field',
            '5+ years of machine learning experience',
            'Strong programming skills in Python and R',
            'Experience with big data technologies'
          ],
          benefits: [
            'Excellent compensation and equity',
            'Comprehensive benefits package',
            'Research and conference budget',
            'Flexible work arrangements'
          ],
          status: 'Active',
          urgency: 'High',
          postedDate: '2024-01-05',
          deadline: '2024-02-05',
          applications: 38,
          views: 201,
          shortlisted: 15,
          interviewed: 7,
          hired: 0,
          recruiter: 'Robert Chen',
          recruiterEmail: 'robert@datacorp.com',
          isPromoted: true,
          isFeatured: true,
          tags: ['Data Science', 'ML', 'AI'],
          domain: 'Data Science',
          workModel: 'Remote',
          teamSize: '10-15',
          reportingTo: 'Head of Data Science',
          travelRequired: 'Quarterly team meetings',
          securityClearance: false,
          visaSponsorship: true,
          equalOpportunity: true,
          diversityFocused: false,
          startDate: '2024-03-01',
          contractLength: null,
          probationPeriod: '6 months',
          noticePeriod: '4 weeks',
          interviewProcess: [
            'Technical screening (1 hour)',
            'Take-home data challenge (4 hours)',
            'Technical deep-dive (1.5 hours)',
            'Research presentation (1 hour)',
            'Team and culture fit (45 min)'
          ],
          companySize: '500-1000',
          industry: 'Analytics',
          fundingStage: 'Public',
          companyDescription: 'DataCorp Analytics is a leading data analytics company...',
          perks: ['Research time', 'Conference speaking opportunities', 'Publication support'],
          workingHours: 'Flexible',
          timeZone: 'Multiple',
          languages: ['English'],
          certifications: ['Google Cloud ML Engineer', 'AWS ML Specialty'],
          portfolio: true,
          githubRequired: true,
          coverLetterRequired: false,
          questionsRequired: true,
          customQuestions: [
            'Describe a complex machine learning project you\'ve led',
            'How do you approach model interpretability and bias detection?'
          ],
          aiGenerated: false,
          template: 'Data Scientist Template',
          lastUpdated: '2024-01-05',
          createdBy: 'Jennifer Liu',
          approvedBy: 'VP Data Science',
          publishedOn: ['Company Website', 'Kaggle Jobs', 'LinkedIn'],
          analytics: {
            impressions: 1340,
            clicks: 201,
            clickRate: 15.0,
            applicationRate: 18.9,
            qualityScore: 9.3
          }
        }
      ]

      setJobs(sampleJobs)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortJobs = () => {
    let filtered = [...jobs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Apply experience filter
    if (filters.experience !== 'all') {
      filtered = filtered.filter(job => job.experience === filters.experience)
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

    // Apply department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(job => job.department === filters.department)
    }

    // Apply salary range filter
    if (filters.salaryRange !== 'all') {
      const [min, max] = filters.salaryRange.split('-').map(Number)
      filtered = filtered.filter(job => {
        const jobSalaryMin = job.salaryMin
        const jobSalaryMax = job.salaryMax
        if (max) {
          return jobSalaryMax >= min && jobSalaryMin <= max
        } else {
          return jobSalaryMax >= min
        }
      })
    }

    // Apply remote filter
    if (filters.remote !== 'all') {
      const isRemote = filters.remote === 'true'
      filtered = filtered.filter(job => job.remote === isRemote)
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(job => job.status === filters.status)
    }

    // Apply urgency filter
    if (filters.urgency !== 'all') {
      filtered = filtered.filter(job => job.urgency === filters.urgency)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.postedDate) - new Date(a.postedDate)
        case 'date_asc':
          return new Date(a.postedDate) - new Date(b.postedDate)
        case 'title_asc':
          return a.title.localeCompare(b.title)
        case 'title_desc':
          return b.title.localeCompare(a.title)
        case 'salary_desc':
          return b.salaryMax - a.salaryMax
        case 'salary_asc':
          return a.salaryMin - b.salaryMin
        case 'applications_desc':
          return b.applications - a.applications
        case 'applications_asc':
          return a.applications - b.applications
        case 'views_desc':
          return b.views - a.views
        case 'views_asc':
          return a.views - b.views
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSelectJob = (jobId) => {
    const newSelected = new Set(selectedJobs)
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId)
    } else {
      newSelected.add(jobId)
    }
    setSelectedJobs(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedJobs.size === paginatedJobs.length) {
      setSelectedJobs(new Set())
    } else {
      setSelectedJobs(new Set(paginatedJobs.map(j => j.id)))
    }
  }

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`)
  }

  const handleEditJob = (jobId) => {
    navigate(`/jobs/${jobId}/edit`)
  }

  const handleViewApplicants = (jobId) => {
    navigate(`/jobs/${jobId}/applicants`)
  }

  const handleDuplicateJob = (job) => {
    // Create a copy of the job with a new ID and updated title
    const duplicatedJob = {
      ...job,
      id: Date.now(), // Simple ID generation
      title: `${job.title} (Copy)`,
      postedDate: new Date().toISOString().split('T')[0],
      applications: 0,
      views: 0,
      shortlisted: 0,
      interviewed: 0,
      hired: 0,
      status: 'Draft'
    }
    
    setJobs(prev => [duplicatedJob, ...prev])
  }

  const formatSalary = (min, max, currency = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`
    } else if (min) {
      return `${formatter.format(min)}+`
    } else {
      return 'Competitive'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green'
      case 'draft': return 'gray'
      case 'paused': return 'yellow'
      case 'closed': return 'red'
      default: return 'gray'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'red'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'gray'
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

  const renderJobCard = (job) => (
    <div key={job.id} className="job-card card hover:shadow-lg transition-all duration-200">
      {/* Selection Checkbox */}
      <div className="job-selection">
        <input
          type="checkbox"
          checked={selectedJobs.has(job.id)}
          onChange={() => handleSelectJob(job.id)}
          className="checkbox"
        />
      </div>

      {/* Job Header */}
      <div className="job-header">
        <div className="job-title-section">
          <div className="job-title-row">
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            <div className="job-badges">
              {job.isPromoted && (
                <span className="badge bg-yellow-100 text-yellow-800">
                  <Star size={12} />
                  Promoted
                </span>
              )}
              {job.isFeatured && (
                <span className="badge bg-purple-100 text-purple-800">
                  <Sparkles size={12} />
                  Featured
                </span>
              )}
              {job.aiGenerated && (
                <span className="badge bg-blue-100 text-blue-800">
                  <Bot size={12} />
                  AI Generated
                </span>
              )}
            </div>
          </div>
          
          <div className="job-company-info">
            <p className="text-gray-600 font-medium">{job.company}</p>
            <span className="text-sm text-gray-500">{job.department}</span>
          </div>
        </div>

        <div className="job-meta">
          <div className="job-status-urgency">
            <span className={`status-badge ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
            <span className={`urgency-badge ${getUrgencyColor(job.urgency)}`}>
              {job.urgency} Priority
            </span>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="job-details grid grid-cols-2 gap-4 mb-4">
        <div className="detail-item">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">{job.location}</span>
          {job.remote && <span className="remote-badge">Remote</span>}
        </div>
        
        <div className="detail-item">
          <Briefcase size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">{job.jobType} • {job.experience}</span>
        </div>
        
        <div className="detail-item">
          <DollarSign size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
        </div>
        
        <div className="detail-item">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">Posted {formatDate(job.postedDate)}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="job-skills mb-4">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 6).map((skill, index) => (
            <span key={index} className="skill-tag badge bg-blue-100 text-blue-800 text-xs">
              {skill}
            </span>
          ))}
          {job.skills.length > 6 && (
            <span className="text-sm text-gray-500">
              +{job.skills.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Job Stats */}
      <div className="job-stats grid grid-cols-4 gap-4 mb-4">
        <div className="stat-item text-center">
          <div className="stat-value text-lg font-semibold text-blue-600">{job.applications}</div>
          <div className="stat-label text-xs text-gray-500">Applications</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-lg font-semibold text-green-600">{job.shortlisted}</div>
          <div className="stat-label text-xs text-gray-500">Shortlisted</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-lg font-semibold text-purple-600">{job.interviewed}</div>
          <div className="stat-label text-xs text-gray-500">Interviewed</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-lg font-semibold text-orange-600">{job.hired}</div>
          <div className="stat-label text-xs text-gray-500">Hired</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="job-performance mb-4">
        <div className="performance-row">
          <span className="text-sm text-gray-500">Views:</span>
          <span className="text-sm font-medium text-gray-900">{job.views}</span>
        </div>
        <div className="performance-row">
          <span className="text-sm text-gray-500">Quality Score:</span>
          <span className="text-sm font-medium text-gray-900">{job.analytics.qualityScore}/10</span>
        </div>
        <div className="performance-row">
          <span className="text-sm text-gray-500">Application Rate:</span>
          <span className="text-sm font-medium text-gray-900">{job.analytics.applicationRate}%</span>
        </div>
      </div>

      {/* Recruiter Info */}
      <div className="job-recruiter mb-4">
        <div className="recruiter-info">
          <span className="text-sm text-gray-500">Recruiter:</span>
          <span className="text-sm font-medium text-gray-900">{job.recruiter}</span>
        </div>
        <div className="recruiter-contact">
          <a href={`mailto:${job.recruiterEmail}`} className="text-sm text-blue-600 hover:text-blue-800">
            {job.recruiterEmail}
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="job-actions flex justify-between items-center">
        <div className="primary-actions flex gap-2">
          <button 
            className="btn btn-primary btn-sm flex items-center gap-2"
            onClick={() => handleViewJob(job.id)}
          >
            <Eye size={14} />
            View Details
          </button>
          
          <button 
            className="btn btn-secondary btn-sm flex items-center gap-2"
            onClick={() => handleViewApplicants(job.id)}
          >
            <Users size={14} />
            Applicants ({job.applications})
          </button>
        </div>
        
        <div className="secondary-actions flex gap-2">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => handleEditJob(job.id)}
          >
            <Edit size={14} />
          </button>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => handleDuplicateJob(job)}
          >
            <Copy size={14} />
          </button>
          
          <div className="dropdown">
            <button className="btn btn-secondary btn-sm">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {paginatedJobs.map(job => renderJobCard(job))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {paginatedJobs.map(job => renderJobCard(job))}
    </div>
  )

  return (
    <div className="job-management-page">
      <div className="page-header mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Management</h1>
            <p className="text-gray-600">
              Create, manage, and track your job postings and applications
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
            
            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/jobs/create')}
              >
                <Plus size={16} />
                Create Job
              </button>
              
              <button
                className="btn btn-primary"
                onClick={() => navigate('/jobs/create-from-template')}
              >
                <Template size={16} />
                From Template
              </button>
              
              <button
                className="btn btn-primary"
                onClick={() => navigate('/jobs/ai-generate')}
              >
                <Wand2 size={16} />
                AI Generate
              </button>
              
              <button
                className="btn btn-primary"
                onClick={() => navigate('/jobs/import')}
              >
                <FileUp size={16} />
                Import
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
                  placeholder="Search jobs by title, company, skills, or description..."
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
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="title_asc">Title A-Z</option>
                <option value="title_desc">Title Z-A</option>
                <option value="salary_desc">Highest Salary</option>
                <option value="salary_asc">Lowest Salary</option>
                <option value="applications_desc">Most Applications</option>
                <option value="applications_asc">Least Applications</option>
                <option value="views_desc">Most Views</option>
                <option value="views_asc">Least Views</option>
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
                    placeholder="City, State, or Remote"
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
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    className="input"
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                  >
                    <option value="all">All Levels</option>
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    className="input"
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="all">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
                    <option value="160000-200000">$160k - $200k</option>
                    <option value="200000">$200k+</option>
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
                    <option value="true">Remote</option>
                    <option value="false">On-site</option>
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
                    <option value="Draft">Draft</option>
                    <option value="Paused">Paused</option>
                    <option value="Closed">Closed</option>
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
              Showing {paginatedJobs.length} of {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            
            {selectedJobs.size > 0 && (
              <div className="selected-actions flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedJobs.size} selected
                </span>
                <button className="btn btn-secondary btn-sm">
                  <Send size={14} />
                  Bulk Actions
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
                  checked={selectedJobs.size === paginatedJobs.length && paginatedJobs.length > 0}
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

      {/* Jobs List/Grid */}
      <div className="jobs-content">
        {isLoading ? (
          <div className="loading-state text-center py-12">
            <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Jobs...</h3>
            <p className="text-gray-600">Please wait while we fetch your job postings</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') 
                ? 'Try adjusting your search criteria or filters'
                : 'No jobs are currently posted. Start by creating your first job posting!'
              }
            </p>
            {(searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')) ? (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('')
                  setFilters({
                    location: '',
                    jobType: 'all',
                    experience: 'all',
                    skills: '',
                    department: 'all',
                    salaryRange: 'all',
                    remote: 'all',
                    status: 'all',
                    urgency: 'all'
                  })
                }}
              >
                Clear All Filters
              </button>
            ) : (
              <div className="flex gap-3 justify-center">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/jobs/create')}
                >
                  <Plus size={16} />
                  Create Job
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/jobs/ai-generate')}
                >
                  <Wand2 size={16} />
                  AI Generate Job
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
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
        .job-management-page {
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

        .job-card {
          position: relative;
          transition: all 0.2s ease;
        }

        .job-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }

        .job-selection {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-left: 32px;
        }

        .job-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .job-badges {
          display: flex;
          gap: 6px;
        }

        .job-company-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .job-meta {
          text-align: right;
        }

        .job-status-urgency {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .remote-badge {
          background: #dcfce7;
          color: #166534;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          margin-left: 8px;
        }

        .performance-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .recruiter-info,
        .recruiter-contact {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.green {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.gray {
          background: #f3f4f6;
          color: #374151;
        }

        .status-badge.yellow {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.red {
          background: #fee2e2;
          color: #991b1b;
        }

        .urgency-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .urgency-badge.red {
          background: #fee2e2;
          color: #991b1b;
        }

        .urgency-badge.yellow {
          background: #fef3c7;
          color: #92400e;
        }

        .urgency-badge.green {
          background: #dcfce7;
          color: #166534;
        }

        .urgency-badge.gray {
          background: #f3f4f6;
          color: #374151;
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
          display: flex;
          align-items: center;
          gap: 4px;
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

        .dropdown {
          position: relative;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .job-management-page {
            padding: 16px;
          }

          .job-header {
            flex-direction: column;
            gap: 12px;
          }

          .job-meta {
            text-align: left;
          }

          .job-actions {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .primary-actions,
          .secondary-actions {
            justify-content: stretch;
          }

          .primary-actions .btn,
          .secondary-actions .btn {
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

export default JobManagementPage

