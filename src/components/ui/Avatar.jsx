import { cn, getInitials } from '@/lib/utils'

function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
  ...props
}) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-surface-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
  }

  const initials = getInitials(name || alt)

  return (
    <div className={cn('relative inline-flex', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={cn(
            'rounded-full object-cover bg-surface-100',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-brand-400 to-brand-600',
            'flex items-center justify-center font-semibold text-white',
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  )
}

// Avatar group for showing multiple avatars
function AvatarGroup({
  avatars = [],
  max = 4,
  size = 'md',
  className,
}) {
  const displayed = avatars.slice(0, max)
  const remaining = avatars.length - max

  const overlapSizes = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-2.5',
    lg: '-ml-3',
    xl: '-ml-4',
    '2xl': '-ml-5',
  }

  return (
    <div className={cn('flex items-center', className)}>
      {displayed.map((avatar, index) => (
        <Avatar
          key={avatar.id || index}
          {...avatar}
          size={size}
          className={cn(
            'ring-2 ring-white',
            index > 0 && overlapSizes[size]
          )}
        />
      ))}
      
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full bg-surface-200 flex items-center justify-center',
            'font-medium text-surface-600 ring-2 ring-white',
            overlapSizes[size],
            {
              'w-6 h-6 text-xs': size === 'xs',
              'w-8 h-8 text-xs': size === 'sm',
              'w-10 h-10 text-sm': size === 'md',
              'w-12 h-12 text-sm': size === 'lg',
              'w-16 h-16 text-base': size === 'xl',
              'w-20 h-20 text-lg': size === '2xl',
            }
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }
export default Avatar
