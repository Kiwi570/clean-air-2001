import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Home, Calendar, Users, Euro, Plus, ArrowRight, Clock, 
  CheckCircle, Star, TrendingUp, AlertCircle, ChevronRight,
  MessageCircle, Eye, Sparkles, Play, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { CreateMissionModal } from '@/components/ui/CreateMissionModal'
import { RateMissionModal } from '@/components/ui/RateMissionModal'
import { ModeIndicator } from '@/components/ui/ModeBadge'
import { PersonaBridge, LoopCompleted } from '@/components/ui/PersonaBridge'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useAuth } from '@/hooks/useAuth'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useToast } from '@/hooks/useToast'
import { ONBOARDING_ACTIONS } from '@/lib/constants'
import { cn, formatDate, formatCurrency } from '@/lib/utils'

// ============================================
// HOST DASHBOARD ULTIMATE - Avec À faire maintenant
// ============================================

function StatCard({ icon: Icon, label, value, trend, color = 'teal', delay = 0, alert }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const colors = {
    teal: 'bg-teal-50 text-teal-600 ring-teal-500/20',
    sky: 'bg-sky-50 text-sky-600 ring-sky-500/20',
    green: 'bg-green-50 text-green-600 ring-green-500/20',
    amber: 'bg-amber-50 text-amber-600 ring-amber-500/20',
    red: 'bg-red-50 text-red-600 ring-red-500/20',
  }

  return (
    <div className={cn(
      'bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100/50 shadow-lg p-5 transition-all duration-500',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      alert && 'ring-2 ring-amber-300'
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center ring-4',
          colors[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {alert && (
        <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {alert}
        </p>
      )}
    </div>
  )
}

// Composant À faire maintenant - Version ULTRA DOMINANT V18
function TodoNow({ missions, onRate, onConfirm, navigate }) {
  const toRate = missions.filter(m => m.status === MISSION_STATUS.COMPLETED)
  const toConfirm = missions.filter(m => m.status === MISSION_STATUS.APPLIED)
  const inProgress = missions.filter(m => m.status === MISSION_STATUS.IN_PROGRESS)

  const hasActions = toRate.length > 0 || toConfirm.length > 0 || inProgress.length > 0
  const totalActions = toRate.length + toConfirm.length + inProgress.length

  // État "Tout va bien" - Rien à faire (plus compact, discret)
  if (!hasActions) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-7 h-7 text-green-500" />
          </div>
          <div>
            <h2 className="font-semibold text-green-900">
              Tout est pris en charge, on gère 👌
            </h2>
            <p className="text-green-700 text-sm mt-0.5">
              On vous prévient dès qu'il y a du nouveau
            </p>
          </div>
        </div>
      </div>
    )
  }

  // État DOMINANT - Il y a des actions à faire
  return (
    <div className="relative">
      {/* Glow effect derrière */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-xl opacity-30 animate-pulse" />
      
      <Card className="relative border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-2xl shadow-amber-300/50 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, orange 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative p-6">
          {/* Header IMPACTANT */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-amber-900">
                  Votre prochaine action
                </h2>
                <p className="text-amber-700 text-sm mt-0.5">
                  {totalActions === 1 ? 'Une action vous attend' : `${totalActions} actions vous attendent`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
              </span>
              <Badge variant="warning" size="lg" className="text-base px-4 py-1.5 font-bold">
                {totalActions} à faire
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {/* Missions à noter - PRIORITÉ ABSOLUE */}
            {toRate.map(mission => (
              <div 
                key={mission.id}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-amber-300 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
                onClick={() => onRate(mission)}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-lg">
                    Donnez votre avis
                  </p>
                  <p className="text-amber-700 text-sm truncate">
                    Ménage terminé par {mission.cleanerName} • {mission.propertyName}
                  </p>
                </div>
                <Button 
                  onClick={(e) => { e.stopPropagation(); onRate(mission) }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-300/50 flex-shrink-0 text-base px-6"
                  icon={Star}
                >
                  Noter
                </Button>
              </div>
            ))}

          {/* Candidatures à confirmer */}
          {toConfirm.map(mission => (
            <div 
              key={mission.id}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-teal-200 shadow-md"
            >
              <Avatar 
                src={mission.cleanerAvatar}
                name={mission.cleanerName}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {mission.cleanerName} souhaite intervenir
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {mission.propertyName} • {formatDate(mission.date)}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  variant="secondary"
                  onClick={() => navigate(`/host/bookings/${mission.id}`)}
                >
                  Voir
                </Button>
                <Button 
                  icon={CheckCircle}
                  onClick={() => onConfirm(mission)}
                >
                  Accepter
                </Button>
              </div>
            </div>
          ))}

          {/* Ménages en cours */}
          {inProgress.map(mission => (
            <div 
              key={mission.id}
              className="flex items-center gap-4 p-5 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border-2 border-sky-300 shadow-md"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Play className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  🔴 {mission.cleanerName} est sur place
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {mission.propertyName} • Ménage en cours
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-sky-600 mb-1">On vous prévient à la fin</p>
                <Button 
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/host/bookings/${mission.id}`)}
                >
                  Suivre
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
    </div>
  )
}

function HostDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [missionToRate, setMissionToRate] = useState(null)
  
  const navigate = useNavigate()
  const { user, getFirstName } = useAuth()
  const { 
    missions,
    getStats, 
    getTotalEarnings,
    getMissionsByStatus,
    confirmMission,
    rejectCleaner
  } = useMissions()
  const { markActionComplete } = useOnboarding()
  const { success, info } = useToast()

  // Missions de l'hôte
  const hostMissions = missions.filter(m => m.hostId === 'host-demo')
  const stats = getStats('host')
  const totalSpent = getTotalEarnings('host')
  
  // Prochaines missions (confirmées + en cours)
  const upcomingMissions = hostMissions
    .filter(m => m.status === MISSION_STATUS.CONFIRMED || m.status === MISSION_STATUS.IN_PROGRESS)
    .sort((a, b) => {
      // En cours en premier
      if (a.status === MISSION_STATUS.IN_PROGRESS && b.status !== MISSION_STATUS.IN_PROGRESS) return -1
      if (b.status === MISSION_STATUS.IN_PROGRESS && a.status !== MISSION_STATUS.IN_PROGRESS) return 1
      return new Date(a.date) - new Date(b.date)
    })
    .slice(0, 3)

  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleConfirmCleaner = (mission) => {
    confirmMission(mission.id)
    markActionComplete(ONBOARDING_ACTIONS.CONFIRMED_CLEANER)
    success(`${mission.cleanerName} confirmé ! 🎉`)
  }

  const handleMissionCreated = (mission) => {
    markActionComplete(ONBOARDING_ACTIONS.CREATED_MISSION)
    if (mission.cleanerId) {
      markActionComplete(ONBOARDING_ACTIONS.CONFIRMED_CLEANER)
    }
    setShowCreateModal(false)
  }

  if (isLoading) {
    return <Skeleton.Dashboard />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Bonjour {getFirstName()} 👋
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Gérez vos propriétés et vos ménages
            <ModeIndicator mode="instant" />
          </p>
        </div>
        <Button 
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Nouveau ménage
        </Button>
      </div>

      {/* À faire maintenant */}
      <TodoNow 
        missions={hostMissions}
        onRate={setMissionToRate}
        onConfirm={handleConfirmCleaner}
        navigate={navigate}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Home} 
          label="Biens actifs" 
          value="3"
          color="teal"
          delay={0}
        />
        <StatCard 
          icon={Calendar} 
          label="Ménages ce mois" 
          value={stats.confirmed + stats.inProgress + stats.completed}
          trend="+3 vs mois dernier"
          color="sky"
          delay={100}
        />
        <StatCard 
          icon={Users} 
          label="Candidatures" 
          value={stats.applied}
          color={stats.applied > 0 ? 'amber' : 'green'}
          delay={200}
          alert={stats.applied > 0 ? 'Action requise' : null}
        />
        <StatCard 
          icon={Euro} 
          label="Dépensé ce mois" 
          value={formatCurrency(totalSpent)}
          color="green"
          delay={300}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Bookings */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-500" />
                  Prochains ménages
                </h2>
                <Link 
                  to="/host/bookings"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  Tout voir
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {upcomingMissions.length === 0 ? (
                <EmptyState.Calendar onAction={() => setShowCreateModal(true)} />
              ) : (
                <div className="space-y-3">
                  {upcomingMissions.map((mission) => (
                    <div 
                      key={mission.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer",
                        mission.status === MISSION_STATUS.IN_PROGRESS 
                          ? "bg-sky-50 border-2 border-sky-200" 
                          : "bg-slate-50"
                      )}
                      onClick={() => navigate(`/host/bookings/${mission.id}`)}
                    >
                      <img 
                        src={mission.propertyImage}
                        alt={mission.propertyName}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{mission.propertyName}</h4>
                        <p className="text-sm text-slate-500">
                          {formatDate(mission.date)} à {mission.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar 
                          src={mission.cleanerAvatar}
                          name={mission.cleanerName}
                          size="sm"
                        />
                        {mission.status === MISSION_STATUS.IN_PROGRESS ? (
                          <Badge variant="info" size="sm" className="animate-pulse">
                            🔴 En cours
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">Confirmée</Badge>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Properties Summary */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-teal-500" />
                  Mes biens
                </h3>
                <Link 
                  to="/host/properties"
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  Gérer
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Studio Marais', type: 'Studio', menages: 5 },
                  { name: 'Appartement Bastille', type: 'T2', menages: 3 },
                  { name: 'Loft Oberkampf', type: 'Loft', menages: 2 },
                ].map((property, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{property.name}</p>
                      <p className="text-xs text-slate-500">{property.type}</p>
                    </div>
                    <Badge variant="secondary" size="sm">
                      {property.menages} ménages
                    </Badge>
                  </div>
                ))}
              </div>

              <Button 
                variant="secondary"
                size="sm"
                fullWidth
                className="mt-4"
                icon={Plus}
                onClick={() => navigate('/host/properties/add')}
              >
                Ajouter un bien
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-900">Nouveau ménage</p>
                    <p className="text-xs text-slate-500">Planifier un ménage</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>

                <Link 
                  to="/host/cleaners"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Mes cleaners</p>
                    <p className="text-xs text-slate-500">Gérer mes favoris</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </Link>

                <Link 
                  to="/host/messages"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Messages</p>
                    <p className="text-xs text-slate-500">Communiquer</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-teal-500 to-sky-500 text-white border-0">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Conseil du jour</h4>
                  <p className="text-sm text-white/80">
                    Répondez rapidement aux candidatures pour garder les meilleurs cleaners !
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Create Mission Modal */}
      <CreateMissionModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleMissionCreated}
      />

      {/* Rate Mission Modal */}
      <RateMissionModal
        isOpen={!!missionToRate}
        onClose={() => setMissionToRate(null)}
        mission={missionToRate}
      />
    </div>
  )
}

export default HostDashboard
