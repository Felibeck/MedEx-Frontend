export const getPacienteId = (): string =>
  localStorage.getItem('medex_user_id') ?? ''

export const PACIENTE_ID = getPacienteId()
