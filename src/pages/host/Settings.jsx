import { useState } from 'react'
import { Bell, Shield, Calendar, Link2, CreditCard, LogOut, Settings as SettingsIcon, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Toggle } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

function Settings() {
  const { user, logout } = useAuth()
  const { success: showSuccess, error: showError, info: showInfo } = useToast()
  const [activeTab, setActiveTab] = useState('calendar')

  const [notifications, setNotifications] = useState({
    bookingConfirmed: true,
    cleaningReminder: true,
    cleaningCompleted: true,
    paymentSent: true,
    messages: true,
    marketing: false,
  })

  const [calendars, setCalendars] = useState({
    airbnb: {
      url: 'https://www.airbnb.com/calendar/ical/12345.ics',
      synced: true,
      lastSync: '20 Jan 2025, 14:30',
    },
    booking: {
      url: '',
      synced: false,
      lastSync: null,
    },
  })

  const [airbnbUrl, setAirbnbUrl] = useState('')
  const [bookingUrl, setBookingUrl] = useState('')

  const tabs = [
    { id: 'calendar', label: 'Calendriers', icon: Calendar, color: 'accent' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'brand' },
    { id: 'payment', label: 'Paiement', icon: CreditCard, color: 'amber' },
    { id: 'security', label: 'Sécurité', icon: Shield, color: 'purple' },
  ]

  const colorMap = {
    brand: { bg: 'bg-brand-100', text: 'text-brand-600', border: 'border-brand-500' },
    accent: { bg: 'bg-accent-100', text: 'text-accent-600', border: 'border-accent-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
  }

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    showSuccess('Préférences mises à jour')
  }

  const syncCalendar = (type) => {
    const url = type === 'airbnb' ? airbnbUrl : bookingUrl
    if (!url) {
      showError('Veuillez entrer un lien iCal valide')
      return
    }
    
    setCalendars(prev => ({
      ...prev,
      [type]: {
        url,
        synced: true,
        lastSync: new Date().toLocaleString('fr-FR', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
      },
    }))
    showSuccess(`Calendrier ${type === 'airbnb' ? 'Airbnb' : 'Booking'} synchronisé !`)
    if (type === 'airbnb') setAirbnbUrl('')
    else setBookingUrl('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-surface-100 to-surface-200 rounded-2xl flex items-center justify-center">
          <SettingsIcon className="w-7 h-7 text-surface-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Paramètres
          </h1>
          <p className="text-surface-500">
            Gérez vos synchronisations et préférences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => {
          const colors = colorMap[tab.color]
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap',
                isActive 
                  ? cn(colors.bg, colors.text, 'shadow-sm')
                  : 'text-surface-500 hover:bg-surface-100'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="max-w-3xl">
        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <Card className="border-l-4 border-l-accent-500 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">Synchronisation calendrier</h2>
                <p className="text-sm text-surface-500">Connectez vos calendriers de réservation</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Airbnb */}
              <div className={cn(
                'p-5 rounded-2xl border-2 transition-all',
                calendars.airbnb.synced 
                  ? 'bg-gradient-to-br from-[#FF5A5F]/5 to-white border-[#FF5A5F]/20' 
                  : 'bg-surface-50 border-surface-200'
              )}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF5A5F] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF5A5F]/25">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900 text-lg">Airbnb</p>
                      {calendars.airbnb.synced ? (
                        <p className="text-sm text-green-600 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          Synchronisé • {calendars.airbnb.lastSync}
                        </p>
                      ) : (
                        <p className="text-sm text-surface-500">Non connecté</p>
                      )}
                    </div>
                  </div>
                  {calendars.airbnb.synced && (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-surface-500">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Badge className="bg-green-100 text-green-700 border-0">Actif</Badge>
                    </div>
                  )}
                </div>
                
                {!calendars.airbnb.synced && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Collez votre lien iCal Airbnb..."
                      value={airbnbUrl}
                      onChange={(e) => setAirbnbUrl(e.target.value)}
                      containerClassName="flex-1"
                    />
                    <Button onClick={() => syncCalendar('airbnb')} className="bg-[#FF5A5F] hover:bg-[#e54e52]">
                      Connecter
                    </Button>
                  </div>
                )}
              </div>

              {/* Booking */}
              <div className={cn(
                'p-5 rounded-2xl border-2 transition-all',
                calendars.booking.synced 
                  ? 'bg-gradient-to-br from-[#003580]/5 to-white border-[#003580]/20' 
                  : 'bg-surface-50 border-surface-200'
              )}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#003580] rounded-xl flex items-center justify-center shadow-lg shadow-[#003580]/25">
                      <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900 text-lg">Booking.com</p>
                      {calendars.booking.synced ? (
                        <p className="text-sm text-green-600 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          Synchronisé • {calendars.booking.lastSync}
                        </p>
                      ) : (
                        <p className="text-sm text-surface-500">Non connecté</p>
                      )}
                    </div>
                  </div>
                  {calendars.booking.synced && (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-surface-500">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Badge className="bg-green-100 text-green-700 border-0">Actif</Badge>
                    </div>
                  )}
                </div>
                
                {!calendars.booking.synced && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Collez votre lien iCal Booking..."
                      value={bookingUrl}
                      onChange={(e) => setBookingUrl(e.target.value)}
                      containerClassName="flex-1"
                    />
                    <Button onClick={() => syncCalendar('booking')} className="bg-[#003580] hover:bg-[#00254d]">
                      Connecter
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="mt-6 p-4 bg-gradient-to-br from-accent-50 to-brand-50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Link2 className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="font-semibold text-surface-900 mb-1">Où trouver mon lien iCal ?</p>
                  <div className="text-sm text-surface-600 space-y-1">
                    <p className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#FF5A5F] text-white rounded text-xs flex items-center justify-center font-bold">A</span>
                      Calendrier → Paramètres → Exporter
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#003580] text-white rounded text-xs flex items-center justify-center font-bold">B</span>
                      Paramètres → Synchronisation calendrier
                    </p>
                  </div>
                  <button onClick={() => showInfo('Guide complet disponible prochainement 📖')} className="inline-flex items-center gap-1 text-brand-600 text-sm font-medium mt-2 hover:text-brand-700">
                    Guide complet <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card className="border-l-4 border-l-brand-500 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">Notifications</h2>
                <p className="text-sm text-surface-500">
                  {Object.values(notifications).filter(Boolean).length} activées sur {Object.values(notifications).length}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { key: 'bookingConfirmed', label: 'Réservation confirmée', desc: 'Quand un cleaner accepte votre demande', icon: '✅' },
                { key: 'cleaningReminder', label: 'Rappel de ménage', desc: '24h avant chaque ménage prévu', icon: '⏰' },
                { key: 'cleaningCompleted', label: 'Ménage terminé', desc: 'Quand le cleaner termine la prestation', icon: '✨' },
                { key: 'paymentSent', label: 'Paiement envoyé', desc: 'Confirmation de paiement', icon: '💳' },
                { key: 'messages', label: 'Messages', desc: 'Nouveaux messages des cleaners', icon: '💬' },
                { key: 'marketing', label: 'Actualités CleanAir', desc: 'Nouveautés et conseils', icon: '📣' },
              ].map((item) => (
                <div 
                  key={item.key} 
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl transition-all',
                    notifications[item.key] ? 'bg-brand-50/50' : 'bg-surface-50 hover:bg-surface-100'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-surface-900">{item.label}</p>
                      <p className="text-sm text-surface-500">{item.desc}</p>
                    </div>
                  </div>
                  <Toggle 
                    checked={notifications[item.key]} 
                    onChange={() => toggleNotification(item.key)}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <Card className="border-l-4 border-l-amber-500 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">Moyens de paiement</h2>
                <p className="text-sm text-surface-500">Gérez vos cartes bancaires</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Card Visual */}
              <div className="relative p-6 bg-gradient-to-br from-surface-800 via-surface-900 to-surface-800 rounded-2xl text-white overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-10">
                    <p className="text-surface-400 text-sm">Carte principale</p>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-amber-500 rounded-sm opacity-80" />
                      <div className="w-8 h-5 bg-red-500 rounded-sm opacity-80 -ml-3" />
                    </div>
                  </div>
                  <p className="font-mono text-xl tracking-[0.25em] mb-6">•••• •••• •••• 4242</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-surface-400 text-xs mb-0.5">Titulaire</p>
                      <p className="font-medium">MARIE DUPONT</p>
                    </div>
                    <div>
                      <p className="text-surface-400 text-xs mb-0.5">Expire</p>
                      <p className="font-medium">12/26</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1 hover-lift">
                  Modifier la carte
                </Button>
                <Button variant="secondary" className="hover-lift">
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Billing info */}
            <div className="mt-6 p-4 bg-surface-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-surface-900">Adresse de facturation</p>
                  <p className="text-sm text-surface-500">15 Rue de la Paix, 75002 Paris</p>
                </div>
                <Button variant="ghost" size="sm">
                  Modifier
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card className="border-l-4 border-l-purple-500 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">Sécurité</h2>
                <p className="text-sm text-surface-500">Protégez votre compte</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface-50 rounded-xl flex items-center justify-between hover:bg-surface-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🔐</span>
                  </div>
                  <div>
                    <p className="font-medium text-surface-900">Mot de passe</p>
                    <p className="text-sm text-surface-500">Dernière modification il y a 3 mois</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Modifier
                </Button>
              </div>

              <div className="p-4 bg-surface-50 rounded-xl flex items-center justify-between hover:bg-surface-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <p className="font-medium text-surface-900">Vérification en deux étapes</p>
                    <p className="text-sm text-amber-600">Non activée</p>
                  </div>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  Activer
                </Button>
              </div>

              <div className="p-4 bg-surface-50 rounded-xl flex items-center justify-between hover:bg-surface-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <p className="font-medium text-surface-900">Email de récupération</p>
                    <p className="text-sm text-surface-500">m***e@gmail.com</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Modifier
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-xl flex items-center gap-4 border border-green-200">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Compte vérifié</p>
                  <p className="text-sm text-green-600">Votre identité a été vérifiée le 15 Jan 2025</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="mt-6 border-2 border-red-200 bg-red-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-red-700">Zone de danger</h2>
              <p className="text-sm text-red-600/70">Actions irréversibles</p>
            </div>
            <Button 
              variant="danger" 
              icon={LogOut} 
              onClick={logout}
              className="bg-red-500 hover:bg-red-600"
            >
              Déconnexion
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings
