'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import { usePwa } from '@/components/PwaInstall'

const links = [
  { href: '/', label: 'Calculadora' },
  { href: '/guias', label: 'Guías' },
  { href: '/carnicerias', label: 'Carni-radar' },
  { href: '/sobras', label: 'CalculaSobras' },
]

function linkIsActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const { isMobile, installed, openHelp } = usePwa()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur pt-[env(safe-area-inset-top)]">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-14 items-center justify-between gap-6 md:h-16 md:justify-start">
          <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Image
                src="/logo.png"
                alt="CalculAsado Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="ml-2 text-xl font-bold text-red-600">CalculaAsado</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex md:ml-2 lg:ml-4">
            {links.map((link) => {
              const active = linkIsActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div
            id={menuId}
            className="absolute left-0 right-0 top-full z-50 border-b border-gray-200 bg-white shadow-lg md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <ul className="flex flex-col px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              {links.map((link) => {
                const active = linkIsActive(pathname, link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block min-h-12 rounded-md px-4 py-3 text-base font-medium ${
                        active
                          ? 'bg-red-600 text-white'
                          : 'text-gray-800 hover:bg-red-50 hover:text-red-600'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
              {isMobile && !installed && (
                <li>
                  <button
                    type="button"
                    className="block min-h-12 w-full rounded-md px-4 py-3 text-left text-base font-medium text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setOpen(false)
                      openHelp()
                    }}
                  >
                    Dejar en el celu
                  </button>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </nav>
  )
}
