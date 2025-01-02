'use client'
import { useSearchParams } from 'next/navigation'
import ResumenOrden from '@/components/ResumenOrden'

export default function ResumenPage() {
  const searchParams = useSearchParams()
  const ordenData = searchParams.get('orden')
  
  if (!ordenData) {
    return <div>Error: No se encontraron datos de la orden</div>
  }

  const orden = JSON.parse(decodeURIComponent(ordenData))

  return <ResumenOrden orden={orden} />
} 