'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AsadoCalculation {
  carne: number;
  embutidos: number;
  pan: number;
}

export default function AsadoForm() {
  const [formData, setFormData] = useState({
    cantidadHombres: '',
    cantidadMujeres: '',
    cantidadNinos: '',
    alPan: false,
  });
  const [resultado, setResultado] = useState<AsadoCalculation | null>(null);

  useEffect(() => {
    const hombres = parseInt(formData.cantidadHombres) || 0;
    const mujeres = parseInt(formData.cantidadMujeres) || 0;
    const ninos = parseInt(formData.cantidadNinos) || 0;
    
    let carneTotal = (
      (hombres * 0.45) +  // 450g por hombre
      (mujeres * 0.35) +  // 350g por mujer
      (ninos * 0.15)      // 150g por niño
    );

    const totalPersonas = hombres + mujeres + ninos;
    const calculoPan = formData.alPan ? 0.3 : 0.2;  // 300g por persona si es "Al Pan", 200g si es "Al Plato"
    const ajusteCarne = formData.alPan ? 0.7 : 1;

    setResultado({
      carne: carneTotal * ajusteCarne,
      embutidos: totalPersonas, // 1 unidad por persona
      pan: totalPersonas * calculoPan,
    });
  }, [formData]);

  return (
    <div className="w-full max-w-md mx-auto">
      <form className="bg-white shadow-lg rounded-lg p-6 mb-4">
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

        <div className="mb-6 flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-3">Al Plato</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox"
              checked={formData.alPan}
              onChange={(e) => setFormData({...formData, alPan: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
          <span className="text-sm font-medium text-gray-700 ml-3">Al Pan</span>
        </div>
      </form>

      {resultado && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">Resultados:</h2>
          <ul className="space-y-2">
            <li>Carne: {resultado.carne.toFixed(2)} kg</li>
            <li>Chorizos y/o Morcillas: {resultado.embutidos} unidades</li>
            <li>Pan: {resultado.pan.toFixed(1)} kg</li>
          </ul>
        </div>
      )}

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
