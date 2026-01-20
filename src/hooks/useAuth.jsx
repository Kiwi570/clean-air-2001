import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROLES, DEMO_CLEANERS, getCleanerById } from '@/lib/constants'

// ============================================
// AUTH HOOK ULTIMATE - Avec Persona Switcher Cleaner
// ============================================

const AuthContext = createContext(null)

// Utilisateur Hôte de démo
const HOST_USER = {
  id: 'host-demo',
  email: 'vincent@cleanair.fr',
  firstName: 'Vincent',
  lastName: 'Martin',
  fullName: 'Vincent Martin',
  avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
  role: ROLES.HOST,
  phone: '+33 6 12 34 56 78',
  address: 'Paris, France',
  createdAt: '2024-01-15',
  propertiesCount: 3,
  rating: 4.9,
  verified: true,
}

// Générer un utilisateur cleaner à partir des données DEMO_CLEANERS
const createCleanerUser = (cleaner) => ({
  id: cleaner.id,
  email: cleaner.email,
  firstName: cleaner.firstName,
  lastName: cleaner.lastName,
  fullName: cleaner.fullName,
  avatar: cleaner.avatar,
  role: ROLES.CLEANER,
  phone: '+33 6 98 76 54 32',
  address: 'Paris, France',
  createdAt: '2024-02-10',
  completedMissions: cleaner.missions,
  rating: cleaner.rating,
  verified: cleaner.badge === 'verified' || cleaner.badge === 'top',
  bio: cleaner.bio,
  skills: cleaner.skills || ['Ménage complet'],
  badge: cleaner.badge,
  badgeLabel: cleaner.badgeLabel,
  badgeColor: cleaner.badgeColor,
  zones: cleaner.zones,
})

export function AuthProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Déterminer le rôle initial basé sur l'URL
  const getInitialRole = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      if (path.startsWith('/host')) return ROLES.HOST
      if (path.startsWith('/cleaner')) return ROLES.CLEANER
    }
    return ROLES.HOST
  }

  // État: ID du cleaner actuellement sélectionné (pour le persona switcher)
  const [selectedCleanerId, setSelectedCleanerId] = useState('cleaner-paul')

  // État: utilisateur actuel
  const [user, setUser] = useState(() => {
    const role = getInitialRole()
    if (role === ROLES.HOST) {
      return HOST_USER
    }
    // Par défaut, Paul est le cleaner sélectionné
    return createCleanerUser(DEMO_CLEANERS[0])
  })
  
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  // 🔥 SYNC AUTOMATIQUE : Quand l'URL change, synchroniser l'utilisateur
  useEffect(() => {
    const currentPath = location.pathname
    
    if (currentPath.startsWith('/host') && user?.role !== ROLES.HOST) {
      setUser(HOST_USER)
    } else if (currentPath.startsWith('/cleaner') && user?.role !== ROLES.CLEANER) {
      const cleaner = getCleanerById(selectedCleanerId)
      setUser(createCleanerUser(cleaner))
    }
  }, [location.pathname, user?.role, selectedCleanerId])

  // Connexion
  const login = useCallback(async (email, password, role) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (role === ROLES.HOST) {
      setUser(HOST_USER)
    } else {
      const cleaner = getCleanerById(selectedCleanerId)
      setUser(createCleanerUser(cleaner))
    }
    setIsAuthenticated(true)
    
    if (role === ROLES.HOST) {
      navigate('/host')
    } else {
      navigate('/cleaner')
    }
    
    return { success: true }
  }, [navigate, selectedCleanerId])

  // Déconnexion
  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    navigate('/')
  }, [navigate])

  // Inscription
  const register = useCallback(async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const role = userData.role || ROLES.CLEANER
    if (role === ROLES.HOST) {
      setUser({
        ...HOST_USER,
        email: userData.email,
        firstName: userData.firstName || HOST_USER.firstName,
        lastName: userData.lastName || HOST_USER.lastName,
      })
    } else {
      const cleaner = getCleanerById(selectedCleanerId)
      setUser(createCleanerUser({
        ...cleaner,
        email: userData.email,
        firstName: userData.firstName || cleaner.firstName,
      }))
    }
    
    setIsAuthenticated(true)
    
    if (role === ROLES.HOST) {
      navigate('/host')
    } else {
      navigate('/cleaner')
    }
    
    return { success: true }
  }, [navigate, selectedCleanerId])

  // Changer de rôle (pour le DevSwitcher)
  const switchRole = useCallback((newRole) => {
    if (newRole === ROLES.HOST) {
      setUser(HOST_USER)
    } else {
      const cleaner = getCleanerById(selectedCleanerId)
      setUser(createCleanerUser(cleaner))
    }
  }, [selectedCleanerId])

  // 🆕 Changer de persona cleaner
  const switchCleanerPersona = useCallback((cleanerId) => {
    setSelectedCleanerId(cleanerId)
    const cleaner = getCleanerById(cleanerId)
    if (user?.role === ROLES.CLEANER) {
      setUser(createCleanerUser(cleaner))
    }
  }, [user?.role])

  // Mettre à jour le profil
  const updateProfile = useCallback((updates) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      fullName: updates.firstName 
        ? `${updates.firstName} ${updates.lastName?.charAt(0) || prev.lastName?.charAt(0) || ''}.`
        : prev.fullName,
    }))
    return { success: true }
  }, [])

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = useCallback((role) => {
    return user?.role === role
  }, [user])

  // Obtenir le prénom de l'utilisateur
  const getFirstName = useCallback(() => {
    return user?.firstName || 'Utilisateur'
  }, [user])

  // Obtenir le nom complet
  const getFullName = useCallback(() => {
    return user?.fullName || 'Utilisateur'
  }, [user])

  // Vérifier si on est Hôte
  const isHost = useCallback(() => {
    return user?.role === ROLES.HOST
  }, [user])

  // Vérifier si on est Cleaner
  const isCleaner = useCallback(() => {
    return user?.role === ROLES.CLEANER
  }, [user])

  // 🆕 Obtenir l'ID du cleaner actuel
  const getCurrentCleanerId = useCallback(() => {
    return user?.role === ROLES.CLEANER ? user.id : selectedCleanerId
  }, [user, selectedCleanerId])

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    switchRole,
    switchCleanerPersona,
    selectedCleanerId,
    updateProfile,
    hasRole,
    getFirstName,
    getFullName,
    isHost,
    isCleaner,
    getCurrentCleanerId,
    HOST_USER,
    DEMO_CLEANERS,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAuth
