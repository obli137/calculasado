'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Compra {
  id: string
  created_at: string
  user_id: string
  detalles: {
    carne: number
    distribucionCortes: { [key: string]: number }
    distribucionAchuras: { [key: string]: number }
    embutidos: number
    pan: number
  }
}

export default function MisCompras() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompras()
  }, [])

  const fetchCompras = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('compras')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompras(data || [])
    } catch (error) {
      console.error('Error al cargar las compras:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Compras</h1>
      
      {compras.length === 0 ? (
        <div className="text-center text-gray-500">
          No tienes compras guardadas
        </div>
      ) : (
        <div className="grid gap-6">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  Compra del {new Date(compra.created_at).toLocaleDateString()}
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cortes */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Cortes de Carne</h3>
                    {Object.entries(compra.detalles.distribucionCortes).map(([corte, cantidad]) => (
                      <div key={corte} className="flex justify-between text-sm">
                        <span>{corte}</span>
                        <span>{cantidad.toFixed(2)} kg</span>
                      </div>
                    ))}
                  </div>

                  {/* Achuras */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Achuras</h3>
                    {Object.entries(compra.detalles.distribucionAchuras).map(([achura, cantidad]) => (
                      <div key={achura} className="flex justify-between text-sm">
                        <span>{achura}</span>
                        <span>{cantidad.toFixed(2)} kg</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adicionales */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Adicionales</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Embutidos</span>
                      <span>{compra.detalles.embutidos} unidades</span>
                    </div>
                    {compra.detalles.pan > 0 && (
                      <div className="flex justify-between">
                        <span>Pan</span>
                        <span>{compra.detalles.pan} unidades</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 