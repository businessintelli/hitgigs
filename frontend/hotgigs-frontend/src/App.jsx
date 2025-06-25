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
import AdminDashboard from './pages/AdminDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'

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
                <Layout>
                  <JobsPage />
                </Layout>
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

