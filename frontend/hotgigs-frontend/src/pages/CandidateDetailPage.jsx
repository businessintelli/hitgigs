import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  Download,
  FileText,
  Edit,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Building,
  DollarSign,
  Target,
  Zap,
  Brain,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Share2,
  Bookmark,
  BookmarkCheck,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Link,
  Sparkles,
  Database,
  Lightbulb,
  Users,
  Layers,
  Code,
  Palette,
  Shield,
  Cpu,
  Server,
  Smartphone,
  Monitor,
  Cloud,
  Lock,
  Unlock,
  Settings,
  Info,
  HelpCircle,
  X
} from 'lucide-react'

const CandidateDetailPage = () => {
  const { candidateId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [resumeViewType, setResumeViewType] = useState('one-page') // 'one-page' or 'full'
  const [applications, setApplications] = useState([])
  const [aiInsights, setAiInsights] = useState(null)
  const [performanceMetrics, setPerformanceMetrics] = useState(null)

  useEffect(() => {
    loadCandidateData()
    loadApplicationHistory()
    loadAIInsights()
    loadPerformanceMetrics()
  }, [candidateId])

  const loadCandidateData = async () => {
    try {
      // Sample candidate data with comprehensive information
      const candidateData = {
        id: parseInt(candidateId),
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        title: 'Senior React Developer',
        experience_years: 5,
        current_company: 'TechCorp Inc.',
        current_salary: '$140,000',
        expected_salary: '$160,000 - $180,000',
        availability: 'Available in 2 weeks',
        status: 'active',
        profile_image: null,
        
        // Skills and expertise
        skills: {
          primary: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
          secondary: ['Redux', 'GraphQL', 'AWS', 'Docker'],
          tools: ['Git', 'Jira', 'Figma', 'VS Code']
        },
        
        // Domain expertise (AI-identified)
        domain_expertise: [
          { domain: 'E-commerce', confidence: 92, years: 3 },
          { domain: 'FinTech', confidence: 78, years: 2 },
          { domain: 'Healthcare', confidence: 45, years: 1 }
        ],
        
        // Education
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'Stanford University',
            year: '2019',
            gpa: '3.8'
          }
        ],
        
        // Work experience
        experience: [
          {
            title: 'Senior React Developer',
            company: 'TechCorp Inc.',
            duration: '2022 - Present',
            description: 'Led development of e-commerce platform serving 1M+ users',
            technologies: ['React', 'TypeScript', 'AWS']
          },
          {
            title: 'Frontend Developer',
            company: 'StartupXYZ',
            duration: '2020 - 2022',
            description: 'Built responsive web applications for fintech clients',
            technologies: ['React', 'JavaScript', 'Redux']
          }
        ],
        
        // Certifications
        certifications: [
          { name: 'AWS Certified Developer', issuer: 'Amazon', year: '2023' },
          { name: 'React Professional', issuer: 'Meta', year: '2022' }
        ],
        
        // Social links
        social_links: {
          linkedin: 'https://linkedin.com/in/johnsmith',
          github: 'https://github.com/johnsmith',
          portfolio: 'https://johnsmith.dev'
        },
        
        // Resume information
        resume: {
          uploaded_date: '2024-01-15',
          file_name: 'John_Smith_Resume.pdf',
          file_size: '245 KB',
          parsed_date: '2024-01-15',
          one_page_summary: 'Generated AI summary available',
          full_resume_available: true
        },
        
        // Metadata
        created_date: '2024-01-15',
        last_updated: '2024-01-20',
        source: 'manual_upload', // 'manual_upload', 'bulk_import', 'job_application'
        tags: ['top-performer', 'react-expert', 'available-soon'],
        notes: 'Excellent candidate with strong technical skills and good cultural fit.'
      }
      
      setCandidate(candidateData)
    } catch (error) {
      console.error('Failed to load candidate data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadApplicationHistory = async () => {
    try {
      // Sample application history
      const applicationData = [
        {
          id: 1,
          job_title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          applied_date: '2024-01-10',
          status: 'interview_scheduled',
          stage: 'technical_interview',
          feedback: 'Strong technical skills, good problem-solving approach',
          interviewer: 'Sarah Johnson',
          next_action: 'Final round interview',
          salary_discussed: '$155,000',
          match_score: 92
        },
        {
          id: 2,
          job_title: 'Frontend Lead',
          company: 'StartupABC',
          applied_date: '2024-01-05',
          status: 'rejected',
          stage: 'final_interview',
          feedback: 'Great technical skills but looking for more leadership experience',
          interviewer: 'Mike Chen',
          rejection_reason: 'Experience level mismatch',
          match_score: 78
        },
        {
          id: 3,
          job_title: 'Full Stack Developer',
          company: 'InnovateTech',
          applied_date: '2023-12-20',
          status: 'offer_received',
          stage: 'offer_negotiation',
          feedback: 'Excellent candidate, strong cultural fit',
          offer_amount: '$150,000',
          offer_status: 'pending',
          match_score: 88
        }
      ]
      
      setApplications(applicationData)
    } catch (error) {
      console.error('Failed to load application history:', error)
    }
  }

  const loadAIInsights = async () => {
    try {
      // Sample AI insights and recommendations
      const insights = {
        overall_score: 87,
        strengths: [
          'Strong React and JavaScript expertise',
          'Proven track record in e-commerce domain',
          'Good problem-solving and communication skills',
          'Up-to-date with modern development practices'
        ],
        areas_for_improvement: [
          'Limited backend development experience',
          'Could benefit from more leadership experience',
          'Mobile development skills could be enhanced'
        ],
        career_trajectory: {
          current_level: 'Senior Developer',
          next_level: 'Lead Developer / Tech Lead',
          estimated_timeline: '12-18 months',
          recommended_skills: ['System Design', 'Team Leadership', 'Architecture']
        },
        market_insights: {
          salary_percentile: 75,
          demand_level: 'High',
          competition_level: 'Medium',
          market_trends: 'React developers in high demand, especially with TypeScript'
        },
        job_recommendations: [
          {
            title: 'Senior Frontend Developer',
            company: 'TechGiant',
            match_score: 94,
            reason: 'Perfect skill match and domain expertise'
          },
          {
            title: 'React Tech Lead',
            company: 'GrowthCorp',
            match_score: 89,
            reason: 'Good opportunity for career advancement'
          }
        ],
        interview_preparation: {
          common_questions: [
            'Explain React hooks and their use cases',
            'How do you handle state management in large applications?',
            'Describe your experience with performance optimization'
          ],
          technical_topics: ['React', 'TypeScript', 'State Management', 'Performance'],
          behavioral_focus: ['Problem Solving', 'Team Collaboration', 'Learning Agility']
        }
      }
      
      setAiInsights(insights)
    } catch (error) {
      console.error('Failed to load AI insights:', error)
    }
  }

  const loadPerformanceMetrics = async () => {
    try {
      // Sample performance metrics and statistics
      const metrics = {
        application_stats: {
          total_applications: 15,
          active_applications: 3,
          interviews_scheduled: 8,
          offers_received: 2,
          rejections: 7,
          success_rate: 53, // (interviews + offers) / total * 100
          average_response_time: '3.2 days',
          average_interview_score: 8.2
        },
        timeline_data: [
          { month: 'Oct 2023', applications: 2, interviews: 1, offers: 0 },
          { month: 'Nov 2023', applications: 3, interviews: 2, offers: 1 },
          { month: 'Dec 2023', applications: 4, interviews: 3, offers: 0 },
          { month: 'Jan 2024', applications: 6, interviews: 2, offers: 1 }
        ],
        skill_demand: [
          { skill: 'React', demand: 95, proficiency: 90 },
          { skill: 'TypeScript', demand: 88, proficiency: 85 },
          { skill: 'Node.js', demand: 82, proficiency: 75 },
          { skill: 'AWS', demand: 78, proficiency: 70 }
        ],
        feedback_analysis: {
          positive_keywords: ['strong', 'excellent', 'good', 'impressive'],
          improvement_areas: ['leadership', 'backend', 'system design'],
          overall_sentiment: 'positive',
          recommendation_score: 8.5
        },
        market_position: {
          salary_competitiveness: 85,
          skill_relevance: 92,
          experience_value: 78,
          overall_marketability: 85
        }
      }
      
      setPerformanceMetrics(metrics)
    } catch (error) {
      console.error('Failed to load performance metrics:', error)
    }
  }

  const handleResumeView = (viewType) => {
    setResumeViewType(viewType)
    setShowResumeModal(true)
  }

  const handleSendMessage = () => {
    // Navigate to messaging or open message modal
    alert('Message functionality would open here')
  }

  const handleScheduleInterview = () => {
    // Navigate to interview scheduling
    alert('Interview scheduling would open here')
  }

  const handleAddToJob = () => {
    // Open job selection modal
    alert('Job selection modal would open here')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'interview_scheduled': return 'bg-blue-100 text-blue-800'
      case 'offer_received': return 'bg-purple-100 text-purple-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'hired': return 'bg-green-100 text-green-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading candidate details...</span>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Candidate Not Found</h2>
          <p className="text-gray-600 mb-6">The candidate you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/candidates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Candidates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/candidates')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  {candidate.profile_image ? (
                    <img src={candidate.profile_image} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                  <p className="text-gray-600">{candidate.title}</p>
                  <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {candidate.experience_years} years experience
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                      {candidate.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleResumeView('one-page')}
                className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Resume
              </button>
              <button
                onClick={() => handleResumeView('full')}
                className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={handleSendMessage}
                className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </button>
              <button
                onClick={handleAddToJob}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit to Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'applications', label: 'Applications', icon: Briefcase },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'ai-insights', label: 'AI Insights', icon: Brain },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map((tab) => {
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-gray-900">{candidate.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="text-gray-900">{candidate.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="text-gray-900">{candidate.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Availability</div>
                      <div className="text-gray-900">{candidate.availability}</div>
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                {candidate.social_links && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Social Links</h4>
                    <div className="flex space-x-4">
                      {candidate.social_links.linkedin && (
                        <a href={candidate.social_links.linkedin} target="_blank" rel="noopener noreferrer" 
                           className="flex items-center text-blue-600 hover:text-blue-800">
                          <Linkedin className="w-4 h-4 mr-1" />
                          LinkedIn
                        </a>
                      )}
                      {candidate.social_links.github && (
                        <a href={candidate.social_links.github} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-gray-700 hover:text-gray-900">
                          <Github className="w-4 h-4 mr-1" />
                          GitHub
                        </a>
                      )}
                      {candidate.social_links.portfolio && (
                        <a href={candidate.social_links.portfolio} target="_blank" rel="noopener noreferrer"
                           className="flex items-center text-green-600 hover:text-green-800">
                          <Globe className="w-4 h-4 mr-1" />
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.primary.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Secondary Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.secondary.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.tools.map((tool, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Domain Expertise */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Domain Expertise</h3>
                <div className="space-y-3">
                  {candidate.domain_expertise.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{domain.domain}</div>
                        <div className="text-sm text-gray-600">{domain.years} years experience</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${domain.confidence}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(domain.confidence)}`}>
                          {domain.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                <div className="space-y-4">
                  {candidate.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Quick Info */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Applications</span>
                    <span className="font-semibold text-gray-900">
                      {performanceMetrics?.application_stats.total_applications || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">
                      {performanceMetrics?.application_stats.success_rate || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg. Interview Score</span>
                    <span className="font-semibold text-blue-600">
                      {performanceMetrics?.application_stats.average_interview_score || 0}/10
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">
                      {performanceMetrics?.application_stats.average_response_time || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Current Salary</div>
                    <div className="font-semibold text-gray-900">{candidate.current_salary}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Expected Salary</div>
                    <div className="font-semibold text-gray-900">{candidate.expected_salary}</div>
                  </div>
                  {performanceMetrics?.market_position && (
                    <div>
                      <div className="text-sm text-gray-600">Market Percentile</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${performanceMetrics.market_position.salary_competitiveness}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {performanceMetrics.market_position.salary_competitiveness}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                <div className="space-y-3">
                  {candidate.education.map((edu, index) => (
                    <div key={index}>
                      <div className="font-medium text-gray-900">{edu.degree}</div>
                      <div className="text-blue-600">{edu.school}</div>
                      <div className="text-sm text-gray-600">{edu.year} • GPA: {edu.gpa}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-3">
                  {candidate.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center">
                      <Award className="w-5 h-5 text-yellow-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{cert.name}</div>
                        <div className="text-sm text-gray-600">{cert.issuer} • {cert.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Application History</h3>
              <p className="text-gray-600 mt-1">Track all job applications and their current status</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job & Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{app.job_title}</div>
                          <div className="text-sm text-gray-600">{app.company}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(app.applied_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{app.stage.replace('_', ' ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${getScoreColor(app.match_score)}`}>
                          {app.match_score}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={app.feedback}>
                          {app.feedback}
                        </div>
                        {app.interviewer && (
                          <div className="text-xs text-gray-500">by {app.interviewer}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && performanceMetrics && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {performanceMetrics.application_stats.total_applications}
                    </div>
                    <div className="text-sm text-gray-600">Total Applications</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {performanceMetrics.application_stats.success_rate}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {performanceMetrics.application_stats.average_interview_score}
                    </div>
                    <div className="text-sm text-gray-600">Avg Interview Score</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {performanceMetrics.application_stats.average_response_time}
                    </div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Demand Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Demand vs Proficiency</h3>
              <div className="space-y-4">
                {performanceMetrics.skill_demand.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                      <div className="text-sm text-gray-600">
                        Demand: {skill.demand}% | Proficiency: {skill.proficiency}%
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Market Demand</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${skill.demand}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Your Proficiency</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Position */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Position</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Object.entries(performanceMetrics.market_position).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                        <span className={`font-semibold ${getScoreColor(value)}`}>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            value >= 80 ? 'bg-green-600' : value >= 60 ? 'bg-blue-600' : 'bg-yellow-600'
                          }`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Feedback Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Overall Sentiment: </span>
                      <span className="font-medium text-green-600 capitalize">
                        {performanceMetrics.feedback_analysis.overall_sentiment}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Recommendation Score: </span>
                      <span className="font-medium text-blue-600">
                        {performanceMetrics.feedback_analysis.recommendation_score}/10
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-gray-600 mb-1">Common Positive Keywords:</div>
                      <div className="flex flex-wrap gap-1">
                        {performanceMetrics.feedback_analysis.positive_keywords.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && aiInsights && (
          <div className="space-y-6">
            {/* Overall AI Score */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">AI Overall Score</h3>
                  <p className="text-purple-100 mt-1">Comprehensive candidate evaluation</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{aiInsights.overall_score}</div>
                  <div className="text-purple-100">out of 100</div>
                </div>
              </div>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  Key Strengths
                </h3>
                <ul className="space-y-3">
                  {aiInsights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {aiInsights.areas_for_improvement.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Career Trajectory */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Career Trajectory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Current Level</h4>
                  <p className="text-gray-600">{aiInsights.career_trajectory.current_level}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Next Level</h4>
                  <p className="text-gray-600">{aiInsights.career_trajectory.next_level}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Timeline</h4>
                  <p className="text-gray-600">{aiInsights.career_trajectory.estimated_timeline}</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Recommended Skills for Advancement</h5>
                <div className="flex flex-wrap gap-2">
                  {aiInsights.career_trajectory.recommended_skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                AI Job Recommendations
              </h3>
              <div className="space-y-4">
                {aiInsights.job_recommendations.map((job, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-blue-600">{job.company}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(job.match_score)} bg-opacity-10`}>
                        {job.match_score}% Match
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{job.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Preparation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Interview Preparation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Common Interview Questions</h4>
                  <ul className="space-y-2">
                    {aiInsights.interview_preparation.common_questions.map((question, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Focus Areas</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Technical Topics</h5>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {aiInsights.interview_preparation.technical_topics.map((topic, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Behavioral Focus</h5>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {aiInsights.interview_preparation.behavioral_focus.map((focus, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Documents & Files</h3>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Resume */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{candidate.resume.file_name}</h4>
                      <p className="text-sm text-gray-600">
                        Uploaded {new Date(candidate.resume.uploaded_date).toLocaleDateString()} • {candidate.resume.file_size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleResumeView('one-page')}
                      className="flex items-center px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      One-Page View
                    </button>
                    <button
                      onClick={() => handleResumeView('full')}
                      className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Full Resume
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Placeholder for other documents */}
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>No additional documents uploaded</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {resumeViewType === 'one-page' ? 'One-Page Resume Summary' : 'Full Resume'}
              </h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setResumeViewType('one-page')}
                    className={`px-3 py-2 text-sm ${
                      resumeViewType === 'one-page' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    One-Page
                  </button>
                  <button
                    onClick={() => setResumeViewType('full')}
                    className={`px-3 py-2 text-sm ${
                      resumeViewType === 'full' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Full Resume
                  </button>
                </div>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              {resumeViewType === 'one-page' ? (
                <div className="space-y-6">
                  {/* AI-Generated One-Page Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-900">AI-Generated Summary</h4>
                    </div>
                    <p className="text-blue-800 text-sm">
                      This is an AI-generated one-page summary highlighting the candidate's key qualifications, 
                      domain expertise, and career highlights optimized for quick review.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
                      <p className="text-lg text-blue-600">{candidate.title}</p>
                      <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>{candidate.email}</span>
                        <span>{candidate.phone}</span>
                        <span>{candidate.location}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Core Competencies</h3>
                        <div className="space-y-2">
                          {candidate.skills.primary.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700">{skill}</span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Domain Expertise</h3>
                        <div className="space-y-2">
                          {candidate.domain_expertise.map((domain, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700">{domain.domain}</span>
                              <span className="text-sm text-gray-600">{domain.years}y • {domain.confidence}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Career Highlights</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">5+ years of React development experience with proven track record</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">Led development of e-commerce platform serving 1M+ users</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">Strong domain expertise in E-commerce and FinTech sectors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">AWS Certified Developer with cloud architecture experience</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  {/* Full Resume View */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
                    <p className="text-xl text-blue-600 mt-2">{candidate.title}</p>
                    <div className="flex items-center justify-center space-x-6 mt-4 text-gray-600">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {candidate.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {candidate.phone}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {candidate.location}
                      </span>
                    </div>
                  </div>
                  
                  {/* Professional Summary */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                      Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      Experienced Senior React Developer with {candidate.experience_years} years of expertise in building 
                      scalable web applications. Proven track record in e-commerce and fintech domains with strong 
                      technical leadership skills. Passionate about modern development practices and delivering 
                      high-quality user experiences.
                    </p>
                  </div>
                  
                  {/* Technical Skills */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                      Technical Skills
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Frontend</h3>
                        <p className="text-gray-700">{candidate.skills.primary.join(', ')}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Backend & Cloud</h3>
                        <p className="text-gray-700">{candidate.skills.secondary.join(', ')}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Tools</h3>
                        <p className="text-gray-700">{candidate.skills.tools.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Work Experience */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                      Work Experience
                    </h2>
                    <div className="space-y-6">
                      {candidate.experience.map((exp, index) => (
                        <div key={index}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                              <p className="text-blue-600 font-medium">{exp.company}</p>
                            </div>
                            <span className="text-gray-600 font-medium">{exp.duration}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{exp.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Education */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                      Education
                    </h2>
                    {candidate.education.map((edu, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-blue-600 font-medium">{edu.school}</p>
                        <p className="text-gray-600">{edu.year} • GPA: {edu.gpa}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Certifications */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                      Certifications
                    </h2>
                    <div className="space-y-2">
                      {candidate.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center">
                          <Award className="w-5 h-5 text-yellow-500 mr-3" />
                          <div>
                            <span className="font-medium text-gray-900">{cert.name}</span>
                            <span className="text-gray-600 ml-2">• {cert.issuer} ({cert.year})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateDetailPage

