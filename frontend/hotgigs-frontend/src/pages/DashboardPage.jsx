import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import CandidateProfileManager from '../components/profile/CandidateProfileManager';
import CompanyAdminInterface from '../components/profile/CompanyAdminInterface';
import FreelanceRecruiterDashboard from '../components/profile/FreelanceRecruiterDashboard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user type
  const renderDashboard = () => {
    switch (user.user_type) {
      case 'candidate':
        return <CandidateProfileManager />;
      case 'company':
        return <CompanyAdminInterface />;
      case 'freelance_recruiter':
        return <FreelanceRecruiterDashboard />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid User Type</h2>
              <p className="text-gray-600">
                Your account type is not recognized. Please contact support.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;

