import { Search, Calendar, MessageCircle, Sparkles, CheckCircle, Home, FileText, Euro, Target } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// ============================================
// EMPTY STATE ULTIMATE V2 - Illustrations engageantes + CTAs contextuels
// ============================================

// SVG Illustrations inline
const illustrations = {
  missions: (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="80" fill="#f0f9ff" />
      <circle cx="100" cy="100" r="60" fill="#e0f2fe" />
      <rect x="70" y="60" width="60" height="80" rx="8" fill="white" stroke="#0ea5e9" strokeWidth="2"/>
      <line x1="80" y1="80" x2="120" y2="80" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
      <line x1="80" y1="95" x2="110" y2="95" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round"/>
      <line x1="80" y1="110" x2="115" y2="110" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="140" cy="140" r="25" fill="#14b8a6" fillOpacity="0.2"/>
      <path d="M130 140 L138 148 L152 132" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  messages: (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="80" fill="#f0fdfa" />
      <rect x="50" y="70" width="70" height="50" rx="10" fill="white" stroke="#14b8a6" strokeWidth="2"/>
      <circle cx="70" cy="95" r="4" fill="#14b8a6"/>
      <circle cx="85" cy="95" r="4" fill="#14b8a6"/>
      <circle cx="100" cy="95" r="4" fill="#14b8a6"/>
      <rect x="80" y="100" width="70" height="50" rx="10" fill="#14b8a6" fillOpacity="0.2" stroke="#14b8a6" strokeWidth="2"/>
      <line x1="95" y1="115" x2="135" y2="115" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="95" y1="130" x2="125" y2="130" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="80" fill="#fef3c7" />
      <rect x="55" y="60" width="90" height="90" rx="12" fill="white" stroke="#f59e0b" strokeWidth="2"/>
      <rect x="55" y="60" width="90" height="25" rx="12" fill="#f59e0b"/>
      <line x1="75" y1="50" x2="75" y2="70" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
      <line x1="125" y1="50" x2="125" y2="70" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="80" cy="105" r="6" fill="#fcd34d"/>
      <circle cx="100" cy="105" r="6" fill="#fcd34d"/>
      <circle cx="120" cy="105" r="6" fill="#f59e0b"/>
      <circle cx="80" cy="130" r="6" fill="#fcd34d"/>
      <circle cx="100" cy="130" r="6" fill="#fcd34d"/>
      <circle cx="120" cy="130" r="6" fill="#fcd34d"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="80" fill="#f1f5f9" />
      <circle cx="90" cy="90" r="35" fill="white" stroke="#64748b" strokeWidth="3"/>
      <line x1="115" y1="115" x2="145" y2="145" stroke="#64748b" strokeWidth="4" strokeLinecap="round"/>
      <path d="M75 90 Q90 75 105 90" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  success: (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="80" fill="#dcfce7" />
      <circle cx="100" cy="100" r="50" fill="#22c55e" fillOpacity="0.2"/>
      <circle cx="100" cy="100" r="35" fill="white" stroke="#22c55e" strokeWidth="3"/>
      <path d="M80 100 L95 115 L125 85" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="50" cy="60" r="8" fill="#86efac"/>
      <circle cx="150" cy="70" r="6" fill="#86efac"/>
      <circle cx="55" cy="140" r="5" fill="#86efac"/>
      <circle cx="155" cy="130" r="7" fill="#86efac"/>
    </svg>
  ),
  properties: (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="80" fill="#f0fdfa" />
      <path d="M100 50 L150 85 L150 150 L50 150 L50 85 Z" fill="white" stroke="#14b8a6" strokeWidth="2"/>
      <rect x="85" y="110" width="30" height="40" fill="#14b8a6" fillOpacity="0.3" stroke="#14b8a6" strokeWidth="2"/>
      <rect x="65" y="90" width="20" height="20" fill="#0ea5e9" fillOpacity="0.3" stroke="#0ea5e9" strokeWidth="2"/>
      <rect x="115" y="90" width="20" height="20" fill="#0ea5e9" fillOpacity="0.3" stroke="#0ea5e9" strokeWidth="2"/>
    </svg>
  ),
  earnings: (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="80" fill="#ecfdf5" />
      <circle cx="100" cy="100" r="55" fill="#d1fae5" />
      <circle cx="100" cy="100" r="35" fill="white" stroke="#10b981" strokeWidth="3"/>
      <text x="100" y="108" textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="24">€</text>
      <circle cx="55" cy="65" r="12" fill="#a7f3d0"/>
      <circle cx="145" cy="75" r="8" fill="#6ee7b7"/>
      <circle cx="60" cy="135" r="6" fill="#6ee7b7"/>
      <circle cx="150" cy="125" r="10" fill="#a7f3d0"/>
      <path d="M70 160 L85 140 L100 150 L115 125 L130 135" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
}

function EmptyState({
  icon: Icon,
  illustration,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className,
}) {
  const sizes = {
    sm: {
      container: 'py-6',
      illustration: 'w-24 h-24',
      icon: 'w-8 h-8',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-10',
      illustration: 'w-32 h-32',
      icon: 'w-10 h-10',
      title: 'text-lg',
      description: 'text-base',
    },
    lg: {
      container: 'py-16',
      illustration: 'w-40 h-40',
      icon: 'w-12 h-12',
      title: 'text-xl',
      description: 'text-lg',
    },
  }

  const s = sizes[size]
  const IllustrationSvg = illustration ? illustrations[illustration] : null

  return (
    <div className={cn('flex flex-col items-center text-center', s.container, className)}>
      {/* Illustration or Icon */}
      {IllustrationSvg ? (
        <div className={cn('mb-6', s.illustration)}>
          {IllustrationSvg}
        </div>
      ) : Icon ? (
        <div className={cn(
          'mb-6 p-4 rounded-2xl',
          'bg-gradient-to-br from-slate-100 to-slate-50'
        )}>
          <Icon className={cn(s.icon, 'text-slate-400')} />
        </div>
      ) : null}

      {/* Title */}
      {title && (
        <h3 className={cn('font-semibold text-slate-900 mb-2', s.title)}>
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className={cn('text-slate-500 max-w-sm mb-6', s.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button onClick={action.onClick} icon={action.icon}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="secondary" onClick={secondaryAction.onClick} icon={secondaryAction.icon}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// PRE-CONFIGURED VARIANTS - CTAs contextuels
// ============================================

function EmptyMissions({ onAction, isHost = false }) {
  return (
    <EmptyState
      illustration="missions"
      title="Aucune mission disponible"
      description={isHost 
        ? "Créez votre première demande de ménage pour voir les candidatures !"
        : "💡 Astuce : Passez côté Hôte pour créer une mission, puis revenez ici pour postuler !"
      }
      action={onAction ? { 
        label: isHost ? 'Créer une mission' : 'Voir les missions disponibles', 
        onClick: onAction
      } : undefined}
    />
  )
}

function EmptyMessages({ onAction, isHost = false }) {
  return (
    <EmptyState
      illustration="messages"
      title="Aucune conversation"
      description={isHost 
        ? "Les conversations avec vos cleaners apparaîtront ici après une réservation."
        : "💡 Astuce : Proposez vos services à un hôte pour démarrer une conversation !"
      }
      action={onAction ? { 
        label: isHost ? 'Voir les cleaners' : 'Proposer mes services', 
        onClick: onAction 
      } : undefined}
    />
  )
}

function EmptyCalendar({ onAction }) {
  return (
    <EmptyState
      illustration="calendar"
      title="Aucune mission planifiée"
      description="💡 Astuce : Postulez à une mission et attendez la confirmation de l'hôte pour la voir ici !"
      action={onAction ? { label: 'Voir les missions disponibles', onClick: onAction } : undefined}
    />
  )
}

function EmptySearch({ query }) {
  return (
    <EmptyState
      illustration="search"
      title="Aucun résultat"
      description={query ? `Aucun résultat pour "${query}". Essayez avec d'autres termes.` : "Aucun résultat trouvé."}
    />
  )
}

function EmptySuccess({ title, description, onAction }) {
  return (
    <EmptyState
      illustration="success"
      title={title || "🎉 Terminé !"}
      description={description || "Tout est en ordre."}
      action={onAction ? { label: 'Continuer', onClick: onAction } : undefined}
    />
  )
}

function EmptyProperties({ onAction }) {
  return (
    <EmptyState
      illustration="properties"
      title="Aucune propriété"
      description="Ajoutez votre premier bien pour commencer à planifier des ménages."
      action={onAction ? { label: 'Ajouter un bien', onClick: onAction } : undefined}
    />
  )
}

function EmptyEarnings({ onAction }) {
  return (
    <EmptyState
      illustration="earnings"
      title="Aucun revenu pour l'instant"
      description="💡 Astuce : Terminez des missions pour voir vos gains apparaître ici !"
      action={onAction ? { label: 'Voir les missions', onClick: onAction } : undefined}
    />
  )
}

// Alias for backward compatibility
const NoPropertiesEmpty = EmptyProperties

// ============================================
// ATTACH STATIC METHODS
// ============================================

EmptyState.Missions = EmptyMissions
EmptyState.Messages = EmptyMessages
EmptyState.Calendar = EmptyCalendar
EmptyState.Search = EmptySearch
EmptyState.Success = EmptySuccess
EmptyState.Properties = EmptyProperties
EmptyState.Earnings = EmptyEarnings

// ============================================
// EXPORTS
// ============================================

export {
  EmptyState,
  EmptyMissions,
  EmptyMessages,
  EmptyCalendar,
  EmptySearch,
  EmptySuccess,
  EmptyProperties,
  EmptyEarnings,
  NoPropertiesEmpty,
}

export default EmptyState
