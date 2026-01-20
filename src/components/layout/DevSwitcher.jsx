import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Sparkles, RefreshCw, X, Bell, ChevronUp, HelpCircle, CheckCircle, ArrowRight, Play, Lightbulb, ChevronDown, Award, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { useMissions } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useToast } from '@/hooks/useToast'
import { ROLES, ONBOARDING_ACTIONS, DEMO_CLEANERS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// ============================================
// DEV SWITCHER ULTIMATE - Avec Persona Cleaner
// ============================================

function DevSwitcher() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showCleanerSelector, setShowCleanerSelector] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { user, switchRole, switchCleanerPersona, selectedCleanerId } = useAuth()
  const { getUnreadCount: getUnreadMessages, resetMessages } = useMessages()
  const { resetMissions, getConfirmedMissions } = useMissions()
  const { getUnreadCount: getUnreadNotifications, getLatestUnread, showRichToast, resetNotifications } = useNotifications()
  const { 
    hasSeenDevSwitcherTip, 
    dismissDevSwitcherTip, 
    getProgress,
    getActionsWithStatus,
    markActionComplete,
    resetOnboarding 
  } = useOnboarding()
  const { info, success } = useToast()

  const currentRole = location.pathname.startsWith('/host') ? ROLES.HOST : ROLES.CLEANER
  const isHost = currentRole === ROLES.HOST

  // Trouver le cleaner actuellement sélectionné
  const currentCleaner = DEMO_CLEANERS.find(c => c.id === selectedCleanerId) || DEMO_CLEANERS[0]

  // Compter les missions confirmées pour ce cleaner
  const confirmedMissionsForCleaner = getConfirmedMissions().filter(m => m.cleanerId === selectedCleanerId)

  const unreadMessagesHost = getUnreadMessages('host')
  const unreadMessagesCleaner = getUnreadMessages('cleaner')
  const unreadNotifsHost = getUnreadNotifications('host')
  const unreadNotifsCleaner = getUnreadNotifications('cleaner')
  
  const totalHost = unreadMessagesHost + unreadNotifsHost
  const totalCleaner = unreadMessagesCleaner + unreadNotifsCleaner
  const otherUnread = isHost ? totalCleaner : totalHost

  const progress = getProgress()
  const actions = getActionsWithStatus()

  // Contextual hints based on current state
  const getContextualHint = () => {
    const completedActions = actions.filter(a => a.completed)
    const pendingActions = actions.filter(a => !a.completed)
    
    if (pendingActions.length === 0) {
      return { text: "🎉 Bravo ! Vous avez tout testé !", action: null }
    }
    
    const nextAction = pendingActions[0]
    
    if (nextAction.id === ONBOARDING_ACTIONS.SWITCHED_ROLE) {
      return { 
        text: "Commencez par changer de rôle pour découvrir les deux interfaces",
        action: () => handleSwitch(isHost ? ROLES.CLEANER : ROLES.HOST)
      }
    }
    if (nextAction.id === ONBOARDING_ACTIONS.CREATED_MISSION && isHost) {
      return { 
        text: "👆 Créez votre première demande de ménage",
        action: null
      }
    }
    if (nextAction.id === ONBOARDING_ACTIONS.CREATED_MISSION && !isHost) {
      return { 
        text: "Passez côté Hôte pour créer une demande",
        action: () => handleSwitch(ROLES.HOST)
      }
    }
    if (nextAction.id === ONBOARDING_ACTIONS.CONFIRMED_CLEANER) {
      return { 
        text: isHost ? "Choisissez un cleaner dans le modal de création" : "Passez côté Hôte",
        action: !isHost ? () => handleSwitch(ROLES.HOST) : null
      }
    }
    if (nextAction.id === ONBOARDING_ACTIONS.COMPLETED_MISSION) {
      return { 
        text: !isHost ? "Démarrez et terminez votre mission" : "Passez côté Cleaner",
        action: isHost ? () => handleSwitch(ROLES.CLEANER) : null
      }
    }
    
    return { text: "Continuez à explorer !", action: null }
  }

  const hint = getContextualHint()

  const handleSwitch = (targetRole) => {
    if (targetRole === currentRole) return
    
    setIsAnimating(true)
    markActionComplete(ONBOARDING_ACTIONS.SWITCHED_ROLE)
    
    setTimeout(() => {
      switchRole(targetRole)
      
      // Afficher le toast enrichi s'il y a une notification non lue pour le nouveau rôle
      const newRole = targetRole === ROLES.HOST ? 'host' : 'cleaner'
      const latestNotif = getLatestUnread(newRole)
      if (latestNotif && latestNotif.actionable) {
        setTimeout(() => {
          showRichToast(latestNotif)
        }, 500)
      }
      
      if (targetRole === ROLES.HOST) {
        navigate('/host')
      } else {
        navigate('/cleaner')
      }
      setIsAnimating(false)
      setIsExpanded(false)
      setShowCleanerSelector(false)
    }, 400)
  }

  const handleSelectCleaner = (cleanerId) => {
    switchCleanerPersona(cleanerId)
    setShowCleanerSelector(false)
    
    const cleaner = DEMO_CLEANERS.find(c => c.id === cleanerId)
    if (cleaner) {
      success(`Vous êtes maintenant ${cleaner.name} 🧹`)
    }
    
    // Si on est côté cleaner, naviguer pour rafraîchir
    if (!isHost) {
      navigate('/cleaner')
    }
  }

  const handleResetAll = () => {
    resetMessages()
    resetMissions()
    resetNotifications()
    resetOnboarding()
    setShowResetConfirm(false)
    setIsExpanded(false)
    success('Démo réinitialisée ! 🔄')
  }

  // Auto-dismiss tooltip
  useEffect(() => {
    if (!hasSeenDevSwitcherTip) {
      const timer = setTimeout(() => {
        dismissDevSwitcherTip()
      }, 15000)
      return () => clearTimeout(timer)
    }
  }, [hasSeenDevSwitcherTip, dismissDevSwitcherTip])

  // Badge icons
  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'top': return <Award className="w-3 h-3" />
      case 'verified': return <CheckCircle className="w-3 h-3" />
      case 'new': return <Sparkles className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <>
      {/* Overlay pour fermer */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsExpanded(false)
            setShowCleanerSelector(false)
          }}
        />
      )}

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Guide de la démo</h3>
              <button onClick={() => setShowGuide(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {[
                { step: 1, icon: '🏠', title: 'Côté Hôte', desc: 'Créez une demande de ménage et choisissez un cleaner' },
                { step: 2, icon: '🧹', title: 'Sélectionnez le persona', desc: 'Choisissez le cleaner que vous venez d\'assigner' },
                { step: 3, icon: '👀', title: 'Côté Cleaner', desc: 'Voyez la mission confirmée apparaître' },
                { step: 4, icon: '▶️', title: 'Démarrer', desc: 'Lancez la mission (simulation du jour J)' },
                { step: 5, icon: '✅', title: 'Terminer', desc: 'Marquez la mission comme terminée' },
                { step: 6, icon: '⭐', title: 'Retour Hôte', desc: 'Notez le cleaner et voyez l\'avis reçu' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button fullWidth onClick={() => setShowGuide(false)}>
              C'est compris !
            </Button>
          </div>
        </div>
      )}

      {/* Dev Switcher */}
      <div className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
        isExpanded ? 'scale-100' : 'scale-100'
      )}>
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in-up">
            <div className="p-4">
              {/* Mode Badge - P0: Toujours visible */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mode actif</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                  Mode Instant
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">Progression du test</span>
                  <span className="text-slate-500">{progress.completed}/{progress.total}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Contextual Hint */}
              {hint.text && progress.percentage < 100 && (
                <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">{hint.text}</p>
                  </div>
                  {hint.action && (
                    <button
                      onClick={hint.action}
                      className="mt-2 text-xs font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1"
                    >
                      Aller <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Role Buttons */}
              <div className="space-y-2 mb-4">
                {/* Hôte Button */}
                <button
                  onClick={() => handleSwitch(ROLES.HOST)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-xl transition-all',
                    currentRole === ROLES.HOST
                      ? 'bg-teal-50 border-2 border-teal-300 shadow-sm'
                      : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      currentRole === ROLES.HOST
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    )}>
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className={cn(
                        'font-semibold',
                        currentRole === ROLES.HOST ? 'text-teal-700' : 'text-slate-700'
                      )}>
                        Espace Hôte
                      </p>
                      <p className="text-xs text-slate-500">Vincent Martin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalHost > 0 && (
                      <span className="px-2 py-0.5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        {totalHost}
                      </span>
                    )}
                    {currentRole === ROLES.HOST && (
                      <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </button>

                {/* Cleaner Button avec Persona Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (currentRole === ROLES.CLEANER) {
                        setShowCleanerSelector(!showCleanerSelector)
                      } else {
                        handleSwitch(ROLES.CLEANER)
                      }
                    }}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-xl transition-all',
                      currentRole === ROLES.CLEANER
                        ? 'bg-sky-50 border-2 border-sky-300 shadow-sm'
                        : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={currentCleaner.avatar}
                          alt={currentCleaner.name}
                          className={cn(
                            'w-10 h-10 rounded-xl object-cover',
                            currentRole === ROLES.CLEANER ? 'ring-2 ring-sky-400' : ''
                          )}
                        />
                        {currentCleaner.badge === 'top' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                            <Award className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <p className={cn(
                          'font-semibold flex items-center gap-1',
                          currentRole === ROLES.CLEANER ? 'text-sky-700' : 'text-slate-700'
                        )}>
                          Espace Cleaner
                          <ChevronDown className={cn(
                            'w-4 h-4 transition-transform',
                            showCleanerSelector && 'rotate-180'
                          )} />
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          {currentCleaner.name}
                          {confirmedMissionsForCleaner.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                              {confirmedMissionsForCleaner.length} mission{confirmedMissionsForCleaner.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {totalCleaner > 0 && (
                        <span className="px-2 py-0.5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          {totalCleaner}
                        </span>
                      )}
                      {currentRole === ROLES.CLEANER && (
                        <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>

                  {/* Persona Selector Dropdown */}
                  {showCleanerSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10 animate-fade-in">
                      <div className="p-2">
                        <p className="text-xs font-medium text-slate-500 px-2 py-1 mb-1">
                          Choisir un persona cleaner
                        </p>
                        {DEMO_CLEANERS.map((cleaner) => {
                          const missionsCount = getConfirmedMissions().filter(m => m.cleanerId === cleaner.id).length
                          const isSelected = cleaner.id === selectedCleanerId
                          
                          return (
                            <button
                              key={cleaner.id}
                              onClick={() => handleSelectCleaner(cleaner.id)}
                              className={cn(
                                'w-full flex items-center gap-3 p-2 rounded-lg transition-all',
                                isSelected 
                                  ? 'bg-sky-50 border border-sky-200' 
                                  : 'hover:bg-slate-50'
                              )}
                            >
                              <div className="relative">
                                <img 
                                  src={cleaner.avatar}
                                  alt={cleaner.name}
                                  className="w-8 h-8 rounded-lg object-cover"
                                />
                                {cleaner.badge === 'top' && (
                                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center">
                                    <Award className="w-2 h-2 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                                  {cleaner.name}
                                  {isSelected && <CheckCircle className="w-3.5 h-3.5 text-sky-500" />}
                                </p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <span className={cn(
                                    'px-1 py-0.5 rounded text-[10px] font-medium',
                                    cleaner.badgeColor === 'amber' && 'bg-amber-100 text-amber-700',
                                    cleaner.badgeColor === 'teal' && 'bg-teal-100 text-teal-700',
                                    cleaner.badgeColor === 'sky' && 'bg-sky-100 text-sky-700',
                                  )}>
                                    {cleaner.badgeLabel}
                                  </span>
                                  {missionsCount > 0 && (
                                    <span className="text-green-600 font-medium">
                                      • {missionsCount} confirmée{missionsCount > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setShowGuide(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Guide
                </button>
                
                {showResetConfirm ? (
                  <div className="flex-1 flex gap-1">
                    <button
                      onClick={handleResetAll}
                      className="flex-1 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2 text-xs text-slate-500 hover:bg-slate-50 rounded-lg"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>

              {/* Completion message */}
              {progress.percentage === 100 && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200 text-center">
                  <p className="text-sm font-medium text-green-800">
                    🎉 Bravo ! Vous avez testé toutes les fonctionnalités !
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          id="dev-switcher-trigger"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'relative flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105',
            'bg-gradient-to-r from-slate-700 to-slate-800 text-white',
            isAnimating && 'animate-pulse scale-95',
            !hasSeenDevSwitcherTip && 'animate-bounce'
          )}
        >
          {/* Pulse ring for attention */}
          {!hasSeenDevSwitcherTip && (
            <span className="absolute inset-0 rounded-2xl animate-ping bg-white/30" />
          )}

          {/* Espace Hôte avec badge */}
          <div className="relative flex items-center gap-1">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              isHost ? 'bg-teal-500' : 'bg-white/20'
            )}>
              <Home className="w-4 h-4" />
            </div>
            {unreadNotifsHost > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifsHost}
              </span>
            )}
          </div>

          {/* Espace Cleaner avec avatar et badge */}
          <div className="relative flex items-center gap-1">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden',
              !isHost ? 'ring-2 ring-sky-400' : ''
            )}>
              <img 
                src={currentCleaner.avatar}
                alt={currentCleaner.name}
                className="w-full h-full object-cover"
              />
            </div>
            {unreadNotifsCleaner > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifsCleaner}
              </span>
            )}
          </div>

          {/* Expand indicator */}
          <ChevronUp className={cn(
            'w-4 h-4 transition-transform ml-1',
            isExpanded && 'rotate-180'
          )} />
        </button>
      </div>

      {/* Transition Overlay */}
      {isAnimating && (
        <div className="fixed inset-0 z-[60] bg-white/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              'w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl',
              'animate-spin-slow',
              isHost 
                ? 'bg-gradient-to-br from-sky-500 to-sky-600' 
                : 'bg-gradient-to-br from-teal-500 to-teal-600'
            )}>
              {isHost ? (
                <Sparkles className="w-10 h-10 text-white" />
              ) : (
                <Home className="w-10 h-10 text-white" />
              )}
            </div>
            <p className="font-medium text-slate-600 animate-pulse">
              Changement vers {isHost ? currentCleaner.name : 'Vincent'}...
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export { DevSwitcher }
export default DevSwitcher
