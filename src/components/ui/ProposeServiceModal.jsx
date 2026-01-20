import { useState } from 'react'
import { Calendar, Clock, Euro, FileText, MapPin, Sparkles, Star, Home, ChevronRight, CheckCircle, ArrowLeft, Send, Zap, MessageCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useMissions } from '@/hooks/useMissions'
import { useMessages } from '@/hooks/useMessages'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { useConfetti } from '@/hooks/useConfetti'
import { useOnboarding } from '@/hooks/useOnboarding'
import { cn, formatCurrency } from '@/lib/utils'
import { ONBOARDING_ACTIONS } from '@/lib/constants'

// ============================================
// PROPOSE SERVICE MODAL V2 - Avec conversation
// ============================================

// Les 3 biens de Vincent
const VINCENT_PROPERTIES = [
  {
    id: 'prop-1',
    name: 'Studio Marais',
    address: '15 Rue des Archives, Paris 4e',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    type: 'Studio',
    surface: 25,
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    hostRating: 4.9,
    suggestedPrice: { min: 45, max: 65 },
    suggestedDuration: '2h',
  },
  {
    id: 'prop-2',
    name: 'Appartement Bastille',
    address: '42 Rue de la Roquette, Paris 11e',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    type: 'T2',
    surface: 45,
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    hostRating: 4.9,
    suggestedPrice: { min: 60, max: 85 },
    suggestedDuration: '3h',
  },
  {
    id: 'prop-3',
    name: 'Loft Oberkampf',
    address: '25 Rue Oberkampf, Paris 11e',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
    type: 'Loft',
    surface: 80,
    hostId: 'host-demo',
    hostName: 'Vincent Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    hostRating: 4.9,
    suggestedPrice: { min: 80, max: 110 },
    suggestedDuration: '4h',
  },
]

function ProposeServiceModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00',
    duration: '2h',
    price: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [proposalSuccess, setProposalSuccess] = useState(false)
  const [createdProposal, setCreatedProposal] = useState(null)

  const { user } = useAuth()
  const { proposeService } = useMissions()
  const { createConversation } = useMessages()
  const { notifyNewProposal } = useNotifications()
  const { cleanerSuccess } = useToast()
  const { fire: fireConfetti } = useConfetti()
  const { markActionComplete } = useOnboarding()

  const handlePropertySelect = (property) => {
    setSelectedProperty(property)
    setFormData(prev => ({
      ...prev,
      price: Math.round((property.suggestedPrice.min + property.suggestedPrice.max) / 2).toString(),
      duration: property.suggestedDuration,
    }))
  }

  const handleSubmitProposal = async () => {
    if (!selectedProperty || !formData.date || !formData.price) return

    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const cleanerData = {
      id: user?.id || 'cleaner-demo',
      name: user?.fullName || 'Paul D.',
      avatar: user?.avatar || 'https://randomuser.me/api/portraits/men/75.jpg',
    }

    const hostData = {
      id: selectedProperty.hostId,
      name: selectedProperty.hostName,
      avatar: selectedProperty.hostAvatar,
    }

    // 1. Créer la proposition/mission
    const proposal = proposeService(
      {
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        propertyImage: selectedProperty.image,
        propertyAddress: selectedProperty.address,
        propertySurface: selectedProperty.surface,
        propertyType: selectedProperty.type,
        hostId: hostData.id,
        hostName: hostData.name,
        hostAvatar: hostData.avatar,
      },
      cleanerData,
      {
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        price: parseInt(formData.price),
        instructions: formData.message,
      }
    )

    // 2. Créer la conversation avec message initial
    const defaultMessage = formData.message || 
      `Bonjour ${selectedProperty.hostName.split(' ')[0]} ! Je suis disponible le ${new Date(formData.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à ${formData.time} pour le ménage de votre ${selectedProperty.name}. Je suis professionnel et minutieux. Mon tarif : ${formData.price}€ pour ${formData.duration}. Au plaisir d'échanger avec vous !`

    const conversation = createConversation({
      missionId: proposal.id,
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      propertyImage: selectedProperty.image,
      host: hostData,
      cleaner: cleanerData,
      initialMessage: defaultMessage,
    })

    // Stocker le conversationId dans la mission
    proposal.conversationId = conversation.id

    // 3. Mark onboarding action
    markActionComplete(ONBOARDING_ACTIONS.APPLIED_MISSION)

    // 4. Notifier l'hôte
    if (notifyNewProposal) {
      notifyNewProposal(proposal)
    }

    // 5. Success state
    setCreatedProposal(proposal)
    setProposalSuccess(true)
    fireConfetti()
    
    cleanerSuccess(`Proposition envoyée à ${selectedProperty.hostName} ! 🚀`)

    setLoading(false)

    // Wait then close
    setTimeout(() => {
      if (onCreated) {
        onCreated(proposal)
      }
    }, 3000)
  }

  const resetAndClose = () => {
    setStep(1)
    setSelectedProperty(null)
    setProposalSuccess(false)
    setCreatedProposal(null)
    setFormData({
      date: '',
      time: '10:00',
      duration: '2h',
      price: '',
      message: '',
    })
    onClose()
  }

  // Get tomorrow's date as default minimum
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const stepTitles = {
    1: 'Choisir un bien de Vincent',
    2: 'Votre proposition',
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={proposalSuccess ? '🎉 Proposition envoyée !' : stepTitles[step]}
      size="lg"
    >
      {/* Progress indicator */}
      {!proposalSuccess && (
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                step >= s 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-slate-100 text-slate-400'
              )}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 2 && (
                <div className={cn(
                  'flex-1 h-1 rounded-full transition-all',
                  step > s ? 'bg-sky-500' : 'bg-slate-100'
                )} />
              )}
            </div>
          ))}
        </div>
      )}

      {proposalSuccess ? (
        /* Success State */
        <div className="py-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <Send className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Proposition envoyée !
          </h3>
          <p className="text-slate-500 mb-6">
            {selectedProperty?.hostName} a reçu votre message et peut maintenant vous répondre.
          </p>
          
          {/* Résumé */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-4">
              <img
                src={selectedProperty?.image}
                alt={selectedProperty?.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{selectedProperty?.name}</h4>
                <p className="text-sm text-slate-500">
                  {new Date(formData.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {formData.time}
                </p>
                <p className="text-sm font-medium text-sky-600">{formatCurrency(parseInt(formData.price))}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-sm">
              <Sparkles className="w-4 h-4" />
              Passez côté Hôte pour voir la demande de Paul !
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={resetAndClose}>
                Fermer
              </Button>
              <Button icon={MessageCircle} onClick={() => {
                resetAndClose()
                // Navigate to messages
                window.location.href = '/cleaner/messages'
              }}>
                Voir la conversation
              </Button>
            </div>
          </div>
        </div>
      ) : step === 1 ? (
        /* Step 1: Select Property */
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100 mb-4">
            <Zap className="w-5 h-5 text-sky-500 flex-shrink-0" />
            <p className="text-sm text-sky-700">
              <strong>Proposez vos services</strong> sur l'un des biens de Vincent. Il recevra votre message et pourra vous répondre !
            </p>
          </div>

          <div className="grid gap-3">
            {VINCENT_PROPERTIES.map((property) => (
              <button
                key={property.id}
                onClick={() => handlePropertySelect(property)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                  selectedProperty?.id === property.id
                    ? 'border-sky-500 bg-sky-50 shadow-lg'
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
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                      ~{property.suggestedDuration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <img 
                      src={property.hostAvatar} 
                      alt={property.hostName}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs text-slate-500">{property.hostName}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-600">{property.hostRating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Prix suggéré</p>
                  <p className="font-bold text-sky-600">
                    {property.suggestedPrice.min}-{property.suggestedPrice.max}€
                  </p>
                </div>
                {selectedProperty?.id === property.id && (
                  <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
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
              onClick={() => setStep(2)}
              disabled={!selectedProperty}
            >
              Continuer
            </Button>
          </div>
        </div>
      ) : (
        /* Step 2: Proposal Details */
        <div className="space-y-5">
          {/* Selected Property Summary */}
          <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-2xl">
            <img
              src={selectedProperty?.image}
              alt={selectedProperty?.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-slate-900">{selectedProperty?.name}</h3>
              <p className="text-sm text-slate-500">{selectedProperty?.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <img 
                  src={selectedProperty?.hostAvatar} 
                  alt={selectedProperty?.hostName}
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-xs text-slate-600">{selectedProperty?.hostName}</span>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="ml-auto text-sky-600 hover:text-sky-700 text-sm font-medium"
            >
              Changer
            </button>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date proposée *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
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
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none"
                >
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Durée estimée
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none"
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Votre tarif (€) *
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  min="20"
                  max="200"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                  placeholder="Ex: 55"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Suggéré: {selectedProperty?.suggestedPrice.min}-{selectedProperty?.suggestedPrice.max}€
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Message à {selectedProperty?.hostName.split(' ')[0]} (optionnel)
            </label>
            <div className="relative">
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all resize-none"
                placeholder={`Bonjour ${selectedProperty?.hostName.split(' ')[0]} ! Je suis disponible et motivé pour ce ménage. Je suis professionnel et minutieux...`}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Si vide, un message par défaut sera envoyé
            </p>
          </div>

          {/* Récap */}
          <div className="p-4 bg-gradient-to-r from-sky-50 to-teal-50 rounded-xl border border-sky-100">
            <h4 className="font-medium text-slate-900 mb-2">📋 Récapitulatif</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-slate-500">Bien :</div>
              <div className="font-medium text-slate-900">{selectedProperty?.name}</div>
              <div className="text-slate-500">Date :</div>
              <div className="font-medium text-slate-900">
                {formData.date ? new Date(formData.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : '-'}
              </div>
              <div className="text-slate-500">Horaire :</div>
              <div className="font-medium text-slate-900">{formData.time} • {formData.duration}</div>
              <div className="text-slate-500">Tarif proposé :</div>
              <div className="font-bold text-sky-600">{formData.price ? `${formData.price}€` : '-'}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setStep(1)} icon={ArrowLeft}>
              Retour
            </Button>
            <Button 
              onClick={handleSubmitProposal}
              disabled={!formData.date || !formData.price}
              loading={loading}
              icon={Send}
              className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
            >
              Envoyer à {selectedProperty?.hostName.split(' ')[0]}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export { ProposeServiceModal }
export default ProposeServiceModal
