import AsadoForm from '../components/AsadoForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Calculadora de Asado</h1>
      <AsadoForm />
    </main>
  );
} 