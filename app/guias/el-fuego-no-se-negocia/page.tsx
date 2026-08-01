import GuiaArticle from '@/components/GuiaArticle'

export const metadata = {
  title: 'El fuego no se negocia: brasas, carbón y paciencia | CalculAsado',
  description:
    'Cómo manejar el fuego del asado: cuándo la parrilla está lista, brasas vs llama viva y tips para no convertir la carne en pira funeraria.',
}

export default function FuegoPage() {
  return (
    <GuiaArticle titulo="El fuego no se negocia" slug="el-fuego-no-se-negocia">
      <h1 className="text-3xl font-bold text-gray-900">El fuego no se negocia</h1>
      <p>
        Se puede discutir el vino, el punto, hasta el chimichurri. El fuego, no. El fuego
        tiene horarios propios. Quien los respeta, come. Quien los discute, explica.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">Fuego vivo y brasas</h2>
      <p>
        El fuego vivo prende. Las brasas cocinan. Confundir las dos etapas explica casi
        todas las tragedias parrilleras: la llama marca, endurece y deja el centro a merced
        del azar.
      </p>
      <p>
        Cuando el carbón está negro y con llamas, todavía estás armando. Cuando se cubre de
        ceniza blanca y brilla por debajo, recién ahí trabajás. Esa diferencia es
        temperatura que se puede usar, no misterio.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">Cómo reconocer que la parrilla está lista</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Carbón encendido de verdad, no a medias.</li>
        <li>Capa de ceniza clara en la superficie.</li>
        <li>Calor que sostiene la mano unos segundos a altura de cocina (sin heroísmo).</li>
        <li>Pocas o ninguna llama espontánea al acomodar.</li>
      </ul>
      <p>
        Si dudás, esperá cinco minutos más. Nunca te arrepentís de esperar brasas. Casi
        siempre te arrepentís de apurar.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">La impaciencia es el enemigo número uno</h2>
      <p>
        La impaciencia pone la carne temprano, abre la tapa, pide opiniones, cambia de lugar
        las piezas como si eso acelerara la física. No la acelera. Solo multiplica el estrés.
      </p>
      <p>
        Antídoto: ocuparte de otra cosa mientras el fuego madura. Ensalada, hielo, pan,
        playlist. El carbón no necesita compañía. Necesita oxígeno y tiempo.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">Tips concretos para no armar una pira</h2>
      <p>
        <strong>No ahogues el carbón</strong> con más carbón frío encima a lo loco. Alimentá
        de a poco si hace falta.
      </p>
      <p>
        <strong>Dejá zonas</strong>: un sector más fuerte, uno más suave. Así rescatás lo que
        se pasa y terminás lo que falta.
      </p>
      <p>
        <strong>Controlá la grasa</strong>: cuando gotea y prende llama, mové la pieza. Eso
        no te da “ahumado de restaurante”: te come el trabajo a dentelladas.
      </p>
      <p>
        <strong>No uses el viento como excusa eterna</strong>. Si hace viento, protegés y
        adaptás. El clima complica; no absuelve.
      </p>
      <p>
        <strong>Cantidad de carbón</strong>: mejor sobrar un poco de calor que quedarte corto
        a mitad de cocción. El carbón “justito” es una apuesta. Las apuestas se hacen con
        fichas, no con el almuerzo de doce personas.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-gray-900">El orden del trabajo</h2>
      <p>
        1) Prender. 2) Esperar. 3) Acomodar brasas. 4) Cocinar por oleadas. 5) Reposar. Si
        invertís el orden, la mesa lo nota antes que vos.
      </p>
      <p>
        Las achuras y lo fino suelen ir cuando el calor ya está estable. Lo grueso, con
        tiempo y sin nervios. El chori forma parte del plan: no lo uses de parche de
        emergencia para tapar errores.
      </p>

      <p>
        Al fuego se lo trata con costumbre, no con talento de nacimiento: esperando más de
        lo cómodo y moviendo menos de lo nervioso. El aplauso, si viene, viene solo. La
        parrilla, mientras tanto, pide brasas.
      </p>
    </GuiaArticle>
  )
}
