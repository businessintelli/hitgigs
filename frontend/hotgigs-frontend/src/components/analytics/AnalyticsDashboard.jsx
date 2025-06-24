import React, { useState, useEffect } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { 
  TrendingUp, TrendingDown, Users, Briefcase, DollarSign, Clock,
  Target, Award, Brain, Zap, Calendar, FileText, Star, Activity
} from 'lucide-react';

const AnalyticsDashboard = ({ userRole = 'candidate' }) => {
  const { api } = useApi();
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data
      const analyticsResponse = await api.get('/analytics/dashboard');
      if (analyticsResponse.data.success) {
        setAnalytics(analyticsResponse.data.analytics);
      }

      // Fetch recommendations
      const recommendationsResponse = await api.get('/analytics/recommendations');
      if (recommendationsResponse.data.success) {
        setRecommendations(recommendationsResponse.data);
      }

      // Fetch market insights
      const marketResponse = await api.get('/analytics/market-insights');
      if (marketResponse.data.success) {
        setMarketInsights(marketResponse.data.market_insights);
      }

    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'recommendations', label: 'AI Recommendations', icon: Brain },
    { id: 'insights', label: 'Market Insights', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'company' && 'Track your hiring performance and candidate insights'}
              {userRole === 'recruiter' && 'Monitor your placement success and earnings'}
              {userRole === 'candidate' && 'Analyze your job search progress and opportunities'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">AI-Powered Insights</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab analytics={analytics} userRole={userRole} />
          )}
          {activeTab === 'performance' && (
            <PerformanceTab analytics={analytics} userRole={userRole} />
          )}
          {activeTab === 'recommendations' && (
            <RecommendationsTab recommendations={recommendations} userRole={userRole} />
          )}
          {activeTab === 'insights' && (
            <InsightsTab marketInsights={marketInsights} />
          )}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ analytics, userRole }) => {
  if (!analytics) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Loading</h3>
        <p className="text-gray-600">Gathering insights from your data...</p>
      </div>
    );
  }

  const getOverviewCards = () => {
    if (userRole === 'company') {
      return [
        {
          title: 'Total Jobs',
          value: analytics.overview?.total_jobs || 0,
          icon: Briefcase,
          color: 'blue',
          change: '+12%'
        },
        {
          title: 'Active Jobs',
          value: analytics.overview?.active_jobs || 0,
          icon: Activity,
          color: 'green',
          change: '+5%'
        },
        {
          title: 'Total Applications',
          value: analytics.overview?.total_applications || 0,
          icon: Users,
          color: 'purple',
          change: '+23%'
        },
        {
          title: 'Avg. Candidate Score',
          value: `${analytics.overview?.avg_candidate_score || 0}/100`,
          icon: Star,
          color: 'yellow',
          change: '+8%'
        }
      ];
    } else if (userRole === 'recruiter') {
      return [
        {
          title: 'Jobs Worked',
          value: analytics.performance?.jobs_worked || 0,
          icon: Briefcase,
          color: 'blue',
          change: '+15%'
        },
        {
          title: 'Successful Placements',
          value: analytics.performance?.successful_placements || 0,
          icon: Award,
          color: 'green',
          change: '+20%'
        },
        {
          title: 'Total Earnings',
          value: `$${(analytics.performance?.total_earnings || 0).toLocaleString()}`,
          icon: DollarSign,
          color: 'green',
          change: '+18%'
        },
        {
          title: 'Success Rate',
          value: `${analytics.performance?.success_rate || 0}%`,
          icon: TrendingUp,
          color: 'blue',
          change: '+5%'
        }
      ];
    } else {
      return [
        {
          title: 'Applications Sent',
          value: analytics.application_summary?.total_applications || 0,
          icon: FileText,
          color: 'blue',
          change: '+8%'
        },
        {
          title: 'Under Review',
          value: analytics.application_summary?.under_review || 0,
          icon: Clock,
          color: 'yellow',
          change: '+12%'
        },
        {
          title: 'Interviews',
          value: analytics.application_summary?.interviews || 0,
          icon: Users,
          color: 'purple',
          change: '+25%'
        },
        {
          title: 'Profile Score',
          value: `${analytics.profile_insights?.avg_profile_score || 0}/100`,
          icon: Star,
          color: 'green',
          change: '+10%'
        }
      ];
    }
  };

  const cards = getOverviewCards();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{card.change}</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${card.color}-100`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sample Data Display */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Sample Activity {item}</h4>
                <p className="text-sm text-gray-600">Analytics data will be displayed here</p>
              </div>
              <div className="text-right">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceTab = ({ analytics, userRole }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h4>
          <p className="text-gray-600">Detailed performance charts and metrics will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

const RecommendationsTab = ({ recommendations, userRole }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <Brain className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Insights</h4>
          <p className="text-gray-600">
            {userRole === 'candidate' && 'Personalized job recommendations based on your profile'}
            {userRole === 'company' && 'Recommended candidates for your job postings'}
            {userRole === 'recruiter' && 'Optimal candidate-job matches for your clients'}
          </p>
        </div>
      </div>
    </div>
  );
};

const InsightsTab = ({ marketInsights }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Market Intelligence</h4>
          <p className="text-gray-600">Salary trends, skill demand, and industry insights</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

