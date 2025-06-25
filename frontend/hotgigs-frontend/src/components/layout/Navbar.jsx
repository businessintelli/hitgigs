import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Shield, Activity } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Simulate admin check - in real app, this would come from auth context
  const isAdmin = true // Set to true for demo purposes

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Status', path: '/status', icon: <Activity size={16} /> }
  ]

  const handleNavigation = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              HotGigs.ai
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`nav-link flex items-center gap-1 ${
                  isActivePath(item.path) ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            {/* Admin Access */}
            {isAdmin && (
              <button
                onClick={() => handleNavigation('/admin')}
                className={`nav-link flex items-center gap-1 ${
                  isActivePath('/admin') ? 'text-red-600 font-semibold' : 'text-red-600'
                }`}
                title="Super Admin Dashboard"
              >
                <Shield size={16} />
                Admin
              </button>
            )}
            
            <button 
              onClick={() => handleNavigation('/signin')}
              className="btn btn-primary"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`nav-link text-left flex items-center gap-2 ${
                    isActivePath(item.path) ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Admin Access */}
              {isAdmin && (
                <button
                  onClick={() => handleNavigation('/admin')}
                  className={`nav-link text-left flex items-center gap-2 ${
                    isActivePath('/admin') ? 'text-red-600 font-semibold' : 'text-red-600'
                  }`}
                >
                  <Shield size={16} />
                  Super Admin
                </button>
              )}
              
              <button 
                onClick={() => handleNavigation('/signin')}
                className="btn btn-primary mt-4"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

