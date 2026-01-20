import { useState, useEffect, useRef } from 'react'
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Bell, Search, FlaskConical, User, Home, ArrowLeftRight } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { DevSwitcher } from './DevSwitcher'
import { NotificationsPanel } from './NotificationsPanel'
import { RichNotificationToast } from '@/components/ui/RichNotificationToast'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { useMissions } from '@/hooks/useMissions'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useToast } from '@/hooks/useToast'
import { useConfetti } from '@/hooks/useConfetti'
import { Avatar } from '@/components/ui/Avatar'
import { CleanerProfileModal } from '@/components/ui/CleanerProfileModal'
import { cn } from '@/lib/utils'
import { ROLES } from '@/lib/constants'

// ============================================
// DEMO BANNER - Bandeau Mode Démo
// ============================================
function DemoBanner({ isHost, onSwitchClick }) {
  const { getProgress } = useOnboarding()
  const progress = getProgress()
  const percentage = progress.percentage || 0
  
  return (
    <div className={cn(
      'relative z-50 px-4 py-2 text-center text-sm font-medium',
      'bg-gradient-to-r',
      isHost 
        ? 'from-teal-600 to-emerald-600 text-white' 
        : 'from-sky-600 to-blue-600 text-white'
    )}>
      <div className="flex items-center justify-center gap-3">
        <FlaskConical className="w-4 h-4" />
        <span>
          Mode Démo — Connecté en tant que{' '}
          <strong>{isHost ? 'Vincent (Hôte)' : 'Paul (Cleaner)'}</strong>
        </span>
        <button
          onClick={onSwitchClick}
          className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
        >
          <ArrowLeftRight className="w-3 h-3" />
          Changer
        </button>
        <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-white/30">
          <span className="text-white/80 text-xs">Progression:</span>
          <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold">{percentage}%</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// ROLE INDICATOR - Indicateur dans le header
// ============================================
function RoleIndicator({ isHost, user }) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
      isHost 
        ? 'bg-teal-100 text-teal-700' 
        : 'bg-sky-100 text-sky-700'
    )}>
      {isHost ? (
        <>
          <Home className="w-4 h-4" />
          <span>Vincent Martin</span>
        </>
      ) : (
        <>
          <User className="w-4 h-4" />
          <span>Paul Durand</span>
        </>
      )}
    </div>
  )
}

