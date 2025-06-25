import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Upload, 
  FileText, 
  Download, 
  Star, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Target, 
  Zap,
  Eye,
  BarChart3,
  Award,
  RefreshCw,
  Sparkles,
  Brain,
  Search,
  Users,
  DollarSign
} from 'lucide-react'

const ResumeAnalysisPage = () => {
  const { user } = useAuth()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedJobRole, setSelectedJobRole] = useState('')
  const [analysisHistory, setAnalysisHistory] = useState([])

  // Sample job roles for analysis
  const jobRoles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX/UI Designer',
    'Marketing Manager',
    'Sales Representative',
    'DevOps Engineer',
    'Business Analyst',
    'Project Manager',
    'Full Stack Developer'
  ]

  useEffect(() => {
    // Load analysis history
    loadAnalysisHistory()
  }, [])

  const loadAnalysisHistory = () => {
    // Simulate loading analysis history
    const history = [
      {
        id: 1,
        fileName: 'john_doe_resume.pdf',
        jobRole: 'Software Engineer',
        score: 8.5,
        date: '2024-01-15',
        status: 'completed'
      },
      {
        id: 2,
        fileName: 'john_doe_resume_v2.pdf',
        jobRole: 'Full Stack Developer',
        score: 9.1,
        date: '2024-01-10',
        status: 'completed'
      }
    ]
    setAnalysisHistory(history)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && (file.type === 'application/pdf' || file.type.includes('word'))) {
      setUploadedFile(file)
      setAnalysisResult(null)
    } else {
      alert('Please upload a PDF or Word document')
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedFile || !selectedJobRole) {
      alert('Please upload a resume and select a job role')
      return
    }

    setIsAnalyzing(true)

    try {
      // Simulate analysis process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const analysis = generateAnalysisResult(uploadedFile.name, selectedJobRole)
      setAnalysisResult(analysis)
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        fileName: uploadedFile.name,
        jobRole: selectedJobRole,
        score: analysis.overallScore,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
      setAnalysisHistory(prev => [newHistoryItem, ...prev])
      
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateAnalysisResult = (fileName, jobRole) => {
    return {
      fileName,
      jobRole,
      overallScore: 8.7,
      dimensions: [
        { name: 'Skills Match', score: 9.2, weight: 25, description: 'Technical skills alignment with job requirements' },
        { name: 'Experience Relevance', score: 8.8, weight: 20, description: 'Work experience relevance to target role' },
        { name: 'Education Fit', score: 8.5, weight: 15, description: 'Educational background alignment' },
        { name: 'ATS Compatibility', score: 7.9, weight: 15, description: 'Applicant Tracking System optimization' },
        { name: 'Keyword Optimization', score: 8.1, weight: 10, description: 'Industry-specific keyword usage' },
        { name: 'Format & Structure', score: 9.0, weight: 10, description: 'Resume layout and organization' },
        { name: 'Achievement Impact', score: 8.6, weight: 5, description: 'Quantified accomplishments and results' }
      ],
      strengths: [
        'Strong technical skills in React, Node.js, and Python',
        'Quantified achievements with measurable impact',
        'Progressive career growth demonstrated',
        'Clean, professional formatting',
        'Relevant project experience showcased'
      ],
      improvements: [
        'Add more industry-specific keywords (cloud, microservices, agile)',
        'Include soft skills examples (leadership, communication)',
        'Optimize summary section for better ATS parsing',
        'Add certifications or continuous learning examples',
        'Include more recent technology stack mentions'
      ],
      keywordAnalysis: {
        present: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'API'],
        missing: ['Cloud Computing', 'Microservices', 'Agile', 'Docker', 'Kubernetes', 'CI/CD'],
        suggested: ['AWS', 'Azure', 'Scrum', 'DevOps', 'Machine Learning', 'TypeScript']
      },
      atsCompatibility: {
        score: 79,
        issues: [
          'Use standard section headers (Experience, Education, Skills)',
          'Avoid complex formatting and graphics',
          'Include phone number in standard format',
          'Use common file format (PDF preferred)'
        ]
      },
      marketInsights: {
        salaryRange: '$120,000 - $160,000',
        demandLevel: 'High',
        competitionLevel: 'Medium',
        topSkillsInDemand: ['React', 'Node.js', 'Cloud Platforms', 'Microservices']
      },
      recommendations: [
        {
          type: 'immediate',
          title: 'Add Missing Keywords',
          description: 'Include "Agile", "Microservices", and "Cloud Computing" in your skills section',
          impact: 'High'
        },
        {
          type: 'immediate',
          title: 'Optimize Summary',
          description: 'Rewrite summary to include target job title and key achievements',
          impact: 'High'
        },
        {
          type: 'short-term',
          title: 'Add Certifications',
          description: 'Consider AWS or Azure certifications to strengthen cloud skills',
          impact: 'Medium'
        },
        {
          type: 'long-term',
          title: 'Leadership Examples',
          description: 'Include examples of leading projects or mentoring team members',
          impact: 'Medium'
        }
      ]
    }
  }

  const downloadOptimizedResume = () => {
    // Simulate generating optimized resume
    alert('Optimized resume will be generated and downloaded. This feature connects to our AI optimization engine.')
  }

  const downloadAnalysisReport = () => {
    if (!analysisResult) return
    
    const reportContent = `
HotGigs.ai Resume Analysis Report
Generated: ${new Date().toLocaleDateString()}

File: ${analysisResult.fileName}
Target Role: ${analysisResult.jobRole}
Overall Score: ${analysisResult.overallScore}/10

DIMENSION SCORES:
${analysisResult.dimensions.map(d => `${d.name}: ${d.score}/10 (${d.weight}% weight)`).join('\n')}

STRENGTHS:
${analysisResult.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${analysisResult.improvements.map(i => `• ${i}`).join('\n')}

KEYWORD ANALYSIS:
Present: ${analysisResult.keywordAnalysis.present.join(', ')}
Missing: ${analysisResult.keywordAnalysis.missing.join(', ')}
Suggested: ${analysisResult.keywordAnalysis.suggested.join(', ')}

ATS COMPATIBILITY: ${analysisResult.atsCompatibility.score}%

MARKET INSIGHTS:
Salary Range: ${analysisResult.marketInsights.salaryRange}
Demand Level: ${analysisResult.marketInsights.demandLevel}
Competition: ${analysisResult.marketInsights.competitionLevel}

RECOMMENDATIONS:
${analysisResult.recommendations.map(r => `${r.title}: ${r.description} (${r.impact} Impact)`).join('\n')}
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-analysis-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score) => {
    if (score >= 9) return '#10b981'
    if (score >= 8) return '#06b6d4'
    if (score >= 7) return '#f59e0b'
    if (score >= 6) return '#ef4444'
    return '#6b7280'
  }

  const getScoreLabel = (score) => {
    if (score >= 9) return 'Excellent'
    if (score >= 8) return 'Good'
    if (score >= 7) return 'Fair'
    if (score >= 6) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="resume-analysis-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Brain size={32} />
            </div>
            <div>
              <h1>AI Resume Analysis</h1>
              <p>Get intelligent insights and optimization recommendations for your resume</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-area">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="resume-upload" className="upload-label">
                <Upload size={48} />
                <div className="upload-text">
                  <h3>Upload Your Resume</h3>
                  <p>Drag and drop or click to select a PDF or Word document</p>
                </div>
              </label>
              
              {uploadedFile && (
                <div className="uploaded-file">
                  <FileText size={20} />
                  <span>{uploadedFile.name}</span>
                  <span className="file-size">
                    ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>

            <div className="job-role-selection">
              <label htmlFor="job-role">Target Job Role</label>
              <select
                id="job-role"
                value={selectedJobRole}
                onChange={(e) => setSelectedJobRole(e.target.value)}
                className="job-role-select"
              >
                <option value="">Select a job role for targeted analysis</option>
                {jobRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!uploadedFile || !selectedJobRole || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={20} className="spinning" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="analysis-results">
            {/* Overall Score */}
            <div className="score-overview">
              <div className="score-card">
                <div className="score-circle">
                  <div className="score-value">{analysisResult.overallScore}</div>
                  <div className="score-max">/10</div>
                </div>
                <div className="score-info">
                  <h3>Overall Score</h3>
                  <p className="score-label">{getScoreLabel(analysisResult.overallScore)}</p>
                  <p className="score-description">
                    Your resume shows strong potential for the {analysisResult.jobRole} role
                  </p>
                </div>
              </div>

              <div className="quick-actions">
                <button className="action-btn primary" onClick={downloadOptimizedResume}>
                  <Download size={16} />
                  Download Optimized Resume
                </button>
                <button className="action-btn secondary" onClick={downloadAnalysisReport}>
                  <FileText size={16} />
                  Download Report
                </button>
              </div>
            </div>

            {/* Dimension Scores */}
            <div className="dimensions-section">
              <h2>Detailed Analysis</h2>
              <div className="dimensions-grid">
                {analysisResult.dimensions.map((dimension, index) => (
                  <div key={index} className="dimension-card">
                    <div className="dimension-header">
                      <h4>{dimension.name}</h4>
                      <div className="dimension-score" style={{ color: getScoreColor(dimension.score) }}>
                        {dimension.score}/10
                      </div>
                    </div>
                    <div className="dimension-bar">
                      <div 
                        className="dimension-fill"
                        style={{ 
                          width: `${dimension.score * 10}%`,
                          backgroundColor: getScoreColor(dimension.score)
                        }}
                      />
                    </div>
                    <p className="dimension-description">{dimension.description}</p>
                    <div className="dimension-weight">Weight: {dimension.weight}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="feedback-section">
              <div className="strengths-card">
                <div className="feedback-header">
                  <CheckCircle size={24} />
                  <h3>Strengths</h3>
                </div>
                <ul className="feedback-list">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="improvements-card">
                <div className="feedback-header">
                  <AlertCircle size={24} />
                  <h3>Areas for Improvement</h3>
                </div>
                <ul className="feedback-list">
                  {analysisResult.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="keyword-section">
              <h2>Keyword Analysis</h2>
              <div className="keyword-grid">
                <div className="keyword-card present">
                  <h4>Present Keywords</h4>
                  <div className="keyword-tags">
                    {analysisResult.keywordAnalysis.present.map((keyword, index) => (
                      <span key={index} className="keyword-tag present">{keyword}</span>
                    ))}
                  </div>
                </div>

                <div className="keyword-card missing">
                  <h4>Missing Keywords</h4>
                  <div className="keyword-tags">
                    {analysisResult.keywordAnalysis.missing.map((keyword, index) => (
                      <span key={index} className="keyword-tag missing">{keyword}</span>
                    ))}
                  </div>
                </div>

                <div className="keyword-card suggested">
                  <h4>Suggested Keywords</h4>
                  <div className="keyword-tags">
                    {analysisResult.keywordAnalysis.suggested.map((keyword, index) => (
                      <span key={index} className="keyword-tag suggested">{keyword}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="market-insights">
              <h2>Market Insights</h2>
              <div className="insights-grid">
                <div className="insight-card">
                  <DollarSign size={24} />
                  <div className="insight-content">
                    <h4>Salary Range</h4>
                    <p>{analysisResult.marketInsights.salaryRange}</p>
                  </div>
                </div>

                <div className="insight-card">
                  <TrendingUp size={24} />
                  <div className="insight-content">
                    <h4>Demand Level</h4>
                    <p>{analysisResult.marketInsights.demandLevel}</p>
                  </div>
                </div>

                <div className="insight-card">
                  <Users size={24} />
                  <div className="insight-content">
                    <h4>Competition</h4>
                    <p>{analysisResult.marketInsights.competitionLevel}</p>
                  </div>
                </div>

                <div className="insight-card">
                  <Target size={24} />
                  <div className="insight-content">
                    <h4>Top Skills</h4>
                    <p>{analysisResult.marketInsights.topSkillsInDemand.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="recommendations-section">
              <h2>AI Recommendations</h2>
              <div className="recommendations-list">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation-card ${rec.type}`}>
                    <div className="recommendation-header">
                      <div className="recommendation-type">{rec.type.replace('-', ' ')}</div>
                      <div className={`impact-badge ${rec.impact.toLowerCase()}`}>
                        {rec.impact} Impact
                      </div>
                    </div>
                    <h4>{rec.title}</h4>
                    <p>{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <div className="history-section">
            <h2>Analysis History</h2>
            <div className="history-list">
              {analysisHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-info">
                    <FileText size={20} />
                    <div className="history-details">
                      <h4>{item.fileName}</h4>
                      <p>{item.jobRole} • {item.date}</p>
                    </div>
                  </div>
                  <div className="history-score">
                    <div className="score-badge" style={{ backgroundColor: getScoreColor(item.score) }}>
                      {item.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .resume-analysis-page {
          padding: 0;
        }

        .page-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 24px;
          margin-bottom: 24px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .header-info h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .header-info p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .page-content {
          padding: 0 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .upload-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #e2e8f0;
        }

        .upload-card {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
          transition: all 0.2s;
        }

        .upload-area:hover {
          border-color: #06b6d4;
          background: #f0fdff;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          color: #64748b;
        }

        .upload-text h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .upload-text p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .uploaded-file {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f1f5f9;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
          color: #475569;
        }

        .file-size {
          color: #94a3b8;
          font-size: 14px;
        }

        .job-role-selection {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .job-role-selection label {
          font-size: 16px;
          font-weight: 500;
          color: #374151;
        }

        .job-role-select {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          background: white;
        }

        .job-role-select:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .analyze-btn {
          background: #06b6d4;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .analyze-btn:hover:not(:disabled) {
          background: #0891b2;
        }

        .analyze-btn:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        .analysis-results {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .score-overview {
          background: white;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .score-card {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .score-value {
          font-size: 36px;
          font-weight: 700;
        }

        .score-max {
          font-size: 16px;
          opacity: 0.8;
        }

        .score-info h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .score-label {
          font-size: 18px;
          font-weight: 600;
          color: #06b6d4;
          margin: 0 0 8px 0;
        }

        .score-description {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .quick-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          border: none;
        }

        .action-btn.primary {
          background: #06b6d4;
          color: white;
        }

        .action-btn.primary:hover {
          background: #0891b2;
        }

        .action-btn.secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .action-btn.secondary:hover {
          background: #f8fafc;
        }

        .dimensions-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #e2e8f0;
        }

        .dimensions-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 24px 0;
        }

        .dimensions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .dimension-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .dimension-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .dimension-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .dimension-score {
          font-size: 18px;
          font-weight: 700;
        }

        .dimension-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .dimension-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .dimension-description {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 8px 0;
        }

        .dimension-weight {
          font-size: 12px;
          color: #94a3b8;
        }

        .feedback-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .strengths-card, .improvements-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .feedback-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .strengths-card .feedback-header {
          color: #10b981;
        }

        .improvements-card .feedback-header {
          color: #f59e0b;
        }

        .feedback-header h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .feedback-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feedback-list li {
          padding-left: 20px;
          position: relative;
          color: #374151;
          line-height: 1.5;
        }

        .strengths-card .feedback-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .improvements-card .feedback-list li::before {
          content: '!';
          position: absolute;
          left: 0;
          color: #f59e0b;
          font-weight: bold;
        }

        .keyword-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #e2e8f0;
        }

        .keyword-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 24px 0;
        }

        .keyword-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .keyword-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .keyword-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .keyword-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .keyword-tag {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .keyword-tag.present {
          background: #dcfce7;
          color: #166534;
        }

        .keyword-tag.missing {
          background: #fef3c7;
          color: #92400e;
        }

        .keyword-tag.suggested {
          background: #dbeafe;
          color: #1e40af;
        }

        .market-insights {
          background: white;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #e2e8f0;
        }

        .market-insights h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 24px 0;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .insight-card svg {
          color: #06b6d4;
        }

        .insight-content h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .insight-content p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .recommendations-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #e2e8f0;
        }

        .recommendations-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 24px 0;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .recommendation-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .recommendation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .recommendation-type {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #64748b;
        }

        .impact-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .impact-badge.high {
          background: #dcfce7;
          color: #166534;
        }

        .impact-badge.medium {
          background: #fef3c7;
          color: #92400e;
        }

        .impact-badge.low {
          background: #e0e7ff;
          color: #3730a3;
        }

        .recommendation-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .recommendation-card p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .history-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          border: 1px solid #e2e8f0;
        }

        .history-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 24px 0;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .history-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-details h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .history-details p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .score-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .page-content {
            padding: 0 16px 16px;
          }

          .score-overview {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }

          .feedback-section {
            grid-template-columns: 1fr;
          }

          .dimensions-grid,
          .keyword-grid,
          .insights-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default ResumeAnalysisPage

