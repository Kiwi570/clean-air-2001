import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function FinalCTA() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-8">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <h2 className="font-display text-display-sm lg:text-display-md text-white mb-6">
            Prêt à simplifier votre gestion ?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Rejoignez plus de 500 hôtes qui ont déjà automatisé leurs ménages avec CleanAir.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-brand-600 hover:bg-white/90 hover:shadow-xl"
                icon={ArrowRight}
                iconPosition="right"
              >
                Créer mon compte gratuitement
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="ghost" 
                size="lg"
                className="text-white hover:bg-white/10"
              >
                J'ai déjà un compte
              </Button>
            </Link>
          </div>

          {/* Trust note */}
          <p className="mt-8 text-white/60 text-sm">
            Inscription gratuite • Sans engagement • Annulation à tout moment
          </p>
        </div>
      </div>
    </section>
  )
}

export { FinalCTA }
export default FinalCTA
