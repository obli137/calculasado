export default function Cafecito() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Invitanos un Cafecito</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Si te hicimos reír, te evitamos la típica sobremesa de &quot;che, ¿y ahora qué hacemos con todo este asado que sobró?&quot;, 
            o simplemente te salvamos de un asado al borde del caos, tiranos un hueso... o mejor, un cafecito.
          </p>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Con tu donación nos ayudás a seguir chamuyando algoritmos parrilleros, pagando el carbón digital 
            y manteniendo viva esta gran misión nacional: que no falte nunca un chori en la parrilla. 
            ¡Gracias, maestro asador! ☕🔥
          </p>

          <div className="flex justify-center">
            <a 
              href="https://cafecito.app/calculaasado" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              Invitar un Cafecito ☕
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 