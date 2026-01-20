import { useState } from 'react'
import { Star, MapPin, Calendar, Heart, MessageSquare, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, RatingBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

function Cleaners() {
  const [filter, setFilter] = useState('favorites')

  const cleaners = [
    {
      id: '1',
      name: 'Paul Dubois',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      rating: 4.9,
      reviewCount: 48,
      completedMissions: 142,
      zones: ['Paris 3e', 'Paris 4e', 'Paris 11e'],
      bio: 'Professionnel du ménage depuis 5 ans, spécialisé locations courte durée.',
      isFavorite: true,
      lastCleaning: '2025-01-18',
      totalWithYou: 12,
    },
    {
      id: '2',
      name: 'Sophie Durand',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 4.8,
      reviewCount: 35,
      completedMissions: 98,
      zones: ['Paris 10e', 'Paris 11e', 'Paris 20e'],
      bio: 'Minutieuse et ponctuelle, je m\'adapte à vos besoins.',
      isFavorite: true,
      lastCleaning: '2025-01-15',
      totalWithYou: 8,
    },
    {
      id: '3',
      name: 'Lucas Martin',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5.0,
      reviewCount: 22,
      completedMissions: 56,
      zones: ['Paris 11e', 'Paris 12e'],
      bio: 'Nouveau sur la plateforme mais expérimenté. Qualité garantie !',
      isFavorite: false,
      lastCleaning: null,
      totalWithYou: 0,
    },
  ]

  const filteredCleaners = cleaners.filter(c => {
    if (filter === 'favorites') return c.isFavorite
    return true
  })

  const toggleFavorite = (id) => {
    // Toggle favorite status
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Mes Cleaners
          </h1>
          <p className="text-surface-500 mt-1">
            Gérez vos cleaners favoris
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { value: 'favorites', label: 'Favoris', icon: Heart },
          { value: 'all', label: 'Tous les cleaners', icon: null },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2',
              filter === tab.value
                ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            )}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cleaners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCleaners.map((cleaner) => (
          <Card key={cleaner.id} className="relative">
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(cleaner.id)}
              className={cn(
                'absolute top-4 right-4 p-2 rounded-lg transition-colors',
                cleaner.isFavorite
                  ? 'bg-red-100 text-red-500'
                  : 'bg-surface-100 text-surface-400 hover:text-red-500'
              )}
            >
              <Heart className={cn('w-5 h-5', cleaner.isFavorite && 'fill-current')} />
            </button>

            {/* Profile */}
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar src={cleaner.avatar} name={cleaner.name} size="xl" className="mb-3" />
              <h3 className="font-bold text-surface-900 text-lg">{cleaner.name}</h3>
              <RatingBadge rating={cleaner.rating} reviewCount={cleaner.reviewCount} />
            </div>

            {/* Bio */}
            <p className="text-sm text-surface-600 text-center mb-4">
              {cleaner.bio}
            </p>

            {/* Zones */}
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {cleaner.zones.map((zone) => (
                <Badge key={zone} variant="default" size="sm">{zone}</Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-surface-50 rounded-xl mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-surface-900">{cleaner.completedMissions}</p>
                <p className="text-xs text-surface-500">Missions totales</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-accent-600">{cleaner.totalWithYou}</p>
                <p className="text-xs text-surface-500">Avec vous</p>
              </div>
            </div>

            {/* Last cleaning info */}
            {cleaner.lastCleaning && (
              <div className="flex items-center gap-2 text-sm text-surface-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Dernier ménage : {cleaner.lastCleaning}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="accent" fullWidth>
                Réserver
              </Button>
              <Button variant="secondary">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCleaners.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="font-semibold text-surface-900 mb-2">Aucun cleaner favori</h3>
            <p className="text-surface-500 mb-4">
              Ajoutez des cleaners à vos favoris pour les retrouver facilement.
            </p>
            <Button onClick={() => setFilter('all')}>
              Voir tous les cleaners
            </Button>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-accent-50 border-accent-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-accent-600" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 mb-1">
              Cleaners vérifiés
            </h3>
            <p className="text-surface-600 text-sm">
              Tous nos cleaners sont vérifiés : identité, références et assurance professionnelle. 
              Réservez en toute confiance.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Cleaners
