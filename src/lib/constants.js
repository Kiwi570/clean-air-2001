// ============================================
// CLEANAIR ULTIMATE - Constants centralisées
// ============================================

// App Constants
export const APP_NAME = 'CleanAir'
export const APP_VERSION = '3.0.0'

// User Roles
export const ROLES = {
  CLEANER: 'cleaner',
  HOST: 'host',
}

// Mission Status - SOURCE UNIQUE DE VÉRITÉ
export const MISSION_STATUS = {
  PENDING: 'pending',
  APPLIED: 'applied',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  RATED: 'rated',
  CANCELLED: 'cancelled',
}

// Status Labels - Côté Hôte (voix rassurante, orientée résultat)
export const HOST_STATUS_LABELS = {
  [MISSION_STATUS.PENDING]: 'En recherche',
  [MISSION_STATUS.APPLIED]: 'Candidature reçue',
  [MISSION_STATUS.CONFIRMED]: 'Tout est calé ✓',
  [MISSION_STATUS.IN_PROGRESS]: 'Ménage en cours',
  [MISSION_STATUS.COMPLETED]: 'Donner votre avis',
  [MISSION_STATUS.RATED]: 'Terminé',
  [MISSION_STATUS.CANCELLED]: 'Annulé',
}

// Phrases vécues - Côté Hôte (émotionnel, rassurant)
export const HOST_STATUS_MESSAGES = {
  [MISSION_STATUS.PENDING]: 'On cherche le cleaner idéal pour vous',
  [MISSION_STATUS.APPLIED]: 'Un cleaner souhaite intervenir',
  [MISSION_STATUS.CONFIRMED]: 'Tout est calé, on s\'occupe du reste 👌',
  [MISSION_STATUS.IN_PROGRESS]: 'Votre logement est en cours de nettoyage',
  [MISSION_STATUS.COMPLETED]: 'Ménage terminé ! Votre avis compte',
  [MISSION_STATUS.RATED]: 'Merci ! Boucle complétée ✅',
  [MISSION_STATUS.CANCELLED]: 'Cette réservation a été annulée',
}

// Status Labels - Côté Cleaner (voix valorisante, orientée action)
export const CLEANER_STATUS_LABELS = {
  [MISSION_STATUS.PENDING]: 'Disponible',
  [MISSION_STATUS.APPLIED]: 'Candidature envoyée',
  [MISSION_STATUS.CONFIRMED]: 'C\'est confirmé ✓',
  [MISSION_STATUS.IN_PROGRESS]: 'En intervention',
  [MISSION_STATUS.COMPLETED]: 'En attente d\'avis',
  [MISSION_STATUS.RATED]: 'Avis reçu ⭐',
  [MISSION_STATUS.CANCELLED]: 'Annulée',
}

// Phrases vécues - Côté Cleaner (motivant, valorisant)
export const CLEANER_STATUS_MESSAGES = {
  [MISSION_STATUS.PENDING]: 'Cette mission est disponible pour vous',
  [MISSION_STATUS.APPLIED]: 'Votre candidature a été envoyée, patience !',
  [MISSION_STATUS.CONFIRMED]: 'Bravo ! Cette mission est à vous 🎉',
  [MISSION_STATUS.IN_PROGRESS]: 'Vous y êtes ! Suivez la checklist',
  [MISSION_STATUS.COMPLETED]: 'Bien joué ! L\'hôte va donner son avis',
  [MISSION_STATUS.RATED]: 'Mission réussie ! Votre note est arrivée ⭐',
  [MISSION_STATUS.CANCELLED]: 'Cette mission a été annulée',
}

