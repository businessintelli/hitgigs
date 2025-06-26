import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Download,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  DollarSign
} from 'lucide-react'

const ClientPortalPage = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      logo: '/api/placeholder/60/60',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      phone: '+1 (555) 123-4567',
      website: 'www.techcorp.com',
      address: '123 Tech Street, San Francisco, CA 94105',
      industry: 'Technology',
      companySize: '500-1000',
      relationship: 'Premium Client',
      status: 'Active',
      joinDate: '2023-01-15',
      totalPlacements: 8,
      totalRevenue: 160000,
      avgCommissionRate: 20,
      lastPlacement: '2024-01-15',
      activeJobs: 3,
      pendingJobs: 1,
      rating: 4.8,
      notes: 'Excellent client with consistent requirements. Fast decision making.',
      preferredCommunication: 'Email',
      paymentTerms: 'Net 30',
      contractType: 'Exclusive',
      nextMeeting: '2024-01-30'
    },
    {
      id: 2,
      name: 'Global Finance Inc',
      logo: '/api/placeholder/60/60',
      contactPerson: 'Michael Chen',
      email: 'michael.c@globalfinance.com',
      phone: '+1 (555) 987-6543',
      website: 'www.globalfinance.com',
      address: '456 Finance Ave, New York, NY 10001',
      industry: 'Finance',
      companySize: '1000+',
      relationship: 'Standard Client',
      status: 'Active',
      joinDate: '2023-03-20',
      totalPlacements: 5,
      totalRevenue: 95000,
      avgCommissionRate: 18,
      lastPlacement: '2024-01-10',
      activeJobs: 2,
      pendingJobs: 0,
      rating: 4.5,
      notes: 'Professional client with detailed requirements. Longer decision process.',
      preferredCommunication: 'Phone',
      paymentTerms: 'Net 45',
      contractType: 'Non-exclusive',
      nextMeeting: '2024-02-05'
    },
    {
      id: 3,
      name: 'Creative Agency Pro',
      logo: '/api/placeholder/60/60',
      contactPerson: 'Emma Rodriguez',
      email: 'emma.r@creativeagency.com',
      phone: '+1 (555) 456-7890',
      website: 'www.creativeagency.com',
      address: '789 Creative Blvd, Los Angeles, CA 90210',
      industry: 'Marketing & Advertising',
      companySize: '100-500',
      relationship: 'New Client',
      status: 'Active',
      joinDate: '2023-11-10',
      totalPlacements: 2,
      totalRevenue: 42000,
      avgCommissionRate: 20,
      lastPlacement: '2023-12-20',
      activeJobs: 1,
      pendingJobs: 2,
      rating: 4.2,
      notes: 'Growing agency with creative roles. Good potential for expansion.',
      preferredCommunication: 'Video Call',
      paymentTerms: 'Net 30',
      contractType: 'Exclusive',
      nextMeeting: '2024-01-28'
    },
    {
      id: 4,
      name: 'Healthcare Plus',
      logo: '/api/placeholder/60/60',
      contactPerson: 'Dr. James Wilson',
      email: 'james.w@healthcareplus.com',
      phone: '+1 (555) 321-0987',
      website: 'www.healthcareplus.com',
      address: '321 Medical Center Dr, Chicago, IL 60601',
      industry: 'Healthcare',
      companySize: '500-1000',
      relationship: 'Standard Client',
      status: 'Inactive',
      joinDate: '2023-06-15',
      totalPlacements: 3,
      totalRevenue: 54000,
      avgCommissionRate: 18,
      lastPlacement: '2023-10-15',
      activeJobs: 0,
      pendingJobs: 0,
      rating: 4.0,
      notes: 'Seasonal hiring patterns. Good for specialized healthcare roles.',
      preferredCommunication: 'Email',
      paymentTerms: 'Net 60',
      contractType: 'Non-exclusive',
      nextMeeting: null
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterIndustry, setFilterIndustry] = useState('All')
  const [filterRelationship, setFilterRelationship] = useState('All')
  const [selectedClient, setSelectedClient] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid or list

  const statuses = ['All', 'Active', 'Inactive', 'Prospect']
  const industries = ['All', 'Technology', 'Finance', 'Healthcare', 'Marketing & Advertising', 'Manufacturing']
  const relationships = ['All', 'Premium Client', 'Standard Client', 'New Client', 'Prospect']

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || client.status === filterStatus
    const matchesIndustry = filterIndustry === 'All' || client.industry === filterIndustry
    const matchesRelationship = filterRelationship === 'All' || client.relationship === filterRelationship
    return matchesSearch && matchesStatus && matchesIndustry && matchesRelationship
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      case 'Prospect': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case 'Premium Client': return 'bg-purple-100 text-purple-800'
      case 'Standard Client': return 'bg-blue-100 text-blue-800'
      case 'New Client': return 'bg-green-100 text-green-800'
      case 'Prospect': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate stats
  const totalClients = clients.length
  const activeClients = clients.filter(client => client.status === 'Active').length
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalRevenue, 0)
  const totalPlacements = clients.reduce((sum, client) => sum + client.totalPlacements, 0)

  const ClientCard = ({ client }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src={client.logo} 
            alt={client.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-600">{client.industry}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(client.relationship)}`}>
                {client.relationship}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(client.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">{client.rating}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          {client.contactPerson}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {client.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {client.address.split(',')[0]}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{client.totalPlacements}</div>
          <div className="text-xs text-gray-500">Placements</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">${(client.totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-xs text-gray-500">Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{client.activeJobs}</div>
          <div className="text-xs text-gray-500">Active Jobs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-orange-600">{client.avgCommissionRate}%</div>
          <div className="text-xs text-gray-500">Commission</div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-xs text-gray-500">
          Last placement: {client.lastPlacement}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              setSelectedClient(client)
              setShowDetailModal(true)
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
          <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
            Contact
          </button>
        </div>
      </div>
    </div>
  )

  const ListView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placements</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredClients.map(client => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-lg" src={client.logo} alt={client.name} />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.industry}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{client.contactPerson}</div>
                <div className="text-sm text-gray-500">{client.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRelationshipColor(client.relationship)}`}>
                    {client.relationship}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="font-semibold">{client.totalPlacements}</div>
                <div className="text-xs text-gray-500">{client.activeJobs} active jobs</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="font-semibold text-green-600">${client.totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{client.avgCommissionRate}% commission</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-900">{client.rating}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => {
                    setSelectedClient(client)
                    setShowDetailModal(true)
                  }}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  View
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  Contact
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const ClientDetailModal = () => {
    if (!selectedClient) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Client Portal</h2>
            <button 
              onClick={() => setShowDetailModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2">
              {/* Client Header */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-6 mb-4">
                  <img 
                    src={selectedClient.logo} 
                    alt={selectedClient.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h3>
                    <p className="text-gray-600">{selectedClient.industry}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status}
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRelationshipColor(selectedClient.relationship)}`}>
                        {selectedClient.relationship}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(selectedClient.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{selectedClient.rating} / 5.0</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{selectedClient.contactPerson}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedClient.website}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Company Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedClient.address}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedClient.companySize} employees</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Client since {selectedClient.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-lg mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedClient.totalPlacements}</div>
                    <div className="text-sm text-gray-500">Total Placements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${(selectedClient.totalRevenue / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-500">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedClient.activeJobs}</div>
                    <div className="text-sm text-gray-500">Active Jobs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedClient.avgCommissionRate}%</div>
                    <div className="text-sm text-gray-500">Avg Commission</div>
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-lg mb-4">Contract & Terms</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                    <p className="text-gray-900">{selectedClient.contractType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                    <p className="text-gray-900">{selectedClient.paymentTerms}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Communication</label>
                    <p className="text-gray-900">{selectedClient.preferredCommunication}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Meeting</label>
                    <p className="text-gray-900">{selectedClient.nextMeeting || 'Not scheduled'}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-lg mb-3">Notes</h4>
                <p className="text-gray-700">{selectedClient.notes}</p>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </button>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Call
                  </button>
                  <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Meeting
                  </button>
                  <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    View Contract
                  </button>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-green-800">Placement Completed</div>
                    <div className="text-green-600">Alex Thompson - DevOps Engineer</div>
                    <div className="text-xs text-green-500">{selectedClient.lastPlacement}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-green-800">New Job Posted</div>
                    <div className="text-green-600">Senior Frontend Developer</div>
                    <div className="text-xs text-green-500">2024-01-20</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-green-800">Contract Renewed</div>
                    <div className="text-green-600">Annual agreement extended</div>
                    <div className="text-xs text-green-500">2024-01-01</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-3">Upcoming</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800">Quarterly Review</div>
                    <div className="text-xs text-yellow-600">{selectedClient.nextMeeting}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800">Contract Renewal</div>
                    <div className="text-xs text-yellow-600">2024-12-31</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
          <p className="text-gray-600">Manage your client relationships and track performance</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">{activeClients}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Placements</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlacements}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <select
              value={filterRelationship}
              onChange={(e) => setFilterRelationship(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {relationships.map(relationship => (
                <option key={relationship} value={relationship}>{relationship}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Clients View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : (
        <ListView />
      )}

      {/* Detail Modal */}
      {showDetailModal && <ClientDetailModal />}
    </div>
  )
}

export default ClientPortalPage

