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
import MasRecursos from '@/components/MasRecursos';
import { AddToHomeCard } from '@/components/PwaInstall';

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

type GuestKey = 'cantidadHombres' | 'cantidadMujeres' | 'cantidadNinos';

function parseCount(value: string) {
  const n = parseInt(value || '0', 10);
  return Number.isNaN(n) ? 0 : Math.max(0, n);
}

function GuestStepper({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const n = parseCount(value);

  const setN = (next: number) => {
    onChange(next <= 0 ? '' : String(next));
  };

  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          aria-label={`Restar ${label.toLowerCase()}`}
          disabled={n <= 0}
          onClick={() => setN(n - 1)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-3 text-center text-base text-gray-800 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
          id={id}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          aria-label={`Sumar ${label.toLowerCase()}`}
          onClick={() => setN(n + 1)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-xl font-semibold text-gray-700 hover:bg-gray-50"
        >
          +
        </button>
      </div>
    </div>
  );
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
    resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [resultado]);

  const getTotalPersonas = () =>
    parseCount(formData.cantidadHombres) +
    parseCount(formData.cantidadMujeres) +
    parseCount(formData.cantidadNinos);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setResultado(null);
    setFraseResultado('');
  };

  const setGuest = (key: GuestKey, value: string) => {
    updateFormData({ [key]: value });
  };

  const calcularAsado = useCallback((): AsadoCalculation => {
    const hombres = parseCount(formData.cantidadHombres);
    const mujeres = parseCount(formData.cantidadMujeres);
    const ninos = parseCount(formData.cantidadNinos);
    const totalPersonas = hombres + mujeres + ninos;

    let cantidadTotal = hombres * 0.5 + mujeres * 0.4 + ninos * 0.2;

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

    const hombres = parseCount(formData.cantidadHombres);
    const mujeres = parseCount(formData.cantidadMujeres);
    const ninos = parseCount(formData.cantidadNinos);
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
    <div className="mx-auto max-w-2xl px-0 sm:px-2">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Calculadora de Asado</h1>
      <p className="mb-5 text-sm text-gray-500">
        Para que no falte el chori ni sobre media vaca.
      </p>

      <form onSubmit={handleCalcular} className="mb-4 rounded-lg bg-white p-4 shadow-lg sm:p-6">
        <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          <p>
            Completá los invitados y hacé las cuentas. El asado no perdona la improvisación.
          </p>
        </div>

        <GuestStepper
          id="hombres"
          label="Hombres"
          placeholder="Los que pelean por el vacío"
          value={formData.cantidadHombres}
          onChange={(v) => setGuest('cantidadHombres', v)}
        />
        <GuestStepper
          id="mujeres"
          label="Mujeres"
          placeholder="Las que saben cuándo está a punto"
          value={formData.cantidadMujeres}
          onChange={(v) => setGuest('cantidadMujeres', v)}
        />
        <GuestStepper
          id="ninos"
          label="Niños"
          placeholder="Los que piden el chori primero"
          value={formData.cantidadNinos}
          onChange={(v) => setGuest('cantidadNinos', v)}
        />

        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-bold text-gray-700">Modalidad</legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateFormData({ alPan: false })}
              className={`min-h-12 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                !formData.alPan
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-red-200'
              }`}
              aria-pressed={!formData.alPan}
            >
              Al plato
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ alPan: true })}
              className={`min-h-12 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                formData.alPan
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-red-200'
              }`}
              aria-pressed={formData.alPan}
            >
              Al pan
            </button>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={totalPersonas === 0}
          className="w-full rounded-lg bg-red-600 px-4 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Hacer las cuentas 🔥
        </button>

        <div className="relative mt-4 h-24 overflow-visible sm:h-28">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            {showVeganTooltip && !veganRendido && (
              <p className="pointer-events-none absolute -top-9 left-1/2 z-10 max-w-[90vw] -translate-x-1/2 rounded bg-gray-900 px-3 py-1 text-center text-xs text-white shadow">
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

      {resultado && (
        <div
          ref={resultadoRef}
          className="scroll-mt-20 overflow-hidden rounded-lg bg-white shadow-lg"
        >
          <div className="bg-red-600 p-4">
            <h2 className="text-center text-xl font-bold text-white">
              Las cuentas están hechas
            </h2>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            {fraseResultado && (
              <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-sm italic text-red-800">
                “{fraseResultado}”
              </p>
            )}

            <div className="flex items-center rounded-lg border border-red-100 bg-red-50 p-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <span className="text-xl text-red-600">🥩</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-red-600">Total Carne</p>
                <p className="text-2xl font-bold text-red-700">
                  {resultado.carne.toFixed(2)} kg
                </p>
              </div>
            </div>

            {resultado.embutidos > 0 && (
              <div className="flex items-center rounded-lg border border-yellow-100 bg-yellow-50 p-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <span className="text-xl text-yellow-600">🌭</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-600">Chorizos o Morcillas</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {resultado.embutidos} unidades
                  </p>
                </div>
              </div>
            )}

            {formData.alPan && resultado.pan > 0 && (
              <div className="flex items-center rounded-lg border border-amber-100 bg-amber-50 p-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-xl text-amber-600">🍞</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-amber-600">Pan</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {resultado.pan} unidades
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              <p>
                <span className="mr-1">💡</span>
                {formData.alPan ? TIP_AL_PAN : TIP_AL_PLATO}
              </p>
            </div>

            <button
              type="button"
              onClick={compartirWhatsapp}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-green-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Avisar por WhatsApp
            </button>

            <AddToHomeCard />

            <MasRecursos />
          </div>
        </div>
      )}

      {!resultado && (
        <p className="mt-2 text-center text-sm text-gray-400">
          Completá invitados y hacé las cuentas.
        </p>
      )}
    </div>
  );
}
