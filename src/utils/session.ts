import type { medico } from '../types/medico'

type StoredDoctor = Partial<Record<string, any>> | null

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('medex_doctor')
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

export default {
  getToken,
  clearSession,
  getCurrentMedico,
}
