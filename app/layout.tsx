import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'CalculaAsado - Calculadora de Asado',
  description: 'Calcula exactamente cuánta carne necesitas para tu asado. ¡No más sobras ni faltantes!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link 
          rel="icon" 
          href="/favicon.ico" 
          sizes="any"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
