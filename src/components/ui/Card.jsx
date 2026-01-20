import { cn } from '@/lib/utils'

function Card({
  children,
  className,
  hover = false,
  padding = 'default',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-surface-200 shadow-soft',
        hover && 'card-hover cursor-pointer',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ children, className, ...props }) {
  return (
    <div 
      className={cn('mb-4', className)} 
      {...props}
    >
      {children}
    </div>
  )
}

function CardTitle({ children, className, as: Component = 'h3', ...props }) {
  return (
    <Component 
      className={cn('text-lg font-semibold text-surface-900', className)} 
      {...props}
    >
      {children}
    </Component>
  )
}

function CardDescription({ children, className, ...props }) {
  return (
    <p 
      className={cn('text-sm text-surface-500 mt-1', className)} 
      {...props}
    >
      {children}
    </p>
  )
}

function CardContent({ children, className, ...props }) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ children, className, ...props }) {
  return (
    <div 
      className={cn('mt-4 pt-4 border-t border-surface-100', className)} 
      {...props}
    >
      {children}
    </div>
  )
}

// Feature Card variant
function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
  ...props
}) {
  return (
    <Card hover className={cn('text-center', className)} {...props}>
      {Icon && (
        <div className={cn(
          'w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center',
          'bg-brand-50 text-brand-500',
          iconClassName
        )}>
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-500">{description}</p>
    </Card>
  )
}

// Stat Card variant
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection = 'up',
  className,
  ...props
}) {
  return (
    <Card className={cn(className)} {...props}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm text-surface-500">{label}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
        </div>
        {trend && (
          <div className={cn(
            'text-sm font-medium flex items-center gap-1',
            trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            {trendDirection === 'up' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trend}
          </div>
        )}
      </div>
    </Card>
  )
}

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  FeatureCard,
  StatCard 
}
export default Card
