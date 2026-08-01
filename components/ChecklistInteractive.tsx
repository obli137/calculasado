'use client'

import { useState } from 'react'
import { CHECKLIST_ASADO } from '@/lib/humor'

export default function ChecklistInteractive() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const done = Object.values(checked).filter(Boolean).length
  const total = CHECKLIST_ASADO.length
  const allDone = done === total

  return (
    <div>
      <ul className="mt-2 space-y-3">
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
    </div>
  )
}
