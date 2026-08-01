import Link from 'next/link'
import type { ReactNode } from 'react'
import { GUIAS } from '@/lib/guias'

type Props = {
  children: ReactNode
  titulo: string
  slug: string
}

export default function GuiaArticle({ children, titulo, slug }: Props) {
  const otros = GUIAS.filter((g) => g.slug !== slug)

  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-sm text-gray-500">
        <Link href="/guias" className="text-red-600 hover:underline">
          Guías del Asador
        </Link>
        {' / '}
        {titulo}
      </p>
      <div className="prose-asado mt-4 space-y-4 text-gray-800 leading-relaxed">
        {children}
      </div>

      <aside className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h2 className="text-base font-semibold text-gray-900">Seguí leyendo</h2>
        <ul className="mt-3 space-y-2">
          {otros.map((g) => (
            <li key={g.slug}>
              <Link href={`/guias/${g.slug}`} className="text-red-700 hover:underline">
                {g.titulo}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          ¿Ya está claro el método?{' '}
          <Link href="/" className="font-medium text-red-600 hover:underline">
            Calculá las cantidades
          </Link>
          {' · '}
          <Link
            href="/guias/checklist-previa-al-asado"
            className="font-medium text-red-600 hover:underline"
          >
            Checklist previa
          </Link>
        </p>
      </aside>
    </article>
  )
}
