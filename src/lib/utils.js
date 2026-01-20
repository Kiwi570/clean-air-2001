import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ============================================
// UTILS ULTIMATE - Fonctions utilitaires
// ============================================

// ============================================
// CLASS NAME UTILITIES
// ============================================

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// ============================================
// ID GENERATION
// ============================================

/**
 * Generate unique ID with optional prefix
 */
export function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ============================================
// DATE UTILITIES
// ============================================

/**
 * Get a date relative to today
 * @param {number} daysOffset - Number of days from today (negative for past)
 */
export function getRelativeDate(daysOffset) {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

/**
 * Get a timestamp relative to now
 * @param {number} hoursOffset - Number of hours from now (negative for past)
 */
export function getRelativeTimestamp(hoursOffset) {
  return Date.now() + (hoursOffset * 60 * 60 * 1000)
}

/**
 * Format a date string to French locale
 */
export function formatDate(dateString, options = {}) {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Check for special dates
  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui"
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Demain'
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Hier'
  }

  // Default format
  const defaultOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...options,
  }

  return date.toLocaleDateString('fr-FR', defaultOptions)
}

/**
 * Format date and time
 */
export function formatDateTime(dateString, time) {
  const formattedDate = formatDate(dateString)
  return time ? `${formattedDate} à ${time}` : formattedDate
}

/**
 * Get relative time (e.g., "il y a 5 minutes")
 */
export function getRelativeTime(timestamp) {
  const now = Date.now()
  const diff = now - timestamp

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`

  return formatDate(new Date(timestamp).toISOString())
}

// Alias for getRelativeTime
export const formatRelativeTime = getRelativeTime

// ============================================
// CURRENCY UTILITIES
// ============================================

/**
 * Format number as currency (EUR)
 * @param {number} amount - Amount to format
 * @param {boolean} showDecimals - Whether to show decimal places
 */
export function formatCurrency(amount, showDecimals = false) {
  if (amount === null || amount === undefined) return '—'
  
  const options = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }
  
  return new Intl.NumberFormat('fr-FR', options).format(amount)
}

/**
 * Format number with thousands separator
 */
export function formatNumber(number) {
  if (number === null || number === undefined) return '—'
  return new Intl.NumberFormat('fr-FR').format(number)
}

// ============================================
// STRING UTILITIES
// ============================================

/**
 * Get initials from a name
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str, length = 50) {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Slugify a string
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// ============================================
// VALIDATION UTILITIES
// ============================================

export const validators = {
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  },
  
  password: (value) => {
    return value && value.length >= 6
  },
  
  phone: (value) => {
    const regex = /^(\+33|0)[1-9](\d{2}){4}$/
    return regex.test(value.replace(/\s/g, ''))
  },
  
  required: (value) => {
    return value !== null && value !== undefined && value !== ''
  },
  
  minLength: (min) => (value) => {
    return value && value.length >= min
  },
  
  maxLength: (max) => (value) => {
    return !value || value.length <= max
  },
  
  numeric: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value)
  },
  
  url: (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
}

// ============================================
// ASYNC UTILITIES
// ============================================

/**
 * Delay execution
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export function debounce(fn, ms = 300) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

/**
 * Throttle function
 */
export function throttle(fn, ms = 300) {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall >= ms) {
      lastCall = now
      return fn.apply(this, args)
    }
  }
}

// ============================================
// STORAGE UTILITIES
// ============================================

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  },
}

// ============================================
// ARRAY UTILITIES
// ============================================

/**
 * Group array by key
 */
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] ?? []
    groups[group].push(item)
    return groups
  }, {})
}

/**
 * Sort array by key
 */
export function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Remove duplicates from array
 */
export function uniqueBy(array, key) {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

// ============================================
// OBJECT UTILITIES
// ============================================

/**
 * Deep clone object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if object is empty
 */
export function isEmpty(obj) {
  if (obj === null || obj === undefined) return true
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  if (typeof obj === 'string') return obj.trim() === ''
  return false
}

/**
 * Pick specific keys from object
 */
export function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key]
    return result
  }, {})
}

/**
 * Omit specific keys from object
 */
export function omit(obj, keys) {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  cn,
  generateId,
  getRelativeDate,
  getRelativeTimestamp,
  formatDate,
  formatDateTime,
  getRelativeTime,
  formatCurrency,
  formatNumber,
  getInitials,
  truncate,
  capitalize,
  slugify,
  validators,
  delay,
  debounce,
  throttle,
  storage,
  groupBy,
  sortBy,
  uniqueBy,
  deepClone,
  isEmpty,
  pick,
  omit,
}
