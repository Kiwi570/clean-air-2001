import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  X, Star, CheckCircle, Eye, ThumbsUp, ThumbsDown,
  ArrowRight, User, Calendar, Send, Bell
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

// ============================================
// RICH NOTIFICATION TOAST V2
// Supporte le mode "preview" pour voir la notif envoyée
// ============================================

function RichNotificationToast({ 
  notification, 
  onDismiss, 
  onViewProfile,
  onAccept,
  onReject,
  onNavigate,
}) {
  const [isVisible, setIsVisible] = useState(false)

  // Animation d'entrée
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  // Auto-dismiss après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss?.(), 300)
  }

  const handleAction = (action) => {
    if (action) {
      setIsVisible(false)
      setTimeout(() => {
        action()
      }, 300)
    }
  }

  if (!notification) return null

  const isCandidature = notification.actionType === 'candidature'
  const isConfirmed = notification.actionType === 'confirmed'
  const isPreview = notification.isPreview
  const previewFor = notification.previewFor || 'l\'autre utilisateur'

  const content = (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[9999] w-[420px] max-w-[calc(100vw-3rem)] transition-all duration-300',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      )}
    >
      <div className={cn(
        'bg-white rounded-2xl shadow-2xl border-2 overflow-hidden',
        isCandidature && 'border-amber-300',
        isConfirmed && 'border-green-300',
        !isCandidature && !isConfirmed && 'border-sky-300'
      )}>
        {/* Preview Header - Quand c'est une prévisualisation */}
        {isPreview && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-900 text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium">
              Notification envoyée à <strong>{previewFor}</strong>
            </span>
            <div className="ml-auto flex items-center gap-1 text-xs text-white/70">
              <Bell className="w-3 h-3" />
              À l'instant
            </div>
          </div>
        )}

        {/* Header coloré */}
        <div className={cn(
          'px-4 py-3 flex items-center justify-between',
          isCandidature && 'bg-gradient-to-r from-amber-500 to-orange-500',
          isConfirmed && 'bg-gradient-to-r from-green-500 to-emerald-500',
          !isCandidature && !isConfirmed && 'bg-gradient-to-r from-sky-500 to-blue-500'
        )}>
          <span className="text-white font-bold text-lg">
            {notification.title}
          </span>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4">
          {/* Contenu avec avatar */}
          <div className="flex items-start gap-3">
            {notification.cleaner?.avatar ? (
              <img 
                src={notification.cleaner.avatar}
                alt={notification.cleaner.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
              />
            ) : (
              <div className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center',
                isConfirmed ? 'bg-green-100' : 'bg-amber-100'
              )}>
                {isConfirmed ? (
                  <CheckCircle className="w-7 h-7 text-green-500" />
                ) : (
                  <User className="w-7 h-7 text-amber-600" />
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-slate-600">
                {notification.message}
              </p>

              {/* Stats du cleaner */}
              {isCandidature && notification.cleaner && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold">{notification.cleaner.rating}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm text-slate-500">
                    {notification.cleaner.completedMissions} missions
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm text-slate-500">
                    {notification.cleaner.reviewCount} avis
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mission card */}
          {notification.mission && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-slate-50 rounded-xl">
              <img 
                src={notification.mission.propertyImage}
                alt={notification.mission.propertyName}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">
                  {notification.mission.propertyName}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {notification.mission.date} • {notification.mission.time}
                </div>
              </div>
              <div className={cn(
                'text-xl font-bold',
                isConfirmed ? 'text-green-600' : 'text-sky-600'
              )}>
                {formatCurrency(notification.mission.price)}
              </div>
            </div>
          )}

          {/* Actions - Seulement si pas en mode preview */}
          {!isPreview && (
            <div className="flex items-center gap-2 mt-4">
              {isCandidature && (
                <>
                  <button
                    onClick={() => handleAction(onViewProfile)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Voir profil
                  </button>
                  <button
                    onClick={() => handleAction(onReject)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Refuser
                  </button>
                  <button
                    onClick={() => handleAction(onAccept)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl transition-colors shadow-lg shadow-green-500/25"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Accepter
                  </button>
                </>
              )}

              {isConfirmed && (
                <button
                  onClick={() => handleAction(onNavigate)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl transition-colors shadow-lg shadow-green-500/25"
                >
                  Voir la mission
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {!isCandidature && !isConfirmed && (
                <button
                  onClick={() => handleAction(onNavigate)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
                >
                  Voir les détails
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Message en mode preview */}
          {isPreview && (
            <div className="mt-4 p-3 bg-slate-100 rounded-xl text-center">
              <p className="text-sm text-slate-600">
                💡 Cliquez sur <strong>"Changer"</strong> pour passer côté {previewFor} et voir cette notification
              </p>
            </div>
          )}
        </div>

        {/* Barre de progression */}
        <div className="h-1 bg-slate-100">
          <div 
            className={cn(
              'h-full',
              isCandidature && 'bg-amber-400',
              isConfirmed && 'bg-green-400',
              !isCandidature && !isConfirmed && 'bg-sky-400'
            )}
            style={{
              animation: 'shrinkWidth 10s linear forwards'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )

  return createPortal(content, document.body)
}

export { RichNotificationToast }
export default RichNotificationToast
