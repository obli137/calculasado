'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function GraciasPage() {
  const searchParams = useSearchParams()
  const pedidoId = searchParams?.get('pedido')

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <circle
              className="opacity-25"
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M16.707 26.707a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0L28 24.586l7.293-7.293a1 1 0 111.414 1.414l-8 8a1 1 0 01-1.414 0L22 21.414l-5.293 5.293z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Gracias por tu compra!
        </h2>
        <p className="text-gray-600 mb-8">
          Tu pedido #{pedidoId && pedidoId.slice(0, 8)} ha sido confirmado. 
          Te enviaremos un correo con los detalles de tu compra.
        </p>
        <div className="space-y-4">
          <Link
            href="/mis-compras"
            className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Ver mis compras
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
} 