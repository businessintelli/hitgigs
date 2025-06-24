import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import JobPostingManager from '../jobs/JobPostingManager';
import { 
  Building2, 
  Users, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  X,
  Plus,
  Trash2,
  UserPlus,
  Settings,
  BarChart3,
  Briefcase,
  Star,
  Calendar,
  DollarSign,
  Target,
  Award,
  FileText,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';

const CompanyAdminInterface = () => {
  const { user } = useAuth();
  const { apiCall } = useApi();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/companies/${user.company_id}`, 'GET');
      setCompany(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/companies/${user.company_id}`, 'PUT', formData);
      setCompany(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(company);
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { id: 'overview', label: 'Company Overview', icon: Building2 },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              {company?.name?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company?.name}</h1>
              <p className="text-gray-600">{company?.industry}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                {company?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company?.website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{company.website}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{company?.employee_count || 0} employees</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Company</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <CompanyOverviewTab 
              company={company} 
              formData={formData} 
              editing={editing} 
              onChange={handleInputChange} 
            />
          )}
          {activeTab === 'team' && (
            <TeamManagementTab 
              companyId={company?.id}
            />
          )}
          {activeTab === 'jobs' && (
            <JobPostingsTab 
              companyId={company?.id}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab 
              companyId={company?.id}
            />
          )}
          {activeTab === 'settings' && (
            <CompanySettingsTab 
              company={company} 
              formData={formData} 
              editing={editing} 
              onChange={handleInputChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Company Overview Tab Component
const CompanyOverviewTab = ({ company, formData, editing, onChange }) => {
  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => onChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{company?.name || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => onChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{company?.industry || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              {editing ? (
                <select
                  value={formData.size || ''}
                  onChange={(e) => onChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              ) : (
                <p className="text-gray-900">{company?.size || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Founded Year
              </label>
              {editing ? (
                <input
                  type="number"
                  value={formData.founded_year || ''}
                  onChange={(e) => onChange('founded_year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{company?.founded_year || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => onChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{company?.website || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => onChange('location', e.target.value)}
                  placeholder="City, State, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{company?.location || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Company Description</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About the Company
            </label>
            {editing ? (
              <textarea
                value={formData.description || ''}
                onChange={(e) => onChange('description', e.target.value)}
                rows={8}
                placeholder="Describe your company, mission, values, and culture..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{company?.description || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Culture & Values
            </label>
            {editing ? (
              <textarea
                value={formData.culture || ''}
                onChange={(e) => onChange('culture', e.target.value)}
                rows={4}
                placeholder="Describe your company culture and core values..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{company?.culture || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{company?.active_jobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{company?.total_applications || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hired</p>
              <p className="text-2xl font-bold text-gray-900">{company?.total_hired || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{company?.success_rate || 0}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Management Tab Component
const TeamManagementTab = ({ companyId }) => {
  const { apiCall } = useApi();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'member' });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/companies/${companyId}/team`, 'GET');
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const inviteTeamMember = async () => {
    try {
      await apiCall(`/companies/${companyId}/team/invite`, 'POST', inviteData);
      setShowInviteModal(false);
      setInviteData({ email: '', role: 'member' });
      fetchTeamMembers();
    } catch (error) {
      console.error('Error inviting team member:', error);
    }
  };

  const removeTeamMember = async (memberId) => {
    try {
      await apiCall(`/companies/${companyId}/team/${memberId}`, 'DELETE');
      fetchTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
    }
  };

  const updateMemberRole = async (memberId, newRole) => {
    try {
      await apiCall(`/companies/${companyId}/team/${memberId}`, 'PUT', { role: newRole });
      fetchTeamMembers();
    } catch (error) {
      console.error('Error updating member role:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
            <div>Member</div>
            <div>Role</div>
            <div>Joined</div>
            <div>Actions</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <div key={member.id} className="px-6 py-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {member.first_name?.[0]}{member.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.first_name} {member.last_name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div>
                  <select
                    value={member.role}
                    onChange={(e) => updateMemberRole(member.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="member">Member</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(member.joined_at).toLocaleDateString()}
                </div>
                <div>
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={inviteTeamMember}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Invitation
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Job Postings Tab Component
const JobPostingsTab = ({ companyId }) => {
  return <JobPostingManager />;
};

// Analytics Tab Component
const AnalyticsTab = ({ companyId }) => {
  const [analytics, setAnalytics] = useState({
    overview: {
      total_jobs: 0,
      total_applications: 0,
      total_hired: 0,
      success_rate: 0
    },
    recent_activity: [],
    top_jobs: []
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Analytics & Insights</h3>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Jobs Posted</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_jobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_applications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Successful Hires</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_hired}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.success_rate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and detailed analytics would go here */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Hiring Performance</h4>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Analytics charts will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

// Company Settings Tab Component
const CompanySettingsTab = ({ company, formData, editing, onChange }) => {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium text-gray-900">Company Settings</h3>
      
      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h4>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-gray-700">Email notifications for new applications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-gray-700">Weekly hiring reports</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-gray-700">AI recommendations</span>
          </label>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Billing & Subscription</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Current Plan: Professional</p>
              <p className="text-sm text-gray-500">$99/month • Unlimited job postings</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Delete Company Account</p>
              <p className="text-sm text-red-700">This action cannot be undone. All data will be permanently deleted.</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminInterface;

