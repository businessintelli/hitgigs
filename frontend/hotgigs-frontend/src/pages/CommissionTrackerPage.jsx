import React, { useState, useEffect } from 'react'
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter, 
  Eye,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  BarChart3,
  PieChart,
  Calculator,
  FileText,
  User,
  Building2,
  Star
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts'

const CommissionTrackerPage = () => {
  const [commissions, setCommissions] = useState([
    {
      id: 1,
      candidateName: 'Alex Thompson',
      position: 'Senior DevOps Engineer',
      client: 'TechCorp Solutions',
      placementDate: '2024-01-15',
      startDate: '2024-01-22',
      salary: 140000,
      commissionRate: 20,
      commissionAmount: 28000,
      status: 'Earned',
      paymentStatus: 'Paid',
      paymentDate: '2024-02-15',
      guaranteePeriod: 90,
      daysInRole: 8,
      replacementRisk: 'Low',
      clientRating: 4.8,
      notes: 'Excellent placement, client very satisfied'
    },
    {
      id: 2,
      candidateName: 'Maria Garcia',
      position: 'Marketing Director',
      client: 'Creative Agency Pro',
      placementDate: '2024-01-10',
      startDate: '2024-01-17',
      salary: 110000,
      commissionRate: 20,
      commissionAmount: 22000,
      status: 'In Guarantee',
      paymentStatus: 'Pending',
      paymentDate: null,
      guaranteePeriod: 90,
      daysInRole: 13,
      replacementRisk: 'Low',
      clientRating: 4.5,
      notes: 'Good fit, candidate settling in well'
    },
    {
      id: 3,
      candidateName: 'David Kim',
      position: 'Data Analyst',
      client: 'Global Finance Inc',
      placementDate: '2023-12-20',
      startDate: '2024-01-02',
      salary: 85000,
      commissionRate: 18,
      commissionAmount: 15300,
      status: 'Earned',
      paymentStatus: 'Paid',
      paymentDate: '2024-01-20',
      guaranteePeriod: 90,
      daysInRole: 28,
      replacementRisk: 'Low',
      clientRating: 4.2,
      notes: 'Solid performer, client satisfied'
    },
    {
      id: 4,
      candidateName: 'Jennifer Lee',
      position: 'UX Designer',
      client: 'Design Studio Inc',
      placementDate: '2023-12-15',
      startDate: '2023-12-22',
      salary: 95000,
      commissionRate: 20,
      commissionAmount: 19000,
      status: 'Earned',
      paymentStatus: 'Paid',
      paymentDate: '2024-01-15',
      guaranteePeriod: 90,
      daysInRole: 38,
      replacementRisk: 'Low',
      clientRating: 4.7,
      notes: 'Excellent cultural fit, exceeding expectations'
    },
    {
      id: 5,
      candidateName: 'Robert Wilson',
      position: 'Project Manager',
      client: 'Construction Corp',
      placementDate: '2023-11-30',
      startDate: '2023-12-07',
      salary: 75000,
      commissionRate: 20,
      commissionAmount: 15000,
      status: 'At Risk',
      paymentStatus: 'Paid',
      paymentDate: '2023-12-30',
      guaranteePeriod: 90,
      daysInRole: 53,
      replacementRisk: 'Medium',
      clientRating: 3.8,
      notes: 'Some performance concerns, monitoring closely'
    },
    {
      id: 6,
      candidateName: 'Sarah Johnson',
      position: 'Software Engineer',
      client: 'StartupTech',
      placementDate: '2023-10-15',
      startDate: '2023-10-22',
      salary: 120000,
      commissionRate: 22,
      commissionAmount: 26400,
      status: 'Replaced',
      paymentStatus: 'Refunded',
      paymentDate: '2023-12-01',
      guaranteePeriod: 90,
      daysInRole: 45,
      replacementRisk: 'High',
      clientRating: 2.5,
      notes: 'Cultural mismatch, had to provide replacement'
    }
  ])

  const [selectedPeriod, setSelectedPeriod] = useState('All Time')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('All')
  const [selectedCommission, setSelectedCommission] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [viewMode, setViewMode] = useState('overview') // overview, tracker, analytics

  // Chart data
  const monthlyCommissions = [
    { month: 'Oct', earned: 26400, pending: 0, refunded: 26400 },
    { month: 'Nov', earned: 15000, pending: 0, refunded: 0 },
    { month: 'Dec', earned: 34300, pending: 0, refunded: 0 },
    { month: 'Jan', earned: 28000, pending: 22000, refunded: 0 }
  ]

  const commissionByClient = [
    { name: 'TechCorp Solutions', value: 28000, color: '#3B82F6' },
    { name: 'Creative Agency Pro', value: 22000, color: '#10B981' },
    { name: 'Global Finance Inc', value: 15300, color: '#F59E0B' },
    { name: 'Design Studio Inc', value: 19000, color: '#EF4444' },
    { name: 'Construction Corp', value: 15000, color: '#8B5CF6' }
  ]

  const riskAnalysis = [
    { risk: 'Low Risk', count: 4, percentage: 67 },
    { risk: 'Medium Risk', count: 1, percentage: 17 },
    { risk: 'High Risk', count: 1, percentage: 16 }
  ]

  // Filter commissions
  const filteredCommissions = commissions.filter(commission => {
    const matchesStatus = filterStatus === 'All' || commission.status === filterStatus
    const matchesPaymentStatus = filterPaymentStatus === 'All' || commission.paymentStatus === filterPaymentStatus
    return matchesStatus && matchesPaymentStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Earned': return 'bg-green-100 text-green-800'
      case 'In Guarantee': return 'bg-blue-100 text-blue-800'
      case 'At Risk': return 'bg-yellow-100 text-yellow-800'
      case 'Replaced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Refunded': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600'
      case 'Medium': return 'text-yellow-600'
      case 'High': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Earned': return <CheckCircle className="w-4 h-4" />
      case 'In Guarantee': return <Clock className="w-4 h-4" />
      case 'At Risk': return <AlertCircle className="w-4 h-4" />
      case 'Replaced': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  // Calculate stats
  const totalEarned = commissions.filter(c => c.status === 'Earned' && c.paymentStatus === 'Paid').reduce((sum, c) => sum + c.commissionAmount, 0)
  const totalPending = commissions.filter(c => c.paymentStatus === 'Pending').reduce((sum, c) => sum + c.commissionAmount, 0)
  const totalRefunded = commissions.filter(c => c.paymentStatus === 'Refunded').reduce((sum, c) => sum + c.commissionAmount, 0)
  const atRiskAmount = commissions.filter(c => c.status === 'At Risk').reduce((sum, c) => sum + c.commissionAmount, 0)
  const successRate = Math.round((commissions.filter(c => c.status === 'Earned').length / commissions.length) * 100)

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Commission Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Commission Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyCommissions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="earned" fill="#10B981" name="Earned" />
            <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
            <Bar dataKey="refunded" fill="#EF4444" name="Refunded" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission by Client */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission by Client</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={commissionByClient}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {commissionByClient.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Placement Risk Analysis</h3>
          <div className="space-y-4">
            {riskAnalysis.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.risk === 'Low Risk' ? 'bg-green-500' :
                    item.risk === 'Medium Risk' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{item.risk}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{item.count} placements</span>
                  <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Commission Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commissions.slice(0, 5).map(commission => (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{commission.candidateName}</div>
                      <div className="text-sm text-gray-500">{commission.position}</div>
                      <div className="text-xs text-gray-400">{commission.client}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">${commission.commissionAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{commission.commissionRate}% rate</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commission.status)}`}>
                      {getStatusIcon(commission.status)}
                      <span className="ml-1">{commission.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(commission.paymentStatus)}`}>
                      {commission.paymentStatus}
                    </span>
                    {commission.paymentDate && (
                      <div className="text-xs text-gray-500 mt-1">{commission.paymentDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getRiskColor(commission.replacementRisk)}`}>
                      {commission.replacementRisk}
                    </span>
                    <div className="text-xs text-gray-500">{commission.daysInRole} days</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const TrackerTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Statuses</option>
            <option value="Earned">Earned</option>
            <option value="In Guarantee">In Guarantee</option>
            <option value="At Risk">At Risk</option>
            <option value="Replaced">Replaced</option>
          </select>
          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Time</option>
            <option>This Year</option>
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Commission Tracker Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Commission Tracker</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placement Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommissions.map(commission => (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{commission.candidateName}</div>
                      <div className="text-sm text-gray-500">{commission.position}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commission.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{commission.placementDate}</div>
                    <div className="text-xs text-gray-500">Started: {commission.startDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">${commission.commissionAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{commission.commissionRate}% of ${commission.salary.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commission.status)}`}>
                      {getStatusIcon(commission.status)}
                      <span className="ml-1">{commission.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(commission.paymentStatus)}`}>
                      {commission.paymentStatus}
                    </span>
                    {commission.paymentDate && (
                      <div className="text-xs text-gray-500 mt-1">{commission.paymentDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getRiskColor(commission.replacementRisk)}`}>
                      {commission.replacementRisk} Risk
                    </div>
                    <div className="text-xs text-gray-500">{commission.daysInRole} days in role</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {
                        setSelectedCommission(commission)
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
      </div>
    </div>
  )

  const CommissionDetailModal = () => {
    if (!selectedCommission) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Commission Details</h2>
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
              {/* Placement Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Placement Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Candidate</label>
                    <p className="text-gray-900 font-semibold">{selectedCommission.candidateName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <p className="text-gray-900">{selectedCommission.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <p className="text-gray-900">{selectedCommission.client}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                    <p className="text-gray-900 font-semibold">${selectedCommission.salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placement Date</label>
                    <p className="text-gray-900">{selectedCommission.placementDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <p className="text-gray-900">{selectedCommission.startDate}</p>
                  </div>
                </div>
              </div>

              {/* Commission Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate</label>
                    <p className="text-gray-900 font-semibold">{selectedCommission.commissionRate}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Amount</label>
                    <p className="text-green-600 font-bold text-lg">${selectedCommission.commissionAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedCommission.status)}`}>
                      {getStatusIcon(selectedCommission.status)}
                      <span className="ml-1">{selectedCommission.status}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(selectedCommission.paymentStatus)}`}>
                      {selectedCommission.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <p className="text-gray-900">{selectedCommission.paymentDate || 'Not paid yet'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guarantee Period</label>
                    <p className="text-gray-900">{selectedCommission.guaranteePeriod} days</p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Days in Role</label>
                    <p className="text-gray-900 font-semibold">{selectedCommission.daysInRole} days</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Replacement Risk</label>
                    <p className={`font-semibold ${getRiskColor(selectedCommission.replacementRisk)}`}>
                      {selectedCommission.replacementRisk} Risk
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Rating</label>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-semibold mr-2">{selectedCommission.clientRating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(selectedCommission.clientRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700">{selectedCommission.notes}</p>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Contact Candidate
                  </button>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Contact Client
                  </button>
                  <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Invoice
                  </button>
                  <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Details
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Timeline</h4>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-green-800">Placement Made</div>
                    <div className="text-xs text-green-600">{selectedCommission.placementDate}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-green-800">Candidate Started</div>
                    <div className="text-xs text-green-600">{selectedCommission.startDate}</div>
                  </div>
                  {selectedCommission.paymentDate && (
                    <div className="text-sm">
                      <div className="font-medium text-green-800">Commission Paid</div>
                      <div className="text-xs text-green-600">{selectedCommission.paymentDate}</div>
                    </div>
                  )}
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
          <h1 className="text-2xl font-bold text-gray-900">Commission Tracker</h1>
          <p className="text-gray-600">Track and manage your commission earnings and payments</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Commission
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-green-600">${totalEarned.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-orange-600">${atRiskAmount.toLocaleString()}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Refunded</p>
              <p className="text-2xl font-bold text-red-600">${totalRefunded.toLocaleString()}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setViewMode('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                viewMode === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setViewMode('tracker')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                viewMode === 'tracker'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Commission Tracker
            </button>
          </nav>
        </div>

        <div className="p-6">
          {viewMode === 'overview' && <OverviewTab />}
          {viewMode === 'tracker' && <TrackerTab />}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && <CommissionDetailModal />}
    </div>
  )
}

export default CommissionTrackerPage

