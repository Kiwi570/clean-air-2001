import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storage } from '@/lib/utils'
import { ONBOARDING_ACTIONS } from '@/lib/constants'

// ============================================
// ONBOARDING HOOK - Gamification de la démo
// ============================================

const OnboardingContext = createContext(null)

const STORAGE_KEY = 'cleanair_onboarding'

const initialState = {
  hasSeenWelcome: false,
  hasSeenDevSwitcherTip: false,
  hasSeenMissionTip: false,
  completedActions: [],
  dismissedTips: [],
  firstVisit: true,
}

// Actions à compléter pour le tutoriel
const ALL_ACTIONS = [
  { id: ONBOARDING_ACTIONS.SWITCHED_ROLE, label: 'Changer de rôle', icon: '🔄' },
  { id: ONBOARDING_ACTIONS.CREATED_MISSION, label: 'Créer une demande', icon: '➕' },
  { id: ONBOARDING_ACTIONS.CONFIRMED_CLEANER, label: 'Choisir un cleaner', icon: '👤' },
  { id: ONBOARDING_ACTIONS.COMPLETED_MISSION, label: 'Terminer mission', icon: '✅' },
  { id: ONBOARDING_ACTIONS.RATED_MISSION, label: 'Noter le cleaner', icon: '⭐' },
]

export function OnboardingProvider({ children }) {
  const [state, setState] = useState(() => {
    const stored = storage.get(STORAGE_KEY)
    return stored || initialState
  })

  // Persist state changes
  useEffect(() => {
    storage.set(STORAGE_KEY, state)
  }, [state])

  // Mark first visit as done after initial render
  useEffect(() => {
    if (state.firstVisit) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, firstVisit: false }))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.firstVisit])

  // Marquer une action comme complétée
  const markActionComplete = useCallback((actionId) => {
    setState(prev => {
      if (prev.completedActions.includes(actionId)) return prev
      return {
        ...prev,
        completedActions: [...prev.completedActions, actionId]
      }
    })
  }, [])

  // Dismiss un tip spécifique
  const dismissTip = useCallback((tipId) => {
    setState(prev => ({
      ...prev,
      dismissedTips: [...prev.dismissedTips, tipId],
      [`hasSeen${tipId}`]: true
    }))
  }, [])

  // Marquer le DevSwitcher tip comme vu
  const dismissDevSwitcherTip = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenDevSwitcherTip: true }))
  }, [])

  // Marquer le welcome comme vu
  const dismissWelcome = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenWelcome: true }))
  }, [])

  // Obtenir la progression
  const getProgress = useCallback(() => {
    const completed = state.completedActions.length
    const total = ALL_ACTIONS.length
    const percentage = Math.round((completed / total) * 100)
    return { completed, total, percentage }
  }, [state.completedActions])

  // Obtenir les actions avec leur statut
  const getActionsWithStatus = useCallback(() => {
    return ALL_ACTIONS.map(action => ({
      ...action,
      completed: state.completedActions.includes(action.id)
    }))
  }, [state.completedActions])

  // Vérifier si une action est complétée
  const isActionCompleted = useCallback((actionId) => {
    return state.completedActions.includes(actionId)
  }, [state.completedActions])

  // Vérifier si un tip a été dismissed
  const isTipDismissed = useCallback((tipId) => {
    return state.dismissedTips.includes(tipId)
  }, [state.dismissedTips])

  // Reset complet de l'onboarding
  const resetOnboarding = useCallback(() => {
    setState(initialState)
    storage.remove(STORAGE_KEY)
  }, [])

  // Vérifier si l'onboarding est complet
  const isOnboardingComplete = useCallback(() => {
    return state.completedActions.length >= ALL_ACTIONS.length
  }, [state.completedActions])

  const value = {
    // State
    ...state,
    
    // Actions
    markActionComplete,
    dismissTip,
    dismissDevSwitcherTip,
    dismissWelcome,
    resetOnboarding,
    
    // Getters
    getProgress,
    getActionsWithStatus,
    isActionCompleted,
    isTipDismissed,
    isOnboardingComplete,
    
    // Constants
    ALL_ACTIONS,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

export default useOnboarding
