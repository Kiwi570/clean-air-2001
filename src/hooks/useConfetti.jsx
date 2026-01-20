import { useCallback } from 'react'

const COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981']

export function useConfetti() {
  const triggerConfetti = useCallback((options = {}) => {
    const {
      particleCount = 50,
      duration = 3000,
      spread = 70,
    } = options

    // Create container
    const container = document.createElement('div')
    container.className = 'confetti-container'
    document.body.appendChild(container)

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      
      // Random properties
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const left = Math.random() * 100
      const animationDelay = Math.random() * 0.5
      const size = Math.random() * 8 + 6
      const shape = Math.random() > 0.5 ? '50%' : '0'
      
      confetti.style.cssText = `
        left: ${left}%;
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: ${shape};
        animation-delay: ${animationDelay}s;
        animation-duration: ${duration / 1000}s;
      `
      
      container.appendChild(confetti)
    }

    // Cleanup
    setTimeout(() => {
      container.remove()
    }, duration + 500)
  }, [])

  // Return both names for compatibility
  return { 
    triggerConfetti, 
    fire: triggerConfetti,
    trigger: triggerConfetti 
  }
}

export default useConfetti
