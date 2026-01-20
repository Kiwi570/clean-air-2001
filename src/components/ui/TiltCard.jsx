import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

function TiltCard({ 
  children, 
  className = '',
  tiltAmount = 10,
  glareEnabled = true,
  scaleOnHover = 1.02,
  ...props 
}) {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('')
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    const rotateX = (-mouseY / (rect.height / 2)) * tiltAmount
    const rotateY = (mouseX / (rect.width / 2)) * tiltAmount

    setTransform(`
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover})
    `)

    // Glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100
    const glareY = ((e.clientY - rect.top) / rect.height) * 100
    setGlarePosition({ x: glareX, y: glareY })
  }

  const handleMouseLeave = () => {
    setTransform('')
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        'card-tilt relative overflow-hidden',
        className
      )}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      
      {/* Glare effect */}
      {glareEnabled && (
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(
              circle at ${glarePosition.x}% ${glarePosition.y}%, 
              rgba(255,255,255,0.3) 0%, 
              transparent 60%
            )`
          }}
        />
      )}
    </div>
  )
}

export { TiltCard }
export default TiltCard
