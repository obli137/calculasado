import CarniceriasMap from '@/components/CarniceriasMap'

export const metadata = {
  title: 'Carni-radar 📍 | CalculAsado',
  description: 'Encontrá carnicerías cerca tuyo con Google Maps',
}

export default function CarniceriasPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Carni-radar 📍</h1>
        <p className="mt-2 text-gray-600">
          Rastreá carnicerías cerca. Arrastrá el mapa o buscá otra dirección si la zona te defraudó.
        </p>
      </div>
      <CarniceriasMap />
    </div>
  )
}
