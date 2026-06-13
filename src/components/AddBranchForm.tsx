import { useState } from 'react'
import { useBranches } from '../context/AppContext'
import { getChainSuggestions } from '../utils/labels'
import { useNavigate } from 'react-router-dom'

export default function AddBranchForm() {
  const navigate = useNavigate()
  const { addBranch } = useBranches()

  const [chain, setChain] = useState('')
  const [name, setName] = useState('')
  const [warningDays, setWarningDays] = useState('15')
  const [criticalDays, setCriticalDays] = useState('5')

  const [showChainSuggestions, setShowChainSuggestions] = useState(false)
  const suggestions = getChainSuggestions().filter((s) =>
    s.toLowerCase().includes(chain.toLowerCase()),
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chain.trim() || !name.trim()) return

    const warning = parseInt(warningDays, 10)
    const critical = parseInt(criticalDays, 10)

    addBranch({
      chain: chain.trim(),
      name: name.trim(),
      warningDays: Math.max(warning, critical + 1),
      criticalDays: Math.max(critical, 0),
    })
    navigate('/branches')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="relative">
        <label className="mb-2 block text-base font-bold text-gray-300">
          Cadena
        </label>
        <input
          type="text"
          value={chain}
          onChange={(e) => {
            setChain(e.target.value)
            setShowChainSuggestions(true)
          }}
          onFocus={() => setShowChainSuggestions(true)}
          placeholder="ej. VEA, Carrefour..."
          className="input-field"
          autoComplete="off"
        />
        {showChainSuggestions && suggestions.length > 0 && chain.length > 0 && (
          <ul className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-2xl border border-gray-700 bg-gray-800">
            {suggestions.map((s) => (
              <li
                key={s}
                onClick={() => {
                  setChain(s)
                  setShowChainSuggestions(false)
                }}
                className="cursor-pointer px-5 py-3 text-lg text-white hover:bg-gray-700"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        {showChainSuggestions && chain.length > 0 && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowChainSuggestions(false)}
          />
        )}
      </div>

      <div>
        <label className="mb-2 block text-base font-bold text-gray-300">
          Nombre de Sucursal
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. Sucursal 14 - Maipú"
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-base font-bold text-gray-300">
            Días Advertencia (Amarillo)
          </label>
          <input
            type="number"
            value={warningDays}
            onChange={(e) => setWarningDays(e.target.value)}
            min={1}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-2 block text-base font-bold text-gray-300">
            Días Crítico (Rojo)
          </label>
          <input
            type="number"
            value={criticalDays}
            onChange={(e) => setCriticalDays(e.target.value)}
            min={0}
            className="input-field"
          />
        </div>
      </div>

      <p className="text-base text-gray-500">
        Los días críticos deben ser menores a los días de advertencia.
      </p>

      <button type="submit" className="btn-primary mt-2">
        Guardar Sucursal
      </button>
    </form>
  )
}
