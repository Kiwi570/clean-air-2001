import { useCallback, useState, useEffect } from 'react'
import { storage, prefersReducedMotion } from '@/lib/utils'

// ============================================
// SOUND HOOK - Sons optionnels pour feedback
// ============================================

const STORAGE_KEY = 'cleanair_sound_enabled'

// Web Audio API context (lazy initialization)
let audioContext = null

const getAudioContext = () => {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Définition des sons
const SOUNDS = {
  success: {
    frequency: 523.25, // C5
    duration: 0.15,
    type: 'sine',
    gain: 0.3,
  },
  error: {
    frequency: 196, // G3
    duration: 0.2,
    type: 'sine',
    gain: 0.25,
  },
  notification: {
    frequencies: [440, 554.37], // A4 → C#5
    duration: 0.12,
    type: 'sine',
    gain: 0.2,
  },
  click: {
    frequency: 1000,
    duration: 0.05,
    type: 'sine',
    gain: 0.1,
  },
  celebrate: {
    frequencies: [523.25, 659.25, 783.99], // C5 → E5 → G5
    duration: 0.15,
    type: 'sine',
    gain: 0.25,
  },
}

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = storage.get(STORAGE_KEY)
    return stored !== null ? stored : false // Désactivé par défaut
  })

  // Persist sound preference
  useEffect(() => {
    storage.set(STORAGE_KEY, soundEnabled)
  }, [soundEnabled])

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev)
  }, [])

  // Play a simple tone
  const playTone = useCallback((frequency, duration, type = 'sine', gain = 0.3) => {
    if (!soundEnabled || prefersReducedMotion()) return
    
    try {
      const ctx = getAudioContext()
      if (!ctx || ctx.state === 'suspended') {
        ctx?.resume()
        return
      }

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      // Fade in/out pour éviter les clics
      const now = ctx.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.01)
      gainNode.gain.linearRampToValueAtTime(0, now + duration)
      
      oscillator.start(now)
      oscillator.stop(now + duration)
    } catch (e) {
      console.warn('Sound playback failed:', e)
    }
  }, [soundEnabled])

  // Play a sequence of tones
  const playSequence = useCallback((frequencies, duration, type = 'sine', gain = 0.3) => {
    if (!soundEnabled || prefersReducedMotion()) return
    
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        playTone(freq, duration, type, gain)
      }, index * (duration * 1000 + 50))
    })
  }, [soundEnabled, playTone])

  // Predefined sound effects
  const playSound = useCallback((soundType) => {
    if (!soundEnabled || prefersReducedMotion()) return
    
    const sound = SOUNDS[soundType]
    if (!sound) return

    if (sound.frequencies) {
      playSequence(sound.frequencies, sound.duration, sound.type, sound.gain)
    } else {
      playTone(sound.frequency, sound.duration, sound.type, sound.gain)
    }
  }, [soundEnabled, playTone, playSequence])

  // Raccourcis pour les sons courants
  const playSuccess = useCallback(() => playSound('success'), [playSound])
  const playError = useCallback(() => playSound('error'), [playSound])
  const playNotification = useCallback(() => playSound('notification'), [playSound])
  const playClick = useCallback(() => playSound('click'), [playSound])
  const playCelebrate = useCallback(() => playSound('celebrate'), [playSound])

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    playSound,
    playSuccess,
    playError,
    playNotification,
    playClick,
    playCelebrate,
  }
}

export default useSound
