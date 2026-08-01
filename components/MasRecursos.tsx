import Link from 'next/link'

const RECURSOS = [
  {
    href: '/checklist',
    titulo: 'Checklist previa',
    copy: 'Antes del fuego, tachá. Después, no hay vuelta atrás.',
  },
  {
    href: '/sobras',
    titulo: 'Qué hacer con las sobras',
    copy: 'Si sobró, no fue un error: fue inventario. Calculá el destino.',
  },
  {
    href: '/diccionario',
    titulo: 'Diccionario parrillero',
    copy: 'Para entender qué dicen cuando dicen “está a punto”.',
  },
  {
    href: '/guias',
    titulo: 'Guías del Asador',
    copy: 'Consejos prácticos. Sin humo innecesario.',
  },
]

export default function MasRecursos() {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
      <h3 className="text-base font-semibold text-gray-900">Para no improvisar</h3>
      <p className="mt-1 text-sm text-gray-600">
        Las cuentas están. Ahora viene lo demás.
      </p>
      <ul className="mt-4 space-y-3">
        {RECURSOS.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="block rounded-md border border-gray-200 bg-white px-4 py-3 hover:border-red-200 hover:bg-red-50"
            >
              <span className="font-medium text-red-700">{r.titulo}</span>
              <span className="mt-0.5 block text-sm text-gray-600">{r.copy}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
