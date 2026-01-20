import { Shield, Clock, CreditCard, Star } from 'lucide-react'

function TrustBanner() {
  const trustItems = [
    {
      icon: Shield,
      title: 'Cleaners vérifiés',
      description: 'Identité et références validées',
    },
    {
      icon: Star,
      title: 'Note moyenne 4.9/5',
      description: 'Sur +2000 avis clients',
    },
    {
      icon: Clock,
      title: 'Réponse en 24h max',
      description: 'Garantie ou remboursé',
    },
    {
      icon: CreditCard,
      title: 'Paiement sécurisé',
      description: 'Après validation du ménage',
    },
  ]

  return (
    <section className="relative py-8 bg-surface-900 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-accent-600/20" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{item.title}</p>
                <p className="text-surface-400 text-xs">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { TrustBanner }
export default TrustBanner
