import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { sortByPriority } from '../utils/dates'
import ProductCard from '../components/ProductCard'

export default function Dashboard() {
  const { state, dispatch } = useApp()
  const [filterBranchId, setFilterBranchId] = useState<string>('')

  const branchMap = useMemo(
    () => new Map(state.branches.map((b) => [b.id, b])),
    [state.branches],
  )

  const activeProducts = useMemo(() => {
    let filtered = state.products.filter((p) => !p.removedAt)

    if (filterBranchId) {
      filtered = filtered.filter((p) => p.branchId === filterBranchId)
    }

    return sortByPriority(filtered) as typeof filtered
  }, [state.products, filterBranchId])

  const stats = useMemo(() => {
    const critical = activeProducts.filter((p) => {
      const branch = branchMap.get(p.branchId)
      if (!branch) return false
      const expiry = new Date(p.expiryDate).getTime()
      const now = Date.now()
      const days = Math.round((expiry - now) / (1000 * 60 * 60 * 24))
      return days <= branch.criticalDays
    }).length

    const warning = activeProducts.filter((p) => {
      const branch = branchMap.get(p.branchId)
      if (!branch) return false
      const expiry = new Date(p.expiryDate).getTime()
      const now = Date.now()
      const days = Math.round((expiry - now) / (1000 * 60 * 60 * 24))
      return days > branch.criticalDays && days <= branch.warningDays
    }).length

    return { total: activeProducts.length, critical, warning }
  }, [activeProducts, branchMap])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Panel de Urgencias</h1>
        <span className="text-base text-gray-400">
          {stats.total} productos
        </span>
      </div>

      <div className="flex gap-4 rounded-2xl bg-gray-900 p-5">
        <div className="flex-1 text-center">
          <p className="text-3xl font-bold text-danger">{stats.critical}</p>
          <p className="mt-1 text-sm font-semibold text-gray-400">Críticos</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-3xl font-bold text-warning">{stats.warning}</p>
          <p className="mt-1 text-sm font-semibold text-gray-400">Advertencia</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-3xl font-bold text-gray-300">{stats.total}</p>
          <p className="mt-1 text-sm font-semibold text-gray-400">Total</p>
        </div>
      </div>

      {state.branches.length > 1 && (
        <select
          value={filterBranchId}
          onChange={(e) => setFilterBranchId(e.target.value)}
          className="input-field py-4 text-lg"
        >
          <option value="">Todas las sucursales</option>
          {state.branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.chain} — {b.name}
            </option>
          ))}
        </select>
      )}

      {activeProducts.length === 0 ? (
        <div className="mt-12 text-center text-gray-500">
          <p className="text-xl font-semibold">No hay productos activos</p>
          <p className="mt-2 text-base">
            Agregá productos desde una sucursal para verlos aquí.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              branch={branchMap.get(p.branchId)}
              onRemove={(id) =>
                dispatch({ type: 'REMOVE_PRODUCT', payload: id })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
