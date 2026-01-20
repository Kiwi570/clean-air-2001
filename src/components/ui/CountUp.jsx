import { useState, useEffect, useRef } from 'react'

function CountUp({ 
  end, 
  start = 0, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  decimals = 0,
  delay = 0,
  onComplete,
  className = ''
}) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  // Intersection Observer for scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true)
          hasAnimated.current = true
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  // Animation
  useEffect(() => {
    if (!isVisible) return

    const timeout = setTimeout(() => {
      const startTime = Date.now()
      const endValue = parseFloat(end)
      const startValue = parseFloat(start)
      
      const animate = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function (ease-out-expo)
        const easeOutExpo = progress === 1 
          ? 1 
          : 1 - Math.pow(2, -10 * progress)
        
        const currentValue = startValue + (endValue - startValue) * easeOutExpo
        setCount(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(endValue)
          onComplete?.()
        }
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isVisible, end, start, duration, delay, onComplete])

  const displayValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.round(count)

  return (
    <span 
      ref={ref} 
      className={`counter ${className} ${isVisible ? 'animate-count-up' : 'opacity-0'}`}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

export { CountUp }
export default CountUp
