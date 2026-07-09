export type consulta = {
  paciente_id?: string
  dni?: string          // DNI del paciente (el backend resuelve el paciente_id internamente)
  profesional_id: string
  organizacion_id: string
  fecha?: string
  solicitud_estudio?: boolean
  solicitud_receta?: boolean
  solicitud_citaprox?: boolean
  notas?: string | Record<string, unknown> | Array<Record<string, unknown>>
}
