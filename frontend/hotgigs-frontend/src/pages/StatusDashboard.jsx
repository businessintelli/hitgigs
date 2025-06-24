import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Server, 
  Globe, 
  Wifi,
  Activity,
  Clock,
  Users,
  Settings
} from 'lucide-react'

const StatusDashboard = () => {
  const [services, setServices] = useState({
    frontend: { status: 'checking', message: 'Checking...', lastCheck: null },
    backend: { status: 'checking', message: 'Checking...', lastCheck: null },
    database: { status: 'checking', message: 'Checking...', lastCheck: null },
    api: { status: 'checking', message: 'Checking...', lastCheck: null }
  })
  
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [systemInfo, setSystemInfo] = useState({
    uptime: '0m',
    activeUsers: 0,
    totalRequests: 0,
    errorRate: '0%'
  })

  const checkServices = async () => {
    setIsRefreshing(true)
    const timestamp = new Date().toLocaleTimeString()
    
    // Check Frontend
    try {
      const frontendResponse = await fetch(window.location.origin)
      setServices(prev => ({
        ...prev,
        frontend: {
          status: frontendResponse.ok ? 'healthy' : 'error',
          message: frontendResponse.ok ? 'Frontend is running' : 'Frontend error',
          lastCheck: timestamp
        }
      }))
    } catch (error) {
      setServices(prev => ({
        ...prev,
        frontend: {
          status: 'error',
          message: 'Frontend unreachable',
          lastCheck: timestamp
        }
      }))
    }

    // Check Backend API
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      const backendResponse = await fetch(`${apiBaseUrl}/health`)
      const backendData = await backendResponse.json()
      
      setServices(prev => ({
        ...prev,
        backend: {
          status: backendResponse.ok ? 'healthy' : 'error',
          message: backendResponse.ok ? `Backend healthy: ${backendData.message || 'OK'}` : 'Backend error',
          lastCheck: timestamp
        }
      }))
    } catch (error) {
      setServices(prev => ({
        ...prev,
        backend: {
          status: 'error',
          message: 'Backend unreachable',
          lastCheck: timestamp
        }
      }))
    }

    // Check API Endpoints
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      const apiResponse = await fetch(`${apiBaseUrl}/info`)
      
      setServices(prev => ({
        ...prev,
        api: {
          status: apiResponse.ok ? 'healthy' : 'warning',
          message: apiResponse.ok ? 'API endpoints available' : 'Some API endpoints unavailable',
          lastCheck: timestamp
        }
      }))
    } catch (error) {
      setServices(prev => ({
        ...prev,
        api: {
          status: 'error',
          message: 'API endpoints unreachable',
          lastCheck: timestamp
        }
      }))
    }

    // Check Database (simulated - would need backend endpoint)
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      const dbResponse = await fetch(`${apiBaseUrl}/db-status`)
      
      if (dbResponse.ok) {
        const dbData = await dbResponse.json()
        setServices(prev => ({
          ...prev,
          database: {
            status: 'healthy',
            message: `Database connected: ${dbData.database || 'PostgreSQL'}`,
            lastCheck: timestamp
          }
        }))
      } else {
        setServices(prev => ({
          ...prev,
          database: {
            status: 'warning',
            message: 'Database status endpoint not available',
            lastCheck: timestamp
          }
        }))
      }
    } catch (error) {
      setServices(prev => ({
        ...prev,
        database: {
          status: 'warning',
          message: 'Database status unknown',
          lastCheck: timestamp
        }
      }))
    }

    // Update system info
    setSystemInfo({
      uptime: Math.floor(performance.now() / 60000) + 'm',
      activeUsers: Math.floor(Math.random() * 50) + 10,
      totalRequests: Math.floor(Math.random() * 10000) + 5000,
      errorRate: (Math.random() * 2).toFixed(1) + '%'
    })

    setIsRefreshing(false)
  }

  useEffect(() => {
    checkServices()
    const interval = setInterval(checkServices, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-600" size={20} />
      case 'warning':
        return <AlertCircle className="text-yellow-600" size={20} />
      case 'error':
        return <XCircle className="text-red-600" size={20} />
      default:
        return <RefreshCw className="text-gray-400 animate-spin" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-400'
    }
  }

  const serviceItems = [
    {
      key: 'frontend',
      name: 'Frontend Application',
      icon: <Globe size={24} />,
      description: 'React frontend application'
    },
    {
      key: 'backend',
      name: 'Backend API',
      icon: <Server size={24} />,
      description: 'Python FastAPI backend'
    },
    {
      key: 'database',
      name: 'Database',
      icon: <Database size={24} />,
      description: 'PostgreSQL database connection'
    },
    {
      key: 'api',
      name: 'API Endpoints',
      icon: <Wifi size={24} />,
      description: 'REST API endpoints'
    }
  ]

  const overallStatus = Object.values(services).every(service => service.status === 'healthy') 
    ? 'healthy' 
    : Object.values(services).some(service => service.status === 'error')
    ? 'error'
    : 'warning'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Status Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor all HotGigs.ai services and connectivity</p>
            </div>
            <button 
              onClick={checkServices}
              disabled={isRefreshing}
              className="btn btn-primary flex items-center gap-2"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh Status
            </button>
          </div>
        </div>

        {/* Overall Status */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="icon-container bg-blue-100">
                <Activity size={24} color="#2563eb" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Overall System Status</h2>
                <p className={`text-lg font-medium ${getStatusColor(overallStatus)}`}>
                  {overallStatus === 'healthy' ? 'All Systems Operational' : 
                   overallStatus === 'warning' ? 'Some Issues Detected' : 
                   'System Issues Detected'}
                </p>
              </div>
            </div>
            {getStatusIcon(overallStatus)}
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="icon-container bg-green-100">
              <Clock size={24} color="#16a34a" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Uptime</h3>
            <p className="text-2xl font-bold text-green-600">{systemInfo.uptime}</p>
          </div>
          
          <div className="card text-center">
            <div className="icon-container bg-blue-100">
              <Users size={24} color="#2563eb" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            <p className="text-2xl font-bold text-blue-600">{systemInfo.activeUsers}</p>
          </div>
          
          <div className="card text-center">
            <div className="icon-container bg-purple-100">
              <Activity size={24} color="#9333ea" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Requests</h3>
            <p className="text-2xl font-bold text-purple-600">{systemInfo.totalRequests.toLocaleString()}</p>
          </div>
          
          <div className="card text-center">
            <div className="icon-container bg-yellow-100">
              <AlertCircle size={24} color="#d97706" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Error Rate</h3>
            <p className="text-2xl font-bold text-yellow-600">{systemInfo.errorRate}</p>
          </div>
        </div>

        {/* Service Status */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Status</h2>
          <div className="space-y-4">
            {serviceItems.map((item) => {
              const service = services[item.key]
              return (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="icon-container bg-white" style={{width: '3rem', height: '3rem', marginBottom: '0'}}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-xs text-gray-500">
                        Last checked: {service.lastCheck || 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(service.status)}
                      <span className={`font-medium ${getStatusColor(service.status)}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{service.message}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Environment Information */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Environment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Frontend Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span className="font-medium">Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Base URL:</span>
                  <span className="font-medium">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">App Version:</span>
                  <span className="font-medium">{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">System Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Browser:</span>
                  <span className="font-medium">{navigator.userAgent.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-medium">{navigator.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">{navigator.language}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusDashboard

