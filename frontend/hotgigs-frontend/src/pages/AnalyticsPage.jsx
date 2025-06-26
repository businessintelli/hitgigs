import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Eye, 
  Clock, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw, 
  Settings, 
  Share, 
  Mail, 
  FileText, 
  Target, 
  Award, 
  Activity, 
  Zap, 
  Globe, 
  Building, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Database,
  Layers,
  Grid,
  List,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Timer,
  Heart,
  MessageSquare,
  Phone,
  Bookmark,
  Flag,
  Archive
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const AnalyticsPage = () => {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('applications')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock analytics data - replace with actual API calls
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      total_jobs: 24,
      active_jobs: 18,
      total_applications: 1247,
      total_views: 8934,
      avg_time_to_hire: 21,
      cost_per_hire: 3200,
      application_rate: 13.9,
      conversion_rate: 8.2
    },
    trends: {
      applications: [
        { date: '2024-01-01', value: 45 },
        { date: '2024-01-02', value: 52 },
        { date: '2024-01-03', value: 38 },
        { date: '2024-01-04', value: 61 },
        { date: '2024-01-05', value: 55 },
        { date: '2024-01-06', value: 67 },
        { date: '2024-01-07', value: 73 }
      ],
      views: [
        { date: '2024-01-01', value: 234 },
        { date: '2024-01-02', value: 287 },
        { date: '2024-01-03', value: 198 },
        { date: '2024-01-04', value: 345 },
        { date: '2024-01-05', value: 312 },
        { date: '2024-01-06', value: 398 },
        { date: '2024-01-07', value: 421 }
      ]
    },
    jobPerformance: [
      { job: 'Senior React Developer', applications: 89, views: 456, conversion: 19.5 },
      { job: 'Product Manager', applications: 67, views: 234, conversion: 28.6 },
      { job: 'UX Designer', applications: 45, views: 189, conversion: 23.8 },
      { job: 'Data Scientist', applications: 123, views: 567, conversion: 21.7 },
      { job: 'DevOps Engineer', applications: 34, views: 145, conversion: 23.4 }
    ],
    sourceAnalytics: [
      { source: 'Direct Apply', applications: 456, percentage: 36.6, color: '#3B82F6' },
      { source: 'LinkedIn', applications: 298, percentage: 23.9, color: '#10B981' },
      { source: 'Indeed', applications: 234, percentage: 18.8, color: '#F59E0B' },
      { source: 'Company Website', applications: 156, percentage: 12.5, color: '#EF4444' },
      { source: 'Referrals', applications: 103, percentage: 8.2, color: '#8B5CF6' }
    ],
    departmentStats: [
      { department: 'Engineering', jobs: 12, applications: 567, avg_salary: 125000 },
      { department: 'Product', jobs: 4, applications: 234, avg_salary: 110000 },
      { department: 'Design', jobs: 3, applications: 156, avg_salary: 95000 },
      { department: 'Marketing', jobs: 2, applications: 89, avg_salary: 85000 },
      { department: 'Sales', jobs: 3, applications: 201, avg_salary: 90000 }
    ],
    hiringFunnel: [
      { stage: 'Applications', count: 1247, percentage: 100 },
      { stage: 'Screening', count: 623, percentage: 50 },
      { stage: 'Phone Interview', count: 312, percentage: 25 },
      { stage: 'Technical Interview', count: 156, percentage: 12.5 },
      { stage: 'Final Interview', count: 78, percentage: 6.3 },
      { stage: 'Offers', count: 39, percentage: 3.1 },
      { stage: 'Hired', count: 24, percentage: 1.9 }
    ],
    timeToHire: [
      { role: 'Software Engineer', days: 18 },
      { role: 'Product Manager', days: 25 },
      { role: 'Designer', days: 22 },
      { role: 'Data Scientist', days: 28 },
      { role: 'DevOps Engineer', days: 20 }
    ],
    salaryAnalysis: [
      { range: '$60k-80k', count: 156, percentage: 12.5 },
      { range: '$80k-100k', count: 298, percentage: 23.9 },
      { range: '$100k-120k', count: 456, percentage: 36.6 },
      { range: '$120k-150k', count: 234, percentage: 18.8 },
      { range: '$150k+', count: 103, percentage: 8.2 }
    ]
  })

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ]

  const metrics = [
    { value: 'applications', label: 'Applications', icon: Users },
    { value: 'views', label: 'Job Views', icon: Eye },
    { value: 'conversion', label: 'Conversion Rate', icon: Target },
    { value: 'time_to_hire', label: 'Time to Hire', icon: Clock }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Job Performance', icon: Briefcase },
    { id: 'sources', label: 'Source Analytics', icon: Globe },
    { id: 'funnel', label: 'Hiring Funnel', icon: Target },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'reports', label: 'Reports', icon: FileText }
  ]

  const getChangeIcon = (change) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const exportReport = (format) => {
    // Simulate export functionality
    console.log(`Exporting analytics report in ${format} format`)
    // In real implementation, this would generate and download the report
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Insights and performance metrics for your hiring</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              <button
                onClick={() => setLoading(true)}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="relative">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {/* Export dropdown would go here */}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-900">{formatNumber(analyticsData.overview.total_applications)}</p>
                  <div className="flex items-center mt-2">
                    {getChangeIcon(12.5)}
                    <span className={`text-sm ml-1 ${getChangeColor(12.5)}`}>+12.5% vs last period</span>
                  </div>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Job Views</p>
                  <p className="text-3xl font-bold text-green-900">{formatNumber(analyticsData.overview.total_views)}</p>
                  <div className="flex items-center mt-2">
                    {getChangeIcon(8.3)}
                    <span className={`text-sm ml-1 ${getChangeColor(8.3)}`}>+8.3% vs last period</span>
                  </div>
                </div>
                <Eye className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-purple-900">{analyticsData.overview.conversion_rate}%</p>
                  <div className="flex items-center mt-2">
                    {getChangeIcon(-2.1)}
                    <span className={`text-sm ml-1 ${getChangeColor(-2.1)}`}>-2.1% vs last period</span>
                  </div>
                </div>
                <Target className="w-12 h-12 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg. Time to Hire</p>
                  <p className="text-3xl font-bold text-orange-900">{analyticsData.overview.avg_time_to_hire} days</p>
                  <div className="flex items-center mt-2">
                    {getChangeIcon(-3.2)}
                    <span className={`text-sm ml-1 ${getChangeColor(-3.2)}`}>-3.2 days vs last period</span>
                  </div>
                </div>
                <Clock className="w-12 h-12 text-orange-600" />
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Application Trends Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Application Trends</h3>
                    <div className="flex items-center space-x-2">
                      {metrics.map(metric => {
                        const Icon = metric.icon
                        return (
                          <button
                            key={metric.value}
                            onClick={() => setSelectedMetric(metric.value)}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedMetric === metric.value
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {metric.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.trends.applications}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.active_jobs}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <DollarSign className="w-8 h-8 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Cost per Hire</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.cost_per_hire)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <Target className="w-8 h-8 text-purple-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Application Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.application_rate}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                        <p className="text-2xl font-bold text-gray-900">+15.3%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Performance Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Jobs</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyticsData.jobPerformance.map((job, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{job.job}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{job.applications}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{job.views}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{job.conversion}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900">View Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Source Analytics Tab */}
            {activeTab === 'sources' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Sources</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={analyticsData.sourceAnalytics}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="applications"
                            label={({ source, percentage }) => `${source}: ${percentage}%`}
                          >
                            {analyticsData.sourceAnalytics.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Performance</h3>
                    <div className="space-y-4">
                      {analyticsData.sourceAnalytics.map((source, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: source.color }}></div>
                            <span className="text-sm font-medium text-gray-900">{source.source}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{source.applications}</div>
                            <div className="text-xs text-gray-500">{source.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hiring Funnel Tab */}
            {activeTab === 'funnel' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Funnel</h3>
                  <div className="space-y-4">
                    {analyticsData.hiringFunnel.map((stage, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-32 text-sm font-medium text-gray-900">{stage.stage}</div>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-6">
                            <div
                              className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                              style={{ width: `${stage.percentage}%` }}
                            >
                              {stage.percentage}%
                            </div>
                          </div>
                        </div>
                        <div className="w-20 text-right text-sm font-medium text-gray-900">{stage.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Jobs</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Salary</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyticsData.departmentStats.map((dept, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{dept.department}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{dept.jobs}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{dept.applications}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(dept.avg_salary)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900">View Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <FileText className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Hiring Report</h4>
                        <p className="text-sm text-gray-500">Comprehensive hiring analytics</p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportReport('pdf')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Performance Report</h4>
                        <p className="text-sm text-gray-500">Job and team performance metrics</p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportReport('excel')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Excel
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Target className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Funnel Analysis</h4>
                        <p className="text-sm text-gray-500">Detailed conversion analysis</p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportReport('csv')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Hiring Analytics</option>
                        <option>Source Performance</option>
                        <option>Department Analysis</option>
                        <option>Time to Hire</option>
                        <option>Cost Analysis</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Last 6 months</option>
                        <option>Last year</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Custom Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage

