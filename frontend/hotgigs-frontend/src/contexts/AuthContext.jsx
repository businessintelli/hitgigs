import React, { createContext, useContext, useState, useEffect } from 'react'
import { useApi } from './ApiContext'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { api } = useApi()

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('hotgigs_token')
    if (token) {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token and get user data
      getCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to get current user:', error)
      // Token might be invalid, remove it
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, access_token, refresh_token } = response.data
      
      // Store tokens
      localStorage.setItem('hotgigs_token', access_token)
      localStorage.setItem('hotgigs_refresh_token', refresh_token)
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      setUser(user)
      return { success: true, user }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { user, access_token, refresh_token } = response.data
      
      // Store tokens
      localStorage.setItem('hotgigs_token', access_token)
      localStorage.setItem('hotgigs_refresh_token', refresh_token)
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      setUser(user)
      return { success: true, user }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  }

  const loginWithOAuth = async (provider, accessToken, userType) => {
    try {
      const response = await api.post('/auth/oauth', {
        provider,
        access_token: accessToken,
        user_type: userType
      })
      const { user, access_token: jwt_token, refresh_token } = response.data
      
      // Store tokens
      localStorage.setItem('hotgigs_token', jwt_token)
      localStorage.setItem('hotgigs_refresh_token', refresh_token)
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${jwt_token}`
      
      setUser(user)
      return { success: true, user }
    } catch (error) {
      console.error('OAuth login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'OAuth login failed' 
      }
    }
  }

  const logout = () => {
    // Remove tokens
    localStorage.removeItem('hotgigs_token')
    localStorage.removeItem('hotgigs_refresh_token')
    
    // Remove token from API headers
    delete api.defaults.headers.common['Authorization']
    
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData)
      setUser(response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      console.error('Profile update failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Profile update failed' 
      }
    }
  }

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('hotgigs_refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await api.post('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      })
      
      const { access_token } = response.data
      localStorage.setItem('hotgigs_token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      return access_token
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    loginWithOAuth,
    logout,
    updateProfile,
    refreshToken,
    getCurrentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

