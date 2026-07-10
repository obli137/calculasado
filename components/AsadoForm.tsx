'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const getTotalPersonas = () =>
    parseInt(formData.cantidadHombres || '0') +
    parseInt(formData.cantidadMujeres || '0') +
    parseInt(formData.cantidadNinos || '0');

  const calcularAsado = useCallback((): AsadoCalculation => {
    const totalPersonas =
      parseInt(formData.cantidadHombres || '0') +
      parseInt(formData.cantidadMujeres || '0') +
      parseInt(formData.cantidadNinos || '0');

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

    return {
      carne: cantidadTotal,
      embutidos: totalEmbutidos,
      pan: totalPersonas * calculoPan,
    };
  }, [formData]);

  useEffect(() => {
    const resultado = calcularAsado();
    setResultado(resultado);
  }, [formData, calcularAsado]);

  const totalPersonas = getTotalPersonas();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Calculadora de Asado</h1>
      
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
    </div>
  );
}
