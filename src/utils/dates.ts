import type { AlertStatus, DaysRemaining } from '../types'

/**
 * Calcula los días calendario entre la fecha actual y la fecha de vencimiento.
 * Si la fecha ya pasó, devuelve un número negativo.
 */
export function getDaysUntilExpiry(expiryDate: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  const diff = expiry.getTime() - now.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

/**
 * Determina el estado de alerta de un producto según los umbrales de la sucursal.
 *
 * Lógica:
 * - Si días faltantes <= días críticos → 'critical' (Rojo)
 * - Si días faltantes <= días de advertencia → 'warning' (Amarillo)
 * - En caso contrario → 'ok' (Verde / sin alerta)
 */
export function getAlertStatus(
  daysUntilExpiry: number,
  criticalDays: number,
  warningDays: number,
): AlertStatus {
  if (daysUntilExpiry <= criticalDays) return 'critical'
  if (daysUntilExpiry <= warningDays) return 'warning'
  return 'ok'
}

/**
 * Función compuesta que devuelve los días restantes y el estado de alerta
 * en un solo llamado.
 */
export function getDaysRemaining(
  expiryDate: string,
  criticalDays: number,
  warningDays: number,
): DaysRemaining {
  const days = getDaysUntilExpiry(expiryDate)
  return {
    days,
    status: getAlertStatus(days, criticalDays, warningDays),
  }
}

/**
 * Formatea una fecha ISO a formato legible DD/MM/AAAA
 */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Ordena productos por prioridad: los que vencen primero (menos días restantes)
 * aparecen al inicio. Los productos vencidos (días negativos) van primero.
 */
export function sortByPriority(
  products: { expiryDate: string }[],
): { expiryDate: string }[] {
  return [...products].sort((a, b) => {
    const daysA = getDaysUntilExpiry(a.expiryDate)
    const daysB = getDaysUntilExpiry(b.expiryDate)
    return daysA - daysB
  })
}
