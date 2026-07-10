'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PreciosPage() {
  const [precios, setPrecios] = useState([])

  useEffect(() => {
    const cargarPrecios = async () => {
      const { data } = await supabase
        .from('precios')
        .select('*')
      setPrecios(data || [])
    }

    cargarPrecios()
  }, [])

  const cortesVaca = precios.filter(p => p.categoria === 'CORTES_VACA')
  const achuras = precios.filter(p => p.categoria === 'ACHURAS')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Lista de Precios</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cortes de Vaca</h2>
        <div className="space-y-3">
          {cortesVaca.map((corte) => (
            <div key={corte.id} className="flex justify-between p-4 bg-white rounded-lg shadow">
              <span className="text-lg">{corte.nombre}</span>
              <span className="text-lg font-semibold">${corte.precio}/kg</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Achuras</h2>
        <div className="space-y-3">
          {achuras.map((achura) => (
            <div key={achura.id} className="flex justify-between p-4 bg-white rounded-lg shadow">
              <span className="text-lg">{achura.nombre}</span>
              <span className="text-lg font-semibold">${achura.precio}/kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 