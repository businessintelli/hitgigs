import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Role-based access control component
 * Renders children only if user has required role/permission
 */
const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [], 
  fallback = null,
  requireAll = false 
}) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  // Check role-based access
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(user.user_type);

  // Check permission-based access
  const userPermissions = user.permissions || [];
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    (requireAll 
      ? requiredPermissions.every(permission => userPermissions.includes(permission))
      : requiredPermissions.some(permission => userPermissions.includes(permission))
    );

  if (hasRequiredRole && hasRequiredPermissions) {
    return children;
  }

  return fallback;
};

/**
 * Higher-order component for role-based access control
 */
export const withRoleGuard = (WrappedComponent, options = {}) => {
  return (props) => (
    <RoleGuard {...options}>
      <WrappedComponent {...props} />
    </RoleGuard>
  );
};

/**
 * Hook for checking user permissions
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role) => {
    return user?.user_type === role;
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.user_type);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  const isCandidate = () => hasRole('candidate');
  const isCompany = () => hasRole('company');
  const isFreelanceRecruiter = () => hasRole('freelance_recruiter');
  const isAdmin = () => hasRole('admin');

  // Company-specific role checks
  const isCompanyAdmin = () => {
    return isCompany() && (hasPermission('company.admin') || user?.company_role === 'admin');
  };

  const isCompanyManager = () => {
    return isCompany() && (
      hasPermission('company.manager') || 
      user?.company_role === 'manager' || 
      isCompanyAdmin()
    );
  };

  const isCompanyMember = () => {
    return isCompany() && (
      hasPermission('company.member') || 
      user?.company_role === 'member' || 
      isCompanyManager()
    );
  };

  // Permission checks for specific actions
  const canPostJobs = () => {
    return isCompany() || isFreelanceRecruiter() || hasPermission('jobs.create');
  };

  const canViewCandidates = () => {
    return isCompany() || isFreelanceRecruiter() || hasPermission('candidates.view');
  };

  const canManageTeam = () => {
    return isCompanyAdmin() || hasPermission('team.manage');
  };

  const canViewAnalytics = () => {
    return (isCompany() && isCompanyManager()) || 
           isFreelanceRecruiter() || 
           hasPermission('analytics.view');
  };

  const canManageCompany = () => {
    return isCompanyAdmin() || hasPermission('company.manage');
  };

  const canApplyToJobs = () => {
    return isCandidate() || hasPermission('jobs.apply');
  };

  const canViewApplications = () => {
    return isCandidate() || isCompany() || isFreelanceRecruiter() || hasPermission('applications.view');
  };

  return {
    user,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions,
    isCandidate,
    isCompany,
    isFreelanceRecruiter,
    isAdmin,
    isCompanyAdmin,
    isCompanyManager,
    isCompanyMember,
    canPostJobs,
    canViewCandidates,
    canManageTeam,
    canViewAnalytics,
    canManageCompany,
    canApplyToJobs,
    canViewApplications
  };
};

/**
 * Component for displaying role-specific content
 */
export const RoleContent = ({ role, children, fallback = null }) => {
  const { hasRole } = usePermissions();
  
  return hasRole(role) ? children : fallback;
};

/**
 * Component for displaying permission-specific content
 */
export const PermissionContent = ({ permission, children, fallback = null }) => {
  const { hasPermission } = usePermissions();
  
  return hasPermission(permission) ? children : fallback;
};

/**
 * Navigation guard for protecting routes
 */
export const NavigationGuard = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  redirectTo = '/login',
  requireAll = false 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    // Redirect to login if not authenticated
    window.location.href = redirectTo;
    return null;
  }

  return (
    <RoleGuard 
      allowedRoles={allowedRoles}
      requiredPermissions={requiredPermissions}
      requireAll={requireAll}
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </RoleGuard>
  );
};

export default RoleGuard;

