import React, { useState, useEffect } from 'react'
import { 
  Trophy, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  User, 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Eye,
  Download,
  Star,
  Award,
  Target
} from 'lucide-react'

const PlacementsPage = () => {
  const [placements, setPlacements] = useState([
    {
      id: 1,
      candidateName: 'John Smith',
      candidateEmail: 'john.smith@email.com',
      position: 'Senior Software Engineer',
      client: 'TechCorp Solutions',
      clientLogo: '/api/placeholder/40/40',
      placementDate: '2024-01-15',
      startDate: '2024-02-01',
      salary: 120000,
      commission: 24000,
      commissionRate: 20,
      status: 'Completed',
      duration: '45 days',
      location: 'San Francisco, CA',
      jobType: 'Full-time',
      industry: 'Technology',
      notes: 'Excellent placement, candidate started on time and client is very satisfied.',
      guaranteePeriod: '90 days',
      replacementNeeded: false,
      rating: 5,
      feedback: 'Outstanding candidate, exceeded expectations in the first month.'
    },
    {
      id: 2,
      candidateName: 'Sarah Johnson',
      candidateEmail: 'sarah.j@email.com',
      position: 'Financial Analyst',
      client: 'Global Finance Inc',
      clientLogo: '/api/placeholder/40/40',
      placementDate: '2024-01-10',
      startDate: '2024-01-22',
      salary: 85000,
      commission: 15300,
      commissionRate: 18,
      status: 'Completed',
      duration: '32 days',
      location: 'New York, NY',
      jobType: 'Full-time',
      industry: 'Finance',
      notes: 'Quick placement, candidate was a perfect fit for the role.',
      guaranteePeriod: '90 days',
      replacementNeeded: false,
      rating: 4.5,
      feedback: 'Great analytical skills, fitting in well with the team.'
    },
    {
      id: 3,
      candidateName: 'Michael Chen',
      candidateEmail: 'mchen@email.com',
      position: 'Marketing Manager',
      client: 'Creative Agency Pro',
      clientLogo: '/api/placeholder/40/40',
      placementDate: '2024-01-05',
      startDate: '2024-01-15',
      salary: 95000,
      commission: 19000,
      commissionRate: 20,
      status: 'In Progress',
      duration: '28 days',
      location: 'Los Angeles, CA',
      jobType: 'Full-time',
      industry: 'Marketing',
      notes: 'Candidate started recently, monitoring progress during guarantee period.',
      guaranteePeriod: '90 days',
      replacementNeeded: false,
      rating: 0,
      feedback: 'Too early to provide feedback, candidate just started.'
    },
    {
      id: 4,
      candidateName: 'Emily Rodriguez',
      candidateEmail: 'emily.r@email.com',
      position: 'Data Scientist',
      client: 'Analytics Corp',
      clientLogo: '/api/placeholder/40/40',
      placementDate: '2023-12-20',
      startDate: '2024-01-08',
      salary: 130000,
      commission: 26000,
      commissionRate: 20,
      status: 'Replacement Needed',
      duration: '35 days',
      location: 'Seattle, WA',
      jobType: 'Full-time',
      industry: 'Technology',
      notes: 'Candidate left after 2 weeks due to personal reasons. Need to find replacement.',
      guaranteePeriod: '90 days',
      replacementNeeded: true,
      rating: 2,
      feedback: 'Candidate was technically competent but had to leave for personal reasons.'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterIndustry, setFilterIndustry] = useState('All')
  const [dateRange, setDateRange] = useState('All')
  const [selectedPlacement, setSelectedPlacement] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Filter placements
  const filteredPlacements = placements.filter(placement => {
    const matchesSearch = placement.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         placement.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         placement.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || placement.status === filterStatus
    const matchesIndustry = filterIndustry === 'All' || placement.industry === filterIndustry
    return matchesSearch && matchesStatus && matchesIndustry
  })

  const industries = ['All', ...new Set(placements.map(p => p.industry))]
  const statuses = ['All', 'Completed', 'In Progress', 'Replacement Needed', 'Cancelled']

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Replacement Needed': return 'bg-red-100 text-red-800'
      case 'Cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />
      case 'In Progress': return <Clock className="w-4 h-4" />
      case 'Replacement Needed': return <Target className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  // Calculate stats
  const totalPlacements = placements.length
  const completedPlacements = placements.filter(p => p.status === 'Completed').length
  const totalCommission = placements.reduce((sum, p) => sum + p.commission, 0)
  const avgPlacementTime = Math.round(placements.reduce((sum, p) => sum + parseInt(p.duration), 0) / placements.length)

  const PlacementCard = ({ placement }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={placement.clientLogo} 
            alt={placement.client}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{placement.candidateName}</h3>
            <p className="text-sm text-gray-600">{placement.position}</p>
            <p className="text-xs text-gray-500">{placement.client}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(placement.status)}`}>
            {getStatusIcon(placement.status)}
            <span className="ml-1">{placement.status}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">Placement Date</div>
          <div className="font-medium">{placement.placementDate}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Start Date</div>
          <div className="font-medium">{placement.startDate}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Salary</div>
          <div className="font-medium text-green-600">${placement.salary.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Commission</div>
          <div className="font-medium text-blue-600">${placement.commission.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          {placement.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {placement.duration}
        </div>
      </div>

      {placement.rating > 0 && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Client Rating</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="font-medium">{placement.rating}/5</span>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button 
          onClick={() => {
            setSelectedPlacement(placement)
            setShowDetailModal(true)
          }}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 inline mr-1" />
          View Details
        </button>
        {placement.replacementNeeded && (
          <button className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
            <Target className="w-4 h-4 inline mr-1" />
            Find Replacement
          </button>
        )}
      </div>
    </div>
  )

  const PlacementDetailModal = () => {
    if (!selectedPlacement) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Placement Details</h2>
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
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={selectedPlacement.clientLogo} 
                    alt={selectedPlacement.client}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedPlacement.candidateName}</h3>
                    <p className="text-gray-600">{selectedPlacement.position}</p>
                    <p className="text-sm text-gray-500">{selectedPlacement.client}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 flex items-center w-fit ${getStatusColor(selectedPlacement.status)}`}>
                      {getStatusIcon(selectedPlacement.status)}
                      <span className="ml-1">{selectedPlacement.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Email</label>
                    <p className="text-gray-900">{selectedPlacement.candidateEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <p className="text-gray-900">{selectedPlacement.industry}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{selectedPlacement.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <p className="text-gray-900">{selectedPlacement.jobType}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-lg mb-3">Timeline</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placement Date</label>
                    <p className="text-gray-900">{selectedPlacement.placementDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <p className="text-gray-900">{selectedPlacement.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <p className="text-gray-900">{selectedPlacement.duration}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guarantee Period</label>
                    <p className="text-gray-900">{selectedPlacement.guaranteePeriod}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-lg mb-3">Financial Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                    <p className="text-gray-900 font-semibold text-green-600">${selectedPlacement.salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate</label>
                    <p className="text-gray-900 font-semibold">{selectedPlacement.commissionRate}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Earned</label>
                    <p className="text-gray-900 font-semibold text-blue-600">${selectedPlacement.commission.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Replacement Needed</label>
                    <p className={`font-semibold ${selectedPlacement.replacementNeeded ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedPlacement.replacementNeeded ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes and Feedback */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Notes & Feedback</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <p className="text-gray-700">{selectedPlacement.notes}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Feedback</label>
                    <p className="text-gray-700">{selectedPlacement.feedback}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-4">
              {selectedPlacement.rating > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-700">Client Rating</span>
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-900">{selectedPlacement.rating}/5</div>
                </div>
              )}

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Salary</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">${selectedPlacement.salary.toLocaleString()}</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Commission</span>
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">${selectedPlacement.commission.toLocaleString()}</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">Duration</span>
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-900">{selectedPlacement.duration}</div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  <User className="w-4 h-4 inline mr-2" />
                  Contact Candidate
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Contact Client
                </button>
                {selectedPlacement.replacementNeeded && (
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    <Target className="w-4 h-4 inline mr-2" />
                    Find Replacement
                  </button>
                )}
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Report
                </button>
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
          <h1 className="text-2xl font-bold text-gray-900">Placements</h1>
          <p className="text-gray-600">Track your successful candidate placements and earnings</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Placement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Placements</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlacements}</p>
            </div>
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedPlacements}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold text-gray-900">${totalCommission.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Time</p>
              <p className="text-2xl font-bold text-gray-900">{avgPlacementTime} days</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search placements..."
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
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Placements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlacements.map(placement => (
          <PlacementCard key={placement.id} placement={placement} />
        ))}
      </div>

      {/* Detail Modal */}
      {showDetailModal && <PlacementDetailModal />}
    </div>
  )
}

export default PlacementsPage

