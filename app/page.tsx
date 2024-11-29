import AsadoForm from '../components/AsadoForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Calculadora de Asado</h1>
        
        <div className="prose prose-lg text-gray-700 mb-12 space-y-6">
          <p className="leading-relaxed">
            ¿Quién no estuvo alguna vez en el dilema existencial del asador? Que si el kilo de vacío alcanza, 
            que si el primo que dice que &quot;come poco&quot; arrasa con todo, o que si ese choripán de más termina siendo 
            la causa de un divorcio porque nadie lo toca y hay que llevarlo en un tupper. CalculaAsado viene a 
            salvar el honor de las parrilladas criollas con precisión de bisturí y alma de gaucho.
          </p>

          <p className="leading-relaxed">
            Nuestro objetivo es simple: que nunca sobre tanto que el asado parezca un banquete romano, pero 
            tampoco falte ese chori que hace la diferencia entre un encuentro feliz y un motín sindical. Acá 
            no hay algoritmos complicados ni métricas extrañas; usamos la lógica del argentino promedio: si el 
            invitado dice que &quot;no come mucho&quot;, calculale dos bifes y medio chori igual. Y ojo, también contemplamos 
            al &quot;compañero vegano&quot;, porque hasta el asado más clásico tiene que bancarse un zucchini en la parrilla.
          </p>

          <p className="leading-relaxed">
            En definitiva, CalculaAsado es el GPS del asador, pero con olor a humo y sabor a gloria. Usalo con 
            orgullo, no solo vas a quedar como un héroe nacional, sino que encima no vas a tener que estar 
            rogándole al carnicero que te fíe otro kilo de vacío. ¡A la parrilla, compañero, que de asado 
            sabemos todos, pero calcularlo ahora es cosa seria! 🥩🔥
          </p>
        </div>

        <AsadoForm />
      </div>
    </main>
  );
}