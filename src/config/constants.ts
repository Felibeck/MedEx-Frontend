export const getPacienteId = (): string =>
  localStorage.getItem('medex_user_id') ?? ''

export const PACIENTE_ID = getPacienteId()

/**
 * Umbral (en px) que separa la superficie mobile (vista Paciente) de la
 * superficie desktop (vista Médico). Ventanas con innerWidth < 768 se
 * consideran mobile.
 */
export const MOBILE_BREAKPOINT = 768
