import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  Users, 
  Building, 
  Bookmark, 
  Share2, 
  Send,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Heart,
  MessageSquare,
  TrendingUp,
  Target,
  Zap,
  Eye,
  UserPlus,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Plus,
  FileText,
  Download,
  Edit,
  Trash2,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  User,
  Mail,
  Phone,
  Globe,
  Link,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle
} from 'lucide-react'

const JobDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)
  const [aiInsights, setAiInsights] = useState(null)
  const [matchScore, setMatchScore] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showCandidateSubmission, setShowCandidateSubmission] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [candidateSearch, setCandidateSearch] = useState('')
  const [applicationStages, setApplicationStages] = useState([])

  // Check if user is recruiter or company admin
  const isRecruiter = user && (user.user_type === 'recruiter' || user.user_type === 'company')

  useEffect(() => {
    loadJobDetails()
    if (user) {
      loadAIInsights()
      if (isRecruiter) {
        loadCandidates()
        loadApplicationStages()
      }
    }
  }, [id, user])

  const loadJobDetails = async () => {
    try {
      // Sample job data - in real implementation, fetch from API
      const sampleJob = {
        id: id || '1',
        title: 'Senior React Developer',
        company: {
          name: 'TechCorp Inc.',
          logo: null,
          size: '100-500 employees',
          industry: 'Technology',
          description: 'Leading technology company focused on innovative solutions'
        },
        location: 'San Francisco, CA',
        remote: true,
        salary: '$130,000 - $160,000',
        employment_type: 'Full-time',
        experience_level: 'Senior Level',
        posted_date: '2024-01-15',
        deadline: '2024-02-15',
        description: `We are seeking a talented Senior React Developer to join our growing engineering team. You will be responsible for building and maintaining high-quality web applications using modern React technologies.

Key Responsibilities:
• Develop and maintain React-based web applications
• Collaborate with cross-functional teams to deliver high-quality software
• Write clean, maintainable, and well-tested code
• Participate in code reviews and technical discussions
• Mentor junior developers and contribute to team knowledge sharing`,
        requirements: [
          '5+ years of experience with React and JavaScript',
          'Strong understanding of modern JavaScript (ES6+)',
          'Experience with state management libraries (Redux, Context API)',
          'Proficiency in HTML5, CSS3, and responsive design',
          'Experience with RESTful APIs and GraphQL',
          'Knowledge of testing frameworks (Jest, React Testing Library)',
          'Familiarity with Git and version control workflows'
        ],
        nice_to_have: [
          'Experience with TypeScript',
          'Knowledge of Next.js or other React frameworks',
          'Experience with cloud platforms (AWS, Azure, GCP)',
          'Understanding of CI/CD pipelines',
          'Experience with containerization (Docker)',
          'Knowledge of backend technologies (Node.js, Python)'
        ],
        benefits: [
          'Health, Dental, Vision Insurance',
          '401(k) with company matching',
          'Flexible PTO policy',
          'Remote work options',
          'Professional development budget',
          'Stock options',
          'Gym membership reimbursement',
          'Catered meals and snacks'
        ],
        skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Node.js', 'AWS', 'Git'],
        status: 'active'
      }
      
      setJob(sampleJob)
    } catch (error) {
      console.error('Failed to load job details:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAIInsights = async () => {
    try {
      const insights = {
        matchScore: 87,
        strengths: [
          'Strong React experience matches job requirements',
          'JavaScript skills align with company tech stack',
          'Previous experience in similar company size'
        ],
        improvements: [
          'Consider gaining TypeScript experience',
          'AWS certification would strengthen your profile'
        ],
        salaryInsight: {
          market_average: '$145,000',
          percentile: 75,
          recommendation: 'This salary range is competitive for your experience level'
        },
        applicationTips: [
          'Highlight your React projects in your application',
          'Mention any experience with modern state management',
          'Include examples of code reviews or mentoring experience'
        ]
      }
      
      setAiInsights(insights)
      setMatchScore(insights.matchScore)
    } catch (error) {
      console.error('Failed to load AI insights:', error)
    }
  }

  const loadCandidates = async () => {
    try {
      // Sample candidate data
      const sampleCandidates = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1-555-0123',
          skills: ['React', 'JavaScript', 'TypeScript', 'Redux'],
          experience: '5 years',
          location: 'San Francisco, CA',
          matchScore: 92,
          resumeUrl: '/resumes/john-smith.pdf',
          status: 'available',
          lastActive: '2024-01-20'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1-555-0124',
          skills: ['React', 'Node.js', 'AWS', 'GraphQL'],
          experience: '6 years',
          location: 'Remote',
          matchScore: 89,
          resumeUrl: '/resumes/sarah-johnson.pdf',
          status: 'available',
          lastActive: '2024-01-19'
        },
        {
          id: 3,
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1-555-0125',
          skills: ['React', 'TypeScript', 'Next.js', 'Docker'],
          experience: '4 years',
          location: 'New York, NY',
          matchScore: 85,
          resumeUrl: '/resumes/mike-chen.pdf',
          status: 'available',
          lastActive: '2024-01-18'
        }
      ]
      setCandidates(sampleCandidates)
    } catch (error) {
      console.error('Failed to load candidates:', error)
    }
  }

  const loadApplicationStages = async () => {
    try {
      // Sample ATS workflow data
      const sampleStages = [
        {
          id: 1,
          stage: 'Applied',
          candidates: [
            { id: 101, name: 'Alice Brown', appliedDate: '2024-01-20', status: 'new' },
            { id: 102, name: 'Bob Wilson', appliedDate: '2024-01-19', status: 'reviewed' }
          ]
        },
        {
          id: 2,
          stage: 'Screening',
          candidates: [
            { id: 103, name: 'Carol Davis', appliedDate: '2024-01-18', status: 'in_progress' }
          ]
        },
        {
          id: 3,
          stage: 'Interview',
          candidates: [
            { id: 104, name: 'David Lee', appliedDate: '2024-01-17', status: 'scheduled' }
          ]
        },
        {
          id: 4,
          stage: 'Offer',
          candidates: []
        },
        {
          id: 5,
          stage: 'Hired',
          candidates: []
        },
        {
          id: 6,
          stage: 'Rejected',
          candidates: [
            { id: 105, name: 'Eve Martinez', appliedDate: '2024-01-16', status: 'rejected' }
          ]
        }
      ]
      setApplicationStages(sampleStages)
    } catch (error) {
      console.error('Failed to load application stages:', error)
    }
  }

  const handleApply = async () => {
    if (!user) {
      navigate('/signin')
      return
    }

    if (isRecruiter) {
      setShowCandidateSubmission(true)
      return
    }
    
    setShowApplyModal(true)
  }

  const handleSave = async () => {
    if (!user) {
      navigate('/signin')
      return
    }
    
    try {
      setSaved(!saved)
    } catch (error) {
      console.error('Failed to save job:', error)
    }
  }

  const handleShare = (platform) => {
    const jobUrl = window.location.href
    const jobTitle = job.title
    const companyName = job.company.name
    const shareText = `Check out this ${jobTitle} position at ${companyName}!`
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(jobUrl)
        alert('Job link copied to clipboard!')
        break
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(jobUrl)}`
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobUrl)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`, '_blank')
        break
    }
    setShowShareModal(false)
  }

  const handleCandidateSubmission = async () => {
    if (selectedCandidates.length === 0) {
      alert('Please select at least one candidate to submit.')
      return
    }

    try {
      // Submit selected candidates for this job
      console.log('Submitting candidates:', selectedCandidates)
      alert(`Successfully submitted ${selectedCandidates.length} candidate(s) for this position.`)
      setShowCandidateSubmission(false)
      setSelectedCandidates([])
    } catch (error) {
      console.error('Failed to submit candidates:', error)
      alert('Failed to submit candidates. Please try again.')
    }
  }

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    candidate.email.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(candidateSearch.toLowerCase()))
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const daysUntilDeadline = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/jobs')} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <h2 className="text-xl text-gray-700 mb-3">{job.company.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.employment_type}
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        {job.experience_level}
                      </div>
                      {job.remote && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Remote Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={handleSave}
                    className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                      saved 
                        ? 'border-red-300 text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${saved ? 'fill-current' : ''}`} />
                    {saved ? 'Saved' : 'Save Job'}
                  </button>
                  
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                  
                  <button 
                    onClick={handleApply}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={applied}
                  >
                    {isRecruiter ? (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Submit Candidates
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {applied ? 'Applied' : 'Apply Now'}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Match Score for candidates */}
              {user && !isRecruiter && aiInsights && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-blue-900">AI Match Score</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(matchScore)}`}>
                      {matchScore}% Match
                    </div>
                  </div>
                  <p className="text-blue-800 text-sm mt-2">
                    Based on your skills, experience, and preferences
                  </p>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Job Details
                  </button>
                  {isRecruiter && (
                    <button
                      onClick={() => setActiveTab('ats')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'ats'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      ATS Workflow
                    </button>
                  )}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* AI Insights for candidates */}
                {user && !isRecruiter && aiInsights && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Zap className="w-5 h-5 text-blue-600 mr-2" />
                      AI-Powered Insights
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-800 mb-3">Your Strengths</h4>
                        <ul className="space-y-2">
                          {aiInsights.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start text-sm text-green-700">
                              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-800 mb-3">Areas to Improve</h4>
                        <ul className="space-y-2">
                          {aiInsights.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start text-sm text-orange-700">
                              <Target className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Salary Analysis</h4>
                      <p className="text-sm text-gray-700">
                        Market average: <span className="font-semibold">{aiInsights.salaryInsight.market_average}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{aiInsights.salaryInsight.recommendation}</p>
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                  <div className="prose prose-gray max-w-none">
                    {job.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nice to Have */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Nice to Have</h3>
                  <ul className="space-y-3">
                    {job.nice_to_have.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <Award className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ATS Workflow Tab */}
            {activeTab === 'ats' && isRecruiter && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Tracking System</h3>
                
                <div className="space-y-6">
                  {applicationStages.map((stage) => (
                    <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {stage.candidates.length} candidates
                        </span>
                      </div>
                      
                      {stage.candidates.length > 0 ? (
                        <div className="space-y-2">
                          {stage.candidates.map((candidate) => (
                            <div key={candidate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{candidate.name}</p>
                                <p className="text-sm text-gray-600">Applied: {formatDate(candidate.appliedDate)}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  candidate.status === 'new' ? 'bg-green-100 text-green-800' :
                                  candidate.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                  candidate.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                  candidate.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {candidate.status.replace('_', ' ')}
                                </span>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No candidates in this stage</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Application Deadline */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Application Deadline</h4>
                <div className="flex items-center text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(job.deadline)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {daysUntilDeadline(job.deadline)} days remaining
                </div>
              </div>

              {/* Required Skills */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-3">About {job.company.name}</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {job.company.size}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    {job.company.industry}
                  </div>
                  <p className="text-sm text-gray-700">{job.company.description}</p>
                </div>
              </div>

              {/* Job Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Job Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="font-semibold text-gray-900">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="font-semibold text-gray-900">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Posted</span>
                    <span className="font-semibold text-gray-900">{formatDate(job.posted_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Job</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleShare('copy')}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 mr-3 text-gray-600" />
                <span>Copy Link</span>
              </button>
              
              <button 
                onClick={() => handleShare('email')}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5 mr-3 text-gray-600" />
                <span>Email</span>
              </button>
              
              <button 
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5 mr-3 text-blue-600" />
                <span>LinkedIn</span>
              </button>
              
              <button 
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 mr-3 text-blue-400" />
                <span>Twitter</span>
              </button>
              
              <button 
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal for Candidates */}
      {showApplyModal && !isRecruiter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Apply for {job.title}</h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setApplied(true)
                    setShowApplyModal(false)
                    alert('Application submitted successfully!')
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Submission Modal for Recruiters */}
      {showCandidateSubmission && isRecruiter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Submit Candidates for {job.title}</h3>
              <button 
                onClick={() => setShowCandidateSubmission(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search candidates..."
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => navigate('/candidates?action=add')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Candidate
                  </button>
                  <button 
                    onClick={() => navigate('/bulk-resume-upload')}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Candidates
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                {selectedCandidates.length} of {filteredCandidates.length} candidates selected
              </div>
            </div>
            
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => toggleCandidateSelection(candidate.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
                      />
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {candidate.email}
                            </span>
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {candidate.phone}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {candidate.location}
                            </span>
                          </div>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-600 mr-3">{candidate.experience} experience</span>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(candidate.matchScore)}`}>
                              {candidate.matchScore}% Match
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {selectedCandidates.length} candidate(s) selected
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowCandidateSubmission(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCandidateSubmission}
                  disabled={selectedCandidates.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit {selectedCandidates.length} Candidate(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetailsPage

