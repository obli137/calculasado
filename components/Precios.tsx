'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface TipoCarne {
  id: string
  nombre: string
  categoria: 'CARNE' | 'ACHURA' | 'EMBUTIDO'
  precio_kg: number
}

export default function Precios() {
  const [cortes, setCortes] = useState<TipoCarne[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrecios()
  }, [])

  const fetchPrecios = async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_carnes')
        .select('*')
        .order('categoria')
        .order('nombre')

      if (error) throw error
      setCortes(data)
    } catch (error) {
      console.error('Error cargando precios:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lista de Precios</h1>
      
      {/* Cortes de Carne */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-700">Cortes de Carne</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-4">
            {cortes
              .filter(corte => corte.categoria === 'CARNE')
              .map(corte => (
                <div key={corte.id} className="flex justify-between items-center p-2 border-b border-gray-100">
                  <span className="font-medium">{corte.nombre}</span>
                  <span className="text-red-600 font-semibold">
                    ${corte.precio_kg.toLocaleString('es-AR')}/kg
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Achuras */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-orange-700">Achuras</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-4">
            {cortes
              .filter(corte => corte.categoria === 'ACHURA')
              .map(corte => (
                <div key={corte.id} className="flex justify-between items-center p-2 border-b border-gray-100">
                  <span className="font-medium">{corte.nombre}</span>
                  <span className="text-orange-600 font-semibold">
                    ${corte.precio_kg.toLocaleString('es-AR')}/kg
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Embutidos */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Embutidos</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-4">
            {cortes
              .filter(corte => corte.categoria === 'EMBUTIDO')
              .map(corte => (
                <div key={corte.id} className="flex justify-between items-center p-2 border-b border-gray-100">
                  <span className="font-medium">{corte.nombre}</span>
                  <span className="text-yellow-600 font-semibold">
                    ${corte.precio_kg.toLocaleString('es-AR')}/kg
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 