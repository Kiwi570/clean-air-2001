import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Calendar, Clock, MapPin, Euro, Plus, Star, MessageCircle,
  CheckCircle, XCircle, Play, AlertCircle, ChevronRight, Eye
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { CreateMissionModal } from '@/components/ui/CreateMissionModal'
import { RateMissionModal } from '@/components/ui/RateMissionModal'
import { TimelineMini } from '@/components/ui/Timeline'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { HOST_STATUS_LABELS } from '@/lib/constants'
import { formatCurrency, cn } from '@/lib/utils'

// ============================================
// BOOKINGS PAGE - Liste des réservations Hôte
// ============================================

function Bookings() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [missionToRate, setMissionToRate] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const navigate = useNavigate()
  const { 
    missions, 
    confirmMission, 
    rejectCleaner,
    getStats 
  } = useMissions()
  const { notifyMissionConfirmed, notifyMissionRejected } = useNotifications()
  const { success: showSuccess, error: showError } = useToast()

  // Filtrer les missions de l'hôte
  const hostMissions = missions.filter(m => m.hostId === 'host-demo')
  const stats = getStats('host')

  // Grouper par statut
  const pending = hostMissions.filter(m => m.status === MISSION_STATUS.PENDING)
  const applied = hostMissions.filter(m => m.status === MISSION_STATUS.APPLIED)
  const confirmed = hostMissions.filter(m => m.status === MISSION_STATUS.CONFIRMED)
  const inProgress = hostMissions.filter(m => m.status === MISSION_STATUS.IN_PROGRESS)
  const completed = hostMissions.filter(m => m.status === MISSION_STATUS.COMPLETED)
  const rated = hostMissions.filter(m => m.status === MISSION_STATUS.RATED)

  const tabs = [
    { id: 'all', label: 'Toutes', count: hostMissions.length },
    { id: 'upcoming', label: 'À venir', count: confirmed.length + inProgress.length },
    { id: 'applied', label: 'Candidatures', count: applied.length, highlight: applied.length > 0 },
    { id: 'toRate', label: 'À noter', count: completed.length, highlight: completed.length > 0 },
    { id: 'done', label: 'Historique', count: rated.length },
  ]

  const getFilteredMissions = () => {
    switch (activeTab) {
      case 'upcoming': return [...confirmed, ...inProgress].sort((a, b) => new Date(a.date) - new Date(b.date))
      case 'applied': return applied
      case 'toRate': return completed
      case 'done': return rated
      default: return hostMissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  const handleConfirm = (e, mission) => {
    e.stopPropagation()
    confirmMission(mission.id)
    notifyMissionConfirmed(mission)
    showSuccess(`${mission.cleanerName} a été confirmé ! ✅`)
  }

  const handleReject = (e, mission) => {
    e.stopPropagation()
    rejectCleaner(mission.id)
    notifyMissionRejected(mission)
    showError(`Candidature de ${mission.cleanerName} refusée`)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
    if (date.toDateString() === tomorrow.toDateString()) return 'Demain'
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const getStatusBadge = (status) => {
    const config = {
      [MISSION_STATUS.PENDING]: { variant: 'secondary', icon: Clock },
      [MISSION_STATUS.APPLIED]: { variant: 'warning', icon: AlertCircle },
      [MISSION_STATUS.CONFIRMED]: { variant: 'success', icon: CheckCircle },
      [MISSION_STATUS.IN_PROGRESS]: { variant: 'info', icon: Play },
      [MISSION_STATUS.COMPLETED]: { variant: 'success', icon: Star },
      [MISSION_STATUS.RATED]: { variant: 'success', icon: CheckCircle },
    }
    const { variant, icon: Icon } = config[status] || config[MISSION_STATUS.PENDING]
    
    return (
      <Badge variant={variant} size="sm" className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {HOST_STATUS_LABELS[status]}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Réservations
          </h1>
          <p className="text-slate-500 mt-1">
            Gérez vos demandes de ménage
          </p>
        </div>

        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
          Nouveau ménage
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
          <p className="text-sm text-slate-500">En attente</p>
        </Card>
        <Card className={cn("p-4 text-center", stats.applied > 0 && "ring-2 ring-amber-400 bg-amber-50")}>
          <p className="text-3xl font-bold text-amber-600">{stats.applied}</p>
          <p className="text-sm text-slate-500">Candidatures</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-teal-600">{stats.confirmed + stats.inProgress}</p>
          <p className="text-sm text-slate-500">À venir</p>
        </Card>
        <Card className={cn("p-4 text-center", completed.length > 0 && "ring-2 ring-green-400 bg-green-50")}>
          <p className="text-3xl font-bold text-green-600">{completed.length}</p>
          <p className="text-sm text-slate-500">À noter</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                : tab.highlight
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-xs font-bold',
                activeTab === tab.id
                  ? 'bg-white/20'
                  : tab.highlight
                    ? 'bg-amber-200'
                    : 'bg-slate-200'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Missions List */}
      {getFilteredMissions().length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Aucune réservation</h3>
          <p className="text-slate-500 mb-4">
            {activeTab === 'all' 
              ? "Créez votre première demande de ménage pour commencer."
              : "Aucune réservation dans cette catégorie."}
          </p>
          {activeTab === 'all' && (
            <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
              Planifier un ménage
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {getFilteredMissions().map((mission) => (
            <Card 
              key={mission.id} 
              className="p-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/host/bookings/${mission.id}`)}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-48 h-40 md:h-auto relative">
                  <img
                    src={mission.propertyImage}
                    alt={mission.propertyName}
                    className="w-full h-full object-cover"
                  />
                  {mission.bookingMode === 'instant' && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="info" size="sm" className="bg-sky-500 text-white border-0">
                        ⚡ Instantané
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-slate-900">
                          {mission.propertyName}
                        </h3>
                        {getStatusBadge(mission.status)}
                      </div>
                      <p className="text-slate-500 text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {mission.propertyAddress}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-teal-600">
                      {formatCurrency(mission.price)}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(mission.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {mission.time} • {mission.duration}
                    </span>
                  </div>

                  {/* Cleaner Info (if assigned) */}
                  {mission.cleanerId && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
                      <Avatar
                        src={mission.cleanerAvatar}
                        name={mission.cleanerName}
                        size="sm"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{mission.cleanerName}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          4.9 • 47 missions
                        </p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        icon={MessageCircle}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate('/host/messages')
                        }}
                      >
                        Message
                      </Button>
                    </div>
                  )}

                  {/* Actions based on status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {mission.status === MISSION_STATUS.APPLIED && (
                        <>
                          <Button 
                            size="sm" 
                            icon={CheckCircle}
                            onClick={(e) => handleConfirm(e, mission)}
                          >
                            Confirmer
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            icon={XCircle}
                            onClick={(e) => handleReject(e, mission)}
                          >
                            Refuser
                          </Button>
                        </>
                      )}

                      {mission.status === MISSION_STATUS.COMPLETED && (
                        <Button 
                          size="sm" 
                          icon={Star}
                          onClick={(e) => {
                            e.stopPropagation()
                            setMissionToRate(mission)
                          }}
                          className="bg-gradient-to-r from-amber-500 to-orange-500"
                        >
                          Noter le ménage
                        </Button>
                      )}

                      {mission.status === MISSION_STATUS.RATED && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <div className="flex items-center gap-0.5">
                            {[...Array(mission.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-slate-400">•</span>
                          <span className="truncate max-w-[200px]">{mission.review}</span>
                        </div>
                      )}

                      {mission.status === MISSION_STATUS.PENDING && (
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          En attente de candidatures...
                        </p>
                      )}

                      {mission.status === MISSION_STATUS.CONFIRMED && (
                        <p className="text-sm text-teal-600 font-medium flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Confirmée, en attente du jour J
                        </p>
                      )}

                      {mission.status === MISSION_STATUS.IN_PROGRESS && (
                        <p className="text-sm text-sky-600 font-medium flex items-center gap-1 animate-pulse">
                          <Play className="w-4 h-4" />
                          Ménage en cours...
                        </p>
                      )}
                    </div>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      icon={Eye}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/host/bookings/${mission.id}`)
                      }}
                    >
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Mission Modal */}
      <CreateMissionModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
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

export default Bookings
