import type { medico } from '../types/medico'
import type { DeviceType } from '../hooks/useDeviceType'

type StoredDoctor = Partial<Record<string, any>> | null

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('medex_doctor')
  localStorage.removeItem('medex_user')
  localStorage.removeItem('medex_user_id')
}

export const getCurrentPaciente = () => {
  const raw = localStorage.getItem('medex_user')
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    return {
      id: String(parsed.id ?? ''),
      email: parsed.email ?? '',
      nombre: parsed.nombre ?? '',
      apellido: parsed.apellido ?? '',
    }
  } catch {
    return null
  }
}

export const getStoredDoctor = (): StoredDoctor => {
  const raw = localStorage.getItem('medex_doctor')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const getCurrentMedico = (): medico | null => {
  const s = getStoredDoctor()
  if (!s) return null

  const idValue = typeof s.id === 'number' ? s.id : String(s.id ?? '')

  const mapped: medico = {
    id: idValue,
    nombre: s.nombre ?? s.firstName ?? '',
    apellido: s.apellido ?? s.lastName ?? '',
    email: s.email ?? '',
    password: '',
    esMedico: typeof s.esMedico === 'boolean' ? s.esMedico : !!s.es_medico,
    usuarioId: s.usuarioId ?? s.usuario_id ?? String(s.id ?? ''),
    organizacionId: s.organizacionId ?? s.organizacion_id ?? '',
    matricula: s.matricula ?? '',
    especialidad: s.especialidad ?? s.especialidad_medica ?? '',
    fotoPerfil: s.fotoPerfil ?? s.profile_picture ?? '',
  }

  return mapped
}

/**
 * ¿Hay una sesión de médico guardada localmente?
 * Se apoya en lo que escribe `DoctorLogin`: `medex_doctor` + el JWT en `token`.
 */
export const hasDoctorSession = (): boolean =>
  Boolean(getToken() && getStoredDoctor())

/**
 * ¿Hay una sesión de paciente guardada localmente?
 * Se apoya en lo que escribe `PatientLogin`: `medex_user_id` + el JWT en `token`.
 */
export const hasPatientSession = (): boolean =>
  Boolean(getToken() && localStorage.getItem('medex_user_id'))

/**
 * Limpia la sesión de médico (`medex_doctor`).
 *
 * `token` es una clave COMPARTIDA entre médico y paciente — no hay un token
 * separado por rol, se pisa según quién logueó último. Por eso solo se borra
 * acá si en este momento no hay una sesión de paciente válida activa: si la
 * hubiera, borrar el token rompería también esa sesión de paciente.
 */
export const clearMedicoSession = () => {
  localStorage.removeItem('medex_doctor')
  if (!hasPatientSession()) {
    localStorage.removeItem('token')
  }
}

/**
 * Limpia la sesión de paciente (`medex_user_id` + `medex_user`).
 * Mismo criterio que `clearMedicoSession()` para el token compartido.
 */
export const clearPatientSession = () => {
  localStorage.removeItem('medex_user_id')
  localStorage.removeItem('medex_user')
  if (!hasDoctorSession()) {
    localStorage.removeItem('token')
  }
}

/**
 * Ruta de destino para una superficie dada, según haya o no sesión activa.
 * La usan la redirección de "/" y el DeviceGuard.
 *
 * NOTA: es una señal de UX (¿a dónde mando al usuario?), no una verificación de
 * permisos — la autorización real la resuelve el backend.
 */
export const resolveHomePath = (deviceType: DeviceType): string => {
  if (deviceType === 'mobile') {
    return hasPatientSession() ? '/patients' : '/patients/login'
  }
  return hasDoctorSession() ? '/doctor' : '/doctors/login'
}

export default {
  getToken,
  clearSession,
  clearMedicoSession,
  clearPatientSession,
  getCurrentMedico,
}
