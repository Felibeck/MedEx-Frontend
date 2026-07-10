export const TIPOS_CONSULTA = [
  'primera_vez',
  'seguimiento',
  'control',
  'urgencia',
  'telemedicina',
] as const

export type TipoConsulta = (typeof TIPOS_CONSULTA)[number]

export const TIPO_CONSULTA_LABELS: Record<TipoConsulta, string> = {
  primera_vez: 'Primera vez',
  seguimiento: 'Seguimiento',
  control: 'Control',
  urgencia: 'Urgencia',
  telemedicina: 'Telemedicina',
}
