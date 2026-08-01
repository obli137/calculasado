import GuiaArticle from '@/components/GuiaArticle'

export const metadata = {
  title: 'Los pecados capitales del asador | CalculAsado',
  description:
    'Errores clásicos del asado argentino: poner la carne con fuego vivo, salar mal, abrir la parrilla cada dos minutos y cómo corregirlos.',
}

export default function PecadosPage() {
  return (
    <GuiaArticle titulo="Los pecados capitales del asador" slug="pecados-capitales-del-asador">
      <h1 className="text-3xl font-bold text-gray-900">Los pecados capitales del asador</h1>
      <p>
        No hace falta ser creyente para pecar en la parrilla. Alcanza con apuro, orgullo o
        una pinza en la mano. Estos son los vicios más repetidos. Ofenden menos al cielo que
        a la carne — y a los que esperan con el plato.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">I. Poner la carne con fuego vivo</h2>
      <p>
        La llama chupa, carboniza y miente: por fuera parece listo, por dentro sigue crudo.
        Después te quedás con un problema de timing imposible y una pieza que nadie sabe
        cómo rescatar.
      </p>
      <p>
        <strong>Corrección:</strong> esperá brasas. Carbón blanco-gris, calor parejo, sin
        lenguas de fuego lamiendo la grasa. Si aparece llama, corré la pieza y tapá el
        origen con un poco de ceniza o esperá. El fuego vivo es para prender, no para cocinar.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">II. Salar como si fuera un castigo</h2>
      <p>
        Salar de más deja la superficie agresiva. Salar de menos deja la carne triste. Salar
        “cuando se me ocurre” suele ser las dos cosas a la vez.
      </p>
      <p>
        <strong>Corrección:</strong> sal gruesa, con criterio, cuando la pieza ya está en
        juego o justo antes, según el corte y tu costumbre — pero con método. No uses el
        salero de mesa. La sal del asado se pone con la mano; si la esparcés como castigo,
        después nadie sabe por qué “está raro”.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">III. Abrir la parrilla cada dos minutos</h2>
      <p>
        Cada mirada es una fuga de calor y una declaración de desconfianza. La carne no
        cocina más rápido porque la mires. Solo se enfría el entorno y se alarga la agonía.
      </p>
      <p>
        <strong>Corrección:</strong> mirá con espaciado. Usá el reloj y el olfato. Si
        necesitás control, dejá un costado libre para chequear una pieza testigo. El resto,
        que descanse.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">IV. Subestimar los tiempos</h2>
      <p>
        “En una hora comemos” es literatura. Entre prender, esperar brasas, cocinar y
        reposar, el reloj miente si lo cargás de optimismo.
      </p>
      <p>
        <strong>Corrección:</strong> sumá margen. Avisá más tarde, no más temprano. La gente
        prefiere esperar comiendo un picadito a mirar un vacío a medio camino mientras el
        hambre se pone de mal humor.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">V. Querer hacer de todo a la vez</h2>
      <p>
        Achuras, pollo, vacío, chori, verduras y una teoría sobre el origen del hombre. El
        principiante llena la parrilla como si fuera un buffet. Resultado: nada termina bien
        y todo pide atención.
      </p>
      <p>
        <strong>Corrección:</strong> ordená oleadas. Primero lo que lleva más tiempo. Después
        lo rápido. Dejá espacio entre piezas: el aire también ayuda.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">VI. Escuchar a todos los asesores</h2>
      <p>
        Alrededor del fuego aparece un congreso. Cada uno tiene un método. Si los obedecés
        a todos, la carne se cocina por comité. Los comités no asan: discuten.
      </p>
      <p>
        <strong>Corrección:</strong> un responsable. Opiniones después. Si alguien insiste,
        pedile carbón o que corte el pan. La democracia es hermosa; la parrilla, no tanto.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">VII. Servir sin reposo</h2>
      <p>
        Sacás la pieza y la atacás: los jugos se van al plato como agua tirada. Queda seco
        lo que podía estar amable.
      </p>
      <p>
        <strong>Corrección:</strong> unos minutos de espera en tabla. Mientras, acomodá
        ensalada y bebidas. El hambre aguanta ese rato; la carne, agradecida, también.
      </p>

      <p>
        El buen asador no colecciona virtudes. Colecciona correcciones a tiempo. El resto es
        anécdota para el lunes.
      </p>
    </GuiaArticle>
  )
}
