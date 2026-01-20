import { useState } from 'react'
import { 
  X, Star, MapPin, Calendar, CheckCircle, Clock, 
  Award, Briefcase, MessageCircle, ThumbsUp
} from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Badge, RatingBadge } from './Badge'
import { Avatar } from './Avatar'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

// ============================================
// CLEANER PROFILE MODAL V4
// Pour voir le profil complet d'un cleaner
// ============================================

function CleanerProfileModal({ 
  isOpen, 
  onClose, 
  cleaner, 
  mission,
  onAccept,
  onReject,
  onContact,
  isLoading = false,
}) {
  if (!cleaner) return null

  const stats = [
    { 
      icon: CheckCircle, 
      label: 'Missions', 
      value: cleaner.completedMissions || 142,
      color: 'text-green-500'
    },
    { 
      icon: Star, 
      label: 'Note', 
      value: cleaner.rating || 4.9,
      color: 'text-amber-500'
    },
    { 
      icon: ThumbsUp, 
      label: 'Avis', 
      value: cleaner.reviewCount || 48,
      color: 'text-sky-500'
    },
  ]

  // Faux avis pour la démo
  const reviews = cleaner.reviews || [
    {
      id: '1',
      author: 'Sophie M.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      date: '2025-01-15',
      comment: 'Excellent travail, appartement impeccable ! Très professionnel.',
    },
    {
      id: '2',
      author: 'Marc D.',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      rating: 5,
      date: '2025-01-10',
      comment: 'Ponctuel et minutieux. Je recommande vivement.',
    },
    {
      id: '3',
      author: 'Julie L.',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 4,
      date: '2025-01-05',
      comment: 'Très bon travail dans l\'ensemble.',
    },
  ]

  const zones = cleaner.zones || ['Paris 3e', 'Paris 4e', 'Paris 11e']

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
    >
      <div className="relative">
        {/* Header avec gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-sky-500 to-teal-500 -mx-6 -mt-6 rounded-t-2xl" />
        
        {/* Avatar */}
        <div className="relative pt-8 text-center">
          <div className="relative inline-block">
            <img
              src={cleaner.avatar}
              alt={cleaner.fullName || cleaner.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          
          {/* Nom et badge */}
          <h2 className="text-xl font-bold text-slate-900 mt-4">
            {cleaner.fullName || cleaner.name}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <RatingBadge 
              rating={cleaner.rating || 4.9} 
              reviewCount={cleaner.reviewCount || 48} 
            />
            <Badge variant="success" size="sm">
              <Award className="w-3 h-3 mr-1" />
              Vérifié
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-slate-50 rounded-xl">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={cn("flex items-center justify-center gap-1", stat.color)}>
                <stat.icon className="w-4 h-4" />
                <span className="text-lg font-bold">{stat.value}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">À propos</h3>
          <p className="text-slate-600 text-sm">
            {cleaner.bio || 'Professionnel du ménage depuis 5 ans, je suis spécialisé dans les locations courte durée. Minutieux et ponctuel, je m\'adapte à vos besoins.'}
          </p>
        </div>

        {/* Zones */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-sky-500" />
            Zones d'intervention
          </h3>
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <Badge key={zone} variant="default" size="sm">
                {zone}
              </Badge>
            ))}
          </div>
        </div>

        {/* Derniers avis */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500" />
            Derniers avis
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {reviews.map((review) => (
              <div key={review.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <img 
                    src={review.avatar}
                    alt={review.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-slate-900">{review.author}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission concernée */}
        {mission && (
          <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Mission concernée</h3>
            <div className="flex items-center gap-3">
              <img 
                src={mission.propertyImage}
                alt={mission.propertyName}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium text-slate-900">{mission.propertyName}</p>
                <p className="text-sm text-slate-500">
                  {formatDate(mission.date)} à {mission.time}
                </p>
                <p className="text-lg font-bold text-sky-600">
                  {formatCurrency(mission.price)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          {onContact && (
            <Button 
              variant="secondary" 
              icon={MessageCircle}
              onClick={onContact}
            >
              Contacter
            </Button>
          )}
          {onReject && (
            <Button 
              variant="ghost" 
              onClick={onReject}
              disabled={isLoading}
            >
              Refuser
            </Button>
          )}
          {onAccept && (
            <Button 
              fullWidth
              icon={CheckCircle}
              onClick={onAccept}
              loading={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Accepter la candidature
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export { CleanerProfileModal }
export default CleanerProfileModal
