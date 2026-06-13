import { useState, useCallback } from 'react'
import { getBarcodeHistory } from '../utils/storage'

interface Props {
  onSave: (data: {
    barcode: string
    name: string
    expiryDate: string
    quantity: number
  }) => void
}

export default function AddProductForm({ onSave }: Props) {
  const [barcode, setBarcode] = useState('')
  const [name, setName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const autoCompleteName = useCallback((code: string) => {
    if (code.length >= 3) {
      const history = getBarcodeHistory()
      const cachedName = history.get(code)
      if (cachedName) {
        setName(cachedName)
      }
    }
  }, [])

  function handleBarcodeChange(value: string) {
    const numeric = value.replace(/\D/g, '')
    setBarcode(numeric)
    autoCompleteName(numeric)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!barcode.trim() || !name.trim() || !expiryDate || !quantity) return

    onSave({
      barcode: barcode.trim(),
      name: name.trim(),
      expiryDate,
      quantity: parseInt(quantity, 10),
    })

    setBarcode('')
    setName('')
    setExpiryDate('')
    setQuantity('1')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-2 block text-base font-bold text-gray-300">
          Código de Barras
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={barcode}
          onChange={(e) => {
            handleBarcodeChange(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Ingresar código manualmente"
          className="input-field"
          autoComplete="off"
        />
      </div>

      <div className="relative">
        <label className="mb-2 block text-base font-bold text-gray-300">
          Nombre / Descripción del Producto
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. Leche La Serenísima"
          className="input-field"
          autoComplete="off"
        />
      </div>

      <div>
        <label className="mb-2 block text-base font-bold text-gray-300">
          Fecha de Vencimiento
        </label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-base font-bold text-gray-300">
          Cantidad de Unidades
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={1}
          className="input-field"
          required
        />
      </div>

      <button type="submit" className="btn-primary mt-2">
        Registrar Producto
      </button>
    </form>
  )
}
