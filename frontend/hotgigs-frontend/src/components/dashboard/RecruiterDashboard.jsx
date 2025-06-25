import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Award, 
  Calendar, 
  Clock,
  CheckCircle,
  Eye,
  Briefcase,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

const RecruiterDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [activePlacements, setActivePlacements] = useState([])
  const [recentClients, setRecentClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simulate loading recruiter dashboard data
      const dashboardStats = {
        activeClients: 12,
        activePlacements: 8,
        totalEarnings: 45000,
        monthlyEarnings: 8500,
        successfulPlacements: 23,
        candidatesInPipeline: 34,
        avgPlacementTime: 21,
        conversionRate: 68
      }

      const activeplacementsData = [
        {
          id: 1,
          candidateName: 'Alex Rodriguez',
          position: 'Senior Full Stack Developer',
          client: 'TechCorp Inc.',
          salary: 140000,
          stage: 'final_interview',
          startDate: '2024-02-01',
          commission: 14000
        },
        {
          id: 2,
          candidateName: 'Maria Garcia',
          position: 'Product Manager',
          client: 'StartupXYZ',
          salary: 125000,
          stage: 'offer_negotiation',
          startDate: '2024-01-25',
          commission: 12500
        },
        {
          id: 3,
          candidateName: 'David Kim',
          position: 'DevOps Engineer',
          client: 'CloudTech Solutions',
          salary: 130000,
          stage: 'reference_check',
          startDate: '2024-02-05',
          commission: 13000
        }
      ]

      const recentClientsData = [
        {
          id: 1,
          companyName: 'TechCorp Inc.',
          contactPerson: 'Sarah Johnson',
          email: 'sarah@techcorp.com',
          phone: '+1 (555) 123-4567',
          activePositions: 3,
          totalPlacements: 8,
          lastContact: '2024-01-16'
        },
        {
          id: 2,
          companyName: 'StartupXYZ',
          contactPerson: 'Mike Chen',
          email: 'mike@startupxyz.com',
          phone: '+1 (555) 987-6543',
          activePositions: 2,
          totalPlacements: 5,
          lastContact: '2024-01-15'
        },
        {
          id: 3,
          companyName: 'CloudTech Solutions',
          contactPerson: 'Emily Davis',
          email: 'emily@cloudtech.com',
          phone: '+1 (555) 456-7890',
          activePositions: 1,
          totalPlacements: 12,
          lastContact: '2024-01-14'
        }
      ]

      setStats(dashboardStats)
      setActivePlacements(activeplacementsData)
      setRecentClients(recentClientsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case 'screening':
        return 'text-blue-500'
      case 'client_interview':
        return 'text-yellow-500'
      case 'final_interview':
        return 'text-purple-500'
      case 'reference_check':
        return 'text-orange-500'
      case 'offer_negotiation':
        return 'text-green-500'
      case 'placed':
        return 'text-green-600'
      default:
        return 'text-gray-500'
    }
  }

  const getStageText = (stage) => {
    switch (stage) {
      case 'screening':
        return 'Screening'
      case 'client_interview':
        return 'Client Interview'
      case 'final_interview':
        return 'Final Interview'
      case 'reference_check':
        return 'Reference Check'
      case 'offer_negotiation':
        return 'Offer Negotiation'
      case 'placed':
        return 'Placed'
      default:
        return 'Unknown'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="recruiter-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="recruiter-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Recruiter Dashboard</h1>
        <p>Track your placements, clients, and earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon clients">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.activeClients}</div>
            <div className="stat-label">Active Clients</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon placements">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.activePlacements}</div>
            <div className="stat-label">Active Placements</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon earnings">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{formatCurrency(stats.monthlyEarnings)}</div>
            <div className="stat-label">Monthly Earnings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-earnings">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{formatCurrency(stats.totalEarnings)}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon successful">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.successfulPlacements}</div>
            <div className="stat-label">Successful Placements</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pipeline">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.candidatesInPipeline}</div>
            <div className="stat-label">Candidates in Pipeline</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="metrics-section">
        <div className="metric-card">
          <div className="metric-icon">
            <Clock size={20} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.avgPlacementTime} days</div>
            <div className="metric-label">Avg. Placement Time</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Target size={20} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.conversionRate}%</div>
            <div className="metric-label">Conversion Rate</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Active Placements */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Active Placements</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="placements-list">
            {activePlacements.map(placement => (
              <div key={placement.id} className="placement-card">
                <div className="placement-header">
                  <div className="candidate-info">
                    <h3>{placement.candidateName}</h3>
                    <div className="position-info">
                      <span className="position">{placement.position}</span>
                      <span className="client">{placement.client}</span>
                    </div>
                  </div>
                  <div className="commission-info">
                    <div className="commission">{formatCurrency(placement.commission)}</div>
                    <div className="commission-label">Commission</div>
                  </div>
                </div>
                
                <div className="placement-details">
                  <div className="detail-item">
                    <DollarSign size={14} />
                    <span>Salary: {formatCurrency(placement.salary)}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span>Start: {new Date(placement.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="placement-status">
                  <span className={`stage ${getStageColor(placement.stage)}`}>
                    {getStageText(placement.stage)}
                  </span>
                </div>
                
                <div className="placement-actions">
                  <button className="btn btn-outline">Update Status</button>
                  <button className="btn btn-primary">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Clients</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="clients-list">
            {recentClients.map(client => (
              <div key={client.id} className="client-card">
                <div className="client-header">
                  <div className="client-info">
                    <h3>{client.companyName}</h3>
                    <div className="contact-info">
                      <span className="contact-person">{client.contactPerson}</span>
                    </div>
                  </div>
                  <div className="client-stats">
                    <div className="stat-item">
                      <Briefcase size={14} />
                      <span>{client.activePositions} active</span>
                    </div>
                  </div>
                </div>
                
                <div className="client-details">
                  <div className="detail-item">
                    <Mail size={14} />
                    <span>{client.email}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={14} />
                    <span>{client.phone}</span>
                  </div>
                  <div className="detail-item">
                    <Award size={14} />
                    <span>{client.totalPlacements} total placements</span>
                  </div>
                </div>
                
                <div className="client-footer">
                  <div className="last-contact">
                    Last contact: {new Date(client.lastContact).toLocaleDateString()}
                  </div>
                  <div className="client-actions">
                    <button className="btn btn-outline">Contact</button>
                    <button className="btn btn-primary">View Profile</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .recruiter-dashboard {
          padding: 0;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #6b7280;
        }

        .welcome-section {
          margin-bottom: 32px;
        }

        .welcome-section h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .welcome-section p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.clients {
          background: #06b6d4;
        }

        .stat-icon.placements {
          background: #8b5cf6;
        }

        .stat-icon.earnings {
          background: #10b981;
        }

        .stat-icon.total-earnings {
          background: #f59e0b;
        }

        .stat-icon.successful {
          background: #ef4444;
        }

        .stat-icon.pipeline {
          background: #3b82f6;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .metrics-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .metric-icon {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px;
        }

        .metric-value {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .dashboard-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .view-all-btn {
          background: none;
          border: none;
          color: #06b6d4;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .view-all-btn:hover {
          text-decoration: underline;
        }

        .placements-list, .clients-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .placement-card, .client-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }

        .placement-card:hover, .client-card:hover {
          border-color: #06b6d4;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.1);
        }

        .placement-header, .client-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .candidate-info h3, .client-info h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .position-info, .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 14px;
          color: #6b7280;
        }

        .commission-info {
          text-align: right;
        }

        .commission {
          font-size: 18px;
          font-weight: 700;
          color: #10b981;
        }

        .commission-label {
          font-size: 12px;
          color: #6b7280;
        }

        .placement-details, .client-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .placement-status {
          margin-bottom: 12px;
        }

        .stage {
          font-size: 14px;
          font-weight: 500;
        }

        .client-stats {
          display: flex;
          gap: 12px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        .client-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }

        .last-contact {
          font-size: 12px;
          color: #6b7280;
        }

        .placement-actions, .client-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #06b6d4;
          color: white;
        }

        .btn-primary:hover {
          background: #0891b2;
        }

        .btn-outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f9fafb;
        }

        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
          
          .stats-grid, .metrics-section {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .stats-grid, .metrics-section {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .stat-card, .metric-card {
            padding: 16px;
          }
          
          .placement-header, .client-header {
            flex-direction: column;
            gap: 8px;
          }
          
          .placement-actions, .client-actions {
            flex-direction: column;
          }
          
          .client-footer {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

export default RecruiterDashboard

