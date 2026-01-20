import { useState } from 'react'
import { Euro, CreditCard, Download, CheckCircle, Clock, FileText } from 'lucide-react'
import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

function Billing() {
  const [period, setPeriod] = useState('month')

  const stats = {
    month: {
      total: 420,
      cleanings: 8,
      avgPerCleaning: 52.5,
    },
    year: {
      total: 4850,
      cleanings: 94,
      avgPerCleaning: 51.6,
    },
  }

  const currentStats = stats[period]

  const invoices = [
    {
      id: 'INV-2025-001',
      date: '2025-01-20',
      property: 'Studio Marais',
      cleaner: 'Paul D.',
      amount: 55,
      status: 'paid',
    },
    {
      id: 'INV-2025-002',
      date: '2025-01-18',
      property: 'Appartement Bastille',
      cleaner: 'Paul D.',
      amount: 72,
      status: 'paid',
    },
    {
      id: 'INV-2025-003',
      date: '2025-01-15',
      property: 'Loft Oberkampf',
      cleaner: 'Sophie D.',
      amount: 95,
      status: 'paid',
    },
    {
      id: 'INV-2025-004',
      date: '2025-01-21',
      property: 'Appartement Bastille',
      cleaner: 'Paul D.',
      amount: 72,
      status: 'pending',
    },
  ]

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Facturation
          </h1>
          <p className="text-surface-500 mt-1">
            Gérez vos paiements et factures
          </p>
        </div>

        <Button variant="secondary" icon={Download}>
          Exporter
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2">
        {[
          { value: 'month', label: 'Ce mois' },
          { value: 'year', label: 'Cette année' },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              'px-4 py-2 rounded-xl font-medium transition-all',
              period === p.value
                ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Euro className="w-5 h-5" />
            </div>
            <span className="text-accent-100 text-sm">Total dépensé</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(currentStats.total)}</p>
        </Card>

        <StatCard
          icon={FileText}
          label="Ménages facturés"
          value={currentStats.cleanings}
        />

        <StatCard
          icon={Euro}
          label="Coût moyen / ménage"
          value={formatCurrency(currentStats.avgPerCleaning)}
        />
      </div>

      {/* Payment Methods - Premium Card Visual */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-surface-900">
            Moyen de paiement
          </h2>
          <Button variant="secondary" size="sm">
            Modifier
          </Button>
        </div>

        {/* Credit Card Visual */}
        <div className="relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-2xl overflow-hidden mb-6 group">
          {/* Card Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
          
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-accent-500/10 rounded-full blur-xl" />
          
          {/* Card Content */}
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Top Row - Chip & Logo */}
            <div className="flex items-start justify-between">
              {/* Chip */}
              <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                <div className="w-8 h-6 border border-amber-600/30 rounded-sm" />
              </div>
              {/* Visa Logo */}
              <div className="text-white font-bold text-xl italic tracking-wider">VISA</div>
            </div>

            {/* Card Number */}
            <div className="text-white/90 text-lg tracking-[0.25em] font-mono">
              •••• •••• •••• 4242
            </div>

            {/* Bottom Row - Name & Expiry */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Titulaire</p>
                <p className="text-white font-medium tracking-wide">MARIE DUPONT</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Expire</p>
                <p className="text-white font-medium">12/26</p>
              </div>
            </div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Card Info */}
        <div className="flex items-center justify-center gap-4">
          <Badge variant="success" size="sm">Carte par défaut</Badge>
          <span className="text-sm text-surface-500">Dernière utilisation : aujourd'hui</span>
        </div>
      </Card>

      {/* Invoices */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">
            Historique des factures
          </h2>
          <Badge variant="default">{invoices.length} factures</Badge>
        </div>

        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 bg-surface-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  invoice.status === 'paid' ? 'bg-green-100' : 'bg-amber-100'
                )}>
                  {invoice.status === 'paid' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-surface-900">{invoice.property}</p>
                  <p className="text-sm text-surface-500">
                    {invoice.cleaner} • {formatDate(invoice.date, { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-surface-900">{formatCurrency(invoice.amount)}</p>
                  <p className="text-sm text-surface-500">{invoice.id}</p>
                </div>
                <Button variant="ghost" size="sm" icon={Download}>
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Billing Info */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">
            Informations de facturation
          </h2>
          <Button variant="secondary" size="sm">
            Modifier
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-surface-500 mb-1">Nom / Société</p>
            <p className="font-medium text-surface-900">Vincent Martin</p>
          </div>
          <div>
            <p className="text-sm text-surface-500 mb-1">Email de facturation</p>
            <p className="font-medium text-surface-900">marie@example.com</p>
          </div>
          <div>
            <p className="text-sm text-surface-500 mb-1">Adresse</p>
            <p className="font-medium text-surface-900">15 Rue de Rivoli, 75001 Paris</p>
          </div>
          <div>
            <p className="text-sm text-surface-500 mb-1">N° TVA (optionnel)</p>
            <p className="font-medium text-surface-500">Non renseigné</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Billing
