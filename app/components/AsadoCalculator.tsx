'use client'

import { useState, useEffect } from 'react';
import { Input, Switch, Button } from '@nextui-org/react';

export default function AsadoCalculator() {
  const [hombres, setHombres] = useState(0);
  const [mujeres, setMujeres] = useState(0);
  const [ninos, setNinos] = useState(0);
  const [isAlPan, setIsAlPan] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let subtotal = (hombres * 0.45) + (mujeres * 0.35) + (ninos * 0.15);
    if (isAlPan) {
      subtotal = subtotal * 0.7; // Reducción del 30% si es al pan
    }
    setTotal(Math.round(subtotal * 100) / 100);
  }, [hombres, mujeres, ninos, isAlPan]);

  const compartirWhatsapp = () => {
    const mensaje = `Para el asado necesitamos ${total}kg de carne 🥩\n` +
      `${hombres} hombres, ${mujeres} mujeres, ${ninos} niños\n` +
      `${isAlPan ? 'Al pan' : 'Al plato'}`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">
        Calculadora de Asado 🥩
      </h1>

      <div className="space-y-4">
        <Input
          type="number"
          label="Cantidad de Hombres"
          value={hombres.toString()}
          onChange={(e) => setHombres(Number(e.target.value))}
          min={0}
        />
        <Input
          type="number"
          label="Cantidad de Mujeres"
          value={mujeres.toString()}
          onChange={(e) => setMujeres(Number(e.target.value))}
          min={0}
        />
        <Input
          type="number"
          label="Cantidad de Niños"
          value={ninos.toString()}
          onChange={(e) => setNinos(Number(e.target.value))}
          min={0}
        />

        <div className="flex items-center justify-between">
          <span>Al Plato / Al Pan</span>
          <Switch
            checked={isAlPan}
            onChange={(e) => setIsAlPan(e.target.checked)}
          />
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-center text-xl font-bold">
            Total de carne necesaria:
          </p>
          <p className="text-center text-3xl font-bold text-red-600">
            {total} kg
          </p>
        </div>

        <Button
          color="success"
          className="w-full"
          onClick={compartirWhatsapp}
        >
          Compartir por WhatsApp 📱
        </Button>
      </div>
    </div>
  );
} 