import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react'

const NotificationsContext = createContext(null)

// Types de notifications
export const NOTIFICATION_TYPES = {
  MISSION_CREATED: 'mission_created',
  MISSION_APPLIED: 'mission_applied',
  MISSION_CONFIRMED: 'mission_confirmed',
  MISSION_REJECTED: 'mission_rejected',
  MISSION_STARTED: 'mission_started',
  MISSION_COMPLETED: 'mission_completed',
  MISSION_RATED: 'mission_rated',
  NEW_MESSAGE: 'new_message',
  SERVICE_PROPOSED: 'service_proposed',
}

// Notifications initiales pour la démo
const initialNotifications = [
  {
    id: 'notif-1',
    type: NOTIFICATION_TYPES.MISSION_CONFIRMED,
    title: 'Mission confirmée !',
    message: 'Vincent a confirmé votre candidature pour Studio Marais',
    forRole: 'cleaner',
    read: false,
    actionUrl: '/cleaner/missions/mission-1',
    missionId: 'mission-1',
    createdAt: Date.now() - 79200000,
  },
  {
    id: 'notif-2',
    type: NOTIFICATION_TYPES.MISSION_RATED,
    title: 'Nouvel avis reçu ⭐',
    message: 'Vincent vous a donné 5 étoiles pour Studio Marais',
    forRole: 'cleaner',
    read: true,
    actionUrl: '/cleaner/earnings',
    missionId: 'mission-old-1',
    createdAt: Date.now() - 165600000,
  },
]

