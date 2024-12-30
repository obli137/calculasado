'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

type CorteDeCarne = 'Tira de Asado' | 'Vacío' | 'Lomo' | 'Colita' | 'Entraña' | 'Bondiola' | 'Matambrito de cerdo' | 'Matambrito de ternera' | 'Pollo';
type TipoAchura = 'Chinchulines' | 'Riñón' | 'Mollejas' | 'Rueda';

interface FormData {
  cantidadHombres: string;
  cantidadMujeres: string;
  cantidadNinos: string;
  alPan: boolean;
  porcentajeAchuras: number;
  cortes: Record<CorteDeCarne, number>;
  achuras: Record<TipoAchura, number>;
}

interface AsadoCalculation {
  carne: number;
  embutidos: number;
  pan: number;
  distribucionCortes: { [key: string]: number };
  distribucionAchuras: { [key: string]: number };
}

export default function AsadoForm() {
  const [formData, setFormData] = useState<FormData>({
    cantidadHombres: '',
    cantidadMujeres: '',
    cantidadNinos: '',
    alPan: false,
    porcentajeAchuras: 0,
    cortes: {
      'Tira de Asado': 0,
      'Vacío': 0,
      'Lomo': 0,
      'Colita': 0,
      'Entraña': 0,
      'Bondiola': 0,
      'Matambrito de cerdo': 0,
      'Matambrito de ternera': 0,
      'Pollo': 0
    },
    achuras: {
      'Chinchulines': 0,
      'Riñón': 0,
      'Mollejas': 0,
      'Rueda': 0
    }
  });
  const [resultado, setResultado] = useState<AsadoCalculation | null>(null);

  const handleCorteChange = (corte: CorteDeCarne, value: number) => {
    const newCortes = { ...formData.cortes };
    newCortes[corte] = value;
    
    const totalCortes = Object.values(newCortes).reduce((sum, val) => sum + val, 0);
    const totalAchuras = Object.values(formData.achuras).reduce((sum, val) => sum + val, 0);
    
    if (totalCortes + totalAchuras <= 100) {
      setFormData({ ...formData, cortes: newCortes });
    }
  };

  const handleAchuraChange = (achura: TipoAchura, value: number) => {
    const newAchuras = { ...formData.achuras };
    newAchuras[achura] = value;
    
    const totalCortes = Object.values(formData.cortes).reduce((sum, val) => sum + val, 0);
    const totalAchuras = Object.values(newAchuras).reduce((sum, val) => sum + val, 0);
    
    if (totalCortes + totalAchuras <= 100) {
      setFormData({ ...formData, achuras: newAchuras });
    }
  };

  const calcularAsado = useCallback((): AsadoCalculation => {
    const totalPersonas = parseInt(formData.cantidadHombres || '0') +
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

    const distribucionCortes: { [key: string]: number } = {};
    const distribucionAchuras: { [key: string]: number } = {};
    
    Object.entries(formData.cortes).forEach(([corte, porcentaje]) => {
      if (porcentaje > 0) {
        distribucionCortes[corte] = (cantidadTotal * (porcentaje / 100));
      }
    });

    Object.entries(formData.achuras).forEach(([achura, porcentaje]) => {
      if (porcentaje > 0) {
        distribucionAchuras[achura] = (cantidadTotal * (porcentaje / 100));
      }
    });

    return {
      carne: cantidadTotal,
      embutidos: Math.ceil(totalPersonas / 2),
      pan: totalPersonas * calculoPan,
      distribucionCortes,
      distribucionAchuras
    };
  }, [formData]);

  useEffect(() => {
    const resultado = calcularAsado();
    setResultado(resultado);
  }, [formData, calcularAsado]);

  const getTotalPorcentaje = () => {
    return Object.values(formData.cortes).reduce((sum, val) => sum + val, 0) +
           Object.values(formData.achuras).reduce((sum, val) => sum + val, 0);
  };

  const getPorcentajeCarnes = () => {
    const totalCortes = Object.values(formData.cortes).reduce((sum, val) => sum + val, 0);
    const total = getTotalPorcentaje();
    return total > 0 ? ((totalCortes / total) * 100).toFixed(1) : '0';
  };

  const getPorcentajeAchuras = () => {
    const totalAchuras = Object.values(formData.achuras).reduce((sum, val) => sum + val, 0);
    const total = getTotalPorcentaje();
    return total > 0 ? ((totalAchuras / total) * 100).toFixed(1) : '0';
  };

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
          <>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Distribución de Cortes 🥩
              </label>
              <div className="space-y-3">
                {Object.entries(formData.cortes).map(([corte, porcentaje]) => (
                  <div key={corte} className="flex items-center gap-4">
                    <span className="text-sm text-gray-700 min-w-[150px]">{corte}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={porcentaje}
                      onChange={(e) => handleCorteChange(corte as CorteDeCarne, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <span className="text-sm text-gray-700 min-w-[3rem] text-right">
                      {porcentaje}%
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Porcentaje de cortes: {Object.values(formData.cortes).reduce((sum, val) => sum + val, 0)}%</span>
                  <span>({getPorcentajeCarnes()}% del total)</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Distribución de Achuras 🫀
              </label>
              <div className="space-y-3">
                {Object.entries(formData.achuras).map(([achura, porcentaje]) => (
                  <div key={achura} className="flex items-center gap-4">
                    <span className="text-sm text-gray-700 min-w-[150px]">{achura}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={porcentaje}
                      onChange={(e) => handleAchuraChange(achura as TipoAchura, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <span className="text-sm text-gray-700 min-w-[3rem] text-right">
                      {porcentaje}%
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Porcentaje de achuras: {Object.values(formData.achuras).reduce((sum, val) => sum + val, 0)}%</span>
                  <span>({getPorcentajeAchuras()}% del total)</span>
                </div>
              </div>
            </div>
          </>
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
                  <p className="text-sm text-red-600 font-medium">Total Carne</p>
                  <p className="text-2xl font-bold text-red-700">
                    {resultado.carne.toFixed(2)} kg
                  </p>
                </div>
              </div>

              {Object.entries(resultado.distribucionCortes).map(([corte, cantidad]) => (
                cantidad > 0 && (
                  <div key={corte} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xl">🥩</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-red-600 font-medium">{corte}</p>
                      <p className="text-2xl font-bold text-red-700">
                        {cantidad.toFixed(2)} kg
                      </p>
                    </div>
                  </div>
                )
              ))}

              {Object.entries(resultado.distribucionAchuras).map(([achura, cantidad]) => (
                cantidad > 0 && (
                  <div key={achura} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-xl">🫀</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-orange-600 font-medium">{achura}</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {cantidad.toFixed(2)} kg
                      </p>
                    </div>
                  </div>
                )
              ))}

              {resultado.embutidos > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">🌭</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-yellow-600 font-medium">Embutidos</p>
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
