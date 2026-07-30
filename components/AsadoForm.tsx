'use client';

import { useState, useCallback, useRef } from 'react';

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

const VEGAN_MESSAGES = [
  'Soy vegano 🌱',
  '¿En serio? 😏',
  'Acá no, che',
  'Fuera de la parrilla',
  '¡Ni en pedo!',
  'Buscá ensalada 🥗',
];

export default function AsadoForm() {
  const [formData, setFormData] = useState<FormData>({
    cantidadHombres: '',
    cantidadMujeres: '',
    cantidadNinos: '',
    alPan: false,
  });
  const [resultado, setResultado] = useState<AsadoCalculation | null>(null);
  const [veganPos, setVeganPos] = useState({ x: 0, y: 0 });
  const [veganLabel, setVeganLabel] = useState(VEGAN_MESSAGES[0]);
  const veganAreaRef = useRef<HTMLDivElement>(null);

  const getTotalPersonas = () =>
    parseInt(formData.cantidadHombres || '0') +
    parseInt(formData.cantidadMujeres || '0') +
    parseInt(formData.cantidadNinos || '0');

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setResultado(null);
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
    if (getTotalPersonas() === 0) return;
    setResultado(calcularAsado());
  };

  const huirVegano = () => {
    const area = veganAreaRef.current;
    if (!area) {
      setVeganPos({
        x: Math.random() * 200 - 100,
        y: Math.random() * 80 - 40,
      });
    } else {
      const maxX = Math.max(area.clientWidth - 160, 40);
      const maxY = Math.max(area.clientHeight - 48, 20);
      setVeganPos({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      });
    }

    setVeganLabel(
      VEGAN_MESSAGES[Math.floor(Math.random() * VEGAN_MESSAGES.length)]
    );
  };

  const totalPersonas = getTotalPersonas();

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

    let mensaje = `🔥 *LISTO EL ASADO* 🔥\n\n`;
    mensaje += `Che, ya está la cuenta para no quedar colgados:\n\n`;
    mensaje += `👥 *Invitados:* ${invitados} (${totalPersonas} en total)\n`;
    mensaje += `🍽️ *Modalidad:* ${modalidad}\n\n`;
    mensaje += `🥩 *Carne:* ${resultado.carne.toFixed(2)} kg\n`;
    mensaje += `🌭 *Chorizos o morcillas:* ${resultado.embutidos} unidades\n`;

    if (formData.alPan && resultado.pan > 0) {
      mensaje += `🍞 *Pan:* ${resultado.pan} unidades\n`;
    }

    mensaje += `\nSacado con CalculAsado — para que no falte el chori ni sobre media vaca 😎🔥`;

    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Calculadora de Asado</h1>
      
      <form onSubmit={handleCalcular} className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
          <div className="flex items-center">
            <span className="mr-2">ℹ️</span>
            <p>
              Completá los invitados y apretá <strong>Calcular asado</strong> para ver las cantidades.
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
            onChange={(e) => updateFormData({ cantidadHombres: e.target.value })}
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
            onChange={(e) => updateFormData({ cantidadMujeres: e.target.value })}
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
            onChange={(e) => updateFormData({ cantidadNinos: e.target.value })}
            placeholder="Número de niños"
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
          Calcular asado 🔥
        </button>

        <div
          ref={veganAreaRef}
          className="relative mt-6 h-24 overflow-hidden rounded-lg border border-dashed border-gray-200 bg-gray-50"
        >
          <button
            type="button"
            onMouseEnter={huirVegano}
            onFocus={huirVegano}
            onTouchStart={(e) => {
              e.preventDefault();
              huirVegano();
            }}
            onClick={(e) => e.preventDefault()}
            style={{
              position: 'absolute',
              left: veganPos.x,
              top: veganPos.y,
            }}
            className="whitespace-nowrap rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow-sm transition-all duration-150 hover:bg-green-100"
          >
            {veganLabel}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          Si sos vegano, intentá apretar el botón de arriba
        </p>
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
                Agregá invitados y apretá Calcular asado
              </p>
              <p className="text-sm mt-2 text-gray-400">
                El resultado aparece solo cuando lo pedís
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

              <button
                type="button"
                onClick={compartirWhatsapp}
                className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Compartir por WhatsApp
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
