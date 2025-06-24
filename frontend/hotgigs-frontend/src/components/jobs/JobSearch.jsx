import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Building, 
  Calendar,
  Eye,
  Heart,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Briefcase,
  Star
} from 'lucide-react';

const JobSearch = () => {
  const { user } = useAuth();
  const { api } = useApi();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [remoteType, setRemoteType] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    searchJobs();
  }, [currentPage, sortBy, sortOrder]);

  useEffect(() => {
    if (user) {
      loadSavedJobs();
    }
  }, [user]);

  const searchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sort_by: sortBy,
        sort_order: sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (location) params.append('location', location);
      if (jobType) params.append('job_type', jobType);
      if (experienceLevel) params.append('experience_level', experienceLevel);
      if (remoteType) params.append('remote_type', remoteType);
      if (salaryMin) params.append('salary_min', salaryMin);
      if (salaryMax) params.append('salary_max', salaryMax);

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalJobs(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Failed to search jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const response = await api.get('/candidates/saved-jobs');
      setSavedJobs(new Set(response.data.saved_jobs?.map(job => job.id) || []));
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    searchJobs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setRemoteType('');
    setSalaryMin('');
    setSalaryMax('');
    setCurrentPage(1);
    searchJobs();
  };

  const toggleSaveJob = async (jobId) => {
    if (!user) {
      alert('Please log in to save jobs');
      return;
    }

    try {
      if (savedJobs.has(jobId)) {
        await api.delete(`/candidates/saved-jobs/${jobId}`);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await api.post('/candidates/saved-jobs', { job_id: jobId });
        setSavedJobs(prev => new Set([...prev, jobId]));
      }
    } catch (error) {
      console.error('Failed to toggle saved job:', error);
    }
  };

  const applyToJob = async (jobId) => {
    if (!user) {
      alert('Please log in to apply for jobs');
      return;
    }

    try {
      await api.post('/applications', { job_id: jobId });
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply to job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    return `Up to ${currency} ${max.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
        <p className="text-gray-600">Discover opportunities that match your skills and aspirations</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remote Type</label>
                <select
                  value={remoteType}
                  onChange={(e) => setRemoteType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="salary_min-desc">Highest Salary</option>
                  <option value="salary_min-asc">Lowest Salary</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                <input
                  type="number"
                  placeholder="e.g. 100000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear all filters
              </button>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">
            {loading ? 'Searching...' : `${totalJobs.toLocaleString()} jobs found`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-4">
          {jobs.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${
                  selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {job.companies?.logo_url && (
                        <img
                          src={job.companies.logo_url}
                          alt={job.companies.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                          {job.title}
                        </h3>
                        <p className="text-gray-600">{job.companies?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.job_type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.experience_level}
                      </div>
                      {job.remote_type !== 'on-site' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {job.remote_type}
                        </span>
                      )}
                      {job.is_featured && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {job.description?.substring(0, 150)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(job.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {job.view_count || 0} views
                        </div>
                      </div>
                    </div>

                    {job.skills_required && job.skills_required.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills_required.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills_required.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{job.skills_required.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {user && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          savedJobs.has(job.id)
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                        title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
                      >
                        <Heart className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Job Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedJob ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                {selectedJob.companies?.logo_url && (
                  <img
                    src={selectedJob.companies.logo_url}
                    alt={selectedJob.companies.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-gray-600">{selectedJob.companies?.name}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {selectedJob.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  {selectedJob.job_type} • {selectedJob.experience_level}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  {formatSalary(selectedJob.salary_min, selectedJob.salary_max, selectedJob.salary_currency)}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-4 w-4" />
                  {selectedJob.remote_type}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {selectedJob.skills_required && selectedJob.skills_required.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => applyToJob(selectedJob.id)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => toggleSaveJob(selectedJob.id)}
                      className={`w-full py-3 rounded-lg font-medium border ${
                        savedJobs.has(selectedJob.id)
                          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {savedJobs.has(selectedJob.id) ? 'Remove from Saved' : 'Save Job'}
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-3">Sign in to apply for this job</p>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                      Sign In to Apply
                    </button>
                  </div>
                )}
                
                {selectedJob.companies?.website_url && (
                  <button
                    onClick={() => window.open(selectedJob.companies.website_url, '_blank')}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Company Website
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Job</h3>
              <p className="text-gray-600">Click on a job listing to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;

