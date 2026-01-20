import { forwardRef, useState, useEffect, useRef } from 'react'
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// INPUT V3 - Version finale avec autofill fix
// ============================================

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  suffix,
  type = 'text',
  isValid,
  floatingLabel,
  className,
  inputClassName,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!value || !!defaultValue)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef(null)
  const combinedRef = ref || inputRef

  // Sync hasValue with controlled value prop
  useEffect(() => {
    setHasValue(!!value)
  }, [value])

  // Detect browser autofill (Chrome, Safari, Firefox)
  useEffect(() => {
    const input = combinedRef?.current
    if (!input) return

    // Check for autofill on mount and after a delay
    const checkAutofill = () => {
      try {
        // Chrome/Safari detection
        if (input.matches(':-webkit-autofill')) {
          setHasValue(true)
          return
        }
      } catch (e) {}
      
      // Fallback: check if value exists
      if (input.value) {
        setHasValue(true)
      }
    }

    // Check immediately and after delays (autofill can be async)
    checkAutofill()
    const timer1 = setTimeout(checkAutofill, 100)
    const timer2 = setTimeout(checkAutofill, 500)
    const timer3 = setTimeout(checkAutofill, 1000)

    // Also listen for animation (Chrome autofill triggers animation)
    const handleAnimation = (e) => {
      if (e.animationName === 'onAutoFillStart' || e.animationName.includes('auto')) {
        setHasValue(true)
      }
    }
    input.addEventListener('animationstart', handleAnimation)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      input.removeEventListener('animationstart', handleAnimation)
    }
  }, [combinedRef])

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    setHasValue(!!e.target.value)
    onBlur?.(e)
  }

  const handleChange = (e) => {
    setHasValue(!!e.target.value)
    onChange?.(e)
  }

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const showValidIcon = isValid && !error
  const showErrorIcon = !!error

  return (
    <div className={cn('space-y-1.5', className)}>
      {/* Label (non-floating) */}
      {label && !floatingLabel && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Leading icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className={cn(
              'w-5 h-5 transition-colors',
              isFocused ? 'text-brand-500' : 'text-surface-400',
              error && 'text-red-400'
            )} />
          </div>
        )}

        {/* Floating label */}
        {label && floatingLabel && (
          <label 
            className={cn(
              'absolute left-4 transition-all duration-200 pointer-events-none z-10',
              Icon && 'left-12',
              (isFocused || hasValue) 
                ? '-top-2.5 text-xs px-2 bg-gradient-to-b from-white to-slate-50 rounded text-brand-600 font-medium'
                : 'top-1/2 -translate-y-1/2 text-surface-400'
            )}
          >
            {label}
          </label>
        )}

        {/* Input field */}
        <input
          ref={combinedRef}
          type={inputType}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            'input',
            Icon && 'pl-12',
            (showValidIcon || showErrorIcon || suffix || isPassword) && 'pr-12',
            error && 'input-error',
            isValid && !error && 'border-green-300 focus:ring-green-500 focus:border-green-500',
            inputClassName
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Trailing icons/suffix */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Custom suffix */}
          {suffix}

          {/* Password toggle */}
          {isPassword && !suffix && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-surface-400 hover:text-surface-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Validation icons */}
          {showValidIcon && !isPassword && !suffix && (
            <CheckCircle className="w-5 h-5 text-green-500 animate-scale-in" />
          )}
          {showErrorIcon && !isPassword && !suffix && (
            <AlertCircle className="w-5 h-5 text-red-500 animate-scale-in" />
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Textarea variant
const Textarea = forwardRef(({
  label,
  error,
  rows = 4,
  className,
  ...props
}, ref) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'input resize-none',
          error && 'input-error'
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// Select variant
const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Sélectionner...',
  className,
  ...props
}, ref) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'input appearance-none cursor-pointer',
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")]',
          'bg-no-repeat bg-[right_1rem_center] bg-[length:1.25rem]',
          error && 'input-error'
        )}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

// Checkbox
const Checkbox = forwardRef(({
  label,
  description,
  className,
  ...props
}, ref) => {
  return (
    <label className={cn('flex items-start gap-3 cursor-pointer group', className)}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'w-5 h-5 rounded-md border-2 border-surface-300',
            'text-brand-500 cursor-pointer',
            'focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
            'checked:bg-brand-500 checked:border-brand-500',
            'transition-all duration-200'
          )}
          {...props}
        />
      </div>
      <div className="flex-1">
        {label && (
          <span className="text-sm font-medium text-surface-900 group-hover:text-brand-600 transition-colors">
            {label}
          </span>
        )}
        {description && (
          <p className="text-sm text-surface-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  )
})

Checkbox.displayName = 'Checkbox'

// Radio
const Radio = forwardRef(({
  label,
  description,
  className,
  ...props
}, ref) => {
  return (
    <label className={cn('flex items-start gap-3 cursor-pointer group', className)}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          type="radio"
          className={cn(
            'w-5 h-5 border-2 border-surface-300',
            'text-brand-500 cursor-pointer',
            'focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
            'checked:border-brand-500',
            'transition-all duration-200'
          )}
          {...props}
        />
      </div>
      <div className="flex-1">
        {label && (
          <span className="text-sm font-medium text-surface-900 group-hover:text-brand-600 transition-colors">
            {label}
          </span>
        )}
        {description && (
          <p className="text-sm text-surface-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  )
})

Radio.displayName = 'Radio'

export { Input, Textarea, Select, Checkbox, Radio }
export default Input

// Toggle Switch
const Toggle = ({ checked, onChange, label, description, className, ...props }) => {
  return (
    <label className={`flex items-center justify-between cursor-pointer group ${className || ''}`}>
      <div className="flex-1">
        {label && (
          <span className="text-sm font-medium text-slate-900">{label}</span>
        )}
        {description && (
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-sky-500' : 'bg-slate-200'}`}>
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </div>
    </label>
  )
}

export { Toggle }
