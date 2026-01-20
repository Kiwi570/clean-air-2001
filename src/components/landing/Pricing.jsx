import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function Pricing() {
  const plans = [
    {
      name: 'Hôte',
      description: 'Pour les propriétaires de locations',
      price: '0',
      priceSuffix: '€ / mois',
      highlight: false,
      features: [
        'Accès illimité aux cleaners vérifiés',
        'Synchronisation calendrier Airbnb',
        'Paiement sécurisé',
        'Support par email',
        'Annulation gratuite 24h',
      ],
      cta: 'Commencer gratuitement',
      ctaLink: '/register?role=host',
    },
    {
      name: 'Hôte Pro',
      description: 'Pour les gestionnaires multi-biens',
      price: '29',
      priceSuffix: '€ / mois',
      highlight: true,
      badge: 'Populaire',
      features: [
        'Tout du plan Hôte',
        'Jusqu\'à 10 biens',
        'Cleaners favoris prioritaires',
        'Rapports et statistiques',
        'Support prioritaire',
        'Facturation automatique',
      ],
      cta: 'Essai gratuit 14 jours',
      ctaLink: '/register?role=host&plan=pro',
    },
    {
      name: 'Cleaner',
      description: 'Pour les professionnels du ménage',
      price: '0',
      priceSuffix: '€ / mois',
      commission: '15% par mission',
      highlight: false,
      features: [
        'Accès aux missions disponibles',
        'Profil vérifié et badge',
        'Paiement sous 48h',
        'Assurance incluse',
        'Support dédié',
      ],
      cta: 'Devenir Cleaner',
      ctaLink: '/register?role=cleaner',
    },
  ]

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-white scroll-mt-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            Tarifs
          </span>
          <h2 className="font-display text-display-sm lg:text-display-md text-surface-900 mb-4">
            Simple et transparent
          </h2>
          <p className="text-lg text-surface-600">
            Pas de frais cachés. Commencez gratuitement et évoluez selon vos besoins.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl p-8 transition-all duration-300',
                plan.highlight
                  ? 'bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-xl md:scale-[1.02]'
                  : 'bg-white border-2 border-surface-200 hover:border-brand-200 hover:shadow-lg'
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 text-sm font-semibold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Info */}
              <div className="text-center mb-8">
                <h3 className={cn(
                  'text-xl font-bold mb-2',
                  plan.highlight ? 'text-white' : 'text-surface-900'
                )}>
                  {plan.name}
                </h3>
                <p className={cn(
                  'text-sm mb-6',
                  plan.highlight ? 'text-white/80' : 'text-surface-500'
                )}>
                  {plan.description}
                </p>
                
                <div className="flex items-baseline justify-center gap-1">
                  <span className={cn(
                    'text-5xl font-bold font-display',
                    plan.highlight ? 'text-white' : 'text-surface-900'
                  )}>
                    {plan.price}
                  </span>
                  <span className={cn(
                    'text-lg',
                    plan.highlight ? 'text-white/80' : 'text-surface-500'
                  )}>
                    {plan.priceSuffix}
                  </span>
                </div>
                
                {plan.commission && (
                  <p className={cn(
                    'text-sm mt-2',
                    plan.highlight ? 'text-white/80' : 'text-surface-500'
                  )}>
                    + {plan.commission}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={cn(
                      'w-5 h-5 flex-shrink-0 mt-0.5',
                      plan.highlight ? 'text-white' : 'text-green-500'
                    )} />
                    <span className={cn(
                      'text-sm',
                      plan.highlight ? 'text-white/90' : 'text-surface-600'
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={plan.ctaLink}>
                <Button
                  fullWidth
                  variant={plan.highlight ? 'secondary' : 'primary'}
                  className={plan.highlight ? 'bg-white text-brand-600 hover:bg-surface-50' : ''}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="text-center text-surface-500 text-sm mt-12">
          Tous les prix sont HT. TVA applicable selon votre pays.
        </p>
      </div>
    </section>
  )
}

export { Pricing }
export default Pricing
