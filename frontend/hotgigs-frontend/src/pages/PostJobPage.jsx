import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Users, 
  FileText, 
  Upload, 
  Download, 
  Zap, 
  Plus, 
  Edit, 
  Save, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Star, 
  Target, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Award, 
  Settings, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Copy, 
  Share, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  Loader, 
  CheckCircle, 
  XCircle, 
  Database, 
  Layers, 
  Grid, 
  List, 
  MoreVertical, 
  ExternalLink, 
  BookOpen, 
  Heart, 
  MessageSquare, 
  Send, 
  Archive, 
  Flag, 
  Bookmark, 
  Timer, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  LineChart
} from 'lucide-react'

const PostJobPage = () => {
  const { user } = useAuth()
  const [activeMethod, setActiveMethod] = useState('manual') // 'manual', 'excel', 'ai'
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Manual job creation form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary_min: '',
    salary_max: '',
    employment_type: 'full_time',
    experience_level: 'mid',
    skills: '',
    benefits: '',
    remote_option: false,
    department: '',
    reports_to: '',
    start_date: '',
    application_deadline: '',
    requirements: '',
    responsibilities: '',
    company_overview: '',
    perks: '',
    interview_process: ''
  })

  // AI job creation form data
  const [aiFormData, setAiFormData] = useState({
    job_title: '',
    primary_skill: '',
    secondary_skills: '',
    optional_skills: '',
    domain: '',
    location: '',
    salary_min: '',
    salary_max: '',
    experience_level: 'mid',
    employment_type: 'full_time',
    remote_option: false,
    company_size: '',
    industry: '',
    additional_requirements: ''
  })

  // Excel import data
  const [excelData, setExcelData] = useState({
    file: null,
    preview: [],
    mapping: {},
    errors: []
  })

  // Generated AI content
  const [aiGeneratedContent, setAiGeneratedContent] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    company_overview: ''
  })

  const jobCreationMethods = [
    {
      id: 'manual',
      title: 'Manual Creation',
      description: 'Create a job posting from scratch with full control',
      icon: Edit,
      color: 'blue',
      features: ['Custom job description', 'Full control over content', 'Rich text editor', 'Preview mode']
    },
    {
      id: 'excel',
      title: 'Excel Import',
      description: 'Import multiple jobs from Excel template',
      icon: Upload,
      color: 'green',
      features: ['Bulk job import', 'Excel template', 'Data validation', 'Error checking']
    },
    {
      id: 'ai',
      title: 'AI-Powered Creation',
      description: 'Generate job descriptions using AI',
      icon: Zap,
      color: 'purple',
      features: ['AI-generated content', 'Smart suggestions', 'Industry best practices', 'Quick setup']
    }
  ]

  const employmentTypes = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' }
  ]

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' },
    { value: 'executive', label: 'Executive' }
  ]

  const domains = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Consulting', 'Media', 'Real Estate', 'Transportation', 'Energy', 'Government'
  ]

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-500 employees', '501-1000 employees', '1000+ employees'
  ]

  const handleMethodSelect = (method) => {
    setActiveMethod(method)
    setCurrentStep(1)
    setSuccess(false)
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        location: '',
        salary_min: '',
        salary_max: '',
        employment_type: 'full_time',
        experience_level: 'mid',
        skills: '',
        benefits: '',
        remote_option: false,
        department: '',
        reports_to: '',
        start_date: '',
        application_deadline: '',
        requirements: '',
        responsibilities: '',
        company_overview: '',
        perks: '',
        interview_process: ''
      })
    } catch (error) {
      console.error('Failed to post job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExcelUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setExcelData(prev => ({ ...prev, file }))
      // Simulate file processing
      setLoading(true)
      setTimeout(() => {
        setExcelData(prev => ({
          ...prev,
          preview: [
            { title: 'Senior Developer', location: 'San Francisco', salary: '$120k-160k' },
            { title: 'Product Manager', location: 'New York', salary: '$100k-140k' },
            { title: 'UX Designer', location: 'Austin', salary: '$80k-110k' }
          ]
        }))
        setLoading(false)
        setCurrentStep(2)
      }, 1500)
    }
  }

  const handleAiGenerate = async () => {
    setLoading(true)
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const generatedContent = {
        title: aiFormData.job_title,
        description: `We are seeking a talented ${aiFormData.job_title} to join our dynamic team. This role requires expertise in ${aiFormData.primary_skill} and ${aiFormData.secondary_skills}. The ideal candidate will have experience in ${aiFormData.domain} and be passionate about delivering high-quality solutions.

Our company offers a collaborative environment where innovation thrives. You'll work with cutting-edge technologies and contribute to projects that make a real impact. We value work-life balance and provide comprehensive benefits to support your professional and personal growth.

This is an excellent opportunity for someone looking to advance their career in ${aiFormData.domain} while working with a team of experienced professionals. The role offers competitive compensation, flexible working arrangements, and opportunities for continuous learning and development.`,
        
        requirements: `• ${aiFormData.experience_level === 'entry' ? '0-2' : aiFormData.experience_level === 'mid' ? '3-5' : aiFormData.experience_level === 'senior' ? '6-10' : '10+'} years of experience in ${aiFormData.primary_skill}
• Strong proficiency in ${aiFormData.secondary_skills}
• Experience with ${aiFormData.domain} industry practices
• ${aiFormData.optional_skills ? `Knowledge of ${aiFormData.optional_skills} is a plus` : 'Strong problem-solving and analytical skills'}
• Excellent communication and teamwork abilities
• Bachelor's degree in relevant field or equivalent experience
• ${aiFormData.additional_requirements || 'Ability to work in a fast-paced environment'}`,

        responsibilities: `• Develop and maintain high-quality ${aiFormData.primary_skill} solutions
• Collaborate with cross-functional teams to deliver projects on time
• Participate in code reviews and maintain coding standards
• Troubleshoot and resolve technical issues
• Stay updated with latest ${aiFormData.domain} trends and technologies
• Mentor junior team members and share knowledge
• Contribute to technical documentation and best practices
• Participate in agile development processes`,

        benefits: `• Competitive salary range: $${aiFormData.salary_min || '80,000'} - $${aiFormData.salary_max || '120,000'}
• Comprehensive health, dental, and vision insurance
• 401(k) retirement plan with company matching
• Flexible working hours and ${aiFormData.remote_option ? 'remote work options' : 'hybrid work arrangements'}
• Professional development budget for courses and conferences
• Generous paid time off and holidays
• Modern office space with latest technology
• Team building activities and company events`,

        company_overview: `Join our innovative ${aiFormData.company_size || 'growing'} company that's making a difference in the ${aiFormData.domain} industry. We're committed to fostering a diverse and inclusive workplace where every team member can thrive and contribute to our mission of delivering exceptional solutions to our clients.

Our culture emphasizes collaboration, continuous learning, and innovation. We believe in empowering our employees to take ownership of their work and make meaningful contributions to our success.`
      }
      
      setAiGeneratedContent(generatedContent)
      setCurrentStep(2)
    } catch (error) {
      console.error('Failed to generate job content:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadExcelTemplate = () => {
    // Simulate template download
    const link = document.createElement('a')
    link.href = '/templates/job_import_template.xlsx'
    link.download = 'job_import_template.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getMethodColor = (method) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700'
    }
    return colors[method] || colors.blue
  }

  const getMethodButtonColor = (method) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700'
    }
    return colors[method] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
              <p className="text-gray-600 mt-1">Create and publish job openings for your company</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/my-jobs'}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                My Jobs
              </button>
              <button
                onClick={() => window.location.href = '/analytics'}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Method Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Job Creation Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jobCreationMethods.map((method) => {
                const Icon = method.icon
                return (
                  <div
                    key={method.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                      activeMethod === method.id 
                        ? `${getMethodColor(method.color)} border-current` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <div className="flex items-center mb-4">
                      <Icon className={`w-8 h-8 mr-3 ${
                        activeMethod === method.id 
                          ? 'text-current' 
                          : 'text-gray-400'
                      }`} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{method.title}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {method.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-2 px-4 text-white rounded-lg transition-colors ${
                        getMethodButtonColor(method.color)
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMethodSelect(method.id)
                        if (method.id !== 'manual') {
                          setCurrentStep(method.id === 'excel' ? 1 : 1)
                        } else {
                          setCurrentStep(2)
                        }
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Manual Job Creation */}
        {activeMethod === 'manual' && currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create Job Manually</h2>
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Methods
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Senior React Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remote_option"
                    checked={formData.remote_option}
                    onChange={(e) => setFormData(prev => ({ ...prev, remote_option: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <label htmlFor="remote_option" className="text-sm font-medium text-gray-700">
                    Remote work available
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, employment_type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {employmentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                  <input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="80000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
                  <input
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="120000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., React, JavaScript, Node.js, TypeScript"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <textarea
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List the key requirements and qualifications..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                <textarea
                  rows={4}
                  value={formData.responsibilities}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsibilities: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the main responsibilities and duties..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits & Perks</label>
                <textarea
                  rows={3}
                  value={formData.benefits}
                  onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Health insurance, 401k, flexible hours, remote work..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Post Job
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Excel Import */}
        {activeMethod === 'excel' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Import Jobs from Excel</h2>
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Methods
              </button>
            </div>

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Before you start</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Download our Excel template to ensure your data is formatted correctly. 
                        The template includes all required fields and examples.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={downloadExcelTemplate}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Excel Template
                  </button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your Excel file</h3>
                  <p className="text-gray-600 mb-4">
                    Choose an Excel file (.xlsx, .xls) with your job data
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleExcelUpload}
                    accept=".xlsx,.xls"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </button>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Processing your Excel file...</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && excelData.preview.length > 0 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">File processed successfully</h4>
                      <p className="text-sm text-green-700">Found {excelData.preview.length} jobs ready to import</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preview Jobs</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {excelData.preview.map((job, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.salary}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ready
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Upload Different File
                  </button>
                  <button
                    onClick={() => {
                      setLoading(true)
                      setTimeout(() => {
                        setLoading(false)
                        setSuccess(true)
                      }, 2000)
                    }}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Importing Jobs...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Import {excelData.preview.length} Jobs
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Job Creation */}
        {activeMethod === 'ai' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">AI-Powered Job Creation</h2>
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Methods
              </button>
            </div>

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Zap className="w-5 h-5 text-purple-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-purple-800">AI Job Description Generator</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Provide basic information about the role, and our AI will generate a comprehensive job description, 
                        requirements, and benefits package tailored to your industry and role level.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={aiFormData.job_title}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, job_title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Senior React Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Skill *</label>
                    <input
                      type="text"
                      required
                      value={aiFormData.primary_skill}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, primary_skill: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., React"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Skills</label>
                    <input
                      type="text"
                      value={aiFormData.secondary_skills}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, secondary_skills: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., JavaScript, Node.js"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Optional Skills</label>
                    <input
                      type="text"
                      value={aiFormData.optional_skills}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, optional_skills: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., TypeScript, GraphQL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Domain/Industry *</label>
                    <select
                      required
                      value={aiFormData.domain}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, domain: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select domain</option>
                      {domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      required
                      value={aiFormData.location}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary/Rate</label>
                    <input
                      type="number"
                      value={aiFormData.salary_min}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="80000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary/Rate</label>
                    <input
                      type="number"
                      value={aiFormData.salary_max}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="120000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <select
                      value={aiFormData.experience_level}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                    <select
                      value={aiFormData.employment_type}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, employment_type: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {employmentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select
                      value={aiFormData.company_size}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, company_size: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select company size</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ai_remote_option"
                      checked={aiFormData.remote_option}
                      onChange={(e) => setAiFormData(prev => ({ ...prev, remote_option: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                    />
                    <label htmlFor="ai_remote_option" className="text-sm font-medium text-gray-700">
                      Remote work available
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
                  <textarea
                    rows={3}
                    value={aiFormData.additional_requirements}
                    onChange={(e) => setAiFormData(prev => ({ ...prev, additional_requirements: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Any specific requirements, certifications, or preferences..."
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={handleAiGenerate}
                    disabled={loading || !aiFormData.job_title || !aiFormData.primary_skill || !aiFormData.domain || !aiFormData.location}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Generate Job Description
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && aiGeneratedContent.title && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">AI generation completed</h4>
                      <p className="text-sm text-green-700">Review and edit the generated content before posting</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={aiGeneratedContent.title}
                      onChange={(e) => setAiGeneratedContent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                    <textarea
                      rows={8}
                      value={aiGeneratedContent.description}
                      onChange={(e) => setAiGeneratedContent(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <textarea
                      rows={6}
                      value={aiGeneratedContent.requirements}
                      onChange={(e) => setAiGeneratedContent(prev => ({ ...prev, requirements: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                    <textarea
                      rows={6}
                      value={aiGeneratedContent.responsibilities}
                      onChange={(e) => setAiGeneratedContent(prev => ({ ...prev, responsibilities: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benefits & Perks</label>
                    <textarea
                      rows={5}
                      value={aiGeneratedContent.benefits}
                      onChange={(e) => setAiGeneratedContent(prev => ({ ...prev, benefits: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Overview</label>
                    <textarea
                      rows={4}
                      value={aiGeneratedContent.company_overview}
                      onChange={(e) => setAiGeneratedContent(prev => ({ ...prev, company_overview: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={() => {
                      setLoading(true)
                      setTimeout(() => {
                        setLoading(false)
                        setSuccess(true)
                      }, 2000)
                    }}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Posting Job...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Post AI-Generated Job
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your job posting has been published and is now live. Candidates can start applying immediately.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => window.location.href = '/my-jobs'}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  View My Jobs
                </button>
                <button
                  onClick={() => {
                    setSuccess(false)
                    setCurrentStep(1)
                    setActiveMethod('manual')
                  }}
                  className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Another Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostJobPage

