import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ApiProvider } from './contexts/ApiContext'
import { AuthProvider } from './contexts/AuthContext'

// Import pages
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import AboutPage from './pages/AboutPage'
import AboutUsPage from './pages/AboutUsPage'
import ContactPage from './pages/ContactPage'
import ContactUsPage from './pages/ContactUsPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import StatusDashboard from './pages/StatusDashboard'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import SavedJobsPage from './pages/SavedJobsPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import CompanyDashboard from './pages/CompanyDashboard'
import CompanyPage from './pages/CompanyPage'
import PostJobPage from './pages/PostJobPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ForCompaniesPage from './pages/ForCompaniesPage'
import ForRecruitersPage from './pages/ForRecruitersPage'
import HelpCenterPage from './pages/HelpCenterPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import AdminLogin from './pages/AdminLogin'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import InterviewsPage from './pages/InterviewsPage'
import OffersPage from './pages/OffersPage'
import CandidatesPage from './pages/CandidatesPage'
import JobManagementPage from './pages/JobManagementPage'
import ApplicantsPage from './pages/ApplicantsPage'

// Import new advanced feature pages
import AIAssistantPage from './pages/AIAssistantPage'
import ResumeAnalysisPage from './pages/ResumeAnalysisPage'
import BulkResumeUploadPage from './pages/BulkResumeUploadPage'
import TaskManagementPage from './pages/TaskManagementPage'
import PrivacySettingsPage from './pages/PrivacySettingsPage'
import AdminDashboard from './pages/AdminDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'

// Import AI-related pages
import AIInterviewPage from './pages/AIInterviewPage'
import AIJobMatchingPage from './pages/AIJobMatchingPage'
import CareerInsightsPage from './pages/CareerInsightsPage'
import SkillAssessmentPage from './pages/SkillAssessmentPage'

// Import company-related pages
import CompanyProfilePage from './pages/CompanyProfilePage'
import TeamManagementPage from './pages/TeamManagementPage'
import DataExportPage from './pages/DataExportPage'
import MyJobsPage from './pages/MyJobsPage'
import AnalyticsPage from './pages/AnalyticsPage'

// Import components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import DashboardLayout from './components/layout/DashboardLayout'

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = requireAdmin 
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('authToken')
  
  const userData = requireAdmin
    ? localStorage.getItem('adminUser')
    : localStorage.getItem('user')

  if (!token || !userData) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/signin"} replace />
  }

  if (requireAdmin) {
    try {
      const user = JSON.parse(userData)
      if (!user.is_admin) {
        return <Navigate to="/admin/login" replace />
      }
    } catch (error) {
      console.error('Error parsing admin user data:', error)
      return <Navigate to="/admin/login" replace />
    }
  }

  return children
}

// Layout Component
const Layout = ({ children, hideNavFooter = false }) => {
  if (hideNavFooter) {
    return children
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes with navigation */}
              <Route path="/" element={
                <Layout>
                  <HomePage />
                </Layout>
              } />
              
              <Route path="/jobs" element={
                <DashboardLayout>
                  <JobsPage />
                </DashboardLayout>
              } />
              
              <Route path="/about" element={
                <Layout>
                  <AboutPage />
                </Layout>
              } />
              
              <Route path="/contact" element={
                <Layout>
                  <ContactPage />
                </Layout>
              } />
              
              <Route path="/status" element={
                <Layout>
                  <StatusDashboard />
                </Layout>
              } />

              <Route path="/saved-jobs" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SavedJobsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/my-applications" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MyApplicationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/company-dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CompanyDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/post-job" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PostJobPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/applications" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ApplicationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Advanced Feature Routes */}
              <Route path="/ai-assistant" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AIAssistantPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/resume-analysis" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ResumeAnalysisPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/bulk-resume-upload" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BulkResumeUploadPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/task-management" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <TaskManagementPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* AI-Powered Feature Routes */}
              <Route path="/ai-interview" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AIInterviewPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/ai-matching" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AIJobMatchingPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/career-insights" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CareerInsightsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/skill-assessment" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SkillAssessmentPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Company Management Routes */}
              <Route path="/company-profile" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CompanyProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/team-management" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <TeamManagementPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/data-export" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DataExportPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/my-jobs" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MyJobsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/analytics" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AnalyticsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/notifications" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NotificationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/interviews" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <InterviewsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/offers" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <OffersPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/candidates" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CandidatesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/job-management" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <JobManagementPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/applicants" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ApplicantsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/privacy-settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PrivacySettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Main Dashboard Route */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Profile and User Management */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Job Related Pages */}
              <Route path="/jobs/:id" element={
                <Layout>
                  <JobDetailsPage />
                </Layout>
              } />

              {/* Company Pages */}
              <Route path="/companies/:id" element={
                <Layout>
                  <CompanyPage />
                </Layout>
              } />

              <Route path="/for-companies" element={
                <Layout>
                  <ForCompaniesPage />
                </Layout>
              } />

              <Route path="/for-recruiters" element={
                <Layout>
                  <ForRecruitersPage />
                </Layout>
              } />

              {/* Support and Legal Pages */}
              <Route path="/help" element={
                <Layout>
                  <HelpCenterPage />
                </Layout>
              } />

              <Route path="/privacy" element={
                <Layout>
                  <PrivacyPolicyPage />
                </Layout>
              } />

              <Route path="/terms" element={
                <Layout>
                  <TermsOfServicePage />
                </Layout>
              } />

              <Route path="/about-us" element={
                <Layout>
                  <AboutUsPage />
                </Layout>
              } />

              <Route path="/contact-us" element={
                <Layout>
                  <ContactUsPage />
                </Layout>
              } />

              {/* Super Admin Route */}
              <Route path="/super-admin" element={
                <Layout>
                  <ProtectedRoute requireAdmin={true}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                </Layout>
              } />

              {/* Authentication routes without navigation */}
              <Route path="/signin" element={
                <Layout hideNavFooter={true}>
                  <SignInPage />
                </Layout>
              } />
              
              <Route path="/signup" element={
                <Layout hideNavFooter={true}>
                  <SignUpPage />
                </Layout>
              } />

              {/* Admin routes without navigation */}
              <Route path="/admin/login" element={
                <Layout hideNavFooter={true}>
                  <AdminLogin />
                </Layout>
              } />
              
              <Route path="/admin/dashboard" element={
                <Layout hideNavFooter={true}>
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                </Layout>
              } />

              {/* Legacy admin route redirect */}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

              {/* 404 route */}
              <Route path="*" element={
                <Layout>
                  <div className="not-found">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/">Go back to home</a>
                  </div>
                </Layout>
              } />
            </Routes>
          </div>

          <style jsx>{`
            .App {
              min-height: 100vh;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .not-found {
              min-height: 60vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 40px 20px;
            }

            .not-found h1 {
              font-size: 48px;
              font-weight: 700;
              color: #1f2937;
              margin: 0 0 16px 0;
            }

            .not-found p {
              font-size: 18px;
              color: #6b7280;
              margin: 0 0 24px 0;
            }

            .not-found a {
              background: linear-gradient(135deg, #06b6d4, #0891b2);
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              transition: all 0.2s;
            }

            .not-found a:hover {
              transform: translateY(-1px);
              box-shadow: 0 8px 16px rgba(6, 182, 212, 0.3);
            }
          `}</style>
        </Router>
      </AuthProvider>
    </ApiProvider>
  )
}

export default App

