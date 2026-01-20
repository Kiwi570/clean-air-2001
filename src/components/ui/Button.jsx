import { forwardRef, useState, useEffect } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// BUTTON ULTIMATE - Boutons premium
// ============================================

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  success = false,
  successText = 'Fait !',
  fullWidth = false,
  className,
  ...props
}, ref) => {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (success) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
  }

  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }

  const isDisabled = disabled || loading

  // Success state override
  if (showSuccess) {
    return (
      <button
        ref={ref}
        className={cn(
          'btn btn-success',
          sizes[size],
          fullWidth && 'w-full',
          'animate-scale-in',
          className
        )}
        disabled
      >
        <CheckCircle className="w-5 h-5 animate-scale-in" />
        <span>{successText}</span>
      </button>
    )
  }

  return (
    <button
      ref={ref}
      className={cn(
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

// ============================================
// COUNTDOWN BUTTON - Confirmation avec décompte
// ============================================

function CountdownButton({
  children,
  onConfirm,
  countdown = 3,
  confirmText = 'Confirmer',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  fullWidth = false,
  className,
  ...props
}) {
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [count, setCount] = useState(countdown)

  useEffect(() => {
    if (isCountingDown && count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isCountingDown && count === 0) {
      onConfirm?.()
      setIsCountingDown(false)
      setCount(countdown)
    }
  }, [isCountingDown, count, countdown, onConfirm])

  const handleClick = () => {
    if (!isCountingDown) {
      setIsCountingDown(true)
      setCount(countdown)
    } else {
      // Cancel
      setIsCountingDown(false)
      setCount(countdown)
    }
  }

  if (isCountingDown) {
    return (
      <button
        className={cn(
          'btn relative overflow-hidden',
          variant === 'primary' ? 'btn-primary' : 'btn-accent',
          size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : 'btn-md',
          fullWidth && 'w-full',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* Progress ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full absolute" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(count / countdown) * 301.59} 301.59`}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000"
            />
          </svg>
        </div>
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-lg font-bold animate-countdown-pulse">{count}</span>
          <span>{confirmText}... (clic pour annuler)</span>
        </span>
      </button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      icon={Icon}
      fullWidth={fullWidth}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Button>
  )
}

// ============================================
// CONFIRM BUTTON - Double clic confirmation
// ============================================

function ConfirmButton({
  children,
  confirmText = 'Confirmer ?',
  onConfirm,
  variant = 'danger',
  size = 'md',
  icon: Icon,
  fullWidth = false,
  className,
  ...props
}) {
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => setIsConfirming(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isConfirming])

  const handleClick = () => {
    if (isConfirming) {
      onConfirm?.()
      setIsConfirming(false)
    } else {
      setIsConfirming(true)
    }
  }

  return (
    <Button
      variant={isConfirming ? 'danger' : variant}
      size={size}
      icon={isConfirming ? undefined : Icon}
      fullWidth={fullWidth}
      onClick={handleClick}
      className={cn(
        isConfirming && 'animate-pulse',
        className
      )}
      {...props}
    >
      {isConfirming ? confirmText : children}
    </Button>
  )
}

// ============================================
// ICON BUTTON - Bouton icône seule
// ============================================

function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  label,
  className,
  ...props
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-lg',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500',
        'active:scale-95',
        sizes[size],
        variants[variant],
        className
      )}
      aria-label={label}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  )
}

// ============================================
// SPINNER - Loading indicator
// ============================================

function Spinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Loader2 className={cn('animate-spin text-sky-500', sizes[size], className)} />
  )
}

// ============================================
// EXPORTS
// ============================================

export {
  Button,
  CountdownButton,
  ConfirmButton,
  IconButton,
  Spinner,
}

export default Button
