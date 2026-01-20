import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, CheckCircle, Star, Sparkles, Home, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CountUp } from '@/components/ui/CountUp'
import { cn } from '@/lib/utils'

function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    'Cleaners vérifiés et assurés',
    'Réservation en 2 minutes',
    'Satisfaction garantie',
  ]

  const stats = [
    { value: 500, suffix: '+', label: 'Hôtes actifs' },
    { value: 98, suffix: '%', label: 'Satisfaction' },
    { value: 24, suffix: 'h', label: 'Réponse max' },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50/30" />
      
      <div className="absolute top-20 -left-32 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-morph" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-morph delay-1000" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-sky-100/40 rounded-full blur-2xl animate-float" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={cn(
            'transition-all duration-1000',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-fade-in-down">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-700">
                +50 nouveaux cleaners ce mois
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Le ménage de vos{' '}
              <span className="text-gradient">locations</span>
              {' '}en pilote automatique
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
              Connectez-vous avec des professionnels du ménage qualifiés pour vos locations Airbnb. 
              Simple, rapide, fiable.
            </p>

            <ul className="space-y-3 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto group">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/host">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Play className="w-5 h-5" />
                  Voir la démo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-2 text-sm text-slate-600">
                  <strong>4.9/5</strong> de 500+ avis
                </span>
              </div>
            </div>
          </div>

          <div className={cn(
            'relative transition-all duration-1000 delay-300',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}>
            <div className="hidden lg:block relative">
              <div className="absolute -left-8 top-20 bg-white rounded-2xl shadow-2xl p-4 animate-float z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Mission confirmée</p>
                    <p className="text-sm text-slate-500">Studio Marais - 14:00</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-32 bg-white rounded-2xl shadow-2xl p-4 animate-float delay-500 z-20">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Cleaner"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">Sophie L.</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-slate-600">4.9 - 127 missions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-72">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-teal-500 rounded-3xl transform rotate-6 scale-95 opacity-20 blur-xl" />
                <div className="relative bg-slate-900 rounded-3xl p-3 shadow-2xl">
                  <div className="bg-white rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-br from-sky-500 to-teal-500 p-6 pb-8">
                      <div className="flex items-center justify-between text-white mb-6">
                        <span className="font-semibold">CleanAir</span>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <p className="text-white/80 text-sm">Bonjour Sophie</p>
                      <p className="text-white font-semibold text-lg">3 missions cette semaine</p>
                    </div>
                    <div className="p-4 -mt-4">
                      <div className="bg-white rounded-2xl shadow-lg p-4 mb-3">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop"
                            alt="Property"
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">Studio Marais</p>
                            <p className="text-xs text-slate-500">Aujourd'hui - 14:00</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                            Confirmée
                          </span>
                          <span className="font-bold text-sky-600">55 EUR</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-slate-200 animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                            <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <div className="bg-white rounded-3xl shadow-2xl p-5 border border-slate-100">
                {/* Mini app preview */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl mb-4 border border-green-100">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">Mission confirmée</p>
                    <p className="text-xs text-slate-500">Studio Marais • Aujourd'hui 14:00</p>
                  </div>
                  <span className="text-green-600 font-bold">55€</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <p className="text-2xl font-bold text-gradient">
                        <CountUp end={stat.value} duration={2} />
                        {stat.suffix}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-xs">Assurance incluse</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-sky-500" />
                      <span className="text-xs">24h max</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-indicator">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-12 rounded-full border-2 border-slate-400 flex items-start justify-center p-2 bg-white/70 backdrop-blur-sm shadow-sm">
            <div className="w-1.5 h-3 bg-slate-500 rounded-full animate-bounce" />
          </div>
          <span className="text-xs text-slate-500 font-medium">Défiler</span>
        </div>
      </div>
    </section>
  )
}

export { Hero }
export default Hero
