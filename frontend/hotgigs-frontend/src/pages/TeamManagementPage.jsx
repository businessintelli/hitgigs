import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  Crown,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
  Download,
  Upload,
  Settings,
  Building,
  Briefcase,
  Award,
  Target,
  Activity,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Copy,
  RefreshCw
} from 'lucide-react'

const TeamManagementPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('members')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showEditMemberModal, setShowEditMemberModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [loading, setLoading] = useState(false)

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      role: 'company_admin',
      department: 'Human Resources',
      position: 'HR Director',
      status: 'active',
      last_login: '2024-01-15T10:30:00Z',
      joined_date: '2023-06-15',
      permissions: ['manage_jobs', 'manage_candidates', 'manage_team', 'view_analytics'],
      avatar: '',
      performance_score: 95
    },
    {
      id: 2,
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 234-5678',
      role: 'company_recruiter',
      department: 'Human Resources',
      position: 'Senior Recruiter',
      status: 'active',
      last_login: '2024-01-15T09:15:00Z',
      joined_date: '2023-08-20',
      permissions: ['manage_jobs', 'manage_candidates', 'view_analytics'],
      avatar: '',
      performance_score: 88
    },
    {
      id: 3,
      first_name: 'Mike',
      last_name: 'Chen',
      email: 'mike.chen@techcorp.com',
      phone: '+1 (555) 345-6789',
      role: 'company_recruiter',
      department: 'Human Resources',
      position: 'Recruiter',
      status: 'active',
      last_login: '2024-01-14T16:45:00Z',
      joined_date: '2023-11-10',
      permissions: ['manage_jobs', 'manage_candidates'],
      avatar: '',
      performance_score: 82
    },
    {
      id: 4,
      first_name: 'Emily',
      last_name: 'Davis',
      email: 'emily.davis@techcorp.com',
      phone: '+1 (555) 456-7890',
      role: 'company_recruiter',
      department: 'Human Resources',
      position: 'Junior Recruiter',
      status: 'inactive',
      last_login: '2024-01-10T14:20:00Z',
      joined_date: '2023-12-01',
      permissions: ['manage_candidates'],
      avatar: '',
      performance_score: 75
    }
  ])

  const [newMember, setNewMember] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'company_recruiter',
    department: '',
    position: '',
    permissions: []
  })

  const roles = [
    { value: 'company_admin', label: 'Company Admin', icon: Crown, color: 'text-purple-600' },
    { value: 'company_recruiter', label: 'Company Recruiter', icon: Users, color: 'text-blue-600' },
    { value: 'hr_manager', label: 'HR Manager', icon: Shield, color: 'text-green-600' }
  ]

  const permissions = [
    { id: 'manage_jobs', label: 'Manage Jobs', description: 'Create, edit, and delete job postings' },
    { id: 'manage_candidates', label: 'Manage Candidates', description: 'View and manage candidate profiles' },
    { id: 'manage_team', label: 'Manage Team', description: 'Add, edit, and remove team members' },
    { id: 'view_analytics', label: 'View Analytics', description: 'Access company analytics and reports' },
    { id: 'export_data', label: 'Export Data', description: 'Export candidate and job data' },
    { id: 'manage_settings', label: 'Manage Settings', description: 'Modify company settings and preferences' }
  ]

  const departments = [
    'Human Resources',
    'Engineering',
    'Sales',
    'Marketing',
    'Operations',
    'Finance',
    'Customer Success'
  ]

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = `${member.first_name} ${member.last_name} ${member.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddMember = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const member = {
        ...newMember,
        id: Date.now(),
        status: 'active',
        joined_date: new Date().toISOString().split('T')[0],
        last_login: null,
        performance_score: 0,
        avatar: ''
      }
      setTeamMembers(prev => [...prev, member])
      setNewMember({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'company_recruiter',
        department: '',
        position: '',
        permissions: []
      })
      setShowAddMemberModal(false)
    } catch (error) {
      console.error('Failed to add team member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMember = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTeamMembers(prev => prev.map(member => 
        member.id === selectedMember.id ? selectedMember : member
      ))
      setShowEditMemberModal(false)
      setSelectedMember(null)
    } catch (error) {
      console.error('Failed to update team member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        setTeamMembers(prev => prev.filter(member => member.id !== memberId))
      } catch (error) {
        console.error('Failed to delete team member:', error)
      }
    }
  }

  const handleToggleStatus = async (memberId) => {
    try {
      setTeamMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
          : member
      ))
    } catch (error) {
      console.error('Failed to toggle member status:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  const getRoleInfo = (roleValue) => {
    return roles.find(role => role.value === roleValue) || roles[1]
  }

  const tabs = [
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'analytics', label: 'Team Analytics', icon: Activity }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-600 mt-1">Manage your team members, roles, and permissions</p>
            </div>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Member
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Members</p>
                  <p className="text-2xl font-bold text-blue-900">{teamMembers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Active Members</p>
                  <p className="text-2xl font-bold text-green-900">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Admins</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {teamMembers.filter(m => m.role === 'company_admin').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {Math.round(teamMembers.reduce((acc, m) => acc + m.performance_score, 0) / teamMembers.length)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Team Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Roles</option>
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                    <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </button>
                  </div>
                </div>

                {/* Team Members List */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Member
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role & Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Login
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Performance
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMembers.map((member) => {
                          const roleInfo = getRoleInfo(member.role)
                          const RoleIcon = roleInfo.icon
                          
                          return (
                            <tr key={member.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    {member.avatar ? (
                                      <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                                    ) : (
                                      <User className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {member.first_name} {member.last_name}
                                    </div>
                                    <div className="text-sm text-gray-500">{member.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <RoleIcon className={`w-4 h-4 mr-2 ${roleInfo.color}`} />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{roleInfo.label}</div>
                                    <div className="text-sm text-gray-500">{member.department}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  member.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {member.status === 'active' ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {member.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatLastLogin(member.last_login)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${member.performance_score}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">{member.performance_score}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      setSelectedMember(member)
                                      setShowEditMemberModal(true)
                                    }}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleStatus(member.id)}
                                    className={member.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                                  >
                                    {member.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Roles & Permissions Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Role Definitions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {roles.map((role) => {
                    const Icon = role.icon
                    const memberCount = teamMembers.filter(m => m.role === role.value).length
                    
                    return (
                      <div key={role.value} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <Icon className={`w-6 h-6 mr-3 ${role.color}`} />
                          <h4 className="text-lg font-medium text-gray-900">{role.label}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {memberCount} member{memberCount !== 1 ? 's' : ''}
                        </p>
                        <div className="space-y-2">
                          {permissions.map((permission) => {
                            const hasPermission = role.value === 'company_admin' || 
                              (role.value === 'company_recruiter' && ['manage_jobs', 'manage_candidates', 'view_analytics'].includes(permission.id)) ||
                              (role.value === 'hr_manager' && ['manage_candidates', 'view_analytics', 'manage_team'].includes(permission.id))
                            
                            return (
                              <div key={permission.id} className="flex items-center">
                                {hasPermission ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-gray-300 mr-2" />
                                )}
                                <span className={`text-sm ${hasPermission ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {permission.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Team Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Team Performance Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Team Growth</h4>
                    <p className="text-2xl font-bold text-gray-900">+25%</p>
                    <p className="text-sm text-green-600">vs last quarter</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Avg Performance</h4>
                    <p className="text-2xl font-bold text-gray-900">87%</p>
                    <p className="text-sm text-blue-600">across all members</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Active Rate</h4>
                    <p className="text-2xl font-bold text-gray-900">95%</p>
                    <p className="text-sm text-green-600">team engagement</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Team Member</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newMember.first_name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newMember.last_name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newMember.phone}
                  onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                <select
                  value={newMember.department}
                  onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Position/Title"
                  value={newMember.position}
                  onChange={(e) => setNewMember(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamManagementPage

