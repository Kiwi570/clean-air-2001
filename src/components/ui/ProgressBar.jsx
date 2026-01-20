import { cn } from '@/lib/utils'
import { CheckCircle, Circle } from 'lucide-react'

/**
 * ProgressBar - Barre de progression visuelle
 */
function ProgressBar({ 
  value = 0, 
  max = 100, 
  size = 'md',
  showLabel = false,
  color = 'brand',
  className 
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const colorClasses = {
    brand: 'bg-gradient-to-r from-sky-500 to-sky-400',
    accent: 'bg-gradient-to-r from-teal-500 to-teal-400',
    success: 'bg-gradient-to-r from-green-500 to-emerald-400',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-400',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-surface-600">Progression</span>
          <span className="text-xs font-bold text-surface-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        'w-full bg-surface-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/**
 * StepProgress - Progression par étapes avec icônes
 */
function StepProgress({ 
  current = 0, 
  total = 3, 
  labels = [],
  className 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-surface-700">
          Avancement
        </span>
        <span className={cn(
          'text-sm font-bold',
          current === total ? 'text-green-600' : 'text-surface-900'
        )}>
          {current}/{total} {current === total ? '✓' : ''}
        </span>
      </div>
      
      {/* Progress bar */}
      <ProgressBar 
        value={current} 
        max={total} 
        color={current === total ? 'success' : 'brand'}
        size="md"
      />
      
      {/* Steps dots */}
      <div className="flex justify-between">
        {Array.from({ length: total }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              'flex flex-col items-center gap-1 transition-all',
              i < current && 'text-green-600',
              i === current && 'text-sky-600',
              i > current && 'text-surface-300'
            )}
          >
            {i < current ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Circle className={cn(
                'w-5 h-5',
                i === current && 'animate-pulse'
              )} />
            )}
            {labels[i] && (
              <span className="text-xs max-w-[60px] text-center truncate">
                {labels[i]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * ChecklistProgress - Micro-texte dynamique pour la checklist
 */
function ChecklistProgress({ completed = 0, total = 3, required = 2 }) {
  const allDone = completed >= total
  const requiredDone = completed >= required
  const remaining = required - completed
  
  // Messages dynamiques et encourageants
  const getMessage = () => {
    if (allDone) {
      return { text: "Parfait ! Vous pouvez terminer 🎉", color: 'text-green-600' }
    }
    if (requiredDone) {
      return { text: "Tout est prêt, bien joué 👌", color: 'text-green-600' }
    }
    if (completed === 0) {
      return { text: "Cochez chaque étape terminée", color: 'text-surface-500' }
    }
    if (remaining === 1) {
      return { text: "Bien ! Plus qu'une étape obligatoire", color: 'text-amber-600' }
    }
    return { text: `Encore ${remaining} étapes obligatoires`, color: 'text-surface-600' }
  }
  
  const { text, color } = getMessage()
  
  return (
    <div className="space-y-2">
      <ProgressBar 
        value={completed} 
        max={total} 
        color={requiredDone ? 'success' : 'brand'}
        size="sm"
      />
      <p className={cn('text-sm font-medium', color)}>
        {text}
      </p>
    </div>
  )
}

export { ProgressBar, StepProgress, ChecklistProgress }
export default ProgressBar
