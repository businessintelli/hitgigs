import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Send, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Download, 
  FileText, 
  Bot, 
  Zap, 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  Building, 
  DollarSign,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  UserPlus,
  Database,
  FileUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

const CandidateSubmissionWorkflow = ({ jobId, jobTitle, onClose, onSubmit }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [candidates, setCandidates] = useState([])
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [loading, setLoading] = useState(true)
  const [submissionData, setSubmissionData] = useState({})
  const [aiRecommendations, setAiRecommendations] = useState({})
  const [feedbackData, setFeedbackData] = useState({})

  const steps = [
    { id: 1, title: 'Select Candidates', description: 'Choose candidates to submit' },
    { id: 2, title: 'AI Analysis', description: 'Review AI recommendations' },
    { id: 3, title: 'Submission Details', description: 'Add notes and customize submission' },
    { id: 4, title: 'Confirm & Submit', description: 'Review and submit candidates' }
  ]

  useEffect(() => {
    loadCandidates()
    if (selectedCandidates.length > 0) {
      loadAIRecommendations()
    }
  }, [selectedCandidates])

  const loadCandidates = async () => {
    try {
      // Sample candidate data with enhanced matching information
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
          match_score: 92,
          resume_url: '/resumes/john-smith.pdf',
          domain_expertise: ['E-commerce', 'FinTech'],
          previous_applications: 12,
          success_rate: 85,
          last_feedback: 'Strong technical skills, excellent communication',
          ai_insights: {
            strengths: ['React expertise matches perfectly', 'Strong problem-solving skills', 'Good cultural fit'],
            concerns: ['Salary expectation might be high', 'Limited TypeScript experience'],
            recommendation: 'Highly recommended - excellent match',
            confidence: 92
          }
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
          match_score: 89,
          resume_url: '/resumes/sarah-johnson.pdf',
          domain_expertise: ['Healthcare', 'E-commerce'],
          previous_applications: 8,
          success_rate: 78,
          last_feedback: 'Excellent full-stack capabilities, strong leadership',
          ai_insights: {
            strengths: ['Full-stack expertise', 'Cloud experience', 'Remote work experience'],
            concerns: ['Notice period required', 'Higher salary expectations'],
            recommendation: 'Good match with some considerations',
            confidence: 89
          }
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
          match_score: 85,
          resume_url: '/resumes/mike-chen.pdf',
          domain_expertise: ['Media', 'Gaming'],
          previous_applications: 15,
          success_rate: 72,
          last_feedback: 'Creative developer with strong design skills',
          ai_insights: {
            strengths: ['Strong frontend skills', 'Design background', 'Competitive salary range'],
            concerns: ['Less backend experience', 'Different domain background'],
            recommendation: 'Moderate match - consider for frontend-focused roles',
            confidence: 85
          }
        }
      ]
      setCandidates(sampleCandidates)
    } catch (error) {
      console.error('Failed to load candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAIRecommendations = async () => {
    try {
      // Simulate AI analysis for selected candidates
      const recommendations = {}
      selectedCandidates.forEach(candidateId => {
        const candidate = candidates.find(c => c.id === candidateId)
        if (candidate) {
          recommendations[candidateId] = {
            overall_score: candidate.match_score,
            recommendation_level: candidate.match_score >= 90 ? 'highly_recommended' : 
                                 candidate.match_score >= 80 ? 'recommended' : 'consider',
            key_strengths: candidate.ai_insights.strengths,
            potential_concerns: candidate.ai_insights.concerns,
            success_probability: candidate.success_rate,
            suggested_interview_questions: [
              'Can you walk me through your experience with React?',
              'How do you approach state management in large applications?',
              'Describe a challenging technical problem you solved recently.'
            ],
            salary_negotiation_tips: [
              'Candidate expects $130-150k range',
              'Market rate for this role is $125-145k',
              'Consider offering equity or benefits to bridge gap'
            ],
            historical_feedback: candidate.last_feedback
          }
        }
      })
      setAiRecommendations(recommendations)
    } catch (error) {
      console.error('Failed to load AI recommendations:', error)
    }
  }

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmissionNoteChange = (candidateId, note) => {
    setSubmissionData(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        note
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      const submissionPayload = {
        jobId,
        candidates: selectedCandidates.map(candidateId => ({
          candidateId,
          note: submissionData[candidateId]?.note || '',
          aiRecommendation: aiRecommendations[candidateId],
          submittedBy: user.id,
          submittedAt: new Date().toISOString()
        }))
      }
      
      console.log('Submitting candidates:', submissionPayload)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onSubmit && onSubmit(submissionPayload)
      onClose && onClose()
      
      alert(`Successfully submitted ${selectedCandidates.length} candidate(s) for ${jobTitle}`)
    } catch (error) {
      console.error('Failed to submit candidates:', error)
      alert('Failed to submit candidates. Please try again.')
    }
  }

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchTerm === '' || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'high-match' && candidate.match_score >= 90) ||
      (filterBy === 'available' && candidate.availability.includes('Available')) ||
      (filterBy === 'recent' && candidate.previous_applications > 0)
    
    return matchesSearch && matchesFilter
  })

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRecommendationColor = (level) => {
    switch (level) {
      case 'highly_recommended': return 'text-green-600 bg-green-100'
      case 'recommended': return 'text-blue-600 bg-blue-100'
      case 'consider': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Submit Candidates</h2>
              <p className="text-blue-100">Job: {jobTitle}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-white text-blue-600 border-white' 
                      : 'border-blue-300 text-blue-300'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-white' : 'text-blue-300'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-blue-200">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-blue-300 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Step 1: Select Candidates */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Select Candidates to Submit</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Candidates</option>
                    <option value="high-match">High Match (90%+)</option>
                    <option value="available">Available Now</option>
                    <option value="recent">Recently Active</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCandidates.includes(candidate.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => handleCandidateSelect(candidate.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => handleCandidateSelect(candidate.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
                        />
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">{candidate.title}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {candidate.location}
                            </span>
                            <span className="flex items-center">
                              <Briefcase className="w-3 h-3 mr-1" />
                              {candidate.experience}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {candidate.salary_expectation}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(candidate.match_score)}`}>
                          {candidate.match_score}% Match
                        </span>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{candidate.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedCandidates.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    {selectedCandidates.length} candidate(s) selected for submission
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: AI Analysis */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Analysis & Recommendations</h3>
              
              <div className="space-y-6">
                {selectedCandidates.map(candidateId => {
                  const candidate = candidates.find(c => c.id === candidateId)
                  const recommendation = aiRecommendations[candidateId]
                  
                  if (!candidate || !recommendation) return null
                  
                  return (
                    <div key={candidateId} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(recommendation.overall_score)}`}>
                            {recommendation.overall_score}% Match
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(recommendation.recommendation_level)}`}>
                            {recommendation.recommendation_level.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Key Strengths
                          </h5>
                          <ul className="space-y-2">
                            {recommendation.key_strengths.map((strength, index) => (
                              <li key={index} className="flex items-start text-sm text-green-700">
                                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-orange-800 mb-3 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Potential Concerns
                          </h5>
                          <ul className="space-y-2">
                            {recommendation.potential_concerns.map((concern, index) => (
                              <li key={index} className="flex items-start text-sm text-orange-700">
                                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h6 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Success Probability
                          </h6>
                          <div className="text-2xl font-bold text-blue-600">{recommendation.success_probability}%</div>
                          <p className="text-xs text-gray-600">Based on historical data</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h6 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            AI Confidence
                          </h6>
                          <div className="text-2xl font-bold text-green-600">{recommendation.overall_score}%</div>
                          <p className="text-xs text-gray-600">Match confidence level</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h6 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Activity className="w-4 h-4 mr-2" />
                            Previous Applications
                          </h6>
                          <div className="text-2xl font-bold text-purple-600">{candidate.previous_applications}</div>
                          <p className="text-xs text-gray-600">Total applications</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h6 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Suggested Interview Questions
                        </h6>
                        <ul className="space-y-2">
                          {recommendation.suggested_interview_questions.map((question, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              {question}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h6 className="font-semibold text-blue-900 mb-2">Historical Feedback</h6>
                        <p className="text-sm text-blue-800">{recommendation.historical_feedback}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Submission Details */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Submission Details</h3>
              
              <div className="space-y-6">
                {selectedCandidates.map(candidateId => {
                  const candidate = candidates.find(c => c.id === candidateId)
                  if (!candidate) return null
                  
                  return (
                    <div key={candidateId} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">{candidate.title}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Submission Notes (Optional)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Add any specific notes about this candidate's submission..."
                          value={submissionData[candidateId]?.note || ''}
                          onChange={(e) => handleSubmissionNoteChange(candidateId, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Confirm & Submit */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Review & Confirm Submission</h3>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Submission Summary</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{selectedCandidates.length}</div>
                    <div className="text-sm text-gray-600">Candidates Selected</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(selectedCandidates.reduce((acc, id) => {
                        const candidate = candidates.find(c => c.id === id)
                        return acc + (candidate?.match_score || 0)
                      }, 0) / selectedCandidates.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Average Match Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(selectedCandidates.reduce((acc, id) => {
                        const candidate = candidates.find(c => c.id === id)
                        return acc + (candidate?.success_rate || 0)
                      }, 0) / selectedCandidates.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Average Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedCandidates.map(candidateId => {
                  const candidate = candidates.find(c => c.id === candidateId)
                  const recommendation = aiRecommendations[candidateId]
                  if (!candidate) return null
                  
                  return (
                    <div key={candidateId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(candidate.match_score)}`}>
                            {candidate.match_score}% Match
                          </span>
                          {recommendation && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(recommendation.recommendation_level)}`}>
                              {recommendation.recommendation_level.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      {submissionData[candidateId]?.note && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{submissionData[candidateId].note}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
            <div className="flex space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < steps.length ? (
                <button
                  onClick={handleNextStep}
                  disabled={currentStep === 1 && selectedCandidates.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Candidates
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateSubmissionWorkflow

