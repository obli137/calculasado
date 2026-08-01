import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { PwaProvider } from '@/components/PwaInstall'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CalculAsado',
  description: 'Calculadora de asado',
  applicationName: 'CalculAsado',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default' as const,
    title: 'CalculAsado',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  themeColor: '#dc2626',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <PwaProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </PwaProvider>
        <Analytics />
      </body>
    </html>
  )
}
