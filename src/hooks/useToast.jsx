import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, Info, AlertTriangle, X, Home, Sparkles, Bell } from 'lucide-react'
import { cn, generateId } from '@/lib/utils'

// ============================================
// TOAST HOOK ULTIMATE - Notifications parfaites
// ============================================

const ToastContext = createContext(null)

const TOAST_DURATION = 4000

// Icônes par type et contexte
const getToastIcon = (type, context) => {
  if (context === 'host') return Home
  if (context === 'cleaner') return Sparkles
  if (context === 'notification') return Bell
  
  switch (type) {
    case 'success': return CheckCircle
    case 'error': return XCircle
    case 'warning': return AlertTriangle
    case 'info': return Info
    default: return Info
  }
}

// Styles par type
const toastStyles = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
  warning: 'toast-warning',
}

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-sky-500',
  warning: 'text-amber-500',
}

const iconBgStyles = {
  success: 'bg-green-100',
  error: 'bg-red-100',
  info: 'bg-sky-100',
  warning: 'bg-amber-100',
}

function Toast({ id, type, message, context, onDismiss, duration = TOAST_DURATION }) {
  const [isExiting, setIsExiting] = useState(false)
  const Icon = getToastIcon(type, context)

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => onDismiss(id), 300)
  }, [id, onDismiss])

  // FIX: Utiliser useEffect au lieu de useState pour l'auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, handleDismiss])

  return (
    <div
      className={cn(
        'toast group',
        toastStyles[type],
        isExiting && 'toast-exit'
      )}
      role="alert"
    >
      {/* Icon */}
      <div className={cn(
        'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
        iconBgStyles[type]
      )}>
        <Icon className={cn('w-5 h-5', iconStyles[type])} />
      </div>

      {/* Message */}
      <p className="flex-1 font-medium text-slate-800">{message}</p>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Fermer"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>

      {/* Progress bar */}
      <div 
        className="toast-progress"
        style={{ 
          animation: `toastProgress ${duration}ms linear forwards`,
        }}
      />
    </div>
  )
}

function ToastContainer({ toasts, onDismiss }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>,
    document.body
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, message, options = {}) => {
    const id = generateId('toast-')
    const toast = {
      id,
      type,
      message,
      context: options.context || null,
      duration: options.duration || TOAST_DURATION,
    }

    setToasts(prev => [...prev, toast])

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((message, options) => {
    return addToast('success', message, options)
  }, [addToast])

  const error = useCallback((message, options) => {
    return addToast('error', message, options)
  }, [addToast])

  const info = useCallback((message, options) => {
    return addToast('info', message, options)
  }, [addToast])

  const warning = useCallback((message, options) => {
    return addToast('warning', message, options)
  }, [addToast])

  // Toast contextuel pour Host
  const hostSuccess = useCallback((message) => {
    return addToast('success', message, { context: 'host' })
  }, [addToast])

  // Toast contextuel pour Cleaner
  const cleanerSuccess = useCallback((message) => {
    return addToast('success', message, { context: 'cleaner' })
  }, [addToast])

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    hostSuccess,
    cleanerSuccess,
    clearAll,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default useToast
