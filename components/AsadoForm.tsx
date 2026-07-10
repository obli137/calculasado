'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
  distribucionEmbutidos: {
    chorizo: number;
    morcilla: number;
  };
}

export default function AsadoForm() {
  const [formData, setFormData] = useState<FormData>({
    cantidadHombres: '',
    cantidadMujeres: '',
    cantidadNinos: '',
    alPan: false,
  });
  const [resultado, setResultado] = useState<AsadoCalculation | null>(null);

  const getTotalPersonas = () =>
    parseInt(formData.cantidadHombres || '0') +
    parseInt(formData.cantidadMujeres || '0') +
    parseInt(formData.cantidadNinos || '0');

  const calcularAsado = useCallback((): AsadoCalculation => {
    const totalPersonas = getTotalPersonas();

    const calculoBase = (hombres: number, mujeres: number, ninos: number) => {
      return (hombres * 0.5) + (mujeres * 0.4) + (ninos * 0.2);
    };

    const cantidadTotal = calculoBase(
      parseInt(formData.cantidadHombres || '0'),
      parseInt(formData.cantidadMujeres || '0'),
      parseInt(formData.cantidadNinos || '0')
    );

    const calculoPan = formData.alPan ? 2 : 0;
    const totalEmbutidos = Math.ceil(totalPersonas / 2);

    const distribucionEmbutidos = {
      chorizo: Math.round(totalEmbutidos * 0.6),
      morcilla: Math.round(totalEmbutidos * 0.4),
    };

    if (distribucionEmbutidos.chorizo === 0 && totalEmbutidos > 0) {
      distribucionEmbutidos.chorizo = 1;
    }
    if (distribucionEmbutidos.morcilla === 0 && totalEmbutidos > 1) {
      distribucionEmbutidos.morcilla = 1;
    }

    const sumaActual = distribucionEmbutidos.chorizo + distribucionEmbutidos.morcilla;
    if (sumaActual !== totalEmbutidos) {
      const diferencia = totalEmbutidos - sumaActual;
      distribucionEmbutidos.chorizo += diferencia;
    }

    return {
      carne: cantidadTotal,
      embutidos: totalEmbutidos,
      pan: totalPersonas * calculoPan,
      distribucionEmbutidos,
    };
  }, [formData]);

  useEffect(() => {
    const resultado = calcularAsado();
    setResultado(resultado);
  }, [formData, calcularAsado]);

  const totalPersonas = getTotalPersonas();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Calculadora de Asado</h1>
      <p className="text-sm text-gray-600 mb-6">Envíos a CABA y GBA Norte</p>
      
      <form className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
          <div className="flex items-center">
            <span className="mr-2">ℹ️</span>
            <p>
              Los resultados se actualizarán automáticamente. 
              ¡Probá diferentes combinaciones!
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hombres">
            Cantidad de Hombres
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="hombres"
            type="number"
            min="0"
            value={formData.cantidadHombres}
            onChange={(e) => setFormData({...formData, cantidadHombres: e.target.value})}
            placeholder="Número de hombres"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mujeres">
            Cantidad de Mujeres
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="mujeres"
            type="number"
            min="0"
            value={formData.cantidadMujeres}
            onChange={(e) => setFormData({...formData, cantidadMujeres: e.target.value})}
            placeholder="Número de mujeres"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ninos">
            Cantidad de Niños
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ninos"
            type="number"
            min="0"
            value={formData.cantidadNinos}
            onChange={(e) => setFormData({...formData, cantidadNinos: e.target.value})}
            placeholder="Número de niños"
          />
        </div>

        <div className="mb-4 flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-3">Al Plato</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox"
              checked={formData.alPan}
              onChange={(e) => setFormData({ ...formData, alPan: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
          <span className="text-sm font-medium text-gray-700 ml-3">Al Pan</span>
        </div>
      </form>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-red-600 p-4">
          <h2 className="text-xl font-bold text-white text-center">
            {resultado ? '¡Tu Asado Calculado!' : 'Resultados'}
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          {!resultado || totalPersonas === 0 ? (
            <div className="text-center p-6 text-gray-500">
              <span className="text-4xl mb-4 block">🔥</span>
              <p className="text-lg">
                Agregá invitados para ver las cantidades recomendadas
              </p>
              <p className="text-sm mt-2 text-gray-400">
                Los cálculos se actualizarán automáticamente
              </p>
            </div>
          ) : (
            <>
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
                  <div className="ml-4 space-y-2">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Chorizos</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {resultado.distribucionEmbutidos.chorizo} unidades
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Morcillas</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {resultado.distribucionEmbutidos.morcilla} unidades
                      </p>
                    </div>
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
                <p className="flex items-center">
                  <span className="mr-2">💡</span>
                  Tip: {formData.alPan ? 
                    "Calculado para asado al pan con ajuste en la cantidad de carne" : 
                    "Calculado para asado al plato con porciones completas"}
                </p>
              </div>

              <button
                onClick={() => {
                  const ordenData = {
                    carne: resultado.carne,
                    distribucionEmbutidos: resultado.distribucionEmbutidos,
                    pan: resultado.pan,
                    alPan: formData.alPan,
                  };
                  const queryParams = encodeURIComponent(JSON.stringify(ordenData));
                  window.location.href = `/resumen?orden=${queryParams}`;
                }}
                className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>Comprar</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" 
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 text-gray-700 leading-relaxed">
        <p className="text-center">
          Si te hicimos reír, te evitamos la típica sobremesa de &quot;che, ¿y ahora qué hacemos con todo este asado que sobró?&quot;, 
          o simplemente te salvamos de un asado al borde del caos, tiranos un hueso... o mejor, un cafecito. Con tu donación 
          nos ayudás a seguir chamuyando algoritmos parrilleros, pagando el carbón digital y manteniendo viva esta gran 
          misión nacional: que no falte nunca un chori en la parrilla. ¡Gracias, maestro asador! ☕🔥
        </p>
      </div>

      <div className="flex justify-center">
        <a 
          href="https://cafecito.app/calculaasado" 
          rel="noopener" 
          target="_blank"
          className="hover:opacity-90 transition-opacity"
        >
          <Image 
            width={176}
            height={62}
            src="https://cdn.cafecito.app/imgs/buttons/button_4.png"
            alt="Invitame un café en cafecito.app"
          />
        </a>
      </div>
    </div>
  );
}
