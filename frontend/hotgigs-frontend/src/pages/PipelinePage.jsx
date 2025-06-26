import React, { useState, useEffect } from 'react'
import { 
  GitBranch, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Edit,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Target,
  Users,
  Briefcase
} from 'lucide-react'

const PipelinePage = () => {
  const [pipelineItems, setPipelineItems] = useState([
    {
      id: 1,
      candidateName: 'Alex Thompson',
      candidateEmail: 'alex.t@email.com',
      position: 'Senior DevOps Engineer',
      client: 'TechCorp Solutions',
      clientLogo: '/api/placeholder/40/40',
      stage: 'Initial Contact',
      priority: 'High',
      expectedSalary: 140000,
      expectedCommission: 28000,
      commissionRate: 20,
      dateAdded: '2024-01-20',
      lastActivity: '2024-01-22',
      nextAction: 'Schedule client interview',
      nextActionDate: '2024-01-25',
      location: 'San Francisco, CA',
      industry: 'Technology',
      notes: 'Strong candidate with 8+ years experience. Client very interested.',
      probability: 85,
      daysInStage: 3,
      totalDaysInPipeline: 5
    },
    {
      id: 2,
      candidateName: 'Maria Garcia',
      candidateEmail: 'maria.g@email.com',
      position: 'Marketing Director',
      client: 'Creative Agency Pro',
      clientLogo: '/api/placeholder/40/40',
      stage: 'Client Interview',
      priority: 'Medium',
      expectedSalary: 110000,
      expectedCommission: 22000,
      commissionRate: 20,
      dateAdded: '2024-01-15',
      lastActivity: '2024-01-21',
      nextAction: 'Follow up on interview feedback',
      nextActionDate: '2024-01-24',
      location: 'Los Angeles, CA',
      industry: 'Marketing',
      notes: 'Interview went well, waiting for client decision.',
      probability: 70,
      daysInStage: 2,
      totalDaysInPipeline: 8
    },
    {
      id: 3,
      candidateName: 'David Kim',
      candidateEmail: 'david.k@email.com',
      position: 'Data Analyst',
      client: 'Global Finance Inc',
      clientLogo: '/api/placeholder/40/40',
      stage: 'Reference Check',
      priority: 'High',
      expectedSalary: 85000,
      expectedCommission: 15300,
      commissionRate: 18,
      dateAdded: '2024-01-10',
      lastActivity: '2024-01-20',
      nextAction: 'Complete reference verification',
      nextActionDate: '2024-01-23',
      location: 'New York, NY',
      industry: 'Finance',
      notes: 'All interviews completed successfully. Checking references.',
      probability: 90,
      daysInStage: 1,
      totalDaysInPipeline: 13
    },
    {
      id: 4,
      candidateName: 'Jennifer Lee',
      candidateEmail: 'jennifer.l@email.com',
      position: 'UX Designer',
      client: 'Design Studio Inc',
      clientLogo: '/api/placeholder/40/40',
      stage: 'Offer Negotiation',
      priority: 'High',
      expectedSalary: 95000,
      expectedCommission: 19000,
      commissionRate: 20,
      dateAdded: '2024-01-05',
      lastActivity: '2024-01-22',
      nextAction: 'Finalize salary negotiation',
      nextActionDate: '2024-01-24',
      location: 'Seattle, WA',
      industry: 'Design',
      notes: 'Offer made, negotiating salary and benefits.',
      probability: 95,
      daysInStage: 3,
      totalDaysInPipeline: 18
    },
    {
      id: 5,
      candidateName: 'Robert Wilson',
      candidateEmail: 'robert.w@email.com',
      position: 'Project Manager',
      client: 'Construction Corp',
      clientLogo: '/api/placeholder/40/40',
      stage: 'Screening',
      priority: 'Low',
      expectedSalary: 75000,
      expectedCommission: 15000,
      commissionRate: 20,
      dateAdded: '2024-01-18',
      lastActivity: '2024-01-19',
      nextAction: 'Complete technical assessment',
      nextActionDate: '2024-01-26',
      location: 'Chicago, IL',
      industry: 'Construction',
      notes: 'Initial screening completed, need to assess technical skills.',
      probability: 50,
      daysInStage: 4,
      totalDaysInPipeline: 5
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterClient, setFilterClient] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [viewMode, setViewMode] = useState('kanban') // kanban or list

  const stages = [
    'All',
    'Initial Contact',
    'Screening', 
    'Client Interview',
    'Technical Assessment',
    'Reference Check',
    'Offer Negotiation',
    'Offer Accepted'
  ]

  const priorities = ['All', 'High', 'Medium', 'Low']
  const clients = ['All', ...new Set(pipelineItems.map(item => item.client))]

  // Filter pipeline items
  const filteredItems = pipelineItems.filter(item => {
    const matchesSearch = item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = filterStage === 'All' || item.stage === filterStage
    const matchesPriority = filterPriority === 'All' || item.priority === filterPriority
    const matchesClient = filterClient === 'All' || item.client === filterClient
    return matchesSearch && matchesStage && matchesPriority && matchesClient
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Initial Contact': return 'bg-blue-100 text-blue-800'
      case 'Screening': return 'bg-purple-100 text-purple-800'
      case 'Client Interview': return 'bg-orange-100 text-orange-800'
      case 'Technical Assessment': return 'bg-indigo-100 text-indigo-800'
      case 'Reference Check': return 'bg-pink-100 text-pink-800'
      case 'Offer Negotiation': return 'bg-yellow-100 text-yellow-800'
      case 'Offer Accepted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-600'
    if (probability >= 60) return 'text-yellow-600'
    if (probability >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  // Calculate stats
  const totalItems = pipelineItems.length
  const highPriorityItems = pipelineItems.filter(item => item.priority === 'High').length
  const expectedRevenue = pipelineItems.reduce((sum, item) => sum + item.expectedCommission, 0)
  const avgProbability = Math.round(pipelineItems.reduce((sum, item) => sum + item.probability, 0) / pipelineItems.length)

  const PipelineCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img 
            src={item.clientLogo} 
            alt={item.client}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-semibold text-sm text-gray-900">{item.candidateName}</h4>
            <p className="text-xs text-gray-600">{item.position}</p>
            <p className="text-xs text-gray-500">{item.client}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
            {item.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(item.stage)}`}>
            {item.stage}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Expected Salary:</span>
          <span className="font-medium text-green-600">${item.expectedSalary.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Commission:</span>
          <span className="font-medium text-blue-600">${item.expectedCommission.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Probability:</span>
          <span className={`font-medium ${getProbabilityColor(item.probability)}`}>{item.probability}%</span>
        </div>
      </div>

      <div className="border-t pt-2 mb-3">
        <div className="text-xs text-gray-600 mb-1">Next Action:</div>
        <div className="text-xs font-medium text-gray-900">{item.nextAction}</div>
        <div className="text-xs text-gray-500">Due: {item.nextActionDate}</div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {item.daysInStage} days in stage
        </div>
        <button 
          onClick={() => {
            setSelectedItem(item)
            setShowDetailModal(true)
          }}
          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  )

  const KanbanView = () => {
    const stageColumns = stages.slice(1) // Remove 'All'
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {stageColumns.map(stage => {
          const stageItems = filteredItems.filter(item => item.stage === stage)
          return (
            <div key={stage} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-900">{stage}</h3>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {stageItems.length}
                </span>
              </div>
              <div className="space-y-3">
                {stageItems.map(item => (
                  <PipelineCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const ListView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Commission</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Action</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredItems.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-lg" src={item.clientLogo} alt={item.client} />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{item.candidateName}</div>
                    <div className="text-sm text-gray-500">{item.position}</div>
                    <div className="text-xs text-gray-400">{item.client}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(item.stage)}`}>
                  {item.stage}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${item.expectedCommission.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-medium ${getProbabilityColor(item.probability)}`}>
                  {item.probability}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.nextAction}</div>
                <div className="text-xs text-gray-500">{item.nextActionDate}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => {
                    setSelectedItem(item)
                    setShowDetailModal(true)
                  }}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  View
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const PipelineDetailModal = () => {
    if (!selectedItem) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pipeline Details</h2>
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
                    src={selectedItem.clientLogo} 
                    alt={selectedItem.client}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedItem.candidateName}</h3>
                    <p className="text-gray-600">{selectedItem.position}</p>
                    <p className="text-sm text-gray-500">{selectedItem.client}</p>
                    <div className="flex space-x-2 mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStageColor(selectedItem.stage)}`}>
                        {selectedItem.stage}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedItem.priority)}`}>
                        {selectedItem.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Email</label>
                    <p className="text-gray-900">{selectedItem.candidateEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{selectedItem.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <p className="text-gray-900">{selectedItem.industry}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Added</label>
                    <p className="text-gray-900">{selectedItem.dateAdded}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-lg mb-3">Timeline & Progress</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Days in Current Stage</label>
                    <p className="text-gray-900 font-semibold">{selectedItem.daysInStage} days</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Days in Pipeline</label>
                    <p className="text-gray-900 font-semibold">{selectedItem.totalDaysInPipeline} days</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Activity</label>
                    <p className="text-gray-900">{selectedItem.lastActivity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Success Probability</label>
                    <p className={`font-semibold ${getProbabilityColor(selectedItem.probability)}`}>{selectedItem.probability}%</p>
                  </div>
                </div>
              </div>

              {/* Next Actions */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-lg mb-3">Next Actions</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
                    <p className="text-gray-900 font-medium">{selectedItem.nextAction}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <p className="text-gray-900">{selectedItem.nextActionDate}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Notes</h4>
                <p className="text-gray-700">{selectedItem.notes}</p>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Expected Salary</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">${selectedItem.expectedSalary.toLocaleString()}</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Expected Commission</span>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">${selectedItem.expectedCommission.toLocaleString()}</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">Commission Rate</span>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-900">{selectedItem.commissionRate}%</div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-700">Success Probability</span>
                  <CheckCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-900">{selectedItem.probability}%</div>
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
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                  <ArrowRight className="w-4 h-4 inline mr-2" />
                  Move to Next Stage
                </button>
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                  <Edit className="w-4 h-4 inline mr-2" />
                  Edit Details
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
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-gray-600">Track your recruitment pipeline and candidate progress</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add to Pipeline
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <GitBranch className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{highPriorityItems}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${expectedRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Probability</p>
              <p className="text-2xl font-bold text-gray-900">{avgProbability}%</p>
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
                placeholder="Search pipeline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {clients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 rounded-md text-sm ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Kanban
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

      {/* Pipeline View */}
      {viewMode === 'kanban' ? <KanbanView /> : <ListView />}

      {/* Detail Modal */}
      {showDetailModal && <PipelineDetailModal />}
    </div>
  )
}

export default PipelinePage

