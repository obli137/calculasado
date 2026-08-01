export type GuiaMeta = {
  slug: string
  titulo: string
  descripcion: string
  metaDescription: string
}

export const GUIAS: GuiaMeta[] = [
  {
    slug: 'mi-primer-asado',
    titulo: 'Mi primer asado',
    descripcion:
      'Cómo no quemar todo ni la dignidad la primera vez que te dejan la parrilla.',
    metaDescription:
      'Guía práctica para tu primer asado: fuego, cantidades, cortes indulgentes y por qué conviene esperar más de lo que el ego permite.',
  },
  {
    slug: 'pecados-capitales-del-asador',
    titulo: 'Los pecados capitales del asador',
    descripcion:
      'Errores clásicos: fuego vivo, sal mal puesta, parrilla abierta cada dos minutos y otros vicios nacionales.',
    metaDescription:
      'Los errores más comunes del asador argentino y cómo corregirlos: fuego, sal, tiempos y la manía de mirar la carne.',
  },
  {
    slug: 'elegir-corte-segun-quien-viene',
    titulo: 'Cómo elegir el corte según quién viene',
    descripcion:
      'Qué comprar según el que come poco, el que come por tres, los chicos y el que “prueba un pedacito”.',
    metaDescription:
      'Elegí la carne del asado según tus invitados: tipologías humanas, cantidades y cortes que salvan el domingo.',
  },
  {
    slug: 'el-fuego-no-se-negocia',
    titulo: 'El fuego no se negocia',
    descripcion:
      'Brasas, carbón e impaciencia: cómo saber cuándo la parrilla está lista de verdad.',
    metaDescription:
      'Manejo del fuego y el carbón en el asado: brasas vs fuego vivo, cuándo poner la carne y tips para no convertir la parrilla en pira.',
  },
  {
    slug: 'checklist-previa-al-asado',
    titulo: 'Checklist previa al asado',
    descripcion:
      'Lista tachable antes del fuego: carne, carbón, sal y lo que siempre se olvida.',
    metaDescription:
      'Checklist práctica previa al asado: carne, carbón, sal gruesa, chimichurri y lo que siempre se olvida. Tachá antes de prender.',
  },
  {
    slug: 'diccionario-parrillero',
    titulo: 'Diccionario parrillero',
    descripcion:
      'Vacío, a punto, cuñado y otros términos que todos usan y nadie define bien.',
    metaDescription:
      'Diccionario parrillero argentino: qué significa vacío, a punto, jugoso, cuñado y más. Definiciones honestas, con humor seco.',
  },
]

export function getGuia(slug: string) {
  return GUIAS.find((g) => g.slug === slug)
}
