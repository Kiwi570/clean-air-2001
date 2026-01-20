import { Link } from 'react-router-dom'
import { Home, Plus, MapPin, Calendar, MoreVertical } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { NoPropertiesEmpty } from '@/components/ui/EmptyState'

function Properties() {
  const properties = [
    {
      id: '1',
      name: 'Studio Marais',
      address: '15 Rue des Archives, Paris 4e',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
      type: 'Studio',
      surface: 25,
      rooms: 1,
      nextCleaning: {
        date: 'Aujourd\'hui',
        time: '14:00',
        cleaner: 'Paul D.',
        cleanerAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
      totalCleanings: 24,
      avgPrice: 45,
    },
    {
      id: '2',
      name: 'Appartement Bastille',
      address: '42 Rue de la Roquette, Paris 11e',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
      type: 'T2',
      surface: 45,
      rooms: 2,
      nextCleaning: {
        date: 'Demain',
        time: '10:00',
        cleaner: 'Paul D.',
        cleanerAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      },
      totalCleanings: 18,
      avgPrice: 65,
    },
    {
      id: '3',
      name: 'Loft Oberkampf',
      address: '25 Rue Oberkampf, Paris 11e',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
      type: 'Loft',
      surface: 80,
      rooms: 3,
      nextCleaning: null,
      totalCleanings: 12,
      avgPrice: 95,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Mes Biens
          </h1>
          <p className="text-surface-500 mt-1">
            {properties.length} bien{properties.length > 1 ? 's' : ''} enregistré{properties.length > 1 ? 's' : ''}
          </p>
        </div>

        <Link to="/host/properties/new">
          <Button icon={Plus}>
            Ajouter un bien
          </Button>
        </Link>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} hover className="relative group overflow-hidden p-0">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <button className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm">
                    <MoreVertical className="w-4 h-4 text-surface-600" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <Badge variant="default" className="bg-white/90 backdrop-blur-sm">{property.type}</Badge>
                  <Badge variant="default" className="bg-white/90 backdrop-blur-sm">{property.surface}m²</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <Link to={`/host/properties/${property.id}`}>
                  <h3 className="text-lg font-bold text-surface-900 mb-1 group-hover:text-accent-600 transition-colors">
                    {property.name}
                  </h3>
                </Link>
                
                <p className="text-surface-500 text-sm flex items-center gap-1 mb-4">
                  <MapPin className="w-4 h-4" />
                  {property.address}
                </p>

                {/* Next Cleaning */}
                {property.nextCleaning ? (
                  <div className="p-3 bg-accent-50 rounded-xl mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-accent-600" />
                      <span className="text-accent-700 font-medium">
                        {property.nextCleaning.date} à {property.nextCleaning.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <img 
                        src={property.nextCleaning.cleanerAvatar} 
                        alt={property.nextCleaning.cleaner}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-sm text-surface-600">{property.nextCleaning.cleaner}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-surface-50 rounded-xl mb-4">
                    <p className="text-sm text-surface-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Aucun ménage planifié
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                  <div>
                    <p className="text-sm text-surface-500">Total ménages</p>
                    <p className="font-semibold text-surface-900">{property.totalCleanings}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-surface-500">Prix moyen</p>
                    <p className="font-semibold text-surface-900">{property.avgPrice}€</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link to={`/host/properties/${property.id}`} className="flex-1">
                    <Button fullWidth variant="accent" size="sm">
                      Gérer le bien
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <NoPropertiesEmpty onAction={() => window.location.href = '/host/properties/new'} />
        </Card>
      )}
    </div>
  )
}

export default Properties
