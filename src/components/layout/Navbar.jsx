import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const navLinks = [
    { href: '#how-it-works', label: 'Comment ça marche' },
    { href: '#testimonials', label: 'Témoignages' },
    { href: '#pricing', label: 'Tarifs' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-soft py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
              'bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/25',
              'group-hover:shadow-brand-500/40 group-hover:scale-105'
            )}>
              <span className="text-white font-bold text-lg font-display">C</span>
            </div>
            <span className="font-display font-bold text-xl text-surface-900">
              Clean<span className="text-brand-500">Air</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-surface-600 hover:text-surface-900 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Commencer gratuitement
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -mr-2 text-surface-600 hover:text-surface-900 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-surface-100 pt-4 animate-fade-in-down">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-surface-600 hover:text-surface-900 font-medium transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-surface-100">
                <Link to="/login">
                  <Button variant="secondary" fullWidth>
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button fullWidth>
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export { Navbar }
export default Navbar
