import type { Product, Branch } from '../types'
import { getDaysRemaining, formatDate } from './dates'
import { getAlertStatusLabel } from './labels'

function sanitizeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportToCSV(products: Product[], branches: Branch[]): void {
  const branchMap = new Map(branches.map((b) => [b.id, b]))

  const header = [
    'Cadena',
    'Sucursal',
    'Código de Barras',
    'Producto',
    'Fecha Vencimiento',
    'Cantidad',
    'Estado de Alerta',
  ]

  const rows = products.map((p) => {
    const branch = branchMap.get(p.branchId)
    const days = getDaysRemaining(p.expiryDate, branch?.criticalDays ?? 0, branch?.warningDays ?? 0)
    return [
      branch?.chain ?? '',
      branch?.name ?? '',
      p.barcode,
      p.name,
      formatDate(p.expiryDate),
      String(p.quantity),
      getAlertStatusLabel(days.status),
    ].map(sanitizeCSV).join(',')
  })

  const csv = [header.join(','), ...rows].join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vencimientos_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
