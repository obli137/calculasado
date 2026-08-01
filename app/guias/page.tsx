import Link from 'next/link'
import { GUIAS } from '@/lib/guias'

export const metadata = {
  title: 'Guías del Asador | CalculAsado',
  description:
    'Consejos prácticos para no fallarle al fuego ni a los invitados: primer asado, errores comunes, cortes y manejo del carbón.',
}

export default function GuiasPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Guías del Asador</h1>
      <p className="mt-2 text-gray-600">
        Consejos prácticos para no fallarle al fuego ni a los invitados.
      </p>

      <ul className="mt-8 space-y-4">
        {GUIAS.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guias/${g.slug}`}
              className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-red-200 hover:bg-red-50"
            >
              <h2 className="text-lg font-semibold text-red-700">{g.titulo}</h2>
              <p className="mt-2 text-sm text-gray-600">{g.descripcion}</p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-sm text-gray-500">
        También podés{' '}
        <Link href="/" className="text-red-600 hover:underline">
          hacer las cuentas
        </Link>
        , mirar el{' '}
        <Link href="/diccionario" className="text-red-600 hover:underline">
          diccionario parrillero
        </Link>{' '}
        o armar la{' '}
        <Link href="/checklist" className="text-red-600 hover:underline">
          checklist
        </Link>
        .
      </p>
    </div>
  )
}
