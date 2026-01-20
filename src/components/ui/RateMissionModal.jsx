import { useState } from 'react'
import { Star, CheckCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useMissions } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { useConfetti } from '@/hooks/useConfetti'
import { useOnboarding } from '@/hooks/useOnboarding'
import { cn } from '@/lib/utils'
import { ONBOARDING_ACTIONS } from '@/lib/constants'

function RateMissionModal({ isOpen, onClose, mission }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)

  const { rateMission } = useMissions()
  const { notifyMissionRated } = useNotifications()
  const { success: showSuccess } = useToast()
  const { trigger: triggerConfetti } = useConfetti()
  const { markActionComplete } = useOnboarding()

  const handleSubmit = async () => {
    if (rating === 0) return

    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    rateMission(mission.id, rating, review)
    notifyMissionRated(mission, rating)
    
    // Mark onboarding action as complete
    markActionComplete(ONBOARDING_ACTIONS.RATED_MISSION)

    triggerConfetti()
    showSuccess(`Merci pour votre avis ! ${mission.cleanerName} a été notifié. ⭐`)

    setLoading(false)
    resetAndClose()
  }

  const resetAndClose = () => {
    setRating(0)
    setHoveredRating(0)
    setReview('')
    onClose()
  }

  if (!mission) return null

  const displayRating = hoveredRating || rating

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Évaluer le ménage"
      size="md"
    >
      <div className="space-y-6">
        {/* Cleaner Info */}
        <div className="flex flex-col items-center text-center">
          <img
            src={mission.cleanerAvatar}
            alt={mission.cleanerName}
            className="w-20 h-20 rounded-full object-cover mb-3 ring-4 ring-surface-100"
          />
          <h3 className="font-semibold text-lg text-surface-900">{mission.cleanerName}</h3>
          <p className="text-surface-500 text-sm">
            {mission.propertyName} • {new Date(mission.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>

        {/* Rating Stars */}
        <div className="text-center">
          <p className="text-sm text-surface-600 mb-3">Comment s'est passé le ménage ?</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={cn(
                    'w-10 h-10 transition-colors',
                    star <= displayRating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-surface-300'
                  )}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm font-medium text-surface-700">
            {displayRating === 0 && 'Cliquez pour noter'}
            {displayRating === 1 && 'Très insatisfait 😞'}
            {displayRating === 2 && 'Insatisfait 😕'}
            {displayRating === 3 && 'Correct 😐'}
            {displayRating === 4 && 'Satisfait 😊'}
            {displayRating === 5 && 'Excellent ! 🤩'}
          </p>
        </div>

        {/* Review */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Laissez un commentaire (optionnel)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-accent-500 focus:bg-white transition-all resize-none"
            placeholder="Partagez votre expérience avec ce cleaner..."
          />
        </div>

        {/* Payment Info */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">Paiement sécurisé</p>
              <p className="text-sm text-green-700">Le paiement sera libéré au cleaner</p>
            </div>
          </div>
          <span className="text-xl font-bold text-green-700">{mission.price}€</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={resetAndClose} className="flex-1">
            Plus tard
          </Button>
          <Button 
            variant="accent" 
            onClick={handleSubmit}
            loading={loading}
            disabled={rating === 0}
            className="flex-1"
          >
            Valider et payer
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { RateMissionModal }
export default RateMissionModal
