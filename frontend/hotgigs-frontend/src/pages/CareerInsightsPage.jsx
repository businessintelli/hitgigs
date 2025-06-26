import React, { useState } from 'react'
import { TrendingUp, BarChart3, Target, Award, DollarSign, MapPin, Users, Briefcase, Star, ArrowUp, ArrowDown, Minus, Calendar, Eye, BookOpen, Lightbulb, CheckCircle } from 'lucide-react'

const CareerInsightsPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedRole, setSelectedRole] = useState('frontend-developer')

  const careerData = {
    currentRole: "Frontend Developer",
    experience: "3 years",
    location: "San Francisco, CA",
    skills: ["React", "JavaScript", "CSS", "TypeScript", "Node.js"],
    salaryRange: "$95,000 - $120,000"
  }

  const marketInsights = {
    demandTrend: {
      current: "High",
      change: "+15%",
      trend: "up",
      description: "Frontend Developer demand has increased 15% in the last 6 months"
    },
    salaryTrends: {
      average: "$110,000",
      change: "+8%",
      trend: "up",
      percentile: "75th",
      description: "Your current salary is in the 75th percentile for your role and location"
    },
    skillDemand: [
      { skill: "React", demand: "Very High", growth: "+20%", trend: "up" },
      { skill: "TypeScript", demand: "High", growth: "+35%", trend: "up" },
      { skill: "Next.js", demand: "High", growth: "+45%", trend: "up" },
      { skill: "Vue.js", demand: "Medium", growth: "+10%", trend: "up" },
      { skill: "Angular", demand: "Medium", growth: "-5%", trend: "down" }
    ]
  }

  const careerPaths = [
    {
      role: "Senior Frontend Developer",
      timeframe: "1-2 years",
      salaryRange: "$130,000 - $160,000",
      requirements: ["Advanced React", "Team Leadership", "Architecture Design"],
      probability: "High",
      description: "Natural progression with your current skills"
    },
    {
      role: "Full Stack Developer",
      timeframe: "1-3 years",
      salaryRange: "$125,000 - $155,000",
      requirements: ["Backend Development", "Database Design", "API Development"],
      probability: "Medium",
      description: "Expand into backend technologies"
    },
    {
      role: "Frontend Architect",
      timeframe: "3-5 years",
      salaryRange: "$160,000 - $200,000",
      requirements: ["System Design", "Technical Leadership", "Mentoring"],
      probability: "Medium",
      description: "Focus on architecture and technical leadership"
    },
    {
      role: "Engineering Manager",
      timeframe: "2-4 years",
      salaryRange: "$150,000 - $190,000",
      requirements: ["People Management", "Project Management", "Strategic Planning"],
      probability: "Low",
      description: "Transition to management track"
    }
  ]

  const skillRecommendations = [
    {
      skill: "Next.js",
      priority: "High",
      reason: "45% growth in demand",
      timeToLearn: "2-3 months",
      impact: "High salary impact (+$15k average)"
    },
    {
      skill: "GraphQL",
      priority: "Medium",
      reason: "Increasingly popular with React",
      timeToLearn: "1-2 months",
      impact: "Medium salary impact (+$8k average)"
    },
    {
      skill: "AWS/Cloud",
      priority: "High",
      reason: "Essential for full-stack roles",
      timeToLearn: "3-4 months",
      impact: "High career growth potential"
    },
    {
      skill: "Testing (Jest/Cypress)",
      priority: "Medium",
      reason: "Quality assurance focus",
      timeToLearn: "1 month",
      impact: "Better job opportunities"
    }
  ]

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-500" />
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-600 bg-green-100'
    if (trend === 'down') return 'text-red-600 bg-red-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getProbabilityColor = (probability) => {
    if (probability === 'High') return 'text-green-600 bg-green-100'
    if (probability === 'Medium') return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-red-600 bg-red-100'
    if (priority === 'Medium') return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Insights</h1>
              <p className="text-gray-600">AI-powered insights to accelerate your career growth</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
                <option value="2years">Last 2 years</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Your Profile
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Role</label>
                  <p className="text-lg font-semibold text-gray-900">{careerData.currentRole}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-gray-900">{careerData.experience}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{careerData.location}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Salary Range</label>
                  <p className="text-gray-900">{careerData.salaryRange}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Top Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {careerData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Market Overview
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Job Demand</p>
                    <p className="text-lg font-semibold text-gray-900">{marketInsights.demandTrend.current}</p>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getTrendColor(marketInsights.demandTrend.trend)}`}>
                    {getTrendIcon(marketInsights.demandTrend.trend)}
                    <span className="ml-1">{marketInsights.demandTrend.change}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Salary</p>
                    <p className="text-lg font-semibold text-gray-900">{marketInsights.salaryTrends.average}</p>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getTrendColor(marketInsights.salaryTrends.trend)}`}>
                    {getTrendIcon(marketInsights.salaryTrends.trend)}
                    <span className="ml-1">{marketInsights.salaryTrends.change}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Demand Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Skill Demand Trends
              </h3>
              
              <div className="space-y-3">
                {marketInsights.skillDemand.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Star className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.skill}</h4>
                        <p className="text-sm text-gray-600">Demand: {item.demand}</p>
                      </div>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                      <span className="ml-1">{item.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Path Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Career Path Recommendations
              </h3>
              
              <div className="grid gap-4">
                {careerPaths.map((path, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{path.role}</h4>
                        <p className="text-sm text-gray-600">{path.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getProbabilityColor(path.probability)}`}>
                        {path.probability} Match
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Timeframe</p>
                        <p className="text-gray-900">{path.timeframe}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Salary Range</p>
                        <p className="text-gray-900">{path.salaryRange}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Key Requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {path.requirements.map((req, reqIndex) => (
                          <span key={reqIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Recommended Skills to Learn
              </h3>
              
              <div className="grid gap-4">
                {skillRecommendations.map((skill, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{skill.skill}</h4>
                        <p className="text-sm text-gray-600">{skill.reason}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(skill.priority)}`}>
                        {skill.priority} Priority
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Time to Learn</p>
                        <p className="text-gray-900">{skill.timeToLearn}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expected Impact</p>
                        <p className="text-gray-900">{skill.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerInsightsPage

