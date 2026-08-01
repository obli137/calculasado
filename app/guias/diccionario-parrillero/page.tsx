import GuiaArticle from '@/components/GuiaArticle'
import { DICCIONARIO_PARRILLERO } from '@/lib/humor'

export const metadata = {
  title: 'Diccionario parrillero argentino | CalculAsado',
  description:
    'Qué significa vacío, a punto, jugoso, cuñado y otros términos del asado. Definiciones honestas, con humor seco y utilidad real.',
}

export default function DiccionarioGuiaPage() {
  return (
    <GuiaArticle titulo="Diccionario parrillero" slug="diccionario-parrillero">
      <h1 className="text-3xl font-bold text-gray-900">Diccionario parrillero</h1>
      <p>
        Términos que todos usan y nadie define bien. Hasta ahora.
      </p>

      <dl className="space-y-6">
        {DICCIONARIO_PARRILLERO.map((entry) => (
          <div
            key={entry.termino}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <dt className="text-lg font-semibold text-red-700">{entry.termino}</dt>
            <dd className="mt-2 leading-relaxed text-gray-700">{entry.definicion}</dd>
          </div>
        ))}
      </dl>
    </GuiaArticle>
  )
}
