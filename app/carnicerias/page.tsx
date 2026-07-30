import CarniceriasMap from '@/components/CarniceriasMap'

export const metadata = {
  title: 'Buscar Carnicerías | CalculAsado',
  description: 'Encontrá carnicerías cerca tuyo con Google Maps',
}

export default function CarniceriasPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buscar Carnicerías</h1>
        <p className="mt-2 text-gray-600">
          Mostramos carnicerías cerca de tu ubicación. Arrastrá el mapa o buscá otra dirección
          para cambiar de zona.
        </p>
      </div>
      <CarniceriasMap />
    </div>
  )
}
