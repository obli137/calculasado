'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AsadoCalculation {
  carne: number;
  embutidos: number;
  pan: number;
  achuras: number;
}

export default function AsadoForm() {
  const [formData, setFormData] = useState({
    cantidadHombres: '',
    cantidadMujeres: '',
    cantidadNinos: '',
    alPan: false,
    porcentajeAchuras: 0,
  });
  const [resultado, setResultado] = useState<AsadoCalculation | null>(null);

  const calcularAsado = () => {
    const hombres = parseInt(formData.cantidadHombres) || 0;
    const mujeres = parseInt(formData.cantidadMujeres) || 0;
    const ninos = parseInt(formData.cantidadNinos) || 0;
    
    let carneTotal = (
      (hombres * 0.45) +  // 450g por hombre
      (mujeres * 0.35) +  // 350g por mujer
      (ninos * 0.15)      // 150g por niño
    );

    const totalPersonas = hombres + mujeres + ninos;
    const calculoPan = formData.alPan ? 0.25 : 0.1;
    const ajusteCarne = formData.alPan ? 0.7 : 1;
    
    if (formData.alPan) {
      return {
        carne: carneTotal * ajusteCarne,
        embutidos: Math.ceil(totalPersonas / 2),
        pan: totalPersonas * calculoPan,
        achuras: 0
      };
    }

    const porcentajeAchuras = formData.porcentajeAchuras / 100;
    const cantidadAchuras = carneTotal * porcentajeAchuras * ajusteCarne;
    const cantidadCarneFinal = carneTotal * (1 - porcentajeAchuras) * ajusteCarne;

    return {
      carne: cantidadCarneFinal,
      embutidos: Math.ceil(totalPersonas / 2),
      pan: totalPersonas * calculoPan,
      achuras: cantidadAchuras,
    };
  };

  useEffect(() => {
    const hombres = parseInt(formData.cantidadHombres) || 0;
    const mujeres = parseInt(formData.cantidadMujeres) || 0;
    const ninos = parseInt(formData.cantidadNinos) || 0;
    
    const totalPersonas = hombres + mujeres + ninos;

    if (totalPersonas > 0) {
      const resultado = calcularAsado();
      setResultado(resultado);
    } else {
      setResultado(null);
    }
  }, [formData.cantidadHombres, formData.cantidadMujeres, formData.cantidadNinos, formData.alPan, formData.porcentajeAchuras]);

  return (
    <div className="w-full max-w-md mx-auto">
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
              onChange={(e) => {
                const isAlPan = e.target.checked;
                setFormData({
                  ...formData, 
                  alPan: isAlPan,
                  porcentajeAchuras: isAlPan ? 0 : formData.porcentajeAchuras
                });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
          <span className="text-sm font-medium text-gray-700 ml-3">Al Pan</span>
        </div>

        {!formData.alPan && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Achurómetro 🥩
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={formData.porcentajeAchuras}
                onChange={(e) => {
                  const valor = parseInt(e.target.value);
                  setFormData(prev => ({...prev, porcentajeAchuras: valor}));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                {formData.porcentajeAchuras}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Porcentaje del total de carne que será achuras
            </p>
          </div>
        )}
      </form>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-red-600 p-4">
          <h2 className="text-xl font-bold text-white text-center">
            {resultado ? '¡Tu Asado Calculado!' : 'Resultados'}
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          {!resultado ? (
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
                  <p className="text-sm text-red-600 font-medium">Carne</p>
                  <p className="text-2xl font-bold text-red-700">
                    {resultado.carne.toFixed(2)} kg
                  </p>
                </div>
              </div>

              {!formData.alPan && (
                <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xl">🫀</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-purple-600 font-medium">Achuras</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {resultado.achuras.toFixed(2)} kg
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">🌭</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-orange-600 font-medium">Chorizos y Morcillas</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {resultado.embutidos} unidades
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">🍞</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-yellow-600 font-medium">Pan</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {resultado.pan.toFixed(1)} kg
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="mr-2">💡</span>
                  Tip: {formData.alPan ? 
                    "Calculado para asado al pan con ajuste en la cantidad de carne" : 
                    "Calculado para asado al plato con porciones completas"}
                </p>
              </div>
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
