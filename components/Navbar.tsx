import Image from 'next/image';


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-red-600' : 'text-gray-600 hover:text-red-600';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center px-2 py-2 text-lg font-bold text-red-600"
            >
              CalculaAsado
            </Link>
          </div>

          <div className="flex space-x-8">
            <Link 
              href="/" 
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}
            >
              Calculadora
            </Link>
            <Link 
              href="/donde-comprar" 
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/donde-comprar')}`}
            >
              Dónde Comprar
            </Link>
            <Link 
              href="/cafecito" 
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/cafecito')}`}
            >
              Invitar Cafecito
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 