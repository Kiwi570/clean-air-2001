import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, MapPin, Calendar, Wallet, User, Settings,
  Home, Users, CreditCard, LogOut, MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { Avatar } from '@/components/ui/Avatar'
import { ROLES } from '@/lib/constants'

const iconMap = {
  LayoutDashboard,
  MapPin,
  Calendar,
  Wallet,
  User,
  Settings,
  Home,
  Users,
  CreditCard,
  MessageCircle,
}

function Sidebar({ role }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const { getUnreadCount } = useMessages()

  const unreadCount = getUnreadCount(role === ROLES.HOST ? 'host' : 'cleaner')

  const cleanerNav = [
    { path: '/cleaner', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/cleaner/missions', label: 'Missions', icon: 'MapPin' },
    { path: '/cleaner/messages', label: 'Messages', icon: 'MessageCircle', badge: unreadCount },
    { path: '/cleaner/planning', label: 'Planning', icon: 'Calendar' },
    { path: '/cleaner/earnings', label: 'Revenus', icon: 'Wallet' },
    { path: '/cleaner/profile', label: 'Profil', icon: 'User' },
    { path: '/cleaner/settings', label: 'Paramètres', icon: 'Settings' },
  ]

  const hostNav = [
    { path: '/host', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/host/properties', label: 'Mes biens', icon: 'Home' },
    { path: '/host/bookings', label: 'Réservations', icon: 'Calendar' },
    { path: '/host/messages', label: 'Messages', icon: 'MessageCircle', badge: unreadCount },
    { path: '/host/cleaners', label: 'Cleaners', icon: 'Users' },
    { path: '/host/billing', label: 'Facturation', icon: 'CreditCard' },
    { path: '/host/settings', label: 'Paramètres', icon: 'Settings' },
  ]

  const navItems = role === ROLES.HOST ? hostNav : cleanerNav

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-surface-100">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            role === ROLES.HOST 
              ? 'bg-gradient-to-br from-accent-500 to-accent-600' 
              : 'bg-gradient-to-br from-brand-500 to-brand-600'
          )}>
            <span className="text-white font-bold text-lg font-display">C</span>
          </div>
          <span className="font-display font-bold text-xl text-surface-900">
            Clean<span className={role === ROLES.HOST ? 'text-accent-500' : 'text-brand-500'}>Air</span>
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                isActive
                  ? role === ROLES.HOST 
                    ? 'bg-accent-50 text-accent-700'
                    : 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className={cn(
                  'px-2 py-0.5 text-xs font-bold rounded-full animate-pulse',
                  role === ROLES.HOST 
                    ? 'bg-accent-500 text-white'
                    : 'bg-brand-500 text-white'
                )}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-surface-100">
        <div className="flex items-center gap-3 mb-4">
          <Avatar 
            src={user?.avatar}
            name={user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-surface-900 truncate">
              {user?.firstName || 'Nouveau membre'}
            </p>
            <p className="text-sm text-surface-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}

export { Sidebar }
export default Sidebar
