'use client'

import { useState } from 'react'
import { CHECKLIST_ASADO } from '@/lib/humor'

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const done = Object.values(checked).filter(Boolean).length
  const total = CHECKLIST_ASADO.length
  const allDone = done === total

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Checklist previa</h1>
      <p className="mt-2 text-gray-600">
        Antes del fuego, la lista. Después del fuego, las excusas.
      </p>

      <ul className="mt-6 space-y-3">
        {CHECKLIST_ASADO.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-red-200">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span
                className={`text-gray-800 ${checked[item.id] ? 'text-gray-400 line-through' : ''}`}
              >
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-sm text-gray-500">
        {allDone
          ? 'Listo. Ahora sí: que empiece el acto.'
          : `${done} de ${total}. Falta lo importante o lo que siempre se olvida.`}
      </p>
    </div>
  )
}
