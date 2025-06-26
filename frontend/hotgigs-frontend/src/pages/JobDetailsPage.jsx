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
  Eye
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

  useEffect(() => {
    loadJobDetails()
    if (user) {
      loadAIInsights()
    }
  }, [id, user])

  const loadJobDetails = async () => {
    try {
      // For now, show sample job details
      // In real implementation, this would fetch from API
      const sampleJob = {
        id: id,
        title: 'Senior React Developer',
        company: {
          name: 'TechCorp Inc.',
          logo: '/company-logos/techcorp.png',
          size: '1000-5000 employees',
          industry: 'Technology',
          website: 'https://techcorp.com',
          location: 'San Francisco, CA'
        },
        location: 'San Francisco, CA (Remote Available)',
        salary: '$120,000 - $180,000',
        employment_type: 'Full Time',
        experience_level: 'Senior Level (5+ years)',
        posted_date: '2024-01-15T10:00:00Z',
        deadline: '2024-02-15T23:59:59Z',
        views: 234,
        applications: 45,
        description: `We are looking for a Senior React Developer to join our growing engineering team. You will be responsible for building and maintaining high-quality web applications using modern React technologies.

## Key Responsibilities:
- Develop and maintain React-based web applications
- Collaborate with cross-functional teams to define and implement new features
- Write clean, maintainable, and efficient code
- Participate in code reviews and technical discussions
- Mentor junior developers and contribute to team knowledge sharing

## What We Offer:
- Competitive salary and equity package
- Comprehensive health, dental, and vision insurance
- Flexible work arrangements and remote options
- Professional development budget
- Modern tech stack and cutting-edge projects`,
        requirements: [
          '5+ years of experience with React and JavaScript',
          'Strong understanding of modern web technologies (HTML5, CSS3, ES6+)',
          'Experience with state management libraries (Redux, Zustand, etc.)',
          'Familiarity with testing frameworks (Jest, React Testing Library)',
          'Knowledge of build tools and CI/CD processes',
          'Excellent communication and collaboration skills'
        ],
        nice_to_have: [
          'Experience with TypeScript',
          'Knowledge of Node.js and backend technologies',
          'Familiarity with cloud platforms (AWS, GCP, Azure)',
          'Experience with mobile development (React Native)',
          'Open source contributions'
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
      // Simulate AI-powered job matching and insights
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

  const handleApply = async () => {
    if (!user) {
      navigate('/signin')
      return
    }
    
    try {
      // In real implementation, this would submit application
      setApplied(true)
    } catch (error) {
      console.error('Failed to apply:', error)
    }
  }

  const handleSave = async () => {
    if (!user) {
      navigate('/signin')
      return
    }
    
    try {
      setSaved(!saved)
      // In real implementation, this would save/unsave job
    } catch (error) {
      console.error('Failed to save job:', error)
    }
  }

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

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="container">
          <div className="loading">Loading job details...</div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="container">
          <div className="error-state">
            <h2>Job Not Found</h2>
            <p>The job you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/jobs')} className="btn btn-primary">
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="job-details-page">
      <div className="container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={16} />
          Back to Jobs
        </button>

        <div className="job-details-layout">
          {/* Main Content */}
          <div className="main-content">
            {/* Job Header */}
            <div className="job-header">
              <div className="company-logo">
                <Building size={48} />
              </div>
              
              <div className="job-info">
                <h1>{job.title}</h1>
                <div className="company-info">
                  <h2>{job.company.name}</h2>
                  <div className="job-meta">
                    <span className="meta-item">
                      <MapPin size={14} />
                      {job.location}
                    </span>
                    <span className="meta-item">
                      <DollarSign size={14} />
                      {job.salary}
                    </span>
                    <span className="meta-item">
                      <Briefcase size={14} />
                      {job.employment_type}
                    </span>
                    <span className="meta-item">
                      <GraduationCap size={14} />
                      {job.experience_level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="job-actions">
                <button 
                  onClick={handleSave}
                  className={`btn btn-outline ${saved ? 'saved' : ''}`}
                >
                  <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save Job'}
                </button>
                
                <button className="btn btn-outline">
                  <Share2 size={16} />
                  Share
                </button>
                
                <button 
                  onClick={handleApply}
                  className="btn btn-primary"
                  disabled={applied}
                >
                  <Send size={16} />
                  {applied ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>

            {/* AI Insights (for authenticated users) */}
            {user && aiInsights && (
              <div className="ai-insights">
                <div className="insights-header">
                  <Zap size={20} />
                  <h3>AI-Powered Insights</h3>
                </div>
                
                <div className="match-score">
                  <div className="score-circle">
                    <span className="score">{matchScore}%</span>
                    <span className="label">Match</span>
                  </div>
                  <div className="score-details">
                    <h4>Profile Match Score</h4>
                    <p>Based on your skills, experience, and preferences</p>
                  </div>
                </div>

                <div className="insights-grid">
                  <div className="insight-card">
                    <h4>Your Strengths</h4>
                    <ul>
                      {aiInsights.strengths.map((strength, index) => (
                        <li key={index}>
                          <CheckCircle size={14} />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="insight-card">
                    <h4>Areas to Improve</h4>
                    <ul>
                      {aiInsights.improvements.map((improvement, index) => (
                        <li key={index}>
                          <Target size={14} />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="salary-insight">
                  <h4>Salary Analysis</h4>
                  <p>Market average: {aiInsights.salaryInsight.market_average}</p>
                  <p>{aiInsights.salaryInsight.recommendation}</p>
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className="job-section">
              <h3>Job Description</h3>
              <div className="job-description">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="job-section">
              <h3>Requirements</h3>
              <ul className="requirements-list">
                {job.requirements.map((requirement, index) => (
                  <li key={index}>
                    <CheckCircle size={16} />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to Have */}
            <div className="job-section">
              <h3>Nice to Have</h3>
              <ul className="nice-to-have-list">
                {job.nice_to_have.map((item, index) => (
                  <li key={index}>
                    <Star size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="job-section">
              <h3>Benefits & Perks</h3>
              <div className="benefits-grid">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <Award size={16} />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Application Deadline */}
            <div className="sidebar-card">
              <h4>Application Deadline</h4>
              <div className="deadline-info">
                <Calendar size={16} />
                <span>{formatDate(job.deadline)}</span>
              </div>
              <div className="days-left">
                <Clock size={14} />
                {daysUntilDeadline(job.deadline)} days left
              </div>
            </div>

            {/* Job Stats */}
            <div className="sidebar-card">
              <h4>Job Statistics</h4>
              <div className="stats-list">
                <div className="stat-item">
                  <Eye size={16} />
                  <span>{job.views} views</span>
                </div>
                <div className="stat-item">
                  <Users size={16} />
                  <span>{job.applications} applications</span>
                </div>
                <div className="stat-item">
                  <Calendar size={16} />
                  <span>Posted {formatDate(job.posted_date)}</span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="sidebar-card">
              <h4>About {job.company.name}</h4>
              <div className="company-details">
                <div className="company-stat">
                  <Users size={16} />
                  <span>{job.company.size}</span>
                </div>
                <div className="company-stat">
                  <Building size={16} />
                  <span>{job.company.industry}</span>
                </div>
                <div className="company-stat">
                  <MapPin size={16} />
                  <span>{job.company.location}</span>
                </div>
              </div>
              <a 
                href={job.company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="company-website"
              >
                <ExternalLink size={14} />
                Visit Website
              </a>
            </div>

            {/* Skills */}
            <div className="sidebar-card">
              <h4>Required Skills</h4>
              <div className="skills-list">
                {job.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .job-details-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 20px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .loading, .error-state {
          text-align: center;
          padding: 80px 20px;
        }

        .error-state h2 {
          font-size: 24px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .error-state p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 24px 0;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 24px;
          padding: 8px 0;
        }

        .back-button:hover {
          color: #374151;
        }

        .job-details-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 32px;
        }

        .main-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .job-header {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .company-logo {
          background: #f3f4f6;
          border-radius: 12px;
          padding: 16px;
          color: #6b7280;
        }

        .job-info {
          flex: 1;
        }

        .job-info h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .company-info h2 {
          font-size: 20px;
          font-weight: 600;
          color: #06b6d4;
          margin: 0 0 12px 0;
        }

        .job-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .job-actions {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .ai-insights {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .insights-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .insights-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .match-score {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .score-circle {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .score {
          font-size: 24px;
          font-weight: 700;
        }

        .label {
          font-size: 12px;
          opacity: 0.8;
        }

        .score-details h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .score-details p {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .insight-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
        }

        .insight-card h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .insight-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .insight-card li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .salary-insight {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
        }

        .salary-insight h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .salary-insight p {
          font-size: 13px;
          margin: 0 0 4px 0;
        }

        .job-section {
          margin-bottom: 32px;
        }

        .job-section h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .job-description p {
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
          margin-bottom: 16px;
        }

        .requirements-list, .nice-to-have-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .requirements-list li, .nice-to-have-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 15px;
          color: #374151;
          margin-bottom: 12px;
        }

        .requirements-list svg {
          color: #10b981;
          margin-top: 2px;
        }

        .nice-to-have-list svg {
          color: #f59e0b;
          margin-top: 2px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .benefit-item svg {
          color: #06b6d4;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sidebar-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .sidebar-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .deadline-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: #374151;
          margin-bottom: 8px;
        }

        .days-left {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #ef4444;
          font-weight: 500;
        }

        .stats-list, .company-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-item, .company-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .company-website {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #06b6d4;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-top: 12px;
        }

        .company-website:hover {
          text-decoration: underline;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          border: none;
        }

        .btn-primary {
          background: #06b6d4;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0891b2;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f9fafb;
        }

        .btn-outline.saved {
          color: #ef4444;
          border-color: #ef4444;
        }

        @media (max-width: 1024px) {
          .job-details-layout {
            grid-template-columns: 1fr;
          }
          
          .job-header {
            flex-direction: column;
          }
          
          .job-actions {
            justify-content: flex-start;
          }
          
          .insights-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .job-meta {
            flex-direction: column;
            gap: 8px;
          }
          
          .job-actions {
            flex-direction: column;
          }
          
          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default JobDetailsPage