import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function Carousel({ 
  children, 
  autoPlay = true, 
  interval = 5000,
  showDots = true,
  showArrows = true,
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const slides = Array.isArray(children) ? children : [children]
  const totalSlides = slides.length

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isHovered) return

    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, isHovered, goToNext])

  return (
    <div 
      className={cn('carousel relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Track */}
      <div 
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            {slide}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg
                       flex items-center justify-center
                       hover:bg-white hover:scale-110 transition-all
                       focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-surface-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg
                       flex items-center justify-center
                       hover:bg-white hover:scale-110 transition-all
                       focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-surface-700" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && totalSlides > 1 && (
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn('carousel-dot', index === currentIndex && 'active')}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { Carousel }
export default Carousel
