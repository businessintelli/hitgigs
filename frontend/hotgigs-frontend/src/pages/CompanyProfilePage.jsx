import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Building, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Calendar,
  Edit,
  Save,
  X,
  Upload,
  Camera,
  Plus,
  Trash2,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Award,
  Target,
  Heart,
  Briefcase,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const CompanyProfilePage = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  const [companyData, setCompanyData] = useState({
    name: 'TechCorp Solutions',
    tagline: 'Innovating the Future of Technology',
    description: 'TechCorp Solutions is a leading technology company specializing in innovative software solutions and digital transformation services. We help businesses leverage cutting-edge technology to achieve their goals and stay competitive in the digital age.',
    website: 'https://techcorp.com',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    industry: 'Technology',
    company_size: '51-200 employees',
    founded_year: '2015',
    headquarters: 'San Francisco, CA, USA',
    logo_url: '',
    cover_image_url: '',
    social_links: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      facebook: '',
      instagram: '',
      youtube: ''
    },
    locations: [
      {
        id: 1,
        name: 'Headquarters',
        address: '123 Tech Street, San Francisco, CA 94105',
        type: 'Main Office',
        employees: 150
      },
      {
        id: 2,
        name: 'Austin Office',
        address: '456 Innovation Blvd, Austin, TX 78701',
        type: 'Branch Office',
        employees: 75
      }
    ],
    benefits: [
      'Health Insurance',
      'Dental & Vision',
      '401(k) Matching',
      'Flexible Work Hours',
      'Remote Work Options',
      'Professional Development',
      'Paid Time Off',
      'Stock Options'
    ],
    values: [
      {
        title: 'Innovation',
        description: 'We constantly push boundaries and embrace new technologies'
      },
      {
        title: 'Collaboration',
        description: 'We believe in the power of teamwork and diverse perspectives'
      },
      {
        title: 'Excellence',
        description: 'We strive for the highest quality in everything we do'
      },
      {
        title: 'Integrity',
        description: 'We conduct business with honesty and transparency'
      }
    ],
    certifications: [
      'ISO 9001:2015',
      'SOC 2 Type II',
      'GDPR Compliant',
      'AWS Partner'
    ]
  })

  const [formData, setFormData] = useState(companyData)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCompanyData(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save company profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(companyData)
    setIsEditing(false)
  }

  const addLocation = () => {
    const newLocation = {
      id: Date.now(),
      name: '',
      address: '',
      type: 'Branch Office',
      employees: 0
    }
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }))
  }

  const removeLocation = (locationId) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== locationId)
    }))
  }

  const updateLocation = (locationId, field, value) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.map(loc => 
        loc.id === locationId ? { ...loc, [field]: value } : loc
      )
    }))
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'culture', label: 'Culture & Values', icon: Heart },
    { id: 'benefits', label: 'Benefits', icon: Award }
  ]

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Media', 'Real Estate', 'Non-profit', 'Other'
  ]

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-500 employees', '501-1000 employees', '1000+ employees'
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg relative">
            {isEditing && (
              <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Company Info */}
          <div className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                {/* Logo */}
                <div className="relative -mt-16">
                  <div className="w-24 h-24 bg-white rounded-lg shadow-lg border-4 border-white flex items-center justify-center">
                    {companyData.logo_url ? (
                      <img src={companyData.logo_url} alt="Company Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Company Details */}
                <div className="pt-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        className="text-gray-600 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                        placeholder="Company tagline"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{companyData.name}</h1>
                      <p className="text-gray-600 mt-1">{companyData.tagline}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {companyData.industry}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {companyData.company_size}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Founded {companyData.founded_year}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {companyData.headquarters}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
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
              <div className="space-y-8">
                {/* About Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your company..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{companyData.description}</p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 text-gray-400 mr-3" />
                        {isEditing ? (
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://company.com"
                          />
                        ) : (
                          <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                            {companyData.website}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        {isEditing ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="contact@company.com"
                          />
                        ) : (
                          <span className="text-gray-600">{companyData.email}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 (555) 123-4567"
                          />
                        ) : (
                          <span className="text-gray-600">{companyData.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        {isEditing ? (
                          <select
                            value={formData.industry}
                            onChange={(e) => handleInputChange('industry', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {industries.map(industry => (
                              <option key={industry} value={industry}>{industry}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-600">{companyData.industry}</span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                        {isEditing ? (
                          <select
                            value={formData.company_size}
                            onChange={(e) => handleInputChange('company_size', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {companySizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-600">{companyData.company_size}</span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={formData.founded_year}
                            onChange={(e) => handleInputChange('founded_year', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1800"
                            max={new Date().getFullYear()}
                          />
                        ) : (
                          <span className="text-gray-600">{companyData.founded_year}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.social_links).map(([platform, url]) => {
                      const icons = {
                        linkedin: Linkedin,
                        twitter: Twitter,
                        facebook: Facebook,
                        instagram: Instagram,
                        youtube: Youtube
                      }
                      const Icon = icons[platform]
                      
                      return (
                        <div key={platform} className="flex items-center">
                          <Icon className="w-5 h-5 text-gray-400 mr-3" />
                          {isEditing ? (
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`https://${platform}.com/company`}
                            />
                          ) : (
                            url ? (
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            ) : (
                              <span className="text-gray-400">Not set</span>
                            )
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications & Compliance</h3>
                  <div className="flex flex-wrap gap-2">
                    {companyData.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Locations Tab */}
            {activeTab === 'locations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Office Locations</h3>
                  {isEditing && (
                    <button
                      onClick={addLocation}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Location
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.locations.map((location) => (
                    <div key={location.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={location.name}
                            onChange={(e) => updateLocation(location.id, 'name', e.target.value)}
                            className="font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                            placeholder="Location name"
                          />
                        ) : (
                          <h4 className="font-medium text-gray-900">{location.name}</h4>
                        )}
                        {isEditing && (
                          <button
                            onClick={() => removeLocation(location.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {isEditing ? (
                            <textarea
                              value={location.address}
                              onChange={(e) => updateLocation(location.id, 'address', e.target.value)}
                              className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none resize-none"
                              placeholder="Full address"
                              rows={2}
                            />
                          ) : (
                            <span>{location.address}</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          {isEditing ? (
                            <select
                              value={location.type}
                              onChange={(e) => updateLocation(location.id, 'type', e.target.value)}
                              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                            >
                              <option value="Main Office">Main Office</option>
                              <option value="Branch Office">Branch Office</option>
                              <option value="Remote Hub">Remote Hub</option>
                              <option value="Co-working Space">Co-working Space</option>
                            </select>
                          ) : (
                            <span>{location.type}</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {isEditing ? (
                            <input
                              type="number"
                              value={location.employees}
                              onChange={(e) => updateLocation(location.id, 'employees', parseInt(e.target.value) || 0)}
                              className="w-20 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                              min="0"
                            />
                          ) : (
                            <span>{location.employees}</span>
                          )}
                          <span className="ml-1">employees</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Culture & Values Tab */}
            {activeTab === 'culture' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companyData.values.map((value, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{value.title}</h4>
                        <p className="text-gray-600 text-sm">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Employee Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfilePage

