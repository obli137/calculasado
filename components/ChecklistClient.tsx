'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CHECKLIST_ASADO } from '@/lib/humor'

export default function ChecklistClient() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const done = Object.values(checked).filter(Boolean).length
  const total = CHECKLIST_ASADO.length
  const allDone = done === total

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-gray-900">Checklist previa al asado</h1>
      <p className="mt-2 text-gray-600">
        Antes del fuego, la lista. Después del fuego, las excusas.
      </p>

      <ul className="mt-6 space-y-3">
        {CHECKLIST_ASADO.map((item) => (
          <li key={item.id}>
            <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-red-200">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))
                }
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span
                className={`text-base text-gray-800 ${checked[item.id] ? 'text-gray-400 line-through' : ''}`}
              >
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-sm text-gray-600">
        {allDone
          ? 'Si tachaste todo, ya sos más asador que el 80 % de tus invitados.'
          : `${done} de ${total}. Falta lo importante o lo que siempre se olvida.`}
      </p>

      <div className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-gray-500 sm:flex-row sm:justify-center sm:gap-3">
        <Link href="/" className="font-medium text-red-600 hover:underline">
          Hacé las cuentas en la calculadora
        </Link>
        <span className="hidden text-gray-300 sm:inline">·</span>
        <Link href="/guias" className="font-medium text-red-600 hover:underline">
          Leé las Guías del Asador
        </Link>
      </div>
    </div>
  )
}
