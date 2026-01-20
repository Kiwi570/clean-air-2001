import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, MapPin, Calendar, Wallet, User, Home, Users, CreditCard,
  MessageCircle, MoreHorizontal, Settings, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMessages } from '@/hooks/useMessages'
import { ROLES } from '@/lib/constants'

const iconMap = {
  LayoutDashboard,
  MapPin,
  Calendar,
  Wallet,
  User,
  Home,
  Users,
  CreditCard,
  MessageCircle,
  MoreHorizontal,
  Settings,
}

function MobileNav({ role }) {
  const location = useLocation()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const { getUnreadCount } = useMessages()

  const unreadCount = getUnreadCount(role === ROLES.HOST ? 'host' : 'cleaner')

  // Navigation principale (4 items + More)
  const cleanerMainNav = [
    { path: '/cleaner', label: 'Accueil', icon: 'LayoutDashboard' },
    { path: '/cleaner/missions', label: 'Missions', icon: 'MapPin' },
    { path: '/cleaner/messages', label: 'Messages', icon: 'MessageCircle', badge: unreadCount },
    { path: '/cleaner/earnings', label: 'Revenus', icon: 'Wallet' },
  ]

  const hostMainNav = [
    { path: '/host', label: 'Accueil', icon: 'LayoutDashboard' },
    { path: '/host/properties', label: 'Biens', icon: 'Home' },
    { path: '/host/messages', label: 'Messages', icon: 'MessageCircle', badge: unreadCount },
    { path: '/host/bookings', label: 'Réserv.', icon: 'Calendar' },
  ]

  // Menu "Plus" items
  const cleanerMoreNav = [
    { path: '/cleaner/planning', label: 'Planning', icon: 'Calendar' },
    { path: '/cleaner/profile', label: 'Mon Profil', icon: 'User' },
    { path: '/cleaner/settings', label: 'Paramètres', icon: 'Settings' },
  ]

  const hostMoreNav = [
    { path: '/host/cleaners', label: 'Cleaners', icon: 'Users' },
    { path: '/host/billing', label: 'Facturation', icon: 'CreditCard' },
    { path: '/host/settings', label: 'Paramètres', icon: 'Settings' },
  ]

  const mainNav = role === ROLES.HOST ? hostMainNav : cleanerMainNav
  const moreNav = role === ROLES.HOST ? hostMoreNav : cleanerMoreNav

  // Vérifier si une page du menu "Plus" est active
  const isMoreActive = moreNav.some(item => location.pathname === item.path)

  return (
    <>
      {/* Overlay pour fermer le menu */}
      {showMoreMenu && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* Menu "Plus" popup */}
      {showMoreMenu && (
        <div className="lg:hidden fixed bottom-20 right-4 z-50 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-surface-200 p-2 min-w-[200px]">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 mb-1">
              <span className="font-semibold text-surface-900">Plus</span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-surface-400" />
              </button>
            </div>

            {/* Menu items */}
            <div className="space-y-1">
              {moreNav.map((item) => {
                const Icon = iconMap[item.icon]
                const isActive = location.pathname === item.path

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMoreMenu(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all',
                      isActive
                        ? role === ROLES.HOST 
                          ? 'bg-accent-50 text-accent-700'
                          : 'bg-brand-50 text-brand-700'
                        : 'text-surface-600 hover:bg-surface-50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Barre de navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-40 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {mainNav.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = location.pathname === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[60px] transition-all duration-200',
                  isActive
                    ? role === ROLES.HOST 
                      ? 'text-accent-600'
                      : 'text-brand-600'
                    : 'text-surface-400'
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    'w-6 h-6 mb-1 transition-transform duration-200',
                    isActive && 'scale-110'
                  )} />
                  {item.badge > 0 && (
                    <span className={cn(
                      'absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center',
                      role === ROLES.HOST 
                        ? 'bg-accent-500 text-white'
                        : 'bg-brand-500 text-white'
                    )}>
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <span className={cn(
                    'absolute bottom-1 w-1 h-1 rounded-full',
                    role === ROLES.HOST ? 'bg-accent-500' : 'bg-brand-500'
                  )} />
                )}
              </NavLink>
            )
          })}

          {/* Bouton "Plus" */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={cn(
              'relative flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[60px] transition-all duration-200',
              showMoreMenu || isMoreActive
                ? role === ROLES.HOST 
                  ? 'text-accent-600'
                  : 'text-brand-600'
                : 'text-surface-400'
            )}
          >
            <MoreHorizontal className={cn(
              'w-6 h-6 mb-1 transition-transform duration-200',
              (showMoreMenu || isMoreActive) && 'scale-110'
            )} />
            <span className={cn(
              'text-xs font-medium',
              (showMoreMenu || isMoreActive) ? 'opacity-100' : 'opacity-70'
            )}>
              Plus
            </span>
            {(showMoreMenu || isMoreActive) && (
              <span className={cn(
                'absolute bottom-1 w-1 h-1 rounded-full',
                role === ROLES.HOST ? 'bg-accent-500' : 'bg-brand-500'
              )} />
            )}
          </button>
        </div>
      </nav>
    </>
  )
}

export { MobileNav }
export default MobileNav
