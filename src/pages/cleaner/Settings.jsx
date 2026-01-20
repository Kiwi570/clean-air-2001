import { useState } from 'react'
import { Bell, Shield, MapPin, Clock, CreditCard, LogOut, Settings as SettingsIcon, ChevronRight, Search, AlertTriangle, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { DAYS } from '@/lib/constants'
import { cn } from '@/lib/utils'

function Settings() {
  const { user, logout } = useAuth()
  const { success: showSuccess } = useToast()
  const [activeTab, setActiveTab] = useState('notifications')
  const [zoneSearch, setZoneSearch] = useState('')

  const [notifications, setNotifications] = useState({
    newMissions: true,
    missionReminder: true,
    paymentReceived: true,
    messages: true,
    marketing: false,
  })

  const [availability, setAvailability] = useState({
    lun: { enabled: true, start: '08:00', end: '18:00' },
    mar: { enabled: true, start: '08:00', end: '18:00' },
    mer: { enabled: true, start: '08:00', end: '18:00' },
    jeu: { enabled: true, start: '08:00', end: '18:00' },
    ven: { enabled: true, start: '08:00', end: '18:00' },
    sam: { enabled: false, start: '09:00', end: '14:00' },
    dim: { enabled: false, start: '09:00', end: '14:00' },
  })

  const [selectedZones, setSelectedZones] = useState(['Paris 3e', 'Paris 4e', 'Paris 11e', 'Paris 10e'])

  const zoneGroups = [
    { name: 'Centre', zones: ['Paris 1er', 'Paris 2e', 'Paris 3e', 'Paris 4e', 'Paris 5e'] },
    { name: 'Ouest', zones: ['Paris 6e', 'Paris 7e', 'Paris 8e', 'Paris 9e'] },
    { name: 'Est', zones: ['Paris 10e', 'Paris 11e', 'Paris 12e'] },
    { name: 'Sud', zones: ['Paris 13e', 'Paris 14e', 'Paris 15e'] },
    { name: 'Nord', zones: ['Paris 16e', 'Paris 17e', 'Paris 18e', 'Paris 19e', 'Paris 20e'] },
  ]

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'brand' },
    { id: 'availability', label: 'Disponibilités', icon: Clock, color: 'accent' },
    { id: 'zones', label: 'Zones', icon: MapPin, color: 'green' },
    { id: 'payment', label: 'Paiement', icon: CreditCard, color: 'amber' },
    { id: 'security', label: 'Sécurité', icon: Shield, color: 'purple' },
  ]

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    showSuccess('Préférences mises à jour')
  }

  const toggleDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }))
  }

  const toggleZone = (zone) => {
    setSelectedZones(prev => 
      prev.includes(zone) 
        ? prev.filter(z => z !== zone)
        : [...prev, zone]
    )
  }

  const filteredGroups = zoneGroups.map(group => ({
    ...group,
    zones: group.zones.filter(z => z.toLowerCase().includes(zoneSearch.toLowerCase()))
  })).filter(group => group.zones.length > 0)

  const colorMap = {
    brand: { bg: 'bg-brand-100', text: 'text-brand-600', border: 'border-brand-500' },
    accent: { bg: 'bg-accent-100', text: 'text-accent-600', border: 'border-accent-500' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
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
            Gérez vos préférences et paramètres de compte
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
                { key: 'newMissions', label: 'Nouvelles missions', desc: 'Quand une mission est disponible dans vos zones', icon: '🎯' },
                { key: 'missionReminder', label: 'Rappels de mission', desc: '24h et 1h avant vos missions', icon: '⏰' },
                { key: 'paymentReceived', label: 'Paiements reçus', desc: 'Quand un paiement est effectué', icon: '💰' },
                { key: 'messages', label: 'Messages', desc: 'Nouveaux messages des hôtes', icon: '💬' },
                { key: 'marketing', label: 'Actualités CleanAir', desc: 'Nouveautés et offres spéciales', icon: '📣' },
              ].map((item, index) => (
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

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <Card className="border-l-4 border-l-accent-500 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">Disponibilités</h2>
                <p className="text-sm text-surface-500">
                  {Object.values(availability).filter(d => d.enabled).length} jours actifs
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {DAYS.map((day) => {
                const isEnabled = availability[day.value].enabled
                return (
                  <div 
                    key={day.value}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl transition-all',
                      isEnabled ? 'bg-accent-50/50' : 'bg-surface-50'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleDay(day.value)}
                        className={cn(
                          'w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all',
                          isEnabled 
                            ? 'bg-accent-500 border-accent-500 text-white shadow-lg shadow-accent-500/25' 
                            : 'border-surface-300 hover:border-surface-400'
                        )}
                      >
                        {isEnabled && <Check className="w-4 h-4" />}
                      </button>
                      <span className={cn(
                        'font-medium min-w-[80px]',
                        isEnabled ? 'text-surface-900' : 'text-surface-400 line-through'
                      )}>
                        {day.label}
                      </span>
                    </div>
                    
                    {isEnabled ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-surface-200">
                          <input
                            type="time"
                            value={availability[day.value].start}
                            onChange={(e) => setAvailability(prev => ({
                              ...prev,
                              [day.value]: { ...prev[day.value], start: e.target.value }
                            }))}
                            className="bg-transparent text-sm font-medium text-surface-700 focus:outline-none w-20"
                          />
                        </div>
                        <span className="text-surface-400 font-medium">→</span>
                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-surface-200">
                          <input
                            type="time"
                            value={availability[day.value].end}
                            onChange={(e) => setAvailability(prev => ({
                              ...prev,
                              [day.value]: { ...prev[day.value], end: e.target.value }
                            }))}
                            className="bg-transparent text-sm font-medium text-surface-700 focus:outline-none w-20"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-surface-400 italic">Non disponible</span>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Zones Tab */}
        {activeTab === 'zones' && (
          <Card className="border-l-4 border-l-green-500 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">Zones d'intervention</h2>
                <p className="text-sm text-surface-500">{selectedZones.length} arrondissements sélectionnés</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Rechercher un arrondissement..."
                value={zoneSearch}
                onChange={(e) => setZoneSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* Zone Groups */}
            <div className="space-y-6">
              {filteredGroups.map((group) => (
                <div key={group.name}>
                  <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3">
                    {group.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {group.zones.map((zone) => {
                      const isSelected = selectedZones.includes(zone)
                      return (
                        <button
                          key={zone}
                          onClick={() => toggleZone(zone)}
                          className={cn(
                            'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all',
                            isSelected
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                          )}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                          {zone}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected summary */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span className="font-medium">{selectedZones.length} zones sélectionnées</span>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setSelectedZones([])}
                className="text-green-700 hover:bg-green-100"
              >
                Tout désélectionner
              </Button>
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
                <h2 className="text-lg font-semibold text-surface-900">Informations bancaires</h2>
                <p className="text-sm text-surface-500">Configurez votre compte pour recevoir vos paiements</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-surface-800 to-surface-900 rounded-2xl text-white">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-surface-400 text-sm">Compte principal</p>
                  <Badge className="bg-green-500/20 text-green-400 border-0">Vérifié</Badge>
                </div>
                <p className="font-mono text-lg tracking-wider mb-2">FR76 •••• •••• •••• 4521</p>
                <p className="text-surface-400 text-sm">Vincent Martin</p>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1 hover-lift">
                  Modifier le RIB
                </Button>
                <Button variant="secondary" className="hover-lift">
                  <ChevronRight className="w-5 h-5" />
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
            </div>
          </Card>
        )}

        {/* Danger Zone - Always visible */}
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
