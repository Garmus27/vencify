import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { sortByPriority } from '../utils/dates'

export default function Branches() {
  const { state, dispatch } = useApp()

  const branchStats = useMemo(() => {
    return state.branches.map((b) => {
      const branchProducts = state.products.filter(
        (p) => p.branchId === b.id && !p.removedAt,
      )
      return {
        branch: b,
        total: branchProducts.length,
        urgent: branchProducts.filter((p) => {
          const expiry = new Date(p.expiryDate).getTime()
          const now = Date.now()
          const days = Math.round((expiry - now) / (1000 * 60 * 60 * 24))
          return days <= b.warningDays
        }).length,
      }
    })
  }, [state.branches, state.products])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Sucursales</h1>
        <Link
          to="/branches/new"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-2xl text-white active:bg-blue-700"
        >
          +
        </Link>
      </div>

      {branchStats.length === 0 ? (
        <div className="mt-12 text-center text-gray-500">
          <p className="text-xl font-semibold">No hay sucursales</p>
          <p className="mt-2 text-base">Tocá el botón + para crear una.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {branchStats.map(({ branch, total, urgent }) => (
            <Link
              key={branch.id}
              to={`/branches/${branch.id}`}
              className="rounded-2xl bg-gray-900 p-5 active:bg-gray-800 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-blue-400">{branch.chain}</p>
                  <h2 className="truncate text-xl font-bold text-white">
                    {branch.name}
                  </h2>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-xl font-bold text-warning">{urgent}</p>
                    <p className="text-sm text-gray-500">Urgentes</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-300">{total}</p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-base text-gray-500">
                <span>⚠️ {branch.warningDays}d</span>
                <span>🔴 {branch.criticalDays}d</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
