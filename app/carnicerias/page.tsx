import Link from 'next/link'
import CarniceriasMap from '@/components/CarniceriasMap'

export const metadata = {
  title: 'Carni-radar: encontrá carnicerías cerca | CalculAsado',
  description:
    'Mapa para ubicar carnicerías cerca tuyo. Cambiá de zona arrastrando el mapa o buscando otra dirección. Después, calculá el asado.',
}

export default function CarniceriasPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Carni-radar 📍</h1>
        <p className="mt-2 text-gray-600">
          Ubicar carnicerías cerca. Arrastrá el mapa, buscá otra dirección o usá “Mi
          ubicación”.
        </p>
        <p className="mt-2 hidden text-sm text-gray-500 sm:block">
          Si el mapa tarda, no es drama existencial: a veces el radar necesita un segundo
          café. Si la zona viene vacía, probá mover el centro un par de cuadras.
        </p>
      </div>

      <CarniceriasMap />

      <div className="mt-8 rounded-lg border border-red-100 bg-red-50 p-5 text-center">
        <p className="font-medium text-red-900">
          ¿Ya tenés proveedor de felicidad?
        </p>
        <p className="mt-1 text-sm text-red-800">
          Ahora sí: cantidades sin adivinanza.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
        >
          Ir a la calculadora
        </Link>
        <p className="mt-3 text-sm text-gray-600">
          O mirá la{' '}
          <Link href="/guias/checklist-previa-al-asado" className="text-red-600 hover:underline">
            checklist previa
          </Link>
          {' · '}
          <Link href="/guias" className="text-red-600 hover:underline">
            Guías del Asador
          </Link>
        </p>
      </div>
    </div>
  )
}
