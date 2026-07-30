'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  FRASES_AL_CALCULAR,
  TIP_AL_PAN,
  TIP_AL_PLATO,
  fraseSegunInvitados,
  mensajeWhatsapp,
  pickRandom,
} from '@/lib/humor';

interface FormData {
  cantidadHombres: string;
  cantidadMujeres: string;
  cantidadNinos: string;
  alPan: boolean;
}

interface AsadoCalculation {
  carne: number;
  embutidos: number;
  pan: number;
}

export default function AsadoForm() {
  const [formData, setFormData] = useState<FormData>({
    cantidadHombres: '',
    cantidadMujeres: '',
    cantidadNinos: '',
    alPan: false,
  });
  const [resultado, setResultado] = useState<AsadoCalculation | null>(null);
  const [fraseResultado, setFraseResultado] = useState('');
  const [veganOffsetY, setVeganOffsetY] = useState(0);
  const [veganAttempts, setVeganAttempts] = useState(0);
  const [showVeganTooltip, setShowVeganTooltip] = useState(false);
  const veganNextDir = useRef<'down' | 'up'>('down');
  const veganResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const veganTooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (veganResetTimer.current) clearTimeout(veganResetTimer.current);
      if (veganTooltipTimer.current) clearTimeout(veganTooltipTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!resultado) return;
    resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [resultado]);

  const getTotalPersonas = () =>
    parseInt(formData.cantidadHombres || '0') +
    parseInt(formData.cantidadMujeres || '0') +
    parseInt(formData.cantidadNinos || '0');

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setResultado(null);
    setFraseResultado('');
  };

  const calcularAsado = useCallback((): AsadoCalculation => {
    const totalPersonas =
      parseInt(formData.cantidadHombres || '0') +
      parseInt(formData.cantidadMujeres || '0') +
      parseInt(formData.cantidadNinos || '0');

    let cantidadTotal =
      parseInt(formData.cantidadHombres || '0') * 0.5 +
      parseInt(formData.cantidadMujeres || '0') * 0.4 +
      parseInt(formData.cantidadNinos || '0') * 0.2;

    if (formData.alPan) {
      cantidadTotal = cantidadTotal * 0.7;
    }

    const calculoPan = formData.alPan ? 2 : 0;
    const totalEmbutidos = Math.ceil(totalPersonas / 2);

    return {
      carne: cantidadTotal,
      embutidos: totalEmbutidos,
      pan: totalPersonas * calculoPan,
    };
  }, [formData]);

  const handleCalcular = (e: React.FormEvent) => {
    e.preventDefault();
    const total = getTotalPersonas();
    if (total === 0) return;
    setResultado(calcularAsado());
    setFraseResultado(
      fraseSegunInvitados(total) ?? pickRandom(FRASES_AL_CALCULAR)
    );
  };

  const huirVegano = () => {
    if (veganResetTimer.current) clearTimeout(veganResetTimer.current);
    if (veganTooltipTimer.current) clearTimeout(veganTooltipTimer.current);

    setVeganAttempts((n) => n + 1);
    setShowVeganTooltip(true);
    veganTooltipTimer.current = setTimeout(() => setShowVeganTooltip(false), 1800);

    if (veganNextDir.current === 'down') {
      setVeganOffsetY(28);
      veganNextDir.current = 'up';
    } else {
      setVeganOffsetY(-28);
      veganNextDir.current = 'down';
    }

    veganResetTimer.current = setTimeout(() => {
      setVeganOffsetY(0);
      veganNextDir.current = 'down';
    }, 700);
  };

  const totalPersonas = getTotalPersonas();
  const veganRendido = veganAttempts >= 5;

  const compartirWhatsapp = () => {
    if (!resultado || totalPersonas === 0) return;

    const hombres = parseInt(formData.cantidadHombres || '0');
    const mujeres = parseInt(formData.cantidadMujeres || '0');
    const ninos = parseInt(formData.cantidadNinos || '0');
    const modalidad = formData.alPan ? 'Al pan 🍞' : 'Al plato 🍽️';

    const invitados = [
      hombres > 0 && `${hombres} hombre${hombres > 1 ? 's' : ''}`,
      mujeres > 0 && `${mujeres} mujer${mujeres > 1 ? 'es' : ''}`,
      ninos > 0 && `${ninos} niño${ninos > 1 ? 's' : ''}`,
    ].filter(Boolean).join(', ');

    const mensaje = mensajeWhatsapp({
      invitados,
      totalPersonas,
      modalidad,
      carne: resultado.carne.toFixed(2),
      embutidos: resultado.embutidos,
      pan: formData.alPan && resultado.pan > 0 ? resultado.pan : undefined,
    });

    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Calculadora de Asado</h1>
      <p className="text-sm text-gray-500 mb-6">
        Para que no falte el chori ni sobre media vaca.
      </p>
      
      <form onSubmit={handleCalcular} className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
          <p>
            Completá los invitados y hacé las cuentas. El asado no perdona la improvisación.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hombres">
            Hombres
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="hombres"
            type="number"
            min="0"
            value={formData.cantidadHombres}
            onChange={(e) => updateFormData({ cantidadHombres: e.target.value })}
            placeholder="Los que pelean por el vacío"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mujeres">
            Mujeres
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="mujeres"
            type="number"
            min="0"
            value={formData.cantidadMujeres}
            onChange={(e) => updateFormData({ cantidadMujeres: e.target.value })}
            placeholder="Las que saben cuándo está a punto"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ninos">
            Niños
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ninos"
            type="number"
            min="0"
            value={formData.cantidadNinos}
            onChange={(e) => updateFormData({ cantidadNinos: e.target.value })}
            placeholder="Los que piden el chori primero"
          />
        </div>

        <div className="mb-6 flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-3">Al Plato</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox"
              checked={formData.alPan}
              onChange={(e) => updateFormData({ alPan: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
          <span className="text-sm font-medium text-gray-700 ml-3">Al Pan</span>
        </div>

        <button
          type="submit"
          disabled={totalPersonas === 0}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Hacer las cuentas (como Dios manda) 🔥
        </button>

        <div className="relative mt-4 h-28 overflow-visible">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-0">
            {showVeganTooltip && !veganRendido && (
              <p className="pointer-events-none absolute -top-8 left-1/2 z-10 w-max -translate-x-1/2 rounded bg-gray-900 px-3 py-1 text-xs text-white shadow">
                El asado no discute, se evade.
              </p>
            )}
            {veganRendido ? (
              <div className="w-full rounded-lg border border-green-300 bg-green-50 py-3 text-center text-base font-medium text-green-800">
                Ganaste por cansancio. Tomá una ensalada simbólica 🥗
              </div>
            ) : (
              <button
                type="button"
                onMouseEnter={huirVegano}
                onFocus={huirVegano}
                onTouchStart={(e) => {
                  e.preventDefault();
                  huirVegano();
                }}
                onClick={(e) => e.preventDefault()}
                style={{ transform: `translateY(${veganOffsetY}px)` }}
                className="w-full rounded-lg border border-green-300 bg-green-50 py-3 text-base font-medium text-green-700 shadow-sm transition-transform duration-200 ease-out"
                title="El asado no discute, se evade."
              >
                Soy vegano 🌱
              </button>
            )}
          </div>
        </div>
      </form>

      <div
        ref={resultadoRef}
        className="bg-white shadow-lg rounded-lg overflow-hidden scroll-mt-6"
      >
        <div className="bg-red-600 p-4">
          <h2 className="text-xl font-bold text-white text-center">
            {resultado ? 'Las cuentas están hechas' : 'Resultados'}
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          {!resultado ? (
            <div className="text-center p-6 text-gray-500">
              <span className="text-4xl mb-4 block">🔥</span>
              <p className="text-lg">
                El asado todavía es una hipótesis
              </p>
              <p className="text-sm mt-2 text-gray-400">
                Completá invitados y hacé las cuentas.
              </p>
            </div>
          ) : (
            <>
              {fraseResultado && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-sm italic text-red-800">
                  “{fraseResultado}”
                </p>
              )}

              <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">🥩</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-red-600 font-medium">Total Carne</p>
                  <p className="text-2xl font-bold text-red-700">
                    {resultado.carne.toFixed(2)} kg
                  </p>
                </div>
              </div>

              {resultado.embutidos > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">🌭</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-yellow-600 font-medium">Chorizos o Morcillas</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {resultado.embutidos} unidades
                    </p>
                  </div>
                </div>
              )}

              {formData.alPan && resultado.pan > 0 && (
                <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 text-xl">🍞</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-amber-600 font-medium">Pan</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {resultado.pan} unidades
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p>
                  <span className="mr-1">💡</span>
                  {formData.alPan ? TIP_AL_PAN : TIP_AL_PLATO}
                </p>
              </div>

              <button
                type="button"
                onClick={compartirWhatsapp}
                className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Avisar por WhatsApp
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
