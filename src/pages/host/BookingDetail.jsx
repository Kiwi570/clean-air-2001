import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Calendar, Clock, Euro, Home, User, 
  Phone, MessageSquare, CheckCircle, X, Star, Play,
  Ruler, AlertCircle, Sparkles, Edit, XCircle
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { Timeline } from '@/components/ui/Timeline'
import { RateMissionModal } from '@/components/ui/RateMissionModal'
import { ModeIndicator } from '@/components/ui/ModeBadge'
import { PersonaBridgeCompact, LoopCompleted } from '@/components/ui/PersonaBridge'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { HOST_STATUS_LABELS } from '@/lib/constants'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

// ============================================
// BOOKING DETAIL - Page détail réservation côté Hôte
// ============================================

function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [showRateModal, setShowRateModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const { 
    getMissionById, 
    confirmMission,
    rejectCleaner,
  } = useMissions()
  const { notifyMissionConfirmed, notifyMissionRejected } = useNotifications()
  const { success, error, info } = useToast()

  const mission = getMissionById(id)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  // Si mission non trouvée
  if (!isLoading && !mission) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Link 
          to="/host/bookings"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux réservations
        </Link>
        
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Réservation introuvable</h2>
          <p className="text-slate-500 mb-6">Cette réservation n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/host/bookings')}>
            Voir mes réservations
          </Button>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  // Configuration des statuts
  const statusConfig = {
    [MISSION_STATUS.PENDING]: { 
      variant: 'secondary',
      color: 'bg-slate-100 text-slate-700',
      icon: Clock,
    },
    [MISSION_STATUS.APPLIED]: { 
      variant: 'warning',
      color: 'bg-amber-100 text-amber-700',
      icon: User,
    },
    [MISSION_STATUS.CONFIRMED]: { 
      variant: 'success',
      color: 'bg-teal-100 text-teal-700',
      icon: CheckCircle,
    },
    [MISSION_STATUS.IN_PROGRESS]: { 
      variant: 'info',
      color: 'bg-sky-100 text-sky-700',
      icon: Play,
    },
    [MISSION_STATUS.COMPLETED]: { 
      variant: 'success',
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle,
    },
    [MISSION_STATUS.RATED]: { 
      variant: 'success',
      color: 'bg-green-100 text-green-700',
      icon: Star,
    },
  }

  const currentStatus = statusConfig[mission.status] || statusConfig[MISSION_STATUS.PENDING]
  const StatusIcon = currentStatus.icon

  const handleConfirm = () => {
    confirmMission(mission.id)
    notifyMissionConfirmed(mission)
    success(`${mission.cleanerName} a été confirmé ! ✅`)
  }

  const handleReject = () => {
    rejectCleaner(mission.id)
    notifyMissionRejected(mission)
    error(`Candidature de ${mission.cleanerName} refusée`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/host/bookings"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux réservations
        </Link>
        
        <Badge variant={currentStatus.variant} size="lg" className="flex items-center gap-1.5">
          <StatusIcon className="w-4 h-4" />
          {HOST_STATUS_LABELS[mission.status]}
        </Badge>
      </div>

      {/* Bloc Prochaine Action - CTA unique par état */}
      {mission.status === MISSION_STATUS.COMPLETED && (
        <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">Le ménage est terminé !</p>
                <p className="text-sm text-amber-700">Donnez votre avis sur le travail de {mission.cleanerName}</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowRateModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500"
              icon={Star}
            >
              Donner mon avis
            </Button>
          </div>
        </Card>
      )}

      {mission.status === MISSION_STATUS.IN_PROGRESS && (
        <Card className="border-2 border-sky-300 bg-gradient-to-r from-sky-50 to-indigo-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center animate-pulse">
                <Play className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <p className="font-semibold text-sky-900">{mission.cleanerName} est sur place</p>
                <p className="text-sm text-sky-700">On vous prévient dès que c'est terminé</p>
              </div>
            </div>
            <Button 
              variant="secondary"
              onClick={() => navigate('/host/messages')}
              icon={MessageSquare}
            >
              Contacter
            </Button>
          </div>
        </Card>
      )}

      {mission.status === MISSION_STATUS.APPLIED && (
        <Card className="border-2 border-teal-300 bg-gradient-to-r from-teal-50 to-green-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={mission.cleanerAvatar} name={mission.cleanerName} size="md" />
              <div>
                <p className="font-semibold text-teal-900">{mission.cleanerName} souhaite intervenir</p>
                <p className="text-sm text-teal-700">Consultez son profil avant d'accepter</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost"
                onClick={handleReject}
                className="text-slate-500 hover:text-red-600"
              >
                Refuser
              </Button>
              <Button 
                onClick={handleConfirm}
                className="bg-gradient-to-r from-teal-500 to-green-500"
                icon={CheckCircle}
              >
                Accepter
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Card */}
          <Card className="overflow-hidden">
            <div className="relative h-48 sm:h-64">
              <img 
                src={mission.propertyImage}
                alt={mission.propertyName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl font-bold text-white mb-1">
                  {mission.propertyName}
                </h1>
                <p className="text-white/80 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {mission.propertyAddress}
                </p>
              </div>
              {mission.bookingMode === 'instant' && (
                <div className="absolute top-4 right-4">
                  <Badge variant="info" size="sm" className="bg-sky-500 text-white border-0">
                    ⚡ Instantané
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Mission Details */}
              <div className="grid sm:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="font-medium text-slate-900">{formatDate(mission.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Clock className="w-5 h-5 text-sky-500" />
                  <div>
                    <p className="text-xs text-slate-500">Heure</p>
                    <p className="font-medium text-slate-900">{mission.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Clock className="w-5 h-5 text-violet-500" />
                  <div>
                    <p className="text-xs text-slate-500">Durée</p>
                    <p className="font-medium text-slate-900">{mission.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                  <Euro className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-xs text-teal-600">Prix</p>
                    <p className="font-bold text-teal-700">{formatCurrency(mission.price)}</p>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{mission.propertyType}</p>
                  <p className="text-sm text-slate-500">{mission.propertySurface}m²</p>
                </div>
              </div>

              {/* Instructions */}
              {mission.instructions && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <h3 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Instructions spéciales
                  </h3>
                  <p className="text-sm text-amber-800">{mission.instructions}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline Card */}
          <Card>
            <div className="p-6">
              <h2 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-500" />
                Historique
              </h2>
              <Timeline events={mission.timeline || []} />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cleaner Card */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                {mission.cleanerId ? 'Cleaner assigné' : 'En attente d\'un cleaner'}
              </h3>

              {mission.cleanerId ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar 
                      src={mission.cleanerAvatar}
                      name={mission.cleanerName}
                      size="lg"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{mission.cleanerName}</p>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>4.9</span>
                        <span className="text-slate-300">•</span>
                        <span>47 missions</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions selon status - simplifiées car CTA principal en haut */}
                  {mission.status === MISSION_STATUS.APPLIED && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-sm text-amber-600 text-center">
                        ⬆️ Confirmez ou refusez ci-dessus
                      </p>
                    </div>
                  )}

                  {mission.status === MISSION_STATUS.CONFIRMED && (
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <div className="p-3 bg-teal-50 rounded-xl text-center">
                        <CheckCircle className="w-6 h-6 text-teal-500 mx-auto mb-1" />
                        <p className="text-sm font-medium text-teal-900">Confirmé !</p>
                        <p className="text-xs text-teal-700">En attente du jour J</p>
                      </div>
                      
                      {/* P0: Pont persona - Guide vers la vue Cleaner */}
                      <PersonaBridgeCompact 
                        cleanerName={mission.cleanerName}
                        cleanerAvatar={mission.cleanerAvatar}
                        onSwitchPersona={() => {
                          info(`Sélectionnez "${mission.cleanerName}" dans le DevSwitcher`)
                        }}
                      />
                      
                      <Button 
                        fullWidth 
                        variant="secondary"
                        icon={MessageSquare}
                        onClick={() => navigate('/host/messages')}
                      >
                        Contacter
                      </Button>
                    </div>
                  )}

                  {mission.status === MISSION_STATUS.IN_PROGRESS && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="p-3 bg-sky-50 rounded-xl text-center">
                        <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                          <Play className="w-4 h-4 text-sky-600" />
                        </div>
                        <p className="text-sm font-medium text-sky-900">Ménage en cours</p>
                        <p className="text-xs text-sky-700 mt-1">Vous serez notifié à la fin</p>
                      </div>
                    </div>
                  )}

                  {mission.status === MISSION_STATUS.COMPLETED && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="p-3 bg-amber-50 rounded-xl text-center">
                        <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                        <p className="text-sm font-medium text-amber-900">En attente de votre avis</p>
                        <p className="text-xs text-amber-700 mt-1">⬆️ Notez le ménage ci-dessus</p>
                      </div>
                    </div>
                  )}

                  {mission.status === MISSION_STATUS.RATED && (
                    <div className="pt-4 border-t border-slate-100">
                      {/* P2: Boucle complétée avec célébration */}
                      <LoopCompleted 
                        onRebook={() => navigate('/host/bookings')}
                      />
                      
                      {/* Note donnée */}
                      <div className="p-4 bg-white border border-green-200 rounded-xl text-center mt-4">
                        <p className="text-xs text-slate-500 mb-2">Votre note</p>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={cn(
                                'w-5 h-5',
                                i < mission.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              )}
                            />
                          ))}
                        </div>
                        {mission.review && (
                          <p className="text-sm text-slate-600 italic">"{mission.review}"</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">
                    {mission.bookingMode === 'instant' 
                      ? 'Aucun cleaner sélectionné'
                      : 'En attente de candidatures'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Actions Card */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <Button 
                  fullWidth 
                  variant="secondary"
                  icon={Edit}
                  onClick={() => info('Modification disponible prochainement')}
                >
                  Modifier la réservation
                </Button>
                <Button 
                  fullWidth 
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  icon={X}
                  onClick={() => setShowCancelModal(true)}
                >
                  Annuler la réservation
                </Button>
              </div>
            </div>
          </Card>

          {/* Messages liés - Lien mental */}
          {mission.cleanerId && (
            <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
              <div className="p-5">
                <h3 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-500" />
                  Messages liés
                </h3>
                <p className="text-sm text-violet-700 mb-4">
                  Discutez avec {mission.cleanerName} concernant cette réservation.
                </p>
                <Button 
                  fullWidth 
                  variant="secondary"
                  icon={MessageSquare}
                  onClick={() => navigate('/host/messages')}
                  className="border-violet-300 hover:bg-violet-100"
                >
                  Ouvrir la conversation
                </Button>
              </div>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-gradient-to-br from-teal-500 to-sky-500 text-white border-0">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">💡 Le saviez-vous ?</h4>
                  <p className="text-sm text-white/80">
                    {mission.status === MISSION_STATUS.PENDING && "Les meilleurs cleaners répondent en quelques heures. On vous prévient dès qu'il y a une candidature !"}
                    {mission.status === MISSION_STATUS.APPLIED && "Jetez un œil au profil et aux avis avant d'accepter. Votre tranquillité d'esprit compte."}
                    {mission.status === MISSION_STATUS.CONFIRMED && "Tout est calé ! Vous pouvez contacter le cleaner si vous avez des questions."}
                    {mission.status === MISSION_STATUS.IN_PROGRESS && "Votre cleaner est sur place. Détendez-vous, on vous prévient dès que c'est fini."}
                    {mission.status === MISSION_STATUS.COMPLETED && "Votre avis aide les autres hôtes et encourage les bons cleaners. Merci de contribuer !"}
                    {mission.status === MISSION_STATUS.RATED && "Cette mission est terminée. Vous pouvez facilement retravailler avec ce cleaner."}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Rate Modal */}
      <RateMissionModal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        mission={mission}
      />

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Annuler la réservation"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => setShowCancelModal(false)}
            >
              Non, garder
            </Button>
            <Button 
              fullWidth
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                setShowCancelModal(false)
                info('Annulation disponible prochainement')
              }}
            >
              Oui, annuler
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BookingDetail
