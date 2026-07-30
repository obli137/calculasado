'use client'

import { useMemo, useState } from 'react'
import { sugerenciasSobras } from '@/lib/humor'

export default function SobrasPage() {
  const [kg, setKg] = useState('')

  const valor = parseFloat(kg.replace(',', '.'))
  const sugerencias = useMemo(() => {
    if (kg.trim() === '' || Number.isNaN(valor)) return null
    return sugerenciasSobras(valor)
  }, [kg, valor])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">CalculaSobras</h1>
      <p className="mt-2 text-gray-600">
        Sobró carne. No es un fracaso: es un problema de Estado. Acá el plan.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <label htmlFor="kg" className="block text-sm font-bold text-gray-700 mb-2">
          ¿Cuántos kg sobraron?
        </label>
        <input
          id="kg"
          type="number"
          min="0"
          step="0.1"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          placeholder="Ej: 1.2"
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>

      <div className="mt-6">
        {!sugerencias ? (
          <p className="text-center text-gray-500 italic">
            Acá no hay nada, ni un choripán filosófico. Ingresá los kilos.
          </p>
        ) : (
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <p className="mb-4 font-semibold text-red-800">
              Sobró {valor.toFixed(2)} kg → opciones dignas:
            </p>
            <ul className="space-y-3">
              {sugerencias.map((s) => (
                <li key={s} className="flex gap-2 text-gray-800">
                  <span className="text-red-600">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
