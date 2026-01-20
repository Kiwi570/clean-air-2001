import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bell, X, CheckCircle, Clock, Star, MessageCircle, 
  Sparkles, Calendar, AlertCircle, Check, User, Eye,
  ThumbsUp, ThumbsDown, ArrowRight
} from 'lucide-react'
import { useNotifications, NOTIFICATION_TYPES } from '@/hooks/useNotifications'
import { useMissions } from '@/hooks/useMissions'
import { useToast } from '@/hooks/useToast'
import { useConfetti } from '@/hooks/useConfetti'
import { Button } from '@/components/ui/Button'
import { Badge, RatingBadge } from '@/components/ui/Badge'
import { CleanerProfileModal } from '@/components/ui/CleanerProfileModal'
import { cn, formatCurrency } from '@/lib/utils'

// ============================================
// NOTIFICATIONS PANEL V4 - Enrichi avec actions
// ============================================

function NotificationsPanel({ isOpen, onClose, role }) {
  const navigate = useNavigate()
  const { success, info, error } = useToast()
  const { fire: fireConfetti } = useConfetti()
  const { 
    getNotifications, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead,
    removeNotification,
    notifyMissionConfirmed,
    notifyMissionRejected,
  } = useNotifications()
  const { getMissionById, confirmMission, rejectCleaner } = useMissions()

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [processingId, setProcessingId] = useState(null)

  const notifications = getNotifications(role)
  const unreadCount = getUnreadCount(role)

  // Gérer le clic sur une notification simple
  const handleNotificationClick = (notification) => {
    if (notification.actionable) return // Pas de navigation pour les actionnables
    markAsRead(notification.id)
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
      onClose()
    }
  }

  // Voir le profil du cleaner
  const handleViewProfile = (notification) => {
    setSelectedNotification(notification)
    setShowProfileModal(true)
  }

  // Accepter une candidature
  const handleAccept = async (notification) => {
    setProcessingId(notification.id)
    
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mission = getMissionById(notification.missionId)
    if (mission) {
      confirmMission(notification.missionId)
      notifyMissionConfirmed(mission)
      fireConfetti()
      success(`🎉 ${notification.cleaner?.name || 'Le cleaner'} a été accepté !`)
    }
    
    markAsRead(notification.id)
    removeNotification(notification.id)
    setProcessingId(null)
    setShowProfileModal(false)
  }

  // Refuser une candidature
  const handleReject = async (notification) => {
    setProcessingId(notification.id)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mission = getMissionById(notification.missionId)
    if (mission) {
      rejectCleaner(notification.missionId)
      notifyMissionRejected(mission)
      info('Candidature refusée')
    }
    
    markAsRead(notification.id)
    removeNotification(notification.id)
    setProcessingId(null)
    setShowProfileModal(false)
  }

  const getIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.MISSION_CREATED:
        return <Sparkles className="w-5 h-5 text-sky-500" />
      case NOTIFICATION_TYPES.MISSION_APPLIED:
      case NOTIFICATION_TYPES.SERVICE_PROPOSED:
        return <User className="w-5 h-5 text-amber-500" />
      case NOTIFICATION_TYPES.MISSION_CONFIRMED:
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case NOTIFICATION_TYPES.MISSION_REJECTED:
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case NOTIFICATION_TYPES.MISSION_STARTED:
        return <Sparkles className="w-5 h-5 text-blue-500" />
      case NOTIFICATION_TYPES.MISSION_COMPLETED:
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case NOTIFICATION_TYPES.MISSION_RATED:
        return <Star className="w-5 h-5 text-amber-500" />
      case NOTIFICATION_TYPES.NEW_MESSAGE:
        return <MessageCircle className="w-5 h-5 text-sky-500" />
      default:
        return <Bell className="w-5 h-5 text-slate-500" />
    }
  }

  const formatTime = (timestamp) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days === 1) return 'Hier'
    if (days < 7) return `Il y a ${days} jours`
    return new Date(timestamp).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  // Rendu d'une notification avec actions (candidature)
  const renderCandidatureNotification = (notification) => {
    const isProcessing = processingId === notification.id

    return (
      <div
        key={notification.id}
        className={cn(
          'p-4 transition-all',
          notification.read 
            ? 'bg-white' 
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400'
        )}
      >
        {/* Header avec avatar du cleaner */}
        <div className="flex items-start gap-3">
          {notification.cleaner?.avatar ? (
            <img 
              src={notification.cleaner.avatar}
              alt={notification.cleaner.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <User className="w-6 h-6 text-amber-600" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">
                  {notification.cleaner?.name || 'Nouveau cleaner'}
                </p>
                <p className="text-sm text-slate-500">
                  {notification.message}
                </p>
              </div>
              {!notification.read && (
                <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-2 animate-pulse" />
              )}
            </div>

            {/* Stats du cleaner */}
            {notification.cleaner && (
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-sm font-medium">{notification.cleaner.rating}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                  {notification.cleaner.completedMissions} missions
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                  {notification.cleaner.reviewCount} avis
                </span>
              </div>
            )}

            {/* Mission info */}
            {notification.mission && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-lg">
                <img 
                  src={notification.mission.propertyImage}
                  alt={notification.mission.propertyName}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {notification.mission.propertyName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {notification.mission.date} • {notification.mission.time}
                  </p>
                </div>
                <span className="font-bold text-sky-600">
                  {formatCurrency(notification.mission.price)}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => handleViewProfile(notification)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                Voir profil
              </button>
              <button
                onClick={() => handleReject(notification)}
                disabled={isProcessing}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <ThumbsDown className="w-4 h-4" />
                Refuser
              </button>
              <button
                onClick={() => handleAccept(notification)}
                disabled={isProcessing}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ThumbsUp className="w-4 h-4" />
                )}
                Accepter
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              {formatTime(notification.createdAt)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Rendu d'une notification de confirmation (pour le cleaner)
  const renderConfirmedNotification = (notification) => {
    return (
      <div
        key={notification.id}
        onClick={() => handleNotificationClick(notification)}
        className={cn(
          'p-4 cursor-pointer transition-all',
          notification.read 
            ? 'bg-white hover:bg-slate-50' 
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400'
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900">{notification.title}</p>
            <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
            
            {notification.mission && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-lg">
                <img 
                  src={notification.mission.propertyImage}
                  alt={notification.mission.propertyName}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {notification.mission.propertyName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {notification.mission.date} • {notification.mission.time}
                  </p>
                </div>
                <span className="font-bold text-green-600">
                  {formatCurrency(notification.mission.price)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">{formatTime(notification.createdAt)}</p>
              <button className="flex items-center gap-1 text-xs text-sky-600 font-medium hover:underline">
                Voir la mission <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Rendu d'une notification standard
  const renderStandardNotification = (notification) => {
    return (
      <div
        key={notification.id}
        onClick={() => handleNotificationClick(notification)}
        className={cn(
          'p-4 cursor-pointer transition-colors',
          notification.read 
            ? 'bg-white hover:bg-slate-50' 
            : 'bg-sky-50/50 hover:bg-sky-50'
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            notification.read ? 'bg-slate-100' : 'bg-white'
          )}>
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className={cn(
                'font-medium text-sm',
                notification.read ? 'text-slate-700' : 'text-slate-900'
              )}>
                {notification.title}
              </p>
              {!notification.read && (
                <span className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0 mt-1.5" />
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {formatTime(notification.createdAt)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Décider du type de rendu pour chaque notification
  const renderNotification = (notification) => {
    if (notification.actionType === 'candidature' && role === 'host') {
      return renderCandidatureNotification(notification)
    }
    if (notification.actionType === 'confirmed' && role === 'cleaner') {
      return renderConfirmedNotification(notification)
    }
    return renderStandardNotification(notification)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-full mt-2 w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fade-in-down">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-sky-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead(role)}
                className="text-xs text-sky-600 hover:text-sky-700 font-medium"
              >
                Tout marquer lu
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">Aucune notification</p>
              <p className="text-sm text-slate-400 mt-1">
                {role === 'host' 
                  ? 'Les candidatures apparaîtront ici'
                  : 'Les mises à jour apparaîtront ici'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map(renderNotification)}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50">
            <Button 
              variant="ghost" 
              size="sm" 
              fullWidth
              onClick={() => {
                info('Historique complet disponible prochainement 🔔')
                onClose()
              }}
            >
              Voir tout l'historique
            </Button>
          </div>
        )}
      </div>

      {/* Modal Profil Cleaner */}
      <CleanerProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false)
          setSelectedNotification(null)
        }}
        cleaner={selectedNotification?.cleaner}
        mission={selectedNotification?.mission}
        onAccept={() => handleAccept(selectedNotification)}
        onReject={() => handleReject(selectedNotification)}
        isLoading={processingId === selectedNotification?.id}
      />
    </>
  )
}

export { NotificationsPanel }
export default NotificationsPanel
