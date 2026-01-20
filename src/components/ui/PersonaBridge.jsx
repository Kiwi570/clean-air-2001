import { useState, useEffect } from 'react'
import { ArrowRight, User, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

/**
 * PersonaBridge - Notification pour guider vers le bon persona
 * P0: Le testeur ne doit jamais rater la connexion entre l'assignation et le changement de vue
 */
function PersonaBridge({ 
  cleanerName,
  cleanerAvatar,
  isVisible = false,
  onDismiss,
  onSwitchPersona,
  className 
}) {
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        'w-[calc(100%-2rem)] max-w-md',
        isAnimating && 'animate-fade-in-up',
        className
      )}
    >
      <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-2xl shadow-2xl overflow-hidden">
        {/* Dismiss button */}
        <button 
          onClick={onDismiss}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5">
          {/* Header avec icône */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/90 text-sm font-medium">
              Mission assignée !
            </span>
          </div>

          {/* Message principal */}
          <p className="text-white text-lg font-semibold mb-4">
            {cleanerName} est maintenant assigné(e) à cette mission
          </p>

          {/* Call to action */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
            <p className="text-white/90 text-sm mb-3">
              👉 Pour voir la suite côté Cleaner, sélectionnez <strong>{cleanerName}</strong> dans le sélecteur de persona (en bas à droite).
            </p>
            
            {/* Visual guide */}
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
                <User className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Vous (Hôte)</span>
              </div>
              <ArrowRight className="w-5 h-5 text-white/70" />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg">
                {cleanerAvatar ? (
                  <img src={cleanerAvatar} alt={cleanerName} className="w-5 h-5 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-teal-600" />
                )}
                <span className="text-teal-700 text-sm font-medium">{cleanerName}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="flex-1 text-white/80 hover:text-white hover:bg-white/10"
            >
              Plus tard
            </Button>
            <Button
              size="sm"
              onClick={onSwitchPersona}
              className="flex-1 bg-white text-teal-700 hover:bg-white/90"
              icon={ArrowRight}
              iconPosition="right"
            >
              Voir côté {cleanerName}
            </Button>
          </div>
        </div>

        {/* Progress bar décorative */}
        <div className="h-1 bg-white/20">
          <div className="h-full bg-white/50 animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  )
}

/**
 * PersonaBridgeCompact - Version compacte pour les pages détail
 */
function PersonaBridgeCompact({ 
  cleanerName,
  cleanerAvatar,
  className,
  onSwitchPersona 
}) {
  return (
    <div className={cn(
      'bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 rounded-xl p-4',
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
          {cleanerAvatar ? (
            <img src={cleanerAvatar} alt={cleanerName} className="w-10 h-10 rounded-full" />
          ) : (
            <User className="w-5 h-5 text-sky-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">
            Voir cette mission côté Cleaner ?
          </p>
          <p className="text-xs text-slate-500 truncate">
            Sélectionnez {cleanerName} dans le DevSwitcher
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={onSwitchPersona}
          icon={ArrowRight}
          iconPosition="right"
        >
          Basculer
        </Button>
      </div>
    </div>
  )
}

/**
 * LoopCompleted - Message de boucle complétée après évaluation
 */
function LoopCompleted({ 
  onRebook,
  className 
}) {
  return (
    <div className={cn(
      'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center',
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
        <span className="text-2xl">✅</span>
      </div>
      <h3 className="text-lg font-semibold text-green-800 mb-1">
        Boucle complétée !
      </h3>
      <p className="text-sm text-green-600 mb-4">
        Merci pour votre évaluation. Le cleaner a été notifié.
      </p>
      {onRebook && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRebook}
          className="border-green-300 text-green-700 hover:bg-green-100"
        >
          Reprogrammer un ménage
        </Button>
      )}
    </div>
  )
}

export { PersonaBridge, PersonaBridgeCompact, LoopCompleted }
export default PersonaBridge
