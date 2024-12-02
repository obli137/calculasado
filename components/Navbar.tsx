'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-red-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
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

        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } md:hidden pb-4 transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Calculadora
            </Link>
            <Link
              href="/donde-comprar"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/donde-comprar')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dónde Comprar
            </Link>
            <Link
              href="/cafecito"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/cafecito')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Invitar Cafecito
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}