export type TipoSobra = 'vaca' | 'cerdo' | 'pollo' | 'mixto' | 'embutido'

export type TiempoReceta = 'rapido' | 'medio' | 'largo'

export type RecetaSobra = {
  id: string
  nombre: string
  minKg: number
  maxKg: number
  tipos: TipoSobra[]
  tiempo: TiempoReceta
  porcionesApprox: string
  frase: string
  pasos: string[]
  tip: string
}

export type RangoSobra = {
  id: string
  maxKg: number // exclusive upper bound; Infinity for last
  titulo: string
  frase: string
}

export const TIPOS_SOBRA: { value: TipoSobra | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Cualquier cosa que haya sobrado' },
  { value: 'vaca', label: 'Vacuno' },
  { value: 'cerdo', label: 'Cerdo' },
  { value: 'pollo', label: 'Pollo' },
  { value: 'mixto', label: 'Mixto / no sé' },
  { value: 'embutido', label: 'Embutidos' },
]

export const RANGOS_SOBRA: RangoSobra[] = [
  {
    id: 'nada',
    maxKg: 0.01,
    titulo: 'Nada',
    frase: 'No sobró. O se lo llevaron, o fue un cálculo honesto.',
  },
  {
    id: 'miga',
    maxKg: 0.25,
    titulo: 'Miga heroica',
    frase: 'Sobró casi nada. Acá manda el ingenio, no la olla.',
  },
  {
    id: 'lunes',
    maxKg: 0.75,
    titulo: 'Sobras de lunes',
    frase: 'Cantidad digna de un almuerzo arrepentido.',
  },
  {
    id: 'familiar',
    maxKg: 1.5,
    titulo: 'Plan familiar',
    frase: 'Alcanza para transformar el domingo en otra cosa.',
  },
  {
    id: 'freezer',
    maxKg: 3,
    titulo: 'Operativo freezer',
    frase: 'Esto ya pide organización. Y Tupperware.',
  },
  {
    id: 'crisis',
    maxKg: 5,
    titulo: 'Crisis controlada',
    frase: 'No es sobra: es un segundo acto disfrazado.',
  },
  {
    id: 'emergencia',
    maxKg: Infinity,
    titulo: 'Estado de emergencia',
    frase: 'Negación absoluta no alcanza. Aceptá el destino.',
  },
]

