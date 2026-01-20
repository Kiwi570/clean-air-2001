import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Calendar, Clock, Euro, Home, User, 
  Phone, MessageSquare, CheckCircle, X, Star, Play,
  Ruler, AlertCircle, Sparkles, CheckSquare, Square, Send,
  PartyPopper
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { Timeline } from '@/components/ui/Timeline'
import { ModeIndicator } from '@/components/ui/ModeBadge'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useAuth } from '@/hooks/useAuth'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useToast } from '@/hooks/useToast'
import { CLEANER_STATUS_LABELS, ONBOARDING_ACTIONS } from '@/lib/constants'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

// ============================================
// MISSION DETAIL - Page détail mission côté Cleaner
// ============================================

function MissionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [checklist, setChecklist] = useState({
    menage: true,
    aeration: true,
    photos: false,
  })

  const { user, getCurrentCleanerId } = useAuth()
  const { 
    getMissionById, 
    applyToMission,
    cancelApplication,
    startMission,
    completeMission,
  } = useMissions()
  const { markActionComplete } = useOnboarding()
  const { success, error, info } = useToast()

  const mission = getMissionById(id)
  const cleanerId = getCurrentCleanerId()
  const isMyMission = mission?.cleanerId === cleanerId

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  // Confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  // Si mission non trouvée
  if (!isLoading && !mission) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Link 
          to="/cleaner/missions"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux missions
        </Link>
        
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Mission introuvable</h2>
          <p className="text-slate-500 mb-6">Cette mission n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/cleaner/missions')}>
            Voir les missions disponibles
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
      variant: 'info',
      color: 'bg-sky-100 text-sky-700',
      icon: Sparkles,
    },
    [MISSION_STATUS.APPLIED]: { 
      variant: 'warning',
      color: 'bg-amber-100 text-amber-700',
      icon: Send,
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

  const handleApply = () => {
    applyToMission(mission.id, {
      id: cleanerId,
      name: user.fullName,
      avatar: user.avatar,
    })
    setShowApplyModal(false)
    success('Candidature envoyée ! 🚀')
  }

  const handleCancelApplication = () => {
    cancelApplication(mission.id)
    info('Candidature annulée')
  }

  const handleStart = () => {
    startMission(mission.id)
    markActionComplete(ONBOARDING_ACTIONS.STARTED_MISSION)
    success('Mission démarrée ! Bon courage 💪')
  }

  const handleComplete = () => {
    completeMission(mission.id)
    markActionComplete(ONBOARDING_ACTIONS.COMPLETED_MISSION)
    setShowCompleteModal(false)
    triggerConfetti()
    success(`Mission terminée ! +${formatCurrency(mission.price)} 🎉`)
  }

  const toggleChecklistItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const canComplete = checklist.menage && checklist.aeration

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/cleaner/missions"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux missions
        </Link>
        
        <Badge variant={currentStatus.variant} size="lg" className="flex items-center gap-1.5">
          <StatusIcon className="w-4 h-4" />
          {CLEANER_STATUS_LABELS[mission.status]}
        </Badge>
      </div>

      {/* Bloc Prochaine Action - CTA unique par état */}
      {mission.status === MISSION_STATUS.CONFIRMED && isMyMission && (
        <Card className="border-2 border-teal-300 bg-gradient-to-r from-teal-50 to-green-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="font-semibold text-teal-900">Mission confirmée !</p>
                <p className="text-sm text-teal-700">Prêt pour {formatDate(mission.date)} à {mission.time}</p>
              </div>
            </div>
            <Button 
              onClick={handleStart}
              className="bg-gradient-to-r from-teal-500 to-green-500"
              icon={Play}
            >
              Démarrer la mission
            </Button>
          </div>
        </Card>
      )}

      {mission.status === MISSION_STATUS.IN_PROGRESS && isMyMission && (
        <Card className="border-2 border-sky-300 bg-gradient-to-r from-sky-50 to-indigo-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center animate-pulse">
                  <Play className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="font-semibold text-sky-900">Vous êtes en intervention</p>
                  <p className="text-sm text-sky-700">Depuis {Math.floor((Date.now() - mission.startedAt) / 60000)} min</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Avancement</p>
                <p className="font-bold text-sky-600">{Object.values(checklist).filter(Boolean).length}/3</p>
              </div>
            </div>
            
            {/* Barre de progression visuelle */}
            <div className="w-full h-2 bg-slate-200 rounded-full mb-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${(Object.values(checklist).filter(Boolean).length / 3) * 100}%` }}
              />
            </div>
            
            {/* Micro-texte de progression - voix valorisante */}
            <p className="text-xs text-center text-sky-600 mb-3 font-medium">
              {Object.values(checklist).filter(Boolean).length === 0 && "Cochez chaque étape terminée"}
              {Object.values(checklist).filter(Boolean).length === 1 && "Bien ! Plus qu'une étape obligatoire"}
              {Object.values(checklist).filter(Boolean).length === 2 && canComplete ? "Tout est prêt, bien joué 👌" : Object.values(checklist).filter(Boolean).length === 2 && "Cochez Ménage et Aération pour continuer"}
              {Object.values(checklist).filter(Boolean).length === 3 && "Parfait ! Vous pouvez terminer 🎉"}
            </p>
            
            {/* Mini checklist inline - titre "Avant de terminer" */}
            <p className="text-xs text-center text-slate-500 mb-2 font-medium uppercase tracking-wide">Avant de terminer</p>
            <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-white/60 rounded-xl">
              <label 
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-sky-100 px-2 py-1 rounded-lg transition-colors"
                onClick={() => toggleChecklistItem('menage')}
              >
                {checklist.menage ? (
                  <CheckSquare className="w-5 h-5 text-teal-500" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300" />
                )}
                <span className={checklist.menage ? 'text-teal-700 font-medium' : 'text-slate-500'}>Ménage</span>
              </label>
              <label 
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-sky-100 px-2 py-1 rounded-lg transition-colors"
                onClick={() => toggleChecklistItem('aeration')}
              >
                {checklist.aeration ? (
                  <CheckSquare className="w-5 h-5 text-teal-500" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300" />
                )}
                <span className={checklist.aeration ? 'text-teal-700 font-medium' : 'text-slate-500'}>Aération</span>
              </label>
              <label 
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-sky-100 px-2 py-1 rounded-lg transition-colors"
                onClick={() => toggleChecklistItem('photos')}
              >
                {checklist.photos ? (
                  <CheckSquare className="w-5 h-5 text-teal-500" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300" />
                )}
                <span className={checklist.photos ? 'text-teal-700 font-medium' : 'text-slate-400'}>Photos (opt.)</span>
              </label>
            </div>

            <Button 
              fullWidth
              onClick={() => setShowCompleteModal(true)}
              disabled={!canComplete}
              className={cn(
                canComplete 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500' 
                  : 'opacity-50 cursor-not-allowed bg-slate-300'
              )}
              icon={CheckCircle}
            >
              {canComplete ? "C'est terminé !" : 'Complétez la checklist'}
            </Button>
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
              {mission.status === MISSION_STATUS.PENDING && (
                <div className="absolute top-4 right-4">
                  <Badge variant="info" size="sm" className="bg-sky-500 text-white border-0">
                    ✨ Disponible
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Mission Details */}
              <div className="grid sm:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-sky-500" />
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
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <Euro className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600">Rémunération</p>
                    <p className="font-bold text-green-700">{formatCurrency(mission.price)}</p>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-6">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-sky-600" />
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
                    Instructions de l'hôte
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
                <Clock className="w-5 h-5 text-sky-500" />
                Historique
              </h2>
              <Timeline events={mission.timeline || []} />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Host Card */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Hôte</h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar 
                  src={mission.hostAvatar}
                  name={mission.hostName}
                  size="lg"
                />
                <div>
                  <p className="font-semibold text-slate-900">{mission.hostName}</p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>4.9</span>
                    <span className="text-slate-300">•</span>
                    <span>3 biens</span>
                  </div>
                </div>
              </div>

              {isMyMission && (
                <Button 
                  fullWidth 
                  variant="secondary"
                  icon={MessageSquare}
                  onClick={() => navigate('/cleaner/messages')}
                >
                  Contacter l'hôte
                </Button>
              )}
            </div>
          </Card>

          {/* Actions Card */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>

              {/* PENDING - Can apply */}
              {mission.status === MISSION_STATUS.PENDING && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 mb-4">
                    Cette mission est disponible. Postulez pour être sélectionné !
                  </p>
                  <Button 
                    fullWidth 
                    icon={Send}
                    onClick={() => setShowApplyModal(true)}
                    className="bg-gradient-to-r from-sky-500 to-indigo-500"
                  >
                    Postuler à cette mission
                  </Button>
                </div>
              )}

              {/* APPLIED - Waiting for confirmation */}
              {mission.status === MISSION_STATUS.APPLIED && isMyMission && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-xl text-center">
                    <Send className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                    <p className="text-sm font-medium text-amber-900">Candidature envoyée</p>
                    <p className="text-xs text-amber-700">En attente de réponse de l'hôte</p>
                  </div>
                  <Button 
                    fullWidth 
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={handleCancelApplication}
                  >
                    Annuler ma candidature
                  </Button>
                </div>
              )}

              {/* CONFIRMED - Can start */}
              {mission.status === MISSION_STATUS.CONFIRMED && isMyMission && (
                <div className="space-y-3">
                  <div className="p-3 bg-teal-50 rounded-xl text-center">
                    <CheckCircle className="w-6 h-6 text-teal-500 mx-auto mb-1" />
                    <p className="text-sm font-medium text-teal-900">Vous êtes confirmé !</p>
                    <p className="text-xs text-teal-700 mt-1">⬆️ Démarrez via le bouton ci-dessus</p>
                  </div>
                </div>
              )}

              {/* IN_PROGRESS - Can complete */}
              {mission.status === MISSION_STATUS.IN_PROGRESS && isMyMission && (
                <div className="p-3 bg-sky-50 rounded-xl text-center">
                  <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                    <Play className="w-4 h-4 text-sky-600" />
                  </div>
                  <p className="text-sm font-medium text-sky-900">Mission en cours</p>
                  <p className="text-xs text-sky-700 mt-1">⬆️ Complétez la checklist ci-dessus</p>
                </div>
              )}

              {/* COMPLETED - Waiting for rating */}
              {mission.status === MISSION_STATUS.COMPLETED && isMyMission && (
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <PartyPopper className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">Mission terminée !</p>
                  <p className="text-2xl font-bold text-green-700 my-2">
                    +{formatCurrency(mission.price)}
                  </p>
                  <p className="text-sm text-green-700">
                    En attente de l'avis de l'hôte
                  </p>
                </div>
              )}

              {/* RATED - Show review */}
              {mission.status === MISSION_STATUS.RATED && isMyMission && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={cn(
                            'w-6 h-6',
                            i < mission.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          )}
                        />
                      ))}
                    </div>
                    {mission.review && (
                      <p className="text-sm text-amber-900 italic mb-2">"{mission.review}"</p>
                    )}
                    <p className="text-xs text-amber-700">— {mission.hostName}</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-xl text-center">
                    <p className="text-sm font-medium text-green-900">Paiement reçu</p>
                    <p className="text-xl font-bold text-green-700">+{formatCurrency(mission.price)}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Messages liés - Lien mental */}
          {isMyMission && mission.status !== MISSION_STATUS.PENDING && (
            <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
              <div className="p-5">
                <h3 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-500" />
                  Messages liés
                </h3>
                <p className="text-sm text-violet-700 mb-4">
                  Discutez avec {mission.hostName} concernant cette mission.
                </p>
                <Button 
                  fullWidth 
                  variant="secondary"
                  icon={MessageSquare}
                  onClick={() => navigate('/cleaner/messages')}
                  className="border-violet-300 hover:bg-violet-100"
                >
                  Ouvrir la conversation
                </Button>
              </div>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white border-0">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">💡 Astuce pro</h4>
                  <p className="text-sm text-white/80">
                    {mission.status === MISSION_STATUS.PENDING && "Les cleaners réactifs sont toujours privilégiés. Postulez tôt !"}
                    {mission.status === MISSION_STATUS.APPLIED && "Votre candidature est en cours d'examen. L'hôte apprécie la ponctualité."}
                    {mission.status === MISSION_STATUS.CONFIRMED && "Relisez bien les instructions et l'adresse avant d'y aller. Vous êtes prêt !"}
                    {mission.status === MISSION_STATUS.IN_PROGRESS && "Prendre des photos avant/après est un vrai plus pour votre profil."}
                    {mission.status === MISSION_STATUS.COMPLETED && "Bien joué ! Votre paiement arrive dès que l'hôte valide."}
                    {mission.status === MISSION_STATUS.RATED && "Super travail ! Chaque bonne note vous rapproche du statut Top Cleaner ⭐"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Postuler à cette mission"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <img 
              src={mission.propertyImage}
              alt={mission.propertyName}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <p className="font-semibold text-slate-900">{mission.propertyName}</p>
              <p className="text-sm text-slate-500">
                {formatDate(mission.date)} à {mission.time}
              </p>
              <p className="text-lg font-bold text-green-600 mt-1">
                {formatCurrency(mission.price)}
              </p>
            </div>
          </div>
          
          <p className="text-slate-600 text-sm">
            En postulant, vous vous engagez à être disponible à la date et l'heure indiquées.
            L'hôte recevra votre candidature et pourra vous sélectionner.
          </p>
          
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => setShowApplyModal(false)}
            >
              Annuler
            </Button>
            <Button 
              fullWidth
              icon={Send}
              onClick={handleApply}
              className="bg-gradient-to-r from-sky-500 to-indigo-500"
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Terminer la mission"
      >
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-xl text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-green-900">Tout est prêt ?</p>
            <p className="text-sm text-green-700">
              En confirmant, la mission sera marquée comme terminée.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-sm font-medium text-slate-700 mb-2">Récapitulatif :</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Ménage complet effectué
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Aération faite
              </li>
              {checklist.photos && (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Photos prises
                </li>
              )}
            </ul>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl">
            <p className="text-sm text-amber-800">
              💰 Vous recevrez <strong>{formatCurrency(mission.price)}</strong> après validation par l'hôte.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => setShowCompleteModal(false)}
            >
              Pas encore
            </Button>
            <Button 
              fullWidth
              icon={CheckCircle}
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-500 to-teal-500"
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MissionDetail
