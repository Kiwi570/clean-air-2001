import { Zap, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ModeBadge - Affiche le mode actif (Instant vs Candidature)
 * P0: Le testeur doit toujours savoir dans quel mode il est
 */
function ModeBadge({ mode = 'instant', size = 'sm', className }) {
  const isInstant = mode === 'instant'
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  }
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }

  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all',
        sizeClasses[size],
        isInstant 
          ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200' 
          : 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border border-sky-200',
        className
      )}
      title={isInstant 
        ? "Mode Instant : l'hôte choisit directement un cleaner" 
        : "Mode Candidature : les cleaners postulent et l'hôte accepte"
      }
    >
      {isInstant ? (
        <Zap className={cn(iconSizes[size], 'text-amber-500')} />
      ) : (
        <Users className={cn(iconSizes[size], 'text-sky-500')} />
      )}
      <span>
        {isInstant ? 'Mode Instant' : 'Mode Candidature'}
      </span>
    </div>
  )
}

/**
 * ModeIndicator - Version compacte pour les headers
 */
function ModeIndicator({ mode = 'instant', className }) {
  const isInstant = mode === 'instant'
  
  return (
    <div 
      className={cn(
        'flex items-center gap-1.5 text-xs text-surface-500',
        className
      )}
      title={isInstant 
        ? "Mode Instant : l'hôte choisit directement un cleaner" 
        : "Mode Candidature : les cleaners postulent et l'hôte accepte"
      }
    >
      {isInstant ? (
        <Zap className="w-3.5 h-3.5 text-amber-500" />
      ) : (
        <Users className="w-3.5 h-3.5 text-sky-500" />
      )}
      <span className="hidden sm:inline">
        {isInstant ? 'Instant' : 'Candidature'}
      </span>
    </div>
  )
}

export { ModeBadge, ModeIndicator }
export default ModeBadge
