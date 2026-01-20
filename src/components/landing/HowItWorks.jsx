import { UserPlus, Calendar, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Créez votre compte',
      description: 'Inscription gratuite en 2 minutes. Ajoutez vos biens ou votre profil cleaner.',
      color: 'brand',
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Connectez votre calendrier',
      description: 'Synchronisez automatiquement vos réservations Airbnb, Booking et autres.',
      color: 'accent',
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'Profitez !',
      description: 'Les ménages se planifient automatiquement. Vous n\'avez plus rien à faire.',
      color: 'brand',
    },
  ]

  const colorClasses = {
    brand: {
      bg: 'bg-brand-50',
      icon: 'bg-gradient-to-br from-brand-500 to-brand-600',
      number: 'text-brand-500',
      line: 'bg-brand-200',
    },
    accent: {
      bg: 'bg-accent-50',
      icon: 'bg-gradient-to-br from-accent-500 to-accent-600',
      number: 'text-accent-500',
      line: 'bg-accent-200',
    },
  }

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-surface-50 scroll-mt-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            Comment ça marche
          </span>
          <h2 className="font-display text-display-sm lg:text-display-md text-surface-900 mb-4">
            Opérationnel en 3 minutes
          </h2>
          <p className="text-lg text-surface-600">
            Une mise en place simple et rapide pour automatiser vos ménages.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color]
            
            return (
              <div key={step.number} className="relative">
                {/* Connector line (hidden on mobile, visible on desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+3rem)] right-0 h-0.5 bg-gradient-to-r from-surface-200 to-transparent" />
                )}

                <div className="text-center">
                  {/* Number badge */}
                  <div className="inline-flex items-center justify-center mb-6">
                    <span className={cn(
                      'text-5xl font-display font-bold',
                      colors.number,
                      'opacity-40'
                    )}>
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6',
                    colors.icon,
                    'shadow-lg'
                  )}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-surface-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-surface-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-surface-500 mb-4">
            Déjà <strong className="text-surface-900">500+ hôtes</strong> nous font confiance
          </p>
          <a 
            href="/register" 
            className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            Commencer maintenant
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export { HowItWorks }
export default HowItWorks
