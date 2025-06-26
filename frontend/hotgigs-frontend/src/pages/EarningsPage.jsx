import React, { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter, 
  Eye,
  CreditCard,
  PieChart,
  BarChart3,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts'

const EarningsPage = () => {
  const [earningsData, setEarningsData] = useState([
    {
      id: 1,
      month: 'January 2024',
      totalEarnings: 45000,
      commissions: 42000,
      bonuses: 3000,
      placements: 3,
      avgCommissionPerPlacement: 14000,
      status: 'Paid',
      paymentDate: '2024-02-01',
      clients: ['TechCorp Solutions', 'Global Finance Inc', 'Creative Agency Pro']
    },
    {
      id: 2,
      month: 'December 2023',
      totalEarnings: 38000,
      commissions: 35000,
      bonuses: 3000,
      placements: 2,
      avgCommissionPerPlacement: 17500,
      status: 'Paid',
      paymentDate: '2024-01-01',
      clients: ['Analytics Corp', 'Design Studio Inc']
    },
    {
      id: 3,
      month: 'November 2023',
      totalEarnings: 52000,
      commissions: 48000,
      bonuses: 4000,
      placements: 4,
      avgCommissionPerPlacement: 12000,
      status: 'Paid',
      paymentDate: '2023-12-01',
      clients: ['TechCorp Solutions', 'Global Finance Inc', 'Healthcare Plus', 'Construction Corp']
    },
    {
      id: 4,
      month: 'October 2023',
      totalEarnings: 29000,
      commissions: 26000,
      bonuses: 3000,
      placements: 2,
      avgCommissionPerPlacement: 13000,
      status: 'Paid',
      paymentDate: '2023-11-01',
      clients: ['Creative Agency Pro', 'Analytics Corp']
    }
  ])

  const [pendingEarnings, setPendingEarnings] = useState([
    {
      id: 1,
      candidateName: 'Alex Thompson',
      position: 'Senior DevOps Engineer',
      client: 'TechCorp Solutions',
      placementDate: '2024-01-15',
      expectedCommission: 28000,
      commissionRate: 20,
      status: 'Pending Payment',
      dueDate: '2024-02-15',
      guaranteePeriod: '90 days',
      daysRemaining: 45
    },
    {
      id: 2,
      candidateName: 'Maria Garcia',
      position: 'Marketing Director',
      client: 'Creative Agency Pro',
      placementDate: '2024-01-10',
      expectedCommission: 22000,
      commissionRate: 20,
      status: 'In Guarantee Period',
      dueDate: '2024-02-10',
      guaranteePeriod: '90 days',
      daysRemaining: 40
    }
  ])

  const [selectedPeriod, setSelectedPeriod] = useState('All Time')
  const [viewMode, setViewMode] = useState('overview') // overview, monthly, pending

  // Chart data
  const monthlyTrend = [
    { month: 'Oct', earnings: 29000, placements: 2 },
    { month: 'Nov', earnings: 52000, placements: 4 },
    { month: 'Dec', earnings: 38000, placements: 2 },
    { month: 'Jan', earnings: 45000, placements: 3 }
  ]

  const earningsByClient = [
    { name: 'TechCorp Solutions', value: 70000, color: '#3B82F6' },
    { name: 'Global Finance Inc', value: 35000, color: '#10B981' },
    { name: 'Creative Agency Pro', value: 25000, color: '#F59E0B' },
    { name: 'Analytics Corp', value: 26000, color: '#EF4444' },
    { name: 'Others', value: 8000, color: '#8B5CF6' }
  ]

  const quarterlyData = [
    { quarter: 'Q1 2023', earnings: 95000, placements: 6 },
    { quarter: 'Q2 2023', earnings: 120000, placements: 8 },
    { quarter: 'Q3 2023', earnings: 110000, placements: 7 },
    { quarter: 'Q4 2023', earnings: 164000, placements: 11 }
  ]

  // Calculate stats
  const totalEarnings = earningsData.reduce((sum, item) => sum + item.totalEarnings, 0)
  const totalPlacements = earningsData.reduce((sum, item) => sum + item.placements, 0)
  const avgEarningsPerMonth = Math.round(totalEarnings / earningsData.length)
  const avgEarningsPerPlacement = Math.round(totalEarnings / totalPlacements)
  const pendingAmount = pendingEarnings.reduce((sum, item) => sum + item.expectedCommission, 0)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending Payment': return 'bg-yellow-100 text-yellow-800'
      case 'In Guarantee Period': return 'bg-blue-100 text-blue-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-4 h-4" />
      case 'Pending Payment': return <Clock className="w-4 h-4" />
      case 'In Guarantee Period': return <AlertCircle className="w-4 h-4" />
      case 'Overdue': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Monthly Earnings Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [name === 'earnings' ? `$${value.toLocaleString()}` : value, name === 'earnings' ? 'Earnings' : 'Placements']} />
            <Line type="monotone" dataKey="earnings" stroke="#3B82F6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings by Client */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Client</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={earningsByClient}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {earningsByClient.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Quarterly Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip formatter={(value, name) => [name === 'earnings' ? `$${value.toLocaleString()}` : value, name === 'earnings' ? 'Earnings' : 'Placements']} />
              <Bar dataKey="earnings" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Months */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placements</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per Placement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {earningsData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-green-600">${item.totalEarnings.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.placements}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.avgCommissionPerPlacement.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const PendingTab = () => (
    <div className="space-y-6">
      {/* Pending Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Placements</p>
              <p className="text-2xl font-bold text-blue-600">{pendingEarnings.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Days to Payment</p>
              <p className="text-2xl font-bold text-purple-600">32</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Pending Earnings Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending Earnings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placement Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Remaining</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingEarnings.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.candidateName}</div>
                      <div className="text-sm text-gray-500">{item.position}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.placementDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${item.expectedCommission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-medium ${item.daysRemaining < 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.daysRemaining} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600">Track your earnings, commissions, and financial performance</p>
        </div>
        <div className="flex space-x-2">
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
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
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
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Month</p>
              <p className="text-2xl font-bold text-gray-900">${avgEarningsPerMonth.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Placement</p>
              <p className="text-2xl font-bold text-gray-900">${avgEarningsPerPlacement.toLocaleString()}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
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
              onClick={() => setViewMode('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                viewMode === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Pending Earnings
              {pendingEarnings.length > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {pendingEarnings.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {viewMode === 'overview' && <OverviewTab />}
          {viewMode === 'pending' && <PendingTab />}
        </div>
      </div>
    </div>
  )
}

export default EarningsPage

