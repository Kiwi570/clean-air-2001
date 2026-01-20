import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Calendar, Euro, Star, TrendingUp, Clock, CheckCircle, 
  Sparkles, ArrowRight, ChevronRight, MapPin, Play, 
  AlertCircle, Bell, Send, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ModeIndicator } from '@/components/ui/ModeBadge'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useAuth } from '@/hooks/useAuth'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useToast } from '@/hooks/useToast'
import { ONBOARDING_ACTIONS, CLEANER_STATUS_LABELS } from '@/lib/constants'
import { cn, formatDate, formatCurrency } from '@/lib/utils'

// ============================================
// CLEANER DASHBOARD ULTIMATE - Avec À faire maintenant
// ============================================

function StatCard({ icon: Icon, label, value, trend, color = 'sky', delay = 0, highlight }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const colors = {
    sky: 'bg-sky-50 text-sky-600 ring-sky-500/20',
    green: 'bg-green-50 text-green-600 ring-green-500/20',
    amber: 'bg-amber-50 text-amber-600 ring-amber-500/20',
    teal: 'bg-teal-50 text-teal-600 ring-teal-500/20',
  }

  return (
    <div className={cn(
      'bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100/50 shadow-lg p-5 transition-all duration-500',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      highlight && 'ring-2 ring-sky-400'
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
    </div>
  )
}

// Composant À faire maintenant pour Cleaner - Version DOMINANT
function TodoNow({ missions, cleanerId, onStart, onComplete, navigate }) {
  // Filtrer les missions pour ce cleaner
  const myMissions = missions.filter(m => m.cleanerId === cleanerId)
  
  const inProgress = myMissions.filter(m => m.status === MISSION_STATUS.IN_PROGRESS)
  const confirmed = myMissions.filter(m => m.status === MISSION_STATUS.CONFIRMED)
  const completed = myMissions.filter(m => m.status === MISSION_STATUS.COMPLETED)
  const rated = myMissions.filter(m => m.status === MISSION_STATUS.RATED).slice(0, 1) // Dernier avis

  const hasActions = inProgress.length > 0 || confirmed.length > 0
  const hasNews = completed.length > 0 || rated.length > 0

  // État "Aucune mission" - Rien à faire (message rassurant)
  if (!hasActions && !hasNews) {
    return (
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Calendar className="w-7 h-7 text-sky-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sky-900">
              Rien à faire pour l'instant ☀️
            </h2>
            <p className="text-sky-700 text-sm mt-0.5">
              On vous prévient dès qu'une mission arrive
            </p>
          </div>
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => navigate('/cleaner/missions')}
            icon={Sparkles}
          >
            Voir les missions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Glow effect quand il y a des actions */}
      {hasActions && (
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-3xl blur-xl opacity-30 animate-pulse" />
      )}
      
      <Card className={cn(
        "relative shadow-xl overflow-hidden",
        hasActions 
          ? "border-2 border-sky-400 bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 shadow-sky-200/50"
          : "border border-green-200 bg-gradient-to-br from-green-50 to-teal-50"
      )}>
        <div className="p-6">
          {/* Header IMPACTANT */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                hasActions 
                  ? "bg-gradient-to-br from-sky-500 to-indigo-600 shadow-sky-500/50 animate-pulse" 
                  : "bg-gradient-to-br from-green-500 to-teal-500 shadow-green-500/50"
              )}>
                {hasActions ? (
                  <Bell className="w-7 h-7 text-white" />
                ) : (
                  <CheckCircle className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h2 className={cn(
                  "font-bold text-2xl",
                  hasActions ? "text-sky-900" : "text-green-900"
                )}>
                  {hasActions ? "C'est à vous !" : "Bravo, bien joué ! 🎉"}
                </h2>
                <p className={cn(
                  "text-sm mt-0.5",
                  hasActions ? "text-sky-700" : "text-green-700"
                )}>
                  {hasActions 
                    ? `${inProgress.length + confirmed.length} mission${inProgress.length + confirmed.length > 1 ? 's' : ''} à gérer`
                    : "Vos dernières missions sont complétées"
                  }
                </p>
              </div>
            </div>
            {hasActions && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-600"></span>
                </span>
                <Badge variant="info" size="lg" className="text-base px-4 py-1.5 font-bold">
                  {inProgress.length + confirmed.length} à faire
                </Badge>
              </div>
            )}
          </div>

        <div className="space-y-4">
          {/* Mission en cours - PRIORITÉ MAX */}
          {inProgress.map(mission => (
            <div 
              key={mission.id}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-sky-400 shadow-lg"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Play className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-lg truncate">
                  🔴 Vous êtes en intervention
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {mission.propertyName} • Depuis {Math.floor((Date.now() - mission.startedAt) / 60000)} min
                </p>
              </div>
              <Button 
                onClick={() => navigate(`/cleaner/missions/${mission.id}`)}
                className="bg-gradient-to-r from-green-500 to-teal-500 shadow-lg shadow-green-300/50 flex-shrink-0"
                icon={CheckCircle}
              >
                Terminer
              </Button>
            </div>
          ))}

          {/* Prochaine mission confirmée */}
          {inProgress.length === 0 && confirmed.slice(0, 1).map(mission => (
            <div 
              key={mission.id}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-teal-300 shadow-lg"
            >
              <img 
                src={mission.propertyImage}
                alt={mission.propertyName}
                className="w-14 h-14 rounded-2xl object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  Votre prochaine mission
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {mission.propertyName} • {formatDate(mission.date)} à {mission.time}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  variant="secondary"
                  onClick={() => navigate(`/cleaner/missions/${mission.id}`)}
                >
                  Détails
                </Button>
                <Button 
                  icon={Play}
                  onClick={() => onStart(mission)}
                  className="bg-gradient-to-r from-teal-500 to-green-500"
                >
                  Démarrer
                </Button>
              </div>
            </div>
          ))}

          {/* Missions terminées en attente d'avis */}
          {completed.map(mission => (
            <div 
              key={mission.id}
              className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border-2 border-green-200 shadow-md"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-green-900 truncate">
                  Bien joué ! Mission accomplie 🎉
                </p>
                <p className="text-sm text-green-700 truncate">
                  {mission.propertyName} • Vous avez gagné <span className="font-semibold">{formatCurrency(mission.price)}</span>
                </p>
              </div>
              <Badge variant="success" size="lg">
                Avis en attente
              </Badge>
            </div>
          ))}

          {/* Dernier avis reçu - TROPHÉE */}
          {rated.map(mission => (
            <div 
              key={mission.id}
              className="flex items-center gap-4 p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border-2 border-amber-300 shadow-lg"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-amber-900 truncate flex items-center gap-2">
                  L'hôte vous a noté !
                  <span className="text-amber-500">{'⭐'.repeat(mission.rating)}</span>
                </p>
                <p className="text-sm text-amber-700 truncate italic">
                  "{mission.review}"
                </p>
              </div>
              <Button 
                variant="secondary"
                onClick={() => navigate(`/cleaner/missions/${mission.id}`)}
              >
                Voir
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
    </div>
  )
}

function CleanerDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  
  const navigate = useNavigate()
  const { user, getFirstName, getCurrentCleanerId } = useAuth()
  const { 
    missions,
    getStats, 
    getTotalEarnings,
    getAvailableMissions,
    getConfirmedMissions,
    startMission,
    completeMission,
    isMissionNew
  } = useMissions()
  const { markActionComplete } = useOnboarding()
  const { success, info } = useToast()

  const cleanerId = getCurrentCleanerId()
  const stats = getStats('cleaner', cleanerId)
  const totalEarnings = getTotalEarnings('cleaner', cleanerId)
  const availableMissions = getAvailableMissions()
  const myConfirmedMissions = getConfirmedMissions(cleanerId)

  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleStartMission = (mission) => {
    startMission(mission.id)
    markActionComplete(ONBOARDING_ACTIONS.STARTED_MISSION)
    success('Mission démarrée ! Bon courage 💪')
  }

  const handleCompleteMission = (mission) => {
    completeMission(mission.id)
    markActionComplete(ONBOARDING_ACTIONS.COMPLETED_MISSION)
    success(`Mission terminée ! +${formatCurrency(mission.price)} 🎉`)
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
            Trouvez des missions près de chez vous
            <ModeIndicator mode="instant" />
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.badge && (
            <Badge 
              variant={user.badgeColor === 'amber' ? 'warning' : user.badgeColor === 'teal' ? 'success' : 'info'}
              size="lg"
            >
              {user.badgeLabel}
            </Badge>
          )}
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-5 h-5 fill-amber-400" />
            <span className="font-semibold">{user?.rating || 4.7}</span>
          </div>
        </div>
      </div>

      {/* À faire maintenant */}
      <TodoNow 
        missions={missions}
        cleanerId={cleanerId}
        onStart={handleStartMission}
        onComplete={handleCompleteMission}
        navigate={navigate}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Sparkles} 
          label="Disponibles" 
          value={availableMissions.length}
          color="sky"
          delay={0}
          highlight={availableMissions.length > 0}
        />
        <StatCard 
          icon={Send} 
          label="Candidatures" 
          value={stats.applied}
          color="amber"
          delay={100}
        />
        <StatCard 
          icon={CheckCircle} 
          label="Confirmées" 
          value={myConfirmedMissions.length}
          color="teal"
          delay={200}
        />
        <StatCard 
          icon={Euro} 
          label="Gains ce mois" 
          value={formatCurrency(totalEarnings)}
          trend="+18% vs mois dernier"
          color="green"
          delay={300}
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Missions */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-500" />
                  Missions disponibles
                </h2>
                <Link 
                  to="/cleaner/missions"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  Tout voir
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {availableMissions.length === 0 ? (
                <EmptyState.Missions />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {availableMissions.slice(0, 4).map((mission) => (
                    <div 
                      key={mission.id}
                      className="group relative bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => navigate(`/cleaner/missions/${mission.id}`)}
                    >
                      <div className="relative h-32">
                        <img 
                          src={mission.propertyImage}
                          alt={mission.propertyName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-2 right-2">
                          <Badge variant="success" className="bg-green-500 text-white border-0">
                            {formatCurrency(mission.price)}
                          </Badge>
                        </div>
                        {isMissionNew(mission.id) && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="info" size="sm" className="bg-sky-500 text-white border-0">
                              ✨ Nouveau
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2">
                          <h4 className="font-medium text-white truncate">{mission.propertyName}</h4>
                          <p className="text-xs text-white/80 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {mission.propertyAddress.split(',')[0]}
                          </p>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(mission.date)}
                          </span>
                          <span className="text-slate-600 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {mission.time} • {mission.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* My Confirmed Missions */}
          {myConfirmedMissions.length > 0 && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    Mes missions confirmées
                  </h2>
                  <Link 
                    to="/cleaner/planning"
                    className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    Planning
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {myConfirmedMissions.map((mission) => (
                    <div 
                      key={mission.id}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/cleaner/missions/${mission.id}`)}
                    >
                      <img 
                        src={mission.propertyImage}
                        alt={mission.propertyName}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">{mission.propertyName}</h4>
                        <p className="text-sm text-slate-500">
                          {formatDate(mission.date)} à {mission.time}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-teal-600">{formatCurrency(mission.price)}</p>
                        <Badge 
                          variant={mission.status === MISSION_STATUS.IN_PROGRESS ? 'info' : 'success'} 
                          size="sm"
                        >
                          {CLEANER_STATUS_LABELS[mission.status]}
                        </Badge>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Performance Card */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Ma performance
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Note moyenne</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold">{user?.rating || 4.7}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Missions complétées</span>
                  <span className="font-semibold">{user?.completedMissions || stats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Taux de complétion</span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <p className="text-sm text-amber-800">
                  🏆 Continuez comme ça pour devenir Top Cleaner !
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions rapides</h3>
              
              <div className="space-y-2">
                <Link 
                  to="/cleaner/missions"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Trouver des missions</p>
                    <p className="text-xs text-slate-500">{availableMissions.length} disponibles</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </Link>

                <Link 
                  to="/cleaner/planning"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Mon planning</p>
                    <p className="text-xs text-slate-500">{myConfirmedMissions.length} missions à venir</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </Link>

                <Link 
                  to="/cleaner/earnings"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <Euro className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Mes revenus</p>
                    <p className="text-xs text-slate-500">{formatCurrency(totalEarnings)} ce mois</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white border-0">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Conseil</h4>
                  <p className="text-sm text-white/80">
                    Postulez rapidement aux nouvelles missions pour augmenter vos chances d'être sélectionné !
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CleanerDashboard
