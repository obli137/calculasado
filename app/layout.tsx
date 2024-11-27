import Navbar from '../components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Calculadora de Asado',
  description: 'Calcula las cantidades perfectas para tu asado',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}