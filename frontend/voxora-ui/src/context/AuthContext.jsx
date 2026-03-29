import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('voxora_user')
    return stored ? JSON.parse(stored) : null
  })

  const [domain, setDomain] = useState(() =>
    localStorage.getItem('voxora_domain') || null
  )

  const loginUser = (userData) => {
    localStorage.setItem('voxora_user', JSON.stringify(userData))
    if (userData.domain) {
      localStorage.setItem('voxora_domain', userData.domain)
      setDomain(userData.domain)
    }
    setUser(userData)
  }

  const logoutUser = () => {
    localStorage.removeItem('voxora_user')
    localStorage.removeItem('voxora_domain')
    localStorage.removeItem('voxora_role')
    setUser(null)
    setDomain(null)
  }

  const selectDomain = (d) => {
    localStorage.setItem('voxora_domain', d)
    setDomain(d)
  }

  return (
    <AuthContext.Provider value={{ user, domain, loginUser, logoutUser, selectDomain }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)