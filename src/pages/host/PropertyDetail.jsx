import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Calendar, Clock, Euro, Home, Edit2, Trash2,
  Ruler, Bath, Star, Plus, CheckCircle, ExternalLink, RefreshCw
} from 'lucide-react'
import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import { formatCurrency, formatDate } from '@/lib/utils'

function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()
  
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock data - would come from API
  const property = {
    id,
    name: 'Studio Marais',
    address: '15 Rue des Archives, 75004 Paris',
    type: 'Studio',
    surface: 25,
    rooms: 1,
    bathrooms: 1,
    floor: 3,
    elevator: true,
    description: 'Charmant studio au cœur du Marais, idéal pour les courts séjours. Lumineux et bien équipé.',
    amenities: ['Cuisine équipée', 'Lave-linge', 'Climatisation', 'Wifi'],
    icalUrl: 'https://www.airbnb.com/calendar/ical/12345.ics',
    icalSynced: true,
    lastSync: '2025-01-20 14:30',
    stats: {
      totalCleanings: 24,
      thisMonth: 4,
      avgPrice: 52,
      avgRating: 4.9,
    },
    upcomingCleanings: [
      {
        id: '1',
        date: '2025-01-20',
        time: '14:00',
        cleaner: {name: 'Paul D.', rating: 4.9 },
        status: 'confirmed',
        price: 55,
      },
      {
        id: '2',
        date: '2025-01-25',
        time: '11:00',
        cleaner: { name: 'Paul D.', rating: 4.8 },
        status: 'pending',
        price: 55,
      },
    ],
    pastCleanings: [
      {
        id: '3',
        date: '2025-01-15',
        cleaner: {name: 'Paul D.' },
        rating: 5,
        price: 55,
      },
      {
        id: '4',
        date: '2025-01-10',
        cleaner: { name: 'Sophie D.' },
        rating: 5,
        price: 55,
      },
      {
        id: '5',
        date: '2025-01-05',
        cleaner: {name: 'Paul D.' },
        rating: 4,
        price: 55,
      },
    ],
  }

  const [editForm, setEditForm] = useState({
    name: property.name,
    description: property.description,
  })

  const handleSaveEdit = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoading(false)
    setShowEditModal(false)
    success('Propriété mise à jour')
  }

  const handleDelete = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoading(false)
    success('Propriété supprimée')
    navigate('/host/properties')
  }

  const handleSyncCalendar = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    success('Calendrier synchronisé')
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-surface-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-surface-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 font-display">
              {property.name}
            </h1>
            <p className="text-surface-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {property.address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Edit2} onClick={() => setShowEditModal(true)}>
            Modifier
          </Button>
          <Button variant="danger" icon={Trash2} onClick={() => setShowDeleteModal(true)}>
            Supprimer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Calendar}
          label="Total ménages"
          value={property.stats.totalCleanings}
        />
        <StatCard
          icon={Calendar}
          label="Ce mois"
          value={property.stats.thisMonth}
        />
        <StatCard
          icon={Euro}
          label="Coût moyen"
          value={formatCurrency(property.stats.avgPrice)}
        />
        <StatCard
          icon={Star}
          label="Note moyenne"
          value={`${property.stats.avgRating} ⭐`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Info */}
          <Card>
            <h2 className="text-lg font-semibold text-surface-900 mb-4">
              Informations
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                <Home className="w-5 h-5 text-accent-500" />
                <div>
                  <p className="text-sm text-surface-500">Type</p>
                  <p className="font-medium text-surface-900">{property.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                <Ruler className="w-5 h-5 text-accent-500" />
                <div>
                  <p className="text-sm text-surface-500">Surface</p>
                  <p className="font-medium text-surface-900">{property.surface}m²</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                <Home className="w-5 h-5 text-accent-500" />
                <div>
                  <p className="text-sm text-surface-500">Pièces</p>
                  <p className="font-medium text-surface-900">{property.rooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                <Bath className="w-5 h-5 text-accent-500" />
                <div>
                  <p className="text-sm text-surface-500">Salle de bain</p>
                  <p className="font-medium text-surface-900">{property.bathrooms}</p>
                </div>
              </div>
            </div>

            <p className="text-surface-600 mb-4">
              {property.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity} variant="default">{amenity}</Badge>
              ))}
            </div>
          </Card>

          {/* Upcoming Cleanings */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900">
                Ménages à venir
              </h2>
              <Button size="sm" icon={Plus} onClick={() => setShowBookModal(true)}>
                Planifier
              </Button>
            </div>

            {property.upcomingCleanings.length > 0 ? (
              <div className="space-y-3">
                {property.upcomingCleanings.map((cleaning) => (
                  <div
                    key={cleaning.id}
                    className="flex items-center justify-between p-4 bg-surface-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-accent-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-surface-900">
                          {formatDate(cleaning.date, { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <p className="text-sm text-surface-500">
                          {cleaning.time} • {cleaning.cleaner.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={cleaning.status} />
                      <p className="text-sm font-medium text-surface-900 mt-1">
                        {formatCurrency(cleaning.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-surface-500">
                <Calendar className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p>Aucun ménage planifié</p>
                <Button variant="primary" className="mt-4" onClick={() => setShowBookModal(true)}>
                  Planifier un ménage
                </Button>
              </div>
            )}
          </Card>

          {/* Past Cleanings */}
          <Card>
            <h2 className="text-lg font-semibold text-surface-900 mb-4">
              Historique
            </h2>

            <div className="space-y-3">
              {property.pastCleanings.map((cleaning) => (
                <div
                  key={cleaning.id}
                  className="flex items-center justify-between p-4 bg-surface-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={cleaning.cleaner.name} size="md" />
                    <div>
                      <p className="font-medium text-surface-900">
                        {cleaning.cleaner.name}
                      </p>
                      <p className="text-sm text-surface-500">
                        {formatDate(cleaning.date, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: cleaning.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="font-medium text-surface-900">
                      {formatCurrency(cleaning.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Button 
                variant="accent" 
                fullWidth 
                icon={Plus}
                onClick={() => setShowBookModal(true)}
              >
                Réserver un ménage
              </Button>
              <Button variant="secondary" fullWidth icon={ExternalLink}>
                Voir sur Airbnb
              </Button>
            </div>
          </Card>

          {/* Calendar Sync */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4">
              Synchronisation
            </h3>
            
            {property.icalSynced ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-medium">Calendrier synchronisé</span>
                </div>
                <p className="text-sm text-surface-500 mb-4">
                  Dernière sync : {property.lastSync}
                </p>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  icon={RefreshCw}
                  onClick={handleSyncCalendar}
                  loading={loading}
                >
                  Resynchroniser
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-surface-500 mb-4">
                  Connectez votre calendrier Airbnb pour planifier automatiquement les ménages.
                </p>
                <Button variant="primary" fullWidth>
                  Connecter le calendrier
                </Button>
              </>
            )}
          </Card>

          {/* Pricing */}
          <Card className="bg-accent-50 border-accent-200">
            <h3 className="font-semibold text-surface-900 mb-2">
              Tarif ménage
            </h3>
            <p className="text-3xl font-bold text-accent-600 mb-2">
              {formatCurrency(55)}
            </p>
            <p className="text-sm text-surface-500">
              Basé sur {property.surface}m² • {property.type}
            </p>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier le bien"
      >
        <div className="space-y-4">
          <Input
            label="Nom du bien"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <Textarea
            label="Description"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            rows={4}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} loading={loading} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer le bien"
      >
        <div className="space-y-4">
          <p className="text-surface-600">
            Êtes-vous sûr de vouloir supprimer <strong>{property.name}</strong> ?
          </p>
          <p className="text-sm text-red-600">
            Cette action est irréversible. Tous les ménages planifiés seront annulés.
          </p>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={loading}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Book Modal */}
      <Modal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        title="Planifier un ménage"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-surface-600">
            Sélectionnez une date et un créneau pour planifier un ménage.
          </p>
          <Input
            label="Date"
            type="date"
          />
          <Input
            label="Heure"
            type="time"
          />
          <div className="p-4 bg-surface-50 rounded-xl">
            <p className="text-sm text-surface-500">Tarif estimé</p>
            <p className="text-2xl font-bold text-surface-900">{formatCurrency(55)}</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowBookModal(false)}>
              Annuler
            </Button>
            <Button className="flex-1" onClick={() => {
              setShowBookModal(false)
              success('Demande de ménage envoyée')
            }}>
              Confirmer la réservation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PropertyDetail
