import { CheckCircle, Circle, Clock, Star, Play, Flag, Send, User } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TIMELINE COMPONENT - Historique des missions
// ============================================

const eventConfig = {
  created: {
    icon: Flag,
    color: 'bg-slate-100 text-slate-600',
    lineColor: 'bg-slate-200',
  },
  applied: {
    icon: Send,
    color: 'bg-amber-100 text-amber-600',
    lineColor: 'bg-amber-200',
  },
  confirmed: {
    icon: User,
    color: 'bg-teal-100 text-teal-600',
    lineColor: 'bg-teal-200',
  },
  started: {
    icon: Play,
    color: 'bg-sky-100 text-sky-600',
    lineColor: 'bg-sky-200',
  },
  completed: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600',
    lineColor: 'bg-green-200',
  },
  rated: {
    icon: Star,
    color: 'bg-amber-100 text-amber-600',
    lineColor: 'bg-amber-200',
  },
}

// Les étapes attendues dans l'ordre
const expectedSteps = [
  { event: 'created', label: 'Réservation créée' },
  { event: 'confirmed', label: 'Cleaner confirmé' },
  { event: 'started', label: 'Ménage démarré' },
  { event: 'completed', label: 'Ménage terminé' },
  { event: 'rated', label: 'Avis laissé' },
]

function formatTimeAgo(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}

function Timeline({ events = [], showPending = true, compact = false }) {
  // Créer un map des événements complétés
  const completedEvents = new Map(events.map(e => [e.event, e]))
  
  // Déterminer les étapes à afficher
  const steps = expectedSteps.map(step => {
    const completedEvent = completedEvents.get(step.event)
    return {
      ...step,
      completed: !!completedEvent,
      timestamp: completedEvent?.timestamp,
      label: completedEvent?.label || step.label,
    }
  })

  // Si on ne montre pas les étapes en attente, filtrer
  const displaySteps = showPending ? steps : steps.filter(s => s.completed)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {displaySteps.map((step, index) => {
          const config = eventConfig[step.event]
          const Icon = config.icon
          
          return (
            <div key={step.event} className="flex items-center gap-2">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center',
                step.completed ? config.color : 'bg-slate-100 text-slate-300'
              )}>
                {step.completed ? (
                  <Icon className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              {index < displaySteps.length - 1 && (
                <div className={cn(
                  'w-4 h-0.5',
                  step.completed ? config.lineColor : 'bg-slate-200'
                )} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {displaySteps.map((step, index) => {
        const config = eventConfig[step.event]
        const Icon = step.completed ? config.icon : Circle
        const isLast = index === displaySteps.length - 1
        
        return (
          <div key={step.event} className="flex gap-3">
            {/* Icon & Line */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                step.completed 
                  ? config.color 
                  : 'bg-slate-100 text-slate-300 border-2 border-dashed border-slate-200'
              )}>
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && (
                <div className={cn(
                  'w-0.5 h-8 my-1',
                  step.completed ? config.lineColor : 'bg-slate-200 border-dashed'
                )} />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-4">
              <p className={cn(
                'font-medium text-sm',
                step.completed ? 'text-slate-900' : 'text-slate-400'
              )}>
                {step.label}
              </p>
              {step.completed && step.timestamp && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatTimeAgo(step.timestamp)}
                </p>
              )}
              {!step.completed && (
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  En attente
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Mini version pour les cards
function TimelineMini({ events = [] }) {
  return <Timeline events={events} showPending={false} compact />
}

// Version badge avec état actuel
function TimelineStatus({ events = [] }) {
  const completedEvents = new Set(events.map(e => e.event))
  
  // Trouver l'étape actuelle
  let currentStep = 'created'
  for (const step of expectedSteps) {
    if (completedEvents.has(step.event)) {
      currentStep = step.event
    }
  }
  
  const config = eventConfig[currentStep]
  const Icon = config.icon
  const label = expectedSteps.find(s => s.event === currentStep)?.label
  
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      config.color
    )}>
      <Icon className="w-3 h-3" />
      {label}
    </div>
  )
}

export { Timeline, TimelineMini, TimelineStatus }
export default Timeline
