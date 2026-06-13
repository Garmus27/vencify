import type { Product, Branch, AlertStatus } from '../types'
import { getDaysRemaining, formatDate } from '../utils/dates'
import { getAlertStatusLabel, getStatusBgClass } from '../utils/labels'

interface Props {
  product: Product
  branch: Branch | undefined
  onRemove: (id: string) => void
}

export default function ProductCard({ product, branch, onRemove }: Props) {
  const criticalDays = branch?.criticalDays ?? 0
  const warningDays = branch?.warningDays ?? 1

  const { days, status } = getDaysRemaining(
    product.expiryDate,
    criticalDays,
    warningDays,
  )

  return (
    <article
      className={`rounded-2xl p-5 ${getStatusBgClass(status)}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-bold text-white">
            {product.name}
          </h3>
          {branch && (
            <p className="mt-1 text-base text-gray-400">
              {branch.chain} — {branch.name}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-lg text-gray-300">
            <span>Cód: {product.barcode}</span>
            <span>Vto: {formatDate(product.expiryDate)}</span>
            <span>Cant: {product.quantity}u</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <DaysBadge days={days} status={status} />
          <button
            onClick={() => onRemove(product.id)}
            className="btn-danger whitespace-nowrap"
          >
            Vendido
          </button>
        </div>
      </div>
    </article>
  )
}

function DaysBadge({ days, status }: { days: number; status: AlertStatus }) {
  const colorClass =
    status === 'critical'
      ? 'text-danger'
      : status === 'warning'
        ? 'text-warning'
        : 'text-gray-400'

  return (
    <span className={`whitespace-nowrap text-right text-base font-black ${colorClass}`}>
      {days <= 0
        ? `VENCIDO (${Math.abs(days)}d)`
        : days === 1
          ? 'Vence MAÑANA'
          : `${days} días`}
      <br />
      <span className="text-xs uppercase tracking-wider">
        {getAlertStatusLabel(status)}
      </span>
    </span>
  )
}
