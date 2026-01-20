import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, Home, MapPin, Ruler, ListChecks } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import { PROPERTY_TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils'

function AddProperty() {
  const navigate = useNavigate()
  const { success: showSuccess, error: showError } = useToast()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    type: 'studio',
    surface: '',
    rooms: '1',
    bathrooms: '1',
    description: '',
    amenities: [],
    icalUrl: '',
  })
  const [errors, setErrors] = useState({})

  const totalSteps = 3

  const amenitiesList = [
    { id: 'kitchen', label: 'Cuisine équipée' },
    { id: 'washing', label: 'Lave-linge' },
    { id: 'dryer', label: 'Sèche-linge' },
    { id: 'dishwasher', label: 'Lave-vaisselle' },
    { id: 'balcony', label: 'Balcon/Terrasse' },
    { id: 'parking', label: 'Parking' },
    { id: 'elevator', label: 'Ascenseur' },
    { id: 'ac', label: 'Climatisation' },
  ]

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const toggleAmenity = (id) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id]
    }))
  }

  const validateStep = () => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Nom requis'
      if (!formData.address.trim()) newErrors.address = 'Adresse requise'
      if (!formData.city.trim()) newErrors.city = 'Ville requise'
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis'
    }
    
    if (step === 2) {
      if (!formData.surface) newErrors.surface = 'Surface requise'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Bien ajouté avec succès !')
      navigate('/host/properties')
    } catch (error) {
      showError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => step > 1 ? setStep(prev => prev - 1) : navigate('/host/properties')}
          className="flex items-center gap-2 text-surface-600 hover:text-surface-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        
        <h1 className="text-2xl font-bold text-surface-900 font-display">
          Ajouter un bien
        </h1>
        <p className="text-surface-500 mt-1">
          Étape {step} sur {totalSteps}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
              step > s ? 'bg-accent-500 text-white' :
              step === s ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25' :
              'bg-surface-200 text-surface-500'
            )}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={cn(
                'flex-1 h-1 rounded-full transition-all',
                step > s ? 'bg-accent-500' : 'bg-surface-200'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h2 className="font-semibold text-surface-900">Informations générales</h2>
                <p className="text-sm text-surface-500">Décrivez votre bien</p>
              </div>
            </div>

            <Input
              label="Nom du bien"
              placeholder="Ex: Studio Marais, Appartement Vue Tour Eiffel..."
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
              hint="Ce nom vous aidera à identifier facilement votre bien"
            />

            <Input
              label="Adresse"
              placeholder="15 Rue des Archives"
              icon={MapPin}
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              error={errors.address}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ville"
                placeholder="Paris"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                error={errors.city}
              />
              <Input
                label="Code postal"
                placeholder="75004"
                value={formData.postalCode}
                onChange={(e) => updateField('postalCode', e.target.value)}
                error={errors.postalCode}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Ruler className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h2 className="font-semibold text-surface-900">Caractéristiques</h2>
                <p className="text-sm text-surface-500">Détails de votre bien</p>
              </div>
            </div>

            <Select
              label="Type de bien"
              options={PROPERTY_TYPES}
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Surface (m²)"
                type="number"
                placeholder="45"
                value={formData.surface}
                onChange={(e) => updateField('surface', e.target.value)}
                error={errors.surface}
              />
              <Input
                label="Pièces"
                type="number"
                placeholder="2"
                value={formData.rooms}
                onChange={(e) => updateField('rooms', e.target.value)}
              />
              <Input
                label="Salle(s) de bain"
                type="number"
                placeholder="1"
                value={formData.bathrooms}
                onChange={(e) => updateField('bathrooms', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">
                Équipements
              </label>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={cn(
                      'p-3 rounded-xl text-left text-sm font-medium transition-all',
                      formData.amenities.includes(amenity.id)
                        ? 'bg-accent-500 text-white'
                        : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                    )}
                  >
                    {amenity.label}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Description (optionnel)"
              placeholder="Informations complémentaires pour les cleaners..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <ListChecks className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h2 className="font-semibold text-surface-900">Synchronisation</h2>
                <p className="text-sm text-surface-500">Connectez votre calendrier (optionnel)</p>
              </div>
            </div>

            <div className="p-4 bg-surface-50 rounded-xl mb-4">
              <h3 className="font-medium text-surface-900 mb-2">
                📅 Synchronisation automatique
              </h3>
              <p className="text-sm text-surface-600">
                Connectez votre calendrier Airbnb ou Booking pour planifier automatiquement 
                les ménages entre chaque réservation.
              </p>
            </div>

            <Input
              label="Lien iCal Airbnb"
              placeholder="https://www.airbnb.com/calendar/ical/..."
              value={formData.icalUrl}
              onChange={(e) => updateField('icalUrl', e.target.value)}
              hint="Trouvez ce lien dans les paramètres de votre annonce Airbnb"
            />

            {/* Summary */}
            <div className="mt-8 p-4 bg-accent-50 rounded-xl">
              <h3 className="font-semibold text-surface-900 mb-3">Récapitulatif</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-600">Nom</span>
                  <span className="font-medium text-surface-900">{formData.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Adresse</span>
                  <span className="font-medium text-surface-900">
                    {formData.address ? `${formData.address}, ${formData.postalCode} ${formData.city}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Type</span>
                  <span className="font-medium text-surface-900">
                    {PROPERTY_TYPES.find(t => t.value === formData.type)?.label || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Surface</span>
                  <span className="font-medium text-surface-900">{formData.surface ? `${formData.surface}m²` : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-surface-100">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(prev => prev - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
          )}
          
          {step < totalSteps ? (
            <Button 
              fullWidth 
              onClick={handleNext}
              icon={ArrowRight}
              iconPosition="right"
            >
              Continuer
            </Button>
          ) : (
            <Button 
              fullWidth 
              onClick={handleSubmit}
              loading={loading}
              icon={CheckCircle}
            >
              Ajouter le bien
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AddProperty
