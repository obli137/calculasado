'use client';
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <div className="rounded-full overflow-hidden w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="CalculAsado Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-red-600 font-bold text-xl ml-2">CalculAsado</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md ${
                  pathname === '/' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                Calculadora
              </Link>
              <Link
                href="/precios"
                className={`px-3 py-2 rounded-md ${
                  pathname === '/precios' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                Precios
              </Link>
              <Link
                href="/mis-compras"
                className={`px-3 py-2 rounded-md ${
                  pathname === '/mis-compras' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                Mis Compras
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user.email}</span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-600 hover:text-red-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-red-600"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}