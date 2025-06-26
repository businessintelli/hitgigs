import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Download, 
  Send, 
  MessageSquare, 
  Building, 
  MapPin, 
  Star, 
  TrendingUp, 
  Filter, 
  Search, 
  SortAsc, 
  SortDesc, 
  FileText, 
  Phone, 
  Mail, 
  User, 
  Award, 
  Target, 
  Zap, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  ChevronRight, 
  ChevronDown, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Archive, 
  Bell, 
  BellOff 
} from 'lucide-react'

const OffersPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [offers, setOffers] = useState([])
  const [filteredOffers, setFilteredOffers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [showOfferDetails, setShowOfferDetails] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    salaryRange: 'all',
    jobType: 'all',
    location: 'all',
    dateRange: 'all'
  })
  const [sortBy, setSortBy] = useState('date_desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('list') // list or grid
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadOffers()
  }, [])

  useEffect(() => {
    filterAndSortOffers()
  }, [offers, filters, sortBy, searchTerm])

  const loadOffers = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to load job offers
      const sampleOffers = [
        {
          id: 1,
          jobTitle: 'Senior React Developer',
          company: 'TechCorp Inc.',
          companyLogo: '/api/placeholder/48/48',
          location: 'San Francisco, CA',
          jobType: 'Full-time',
          remote: true,
          salary: {
            min: 120000,
            max: 180000,
            currency: 'USD',
            period: 'yearly'
          },
          offeredSalary: 150000,
          status: 'pending', // pending, accepted, declined, expired, withdrawn
          offerDate: '2024-01-15',
          expiryDate: '2024-01-29',
          responseDeadline: '2024-01-25',
          benefits: [
            'Health Insurance',
            'Dental & Vision',
            '401(k) with matching',
            'Stock Options',
            'Remote Work',
            'Flexible Hours',
            'Learning Budget',
            'Gym Membership'
          ],
          startDate: '2024-02-15',
          probationPeriod: '3 months',
          vacationDays: 25,
          workingHours: '40 hours/week',
          reportingManager: 'Sarah Johnson',
          team: 'Frontend Development',
          department: 'Engineering',
          offerLetter: '/documents/offer-letter-1.pdf',
          contractType: 'Permanent',
          noticePeriod: '2 weeks',
          relocationAssistance: false,
          signingBonus: 10000,
          performanceBonus: 'Up to 20% of base salary',
          stockOptions: '1000 shares vesting over 4 years',
          notes: 'Excellent opportunity to work with cutting-edge technologies and a great team.',
          recruiterContact: {
            name: 'Mike Wilson',
            email: 'mike.wilson@techcorp.com',
            phone: '+1 (555) 123-4567'
          },
          hrContact: {
            name: 'Lisa Chen',
            email: 'lisa.chen@techcorp.com',
            phone: '+1 (555) 123-4568'
          },
          negotiable: true,
          priority: 'high',
          matchScore: 92,
          applicationDate: '2024-01-05',
          interviewDates: ['2024-01-08', '2024-01-12'],
          feedback: 'Strong technical skills and great cultural fit.'
        },
        {
          id: 2,
          jobTitle: 'Frontend Engineer',
          company: 'StartupXYZ',
          companyLogo: '/api/placeholder/48/48',
          location: 'Remote',
          jobType: 'Full-time',
          remote: true,
          salary: {
            min: 100000,
            max: 150000,
            currency: 'USD',
            period: 'yearly'
          },
          offeredSalary: 130000,
          status: 'accepted',
          offerDate: '2024-01-10',
          expiryDate: '2024-01-24',
          responseDeadline: '2024-01-20',
          acceptedDate: '2024-01-18',
          benefits: [
            'Health Insurance',
            'Equity Package',
            'Remote Work',
            'Flexible Hours',
            'Learning Budget',
            'Home Office Setup'
          ],
          startDate: '2024-02-01',
          probationPeriod: '6 months',
          vacationDays: 20,
          workingHours: 'Flexible',
          reportingManager: 'Alex Rodriguez',
          team: 'Product Development',
          department: 'Engineering',
          offerLetter: '/documents/offer-letter-2.pdf',
          contractType: 'Permanent',
          noticePeriod: '2 weeks',
          relocationAssistance: false,
          signingBonus: 5000,
          performanceBonus: 'Quarterly performance reviews',
          stockOptions: '0.5% equity vesting over 4 years',
          notes: 'Fast-growing startup with excellent growth opportunities.',
          recruiterContact: {
            name: 'Emma Davis',
            email: 'emma.davis@startupxyz.com',
            phone: '+1 (555) 234-5678'
          },
          hrContact: {
            name: 'Tom Brown',
            email: 'tom.brown@startupxyz.com',
            phone: '+1 (555) 234-5679'
          },
          negotiable: false,
          priority: 'medium',
          matchScore: 87,
          applicationDate: '2024-01-02',
          interviewDates: ['2024-01-06', '2024-01-09'],
          feedback: 'Great enthusiasm and startup mindset.'
        },
        {
          id: 3,
          jobTitle: 'Full Stack Developer',
          company: 'InnovateLab',
          companyLogo: '/api/placeholder/48/48',
          location: 'New York, NY',
          jobType: 'Full-time',
          remote: false,
          salary: {
            min: 110000,
            max: 160000,
            currency: 'USD',
            period: 'yearly'
          },
          offeredSalary: 140000,
          status: 'declined',
          offerDate: '2024-01-08',
          expiryDate: '2024-01-22',
          responseDeadline: '2024-01-18',
          declinedDate: '2024-01-16',
          declineReason: 'Accepted another offer with better remote work options',
          benefits: [
            'Health Insurance',
            'Dental & Vision',
            '401(k)',
            'Gym Membership',
            'Catered Meals',
            'Transit Benefits'
          ],
          startDate: '2024-02-12',
          probationPeriod: '3 months',
          vacationDays: 22,
          workingHours: '40 hours/week',
          reportingManager: 'David Kim',
          team: 'Full Stack Development',
          department: 'Engineering',
          offerLetter: '/documents/offer-letter-3.pdf',
          contractType: 'Permanent',
          noticePeriod: '2 weeks',
          relocationAssistance: true,
          signingBonus: 8000,
          performanceBonus: 'Annual performance bonus',
          stockOptions: 'None',
          notes: 'Great company culture and learning opportunities.',
          recruiterContact: {
            name: 'Jennifer Lee',
            email: 'jennifer.lee@innovatelab.com',
            phone: '+1 (555) 345-6789'
          },
          hrContact: {
            name: 'Robert Taylor',
            email: 'robert.taylor@innovatelab.com',
            phone: '+1 (555) 345-6790'
          },
          negotiable: true,
          priority: 'low',
          matchScore: 84,
          applicationDate: '2023-12-28',
          interviewDates: ['2024-01-03', '2024-01-05'],
          feedback: 'Strong technical background, good problem-solving skills.'
        },
        {
          id: 4,
          jobTitle: 'DevOps Engineer',
          company: 'CloudTech Solutions',
          companyLogo: '/api/placeholder/48/48',
          location: 'Austin, TX',
          jobType: 'Full-time',
          remote: true,
          salary: {
            min: 130000,
            max: 170000,
            currency: 'USD',
            period: 'yearly'
          },
          offeredSalary: 155000,
          status: 'expired',
          offerDate: '2024-01-05',
          expiryDate: '2024-01-19',
          responseDeadline: '2024-01-15',
          benefits: [
            'Health Insurance',
            'Stock Options',
            'Remote Work',
            'Tech Budget',
            'Conference Budget',
            'Flexible PTO'
          ],
          startDate: '2024-02-05',
          probationPeriod: '3 months',
          vacationDays: 'Unlimited',
          workingHours: 'Flexible',
          reportingManager: 'Maria Garcia',
          team: 'DevOps',
          department: 'Infrastructure',
          offerLetter: '/documents/offer-letter-4.pdf',
          contractType: 'Permanent',
          noticePeriod: '2 weeks',
          relocationAssistance: false,
          signingBonus: 12000,
          performanceBonus: 'Quarterly bonuses based on team performance',
          stockOptions: '2000 shares vesting over 4 years',
          notes: 'Cutting-edge cloud infrastructure work.',
          recruiterContact: {
            name: 'Chris Anderson',
            email: 'chris.anderson@cloudtech.com',
            phone: '+1 (555) 456-7890'
          },
          hrContact: {
            name: 'Nancy White',
            email: 'nancy.white@cloudtech.com',
            phone: '+1 (555) 456-7891'
          },
          negotiable: true,
          priority: 'high',
          matchScore: 89,
          applicationDate: '2023-12-20',
          interviewDates: ['2023-12-28', '2024-01-02'],
          feedback: 'Excellent DevOps expertise and cloud knowledge.'
        }
      ]

      setOffers(sampleOffers)
    } catch (error) {
      console.error('Failed to load offers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortOffers = () => {
    let filtered = [...offers]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(offer => offer.status === filters.status)
    }

    // Apply salary range filter
    if (filters.salaryRange !== 'all') {
      const [min, max] = filters.salaryRange.split('-').map(Number)
      filtered = filtered.filter(offer => {
        const salary = offer.offeredSalary
        if (max) {
          return salary >= min && salary <= max
        } else {
          return salary >= min
        }
      })
    }

    // Apply job type filter
    if (filters.jobType !== 'all') {
      filtered = filtered.filter(offer => offer.jobType === filters.jobType)
    }

    // Apply location filter
    if (filters.location !== 'all') {
      if (filters.location === 'remote') {
        filtered = filtered.filter(offer => offer.remote)
      } else {
        filtered = filtered.filter(offer => !offer.remote)
      }
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (filters.dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          break
        default:
          break
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(offer => new Date(offer.offerDate) >= filterDate)
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.offerDate) - new Date(a.offerDate)
        case 'date_asc':
          return new Date(a.offerDate) - new Date(b.offerDate)
        case 'salary_desc':
          return b.offeredSalary - a.offeredSalary
        case 'salary_asc':
          return a.offeredSalary - b.offeredSalary
        case 'company_asc':
          return a.company.localeCompare(b.company)
        case 'company_desc':
          return b.company.localeCompare(a.company)
        case 'match_score':
          return (b.matchScore || 0) - (a.matchScore || 0)
        default:
          return 0
      }
    })

    setFilteredOffers(filtered)
  }

  const handleOfferAction = async (offerId, action, data = {}) => {
    try {
      // Simulate API call
      const updatedOffers = offers.map(offer => {
        if (offer.id === offerId) {
          const updatedOffer = { ...offer }
          
          switch (action) {
            case 'accept':
              updatedOffer.status = 'accepted'
              updatedOffer.acceptedDate = new Date().toISOString().split('T')[0]
              break
            case 'decline':
              updatedOffer.status = 'declined'
              updatedOffer.declinedDate = new Date().toISOString().split('T')[0]
              updatedOffer.declineReason = data.reason || 'No reason provided'
              break
            case 'negotiate':
              // Handle negotiation logic
              break
            case 'archive':
              updatedOffer.archived = true
              break
            default:
              break
          }
          
          return updatedOffer
        }
        return offer
      })

      setOffers(updatedOffers)
      
      // Show success message
      alert(`Offer ${action}ed successfully!`)
    } catch (error) {
      console.error(`Failed to ${action} offer:`, error)
      alert(`Failed to ${action} offer. Please try again.`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'accepted':
        return 'text-green-600 bg-green-100'
      case 'declined':
        return 'text-red-600 bg-red-100'
      case 'expired':
        return 'text-gray-600 bg-gray-100'
      case 'withdrawn':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />
      case 'accepted':
        return <CheckCircle size={16} />
      case 'declined':
        return <XCircle size={16} />
      case 'expired':
        return <AlertCircle size={16} />
      case 'withdrawn':
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const renderOfferCard = (offer) => (
    <div key={offer.id} className="offer-card card hover:shadow-lg transition-all duration-200">
      {/* Offer Header */}
      <div className="offer-header flex justify-between items-start mb-4">
        <div className="offer-info flex items-start">
          <img 
            src={offer.companyLogo} 
            alt={offer.company}
            className="w-12 h-12 rounded-lg border border-gray-200 mr-4"
          />
          <div className="offer-details">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold text-gray-900">{offer.jobTitle}</h3>
              {offer.priority === 'high' && (
                <Star size={16} className={getPriorityColor(offer.priority)} />
              )}
            </div>
            <p className="text-gray-600 font-medium">{offer.company}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {offer.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={14} />
                {offer.jobType}
              </span>
              {offer.remote && (
                <span className="badge bg-blue-100 text-blue-800 text-xs">Remote</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="offer-meta text-right">
          <div className={`status-badge badge ${getStatusColor(offer.status)} flex items-center gap-1 mb-2`}>
            {getStatusIcon(offer.status)}
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatSalary(offer.offeredSalary)}
          </div>
          {offer.matchScore && (
            <div className="text-sm text-blue-600 font-medium">
              {offer.matchScore}% match
            </div>
          )}
        </div>
      </div>

      {/* Offer Details */}
      <div className="offer-details-section mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Offer Date:</span>
            <div className="font-medium">{formatDate(offer.offerDate)}</div>
          </div>
          <div>
            <span className="text-gray-500">Start Date:</span>
            <div className="font-medium">{formatDate(offer.startDate)}</div>
          </div>
          <div>
            <span className="text-gray-500">Response By:</span>
            <div className="font-medium">{formatDate(offer.responseDeadline)}</div>
          </div>
          <div>
            <span className="text-gray-500">Days Left:</span>
            <div className={`font-medium ${getDaysUntilExpiry(offer.expiryDate) <= 3 ? 'text-red-600' : 'text-green-600'}`}>
              {getDaysUntilExpiry(offer.expiryDate)} days
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Preview */}
      <div className="benefits-preview mb-4">
        <div className="flex flex-wrap gap-2">
          {offer.benefits.slice(0, 4).map((benefit, index) => (
            <span key={index} className="benefit-tag badge bg-gray-100 text-gray-700 text-xs">
              {benefit}
            </span>
          ))}
          {offer.benefits.length > 4 && (
            <span className="text-sm text-gray-500">
              +{offer.benefits.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="offer-actions flex justify-between items-center">
        <div className="action-buttons flex gap-2">
          <button 
            className="btn btn-secondary btn-sm flex items-center gap-2"
            onClick={() => {
              setSelectedOffer(offer)
              setShowOfferDetails(true)
            }}
          >
            <Eye size={14} />
            View Details
          </button>
          
          {offer.offerLetter && (
            <button className="btn btn-secondary btn-sm flex items-center gap-2">
              <Download size={14} />
              Download
            </button>
          )}
        </div>
        
        {offer.status === 'pending' && (
          <div className="primary-actions flex gap-2">
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => handleOfferAction(offer.id, 'decline')}
            >
              Decline
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => handleOfferAction(offer.id, 'accept')}
            >
              Accept Offer
            </button>
          </div>
        )}
        
        {offer.status === 'accepted' && (
          <div className="text-green-600 font-medium flex items-center gap-1">
            <CheckCircle size={16} />
            Accepted
          </div>
        )}
        
        {offer.status === 'declined' && (
          <div className="text-red-600 font-medium flex items-center gap-1">
            <XCircle size={16} />
            Declined
          </div>
        )}
      </div>
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredOffers.map(offer => renderOfferCard(offer))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {filteredOffers.map(offer => renderOfferCard(offer))}
    </div>
  )

  return (
    <div className="offers-page">
      <div className="page-header mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Offers</h1>
            <p className="text-gray-600">
              Manage your job offers and track application progress
            </p>
          </div>
          
          <div className="header-actions flex items-center gap-3">
            <button
              className="btn btn-secondary"
              onClick={loadOffers}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section mb-6">
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="search-box flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3" size={16} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Search offers by job title, company, or location..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-controls flex items-center gap-3">
              <select
                className="input-sm"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="expired">Expired</option>
              </select>
              
              <select
                className="input-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="salary_desc">Highest Salary</option>
                <option value="salary_asc">Lowest Salary</option>
                <option value="match_score">Best Match</option>
              </select>
              
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? 'Hide' : 'More'} Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="advanced-filters pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <select
                    className="input"
                    value={filters.salaryRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                  >
                    <option value="all">Any Salary</option>
                    <option value="50000-80000">$50k - $80k</option>
                    <option value="80000-120000">$80k - $120k</option>
                    <option value="120000-160000">$120k - $160k</option>
                    <option value="160000">$160k+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    className="input"
                    value={filters.jobType}
                    onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    className="input"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">On-site Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    className="input"
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  >
                    <option value="all">All Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="quarter">Past 3 Months</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary and View Toggle */}
      <div className="results-header mb-6">
        <div className="flex justify-between items-center">
          <div className="results-summary">
            <p className="text-gray-600">
              Showing {filteredOffers.length} offer{filteredOffers.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
          
          <div className="view-toggle flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="btn-group">
              <button
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offers List/Grid */}
      <div className="offers-content">
        {isLoading ? (
          <div className="loading-state text-center py-12">
            <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Offers...</h3>
            <p className="text-gray-600">Please wait while we fetch your job offers</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="empty-state text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Job Offers Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? 'Try adjusting your search criteria or filters'
                : 'You haven\'t received any job offers yet. Keep applying to great opportunities!'
              }
            </p>
            <div className="flex justify-center gap-3">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/jobs')}
              >
                Browse Jobs
              </button>
              {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchTerm('')
                    setFilters({
                      status: 'all',
                      salaryRange: 'all',
                      jobType: 'all',
                      location: 'all',
                      dateRange: 'all'
                    })
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          viewMode === 'grid' ? renderGridView() : renderListView()
        )}
      </div>

      <style jsx>{`
        .offers-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 24px;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .offer-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }

        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .input-sm {
          padding: 6px 8px;
          font-size: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #8b5cf6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #7c3aed;
        }

        .btn-secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f8fafc;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-group {
          display: flex;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #d1d5db;
        }

        .btn-group .btn {
          border-radius: 0;
          border: none;
          border-right: 1px solid #d1d5db;
        }

        .btn-group .btn:last-child {
          border-right: none;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge {
          font-size: 11px;
          padding: 3px 6px;
        }

        .benefit-tag {
          font-size: 10px;
          padding: 2px 6px;
          text-transform: none;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .offers-page {
            padding: 16px;
          }

          .offer-header {
            flex-direction: column;
            gap: 16px;
          }

          .offer-meta {
            text-align: left;
          }

          .offer-actions {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .action-buttons {
            justify-content: stretch;
          }

          .action-buttons .btn {
            flex: 1;
            justify-content: center;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default OffersPage