export const RECETAS_SOBRA: RecetaSobra[] = [
  {
    id: 'sanguche-madrugada',
    nombre: 'Sanguche de la madrugada',
    minKg: 0.01,
    maxKg: 0.25,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto', 'embutido'],
    tiempo: 'rapido',
    porcionesApprox: '1 sanguche generoso',
    frase: 'Lo come el que apaga la luz. Ley no escrita.',
    pasos: [
      'Calentá lo que haya en una sartén con un chorrito de aceite.',
      'Pan, mayonesa o chimichurri, carne, listo.',
      'Comelo de pie. Sentarse sería admitir que planeaste esto.',
    ],
    tip: '~120–150 g por sanguche. Si sobra menos, igual sirve.',
  },
  {
    id: 'revuelto-gloria',
    nombre: 'Huevos revueltos con restos de gloria',
    minKg: 0.01,
    maxKg: 0.25,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto', 'embutido'],
    tiempo: 'rapido',
    porcionesApprox: '1–2 personas',
    frase: 'El desayuno más honesto del país.',
    pasos: [
      'Pícá fino lo que quedó.',
      'Doralo y tirale 2–3 huevos.',
      'Sal, pimienta, y silencio respetuoso.',
    ],
    tip: 'Funciona especialmente bien con embutido o vacío jugoso.',
  },
  {
    id: 'negacion',
    nombre: 'Negación oficial',
    minKg: 0.01,
    maxKg: 0.25,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto', 'embutido'],
    tiempo: 'rapido',
    porcionesApprox: '0 (oficialmente)',
    frase: '“No sobró nada”, mientras lo escondés detrás del yogurt.',
    pasos: [
      'Guardá en un táper opaco.',
      'Etiquetá “verduras” si hace falta.',
      'Olvidate hasta el miércoles.',
    ],
    tip: 'Técnica avanzada de soberanía alimentaria hogareña.',
  },
  {
    id: 'empanadas-expres',
    nombre: 'Empanadas exprés',
    minKg: 0.25,
    maxKg: 0.75,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'medio',
    porcionesApprox: '6–8 empanadas',
    frase: 'Masa comprada, sin culpa. El orgullo es opcional.',
    pasos: [
      'Desmenuzá la carne y mezclá con cebolla rehogada.',
      'Rellená tapas de empanada (80–100 g c/u).',
      'Horno fuerte hasta dorar. O freí si el domingo lo pide.',
    ],
    tip: 'Regla: ~0.09 kg de relleno por empanada.',
  },
  {
    id: 'wrap-vacio',
    nombre: 'Wrap del vacío arrepentido',
    minKg: 0.25,
    maxKg: 0.75,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'rapido',
    porcionesApprox: '2–3 wraps',
    frase: 'La frontera es un estado mental.',
    pasos: [
      'Calentá tortillas o pan lavash.',
      'Carne en tiras, lechuga, algo cremoso.',
      'Enrollá y cortá al medio para fingir presentación.',
    ],
    tip: 'Si es pollo, un toque de limón lo salva todo.',
  },
  {
    id: 'tostado-italiano',
    nombre: 'Tostado “italiano” (con lo que haya)',
    minKg: 0.25,
    maxKg: 0.75,
    tipos: ['vaca', 'cerdo', 'mixto', 'embutido'],
    tiempo: 'rapido',
    porcionesApprox: '2 tostados',
    frase: 'Italia no reclamó el nombre. Todavía.',
    pasos: [
      'Pan, queso, carne finita.',
      'Plancha o sartén con peso encima.',
      'Cortá en diagonal: eso es el 40% del éxito.',
    ],
    tip: 'El embutido brilla acá. No lo dudes.',
  },
  {
    id: 'guiso-lunes',
    nombre: 'Guiso de lunes',
    minKg: 0.75,
    maxKg: 1.5,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'medio',
    porcionesApprox: '3–4 platos',
    frase: 'El destino natural de toda gloria parrillera.',
    pasos: [
      'Rehogar cebolla, morrón, ajo.',
      'Sumá carne cortada, caldo, papa o arroz.',
      'Cocinar hasta que el hogar huela a redención.',
    ],
    tip: 'Con ~0.7 kg de carne alimentás a 4 sin drama.',
  },
  {
    id: 'tarta-sobrante',
    nombre: 'Tarta de carne sobrante',
    minKg: 0.75,
    maxKg: 1.5,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'medio',
    porcionesApprox: '6 porciones',
    frase: 'Tapa de arriba opcional. La honestidad también.',
    pasos: [
      'Mezclá carne con huevo, cebolla y condimentos.',
      'Montá en tartera con masa.',
      'Horno hasta que diga “estoy lista” (o 30–40 min).',
    ],
    tip: 'Congelá porciones. El yo del jueves te lo agradece.',
  },
  {
    id: 'bowl-humillacion',
    nombre: 'Bowl de humillación nutritiva',
    minKg: 0.75,
    maxKg: 1.5,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'rapido',
    porcionesApprox: '2–3 bowls',
    frase: 'Arroz + carne + lo verde que encuentres. Saludable a la fuerza.',
    pasos: [
      'Arroz o quinoa de base.',
      'Carne tibia encima.',
      'Lo que haya en la heladera: tomate, choclo, mayonesa diluida.',
    ],
    tip: 'No es Instagram. Es supervivencia digna.',
  },
  {
    id: 'empanadas-serie',
    nombre: 'Empanadas en serie',
    minKg: 1.5,
    maxKg: 3,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'largo',
    porcionesApprox: '15–30 empanadas',
    frase: 'Convocá refuerzos. Esto es trabajo en equipo.',
    pasos: [
      'Desmenuzá todo y armá un relleno generoso.',
      'Línea de montaje: uno rellena, otro repulguea.',
      'Mitad al horno ahora, mitad al freezer crudas.',
    ],
    tip: 'Estimá 10 empanadas por kilo de relleno.',
  },
  {
    id: 'guiso-serio',
    nombre: 'Guiso serio (para 4–6)',
    minKg: 1.5,
    maxKg: 3,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'medio',
    porcionesApprox: '4–6 platos',
    frase: 'Acá ya no hay improvisación: hay olla y paciencia.',
    pasos: [
      'Sofreír base de verduras con respeto.',
      'Carne, caldo, porotos o papas.',
      'Dejá reposar: el guiso mejora con el tiempo, como las peores anécdotas.',
    ],
    tip: '~0.6–0.8 kg de carne rinden un guiso generoso para 4.',
  },
  {
    id: 'pastel-papas',
    nombre: 'Pastel de papas light (de conciencia)',
    minKg: 1.5,
    maxKg: 3,
    tipos: ['vaca', 'cerdo', 'mixto'],
    tiempo: 'largo',
    porcionesApprox: '6 porciones',
    frase: 'Light porque la papa no pide permiso.',
    pasos: [
      'Capa de carne desmenuzada sazonada.',
      'Puré generoso arriba.',
      'Horno hasta gratinar el orgullo.',
    ],
    tip: 'Con 0.8–1 kg de carne alcanzás un molde familiar.',
  },
  {
    id: 'tabla-cold',
    nombre: 'Tabla cold cut del domingo siguiente',
    minKg: 3,
    maxKg: 5,
    tipos: ['vaca', 'cerdo', 'mixto', 'embutido'],
    tiempo: 'rapido',
    porcionesApprox: 'Visitas inesperadas (6+)',
    frase: 'Presentalo como decisión gourmet, no como sobra.',
    pasos: [
      'Loncheá fino lo que se deje.',
      'Agregá queso, pan, mostaza.',
      'Decí “tabla de autor”. Nadie pregunta de qué domingo.',
    ],
    tip: 'Ideal si la carne está bien cocida y firme.',
  },
  {
    id: 'guiso-industrial',
    nombre: 'Guiso industrial + porciones freezer',
    minKg: 3,
    maxKg: 5,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'largo',
    porcionesApprox: '8–10 platos / varios tápers',
    frase: 'Cocinás una vez, cenás una semana. Estrategia de Estado.',
    pasos: [
      'Olla grande. No escatimés verdura.',
      'Dividí en porciones cuando enfríe.',
      'Etiquetá fechas. El futuro vos no es un adivino.',
    ],
    tip: 'Dejá 1 olla para ahora y el resto al frío.',
  },
  {
    id: 'donacion',
    nombre: 'Donación estratégica',
    minKg: 3,
    maxKg: 5,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto', 'embutido'],
    tiempo: 'rapido',
    porcionesApprox: 'Vecinos / familia extendida',
    frase: 'El gesto político del que le sobró el domingo.',
    pasos: [
      'Empaquetá prolijo.',
      'Avisá por el grupito del edificio o del WhatsApp familiar.',
      'Entregá sin discurso. El silencio es elegancia.',
    ],
    tip: 'Mejor cocida y fría que “ya fue, se tira”.',
  },
  {
    id: 'segundo-asado',
    nombre: 'Segundo asado anunciado',
    minKg: 5,
    maxKg: 99,
    tipos: ['vaca', 'cerdo', 'mixto'],
    tiempo: 'medio',
    porcionesApprox: 'Otro domingo entero',
    frase: 'Esto ya no es sobra: es agenda.',
    pasos: [
      'Separá lo mejor para recalentar a la parrilla o plancha.',
      'Invitá con honestidad: “queda del domingo”.',
      'Acompañá con ensalada y narrativa.',
    ],
    tip: 'No lo digas “sobras” en la invitación. Decí “bis”.',
  },
  {
    id: 'plan-semanal',
    nombre: 'Plan semanal (vacuum / tápers)',
    minKg: 5,
    maxKg: 99,
    tipos: ['vaca', 'cerdo', 'pollo', 'mixto'],
    tiempo: 'largo',
    porcionesApprox: 'Menú de varios días',
    frase: 'Aceptá el destino: porcioná, etiquetá, viví.',
    pasos: [
      'Clasificá: guiso / sanguches / empanadas.',
      'Congelá en porciones de 1 comida.',
      'Armá un mini calendario en la puerta de la heladera.',
    ],
    tip: 'Si pasás los 5 kg, el problema es logístico, no culinario.',
  },
  {
    id: 'choripan-remix',
    nombre: 'Chori-remix (embutido 2.0)',
    minKg: 0.25,
    maxKg: 1.5,
    tipos: ['embutido'],
    tiempo: 'rapido',
    porcionesApprox: '2–6 unidades recicladas',
    frase: 'El chori vuelve. Como todo lo bueno y lo inevitable.',
    pasos: [
      'Calentá a la plancha sin secar.',
      'Pan fresco, salsa criolla.',
      'Serví como si fuera la primera vez.',
    ],
    tip: 'No lo hiervas de nuevo. Merece dignidad.',
  },
]

export function rangoParaKg(kg: number): RangoSobra {
  if (kg <= 0) return RANGOS_SOBRA[0]
  for (const rango of RANGOS_SOBRA) {
    if (kg < rango.maxKg) return rango
  }
  return RANGOS_SOBRA[RANGOS_SOBRA.length - 1]
}

export function recetasParaSobras(
  kg: number,
  tipo: TipoSobra | 'todos' = 'todos'
): RecetaSobra[] {
  if (kg <= 0) return []

  return RECETAS_SOBRA.filter((r) => {
    const enRango = kg >= r.minKg && kg < r.maxKg
    const tipoOk = tipo === 'todos' || r.tipos.includes(tipo)
    return enRango && tipoOk
  }).slice(0, 4)
}

export function estimacionEmpanadas(kg: number): number {
  return Math.max(0, Math.round(kg / 0.09))
}

export const LABELS_TIEMPO: Record<TiempoReceta, string> = {
  rapido: '15 min',
  medio: '45 min',
  largo: 'Con tiempo y paciencia',
}