// Messages d'état vide - Plus humains
export const EMPTY_STATE_MESSAGES = {
  host: {
    noActions: 'Tout est pris en charge, on gère 👌',
    noMissions: 'Aucun ménage prévu. Créez-en un pour commencer !',
    noProperties: 'Ajoutez votre premier bien pour démarrer',
    noCleaners: 'Vous n\'avez pas encore de cleaners favoris',
    noMessages: 'Vos conversations apparaîtront ici',
  },
  cleaner: {
    noActions: 'Rien à faire pour l\'instant. On vous prévient dès qu\'une mission arrive.',
    noMissions: 'Aucune mission confirmée. Restez connecté !',
    noEarnings: 'Vos premiers revenus apparaîtront ici',
    noPlanning: 'Votre planning est vide. Les missions confirmées s\'afficheront ici.',
    noMessages: 'Vos échanges avec les hôtes apparaîtront ici',
  },
}

// Messages de progression checklist
export const CHECKLIST_MESSAGES = {
  start: 'Cochez chaque étape terminée',
  progress1: 'Bien ! Plus qu\'une étape obligatoire',
  progress2: 'Encore une et c\'est bon !',
  almostDone: 'Presque fini, courage !',
  ready: 'Tout est prêt, bien joué 👌',
  complete: 'Parfait ! Vous pouvez terminer 🎉',
}

// Booking Mode
export const BOOKING_MODE = {
  INSTANT: 'instant',
  APPLICATION: 'application',
}

// Property Types
export const PROPERTY_TYPES = [
  { value: 'studio', label: 'Studio' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'loft', label: 'Loft' },
  { value: 'duplex', label: 'Duplex' },
]

// French Cities (for zones)
export const ZONES = [
  'Paris 1er', 'Paris 2e', 'Paris 3e', 'Paris 4e', 'Paris 5e',
  'Paris 6e', 'Paris 7e', 'Paris 8e', 'Paris 9e', 'Paris 10e',
  'Paris 11e', 'Paris 12e', 'Paris 13e', 'Paris 14e', 'Paris 15e',
  'Paris 16e', 'Paris 17e', 'Paris 18e', 'Paris 19e', 'Paris 20e',
  'Boulogne-Billancourt', 'Neuilly-sur-Seine', 'Levallois-Perret',
  'Issy-les-Moulineaux', 'Saint-Denis', 'Montreuil', 'Vincennes',
]

// Days of week
export const DAYS = [
  { value: 'lun', label: 'Lundi', short: 'L' },
  { value: 'mar', label: 'Mardi', short: 'M' },
  { value: 'mer', label: 'Mercredi', short: 'M' },
  { value: 'jeu', label: 'Jeudi', short: 'J' },
  { value: 'ven', label: 'Vendredi', short: 'V' },
  { value: 'sam', label: 'Samedi', short: 'S' },
  { value: 'dim', label: 'Dimanche', short: 'D' },
]

// Time slots
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

// Pricing tiers
export const PRICING = {
  STUDIO: { base: 35, perM2: 0.8 },
  APARTMENT_SMALL: { base: 45, perM2: 0.7 },
  APARTMENT_LARGE: { base: 55, perM2: 0.6 },
  HOUSE: { base: 70, perM2: 0.5 },
}

// Onboarding Actions for Demo Tracking
export const ONBOARDING_ACTIONS = {
  SWITCHED_ROLE: 'switched_role',
  CREATED_MISSION: 'created_mission',
  CHOOSE_CLEANER: 'choose_cleaner',
  APPLIED_MISSION: 'applied_mission',
  CONFIRMED_CLEANER: 'confirmed_cleaner',
  COMPLETED_MISSION: 'completed_mission',
  SENT_MESSAGE: 'sent_message',
  RATED_MISSION: 'rated_mission',
}

// Navigation items - Langage incarné par rôle
export const NAV_ITEMS = {
  cleaner: [
    { path: '/cleaner', label: 'Aujourd\'hui', icon: 'LayoutDashboard' },
    { path: '/cleaner/missions', label: 'Mes missions', icon: 'MapPin' },
    { path: '/cleaner/planning', label: 'Mon planning', icon: 'Calendar' },
    { path: '/cleaner/earnings', label: 'Mes revenus', icon: 'Wallet' },
    { path: '/cleaner/profile', label: 'Mon profil', icon: 'User' },
    { path: '/cleaner/settings', label: 'Paramètres', icon: 'Settings' },
  ],
  host: [
    { path: '/host', label: 'Aujourd\'hui', icon: 'LayoutDashboard' },
    { path: '/host/properties', label: 'Mes biens', icon: 'Home' },
    { path: '/host/bookings', label: 'Mes ménages', icon: 'Calendar' },
    { path: '/host/cleaners', label: 'Mes cleaners', icon: 'Users' },
    { path: '/host/billing', label: 'Facturation', icon: 'CreditCard' },
    { path: '/host/settings', label: 'Paramètres', icon: 'Settings' },
  ],
}

