import { useState } from 'react'
import { Calendar, Clock, Euro, FileText, MapPin, Sparkles, Star, Zap, Award, Clock3, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useMissions } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { useConfetti } from '@/hooks/useConfetti'
import { useOnboarding } from '@/hooks/useOnboarding'
import { cn } from '@/lib/utils'
import { DEMO_CLEANERS, ONBOARDING_ACTIONS } from '@/lib/constants'

// ============================================
// CREATE MISSION MODAL V2 - Avec choix de 3 cleaners
// ============================================

// Properties disponibles (mock)
const properties = [
  {
    id: 'prop-1',
    name: 'Studio Marais',
    address: '15 Rue des Archives, Paris 4e',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    type: 'Studio',
    surface: 25,
    suggestedPrice: 55,
    suggestedDuration: '2h',
  },
  {
    id: 'prop-2',
    name: 'Appartement Bastille',
    address: '42 Rue de la Roquette, Paris 11e',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    type: 'T2',
    surface: 45,
    suggestedPrice: 72,
    suggestedDuration: '3h',
  },
  {
    id: 'prop-3',
    name: 'Loft Oberkampf',
    address: '25 Rue Oberkampf, Paris 11e',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
    type: 'Loft',
    surface: 80,
    suggestedPrice: 95,
    suggestedDuration: '4h',
  },
]

// Badge component for cleaners
function CleanerBadge({ badge, badgeLabel, badgeColor }) {
  const colors = {
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-200',
    sky: 'bg-sky-100 text-sky-700 border-sky-200',
  }

  const icons = {
    top: <Award className="w-3 h-3" />,
    verified: <CheckCircle className="w-3 h-3" />,
    new: <Sparkles className="w-3 h-3" />,
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
      colors[badgeColor]
    )}>
      {icons[badge]}
      {badgeLabel}
    </span>
  )
}

