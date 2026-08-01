import GuiaArticle from '@/components/GuiaArticle'
import ChecklistInteractive from '@/components/ChecklistInteractive'

export const metadata = {
  title: 'Checklist previa al asado | CalculAsado',
  description:
    'Checklist práctica previa al asado: carne, carbón, sal gruesa, chimichurri y lo que siempre se olvida. Tachá antes de prender.',
}

export default function ChecklistGuiaPage() {
  return (
    <GuiaArticle titulo="Checklist previa al asado" slug="checklist-previa-al-asado">
      <h1 className="text-3xl font-bold text-gray-900">Checklist previa al asado</h1>
      <p>
        Antes del fuego, la lista. Después del fuego, las excusas. Tachá lo que ya tenés;
        lo que falta duele menos ahora que con la parrilla prendida.
      </p>
      <ChecklistInteractive />
    </GuiaArticle>
  )
}
