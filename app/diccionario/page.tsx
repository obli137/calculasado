import Link from 'next/link'
import { DICCIONARIO_PARRILLERO } from '@/lib/humor'

export const metadata = {
  title: 'Diccionario parrillero argentino | CalculAsado',
  description:
    'Qué significa vacío, a punto, jugoso, cuñado y otros términos del asado. Definiciones honestas, con humor seco y utilidad real.',
}

export default function DiccionarioPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Diccionario parrillero</h1>
      <p className="mt-2 text-gray-600">
        Términos que todos usan y nadie define bien. Hasta ahora.
      </p>

      <dl className="mt-8 space-y-6">
        {DICCIONARIO_PARRILLERO.map((entry) => (
          <div
            key={entry.termino}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <dt className="text-lg font-semibold text-red-700">{entry.termino}</dt>
            <dd className="mt-2 text-gray-700 leading-relaxed">{entry.definicion}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 text-center text-sm text-gray-500">
        Con el léxico claro,{' '}
        <Link href="/" className="text-red-600 hover:underline">
          calculá el asado
        </Link>
        {' · '}
        <Link href="/guias" className="text-red-600 hover:underline">
          leé las guías
        </Link>
        {' · '}
        <Link href="/carnicerias" className="text-red-600 hover:underline">
          buscá carni
        </Link>
      </p>
    </div>
  )
}
