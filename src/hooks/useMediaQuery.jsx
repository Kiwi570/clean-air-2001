import { useState, useEffect } from 'react'

/**
 * Hook for responsive design with media queries
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)

    // Create listener
    const listener = (event) => {
      setMatches(event.matches)
    }

    // Add listener
    media.addEventListener('change', listener)

    // Cleanup
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}

/**
 * Predefined breakpoint hooks
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 639px)')
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsLargeDesktop() {
  return useMediaQuery('(min-width: 1280px)')
}

/**
 * Hook to get current breakpoint name
 */
export function useBreakpoint() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
  const isLargeDesktop = useIsLargeDesktop()

  if (isLargeDesktop) return 'xl'
  if (isDesktop) return 'lg'
  if (isTablet) return 'md'
  if (isMobile) return 'sm'
  return 'xs'
}

/**
 * Hook to detect touch devices
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouch
}

/**
 * Hook to detect reduced motion preference
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Hook to detect dark mode preference
 */
export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

export default useMediaQuery
