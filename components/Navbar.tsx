'use client';

import Link from 'next/link';
import Image from 'next/image';
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
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
            >
              <Image
                src="/logo.png"
                alt="CalculaAsado Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-lg font-bold text-red-600">CalculaAsado</span>
            </Link>
          </div>

          <div className="flex space-x-8 items-center">
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