// Social links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/cleanair',
  linkedin: 'https://linkedin.com/company/cleanair',
  instagram: 'https://instagram.com/cleanair',
}

// Contact info
export const CONTACT = {
  email: 'contact@cleanair.fr',
  phone: '+33 1 23 45 67 89',
  address: 'Paris, France',
}

// Demo Cleaners pour le choix lors de la création de mission
// IDs utilisés pour le persona switcher
export const DEMO_CLEANERS = [
  {
    id: 'cleaner-paul',
    name: 'Paul D.',
    firstName: 'Paul',
    lastName: 'Dubois',
    fullName: 'Paul D.',
    email: 'paul@cleanair.fr',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating: 4.7,
    reviews: 47,
    missions: 47,
    badge: 'verified',
    badgeLabel: 'Vérifié',
    badgeColor: 'teal',
    zones: ['Paris 3e', 'Paris 4e', 'Paris 11e'],
    responseTime: '6h',
    priceModifier: 1.0,
    bio: 'Rigoureux et ponctuel, je m\'adapte à vos besoins. Expérience de 3 ans dans le ménage professionnel.',
    skills: ['Ménage complet', 'Repassage', 'Vitres'],
  },
  {
    id: 'cleaner-sophie',
    name: 'Sophie L.',
    firstName: 'Sophie',
    lastName: 'Laurent',
    fullName: 'Sophie L.',
    email: 'sophie@cleanair.fr',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.9,
    reviews: 127,
    missions: 127,
    badge: 'top',
    badgeLabel: 'Top Cleaner',
    badgeColor: 'amber',
    zones: ['Paris 4e', 'Paris 11e', 'Paris 12e'],
    responseTime: '2h',
    priceModifier: 1.15,
    bio: 'Professionnelle du ménage depuis 5 ans, je suis méticuleuse et attentive aux détails. Spécialisée dans les locations Airbnb.',
    skills: ['Ménage complet', 'Repassage', 'Vitres', 'Pressing'],
  },
  {
    id: 'cleaner-julie',
    name: 'Julie P.',
    firstName: 'Julie',
    lastName: 'Petit',
    fullName: 'Julie P.',
    email: 'julie@cleanair.fr',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.5,
    reviews: 12,
    missions: 12,
    badge: 'new',
    badgeLabel: 'Nouveau talent',
    badgeColor: 'sky',
    zones: ['Paris 11e', 'Paris 20e'],
    responseTime: '24h',
    priceModifier: 0.90,
    bio: 'Nouvelle sur la plateforme mais motivée ! Je suis étudiante et très sérieuse dans mon travail.',
    skills: ['Ménage complet'],
  },
]

// ID par défaut pour compatibilité
export const DEFAULT_CLEANER_ID = 'cleaner-paul'

// Trouver un cleaner par ID
export const getCleanerById = (id) => {
  return DEMO_CLEANERS.find(c => c.id === id) || DEMO_CLEANERS[0]
}

// Onboarding Steps for guided demo
export const ONBOARDING_STEPS = [
  { id: 'switch_role', label: 'Changer de rôle', icon: '🔄' },
  { id: 'create_mission', label: 'Créer une demande', icon: '📝' },
  { id: 'choose_cleaner', label: 'Choisir un cleaner', icon: '👤' },
  { id: 'view_as_cleaner', label: 'Voir côté cleaner', icon: '👀' },
  { id: 'complete_mission', label: 'Terminer la mission', icon: '✅' },
  { id: 'rate_cleaner', label: 'Noter le cleaner', icon: '⭐' },
]
