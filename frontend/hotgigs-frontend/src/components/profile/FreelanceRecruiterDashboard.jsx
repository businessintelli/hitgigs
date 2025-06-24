import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  User, 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Save, 
  X,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Star,
  Award,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Upload,
  Eye,
  MessageSquare,
  Send
} from 'lucide-react';

const FreelanceRecruiterDashboard = () => {
  const { user } = useAuth();
  const { apiCall } = useApi();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/recruiters/${user.id}/profile`, 'GET');
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching recruiter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/recruiters/${user.id}/profile`, 'PUT', formData);
      setProfile(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
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
    { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
    { id: 'clients', label: 'Client Management', icon: Users },
    { id: 'placements', label: 'Placements', icon: Briefcase },
    { id: 'candidates', label: 'Candidate Pool', icon: User },
    { id: 'earnings', label: 'Earnings & Reports', icon: DollarSign },
    { id: 'profile', label: 'Profile Settings', icon: Edit3 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-gray-600">Freelance Recruiter</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                {profile?.specialization && (
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{profile.specialization}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{profile?.rating || 0}/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
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
                      ? 'border-purple-500 text-purple-600'
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
            <DashboardOverviewTab 
              profile={profile}
            />
          )}
          {activeTab === 'clients' && (
            <ClientManagementTab 
              recruiterId={user.id}
            />
          )}
          {activeTab === 'placements' && (
            <PlacementsTab 
              recruiterId={user.id}
            />
          )}
          {activeTab === 'candidates' && (
            <CandidatePoolTab 
              recruiterId={user.id}
            />
          )}
          {activeTab === 'earnings' && (
            <EarningsReportsTab 
              recruiterId={user.id}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileSettingsTab 
              profile={profile} 
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

// Dashboard Overview Tab Component
const DashboardOverviewTab = ({ profile }) => {
  const stats = {
    active_placements: profile?.stats?.active_placements || 0,
    total_placements: profile?.stats?.total_placements || 0,
    monthly_earnings: profile?.stats?.monthly_earnings || 0,
    success_rate: profile?.stats?.success_rate || 0,
    active_clients: profile?.stats?.active_clients || 0,
    candidate_pool: profile?.stats?.candidate_pool || 0
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Placements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active_placements}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Placements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_placements}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthly_earnings.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.success_rate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active_clients}</p>
            </div>
          </div>
        </div>

        <div className="bg-pink-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <User className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Candidate Pool</p>
              <p className="text-2xl font-bold text-gray-900">{stats.candidate_pool}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Placements</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">Senior Developer at TechCorp</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">$5,000</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Searches</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Senior React Developer</p>
                  <p className="text-sm text-gray-500">TechCorp • $120k-150k</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    In Progress
                  </span>
                  <p className="text-xs text-gray-500 mt-1">5 candidates</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Performance charts will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

// Client Management Tab Component
const ClientManagementTab = ({ recruiterId }) => {
  const { apiCall } = useApi();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    industry: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/recruiters/${recruiterId}/clients`, 'GET');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async () => {
    try {
      await apiCall(`/recruiters/${recruiterId}/clients`, 'POST', newClient);
      setShowAddModal(false);
      setNewClient({ company_name: '', contact_name: '', email: '', phone: '', industry: '' });
      fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Client Management</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                  {client.company_name?.[0]}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{client.company_name}</h4>
                  <p className="text-sm text-gray-500">{client.industry}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{client.contact_name}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-500">Active Jobs: </span>
                <span className="font-medium text-gray-900">{client.active_jobs || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Placements: </span>
                <span className="font-medium text-gray-900">{client.total_placements || 0}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Client</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newClient.company_name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={newClient.contact_name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, contact_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={newClient.industry}
                  onChange={(e) => setNewClient(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addClient}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Client
              </button>
              <button
                onClick={() => setShowAddModal(false)}
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

// Placements Tab Component
const PlacementsTab = ({ recruiterId }) => {
  const [placements, setPlacements] = useState([]);
  const [filter, setFilter] = useState('all');

  const statusColors = {
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Placements</h3>
        <div className="flex space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Placements</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Placements List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
            <div>Candidate</div>
            <div>Position</div>
            <div>Client</div>
            <div>Status</div>
            <div>Commission</div>
            <div>Actions</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="px-6 py-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">john@example.com</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Senior Developer</p>
                  <p className="text-sm text-gray-500">$120k-150k</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">TechCorp</p>
                  <p className="text-sm text-gray-500">Technology</p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors['completed']}`}>
                    Completed
                  </span>
                </div>
                <div>
                  <p className="font-medium text-green-600">$5,000</p>
                  <p className="text-sm text-gray-500">15% of salary</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-purple-600 hover:text-purple-700">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Candidate Pool Tab Component
const CandidatePoolTab = ({ recruiterId }) => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Candidate Pool</h3>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  JD
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">John Doe</h4>
                  <p className="text-sm text-gray-500">Senior Developer</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>$120k - $150k</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Available immediately</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {['React', 'Node.js', 'Python'].map((skill) => (
                <span key={skill} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                View Profile
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Earnings & Reports Tab Component
const EarningsReportsTab = ({ recruiterId }) => {
  const earnings = {
    this_month: 12500,
    last_month: 8750,
    this_year: 95000,
    pending: 3500
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Earnings & Reports</h3>
      
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.this_month.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Month</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.last_month.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Year</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.this_year.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.pending.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Earnings Trend</h4>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Earnings chart will be implemented here</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h4>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Placement Commission</p>
                  <p className="text-sm text-gray-500">John Doe - Senior Developer at TechCorp</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+$5,000</p>
                <p className="text-sm text-gray-500">Jan 15, 2024</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Profile Settings Tab Component
const ProfileSettingsTab = ({ profile, formData, editing, onChange }) => {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
      
      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => onChange('first_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile?.first_name || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => onChange('last_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile?.last_name || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.specialization || ''}
                onChange={(e) => onChange('specialization', e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile?.specialization || 'Not provided'}</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile?.location || 'Not provided'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {editing ? (
              <textarea
                value={formData.bio || ''}
                onChange={(e) => onChange('bio', e.target.value)}
                rows={4}
                placeholder="Tell clients about your recruiting experience and expertise..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile?.bio || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Commission Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Commission Rate (%)
            </label>
            {editing ? (
              <input
                type="number"
                value={formData.commission_rate || ''}
                onChange={(e) => onChange('commission_rate', e.target.value)}
                placeholder="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile?.commission_rate || 'Not set'}%</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Commission ($)
            </label>
            {editing ? (
              <input
                type="number"
                value={formData.minimum_commission || ''}
                onChange={(e) => onChange('minimum_commission', e.target.value)}
                placeholder="2500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">${profile?.minimum_commission || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelanceRecruiterDashboard;

