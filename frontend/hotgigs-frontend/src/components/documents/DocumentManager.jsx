import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Shield,
  FileCheck,
  Star,
  Calendar,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  TrendingUp
} from 'lucide-react';

const DocumentManager = () => {
  const { user } = useAuth();
  const { api } = useApi();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({});

  // Document types configuration
  const documentTypes = {
    resume: { label: 'Resume', icon: FileText, color: 'blue' },
    cover_letter: { label: 'Cover Letter', icon: FileText, color: 'green' },
    portfolio: { label: 'Portfolio', icon: Briefcase, color: 'purple' },
    certificate: { label: 'Certificate', icon: Award, color: 'yellow' },
    id_document: { label: 'ID Document', icon: Shield, color: 'red' },
    work_authorization: { label: 'Work Authorization', icon: FileCheck, color: 'indigo' },
    transcript: { label: 'Transcript', icon: GraduationCap, color: 'pink' },
    other: { label: 'Other', icon: FileText, color: 'gray' }
  };

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents/', {
        params: { type: filter !== 'all' ? filter : undefined }
      });
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  }, [api, filter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/documents/stats');
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch document stats:', error);
    }
  }, [api]);

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, [fetchDocuments, fetchStats]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', 'resume'); // Default to resume
    formData.append('is_primary', 'true');

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Refresh documents list
      await fetchDocuments();
      await fetchStats();

      // Show success message
      alert('Document uploaded and analyzed successfully!');
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      event.target.value = ''; // Reset file input
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await api.delete(`/documents/${documentId}`);
      await fetchDocuments();
      await fetchStats();
      setSelectedDocument(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete document');
    }
  };

  const handleReanalyze = async (documentId) => {
    try {
      setLoading(true);
      await api.post(`/documents/analyze/${documentId}`);
      await fetchDocuments();
      alert('Document re-analyzed successfully!');
    } catch (error) {
      console.error('Re-analysis failed:', error);
      alert('Re-analysis failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentCard = (doc) => {
    const docType = documentTypes[doc.document_type] || documentTypes.other;
    const IconComponent = docType.icon;

    return (
      <div
        key={doc.id}
        className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${docType.color}-500 hover:shadow-lg transition-shadow cursor-pointer`}
        onClick={() => setSelectedDocument(doc)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-${docType.color}-100 rounded-lg`}>
              <IconComponent className={`h-6 w-6 text-${docType.color}-600`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{doc.original_filename}</h3>
              <p className="text-sm text-gray-500">{docType.label}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {doc.is_primary && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
            {doc.status === 'processed' && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {doc.tampering_analysis?.tampering_detected && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(doc.upload_date).toLocaleDateString()}
          </span>
          <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
        </div>

        {doc.ai_analysis && (
          <div className="mt-3 flex items-center space-x-4 text-xs">
            {doc.ai_analysis.overall_score && (
              <span className="flex items-center text-blue-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                Score: {doc.ai_analysis.overall_score}%
              </span>
            )}
            {doc.ai_analysis.years_of_experience && (
              <span className="flex items-center text-green-600">
                <Briefcase className="h-3 w-3 mr-1" />
                {doc.ai_analysis.years_of_experience} years exp.
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderDocumentDetails = () => {
    if (!selectedDocument) {
      return (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Document</h3>
          <p className="text-gray-500">Choose a document from the list to view details and AI analysis</p>
        </div>
      );
    }

    const doc = selectedDocument;
    const docType = documentTypes[doc.document_type] || documentTypes.other;

    return (
      <div className="bg-white rounded-lg shadow-md">
        {/* Document Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 bg-${docType.color}-100 rounded-lg`}>
                <docType.icon className={`h-8 w-8 text-${docType.color}-600`} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{doc.original_filename}</h2>
                <p className="text-gray-500">{docType.label}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleReanalyze(doc.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Re-analyze with AI"
              >
                <Brain className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDeleteDocument(doc.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete document"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Document Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Upload Date:</span>
              <span className="ml-2 font-medium">{new Date(doc.upload_date).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">File Size:</span>
              <span className="ml-2 font-medium">{(doc.file_size / 1024).toFixed(1)} KB</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                doc.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {doc.status}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Primary:</span>
              <span className="ml-2 font-medium">{doc.is_primary ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {doc.ai_analysis && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI Analysis
            </h3>
            
            <div className="space-y-4">
              {/* Overall Score */}
              {doc.ai_analysis.overall_score && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-900">Overall Score</span>
                    <span className="text-2xl font-bold text-blue-600">{doc.ai_analysis.overall_score}%</span>
                  </div>
                </div>
              )}

              {/* Personal Info */}
              {doc.ai_analysis.personal_info && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Personal Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    {Object.entries(doc.ai_analysis.personal_info).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {doc.ai_analysis.skills && doc.ai_analysis.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {doc.ai_analysis.skills.slice(0, 10).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {doc.ai_analysis.skills.length > 10 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{doc.ai_analysis.skills.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Domain Expertise */}
              {doc.ai_analysis.domain_expertise && doc.ai_analysis.domain_expertise.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Domain Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {doc.ai_analysis.domain_expertise.map((domain, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {doc.ai_analysis.years_of_experience && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-900 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Years of Experience
                    </span>
                    <span className="text-xl font-bold text-green-600">{doc.ai_analysis.years_of_experience}</span>
                  </div>
                </div>
              )}

              {/* Professional Summary */}
              {doc.ai_analysis.professional_summary && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Professional Summary</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
                    {doc.ai_analysis.professional_summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tampering Analysis */}
        {doc.tampering_analysis && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Security Analysis
            </h3>
            
            <div className={`rounded-lg p-4 ${
              doc.tampering_analysis.tampering_detected 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Document Integrity</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  doc.tampering_analysis.tampering_detected
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {doc.tampering_analysis.tampering_detected ? 'Issues Detected' : 'Verified'}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{doc.tampering_analysis.details}</p>
              <div className="text-xs text-gray-500">
                Confidence: {doc.tampering_analysis.confidence}%
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Manager</h1>
        <p className="text-gray-600">Upload, manage, and analyze your documents with AI-powered insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(documentTypes).map(([type, config]) => (
          <div key={type} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className={`p-2 bg-${config.color}-100 rounded-lg mr-3`}>
                <config.icon className={`h-5 w-5 text-${config.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{config.label}</p>
                <p className="text-xl font-semibold">{stats[type] || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your documents</h3>
          <p className="text-gray-500 mb-4">Supports PDF, DOC, DOCX, and TXT files</p>
          
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
              uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } transition-colors`}
          >
            {uploading ? (
              <>
                <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Choose File
              </>
            )}
          </label>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Documents List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Documents</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Documents</option>
              {Object.entries(documentTypes).map(([type, config]) => (
                <option key={type} value={type}>{config.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(renderDocumentCard)}
            </div>
          )}
        </div>

        {/* Document Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Document Details</h2>
          {renderDocumentDetails()}
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;

