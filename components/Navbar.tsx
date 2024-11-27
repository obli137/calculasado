import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-white text-xl font-bold ml-2">Calcul-Asado</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Calculadora de carne
          </Link>
          <Link href="/donde-comprar" className="text-gray-300 hover:text-white">
            Donde comprar
          </Link>
        </div>
      </div>
    </nav>
  );
} 