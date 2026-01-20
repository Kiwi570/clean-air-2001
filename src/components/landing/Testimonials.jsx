import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CountUp } from '@/components/ui/CountUp'

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      content: "CleanAir a révolutionné ma gestion locative. Je gère 5 appartements et je ne me soucie plus jamais du ménage. Tout est automatique, c'est magique !",
      author: 'Sophie Martin',
      role: 'Hôte • Paris',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      properties: 5,
    },
    {
      id: 2,
      content: "Depuis que j'utilise CleanAir, j'ai des missions régulières près de chez moi. Le paiement est toujours à l'heure et les clients sont top. Je recommande à 100% !",
      author: 'Thomas Dubois',
      role: 'Cleaner • Lyon',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      missions: 142,
    },
    {
      id: 3,
      content: "L'intégration avec mon calendrier Airbnb est parfaite. Plus besoin de jongler entre les réservations et les ménages. Un gain de temps énorme pour moi !",
      author: 'Marie Leroy',
      role: 'Hôte • Bordeaux',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      properties: 3,
    },
    {
      id: 4,
      content: "Interface super intuitive, cleaners professionnels et réactifs. Le service client est également au top. Exactement ce qu'il me fallait !",
      author: 'Pierre Moreau',
      role: 'Hôte • Nice',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      properties: 8,
    },
    {
      id: 5,
      content: "En tant que cleaner, je trouve facilement des missions intéressantes. L'app est simple et le paiement rapide. Parfait pour développer mon activité !",
      author: 'Camille Bernard',
      role: 'Cleaner • Marseille',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      missions: 89,
    },
  ]

  const stats = [
    { value: 4.9, suffix: '/5', label: 'Note moyenne', decimals: 1 },
    { value: 2000, suffix: '+', label: 'Avis clients', decimals: 0 },
    { value: 98, suffix: '%', label: 'Satisfaction', decimals: 0 },
    { value: 500, suffix: '+', label: 'Hôtes actifs', decimals: 0 },
  ]

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, testimonials.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-white overflow-hidden scroll-mt-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
            ⭐ Témoignages
          </span>
          <h2 className="font-display text-display-sm lg:text-display-md text-surface-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-lg text-surface-600">
            Découvrez ce que nos utilisateurs pensent de CleanAir.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Main testimonial */}
          <div className="relative bg-gradient-to-br from-surface-50 to-white rounded-3xl border border-surface-200 p-8 lg:p-12 shadow-soft-xl overflow-hidden">
            {/* Quote decoration */}
            <Quote className="absolute top-6 right-6 w-20 h-20 text-brand-100 opacity-50" />
            
            <div 
              className="relative z-10 transition-all duration-500"
              key={currentIndex}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      'w-6 h-6 transition-all duration-300',
                      i < testimonials[currentIndex].rating 
                        ? 'text-amber-400 fill-amber-400 animate-scale-in' 
                        : 'text-surface-200'
                    )}
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-xl lg:text-2xl text-surface-700 leading-relaxed mb-8 animate-fade-in">
                "{testimonials[currentIndex].content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 animate-fade-in-up delay-200">
                <div className="avatar-ring">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-surface-900 text-lg">
                    {testimonials[currentIndex].author}
                  </p>
                  <p className="text-surface-500">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 -translate-x-1/2
                       w-12 h-12 bg-white rounded-full shadow-lg border border-surface-200
                       flex items-center justify-center
                       hover:bg-brand-50 hover:border-brand-300 hover:scale-110 
                       transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <ChevronLeft className="w-5 h-5 text-surface-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 translate-x-1/2
                       w-12 h-12 bg-white rounded-full shadow-lg border border-surface-200
                       flex items-center justify-center
                       hover:bg-brand-50 hover:border-brand-300 hover:scale-110 
                       transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <ChevronRight className="w-5 h-5 text-surface-600" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-brand-500 to-accent-500 w-8 shadow-lg shadow-brand-500/30' 
                    : 'bg-surface-300 hover:bg-surface-400'
                )}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="pt-12 border-t border-surface-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <p className="text-4xl lg:text-5xl font-bold text-surface-900 font-display mb-2">
                  <CountUp 
                    end={stat.value} 
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    duration={2000}
                    delay={index * 150}
                  />
                </p>
                <p className="text-surface-500 group-hover:text-brand-600 transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Testimonials }
export default Testimonials
