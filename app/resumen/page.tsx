'use client'
import { useSearchParams } from 'next/navigation'
import ResumenOrden from '@/components/ResumenOrden'

export default function ResumenPage() {
  const searchParams = useSearchParams()
  const ordenData = searchParams?.get('orden')
  
  if (!ordenData) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: No se encontraron datos de la orden
      </div>
    )
  }

  try {
    const orden = JSON.parse(decodeURIComponent(ordenData))
    return <ResumenOrden orden={orden} />
  } catch (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: Los datos de la orden son inválidos
      </div>
    )
  }
} 