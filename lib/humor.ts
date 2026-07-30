export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export const FRASES_AL_CALCULAR = [
  'Con esto no te falta. Si falta, fue el cuñado.',
  'Las cuentas están hechas. El resto es fe.',
  'Cantidades honestas. Sin histeria ni avaricia.',
  'Esto alcanza. Lo demás es conversación de sobremesa.',
  'Bien. Ahora no digas que nadie te avisó.',
]

export const TIP_AL_PAN = 'Economía de guerra.'
export const TIP_AL_PLATO = 'Asado de domingo serio.'

export function fraseSegunInvitados(total: number): string | null {
  if (total === 1) return 'Asado introspectivo. Respetable.'
  if (total >= 12) return 'Esto ya es un acto político.'
  if (total >= 8) return 'Acá ya hay quorum. Cuidado con las opiniones.'
  return null
}

export type WhatsappContext = {
  invitados: string
  totalPersonas: number
  modalidad: string
  carne: string
  embutidos: number
  pan?: number
}

export function mensajeWhatsapp(ctx: WhatsappContext): string {
  const plantillas = [
    () =>
      `🔥 *ASADO DECLARADO*\n\n` +
      `Che, ya hice las cuentas para que nadie quede mirando el vacío:\n\n` +
      `👥 ${ctx.invitados} (${ctx.totalPersonas} en total)\n` +
      `🍽️ ${ctx.modalidad}\n\n` +
      `🥩 Carne: ${ctx.carne} kg\n` +
      `🌭 Chori o morci: ${ctx.embutidos}\n` +
      (ctx.pan ? `🍞 Pan: ${ctx.pan}\n` : '') +
      `\n_CalculAsado — porque improvisar es un deporte de riesgo._`,

    () =>
      `📋 *INFORME PARRILLERO*\n\n` +
      `Invitados: ${ctx.invitados}\n` +
      `Modalidad: ${ctx.modalidad}\n\n` +
      `Carne necesaria: *${ctx.carne} kg*\n` +
      `Embutidos: *${ctx.embutidos}*\n` +
      (ctx.pan ? `Pan: *${ctx.pan}*\n` : '') +
      `\nSi después falta, no fue esta planilla. Fue la humanidad.`,

    () =>
      `🥩 *LISTO EL NÚMERO*\n\n` +
      `Somos ${ctx.totalPersonas}: ${ctx.invitados}.\n` +
      `Vamos ${ctx.modalidad.toLowerCase()}.\n\n` +
      `Llevar: ${ctx.carne} kg de carne y ${ctx.embutidos} de chori/morci` +
      (ctx.pan ? `, más ${ctx.pan} panes` : '') +
      `.\n\n` +
      `Firmado: CalculAsado, asociación sin fines de locro.`,

    () =>
      `🔥 *PARA NO QUEDAR COLGADOS*\n\n` +
      `${ctx.invitados}. ${ctx.modalidad}.\n\n` +
      `• Carne: ${ctx.carne} kg\n` +
      `• Chorizos o morcillas: ${ctx.embutidos}\n` +
      (ctx.pan ? `• Pan: ${ctx.pan}\n` : '') +
      `\nCon esto no te falta. Si falta, fue el cuñado.\n— CalculAsado`,
  ]

  return pickRandom(plantillas)()
}

export const DICCIONARIO_PARRILLERO = [
  {
    termino: 'Vacío',
    definicion:
      'Corte noble. También el estado del que llega sin nada y pregunta "¿falta algo?".',
  },
  {
    termino: 'A punto',
    definicion:
      'Concepto teórico. En la práctica nunca está: o "todavía" o "se pasó".',
  },
  {
    termino: 'Jugoso',
    definicion:
      'Lo que todos piden. Lo que casi nadie reconoce cuando lo tiene delante.',
  },
  {
    termino: 'El fuego',
    definicion:
      'Territorio sagrado. Quien no lo prendió, no opina. Quien lo prendió, opina de más.',
  },
  {
    termino: 'Carbón',
    definicion:
      'Combustible y metáfora. Si está verde, el asado también lo estará: en potencia.',
  },
  {
    termino: 'Sal gruesa',
    definicion:
      'La diferencia entre carne y recuerdo. Se discute cantidad; nunca se discute marca.',
  },
  {
    termino: 'Achura',
    definicion:
      'Entrada filosófica. Quien la pide, ya eligió bando. Quien la rechaza, también.',
  },
  {
    termino: 'Sobremesa',
    definicion:
      'El verdadero asado. La carne fue solo el pretexto.',
  },
  {
    termino: 'Cuñado',
    definicion:
      'Variable impredecible. Puede traer vino bueno o una teoría sobre el vacío.',
  },
  {
    termino: 'Paciencia',
    definicion:
      'Ingrediente no listado en la carni. Sin ella, hay ansiosos y hay tragedia.',
  },
]

export const CHECKLIST_ASADO = [
  { id: 'carbon', label: 'Carbón (o leña, si te hacés el interesante)' },
  { id: 'sal', label: 'Sal gruesa' },
  { id: 'vino', label: 'Vino (o la bebida que diga la tradición familiar)' },
  { id: 'paciencia', label: 'Paciencia' },
  { id: 'lava', label: 'Alguien que lave después' },
  { id: 'tabla', label: 'Tabla y cuchillo que corten de verdad' },
  { id: 'fuego', label: 'Encendedor / fósforos (no confiar en el del auto)' },
  { id: 'pan', label: 'Pan, si es al pan — obvio, pero se olvida' },
]
