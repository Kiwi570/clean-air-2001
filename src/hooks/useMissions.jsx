import { useState, useCallback, createContext, useContext } from 'react'
import { MISSION_STATUS, getCleanerById, DEMO_CLEANERS } from '@/lib/constants'
import { getRelativeDate, getRelativeTimestamp, generateId } from '@/lib/utils'

// ============================================
// MISSIONS HOOK ULTIMATE - Avec Persona Support
// ============================================

const MissionsContext = createContext(null)

// Re-export MISSION_STATUS pour la compatibilité
export { MISSION_STATUS }

// Durée pendant laquelle une mission est considérée comme "nouvelle" (60 minutes)
const NEW_MISSION_DURATION = 60 * 60 * 1000

// Générer les missions initiales avec dates dynamiques
const generateInitialMissions = () => [
  {
    id: 'mission-1',
    propertyId: 'prop-1',
    propertyName: 'Studio Marais',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    propertyAddress: '15 Rue des Archives, Paris 4e',
    propertySurface: 25,
    propertyType: 'Studio',
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    cleanerId: 'cleaner-paul',
    cleanerName: 'Paul D.',
    cleanerAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    date: getRelativeDate(1),
    time: '14:00',
    duration: '2h',
    price: 55,
    status: MISSION_STATUS.CONFIRMED,
    instructions: 'Merci de bien aérer après le ménage.',
    bookingMode: 'instant',
    createdAt: getRelativeTimestamp(-24),
    appliedAt: getRelativeTimestamp(-23),
    confirmedAt: getRelativeTimestamp(-22),
    startedAt: null,
    completedAt: null,
    rating: null,
    review: null,
    timeline: [
      { event: 'created', timestamp: getRelativeTimestamp(-24), label: 'Réservation créée' },
      { event: 'confirmed', timestamp: getRelativeTimestamp(-22), label: 'Paul D. confirmé' },
    ],
  },
  {
    id: 'mission-2',
    propertyId: 'prop-2',
    propertyName: 'Appartement Bastille',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    propertyAddress: '42 Rue de la Roquette, Paris 11e',
    propertySurface: 45,
    propertyType: 'T2',
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    cleanerId: null,
    cleanerName: null,
    cleanerAvatar: null,
    date: getRelativeDate(2),
    time: '10:00',
    duration: '3h',
    price: 72,
    status: MISSION_STATUS.PENDING,
    instructions: '',
    bookingMode: 'instant',
    createdAt: getRelativeTimestamp(-1),
    appliedAt: null,
    confirmedAt: null,
    startedAt: null,
    completedAt: null,
    rating: null,
    review: null,
    timeline: [
      { event: 'created', timestamp: getRelativeTimestamp(-1), label: 'Réservation créée' },
    ],
  },
  {
    id: 'mission-3',
    propertyId: 'prop-3',
    propertyName: 'Loft Oberkampf',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
    propertyAddress: '25 Rue Oberkampf, Paris 11e',
    propertySurface: 80,
    propertyType: 'Loft',
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    cleanerId: null,
    cleanerName: null,
    cleanerAvatar: null,
    date: getRelativeDate(3),
    time: '09:00',
    duration: '4h',
    price: 95,
    status: MISSION_STATUS.PENDING,
    instructions: 'Grand ménage de printemps, merci de nettoyer les vitres.',
    bookingMode: 'instant',
    createdAt: getRelativeTimestamp(-2),
    appliedAt: null,
    confirmedAt: null,
    startedAt: null,
    completedAt: null,
    rating: null,
    review: null,
    timeline: [
      { event: 'created', timestamp: getRelativeTimestamp(-2), label: 'Réservation créée' },
    ],
  },
  {
    id: 'mission-4',
    propertyId: 'prop-4',
    propertyName: 'Duplex Montmartre',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    propertyAddress: '18 Rue Lepic, Paris 18e',
    propertySurface: 65,
    propertyType: 'Duplex',
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    cleanerId: null,
    cleanerName: null,
    cleanerAvatar: null,
    date: getRelativeDate(2),
    time: '14:00',
    duration: '3h30',
    price: 85,
    status: MISSION_STATUS.PENDING,
    instructions: 'Attention au parquet, utiliser produit spécial bois.',
    bookingMode: 'instant',
    createdAt: Date.now() - 180000,
    appliedAt: null,
    confirmedAt: null,
    startedAt: null,
    completedAt: null,
    rating: null,
    review: null,
    timeline: [
      { event: 'created', timestamp: Date.now() - 180000, label: 'Réservation créée' },
    ],
  },
  {
    id: 'mission-old-1',
    propertyId: 'prop-1',
    propertyName: 'Studio Marais',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    propertyAddress: '15 Rue des Archives, Paris 4e',
    propertySurface: 25,
    propertyType: 'Studio',
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    cleanerId: 'cleaner-sophie',
    cleanerName: 'Sophie L.',
    cleanerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: getRelativeDate(-3),
    time: '14:00',
    duration: '2h',
    price: 55,
    status: MISSION_STATUS.RATED,
    instructions: '',
    bookingMode: 'instant',
    createdAt: getRelativeTimestamp(-96),
    appliedAt: getRelativeTimestamp(-95),
    confirmedAt: getRelativeTimestamp(-94),
    startedAt: getRelativeTimestamp(-75),
    completedAt: getRelativeTimestamp(-73),
    rating: 5,
    review: 'Excellent travail, appartement impeccable !',
    timeline: [
      { event: 'created', timestamp: getRelativeTimestamp(-96), label: 'Réservation créée' },
      { event: 'confirmed', timestamp: getRelativeTimestamp(-94), label: 'Sophie L. confirmée' },
      { event: 'started', timestamp: getRelativeTimestamp(-75), label: 'Ménage démarré' },
      { event: 'completed', timestamp: getRelativeTimestamp(-73), label: 'Ménage terminé' },
      { event: 'rated', timestamp: getRelativeTimestamp(-72), label: 'Avis laissé ⭐⭐⭐⭐⭐' },
    ],
  },
  {
    id: 'mission-old-2',
    propertyId: 'prop-2',
    propertyName: 'Appartement Bastille',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    propertyAddress: '42 Rue de la Roquette, Paris 11e',
    propertySurface: 45,
    propertyType: 'T2',
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    cleanerId: 'cleaner-paul',
    cleanerName: 'Paul D.',
    cleanerAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    date: getRelativeDate(-5),
    time: '10:00',
    duration: '3h',
    price: 72,
    status: MISSION_STATUS.COMPLETED,
    instructions: '',
    bookingMode: 'instant',
    createdAt: getRelativeTimestamp(-144),
    appliedAt: getRelativeTimestamp(-143),
    confirmedAt: getRelativeTimestamp(-142),
    startedAt: getRelativeTimestamp(-123),
    completedAt: getRelativeTimestamp(-120),
    rating: null,
    review: null,
    timeline: [
      { event: 'created', timestamp: getRelativeTimestamp(-144), label: 'Réservation créée' },
      { event: 'confirmed', timestamp: getRelativeTimestamp(-142), label: 'Paul D. confirmé' },
      { event: 'started', timestamp: getRelativeTimestamp(-123), label: 'Ménage démarré' },
      { event: 'completed', timestamp: getRelativeTimestamp(-120), label: 'Ménage terminé' },
    ],
  },
]