const STORAGE_KEY = 'cleanair_notifications'

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialNotifications
    } catch {
      return initialNotifications
    }
  })

  // ============================================
  // TOAST ENRICHI - Notification à afficher
  // ============================================
  const [pendingToast, setPendingToast] = useState(null)
  const toastTimeoutRef = useRef(null)

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  // Obtenir les notifications pour un rôle
  const getNotifications = useCallback((role) => {
    return notifications
      .filter(n => n.forRole === role)
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [notifications])

  // Obtenir le nombre de notifications non lues
  const getUnreadCount = useCallback((role) => {
    return notifications.filter(n => n.forRole === role && !n.read).length
  }, [notifications])

  // Obtenir la dernière notification non lue pour un rôle
  const getLatestUnread = useCallback((role) => {
    return notifications
      .filter(n => n.forRole === role && !n.read)
      .sort((a, b) => b.createdAt - a.createdAt)[0] || null
  }, [notifications])

  // Afficher un toast enrichi
  const showRichToast = useCallback((notification) => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    setPendingToast(notification)
  }, [])

  // Cacher le toast enrichi
  const hideRichToast = useCallback(() => {
    setPendingToast(null)
  }, [])

  // Ajouter une notification
  const addNotification = useCallback((notification, showToast = false) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      ...notification,
      read: false,
      createdAt: Date.now(),
    }
    setNotifications(prev => [newNotif, ...prev])
    
    // Afficher un toast si demandé
    if (showToast) {
      showRichToast(newNotif)
    }
    
    return newNotif
  }, [showRichToast])

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) {
        return { ...n, read: true }
      }
      return n
    }))
  }, [])

  // Marquer toutes les notifications comme lues pour un rôle
  const markAllAsRead = useCallback((role) => {
    setNotifications(prev => prev.map(n => {
      if (n.forRole === role) {
        return { ...n, read: true }
      }
      return n
    }))
  }, [])

  // Supprimer une notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  // ============================================
  // NOTIFICATIONS ENRICHIES V4
  // ============================================

  // Notification quand un cleaner postule (pour l'hôte)
  const notifyMissionApplied = useCallback((mission, cleanerData = null) => {
    const cleaner = cleanerData || {
      id: mission.cleanerId || 'cleaner-demo',
      name: mission.cleanerName || 'Paul D.',
      fullName: 'Paul Durand',
      avatar: mission.cleanerAvatar || 'https://randomuser.me/api/portraits/men/75.jpg',
      rating: 4.9,
      reviewCount: 48,
      completedMissions: 142,
      bio: 'Professionnel du ménage depuis 5 ans',
    }

    // Retourne la notification créée
    return addNotification({
      type: NOTIFICATION_TYPES.MISSION_APPLIED,
      title: '👋 Nouvelle candidature !',
      message: `${cleaner.name} souhaite effectuer le ménage de ${mission.propertyName}`,
      forRole: 'host',
      actionUrl: `/host/bookings`,
      missionId: mission.id,
      // Données enrichies du cleaner
      cleaner: {
        id: cleaner.id,
        name: cleaner.name,
        fullName: cleaner.fullName,
        avatar: cleaner.avatar,
        rating: cleaner.rating,
        reviewCount: cleaner.reviewCount,
        completedMissions: cleaner.completedMissions,
        bio: cleaner.bio,
      },
      // Données de la mission
      mission: {
        id: mission.id,
        propertyName: mission.propertyName,
        propertyImage: mission.propertyImage,
        date: mission.date,
        time: mission.time,
        price: mission.price,
      },
      // Flag pour actions
      actionable: true,
      actionType: 'candidature',
    })
  }, [addNotification])

  // Notification quand l'hôte confirme (pour le cleaner)
  const notifyMissionConfirmed = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_CONFIRMED,
      title: '🎉 Candidature acceptée !',
      message: `${mission.hostName} vous a choisi pour ${mission.propertyName}`,
      forRole: 'cleaner',
      actionUrl: `/cleaner/missions/${mission.id}`,
      missionId: mission.id,
      // Données enrichies
      host: {
        name: mission.hostName,
        avatar: mission.hostAvatar,
      },
      mission: {
        id: mission.id,
        propertyName: mission.propertyName,
        propertyImage: mission.propertyImage,
        date: mission.date,
        time: mission.time,
        price: mission.price,
      },
      actionable: true,
      actionType: 'confirmed',
    })
  }, [addNotification])

  // Notification quand l'hôte refuse (pour le cleaner)
  const notifyMissionRejected = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_REJECTED,
      title: '😔 Candidature non retenue',
      message: `Votre candidature pour ${mission.propertyName} n'a pas été retenue`,
      forRole: 'cleaner',
      actionUrl: `/cleaner/missions`,
      missionId: mission.id,
      mission: {
        id: mission.id,
        propertyName: mission.propertyName,
      },
      actionable: true,
      actionType: 'rejected',
    })
  }, [addNotification])

  // Créer des notifications pour les différents événements
  const notifyMissionCreated = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_CREATED,
      title: 'Nouvelle mission disponible ! 🆕',
      message: `${mission.propertyName} - ${mission.date} à ${mission.time} (${mission.price}€)`,
      forRole: 'cleaner',
      actionUrl: `/cleaner/missions/${mission.id}`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyMissionStarted = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_STARTED,
      title: 'Ménage en cours 🧹',
      message: `${mission.cleanerName} a commencé le ménage de ${mission.propertyName}`,
      forRole: 'host',
      actionUrl: `/host/bookings`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyMissionCompleted = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_COMPLETED,
      title: 'Ménage terminé ! ✨',
      message: `Le ménage de ${mission.propertyName} est terminé. N'oubliez pas de noter !`,
      forRole: 'host',
      actionUrl: `/host/bookings`,
      missionId: mission.id,
      actionable: true,
      actionType: 'rate',
    })
  }, [addNotification])

  const notifyMissionRated = useCallback((mission, rating) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_RATED,
      title: `Nouvel avis reçu ${'⭐'.repeat(rating)}`,
      message: `${mission.hostName} vous a donné ${rating} étoile${rating > 1 ? 's' : ''} pour ${mission.propertyName}`,
      forRole: 'cleaner',
      actionUrl: `/cleaner/earnings`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyNewMessage = useCallback((fromName, forRole) => {
    addNotification({
      type: NOTIFICATION_TYPES.NEW_MESSAGE,
      title: 'Nouveau message 💬',
      message: `${fromName} vous a envoyé un message`,
      forRole: forRole,
      actionUrl: forRole === 'host' ? '/host/messages' : '/cleaner/messages',
    })
  }, [addNotification])

  // Notification quand un cleaner propose ses services
  const notifyNewProposal = useCallback((proposal, cleanerData = null) => {
    const cleaner = cleanerData || {
      id: proposal.cleanerId || 'cleaner-demo',
      name: proposal.cleanerName || 'Paul D.',
      fullName: 'Paul Durand',
      avatar: proposal.cleanerAvatar || 'https://randomuser.me/api/portraits/men/75.jpg',
      rating: 4.9,
      reviewCount: 48,
      completedMissions: 142,
      bio: 'Professionnel du ménage depuis 5 ans',
    }

    addNotification({
      type: NOTIFICATION_TYPES.SERVICE_PROPOSED,
      title: '🚀 Nouvelle proposition de service !',
      message: `${cleaner.name} propose ses services pour ${proposal.propertyName} (${proposal.price}€)`,
      forRole: 'host',
      actionUrl: `/host/bookings`,
      missionId: proposal.id,
      cleaner: {
        id: cleaner.id,
        name: cleaner.name,
        fullName: cleaner.fullName,
        avatar: cleaner.avatar,
        rating: cleaner.rating,
        reviewCount: cleaner.reviewCount,
        completedMissions: cleaner.completedMissions,
        bio: cleaner.bio,
      },
      mission: {
        id: proposal.id,
        propertyName: proposal.propertyName,
        propertyImage: proposal.propertyImage,
        date: proposal.date,
        time: proposal.time,
        price: proposal.price,
      },
      actionable: true,
      actionType: 'candidature',
    })
  }, [addNotification])

  // Reset pour la démo
  const resetNotifications = useCallback(() => {
    setNotifications(initialNotifications)
  }, [])

  const value = {
    notifications,
    getNotifications,
    getUnreadCount,
    getLatestUnread,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    notifyMissionCreated,
    notifyMissionApplied,
    notifyMissionConfirmed,
    notifyMissionRejected,
    notifyMissionStarted,
    notifyMissionCompleted,
    notifyMissionRated,
    notifyNewMessage,
    notifyNewProposal,
    resetNotifications,
    NOTIFICATION_TYPES,
    // Toast enrichi
    pendingToast,
    showRichToast,
    hideRichToast,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}

export default useNotifications
