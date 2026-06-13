import type { AlertStatus } from '../types'

export function getAlertStatusLabel(status: AlertStatus): string {
  switch (status) {
    case 'critical':
      return 'Crítico'
    case 'warning':
      return 'Advertencia'
    case 'ok':
      return 'OK'
  }
}

export function getStatusBgClass(status: AlertStatus): string {
  switch (status) {
    case 'critical':
      return 'bg-danger/15 border-2 border-danger/40'
    case 'warning':
      return 'bg-warning/15 border-2 border-warning/40'
    case 'ok':
      return 'bg-gray-800/50 border border-gray-700'
  }
}

export function getStatusBadgeClass(status: AlertStatus): string {
  switch (status) {
    case 'critical':
      return 'bg-danger text-white'
    case 'warning':
      return 'bg-warning text-black'
    case 'ok':
      return 'bg-gray-600 text-white'
  }
}

export function getChainSuggestions(): string[] {
  return [
    'VEA',
    'Carrefour',
    'Coto',
    'Dia',
    'Disco',
    'Jumbo',
    'La Anonima',
    'Libertad',
    'Makro',
    'Maxiconsumo',
    'Nini',
    'Plaza Vea',
    'Supermercados Toledo',
    'Walmart',
    'Changomas',
    'Fácil',
    'Hipermás',
    'Cordiez',
    'Súper Mami',
    'Diarco',
  ]
}
