import { cn } from '@/lib/utils'

// ============================================
// SKELETON ULTIMATE - Loading states premium
// ============================================

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('skeleton', className)}
      {...props}
    />
  )
}

// ============================================
// SKELETON VARIANTS
// ============================================

function SkeletonAvatar({ size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <Skeleton className={cn('rounded-full', sizes[size], className)} />
  )
}

function SkeletonText({ lines = 1, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4 rounded',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

function SkeletonButton({ size = 'md', className }) {
  const sizes = {
    sm: 'h-9 w-24',
    md: 'h-11 w-32',
    lg: 'h-12 w-40',
  }

  return (
    <Skeleton className={cn('rounded-xl', sizes[size], className)} />
  )
}

function SkeletonStat({ className }) {
  return (
    <div className={cn('bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100/50 shadow-lg p-5', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
    </div>
  )
}

function SkeletonCard({ className }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4', className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    </div>
  )
}

function SkeletonMissionCard({ className }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden', className)}>
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function SkeletonMessage({ className }) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <SkeletonAvatar size="md" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
    </div>
  )
}

function SkeletonListItem({ className }) {
  return (
    <div className={cn('flex items-center gap-4 p-4 bg-slate-50 rounded-xl', className)}>
      <Skeleton className="w-14 h-14 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
      <Skeleton className="h-6 w-16 rounded" />
    </div>
  )
}

// ============================================
// SKELETON COMPOSITIONS
// ============================================

function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard />
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <div className="space-y-3">
              <SkeletonListItem />
              <SkeletonListItem />
              <SkeletonListItem />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}

function SkeletonMissionsList() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32 rounded" />
        <Skeleton className="h-4 w-56 rounded" />
      </div>

      {/* Tabs */}
      <Skeleton className="h-12 w-96 rounded-xl" />

      {/* Search & Filters */}
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-28 rounded-xl" />
        <Skeleton className="h-12 w-24 rounded-xl" />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <SkeletonMissionCard />
        <SkeletonMissionCard />
        <SkeletonMissionCard />
        <SkeletonMissionCard />
        <SkeletonMissionCard />
        <SkeletonMissionCard />
      </div>
    </div>
  )
}

function SkeletonMessagesList() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32 rounded" />
        <Skeleton className="h-4 w-48 rounded" />
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4">
            <SkeletonMessage />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonProfile() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

// ============================================
// ATTACH STATIC METHODS
// ============================================

Skeleton.Avatar = SkeletonAvatar
Skeleton.Text = SkeletonText
Skeleton.Button = SkeletonButton
Skeleton.Stat = SkeletonStat
Skeleton.Card = SkeletonCard
Skeleton.MissionCard = SkeletonMissionCard
Skeleton.Message = SkeletonMessage
Skeleton.ListItem = SkeletonListItem
Skeleton.Dashboard = SkeletonDashboard
Skeleton.MissionsList = SkeletonMissionsList
Skeleton.MessagesList = SkeletonMessagesList
Skeleton.Profile = SkeletonProfile

// ============================================
// EXPORTS
// ============================================

export { 
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  SkeletonButton,
  SkeletonStat,
  SkeletonCard,
  SkeletonMissionCard,
  SkeletonMessage,
  SkeletonListItem,
  SkeletonDashboard,
  SkeletonMissionsList,
  SkeletonMessagesList,
  SkeletonProfile,
}

export default Skeleton
