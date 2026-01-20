import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Euro, 
  Sparkles, CheckCircle, Play, Star, AlertCircle
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useAuth } from '@/hooks/useAuth'
import { CLEANER_STATUS_LABELS } from '@/lib/constants'
import { formatCurrency, cn } from '@/lib/utils'

// ============================================
// PLANNING PAGE - Calendrier du Cleaner
// ============================================

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

function Planning() {
  const navigate = useNavigate()
  const { user, getCurrentCleanerId } = useAuth()
  const { missions, getConfirmedMissions, startMission } = useMissions()

  const cleanerId = getCurrentCleanerId()
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Missions du cleaner (confirmées, en cours, terminées)
  const myMissions = useMemo(() => {
    return missions.filter(m => 
      m.cleanerId === cleanerId && 
      [MISSION_STATUS.CONFIRMED, MISSION_STATUS.IN_PROGRESS, MISSION_STATUS.COMPLETED, MISSION_STATUS.RATED].includes(m.status)
    )
  }, [missions, cleanerId])

  // Calculer les dates du mois
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    // Ajuster pour commencer le lundi
    let startDate = new Date(firstDay)
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(current)
      const dateStr = date.toISOString().split('T')[0]
      const missionsOnDay = myMissions.filter(m => m.date === dateStr)
      
      days.push({
        date,
        dateStr,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
        missions: missionsOnDay,
      })
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }, [currentDate, selectedDate, myMissions])

  // Missions de la date sélectionnée
  const selectedDateStr = selectedDate.toISOString().split('T')[0]
  const missionsOnSelectedDate = myMissions.filter(m => m.date === selectedDateStr)

  // Gains de la semaine
  const weeklyEarnings = useMemo(() => {
    const weekStart = new Date(selectedDate)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    return myMissions
      .filter(m => {
        const missionDate = new Date(m.date)
        return missionDate >= weekStart && missionDate <= weekEnd &&
               (m.status === MISSION_STATUS.COMPLETED || m.status === MISSION_STATUS.RATED)
      })
      .reduce((sum, m) => sum + m.price, 0)
  }, [myMissions, selectedDate])

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + direction)
      return newDate
    })
  }

  const handleStartMission = (mission) => {
    startMission(mission.id)
  }

  const getStatusConfig = (status) => {
    const configs = {
      [MISSION_STATUS.CONFIRMED]: { color: 'bg-teal-500', icon: CheckCircle },
      [MISSION_STATUS.IN_PROGRESS]: { color: 'bg-sky-500', icon: Play },
      [MISSION_STATUS.COMPLETED]: { color: 'bg-green-500', icon: CheckCircle },
      [MISSION_STATUS.RATED]: { color: 'bg-amber-500', icon: Star },
    }
    return configs[status] || configs[MISSION_STATUS.CONFIRMED]
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Mon Planning
          </h1>
          <p className="text-slate-500 mt-1">
            Gérez votre emploi du temps
          </p>
        </div>

        <Link to="/cleaner/missions">
          <Button variant="secondary" icon={Sparkles}>
            Voir missions disponibles
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-xl font-semibold text-slate-900">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const hasMissions = day.missions.length > 0
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day.date)}
                    className={cn(
                      'relative p-2 min-h-[60px] rounded-xl transition-all text-left',
                      day.isCurrentMonth ? 'bg-white' : 'bg-slate-50',
                      day.isToday && 'ring-2 ring-sky-500',
                      day.isSelected && 'bg-sky-50 ring-2 ring-sky-500',
                      !day.isSelected && 'hover:bg-slate-100'
                    )}
                  >
                    <span className={cn(
                      'text-sm font-medium',
                      day.isCurrentMonth ? 'text-slate-900' : 'text-slate-400',
                      day.isToday && 'text-sky-600'
                    )}>
                      {day.date.getDate()}
                    </span>
                    
                    {/* Mission indicators */}
                    {hasMissions && (
                      <div className="mt-1 flex flex-wrap gap-0.5">
                        {day.missions.slice(0, 3).map((mission, i) => {
                          const config = getStatusConfig(mission.status)
                          return (
                            <div
                              key={i}
                              className={cn(
                                'w-2 h-2 rounded-full',
                                config.color
                              )}
                            />
                          )
                        })}
                        {day.missions.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{day.missions.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Sidebar - Selected Day & Stats */}
        <div className="space-y-6">
          {/* Weekly Stats */}
          <Card className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white border-0">
            <div className="p-6">
              <h3 className="font-semibold text-white/80 mb-2">Gains de la semaine</h3>
              <p className="text-3xl font-bold">{formatCurrency(weeklyEarnings)}</p>
              <p className="text-sm text-white/70 mt-1">
                {myMissions.filter(m => 
                  m.status === MISSION_STATUS.COMPLETED || m.status === MISSION_STATUS.RATED
                ).length} missions terminées
              </p>
            </div>
          </Card>

          {/* Selected Date */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-500" />
                {selectedDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </h3>

              {missionsOnSelectedDate.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">Aucune mission ce jour</p>
                  <Link 
                    to="/cleaner/missions"
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium mt-2 inline-block"
                  >
                    Trouver des missions →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {missionsOnSelectedDate.map((mission) => {
                    const config = getStatusConfig(mission.status)
                    const StatusIcon = config.icon

                    return (
                      <div 
                        key={mission.id}
                        className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/cleaner/missions/${mission.id}`)}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={mission.propertyImage}
                            alt={mission.propertyName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 truncate">
                              {mission.propertyName}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                              <Clock className="w-3.5 h-3.5" />
                              {mission.time} • {mission.duration}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="success" size="sm" className="flex items-center gap-1">
                                <StatusIcon className="w-3 h-3" />
                                {CLEANER_STATUS_LABELS[mission.status]}
                              </Badge>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(mission.price)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {mission.status === MISSION_STATUS.CONFIRMED && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <Button 
                              size="sm" 
                              fullWidth
                              icon={Play}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartMission(mission)
                              }}
                            >
                              Démarrer
                            </Button>
                          </div>
                        )}

                        {mission.status === MISSION_STATUS.IN_PROGRESS && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <Button 
                              size="sm" 
                              fullWidth
                              icon={CheckCircle}
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/cleaner/missions/${mission.id}`)
                              }}
                              className="bg-gradient-to-r from-green-500 to-teal-500"
                            >
                              Terminer
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* Legend */}
          <Card>
            <div className="p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Légende</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-teal-500" />
                  <span className="text-slate-600">Confirmée</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-sky-500" />
                  <span className="text-slate-600">En cours</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-slate-600">Terminée</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-600">Avis reçu</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Planning
