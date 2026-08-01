import GuiaArticle from '@/components/GuiaArticle'

export const metadata = {
  title: 'Cómo elegir el corte según quién viene al asado | CalculAsado',
  description:
    'Guía para elegir carne según tus invitados: el que come poco, el que come por tres, los chicos y el que prueba “un pedacito”.',
}

export default function CortesSegunQuienPage() {
  return (
    <GuiaArticle titulo="Cómo elegir el corte según quién viene" slug="elegir-corte-segun-quien-viene">
      <h1 className="text-3xl font-bold text-gray-900">Cómo elegir el corte según quién viene</h1>
      <p>
        En la carni preguntan “¿para cuántos?”. Conviene contestar mirando la lista de
        WhatsApp. No todos comen igual, no todos llegan a la misma hora, y casi nadie
        confiesa el hambre con honestidad de balanza. Elegir el corte es, en el fondo,
        conocer a tu gente.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">El que come poco (o dice que come poco)</h2>
      <p>
        Aparece con “yo como dos bocados”. Después pica de todas las tablas. No lo juzgues:
        planificá. Conviene tener algo versátil y no demasiado aparatoso: buen vacío en
        cantidades moderadas, pollo, alguna pieza para cortar fino.
      </p>
      <p>
        Evitá comprar solo “el corte de fiesta” en volumen industrial. Si sobra, el freezer
        lo aguanta. Si falta, el que come poco mira para otro lado con una inocencia que
        merece estudio, no sermón.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">El que come por tres</h2>
      <p>
        No es un mito. Existe. Se identifica por la forma en que mira la parrilla: como quien
        mira un horario de trenes. Para este perfil, cantidad y cortes con presencia: tira,
        vacío, algo con hueso que entretenga.
      </p>
      <p>
        No intentes “educarlo” con ensalada. Acompañá, no reemplaces. Si sabés que viene, sumá
        margen en la calculadora. Mejor un poco de sobra que una discusión a las tres de la
        tarde sobre “quién se sirvió de más”.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">Los niños</h2>
      <p>
        Comen menos de lo que el adulto ansioso calcula y más chori del que el adulto
        confiesa. Priorizá piezas fáciles de cortar, no demasiado condimentadas, y embutidos
        con cabeza. El pollo suele salvar la diplomacia.
      </p>
      <p>
        Conviene tener un plato seguro temprano. El niño contento libera al asador. El niño
        esperando convierte la sobremesa en juicio oral.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">El vegetariano que “prueba un pedacito”</h2>
      <p>
        Puede ser coherente, curioso o diplomático. No lo pongas en el centro del espectáculo
        ni lo ignores. Asegurate de que haya algo verdaderamente comible sin carne: ensalada
        seria, provoleta, pan de verdad. Si prueba un pedazo, que sea decisión suya.
      </p>
      <p>
        En la compra no armes toda la logística alrededor de la excepción, pero tampoco hagas
        como si no existiera. Hospitalidad, no sermón.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">El que llega tarde</h2>
      <p>
        Llega cuando el resto está en el segundo vaso. Si cocinás todo “para cuando llegue”,
        castigás a los puntuales. Si no dejás nada, castigás al tardío.
      </p>
      <p>
        Solución: oleadas. Reservá una pieza o un sector más tarde. O dejá algo que se
        recaliente sin humillación. El que llega tarde no merece un vacío momificado, pero
        tampoco el veto del grupo.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">El comité de opiniones</h2>
      <p>
        Más que un invitado, es un fenómeno. Habla de punto, de sal, de “en mi casa se hace
        así”. Ante este perfil, elegí cortes que vos manejes. La seguridad del asador baja
        la temperatura social.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">Cómo armar el pedido sin volverte loco</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Contá personas reales, no “por las dudas” infinitos.</li>
        <li>Combiná un corte principal + uno de respaldo + embutidos.</li>
        <li>Si hay perfiles extremos (come poco / come por tres), inclináte al respaldo versátil.</li>
        <li>Usá números. La intuición es linda; el hambre, menos paciente.</li>
      </ul>
      <p>
        Al final gana el corte que llega a punto y alcanza para la mesa. El resto —el “en mi
        casa se hace así”, el corte de revista— queda para la sobremesa, donde duele menos.
      </p>
    </GuiaArticle>
  )
}
