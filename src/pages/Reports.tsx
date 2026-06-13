import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { getDaysRemaining, formatDate } from '../utils/dates'
import { getAlertStatusLabel, getStatusBadgeClass } from '../utils/labels'
import { exportToCSV } from '../utils/export'

export default function Reports() {
  const { state } = useApp()

  const branchMap = useMemo(
    () => new Map(state.branches.map((b) => [b.id, b])),
    [state.branches],
  )

  const activeProducts = useMemo(
    () => state.products.filter((p) => !p.removedAt),
    [state.products],
  )

  const removedProducts = useMemo(
    () =>
      state.products
        .filter((p) => p.removedAt)
        .sort(
          (a, b) =>
            new Date(b.removedAt!).getTime() - new Date(a.removedAt!).getTime(),
        ),
    [state.products],
  )

  const stats = useMemo(() => {
    let critical = 0
    let warning = 0

    for (const p of activeProducts) {
      const branch = branchMap.get(p.branchId)
      if (!branch) continue
      const { status } = getDaysRemaining(
        p.expiryDate,
        branch.criticalDays,
        branch.warningDays,
      )
      if (status === 'critical') critical++
      if (status === 'warning') warning++
    }

    return {
      total: activeProducts.length,
      critical,
      warning,
      removed: removedProducts.length,
    }
  }, [activeProducts, removedProducts, branchMap])

  function handleExport() {
    const allProducts = state.products.filter((p) => !p.removedAt)
    exportToCSV(allProducts, state.branches)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Reportes</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gray-900 p-5 text-center">
          <p className="text-4xl font-bold text-white">{stats.total}</p>
          <p className="mt-1 text-base font-semibold text-gray-400">Activos</p>
        </div>
        <div className="rounded-2xl bg-gray-900 p-5 text-center">
          <p className="text-4xl font-bold text-gray-400">{stats.removed}</p>
          <p className="mt-1 text-base font-semibold text-gray-400">Retirados</p>
        </div>
        <div className="rounded-2xl bg-danger/10 p-5 text-center">
          <p className="text-4xl font-bold text-danger">{stats.critical}</p>
          <p className="mt-1 text-base font-semibold text-gray-400">Críticos</p>
        </div>
        <div className="rounded-2xl bg-warning/10 p-5 text-center">
          <p className="text-4xl font-bold text-warning">{stats.warning}</p>
          <p className="mt-1 text-base font-semibold text-gray-400">Advertencia</p>
        </div>
      </div>

      <button
        onClick={handleExport}
        className="btn-primary flex items-center justify-center gap-3"
      >
        📥 Exportar a Excel (CSV)
      </button>

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">
          Historial de Retirados
        </h2>

        {removedProducts.length === 0 ? (
          <p className="text-center text-lg text-gray-500">
            No hay productos retirados aún.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {removedProducts.map((p) => {
              const branch = branchMap.get(p.branchId)
              return (
                <div
                  key={p.id}
                  className="rounded-2xl bg-gray-900/60 px-5 py-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">{p.name}</p>
                      <p className="text-base text-gray-500">
                        {branch?.chain} — {branch?.name}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {p.removedAt
                        ? formatDate(p.removedAt)
                        : ''}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4 text-base text-gray-500">
                    <span>Cód: {p.barcode}</span>
                    <span>Vto: {formatDate(p.expiryDate)}</span>
                    <span>Cant: {p.quantity}u</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
