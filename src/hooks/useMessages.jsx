import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { generateId } from '@/lib/utils'

// ============================================
// MESSAGES HOOK V3 FUSION
// Garde l'ancienne API + nouvelles fonctionnalités
// ============================================

const MessagesContext = createContext(null)

// Messages mock initiaux pour la démo
const initialMessages = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    from: 'host',
    fromName: 'Vincent Martin',
    fromAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    fromProperty: 'Studio Marais',
    to: 'cleaner',
    toName: 'Paul D.',
    toAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    text: 'Bonjour Paul ! Merci pour le ménage d\'hier, l\'appartement était impeccable ! 🌟',
    timestamp: Date.now() - 7200000,
    readByHost: true,
    readByCleaner: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    from: 'cleaner',
    fromName: 'Paul D.',
    fromAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    to: 'host',
    toName: 'Vincent Martin',
    toAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    toProperty: 'Studio Marais',
    text: 'Avec plaisir Vincent ! C\'était un appartement très agréable à nettoyer. N\'hésitez pas si vous avez besoin de quelque chose !',
    timestamp: Date.now() - 6000000,
    readByHost: true,
    readByCleaner: true,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    from: 'host',
    fromName: 'Vincent Martin',
    fromAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    fromProperty: 'Studio Marais',
    to: 'cleaner',
    toName: 'Paul D.',
    toAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    text: 'Parfait ! J\'ai une nouvelle réservation pour vendredi, ça vous irait ? 😊',
    timestamp: Date.now() - 180000,
    readByHost: true,
    readByCleaner: false,
  },
]

// Conversations mock
const initialConversations = [
  {
    id: 'conv-1',
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    cleanerId: 'cleaner-demo',
    cleanerName: 'Paul D.',
    cleanerAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    propertyId: 'prop-1',
    propertyName: 'Studio Marais',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop',
    missionId: null, // Pas de mission liée (conversation existante)
  },
]

