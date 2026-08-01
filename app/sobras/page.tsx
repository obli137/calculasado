import Link from 'next/link'
import SobrasClient from '@/components/SobrasClient'
import SobrasIdeas from '@/components/SobrasIdeas'

export const metadata = {
  title: 'CalculaSobras: qué hacer con la carne que sobró | CalculAsado',
  description:
    'Guía práctica y con humor para aprovechar las sobras del asado: sanguches, guiso, empanadas y más. Calculá kilos y elegí el destino digno.',
}

export default function SobrasPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-gray-900">CalculaSobras</h1>
      <p className="mt-2 text-gray-600">
        Sobró carne. No es un fracaso: es un problema de Estado.
      </p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900">Calculá el destino exacto</h2>
        <p className="mt-1 text-sm text-gray-600">
          Si sabés cuántos kilos quedaron, el protocolo se pone serio.
        </p>
        <SobrasClient />
      </section>

      <SobrasIdeas />

      <p className="mt-10 text-center text-sm text-gray-600">
        La próxima vez,{' '}
        <Link href="/" className="font-medium text-red-600 hover:underline">
          usá la calculadora
        </Link>{' '}
        para no subestimar el apetito de los invitados. El freezer ya tiene suficiente historia.
      </p>
    </div>
  )
}
