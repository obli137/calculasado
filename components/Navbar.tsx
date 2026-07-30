'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Calculadora' },
  { href: '/carnicerias', label: 'Carni-radar 📍' },
  { href: '/checklist', label: 'Checklist' },
  { href: '/diccionario', label: 'Diccionario' },
  { href: '/sobras', label: 'CalculaSobras' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between md:h-16 md:py-0 md:gap-0">
          <Link href="/" className="flex items-center shrink-0">
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
            
          <div className="flex flex-wrap gap-1 md:gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-md text-sm ${
                  pathname === link.href
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