const STORAGE_KEY = 'cleanair_messages'
const CONVERSATIONS_KEY = 'cleanair_conversations'

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialMessages
    } catch {
      return initialMessages
    }
  })

  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY)
      return stored ? JSON.parse(stored) : initialConversations
    } catch {
      return initialConversations
    }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  }, [conversations])

  // ============================================
  // ANCIENNE API (pour compatibilité)
  // ============================================

  // Compter les messages non lus pour un rôle
  const getUnreadCount = useCallback((role) => {
    return messages.filter(msg => {
      if (role === 'host') {
        return msg.to === 'host' && !msg.readByHost
      } else {
        return msg.to === 'cleaner' && !msg.readByCleaner
      }
    }).length
  }, [messages])

  // Obtenir les messages d'une conversation
  const getConversationMessages = useCallback((conversationId) => {
    return messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [messages])

  // Obtenir le dernier message d'une conversation
  const getLastMessage = useCallback((conversationId) => {
    const convMessages = messages.filter(msg => msg.conversationId === conversationId)
    return convMessages.sort((a, b) => b.timestamp - a.timestamp)[0]
  }, [messages])

  // Obtenir les conversations avec le dernier message et status
  const getConversationsWithPreview = useCallback((role) => {
    return conversations.map(conv => {
      const lastMessage = getLastMessage(conv.id)
      const unreadCount = messages.filter(msg => {
        if (role === 'host') {
          return msg.conversationId === conv.id && msg.to === 'host' && !msg.readByHost
        } else {
          return msg.conversationId === conv.id && msg.to === 'cleaner' && !msg.readByCleaner
        }
      }).length

      return {
        ...conv,
        lastMessage,
        unreadCount,
      }
    }).sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || 0
      const timeB = b.lastMessage?.timestamp || 0
      return timeB - timeA
    })
  }, [conversations, messages, getLastMessage])

  // Envoyer un message (ancienne signature)
  const sendMessage = useCallback((conversationId, text, fromRole) => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation) return

    const newMessage = {
      id: generateId('msg-'),
      conversationId,
      from: fromRole,
      fromName: fromRole === 'host' ? conversation.hostName : conversation.cleanerName,
      fromAvatar: fromRole === 'host' ? conversation.hostAvatar : conversation.cleanerAvatar,
      fromProperty: fromRole === 'host' ? conversation.propertyName : undefined,
      to: fromRole === 'host' ? 'cleaner' : 'host',
      toName: fromRole === 'host' ? conversation.cleanerName : conversation.hostName,
      toAvatar: fromRole === 'host' ? conversation.cleanerAvatar : conversation.hostAvatar,
      toProperty: fromRole === 'cleaner' ? conversation.propertyName : undefined,
      text,
      timestamp: Date.now(),
      readByHost: fromRole === 'host',
      readByCleaner: fromRole === 'cleaner',
    }

    setMessages(prev => [...prev, newMessage])
    return newMessage
  }, [conversations])

  // Marquer les messages d'une conversation comme lus
  const markConversationAsRead = useCallback((conversationId, role) => {
    setMessages(prev => prev.map(msg => {
      if (msg.conversationId === conversationId) {
        if (role === 'host' && msg.to === 'host') {
          return { ...msg, readByHost: true }
        } else if (role === 'cleaner' && msg.to === 'cleaner') {
          return { ...msg, readByCleaner: true }
        }
      }
      return msg
    }))
  }, [])

  // Marquer tous les messages comme lus pour un rôle
  const markAllAsRead = useCallback((role) => {
    setMessages(prev => prev.map(msg => {
      if (role === 'host' && msg.to === 'host') {
        return { ...msg, readByHost: true }
      } else if (role === 'cleaner' && msg.to === 'cleaner') {
        return { ...msg, readByCleaner: true }
      }
      return msg
    }))
  }, [])

  // ============================================
  // NOUVELLE API (pour propositions de service)
  // ============================================

  // Créer une nouvelle conversation (quand Paul propose ses services)
  const createConversation = useCallback((data) => {
    const { missionId, propertyId, propertyName, propertyImage, host, cleaner, initialMessage } = data

    // Vérifier si une conversation existe déjà pour cette mission
    if (missionId) {
      const existing = conversations.find(c => c.missionId === missionId)
      if (existing) {
        return existing
      }
    }

    const newConversation = {
      id: generateId('conv-'),
      hostId: host.id,
      hostName: host.name,
      hostAvatar: host.avatar,
      cleanerId: cleaner.id,
      cleanerName: cleaner.name,
      cleanerAvatar: cleaner.avatar,
      propertyId,
      propertyName,
      propertyImage,
      missionId: missionId || null,
    }

    setConversations(prev => [newConversation, ...prev])

    // Ajouter le message initial si fourni
    if (initialMessage) {
      const newMessage = {
        id: generateId('msg-'),
        conversationId: newConversation.id,
        from: 'cleaner',
        fromName: cleaner.name,
        fromAvatar: cleaner.avatar,
        to: 'host',
        toName: host.name,
        toAvatar: host.avatar,
        toProperty: propertyName,
        text: initialMessage,
        timestamp: Date.now(),
        readByHost: false,
        readByCleaner: true,
        isAutomatic: true,
      }
      setMessages(prev => [...prev, newMessage])
    }

    return newConversation
  }, [conversations])

  // Obtenir conversation par mission ID
  const getConversationByMissionId = useCallback((missionId) => {
    return conversations.find(c => c.missionId === missionId)
  }, [conversations])

  // Ajouter un message système (ex: "Mission confirmée")
  const addSystemMessage = useCallback((conversationId, text) => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation) return

    const systemMessage = {
      id: generateId('msg-'),
      conversationId,
      from: 'system',
      fromName: 'CleanAir',
      fromAvatar: null,
      to: 'both',
      text,
      timestamp: Date.now(),
      readByHost: false,
      readByCleaner: false,
      isSystem: true,
    }

    setMessages(prev => [...prev, systemMessage])
    return systemMessage
  }, [conversations])

  // ============================================
  // RESET
  // ============================================

  const resetMessages = useCallback(() => {
    setMessages(initialMessages)
    setConversations(initialConversations)
  }, [])

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = {
    messages,
    conversations,
    // Ancienne API
    getUnreadCount,
    getConversationMessages,
    getLastMessage,
    getConversationsWithPreview,
    sendMessage,
    markConversationAsRead,
    markAllAsRead,
    // Nouvelle API
    createConversation,
    getConversationByMissionId,
    addSystemMessage,
    // Reset
    resetMessages,
  }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider')
  }
  return context
}

// Hook simple pour obtenir le count non lu (pour les badges)
export function useUnreadCount(role) {
  const { getUnreadCount } = useMessages()
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(getUnreadCount(role))
  }, [getUnreadCount, role])

  return count
}

export default useMessages