export function MissionsProvider({ children }) {
  const [missions, setMissions] = useState(generateInitialMissions)

  // ============================================
  // GETTERS - Côté Cleaner (filtrés par cleaner ID)
  // ============================================

  // Missions disponibles (PENDING, sans cleaner assigné)
  const getAvailableMissions = useCallback(() => {
    return missions.filter(m => m.status === MISSION_STATUS.PENDING && !m.cleanerId)
  }, [missions])

  // Mes candidatures (missions où j'ai postulé, en attente de confirmation)
  const getMyApplications = useCallback((cleanerId = 'cleaner-paul') => {
    return missions.filter(m => 
      m.status === MISSION_STATUS.APPLIED && 
      m.cleanerId === cleanerId
    )
  }, [missions])

  // Missions confirmées pour UN cleaner spécifique
  const getConfirmedMissions = useCallback((cleanerId = null) => {
    return missions.filter(m => {
      const isConfirmedOrInProgress = m.status === MISSION_STATUS.CONFIRMED || m.status === MISSION_STATUS.IN_PROGRESS
      if (!isConfirmedOrInProgress) return false
      if (!m.cleanerId) return false
      
      // Si un cleanerId est fourni, filtrer par ce cleaner
      if (cleanerId) {
        return m.cleanerId === cleanerId
      }
      
      // Sinon retourner toutes les missions confirmées
      return true
    })
  }, [missions])

  // Missions pour un cleaner spécifique (toutes les missions qui lui sont assignées)
  const getMissionsForCleaner = useCallback((cleanerId) => {
    return missions.filter(m => m.cleanerId === cleanerId)
  }, [missions])

  // ============================================
  // GETTERS - Côté Host
  // ============================================

  // Missions de l'hôte avec candidatures en attente
  const getPendingApplications = useCallback((hostId = 'host-demo') => {
    return missions.filter(m => 
      m.status === MISSION_STATUS.APPLIED && 
      m.hostId === hostId
    )
  }, [missions])

  // Missions à venir (confirmées) pour l'hôte
  const getUpcomingMissions = useCallback((hostId = 'host-demo') => {
    return missions.filter(m => 
      (m.status === MISSION_STATUS.CONFIRMED || m.status === MISSION_STATUS.IN_PROGRESS) &&
      m.hostId === hostId
    ).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [missions])

  // Missions à noter pour l'hôte
  const getToRateMissions = useCallback((hostId = 'host-demo') => {
    return missions.filter(m => 
      m.status === MISSION_STATUS.COMPLETED &&
      m.hostId === hostId
    )
  }, [missions])

  // ============================================
  // GETTERS - Génériques
  // ============================================

  const getMissionsByStatus = useCallback((status, role = 'cleaner', userId = null) => {
    return missions.filter(m => {
      if (m.status !== status) return false
      
      if (role === 'cleaner') {
        if (status === MISSION_STATUS.PENDING) return !m.cleanerId
        if (userId) return m.cleanerId === userId
        return m.cleanerId !== null
      }
      
      if (role === 'host') {
        return m.hostId === (userId || 'host-demo')
      }
      
      return true
    })
  }, [missions])

  const getMissionById = useCallback((id) => {
    return missions.find(m => m.id === id)
  }, [missions])

  const getStats = useCallback((role = 'cleaner', userId = null) => {
    if (role === 'cleaner') {
      const cleanerMissions = userId 
        ? missions.filter(m => m.cleanerId === userId)
        : missions
      
      return {
        available: missions.filter(m => m.status === MISSION_STATUS.PENDING && !m.cleanerId).length,
        applied: cleanerMissions.filter(m => m.status === MISSION_STATUS.APPLIED).length,
        confirmed: cleanerMissions.filter(m => m.status === MISSION_STATUS.CONFIRMED).length,
        inProgress: cleanerMissions.filter(m => m.status === MISSION_STATUS.IN_PROGRESS).length,
        completed: cleanerMissions.filter(m => 
          m.status === MISSION_STATUS.COMPLETED || m.status === MISSION_STATUS.RATED
        ).length,
      }
    }
    
    // Stats Hôte
    const hostMissions = missions.filter(m => m.hostId === (userId || 'host-demo'))
    return {
      pending: hostMissions.filter(m => m.status === MISSION_STATUS.PENDING).length,
      applied: hostMissions.filter(m => m.status === MISSION_STATUS.APPLIED).length,
      confirmed: hostMissions.filter(m => m.status === MISSION_STATUS.CONFIRMED).length,
      inProgress: hostMissions.filter(m => m.status === MISSION_STATUS.IN_PROGRESS).length,
      completed: hostMissions.filter(m => 
        m.status === MISSION_STATUS.COMPLETED || m.status === MISSION_STATUS.RATED
      ).length,
      toRate: hostMissions.filter(m => m.status === MISSION_STATUS.COMPLETED).length,
    }
  }, [missions])

  const getTotalEarnings = useCallback((role = 'cleaner', userId = null) => {
    return missions
      .filter(m => {
        const isCompleted = m.status === MISSION_STATUS.COMPLETED || m.status === MISSION_STATUS.RATED
        if (!isCompleted) return false
        
        if (role === 'cleaner') {
          if (userId) return m.cleanerId === userId
          return m.cleanerId !== null
        }
        if (role === 'host') return m.hostId === (userId || 'host-demo')
        return false
      })
      .reduce((sum, m) => sum + m.price, 0)
  }, [missions])

  // Vérifier si une mission est "nouvelle" (< 60 minutes)
  const isMissionNew = useCallback((missionId) => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return false
    return Date.now() - mission.createdAt < NEW_MISSION_DURATION
  }, [missions])

  // ============================================
  // ACTIONS - Cleaner
  // ============================================

  const applyToMission = useCallback((missionId, cleanerData = null) => {
    const cleaner = cleanerData || getCleanerById('cleaner-paul')

    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m
      return {
        ...m,
        status: MISSION_STATUS.APPLIED,
        cleanerId: cleaner.id,
        cleanerName: cleaner.name,
        cleanerAvatar: cleaner.avatar,
        appliedAt: Date.now(),
        timeline: [
          ...m.timeline,
          { event: 'applied', timestamp: Date.now(), label: `${cleaner.name} a postulé` },
        ],
      }
    }))
  }, [])

  const cancelApplication = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m
      return {
        ...m,
        status: MISSION_STATUS.PENDING,
        cleanerId: null,
        cleanerName: null,
        cleanerAvatar: null,
        appliedAt: null,
        timeline: m.timeline.filter(t => t.event !== 'applied'),
      }
    }))
  }, [])

  const startMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m
      return {
        ...m,
        status: MISSION_STATUS.IN_PROGRESS,
        startedAt: Date.now(),
        timeline: [
          ...m.timeline,
          { event: 'started', timestamp: Date.now(), label: 'Ménage démarré' },
        ],
      }
    }))
  }, [])

  const completeMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m
      return {
        ...m,
        status: MISSION_STATUS.COMPLETED,
        completedAt: Date.now(),
        timeline: [
          ...m.timeline,
          { event: 'completed', timestamp: Date.now(), label: 'Ménage terminé' },
        ],
      }
    }))
  }, [])

  // ============================================
  // ACTIONS - Host
  // ============================================

  const createMission = useCallback((missionData, hostData = null) => {
    const host = hostData || {
      id: 'host-demo',
      name: 'Vincent Martin',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    }

    // Support instant booking with pre-assigned cleaner
    const isInstantBooking = missionData.instantBooking && missionData.cleanerId

    const initialTimeline = [
      { event: 'created', timestamp: Date.now(), label: 'Réservation créée' },
    ]

    if (isInstantBooking) {
      initialTimeline.push({
        event: 'confirmed',
        timestamp: Date.now(),
        label: `${missionData.cleanerName} confirmé(e)`,
      })
    }

    const newMission = {
      id: generateId('mission-'),
      ...missionData,
      hostId: host.id,
      hostName: host.name,
      hostAvatar: host.avatar,
      cleanerId: missionData.cleanerId || null,
      cleanerName: missionData.cleanerName || null,
      cleanerAvatar: missionData.cleanerAvatar || null,
      status: isInstantBooking ? MISSION_STATUS.CONFIRMED : MISSION_STATUS.PENDING,
      createdAt: Date.now(),
      appliedAt: isInstantBooking ? Date.now() : null,
      confirmedAt: isInstantBooking ? Date.now() : null,
      startedAt: null,
      completedAt: null,
      rating: null,
      review: null,
      instantBooking: isInstantBooking || false,
      bookingMode: isInstantBooking ? 'instant' : 'application',
      timeline: initialTimeline,
    }
    setMissions(prev => [newMission, ...prev])
    return newMission
  }, [])

  const confirmMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m
      return {
        ...m,
        status: MISSION_STATUS.CONFIRMED,
        confirmedAt: Date.now(),
        timeline: [
          ...m.timeline,
          { event: 'confirmed', timestamp: Date.now(), label: `${m.cleanerName} confirmé(e)` },
        ],
      }
    }))
  }, [])

  const rejectCleaner = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m
      return {
        ...m,
        status: MISSION_STATUS.PENDING,
        cleanerId: null,
        cleanerName: null,
        cleanerAvatar: null,
        appliedAt: null,
        timeline: m.timeline.filter(t => t.event !== 'applied'),
      }
    }))
  }, [])

  const rateMission = useCallback((missionId, rating, review) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m
      const stars = '⭐'.repeat(rating)
      return {
        ...m,
        status: MISSION_STATUS.RATED,
        rating,
        review,
        timeline: [
          ...m.timeline,
          { event: 'rated', timestamp: Date.now(), label: `Avis laissé ${stars}` },
        ],
      }
    }))
  }, [])

  // ============================================
  // ACTIONS - Cleaner propose ses services
  // ============================================

  const proposeService = useCallback((propertyData, cleanerData, proposalData) => {
    const cleaner = cleanerData || getCleanerById('cleaner-paul')

    const newProposal = {
      id: generateId('proposal-'),
      ...propertyData,
      ...proposalData,
      hostId: propertyData.hostId || 'host-demo',
      hostName: propertyData.hostName || 'Vincent Martin',
      hostAvatar: propertyData.hostAvatar || 'https://randomuser.me/api/portraits/men/52.jpg',
      cleanerId: cleaner.id,
      cleanerName: cleaner.name,
      cleanerAvatar: cleaner.avatar,
      status: MISSION_STATUS.APPLIED,
      createdAt: Date.now(),
      appliedAt: Date.now(),
      confirmedAt: null,
      startedAt: null,
      completedAt: null,
      rating: null,
      review: null,
      isProposal: true,
      bookingMode: 'application',
      timeline: [
        { event: 'created', timestamp: Date.now(), label: 'Proposition envoyée' },
        { event: 'applied', timestamp: Date.now(), label: `${cleaner.name} a proposé ses services` },
      ],
    }
    setMissions(prev => [newProposal, ...prev])
    return newProposal
  }, [])

  // ============================================
  // RESET
  // ============================================

  const resetMissions = useCallback(() => {
    setMissions(generateInitialMissions())
  }, [])

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = {
    missions,
    // Cleaner getters
    getAvailableMissions,
    getMyApplications,
    getConfirmedMissions,
    getMissionsForCleaner,
    // Host getters
    getPendingApplications,
    getUpcomingMissions,
    getToRateMissions,
    // Generic getters
    getMissionsByStatus,
    getMissionById,
    getStats,
    getTotalEarnings,
    isMissionNew,
    // Cleaner actions
    applyToMission,
    cancelApplication,
    startMission,
    completeMission,
    proposeService,
    // Host actions
    createMission,
    confirmMission,
    rejectCleaner,
    rateMission,
    // Reset
    resetMissions,
  }

  return (
    <MissionsContext.Provider value={value}>
      {children}
    </MissionsContext.Provider>
  )
}

export function useMissions() {
  const context = useContext(MissionsContext)
  if (!context) {
    throw new Error('useMissions must be used within a MissionsProvider')
  }
  return context
}

export default useMissions
