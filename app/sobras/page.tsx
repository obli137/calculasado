'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  TIPOS_SOBRA,
  TipoSobra,
  estimacionEmpanadas,
  rangoParaKg,
  recetasParaSobras,
  LABELS_TIEMPO,
} from '@/lib/sobras'

export default function SobrasPage() {
  const [kg, setKg] = useState('')
  const [tipo, setTipo] = useState<TipoSobra | 'todos'>('todos')
  const [submitted, setSubmitted] = useState(false)
  const resultadoRef = useRef<HTMLDivElement>(null)

  const valor = parseFloat(kg.replace(',', '.'))
  const valido = kg.trim() !== '' && !Number.isNaN(valor) && valor >= 0

  const rango = useMemo(() => (valido ? rangoParaKg(valor) : null), [valido, valor])
  const recetas = useMemo(
    () => (valido ? recetasParaSobras(valor, tipo) : []),
    [valido, valor, tipo]
  )
  const empanadasApprox = valido && valor > 0 ? estimacionEmpanadas(valor) : 0

  useEffect(() => {
    if (!submitted) return
    resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [submitted])

  const handleResolver = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valido) return
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">CalculaSobras</h1>
      <p className="mt-2 text-gray-600">
        Sobró carne. No es un fracaso: es un problema de Estado. Acá el plan — con recetas.
      </p>

      <form
        onSubmit={handleResolver}
        className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="kg" className="mb-2 block text-sm font-bold text-gray-700">
            ¿Cuántos kg sobraron?
          </label>
          <input
            id="kg"
            type="number"
            min="0"
            step="0.1"
            value={kg}
            onChange={(e) => {
              setKg(e.target.value)
              setSubmitted(false)
            }}
            placeholder="Ej: 1.2"
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>

        <div>
          <label htmlFor="tipo" className="mb-2 block text-sm font-bold text-gray-700">
            ¿Qué tipo de sobra es?
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value as TipoSobra | 'todos')
              setSubmitted(false)
            }}
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            {TIPOS_SOBRA.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!valido}
          className="w-full rounded-lg bg-red-600 py-3 px-4 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Resolver el destino de las sobras
        </button>
      </form>

      <div ref={resultadoRef} className="mt-6 scroll-mt-6">
        {!submitted ? (
          <p className="text-center text-gray-500 italic">
            El destino de las sobras todavía es una hipótesis.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border border-red-100 bg-red-50 p-6">
              <p className="text-sm font-medium uppercase tracking-wide text-red-600">
                {rango?.titulo}
              </p>
              <p className="mt-2 text-lg font-semibold text-red-900">
                Sobró {valor.toFixed(2)} kg
              </p>
              <p className="mt-2 italic text-red-800">“{rango?.frase}”</p>
              {valor >= 0.25 && (
                <p className="mt-3 text-sm text-red-700">
                  Dato útil: con eso salen ~{empanadasApprox} empanadas (si te da el brazo).
                </p>
              )}
            </div>

            {recetas.length === 0 ? (
              <p className="text-center text-gray-600">
                No hay receta para este combo. Probá otro tipo de sobra — o celebrá el cálculo perfecto.
              </p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recetas dignas para el caso
                </h2>
                {recetas.map((r) => (
                  <article
                    key={r.id}
                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-red-700">{r.nombre}</h3>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                        {LABELS_TIEMPO[r.tiempo]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{r.porcionesApprox}</p>
                    <p className="mt-3 italic text-gray-700">“{r.frase}”</p>
                    <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-gray-800">
                      {r.pasos.map((paso) => (
                        <li key={paso}>{paso}</li>
                      ))}
                    </ol>
                    <p className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Tip: </span>
                      {r.tip}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
