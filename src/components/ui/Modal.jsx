import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'default',
  showClose = true,
  closeOnOverlay = true,
  className,
}) {
  const modalRef = useRef(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-soft-xl animate-scale-in',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between p-6 border-b border-surface-100">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-surface-900">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-surface-500 mt-1">{description}</p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 -m-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

function ModalFooter({ children, className }) {
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 pt-4 mt-4 border-t border-surface-100',
      className
    )}>
      {children}
    </div>
  )
}

// Confirmation Modal variant
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer',
  message = 'Êtes-vous sûr ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  loading = false,
}) {
  const variants = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    warning: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
    primary: 'bg-brand-500 hover:bg-brand-600 focus:ring-brand-500',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
      <p className="text-surface-600">{message}</p>
      <ModalFooter>
        <button
          onClick={onClose}
          disabled={loading}
          className="btn-secondary btn-md"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'btn btn-md text-white',
            variants[variant]
          )}
        >
          {loading ? 'Chargement...' : confirmText}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export { Modal, ModalFooter, ConfirmModal }
export default Modal
