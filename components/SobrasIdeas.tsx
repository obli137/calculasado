'use client'

import { useState } from 'react'
import { IDEAS_SOBRAS_GUIA } from '@/lib/sobrasGuia'

export default function SobrasIdeas() {
  const [open, setOpen] = useState(false)

  return (
    <section className="mt-8">
      <h2 className="hidden text-lg font-semibold text-gray-900 md:block">
        Ideas concretas (sin drama)
      </h2>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-12 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left shadow-sm hover:border-red-200 md:hidden"
        aria-expanded={open}
      >
        <span>
          <span className="block text-base font-semibold text-gray-900">Ideas concretas</span>
          <span className="mt-0.5 block text-sm text-gray-600">
            {open ? 'Ocultar' : 'Ver sanguches, guiso, empanadas…'}
          </span>
        </span>
        <span className="ml-3 text-xl text-gray-500" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>

      <div className={`mt-4 space-y-4 ${open ? 'block' : 'hidden'} md:block`}>
        {IDEAS_SOBRAS_GUIA.map((idea) => (
          <article
            key={idea.titulo}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-base font-semibold text-red-700">{idea.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{idea.texto}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
