export type consulta = {
  dni: string          // DNI del paciente (el backend resuelve el paciente_id internamente)
  profesional_id: string
  organizacion_id: string
  ant?: string         // antecedentes
  ago?: string         // antecedentes gineco-obstétricos
  ahf?: string         // antecedentes heredofamiliares
  mx?: string          // medicaciones
  eco?: string         // ecografías
  ef?: string          // examen físico
  otros?: string       // otros antecedentes / info relevante
}
