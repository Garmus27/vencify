import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { sortByPriority } from '../utils/dates'
import ProductCard from '../components/ProductCard'
import AddProductForm from '../components/AddProductForm'

export default function BranchDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const branch = useMemo(
    () => state.branches.find((b) => b.id === id),
    [state.branches, id],
  )

  const activeProducts = useMemo(() => {
    if (!id) return []
    const filtered = state.products.filter(
      (p) => p.branchId === id && !p.removedAt,
    )
    return sortByPriority(filtered) as typeof filtered
  }, [state.products, id])

  if (!branch) {
    return (
      <div className="mt-12 text-center text-gray-500">
        <p className="text-xl font-semibold">Sucursal no encontrada</p>
        <Link to="/branches" className="mt-3 inline-block text-lg text-blue-400 underline">
          Volver a sucursales
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/branches')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-xl text-gray-300"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-blue-400">{branch.chain}</p>
          <h1 className="truncate text-2xl font-bold text-white">
            {branch.name}
          </h1>
        </div>
      </div>

      <div className="flex gap-3 rounded-2xl bg-gray-900 p-4 text-base">
        <span className="rounded-xl bg-warning/20 px-4 py-2 font-bold text-warning">
          ⚠️ Alerta: {branch.warningDays} días
        </span>
        <span className="rounded-xl bg-danger/20 px-4 py-2 font-bold text-danger">
          🔴 Crítico: {branch.criticalDays} días
        </span>
      </div>

      <details className="rounded-2xl bg-gray-900">
        <summary className="cursor-pointer px-5 py-4 text-lg font-bold text-blue-400 active:bg-gray-800 rounded-2xl">
          + Registrar producto
        </summary>
        <div className="border-t border-gray-800 px-5 pb-5 pt-4">
          <AddProductForm
            onSave={(data) => {
              dispatch({
                type: 'ADD_PRODUCT',
                payload: {
                  ...data,
                  branchId: branch.id,
                  id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
                  createdAt: new Date().toISOString(),
                  removedAt: null,
                },
              })
            }}
          />
        </div>
      </details>

      {activeProducts.length === 0 ? (
        <div className="mt-6 text-center text-gray-500">
          <p className="text-xl font-semibold">No hay productos en esta sucursal</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              branch={branch}
              onRemove={(productId) =>
                dispatch({ type: 'REMOVE_PRODUCT', payload: productId })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
