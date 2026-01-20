import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Home, Sparkles, CheckCircle, Star, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { ROLES } from '@/lib/constants'
import { cn, validators } from '@/lib/utils'

// ============================================
// LOGIN PAGE V2 - Page de connexion améliorée
// ============================================

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState(ROLES.HOST)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  
  const { login } = useAuth()
  const { success: showSuccess, error: showError, info: showInfo } = useToast()

  // Validation en temps réel
  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        return validators.email(value) ? '' : 'Email invalide'
      case 'password':
        return validators.password(value) ? '' : 'Minimum 6 caractères'
      default:
        return ''
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, field === 'email' ? email : password)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const isFieldValid = (field) => {
    const value = field === 'email' ? email : password
    return touched[field] && !errors[field] && value.length > 0
  }

  const validate = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email requis'
    else if (!validators.email(email)) newErrors.email = 'Email invalide'
    if (!password) newErrors.password = 'Mot de passe requis'
    else if (!validators.password(password)) newErrors.password = 'Minimum 6 caractères'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const result = await login(email, password, role)
      if (result.success) {
        showSuccess('Connexion réussie ! Bienvenue 👋')
      } else {
        showError(result.error || 'Erreur de connexion')
      }
    } catch (err) {
      showError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    showInfo('Fonctionnalité bientôt disponible ! 📧')
  }

  const handleSocialLogin = (provider) => {
    showInfo(`Connexion ${provider} bientôt disponible ! 🚀`)
  }

  const roles = [
    {
      value: ROLES.HOST,
      label: 'Hôte',
      description: 'Propriétaire de locations',
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
      description: 'Professionnel du ménage',
      icon: Sparkles,
      gradient: 'from-brand-500 to-brand-600',
      bgActive: 'bg-brand-50',
      borderActive: 'border-brand-500',
      shadowActive: 'shadow-brand-500/20',
      textActive: 'text-brand-700',
    },
  ]

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
              Bon retour ! 👋
            </h1>
            <p className="text-surface-500 text-lg">
              Connectez-vous pour accéder à votre espace.
            </p>
          </div>

          {/* Role Selection - Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={cn(
                  'relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden',
                  role === r.value
                    ? cn(r.borderActive, r.bgActive, 'shadow-lg', r.shadowActive)
                    : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-md'
                )}
              >
                {/* Background gradient on active */}
                {role === r.value && (
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-5',
                    r.gradient
                  )} />
                )}
                
                {/* Check mark */}
                {role === r.value && (
                  <div className={cn(
                    'absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center animate-scale-in bg-gradient-to-br shadow-lg',
                    r.gradient
                  )}>
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={cn(
                  'relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all',
                  role === r.value
                    ? cn('bg-gradient-to-br text-white shadow-lg', r.gradient)
                    : 'bg-surface-100 text-surface-500 group-hover:bg-surface-200'
                )}>
                  <r.icon className="w-6 h-6" />
                </div>
                <p className={cn(
                  'relative font-semibold text-lg mb-1 transition-colors',
                  role === r.value ? r.textActive : 'text-surface-900'
                )}>
                  {r.label}
                </p>
                <p className="relative text-sm text-surface-500">{r.description}</p>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="Adresse email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : ''}
                isValid={isFieldValid('email')}
                floatingLabel
              />
            </div>

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : ''}
                isValid={isFieldValid('password')}
                floatingLabel
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-surface-400 hover:text-surface-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={loading}
              className="btn-ripple group mt-6"
            >
              <span>Se connecter</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-50 text-surface-400 font-medium">ou continuer avec</span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="secondary" 
              className="hover-lift"
              onClick={() => handleSocialLogin('Google')}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </Button>
            <Button 
              variant="secondary" 
              className="hover-lift"
              onClick={() => handleSocialLogin('GitHub')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>GitHub</span>
            </Button>
          </div>

          {/* Register link */}
          <p className="mt-10 text-center text-surface-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Créer un compte gratuitement
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background image */}
        <img 
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=1600&fit=crop"
          alt="Appartement moderne"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 via-brand-500/85 to-accent-500/90" />
        
        {/* Animated shapes */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-morph" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-morph delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent-400/20 rounded-full blur-2xl animate-float" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
          <div className="max-w-lg animate-fade-in-up">
            {/* Icon */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-10 animate-float shadow-2xl">
              <Home className="w-12 h-12 text-white" />
            </div>
            
            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              Gérez vos ménages en toute simplicité
            </h2>
            <p className="text-white/80 text-xl mb-10 leading-relaxed">
              Une plateforme intuitive pour automatiser vos réservations de ménage et gagner du temps précieux.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { value: '500+', label: 'Hôtes' },
                { value: '98%', label: 'Satisfaction' },
                { value: '24h', label: 'Réponse' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold font-display">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonial mini */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left">
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/90 text-sm mb-3">
                "CleanAir a révolutionné ma gestion locative. Je recommande à 100% !"
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Sophie"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-white font-medium text-sm">Sophie M.</p>
                  <p className="text-white/60 text-xs">Hôte • Paris</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
