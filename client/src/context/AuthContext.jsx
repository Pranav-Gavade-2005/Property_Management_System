import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = async (email, password) => {
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setUser(data.user)
      return true
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed')
      return false
    }
  }

  const logout = async () => {
    await api.get('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
