'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { validarCodigoPostal } from '@/utils/codigosPostales'
import { addDays, format } from 'date-fns'

interface TipoCarne {
  id: string
  nombre: string
  precio_kg: number
  categoria: string
}

interface Precios {
  [key: string]: {
    id: string
    precio: number
  }
}

interface OrdenProps {
  orden: {
    carne?: number
    alPan?: boolean
    distribucionCortes?: { [key: string]: number }
    distribucionAchuras?: { [key: string]: number }
    distribucionEmbutidos: {
      chorizo: number
      morcilla: number
    }
    pan?: number
  }
}

interface DireccionEnvio {
  calle: string
  numero: string
  ciudad: string
  codigoPostal: string
  telefono: string
  notas: string
  metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'MERCADO_PAGO'
  fechaEntrega: string
}

export default function ResumenOrden({ orden }: OrdenProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [precios, setPrecios] = useState<Precios>({})
  const [total, setTotal] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [costoEnvio] = useState(1500) // Costo fijo de envío, podría ser variable según la zona
  const [direccion, setDireccion] = useState<DireccionEnvio>({
    calle: '',
    numero: '',
    ciudad: '',
    codigoPostal: '',
    telefono: '',
    notas: '',
    metodoPago: 'EFECTIVO',
    fechaEntrega: ''
  })
  const [codigoPostal, setCodigoPostal] = useState('')
  const [codigoPostalError, setCodigoPostalError] = useState<string | null>(null)
  const [fechaEntrega, setFechaEntrega] = useState<string>('')
  const [turnoEntrega, setTurnoEntrega] = useState<string>('')

  const KG_POR_EMBUTIDO = 0.15; // Constante para el peso de cada embutido

  // Calculamos la fecha mínima (2 días después de hoy)
  const fechaMinima = format(addDays(new Date(), 2), 'yyyy-MM-dd')

  const turnos = [
    { id: 'manana', label: 'Turno Mañana (8:00 - 14:00)' },
    { id: 'tarde', label: 'Turno Tarde (17:00 - 21:00)' }
  ]

  useEffect(() => {
    // Verificar si el usuario está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const calcularTotal = useCallback((preciosActuales: Precios) => {
    let subtotal = 0;

    // Calcular subtotal de cortes (pedidos anteriores con distribución)
    Object.entries(orden.distribucionCortes || {}).forEach(([corte, kg]) => {
      const precioUnitario = preciosActuales[corte]?.precio || 0;
      subtotal += precioUnitario * kg;
    });

    // Calcular subtotal de achuras (pedidos anteriores con distribución)
    Object.entries(orden.distribucionAchuras || {}).forEach(([achura, kg]) => {
      const precioUnitario = preciosActuales[achura]?.precio || 0;
      subtotal += precioUnitario * kg;
    });

    // Calcular subtotal de embutidos (considerando 0.15kg por unidad)
    if (orden.distribucionEmbutidos.chorizo > 0) {
      const precioUnitario = preciosActuales['Chorizo']?.precio || 0;
      const kgTotalChorizo = orden.distribucionEmbutidos.chorizo * KG_POR_EMBUTIDO;
      subtotal += precioUnitario * kgTotalChorizo;
    }

    if (orden.distribucionEmbutidos.morcilla > 0) {
      const precioUnitario = preciosActuales['Morcilla']?.precio || 0;
      const kgTotalMorcilla = orden.distribucionEmbutidos.morcilla * KG_POR_EMBUTIDO;
      subtotal += precioUnitario * kgTotalMorcilla;
    }

    setTotal(subtotal);
    setLoading(false);
  }, [orden]);

  useEffect(() => {
    const fetchPrecios = async () => {
      const { data, error } = await supabase
        .from('tipos_carnes')
        .select('id, nombre, precio_kg, categoria')

      if (error) {
        console.error('Error cargando precios:', error)
        return
      }

      const preciosMap = data.reduce((acc, item: TipoCarne) => {
        acc[item.nombre] = {
          id: item.id,
          precio: item.precio_kg
        }
        return acc
      }, {} as Precios)

      setPrecios(preciosMap)
      calcularTotal(preciosMap)
    }

    fetchPrecios()
  }, [calcularTotal]);

  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDireccion(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validarEnvio = () => {
    const cp = parseInt(codigoPostal)
    if (isNaN(cp)) {
      setCodigoPostalError('Por favor, ingresa un código postal válido')
      return false
    }

    if (!validarCodigoPostal(cp)) {
      setCodigoPostalError('Lo sentimos, de momento no realizamos envíos a tu zona. Solo hacemos envíos en Capital Federal y GBA Norte.')
      return false
    }

    setCodigoPostalError(null)
    return true
  }

  const handleSubmit = async () => {
    if (!fechaEntrega || !turnoEntrega) {
      alert('Por favor selecciona una fecha y turno de entrega')
      return
    }
    if (!validarEnvio()) {
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Debes iniciar sesión para realizar un pedido')
      }

      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert([
          {
            user_id: session.user.id,
            total: total,
            estado: 'PENDIENTE',
            fecha_entrega: fechaEntrega,
            horario_entrega: turnoEntrega,
            metodo_pago: orden.metodoPago || 'efectivo',
            costo_envio: orden.costoEnvio || 0,
            codigo_postal: codigoPostal
          }
        ])
        .select()
        .single()

      if (pedidoError) {
        console.error('Error al crear pedido:', pedidoError)
        throw pedidoError
      }

      console.log('Pedido creado:', pedido)

      const items = [
        // Items de cortes (pedidos anteriores con distribución)
        ...Object.entries(orden.distribucionCortes || {}).map(([corte, kg]) => ({
          pedido_id: pedido.id,
          tipo_carne_id: precios[corte]?.id,
          cantidad: kg,
          subtotal: (precios[corte]?.precio || 0) * kg
        })),
        // Items de achuras (pedidos anteriores con distribución)
        ...Object.entries(orden.distribucionAchuras || {}).map(([achura, kg]) => ({
          pedido_id: pedido.id,
          tipo_carne_id: precios[achura]?.id,
          cantidad: kg,
          subtotal: (precios[achura]?.precio || 0) * kg
        })),
        // Items de embutidos
        ...(orden.distribucionEmbutidos.chorizo > 0 ? [{
          pedido_id: pedido.id,
          tipo_carne_id: precios['Chorizo']?.id,
          cantidad: orden.distribucionEmbutidos.chorizo,
          subtotal: (precios['Chorizo']?.precio || 0) * orden.distribucionEmbutidos.chorizo
        }] : []),
        ...(orden.distribucionEmbutidos.morcilla > 0 ? [{
          pedido_id: pedido.id,
          tipo_carne_id: precios['Morcilla']?.id,
          cantidad: orden.distribucionEmbutidos.morcilla,
          subtotal: (precios['Morcilla']?.precio || 0) * orden.distribucionEmbutidos.morcilla
        }] : [])
      ]

      console.log('Creando items...', items)

      const { error: itemsError } = await supabase
        .from('pedidos_items')
        .insert(items)

      if (itemsError) {
        console.error('Error al crear items:', itemsError)
        throw itemsError
      }

      console.log('Items creados exitosamente')

      router.push(`/gracias?pedido=${pedido.id}`)

    } catch (error: any) {
      console.error('Error detallado:', error)
      alert(`Error al procesar el pedido: ${error.message || 'Error desconocido'}`)
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Resumen de tu Pedido</h1>
      <p className="text-sm text-gray-600 mb-6">Envíos a CABA y GBA Norte</p>
      
      {/* Total de carne (pedido simplificado) */}
      {orden.carne && orden.carne > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-red-700">Carne</h2>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Total de carne</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({orden.carne.toFixed(2)} kg{orden.alPan ? ' — al pan' : ' — al plato'})
                </span>
              </div>
              <span className="text-sm text-gray-500 italic">Precio a confirmar</span>
            </div>
          </div>
        </div>
      )}

      {/* Cortes de Carne (pedidos anteriores con distribución) */}
      {Object.entries(orden.distribucionCortes || {}).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-red-700">Cortes de Carne</h2>
          <div className="bg-white shadow rounded-lg p-4 space-y-2">
            {Object.entries(orden.distribucionCortes || {}).map(([corte, kg]) => {
              const precioUnitario = precios[corte]?.precio || 0;
              const subtotal = precioUnitario * kg;
              return (
                <div key={corte} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{corte}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({kg.toFixed(2)} kg x ${precioUnitario.toFixed(2)})
                    </span>
                  </div>
                  <span className="font-semibold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achuras */}
      {Object.entries(orden.distribucionAchuras || {}).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-orange-700">Achuras</h2>
          <div className="bg-white shadow rounded-lg p-4 space-y-2">
            {Object.entries(orden.distribucionAchuras || {}).map(([achura, kg]) => {
              const precioUnitario = precios[achura]?.precio || 0;
              const subtotal = precioUnitario * kg;
              return (
                <div key={achura} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{achura}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({kg.toFixed(2)} kg x ${precioUnitario.toFixed(2)})
                    </span>
                  </div>
                  <span className="font-semibold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Embutidos */}
      {(orden.distribucionEmbutidos.chorizo > 0 || orden.distribucionEmbutidos.morcilla > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-yellow-700">Embutidos</h2>
          <div className="bg-white shadow rounded-lg p-4 space-y-2">
            {orden.distribucionEmbutidos.chorizo > 0 && (
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Chorizo</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({orden.distribucionEmbutidos.chorizo} unidades - {(orden.distribucionEmbutidos.chorizo * KG_POR_EMBUTIDO).toFixed(2)}kg x ${(precios['Chorizo']?.precio || 0).toFixed(2)}/kg)
                  </span>
                </div>
                <span className="font-semibold">
                  ${((precios['Chorizo']?.precio || 0) * orden.distribucionEmbutidos.chorizo * KG_POR_EMBUTIDO).toFixed(2)}
                </span>
              </div>
            )}
            {orden.distribucionEmbutidos.morcilla > 0 && (
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Morcilla</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({orden.distribucionEmbutidos.morcilla} unidades - {(orden.distribucionEmbutidos.morcilla * KG_POR_EMBUTIDO).toFixed(2)}kg x ${(precios['Morcilla']?.precio || 0).toFixed(2)}/kg)
                  </span>
                </div>
                <span className="font-semibold">
                  ${((precios['Morcilla']?.precio || 0) * orden.distribucionEmbutidos.morcilla * KG_POR_EMBUTIDO).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sección única de datos de envío */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4">Datos de envío</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calle *
              </label>
              <input
                type="text"
                value={direccion.calle}
                onChange={(e) => setDireccion(prev => ({ ...prev, calle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número *
              </label>
              <input
                type="text"
                value={direccion.numero}
                onChange={(e) => setDireccion(prev => ({ ...prev, numero: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                value={direccion.ciudad}
                onChange={(e) => setDireccion(prev => ({ ...prev, ciudad: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Postal *
              </label>
              <input
                type="text"
                value={direccion.codigoPostal}
                onChange={(e) => {
                  setCodigoPostal(e.target.value)
                  setCodigoPostalError(null)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
              {codigoPostalError && (
                <p className="mt-2 text-sm text-red-600">
                  {codigoPostalError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de entrega *
              </label>
              <input
                type="date"
                min={fechaMinima}
                value={direccion.fechaEntrega}
                onChange={(e) => setDireccion(prev => ({ ...prev, fechaEntrega: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turno de entrega *
              </label>
              <select
                value={direccion.turnoEntrega}
                onChange={(e) => setDireccion(prev => ({ ...prev, turnoEntrega: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Selecciona un turno</option>
                {turnos.map(turno => (
                  <option key={turno.id} value={turno.id}>
                    {turno.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Nota sobre el precio */}
      <div className="mt-4 mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-700 italic">
          * El importe final podrá variar levemente según el peso final de las piezas.
        </p>
      </div>

      {/* Total y botón de confirmar */}
      <div className="mt-6 text-right">
        <div className="text-2xl font-bold mb-4">
          Total: ${total.toFixed(2)}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !!codigoPostalError || !fechaEntrega || !turnoEntrega}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </div>

      {/* Formulario de dirección */}
      {user ? (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Datos de envío</h2>
          <div className="space-y-4 bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calle
                </label>
                <input
                  type="text"
                  name="calle"
                  value={direccion.calle}
                  onChange={handleDireccionChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  name="numero"
                  value={direccion.numero}
                  onChange={handleDireccionChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={direccion.ciudad}
                  onChange={handleDireccionChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="codigoPostal"
                  value={direccion.codigoPostal}
                  onChange={handleDireccionChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={direccion.telefono}
                onChange={handleDireccionChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                name="notas"
                value={direccion.notas}
                onChange={handleDireccionChange}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de pago
              </label>
              <select
                name="metodoPago"
                value={direccion.metodoPago}
                onChange={(e) => handleDireccionChange(e)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia bancaria</option>
                <option value="MERCADO_PAGO">Mercado Pago</option>
              </select>
            </div>

            {/* Fecha de entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de entrega preferida
              </label>
              <input
                type="datetime-local"
                name="fechaEntrega"
                value={direccion.fechaEntrega}
                onChange={handleDireccionChange}
                className="w-full p-2 border rounded-md"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* Costo de envío */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Costo de envío</span>
                <span className="font-medium">${costoEnvio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-lg font-bold">
                <span>Total con envío</span>
                <span>${(total + costoEnvio).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" 
              />
            </svg>
            <span className="font-medium">
              Debes iniciar sesión para confirmar la compra
            </span>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        </div>
      )}
    </div>
  )
} 