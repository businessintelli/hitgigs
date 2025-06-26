import React, { useState, useEffect } from 'react'
import { Target, TrendingUp, Star, MapPin, Building, DollarSign, Clock, Zap, Filter, Search, Heart, Send, ExternalLink, RefreshCw, Award, CheckCircle, AlertTriangle } from 'lucide-react'

const AIJobMatchingPage = () => {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    experience: '',
    jobType: ''
  })
  const [matchPreferences, setMatchPreferences] = useState({
    prioritizeLocation: true,
    prioritizeSalary: true,
    prioritizeSkills: true,
    prioritizeCompany: false
  })

  const sampleMatches = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120,000 - $150,000",
      matchScore: 95,
      skills: ["React", "JavaScript", "Node.js", "TypeScript"],
      experience: "5+ years",
      jobType: "Full-time",
      remote: true,
      postedDate: "2 days ago",
      matchReasons: [
        "Perfect skill match (95%)",
        "Salary matches your expectations",
        "Remote work available",
        "Company culture fit"
      ],
      description: "We're looking for a Senior React Developer to join our growing team...",
      benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"]
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Austin, TX",
      salary: "$100,000 - $130,000",
      matchScore: 88,
      skills: ["React", "Python", "AWS", "Docker"],
      experience: "3+ years",
      jobType: "Full-time",
      remote: false,
      postedDate: "1 week ago",
      matchReasons: [
        "Strong skill overlap (88%)",
        "Growth opportunity",
        "Startup environment match",
        "Technology stack alignment"
      ],
      description: "Join our fast-growing startup as a Full Stack Engineer...",
      benefits: ["Equity", "Health Insurance", "Learning Budget", "Gym Membership"]
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$90,000 - $110,000",
      matchScore: 82,
      skills: ["React", "CSS", "JavaScript", "Figma"],
      experience: "2+ years",
      jobType: "Full-time",
      remote: true,
      postedDate: "3 days ago",
      matchReasons: [
        "Design-focused role match",
        "Remote work available",
        "Creative environment",
        "Skill compatibility"
      ],
      description: "We're seeking a creative Frontend Developer to bring designs to life...",
      benefits: ["Creative Freedom", "Remote Work", "Health Insurance", "PTO"]
    }
  ]

  useEffect(() => {
    // Simulate loading matches
    setIsLoading(true)
    setTimeout(() => {
      setMatches(sampleMatches)
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleRefreshMatches = () => {
    setIsLoading(true)
    setTimeout(() => {
      setMatches([...sampleMatches].sort(() => Math.random() - 0.5))
      setIsLoading(false)
    }, 1000)
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getMatchScoreIcon = (score) => {
    if (score >= 90) return <Star className="w-4 h-4" />
    if (score >= 80) return <TrendingUp className="w-4 h-4" />
    if (score >= 70) return <Target className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Job Matching</h1>
              <p className="text-gray-600">Discover jobs perfectly matched to your skills and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefreshMatches}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Matches
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.salary}
                    onChange={(e) => setFilters({...filters, salary: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="0-50k">$0 - $50k</option>
                    <option value="50k-100k">$50k - $100k</option>
                    <option value="100k-150k">$100k - $150k</option>
                    <option value="150k+">$150k+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.experience}
                    onChange={(e) => setFilters({...filters, experience: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead/Principal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.jobType}
                    onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Match Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Match Preferences
              </h3>
              
              <div className="space-y-3">
                {Object.entries(matchPreferences).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setMatchPreferences({...matchPreferences, [key]: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Job Matches */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Finding Your Perfect Matches</h3>
                <p className="text-gray-600">Our AI is analyzing thousands of jobs to find the best matches for you...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {matches.length} AI-Matched Jobs Found
                  </h2>
                  <div className="text-sm text-gray-600">
                    Sorted by match score
                  </div>
                </div>

                {matches.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 mr-3">{job.title}</h3>
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                              {getMatchScoreIcon(job.matchScore)}
                              <span className="ml-1">{job.matchScore}% Match</span>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600 space-x-4 mb-2">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.salary}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.postedDate}
                            </div>
                          </div>
                          {job.remote && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Remote Available
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Match Reasons */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Why this is a great match:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {job.matchReasons.map((reason, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {reason}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                            <Heart className="w-4 h-4 mr-1" />
                            Save Job
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Details
                          </button>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                          <Send className="w-4 h-4 mr-2" />
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIJobMatchingPage

