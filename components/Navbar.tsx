'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()

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
                href="/carnicerias"
                className={`px-3 py-2 rounded-md ${
                  pathname === '/carnicerias' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                Carnicerías
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
