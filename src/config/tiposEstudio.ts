export const TIPOS_ESTUDIO = [
  'MAMOGRAFIA',
  'ECOGRAFIA',
  'LABORATORIO',
  'RESONANCIA',
  'BIOPSIA',
] as const

export type TipoEstudioEnum = (typeof TIPOS_ESTUDIO)[number]

export const TIPO_LABELS: Record<TipoEstudioEnum, string> = {
  MAMOGRAFIA: 'Mamografía',
  ECOGRAFIA: 'Ecografía',
  LABORATORIO: 'Laboratorio',
  RESONANCIA: 'Resonancia',
  BIOPSIA: 'Biopsia',
}

export const TIPO_FILTRO_LABELS: Record<TipoEstudioEnum, string> = {
  MAMOGRAFIA: 'Mamografías',
  ECOGRAFIA: 'Ecografías',
  LABORATORIO: 'Laboratorio',
  RESONANCIA: 'Resonancia',
  BIOPSIA: 'Biopsia',
}

export type FiltroTipo = 'TODOS' | TipoEstudioEnum

export const FILTROS_TIPO: { id: FiltroTipo; label: string }[] = [
  { id: 'TODOS', label: 'Todos' },
  ...TIPOS_ESTUDIO.map((t) => ({ id: t, label: TIPO_FILTRO_LABELS[t] })),
]

export const isTipoEstudio = (value: string): value is TipoEstudioEnum =>
  (TIPOS_ESTUDIO as readonly string[]).includes(value)
