import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import CandidateDashboard from '../components/dashboard/CandidateDashboard'
import CompanyDashboard from '../components/dashboard/CompanyDashboard'
import RecruiterDashboard from '../components/dashboard/RecruiterDashboard'
import AdminDashboard from './AdminDashboard'

const DashboardPage = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="dashboard-error">
        <h2>Access Denied</h2>
        <p>Please log in to view your dashboard.</p>
      </div>
    )
  }

  // Route to appropriate dashboard based on user type
  const renderDashboard = () => {
    if (user.is_admin) {
      return <AdminDashboard />
    }

    switch (user.user_type) {
      case 'candidate':
        return <CandidateDashboard />
      case 'company':
        return <CompanyDashboard />
      case 'freelance_recruiter':
        return <RecruiterDashboard />
      default:
        return <CandidateDashboard /> // Default to candidate dashboard
    }
  }

  return (
    <div className="dashboard-page">
      {renderDashboard()}
      
      <style jsx>{`
        .dashboard-page {
          width: 100%;
          height: 100%;
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #06b6d4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .dashboard-loading p {
          color: #6b7280;
          font-size: 16px;
        }

        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          text-align: center;
        }

        .dashboard-error h2 {
          font-size: 24px;
          font-weight: 700;
          color: #ef4444;
          margin-bottom: 8px;
        }

        .dashboard-error p {
          color: #6b7280;
          font-size: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default DashboardPage

