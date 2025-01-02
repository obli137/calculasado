'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4">
                <span className="font-semibold text-gray-500 text-lg">🔥 Calculasado</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`py-4 px-2 ${
                  pathname === '/' ? 'text-red-500 border-b-4 border-red-500' : 'text-gray-500 hover:text-red-500 transition duration-300'
                }`}
              >
                Calculadora
              </Link>
              <Link
                href="/precios"
                className={`py-4 px-2 ${
                  pathname === '/precios' ? 'text-red-500 border-b-4 border-red-500' : 'text-gray-500 hover:text-red-500 transition duration-300'
                }`}
              >
                Precios
              </Link>
              {user && (
                <Link
                  href="/mis-compras"
                  className={`py-4 px-2 ${
                    pathname === '/mis-compras' ? 'text-red-500 border-b-4 border-red-500' : 'text-gray-500 hover:text-red-500 transition duration-300'
                  }`}
                >
                  Mis Compras
                </Link>
              )}
            </div>
          </div>
          
          {/* Sección de autenticación */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <span className="text-gray-500">Cargando...</span>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  pathname === '/login' ? 'bg-red-700' : ''
                }`}
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Menú móvil */}
          <div className="md:hidden flex items-center">
            {!loading && (user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
              >
                Entrar
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}