function AppShell({ role }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, loading } = useAuth()
  const { 
    getUnreadCount, 
    getLatestUnread,
    markAsRead, 
    removeNotification,
    notifyMissionConfirmed,
    notifyMissionRejected,
  } = useNotifications()
  const { getMissionById, confirmMission, rejectCleaner } = useMissions()
  const { success, info } = useToast()
  const { fire: fireConfetti } = useConfetti()
  
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [activeToast, setActiveToast] = useState(null)
  
  const previousRoleRef = useRef(null)
  const currentRole = role === ROLES.HOST ? 'host' : 'cleaner'
  const unreadNotifications = getUnreadCount(currentRole)

  // ============================================
  // DÉTECTION DU CHANGEMENT DE RÔLE
  // ============================================
  useEffect(() => {
    // Si le rôle a changé
    if (previousRoleRef.current !== null && previousRoleRef.current !== currentRole) {
      // Chercher une notification non lue avec action
      const latestNotif = getLatestUnread(currentRole)
      if (latestNotif && latestNotif.actionable) {
        // Afficher le toast avec un petit délai
        setTimeout(() => {
          setActiveToast(latestNotif)
        }, 600)
      }
    }
    previousRoleRef.current = currentRole
  }, [currentRole, getLatestUnread])

  // ============================================
  // HANDLERS POUR LE TOAST ENRICHI
  // ============================================
  
  const handleToastDismiss = () => {
    setActiveToast(null)
  }

  const handleToastViewProfile = () => {
    if (activeToast) {
      setSelectedNotification(activeToast)
      setShowProfileModal(true)
      setActiveToast(null)
    }
  }

  const handleToastAccept = () => {
    if (!activeToast) return
    
    const mission = getMissionById(activeToast.missionId)
    if (mission) {
      confirmMission(activeToast.missionId)
      notifyMissionConfirmed(mission)
      fireConfetti()
      success(`🎉 ${activeToast.cleaner?.name || 'Le cleaner'} a été accepté !`)
    }
    markAsRead(activeToast.id)
    removeNotification(activeToast.id)
    setActiveToast(null)
    setShowProfileModal(false)
  }

  const handleToastReject = () => {
    if (!activeToast) return
    
    const mission = getMissionById(activeToast.missionId)
    if (mission) {
      rejectCleaner(activeToast.missionId)
      notifyMissionRejected(mission)
      info('Candidature refusée')
    }
    markAsRead(activeToast.id)
    removeNotification(activeToast.id)
    setActiveToast(null)
    setShowProfileModal(false)
  }

  const handleToastNavigate = () => {
    if (!activeToast) return
    
    if (activeToast.actionUrl) {
      navigate(activeToast.actionUrl)
    }
    markAsRead(activeToast.id)
    setActiveToast(null)
  }

  // Handler pour accept depuis le modal
  const handleModalAccept = () => {
    if (!selectedNotification) return
    
    const mission = getMissionById(selectedNotification.missionId)
    if (mission) {
      confirmMission(selectedNotification.missionId)
      notifyMissionConfirmed(mission)
      fireConfetti()
      success(`🎉 ${selectedNotification.cleaner?.name || 'Le cleaner'} a été accepté !`)
    }
    markAsRead(selectedNotification.id)
    removeNotification(selectedNotification.id)
    setShowProfileModal(false)
    setSelectedNotification(null)
  }

  const handleModalReject = () => {
    if (!selectedNotification) return
    
    const mission = getMissionById(selectedNotification.missionId)
    if (mission) {
      rejectCleaner(selectedNotification.missionId)
      notifyMissionRejected(mission)
      info('Candidature refusée')
    }
    markAsRead(selectedNotification.id)
    removeNotification(selectedNotification.id)
    setShowProfileModal(false)
    setSelectedNotification(null)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const isHost = role === ROLES.HOST

  // Handler pour le bouton "Changer" du bandeau
  const handleBannerSwitch = () => {
    // Scroll vers le DevSwitcher ou ouvrir directement
    const devSwitcher = document.getElementById('dev-switcher-trigger')
    if (devSwitcher) {
      devSwitcher.click()
    }
  }

  return (
    <div className={cn(
      'min-h-screen',
      isHost ? 'bg-gradient-to-br from-teal-50/30 to-white' : 'bg-gradient-to-br from-sky-50/30 to-white'
    )}>
      {/* Demo Banner - Always visible at top */}
      <DemoBanner isHost={isHost} onSwitchClick={handleBannerSwitch} />
      
      <div className="flex">
        {/* Sidebar (desktop) */}
        <Sidebar role={role} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-20 lg:pb-0">
          {/* Top Header (Mobile) */}
          <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-surface-200">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  isHost 
                    ? 'bg-gradient-to-br from-accent-500 to-accent-600' 
                    : 'bg-gradient-to-br from-brand-500 to-brand-600'
                )}>
                  <span className="text-white font-bold text-sm font-display">C</span>
                </div>
                <span className="font-display font-bold text-lg text-surface-900">
                  Clean<span className={isHost ? 'text-accent-500' : 'text-brand-500'}>Air</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={cn(
                      'relative p-2 rounded-lg transition-colors',
                      showNotifications 
                        ? 'bg-surface-100 text-surface-700' 
                        : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
                    )}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                  <NotificationsPanel 
                    isOpen={showNotifications} 
                    onClose={() => setShowNotifications(false)}
                    role={currentRole}
                  />
                </div>
                <Avatar 
                  src={user?.avatar}
                  name={user?.firstName || user?.email} 
                  size="sm"
                />
              </div>
            </div>
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-surface-200 bg-white/50">
            <div>
              <h1 className="text-2xl font-bold text-surface-900 font-display">
                {user?.firstName 
                  ? `${getGreeting()}, ${user.firstName} 👋`
                  : `${getGreeting()} 👋`
                }
              </h1>
              <p className="text-surface-500 mt-1">
                {isHost 
                  ? 'Gérez vos biens et vos ménages' 
                  : 'Trouvez vos prochaines missions'
                }
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Role Indicator */}
              <RoleIndicator isHost={isHost} user={user} />
              
              <div className="w-px h-8 bg-surface-200" />
              
              <button className="p-2.5 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-xl transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={cn(
                    'relative p-2.5 rounded-xl transition-colors',
                    showNotifications 
                      ? 'bg-surface-100 text-surface-700' 
                      : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
                  )}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
                <NotificationsPanel 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)}
                  role={currentRole}
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav role={role} />

      {/* Dev Switcher pour tester les rôles */}
      <DevSwitcher />

      {/* Toast enrichi pour les notifications importantes */}
      {activeToast && (
        <RichNotificationToast
          notification={activeToast}
          onDismiss={handleToastDismiss}
          onViewProfile={handleToastViewProfile}
          onAccept={handleToastAccept}
          onReject={handleToastReject}
          onNavigate={handleToastNavigate}
        />
      )}

      {/* Modal Profil Cleaner */}
      <CleanerProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false)
          setSelectedNotification(null)
        }}
        cleaner={selectedNotification?.cleaner}
        mission={selectedNotification?.mission}
        onAccept={handleModalAccept}
        onReject={handleModalReject}
      />
    </div>
  )
}

// Helper function for greeting
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export { AppShell }
export default AppShell
