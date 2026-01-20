import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft, CheckCircle, Home, Sparkles, Star, Zap, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useConfetti } from '@/hooks/useConfetti'
import { ROLES } from '@/lib/constants'
import { cn } from '@/lib/utils'

function Register() {
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') === 'cleaner' ? ROLES.CLEANER : ROLES.HOST
  
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(initialRole)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { register } = useAuth()
  const { error: showError, success: showSuccess, info: showInfo } = useToast()
  const { trigger: triggerConfetti } = useConfetti()

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis'
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis'
    if (!formData.email) newErrors.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.phone) newErrors.phone = 'Téléphone requis'
    if (!formData.password) newErrors.password = 'Mot de passe requis'
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 caractères'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return

    setLoading(true)
    try {
      const result = await register({ ...formData, role })
      if (result.success) {
        triggerConfetti()
        showSuccess('🎉 Compte créé avec succès ! Bienvenue sur CleanAir')
      } else {
        showError(result.error || "Erreur lors de l'inscription")
      }
    } catch (err) {
      showError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    {
      value: ROLES.HOST,
      label: 'Hôte',
      description: 'Je possède des locations',
      icon: Home,
      gradient: 'from-accent-500 to-accent-600',
      bgActive: 'bg-accent-50',
      borderActive: 'border-accent-500',
      shadowActive: 'shadow-accent-500/20',
      textActive: 'text-accent-700',
    },
    {
      value: ROLES.CLEANER,
      label: 'Cleaner',
      description: 'Je propose mes services',
      icon: Sparkles,
      gradient: 'from-brand-500 to-brand-600',
      bgActive: 'bg-brand-50',
      borderActive: 'border-brand-500',
      shadowActive: 'shadow-brand-500/20',
      textActive: 'text-brand-700',
    },
  ]

  const benefitsHost = [
    { icon: Zap, text: 'Synchronisation calendrier automatique' },
    { icon: Shield, text: 'Cleaners vérifiés et assurés' },
    { icon: Clock, text: 'Paiement sécurisé après validation' },
  ]

  const benefitsCleaner = [
    { icon: Zap, text: 'Missions près de chez vous' },
    { icon: Clock, text: 'Paiement garanti sous 48h' },
    { icon: Shield, text: 'Flexibilité totale sur vos horaires' },
  ]

  const benefits = role === ROLES.HOST ? benefitsHost : benefitsCleaner
  const isHost = role === ROLES.HOST

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-xl transition-all">
              <span className="text-white font-bold text-xl font-display">C</span>
            </div>
            <span className="font-display font-bold text-2xl text-surface-900">
              Clean<span className="text-brand-500">Air</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
              Créer un compte ✨
            </h1>
            <p className="text-surface-500 text-lg">
              {step === 1 ? 'Commencez votre aventure avec nous.' : 'Plus que quelques détails !'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300',
              step >= 1 
                ? cn('bg-gradient-to-br text-white shadow-lg', isHost ? 'from-accent-500 to-accent-600' : 'from-brand-500 to-brand-600')
                : 'bg-surface-200 text-surface-500'
            )}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={cn(
              'flex-1 h-1.5 rounded-full transition-all duration-500',
              step > 1 
                ? cn('bg-gradient-to-r', isHost ? 'from-accent-500 to-accent-400' : 'from-brand-500 to-brand-400')
                : 'bg-surface-200'
            )} />
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300',
              step >= 2 
                ? cn('bg-gradient-to-br text-white shadow-lg', isHost ? 'from-accent-500 to-accent-600' : 'from-brand-500 to-brand-600')
                : 'bg-surface-200 text-surface-500'
            )}>
              2
            </div>
          </div>

          {/* Role Selection (only on step 1) */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    'relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden',
                    role === r.value
                      ? cn(r.borderActive, r.bgActive, 'shadow-lg', r.shadowActive)
                      : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-md'
                  )}
                >
                  {role === r.value && (
                    <div className={cn('absolute inset-0 bg-gradient-to-br opacity-5', r.gradient)} />
                  )}
                  
                  {role === r.value && (
                    <div className={cn(
                      'absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center animate-scale-in bg-gradient-to-br shadow-lg',
                      r.gradient
                    )}>
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    'relative w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all',
                    role === r.value
                      ? cn('bg-gradient-to-br text-white shadow-lg', r.gradient)
                      : 'bg-surface-100 text-surface-500 group-hover:bg-surface-200'
                  )}>
                    <r.icon className="w-5 h-5" />
                  </div>
                  <p className={cn(
                    'relative font-semibold mb-0.5 transition-colors',
                    role === r.value ? r.textActive : 'text-surface-900'
                  )}>
                    {r.label}
                  </p>
                  <p className="relative text-xs text-surface-500">{r.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    icon={User}
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    error={errors.firstName}
                    floatingLabel
                  />
                  <Input
                    label="Nom"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    error={errors.lastName}
                    floatingLabel
                  />
                </div>

                <Input
                  label="Adresse email"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={errors.email}
                  floatingLabel
                />

                <Button 
                  type="button"
                  fullWidth 
                  size="lg"
                  onClick={handleNext}
                  variant={isHost ? 'accent' : 'primary'}
                  className="btn-ripple group mt-2"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </>
            ) : (
              <>
                <Input
                  label="Téléphone"
                  type="tel"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  error={errors.phone}
                  floatingLabel
                />

                <Input
                  label="Mot de passe"
                  type="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={errors.password}
                  hint="Minimum 6 caractères"
                  floatingLabel
                />

                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  floatingLabel
                />

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => setStep(1)}
                    icon={ArrowLeft}
                    className="hover-lift"
                  >
                    Retour
                  </Button>
                  <Button 
                    type="submit"
                    fullWidth 
                    size="lg"
                    loading={loading}
                    variant={isHost ? 'accent' : 'primary'}
                    className="btn-ripple group"
                  >
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </>
            )}
          </form>

          {/* Terms */}
          <p className="mt-6 text-sm text-surface-400 text-center">
            En créant un compte, vous acceptez nos{' '}
            <button onClick={() => showInfo('CGU disponibles prochainement 📄')} className="text-brand-600 hover:underline font-medium">CGU</button>
            {' '}et notre{' '}
            <button onClick={() => showInfo('Politique de confidentialité disponible prochainement 🔒')} className="text-brand-600 hover:underline font-medium">politique de confidentialité</button>.
          </p>

          {/* Login link */}
          <p className="mt-8 text-center text-surface-500">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background image */}
        <img 
          src={isHost 
            ? "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=1600&fit=crop"
            : "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200&h=1600&fit=crop"
          }
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Overlay gradient */}
        <div className={cn(
          'absolute inset-0 transition-all duration-500',
          isHost 
            ? 'bg-gradient-to-br from-accent-600/90 via-accent-500/85 to-brand-500/90'
            : 'bg-gradient-to-br from-brand-600/90 via-brand-500/85 to-accent-500/90'
        )} />
        
        {/* Animated shapes */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-morph" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-morph delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
          <div className="max-w-lg animate-fade-in-up">
            {/* Icon */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-10 animate-float shadow-2xl">
              {isHost ? (
                <Home className="w-12 h-12 text-white" />
              ) : (
                <Sparkles className="w-12 h-12 text-white" />
              )}
            </div>
            
            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              {isHost 
                ? 'Automatisez vos ménages' 
                : 'Trouvez des missions'}
            </h2>
            <p className="text-white/80 text-xl mb-10 leading-relaxed">
              {isHost
                ? 'Concentrez-vous sur vos voyageurs, on s\'occupe du reste.'
                : 'Développez votre activité avec des clients réguliers.'}
            </p>

            {/* Benefits */}
            <ul className="space-y-4 mb-10 text-left">
              {benefits.map((benefit, index) => (
                <li 
                  key={index} 
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-fade-in-up"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <span className="text-white/90 font-medium">{benefit.text}</span>
                </li>
              ))}
            </ul>

            {/* Testimonial mini */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/90 text-sm mb-3">
                {isHost 
                  ? '"CleanAir a révolutionné ma gestion locative. Je recommande à 100% !"'
                  : '"Grâce à CleanAir, j\'ai des missions régulières et je suis payé rapidement !"'
                }
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={isHost 
                    ? "https://randomuser.me/api/portraits/men/52.jpg"
                    : "https://randomuser.me/api/portraits/men/75.jpg"
                  }
                  alt="Testimonial"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-white font-medium text-sm">
                    {isHost ? 'Sophie M.' : 'Paul D.'}
                  </p>
                  <p className="text-white/60 text-xs">
                    {isHost ? 'Hôte • Paris' : 'Cleaner • Lyon'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