// Cleaner Card Component
function CleanerCard({ cleaner, basePrice, isSelected, onSelect, isLoading }) {
  const price = Math.round(basePrice * cleaner.priceModifier)
  const priceDiff = cleaner.priceModifier > 1 
    ? `+${Math.round((cleaner.priceModifier - 1) * 100)}%` 
    : cleaner.priceModifier < 1 
      ? `-${Math.round((1 - cleaner.priceModifier) * 100)}%`
      : null

  return (
    <button
      onClick={() => onSelect(cleaner)}
      disabled={isLoading}
      className={cn(
        'w-full text-left p-4 rounded-2xl border-2 transition-all duration-300',
        isSelected
          ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-500/20 scale-[1.02]'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md',
        isLoading && 'opacity-50 cursor-wait'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={cleaner.avatar}
            alt={cleaner.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          {cleaner.badge === 'top' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-900">{cleaner.name}</h4>
            <CleanerBadge 
              badge={cleaner.badge} 
              badgeLabel={cleaner.badgeLabel} 
              badgeColor={cleaner.badgeColor} 
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-medium">{cleaner.rating}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span>{cleaner.reviews} avis</span>
            <span className="text-slate-300">•</span>
            <span>{cleaner.missions} missions</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <Clock3 className="w-3.5 h-3.5" />
            <span>Répond généralement en {cleaner.responseTime}</span>
          </div>

          <p className="text-sm text-slate-500 line-clamp-2">
            {cleaner.bio}
          </p>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-teal-600">{price}€</p>
          {priceDiff && (
            <p className={cn(
              'text-xs font-medium',
              cleaner.priceModifier > 1 ? 'text-amber-600' : 'text-green-600'
            )}>
              {priceDiff}
            </p>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-teal-200 flex items-center justify-between">
          <span className="text-sm font-medium text-teal-700">
            ✓ Sélectionné
          </span>
          <ChevronRight className="w-5 h-5 text-teal-500" />
        </div>
      )}
    </button>
  )
}

function CreateMissionModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [selectedCleaner, setSelectedCleaner] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00',
    duration: '2h',
    price: '',
    instructions: '',
  })
  const [loading, setLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const { createMission, confirmMission } = useMissions()
  const { notifyMissionCreated, notifyMissionConfirmed } = useNotifications()
  const { success: showSuccess, hostSuccess } = useToast()
  const { fire: fireConfetti } = useConfetti()
  const { markActionComplete } = useOnboarding()

  const handlePropertySelect = (property) => {
    setSelectedProperty(property)
    setFormData(prev => ({
      ...prev,
      price: property.suggestedPrice.toString(),
      duration: property.suggestedDuration,
    }))
  }

  const handleCleanerSelect = async (cleaner) => {
    setSelectedCleaner(cleaner)
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const finalPrice = Math.round(parseInt(formData.price) * cleaner.priceModifier)

    // Create the mission with cleaner already assigned
    const newMission = createMission({
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      propertyImage: selectedProperty.image,
      propertyAddress: selectedProperty.address,
      propertySurface: selectedProperty.surface,
      propertyType: selectedProperty.type,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      price: finalPrice,
      instructions: formData.instructions,
      // Pre-assign the cleaner
      cleanerId: cleaner.id,
      cleanerName: cleaner.name,
      cleanerAvatar: cleaner.avatar,
      instantBooking: true,
    })

    // Auto-confirm the mission
    setTimeout(() => {
      confirmMission(newMission.id)
    }, 100)

    // Mark onboarding actions as complete
    markActionComplete(ONBOARDING_ACTIONS.CREATED_MISSION)
    markActionComplete(ONBOARDING_ACTIONS.CONFIRMED_CLEANER)

    // Notify
    if (notifyMissionConfirmed) {
      notifyMissionConfirmed({
        ...newMission,
        cleanerName: cleaner.name,
      })
    }

    // Success state
    setBookingSuccess(true)
    fireConfetti()
    
    hostSuccess(`${cleaner.name} confirmé(e) pour ${selectedProperty.name} ! 🎉`)

    setLoading(false)

    // Wait a bit then close
    setTimeout(() => {
      if (onCreated) {
        onCreated(newMission)
      }
      resetAndClose()
    }, 2000)
  }

  const resetAndClose = () => {
    setStep(1)
    setSelectedProperty(null)
    setSelectedCleaner(null)
    setBookingSuccess(false)
    setFormData({
      date: '',
      time: '10:00',
      duration: '2h',
      price: '',
      instructions: '',
    })
    onClose()
  }

  // Get tomorrow's date as default minimum
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const stepTitles = {
    1: 'Choisir un bien',
    2: 'Planifier le ménage',
    3: 'Choisir votre cleaner',
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={stepTitles[step]}
      size={step === 3 ? 'xl' : 'lg'}
    >
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
              step >= s 
                ? 'bg-teal-500 text-white' 
                : 'bg-slate-100 text-slate-400'
            )}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={cn(
                'flex-1 h-1 rounded-full transition-all',
                step > s ? 'bg-teal-500' : 'bg-slate-100'
              )} />
            )}
          </div>
        ))}
      </div>

      {step === 1 ? (
        /* Step 1: Select Property */
        <div className="space-y-4">
          <p className="text-slate-500 mb-4">
            Sélectionnez le bien pour lequel vous souhaitez planifier un ménage.
          </p>

          <div className="grid gap-3">
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => handlePropertySelect(property)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                  selectedProperty?.id === property.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{property.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {property.address}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                      {property.type}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                      {property.surface}m²
                    </span>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-lg font-medium">
                      ~{property.suggestedPrice}€
                    </span>
                  </div>
                </div>
                {selectedProperty?.id === property.id && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={resetAndClose}>
              Annuler
            </Button>
            <Button 
              variant="accent" 
              onClick={() => setStep(2)}
              disabled={!selectedProperty}
            >
              Continuer
            </Button>
          </div>
        </div>
      ) : step === 2 ? (
        /* Step 2: Mission Details */
        <div className="space-y-5">
          {/* Selected Property Summary */}
          <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-2xl">
            <img
              src={selectedProperty.image}
              alt={selectedProperty.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-slate-900">{selectedProperty.name}</h3>
              <p className="text-sm text-slate-500">{selectedProperty.address}</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="ml-auto text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              Changer
            </button>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date du ménage
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Heure de début
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all appearance-none"
                >
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Durée estimée
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all appearance-none"
              >
                <option value="1h">1 heure</option>
                <option value="1h30">1h30</option>
                <option value="2h">2 heures</option>
                <option value="2h30">2h30</option>
                <option value="3h">3 heures</option>
                <option value="3h30">3h30</option>
                <option value="4h">4 heures</option>
                <option value="5h">5 heures</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Instructions spéciales (optionnel)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all resize-none"
                placeholder="Ex: Merci de bien aérer après le ménage, les draps sont dans le placard..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setStep(1)} icon={ArrowLeft}>
              Retour
            </Button>
            <Button 
              variant="accent" 
              onClick={() => setStep(3)}
              disabled={!formData.date}
              icon={ChevronRight}
              iconPosition="right"
            >
              Choisir un cleaner
            </Button>
          </div>
        </div>
      ) : (
        /* Step 3: Choose Cleaner */
        <div className="space-y-5">
          {/* Success State */}
          {bookingSuccess ? (
            <div className="py-12 text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Réservation confirmée ! 🎉
              </h3>
              <p className="text-slate-500 mb-4">
                {selectedCleaner?.name} s'occupera de votre ménage le{' '}
                {new Date(formData.date).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })} à {formData.time}
              </p>
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                <p className="text-sm font-medium text-sky-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Pour tester le parcours complet :
                </p>
                <ol className="text-sm text-sky-700 space-y-1 ml-6 list-decimal">
                  <li>Cliquez sur le <strong>bouton Démo</strong> en bas de l'écran</li>
                  <li>Passez côté <strong>Cleaner</strong></li>
                  <li>Sélectionnez <strong>{selectedCleaner?.name}</strong> dans le menu persona</li>
                </ol>
                <p className="text-xs text-sky-600 mt-2 italic">
                  → La mission apparaîtra dans "Confirmées"
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{selectedProperty.name}</h4>
                  <p className="text-sm text-slate-500">
                    {new Date(formData.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à {formData.time} • {formData.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">À partir de</p>
                  <p className="font-bold text-teal-600">{Math.round(parseInt(formData.price) * 0.9)}€</p>
                </div>
              </div>

              {/* Info Banner */}
              <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100">
                <Zap className="w-5 h-5 text-sky-500" />
                <p className="text-sm text-sky-700">
                  <strong>Réservation instantanée :</strong> Sélectionnez un cleaner et la mission sera confirmée immédiatement !
                </p>
              </div>

              {/* Cleaners List */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  3 cleaners disponibles pour cette mission :
                </p>
                {DEMO_CLEANERS.map((cleaner) => (
                  <CleanerCard
                    key={cleaner.id}
                    cleaner={cleaner}
                    basePrice={parseInt(formData.price)}
                    isSelected={selectedCleaner?.id === cleaner.id}
                    onSelect={handleCleanerSelect}
                    isLoading={loading}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
                <Button variant="secondary" onClick={() => setStep(2)} icon={ArrowLeft}>
                  Retour
                </Button>
                <p className="flex items-center text-sm text-slate-500">
                  👆 Cliquez sur un cleaner pour réserver
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}

export { CreateMissionModal }
export default CreateMissionModal
