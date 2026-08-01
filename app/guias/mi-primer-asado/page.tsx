import GuiaArticle from '@/components/GuiaArticle'

export const metadata = {
  title: 'Mi primer asado: guía práctica para principiantes | CalculAsado',
  description:
    'Recomendaciones honestas para tu primer asado: fuego, cantidades, cortes indulgentes y por qué conviene esperar más de lo que el ego permite.',
}

export default function MiPrimerAsadoPage() {
  return (
    <GuiaArticle titulo="Mi primer asado" slug="mi-primer-asado">
      <h1 className="text-3xl font-bold text-gray-900">Mi primer asado</h1>
      <p>
        Hay un momento en la vida en que alguien te mira y dice: “prendé vos”. Ahí se te
        acaba la carrera de ayudante. El primer asado no pide genialidad: pide que la carne
        llegue a la mesa reconocible y que vos no salgas del patio con cara de rehén.
      </p>
      <p>
        Este texto es para el que nunca tuvo la parrilla a cargo. Consejos prácticos, sin
        mística de chef.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">El miedo al fuego es razonable</h2>
      <p>
        El fuego intimida porque no espera tu estado de ánimo. Si lo apurás, te castiga; si
        lo abandonás, se apaga como un invitado ofendido. La primera lección es esperar. El
        que no aguanta abre la tapa cada dos minutos, a ver si la carne ya aprendió algo. No
        aprendió: solo se enfría el entorno.
      </p>
      <p>
        Prendé el carbón con tiempo. Mucho tiempo. Más del que creés. Mientras tanto,
        prepará la sal, las tablas, las bebidas. El fuego madura solo si lo dejás en paz.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">Cómo no quemar todo</h2>
      <p>
        Regla simple: la carne va sobre brasas, no sobre llama. Si ves fuego chupando el
        costado del vacío, corré la pieza, esperá, respirá. Quemar el afuera y dejar el
        centro crudo es el diploma del apurado.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Empezá con menos piezas de las que imaginas. El ego hincha el pedido.</li>
        <li>Dejá un sector de la parrilla más suave para rescatar lo que se pase.</li>
        <li>No pinches la carne como si fuera un globo. Los jugos no son decorativos.</li>
      </ul>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">Cantidades básicas (sin histeria)</h2>
      <p>
        Para no quedar corto ni con media vaca en la heladera, pensá en porciones honestas:
        alrededor de medio kilo por adulto al plato, un poco menos si es al pan. Los chicos
        comen menos de lo que el tío cree. Usá una calculadora si hace falta. Improvisar
        kilos de memoria es un deporte de riesgo, no un acto de fe.
      </p>
      <p>
        Sumá embutidos con cabeza: no reemplazan la carne, la acompañan. El pan, si es al
        pan, no se improvisa a las once de la mañana.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">Cortes indulgentes para principiantes</h2>
      <p>
        No empieces por la entraña más caprichosa ni por un lomo que exige precisión de
        cirujano. Buscá cortes generosos y más perdonadores: tira de asado, vacío, un
        pollo bien abierto. El matambre también tolera cierto margen de error.
      </p>
      <p>
        Pedile a la carni que te aconseje sin vergüenza. Decir “es mi primer asado” no te
        baja el precio ni la dignidad. Al revés: el carnicero suele respetar más al que
        confiesa que al que finge saber.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">El error de querer impresionar</h2>
      <p>
        Dejá el chimichurri de autor y la técnica del video de las tres de la mañana para
        más adelante. Ahora alcanza con que la gente coma rico y vos no sufras. Impresionar
        viene después, cuando ya sabés esperar.
      </p>
      <p>
        Si alguien opina demasiado cerca del fuego, pedile que traiga hielo. La opinión sin
        carbón pesa poco.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">La paciencia vale más que el talento</h2>
      <p>
        En la parrilla gana el que no se apura. El que prueba sin desesperar. El que entiende
        que “todavía” es una respuesta válida. El talento, si aparece, aparece en la
        sobremesa, cuando ya nadie mira el reloj.
      </p>
      <p>
        Terminá con una ensalada, un buen pan y la promesa de que el próximo va a salir
        menos nervioso. El primero solo tiene que no ser una tragedia.
      </p>
    </GuiaArticle>
  )
}
