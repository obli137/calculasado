import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl mb-4">🔥</p>
      <h1 className="text-2xl font-bold text-gray-900">
        Acá no hay nada, ni un choripán filosófico
      </h1>
      <p className="mt-3 text-gray-600">
        Esta página se fue con el humo. Volvé al asado.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700"
      >
        Volver a CalculAsado
      </Link>
    </div>
  )
}
