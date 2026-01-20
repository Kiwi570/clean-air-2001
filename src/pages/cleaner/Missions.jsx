import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, Clock, MapPin, Euro, Star, Search, Filter,
  Sparkles, ChevronRight, Send, CheckCircle, Play, AlertCircle
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ModeBadge } from '@/components/ui/ModeBadge'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useAuth } from '@/hooks/useAuth'
import { CLEANER_STATUS_LABELS } from '@/lib/constants'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

// ============================================
// MISSIONS PAGE - Liste des missions Cleaner
// ============================================

function Missions() {
  const [activeTab, setActiveTab] = useState('confirmed')
  const [searchQuery, setSearchQuery] = useState('')

  const navigate = useNavigate()
  const { user, getCurrentCleanerId } = useAuth()
  const { 
    missions,
    getAvailableMissions,
    getMyApplications,
    getConfirmedMissions,
    getMissionsForCleaner,
    isMissionNew
  } = useMissions()

  const cleanerId = getCurrentCleanerId()

  // Filtrer les missions
  const availableMissions = getAvailableMissions()
  const myApplications = getMyApplications(cleanerId)
  const myConfirmed = getConfirmedMissions(cleanerId)
  const myInProgress = missions.filter(m => m.cleanerId === cleanerId && m.status === MISSION_STATUS.IN_PROGRESS)
  const myCompleted = missions.filter(m => m.cleanerId === cleanerId && m.status === MISSION_STATUS.COMPLETED)
  const myHistory = missions.filter(m => m.cleanerId === cleanerId && m.status === MISSION_STATUS.RATED)

  const tabs = [
    { id: 'confirmed', label: 'Confirmées', count: myConfirmed.length + myInProgress.length, highlight: myConfirmed.length + myInProgress.length > 0 },
    { id: 'available', label: 'Disponibles', count: availableMissions.length, mode: 'candidature' },
    { id: 'applications', label: 'Candidatures', count: myApplications.length, mode: 'candidature' },
    { id: 'history', label: 'Historique', count: myCompleted.length + myHistory.length },
  ]

  const getFilteredMissions = () => {
    let filtered = []
    
    switch (activeTab) {
      case 'available':
        filtered = availableMissions
        break
      case 'applications':
        filtered = myApplications
        break
      case 'confirmed':
        filtered = [...myConfirmed, ...myInProgress]
        break
      case 'history':
        filtered = [...myCompleted, ...myHistory]
        break
      default:
        filtered = availableMissions
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(m => 
        m.propertyName.toLowerCase().includes(query) ||
        m.propertyAddress.toLowerCase().includes(query)
      )
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const getStatusConfig = (status) => {
    const configs = {
      [MISSION_STATUS.PENDING]: { variant: 'info', icon: Sparkles },
      [MISSION_STATUS.APPLIED]: { variant: 'warning', icon: Send },
      [MISSION_STATUS.CONFIRMED]: { variant: 'success', icon: CheckCircle },
      [MISSION_STATUS.IN_PROGRESS]: { variant: 'info', icon: Play },
      [MISSION_STATUS.COMPLETED]: { variant: 'success', icon: CheckCircle },
      [MISSION_STATUS.RATED]: { variant: 'success', icon: Star },
    }
    return configs[status] || configs[MISSION_STATUS.PENDING]
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Missions
          </h1>
          <p className="text-slate-500 mt-1">
            Trouvez des missions près de chez vous
          </p>
        </div>

        {/* User badge */}
        {user?.badge && (
          <Badge 
            variant={user.badgeColor === 'amber' ? 'warning' : user.badgeColor === 'teal' ? 'success' : 'info'}
            size="lg"
          >
            {user.badgeLabel}
          </Badge>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher une mission..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 transition-colors"
        />
      </div>

      {/* Mode Banner - P0: Visible */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <div className="flex items-center gap-3">
          <ModeBadge mode="instant" size="sm" />
          <span className="text-sm text-amber-700">Les missions confirmées par l'hôte apparaissent directement ici</span>
        </div>
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
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : tab.highlight
                  ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                  : tab.mode === 'candidature'
                    ? 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-500'
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
                    ? 'bg-sky-200'
                    : 'bg-slate-200'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      {getFilteredMissions().length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'available' ? (
              <Sparkles className="w-8 h-8 text-slate-400" />
            ) : (
              <Calendar className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            {activeTab === 'available' && "Aucune mission disponible"}
            {activeTab === 'applications' && "Aucune candidature en cours"}
            {activeTab === 'confirmed' && "Aucune mission confirmée"}
            {activeTab === 'history' && "Aucune mission terminée"}
          </h3>
          <p className="text-slate-500">
            {activeTab === 'available' && "De nouvelles missions seront bientôt disponibles."}
            {activeTab === 'applications' && "Postulez aux missions disponibles !"}
            {activeTab === 'confirmed' && "Vos missions confirmées apparaîtront ici."}
            {activeTab === 'history' && "Votre historique de missions apparaîtra ici."}
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredMissions().map((mission) => {
            const statusConfig = getStatusConfig(mission.status)
            const StatusIcon = statusConfig.icon
            const isNew = isMissionNew(mission.id)

            return (
              <Card 
                key={mission.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => navigate(`/cleaner/missions/${mission.id}`)}
              >
                {/* Image */}
                <div className="relative h-40">
                  <img
                    src={mission.propertyImage}
                    alt={mission.propertyName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="success" className="bg-green-500 text-white border-0 text-lg font-bold">
                      {formatCurrency(mission.price)}
                    </Badge>
                  </div>

                  {/* New Badge */}
                  {isNew && activeTab === 'available' && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="info" size="sm" className="bg-sky-500 text-white border-0">
                        ✨ Nouveau
                      </Badge>
                    </div>
                  )}

                  {/* Property Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-white truncate">{mission.propertyName}</h3>
                    <p className="text-sm text-white/80 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {mission.propertyAddress.split(',')[0]}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(mission.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {mission.time}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{mission.duration}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <Badge variant={statusConfig.variant} size="sm" className="flex items-center gap-1">
                      <StatusIcon className="w-3 h-3" />
                      {CLEANER_STATUS_LABELS[mission.status]}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-sky-500 transition-colors" />
                  </div>

                  {/* Rating if rated */}
                  {mission.status === MISSION_STATUS.RATED && mission.rating && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={cn(
                            'w-4 h-4',
                            i < mission.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          )}
                        />
                      ))}
                      {mission.review && (
                        <span className="text-sm text-slate-500 ml-2 truncate">
                          "{mission.review}"
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Missions
