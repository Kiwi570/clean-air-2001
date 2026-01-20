import { useState, useEffect } from 'react'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

// ============================================
// ONBOARDING TOOLTIP - Tips guidés
// ============================================

function OnboardingTooltip({
  children,
  content,
  title,
  isOpen,
  onDismiss,
  position = 'top',
  showArrow = true,
  icon: Icon = Sparkles,
  actionLabel = 'Compris !',
  className,
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Petit délai pour l'animation d'entrée
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss?.(), 200)
  }

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  }

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-white border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-white border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-white border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-white border-t-transparent border-b-transparent border-l-transparent',
  }

  if (!isOpen) return children

  return (
    <div className="relative inline-block">
      {children}

      {/* Tooltip */}
      <div
        className={cn(
          'absolute z-50 w-72 transition-all duration-200',
          positions[position],
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          className
        )}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-surface-100 overflow-hidden">
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{title || 'Astuce'}</span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-surface-600 text-sm leading-relaxed mb-4">
              {content}
            </p>
            <Button
              size="sm"
              fullWidth
              onClick={handleDismiss}
              className="group"
            >
              {actionLabel}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Arrow */}
        {showArrow && (
          <div
            className={cn(
              'absolute w-0 h-0 border-8',
              arrowPositions[position]
            )}
          />
        )}
      </div>

      {/* Backdrop semi-transparent */}
      <div
        className="fixed inset-0 bg-black/10 z-40"
        onClick={handleDismiss}
      />
    </div>
  )
}

// Tooltip simple (sans state interne)
function Tooltip({ children, content, position = 'top', className }) {
  const [isHovered, setIsHovered] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div
          className={cn(
            'absolute z-50 px-3 py-1.5 bg-surface-900 text-white text-sm rounded-lg whitespace-nowrap',
            'animate-fade-in',
            positions[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

// Progress Tooltip pour l'onboarding
function ProgressTooltip({
  isOpen,
  onDismiss,
  currentStep,
  totalSteps,
  title,
  content,
  position = 'bottom',
}) {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        'absolute z-50 w-80 animate-fade-in-up',
        position === 'bottom' && 'top-full mt-3',
        position === 'top' && 'bottom-full mb-3',
      )}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-surface-100 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-surface-100">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-4">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-surface-500">
              Étape {currentStep} sur {totalSteps}
            </span>
            <button
              onClick={onDismiss}
              className="text-surface-400 hover:text-surface-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <h4 className="font-semibold text-surface-900 mb-1">{title}</h4>
          <p className="text-sm text-surface-600 mb-4">{content}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={onDismiss}
              className="text-sm text-surface-500 hover:text-surface-700"
            >
              Passer le tutoriel
            </button>
            <Button size="sm" onClick={onDismiss}>
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { OnboardingTooltip, Tooltip, ProgressTooltip }
export default OnboardingTooltip
