import React, { createContext, useContext } from 'react'
import axios from 'axios'

const ApiContext = createContext({})

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}

// Create axios instance with base configuration
const createApiInstance = () => {
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Add any request modifications here
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      // Handle 401 errors (token expired)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem('hotgigs_refresh_token')
          if (refreshToken) {
            const response = await axios.post(
              'http://localhost:5000/api/auth/refresh',
              {},
              {
                headers: { Authorization: `Bearer ${refreshToken}` }
              }
            )
            
            const { access_token } = response.data
            localStorage.setItem('hotgigs_token', access_token)
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`
            
            return api(originalRequest)
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('hotgigs_token')
          localStorage.removeItem('hotgigs_refresh_token')
          window.location.href = '/login'
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}

export const ApiProvider = ({ children }) => {
  const api = createApiInstance()

  // Job-related API calls
  const jobsApi = {
    getPublicJobs: (params = {}) => api.get('/jobs', { params }),
    getJobDetails: (jobId) => api.get(`/jobs/${jobId}`),
    createJob: (jobData) => api.post('/jobs', jobData),
    searchJobs: (searchParams) => api.get('/jobs', { params: searchParams }),
  }

  // User-related API calls
  const usersApi = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (profileData) => api.put('/users/profile', profileData),
    updateCandidateProfile: (candidateData) => api.put('/users/candidate-profile', candidateData),
    addExperience: (experienceData) => api.post('/users/experience', experienceData),
    addEducation: (educationData) => api.post('/users/education', educationData),
    searchUsers: (searchParams) => api.get('/users/search', { params: searchParams }),
    getUserById: (userId) => api.get(`/users/${userId}`),
  }

  // Company-related API calls
  const companiesApi = {
    createCompany: (companyData) => api.post('/companies', companyData),
    getUserCompanies: () => api.get('/companies'),
    getCompany: (companyId) => api.get(`/companies/${companyId}`),
    getCompanyMembers: (companyId) => api.get(`/companies/${companyId}/members`),
  }

  // Application-related API calls
  const applicationsApi = {
    applyToJob: (applicationData) => api.post('/applications', applicationData),
    getUserApplications: () => api.get('/applications'),
  }

  // Candidate-related API calls
  const candidatesApi = {
    searchCandidates: (searchParams) => api.get('/candidates/search', { params: searchParams }),
  }

  // AI-related API calls
  const aiApi = {
    getJobMatches: () => api.get('/ai/job-matches'),
    analyzeResume: (resumeData) => api.post('/ai/resume-analysis', resumeData),
  }

  // Notifications API calls
  const notificationsApi = {
    getNotifications: () => api.get('/notifications'),
    markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  }

  const value = {
    api,
    jobsApi,
    usersApi,
    companiesApi,
    applicationsApi,
    candidatesApi,
    aiApi,
    notificationsApi,
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}

