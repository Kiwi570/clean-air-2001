import { Link } from 'react-router-dom'
import { ArrowRight, Home, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function DualPath() {
  const paths = [
    {
      id: 'host',
      icon: Home,
      title: 'Je suis Hôte',
      subtitle: 'Propriétaire Airbnb, Booking...',
      description: 'Automatisez le ménage de vos locations et concentrez-vous sur vos voyageurs.',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=300&fit=crop',
      benefits: [
        'Synchronisation calendrier automatique',
        'Cleaners vérifiés et notés',
        'Paiement après validation',
        'Annulation gratuite 24h avant',
      ],
      cta: 'Commencer en tant qu\'hôte',
      link: '/register?role=host',
      gradient: 'from-accent-500 to-accent-600',
      lightBg: 'bg-accent-50',
      textColor: 'text-accent-600',
      borderColor: 'border-accent-200',
      hoverBorder: 'hover:border-accent-400',
    },
    {
      id: 'cleaner',
      icon: Sparkles,
      title: 'Je suis Cleaner',
      subtitle: 'Professionnel du ménage',
      description: 'Trouvez des missions régulières près de chez vous et développez votre activité.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=300&fit=crop',
      benefits: [
        'Missions à proximité',
        'Paiement garanti sous 48h',
        'Flexibilité totale',
        'Clients récurrents',
      ],
      cta: 'Devenir cleaner',
      link: '/register?role=cleaner',
      gradient: 'from-brand-500 to-brand-600',
      lightBg: 'bg-brand-50',
      textColor: 'text-brand-600',
      borderColor: 'border-brand-200',
      hoverBorder: 'hover:border-brand-400',
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-display-sm lg:text-display-md text-surface-900 mb-4">
            Choisissez votre parcours
          </h2>
          <p className="text-lg text-surface-600">
            Que vous soyez propriétaire ou professionnel du ménage, 
            CleanAir s'adapte à vos besoins.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {paths.map((path) => (
            <div
              key={path.id}
              className={cn(
                'relative bg-white rounded-3xl border-2 overflow-hidden transition-all duration-300 group',
                path.borderColor,
                path.hoverBorder,
                'hover:shadow-soft-xl hover:-translate-y-1'
              )}
            >
              {/* Image */}
              <div className="h-40 overflow-hidden">
                <img 
                  src={path.image} 
                  alt={path.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-8">
                {/* Icon */}
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mb-5 -mt-12 relative z-10 shadow-lg',
                  `bg-gradient-to-br ${path.gradient}`
                )}>
                  <path.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="mb-5">
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">
                    {path.title}
                  </h3>
                  <p className="text-surface-500">{path.subtitle}</p>
                </div>

                <p className="text-surface-600 mb-5">
                  {path.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2.5 mb-6">
                  {path.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle className={cn('w-5 h-5 mt-0.5 flex-shrink-0', path.textColor)} />
                      <span className="text-surface-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to={path.link} className="block">
                  <Button 
                    fullWidth 
                    size="lg"
                    variant={path.id === 'host' ? 'accent' : 'primary'}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    {path.cta}
                  </Button>
                </Link>
              </div>

              {/* Decorative gradient */}
              <div className={cn(
                'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10',
                'bg-gradient-to-b from-transparent to-surface-50'
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { DualPath }
export default DualPath
