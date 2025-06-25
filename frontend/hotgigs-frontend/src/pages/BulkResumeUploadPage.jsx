import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Database,
  FolderOpen,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Edit,
  MoreVertical,
  CloudUpload,
  HardDrive,
  Link,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react'

const BulkResumeUploadPage = () => {
  const { user } = useAuth()
  const [uploadMethod, setUploadMethod] = useState('local') // local, google-drive, dropbox, s3
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [processingQueue, setProcessingQueue] = useState([])
  const [processedResumes, setProcessedResumes] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const fileInputRef = useRef(null)
  const folderInputRef = useRef(null)

  // Processing settings
  const [processingSettings, setProcessingSettings] = useState({
    autoAnalyze: true,
    extractSkills: true,
    detectDomain: true,
    validateDocuments: true,
    generateSummary: true,
    matchJobs: true,
    batchSize: 50,
    priority: 'normal'
  })

  useEffect(() => {
    // Load existing processed resumes
    loadProcessedResumes()
  }, [])

  const loadProcessedResumes = () => {
    // Simulate loading processed resumes from database
    const sampleResumes = [
      {
        id: 1,
        fileName: 'john_doe_resume.pdf',
        candidateName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        experience: '5 years',
        domain: 'Technology',
        status: 'processed',
        score: 8.5,
        uploadDate: '2024-01-15',
        processedDate: '2024-01-15',
        jobMatches: 12
      },
      {
        id: 2,
        fileName: 'jane_smith_cv.docx',
        candidateName: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0124',
        skills: ['Product Management', 'Agile', 'Analytics', 'Strategy'],
        experience: '8 years',
        domain: 'Business',
        status: 'processed',
        score: 9.2,
        uploadDate: '2024-01-14',
        processedDate: '2024-01-14',
        jobMatches: 8
      },
      {
        id: 3,
        fileName: 'mike_johnson_resume.pdf',
        candidateName: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        phone: '+1-555-0125',
        skills: ['Data Science', 'Machine Learning', 'Python', 'SQL'],
        experience: '6 years',
        domain: 'Technology',
        status: 'processing',
        score: null,
        uploadDate: '2024-01-16',
        processedDate: null,
        jobMatches: null
      }
    ]
    setProcessedResumes(sampleResumes)
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    processFiles(files)
  }

  const handleFolderUpload = (event) => {
    const files = Array.from(event.target.files)
    processFiles(files)
  }

  const processFiles = (files) => {
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.includes('word') ||
      file.type.includes('document') ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx')
    )

    if (validFiles.length !== files.length) {
      alert(`${files.length - validFiles.length} files were skipped (unsupported format)`)
    }

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      status: 'uploaded',
      progress: 0,
      uploadDate: new Date().toISOString()
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const startBulkProcessing = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload files first')
      return
    }

    setIsProcessing(true)
    setUploadProgress(0)

    const filesToProcess = uploadedFiles.filter(f => f.status === 'uploaded')
    const batchSize = processingSettings.batchSize

    for (let i = 0; i < filesToProcess.length; i += batchSize) {
      const batch = filesToProcess.slice(i, i + batchSize)
      
      // Process batch
      await processBatch(batch)
      
      // Update progress
      const progress = Math.min(((i + batchSize) / filesToProcess.length) * 100, 100)
      setUploadProgress(progress)
    }

    setIsProcessing(false)
    setUploadProgress(100)
    
    // Reload processed resumes
    setTimeout(() => {
      loadProcessedResumes()
      setUploadProgress(0)
    }, 1000)
  }

  const processBatch = async (batch) => {
    // Simulate processing each file in the batch
    for (const fileItem of batch) {
      // Update file status to processing
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'processing', progress: 0 }
            : f
        )
      )

      // Simulate processing steps
      const steps = [
        'Extracting text...',
        'Analyzing content...',
        'Extracting skills...',
        'Detecting domain...',
        'Validating documents...',
        'Generating summary...',
        'Matching jobs...',
        'Saving to database...'
      ]

      for (let step = 0; step < steps.length; step++) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const progress = ((step + 1) / steps.length) * 100
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileItem.id 
              ? { ...f, progress, currentStep: steps[step] }
              : f
          )
        )
      }

      // Mark as completed
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'completed', progress: 100, currentStep: 'Completed' }
            : f
        )
      )
    }
  }

  const connectGoogleDrive = () => {
    // Simulate Google Drive connection
    alert('Google Drive integration would be implemented here. This would allow importing resumes from specified folders.')
  }

  const connectDropbox = () => {
    // Simulate Dropbox connection
    alert('Dropbox integration would be implemented here.')
  }

  const connectS3 = () => {
    // Simulate AWS S3 connection
    alert('AWS S3 integration would be implemented here for enterprise customers.')
  }

  const exportResults = () => {
    const exportData = processedResumes.map(resume => ({
      'Candidate Name': resume.candidateName,
      'Email': resume.email,
      'Phone': resume.phone,
      'Skills': resume.skills.join(', '),
      'Experience': resume.experience,
      'Domain': resume.domain,
      'Score': resume.score,
      'Job Matches': resume.jobMatches,
      'Upload Date': resume.uploadDate,
      'Status': resume.status
    }))

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulk-resume-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const clearCompleted = () => {
    setUploadedFiles(prev => prev.filter(f => f.status !== 'completed'))
  }

  const filteredResumes = processedResumes.filter(resume => {
    const matchesSearch = resume.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterStatus === 'all' || resume.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded': return <Clock size={16} className="text-blue-500" />
      case 'processing': return <RefreshCw size={16} className="text-yellow-500 animate-spin" />
      case 'completed': return <CheckCircle size={16} className="text-green-500" />
      case 'error': return <AlertCircle size={16} className="text-red-500" />
      default: return <FileText size={16} className="text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processed': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bulk-upload-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <CloudUpload size={32} />
            </div>
            <div>
              <h1>Bulk Resume Upload & Management</h1>
              <p>Upload, process, and manage thousands of resumes with AI-powered analysis</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-value">{processedResumes.length}</div>
              <div className="stat-label">Total Resumes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{uploadedFiles.filter(f => f.status === 'processing').length}</div>
              <div className="stat-label">Processing</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{processedResumes.filter(r => r.status === 'processed').length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Upload Methods */}
        <div className="upload-methods">
          <div className="method-tabs">
            <button 
              className={`method-tab ${uploadMethod === 'local' ? 'active' : ''}`}
              onClick={() => setUploadMethod('local')}
            >
              <HardDrive size={20} />
              Local Upload
            </button>
            <button 
              className={`method-tab ${uploadMethod === 'google-drive' ? 'active' : ''}`}
              onClick={() => setUploadMethod('google-drive')}
            >
              <CloudUpload size={20} />
              Google Drive
            </button>
            <button 
              className={`method-tab ${uploadMethod === 'dropbox' ? 'active' : ''}`}
              onClick={() => setUploadMethod('dropbox')}
            >
              <CloudUpload size={20} />
              Dropbox
            </button>
            <button 
              className={`method-tab ${uploadMethod === 's3' ? 'active' : ''}`}
              onClick={() => setUploadMethod('s3')}
            >
              <Database size={20} />
              AWS S3
            </button>
          </div>

          {/* Upload Interface */}
          <div className="upload-interface">
            {uploadMethod === 'local' && (
              <div className="local-upload">
                <div className="upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <input
                    type="file"
                    ref={folderInputRef}
                    webkitdirectory=""
                    onChange={handleFolderUpload}
                    style={{ display: 'none' }}
                  />
                  
                  <div className="upload-options">
                    <button 
                      className="upload-btn primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={20} />
                      Upload Files
                    </button>
                    <button 
                      className="upload-btn secondary"
                      onClick={() => folderInputRef.current?.click()}
                    >
                      <FolderOpen size={20} />
                      Upload Folder
                    </button>
                  </div>
                  
                  <div className="upload-info">
                    <p>Supported formats: PDF, DOC, DOCX</p>
                    <p>Maximum file size: 10MB per file</p>
                    <p>Recommended: Up to 1000 files per batch</p>
                  </div>
                </div>
              </div>
            )}

            {uploadMethod === 'google-drive' && (
              <div className="cloud-upload">
                <div className="cloud-connect">
                  <CloudUpload size={48} />
                  <h3>Connect to Google Drive</h3>
                  <p>Import resumes from your Google Drive folders</p>
                  <button className="connect-btn" onClick={connectGoogleDrive}>
                    <Link size={16} />
                    Connect Google Drive
                  </button>
                </div>
              </div>
            )}

            {uploadMethod === 'dropbox' && (
              <div className="cloud-upload">
                <div className="cloud-connect">
                  <CloudUpload size={48} />
                  <h3>Connect to Dropbox</h3>
                  <p>Import resumes from your Dropbox folders</p>
                  <button className="connect-btn" onClick={connectDropbox}>
                    <Link size={16} />
                    Connect Dropbox
                  </button>
                </div>
              </div>
            )}

            {uploadMethod === 's3' && (
              <div className="cloud-upload">
                <div className="cloud-connect">
                  <Database size={48} />
                  <h3>Connect to AWS S3</h3>
                  <p>Import resumes from your S3 buckets</p>
                  <button className="connect-btn" onClick={connectS3}>
                    <Link size={16} />
                    Connect AWS S3
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Processing Controls */}
        {uploadedFiles.length > 0 && (
          <div className="processing-controls">
            <div className="controls-header">
              <h2>Processing Queue ({uploadedFiles.length} files)</h2>
              <div className="controls-actions">
                <button 
                  className="btn secondary"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button 
                  className="btn secondary"
                  onClick={clearCompleted}
                >
                  <Trash2 size={16} />
                  Clear Completed
                </button>
                <button 
                  className="btn primary"
                  onClick={startBulkProcessing}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Start Processing
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Processing Settings */}
            {showSettings && (
              <div className="processing-settings">
                <h3>Processing Settings</h3>
                <div className="settings-grid">
                  <label className="setting-item">
                    <input
                      type="checkbox"
                      checked={processingSettings.autoAnalyze}
                      onChange={(e) => setProcessingSettings(prev => ({
                        ...prev,
                        autoAnalyze: e.target.checked
                      }))}
                    />
                    Auto-analyze resumes
                  </label>
                  <label className="setting-item">
                    <input
                      type="checkbox"
                      checked={processingSettings.extractSkills}
                      onChange={(e) => setProcessingSettings(prev => ({
                        ...prev,
                        extractSkills: e.target.checked
                      }))}
                    />
                    Extract skills automatically
                  </label>
                  <label className="setting-item">
                    <input
                      type="checkbox"
                      checked={processingSettings.detectDomain}
                      onChange={(e) => setProcessingSettings(prev => ({
                        ...prev,
                        detectDomain: e.target.checked
                      }))}
                    />
                    Detect domain expertise
                  </label>
                  <label className="setting-item">
                    <input
                      type="checkbox"
                      checked={processingSettings.validateDocuments}
                      onChange={(e) => setProcessingSettings(prev => ({
                        ...prev,
                        validateDocuments: e.target.checked
                      }))}
                    />
                    Validate document authenticity
                  </label>
                  <label className="setting-item">
                    <input
                      type="checkbox"
                      checked={processingSettings.generateSummary}
                      onChange={(e) => setProcessingSettings(prev => ({
                        ...prev,
                        generateSummary: e.target.checked
                      }))}
                    />
                    Generate AI summaries
                  </label>
                  <label className="setting-item">
                    <input
                      type="checkbox"
                      checked={processingSettings.matchJobs}
                      onChange={(e) => setProcessingSettings(prev => ({
                        ...prev,
                        matchJobs: e.target.checked
                      }))}
                    />
                    Match with open jobs
                  </label>
                </div>
                <div className="settings-row">
                  <label>
                    Batch Size:
                    <select
                      value={processingSettings.batchSize}
                      onChange={(e) => setProcessingSettings(prev => ({
                        ...prev,
                        batchSize: parseInt(e.target.value)
                      }))}
                    >
                      <option value={10}>10 files</option>
                      <option value={25}>25 files</option>
                      <option value={50}>50 files</option>
                      <option value={100}>100 files</option>
                    </select>
                  </label>
                  <label>
                    Priority:
                    <select
                      value={processingSettings.priority}
                      onChange={(e) => setProcessingSettings(prev => ({
                        ...prev,
                        priority: e.target.value
                      }))}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <div className="progress-section">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="progress-text">
                  Processing: {Math.round(uploadProgress)}% complete
                </div>
              </div>
            )}

            {/* File Queue */}
            <div className="file-queue">
              {uploadedFiles.map((fileItem) => (
                <div key={fileItem.id} className="queue-item">
                  <div className="file-info">
                    <FileText size={20} />
                    <div className="file-details">
                      <div className="file-name">{fileItem.name}</div>
                      <div className="file-meta">
                        {(fileItem.size / 1024 / 1024).toFixed(2)} MB
                        {fileItem.currentStep && (
                          <span className="current-step"> • {fileItem.currentStep}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="file-status">
                    {getStatusIcon(fileItem.status)}
                    <span className={`status-badge ${getStatusColor(fileItem.status)}`}>
                      {fileItem.status}
                    </span>
                    {fileItem.status === 'processing' && (
                      <div className="mini-progress">
                        <div 
                          className="mini-progress-fill"
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => deleteFile(fileItem.id)}
                      disabled={fileItem.status === 'processing'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processed Resumes */}
        <div className="processed-section">
          <div className="section-header">
            <h2>Processed Resumes</h2>
            <div className="section-actions">
              <div className="search-filter">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="processed">Processed</option>
                  <option value="processing">Processing</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <button className="btn secondary" onClick={exportResults}>
                <Download size={16} />
                Export Results
              </button>
            </div>
          </div>

          <div className="resumes-table">
            <div className="table-header">
              <div className="col-candidate">Candidate</div>
              <div className="col-contact">Contact</div>
              <div className="col-skills">Skills</div>
              <div className="col-experience">Experience</div>
              <div className="col-domain">Domain</div>
              <div className="col-score">Score</div>
              <div className="col-matches">Matches</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>
            
            {filteredResumes.map((resume) => (
              <div key={resume.id} className="table-row">
                <div className="col-candidate">
                  <div className="candidate-info">
                    <div className="candidate-name">{resume.candidateName}</div>
                    <div className="file-name">{resume.fileName}</div>
                  </div>
                </div>
                <div className="col-contact">
                  <div className="contact-info">
                    <div>{resume.email}</div>
                    <div>{resume.phone}</div>
                  </div>
                </div>
                <div className="col-skills">
                  <div className="skills-list">
                    {resume.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                    {resume.skills.length > 3 && (
                      <span className="skill-more">+{resume.skills.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="col-experience">{resume.experience}</div>
                <div className="col-domain">{resume.domain}</div>
                <div className="col-score">
                  {resume.score ? (
                    <div className="score-badge" style={{ 
                      backgroundColor: resume.score >= 8 ? '#10b981' : resume.score >= 6 ? '#f59e0b' : '#ef4444',
                      color: 'white'
                    }}>
                      {resume.score}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="col-matches">
                  {resume.jobMatches ? (
                    <span className="matches-count">{resume.jobMatches} jobs</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="col-status">
                  <span className={`status-badge ${getStatusColor(resume.status)}`}>
                    {resume.status}
                  </span>
                </div>
                <div className="col-actions">
                  <button className="action-btn" title="View Resume">
                    <Eye size={14} />
                  </button>
                  <button className="action-btn" title="Edit Details">
                    <Edit size={14} />
                  </button>
                  <button className="action-btn" title="More Options">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bulk-upload-page {
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
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
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

        .header-stats {
          display: flex;
          gap: 24px;
        }

        .stat-card {
          text-align: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .page-content {
          padding: 0 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .upload-methods {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .method-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
        }

        .method-tab {
          flex: 1;
          padding: 16px 24px;
          border: none;
          background: #f8fafc;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .method-tab.active {
          background: white;
          color: #06b6d4;
          border-bottom: 2px solid #06b6d4;
        }

        .method-tab:hover:not(.active) {
          background: #f1f5f9;
        }

        .upload-interface {
          padding: 32px;
        }

        .local-upload {
          text-align: center;
        }

        .upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 48px 24px;
          transition: all 0.2s;
        }

        .upload-area:hover {
          border-color: #06b6d4;
          background: #f0fdff;
        }

        .upload-options {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .upload-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          border: none;
        }

        .upload-btn.primary {
          background: #06b6d4;
          color: white;
        }

        .upload-btn.primary:hover {
          background: #0891b2;
        }

        .upload-btn.secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .upload-btn.secondary:hover {
          background: #f8fafc;
        }

        .upload-info {
          color: #64748b;
          font-size: 14px;
        }

        .upload-info p {
          margin: 4px 0;
        }

        .cloud-upload {
          text-align: center;
        }

        .cloud-connect {
          padding: 48px 24px;
          color: #64748b;
        }

        .cloud-connect h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 16px 0 8px 0;
        }

        .cloud-connect p {
          margin: 0 0 24px 0;
        }

        .connect-btn {
          background: #06b6d4;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .connect-btn:hover {
          background: #0891b2;
        }

        .processing-controls {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
        }

        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .controls-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .controls-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          border: none;
        }

        .btn.primary {
          background: #06b6d4;
          color: white;
        }

        .btn.primary:hover:not(:disabled) {
          background: #0891b2;
        }

        .btn.secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .btn.secondary:hover {
          background: #f8fafc;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .processing-settings {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
        }

        .processing-settings h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }

        .settings-row {
          display: flex;
          gap: 24px;
        }

        .settings-row label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
        }

        .settings-row select {
          padding: 4px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
        }

        .progress-section {
          margin-bottom: 24px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: #06b6d4;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 14px;
          color: #64748b;
          text-align: center;
        }

        .file-queue {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .queue-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .file-details {
          flex: 1;
        }

        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
        }

        .file-meta {
          font-size: 12px;
          color: #64748b;
        }

        .current-step {
          color: #06b6d4;
        }

        .file-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .mini-progress {
          width: 60px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .mini-progress-fill {
          height: 100%;
          background: #06b6d4;
          transition: width 0.3s ease;
        }

        .delete-btn {
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .delete-btn:hover:not(:disabled) {
          background: #fef2f2;
        }

        .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .processed-section {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .section-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .search-filter {
          display: flex;
          gap: 12px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-box svg {
          position: absolute;
          left: 12px;
          color: #64748b;
        }

        .search-box input {
          padding: 8px 12px 8px 36px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          width: 250px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .resumes-table {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 2fr 1fr 1fr 0.8fr 0.8fr 1fr 1fr;
          background: #f8fafc;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e2e8f0;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 2fr 1fr 1fr 0.8fr 0.8fr 1fr 1fr;
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
        }

        .table-row:hover {
          background: #f8fafc;
        }

        .candidate-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .candidate-name {
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
        }

        .file-name {
          font-size: 12px;
          color: #64748b;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12px;
          color: #64748b;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .skill-tag {
          background: #e0f2fe;
          color: #0891b2;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;
        }

        .skill-more {
          color: #64748b;
          font-size: 11px;
        }

        .score-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
        }

        .matches-count {
          font-size: 12px;
          color: #06b6d4;
          font-weight: 500;
        }

        .col-actions {
          display: flex;
          gap: 4px;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f1f5f9;
          color: #374151;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1200px) {
          .table-header,
          .table-row {
            grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 0.8fr 1fr;
          }

          .col-matches,
          .col-domain {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .page-content {
            padding: 0 16px 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .header-stats {
            width: 100%;
            justify-content: space-between;
          }

          .method-tabs {
            flex-direction: column;
          }

          .controls-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .search-filter {
            flex-direction: column;
            width: 100%;
          }

          .search-box input {
            width: 100%;
          }

          .resumes-table {
            overflow-x: auto;
          }

          .table-header,
          .table-row {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  )
}

export default BulkResumeUploadPage

