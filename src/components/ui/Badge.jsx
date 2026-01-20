import { cn } from '@/lib/utils'

function Badge({
  children,
  variant = 'default',
  size = 'default',
  dot = false,
  removable = false,
  onRemove,
  className,
  ...props
}) {
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-brand-100 text-brand-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    accent: 'bg-accent-100 text-accent-700',
    outline: 'bg-transparent border-2 border-surface-200 text-surface-700',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const dotColors = {
    default: 'bg-surface-500',
    primary: 'bg-brand-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    accent: 'bg-accent-500',
    outline: 'bg-surface-500',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 -mr-1 p-0.5 hover:bg-black/10 rounded-full transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

// Status Badge variant
function StatusBadge({ status, className }) {
  const statusConfig = {
    available: { label: 'Disponible', variant: 'success', dot: true },
    pending: { label: 'En attente', variant: 'warning', dot: true },
    accepted: { label: 'Acceptée', variant: 'primary', dot: true },
    confirmed: { label: 'Confirmé', variant: 'success', dot: true },
    in_progress: { label: 'En cours', variant: 'primary', dot: true },
    completed: { label: 'Terminée', variant: 'success', dot: false },
    paid: { label: 'Payé', variant: 'success', dot: false },
    cancelled: { label: 'Annulée', variant: 'danger', dot: false },
    offline: { label: 'Hors ligne', variant: 'default', dot: true },
    online: { label: 'En ligne', variant: 'success', dot: true },
  }

  const config = statusConfig[status] || statusConfig.available

  return (
    <Badge 
      variant={config.variant} 
      dot={config.dot}
      className={className}
    >
      {config.label}
    </Badge>
  )
}

// Rating Badge
function RatingBadge({ rating, reviewCount, className }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-sm font-medium',
      className
    )}>
      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-surface-900">{rating}</span>
      {reviewCount && (
        <span className="text-surface-500">({reviewCount})</span>
      )}
    </span>
  )
}

export { Badge, StatusBadge, RatingBadge }
export default Badge
