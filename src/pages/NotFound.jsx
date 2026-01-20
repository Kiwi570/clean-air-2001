import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function NotFound() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] font-display font-bold text-surface-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25 animate-float">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-surface-900 font-display mb-4">
          Page introuvable
        </h1>
        <p className="text-surface-600 mb-8 leading-relaxed">
          Oups ! La page que vous recherchez semble avoir disparu. 
          Elle a peut-être été déplacée ou n'existe plus.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button icon={Home} iconPosition="left">
              Retour à l'accueil
            </Button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-surface-600 hover:text-surface-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Page précédente
          </button>
        </div>

        {/* Help */}
        <p className="text-sm text-surface-400 mt-12">
          Besoin d'aide ? <a href="mailto:contact@cleanair.fr" className="text-brand-600 hover:text-brand-700">Contactez-nous</a>
        </p>
      </div>
    </div>
  )
}

export default NotFound
