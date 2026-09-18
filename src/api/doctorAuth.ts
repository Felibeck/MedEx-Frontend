import { api } from './client'

// Tipos de respuesta desde el backend

type ApiUserPublic = {
  id: string
  email: string
  nombre: string
  apellido: string
  es_medico: boolean
  usuario_id?: string
  organizacion_id?: string
  matricula?: string
  especialidad_medica?: string
  profile_picture?: string
}

type ApiLoginResponse = {
  success: boolean
  data: {
    user: ApiUserPublic
    token: string
  }
}

export interface DoctorSession {
  id: string
  email: string
  nombre: string
  apellido: string
  esMedico: boolean
  usuarioId?: string
  organizacionId?: string
  matricula?: string
  especialidad?: string
  fotoPerfil?: string
}

const mapDoctorFromApi = (raw: ApiUserPublic): DoctorSession => ({
  id: raw.id,
  email: raw.email,
  nombre: raw.nombre,
  apellido: raw.apellido,
  esMedico: raw.es_medico,
  usuarioId: raw.usuario_id,
  organizacionId: raw.organizacion_id,
  matricula: raw.matricula,
  especialidad: raw.especialidad_medica,
  fotoPerfil: raw.profile_picture,
})

export const loginDoctor = async (email: string, password: string): Promise<DoctorSession> => {
  const { data } = await api.post<ApiLoginResponse>('/doctors/login', {
    email,
    password,
  })

  if (!data.success || !data.data.token) {
    throw new Error('Credenciales o respuesta inválidas del servidor')
  }

  localStorage.setItem('token', data.data.token)
  return mapDoctorFromApi(data.data.user)
}

type ApiRegisterResponse = {
  success: boolean
  message?: string
}

export type DoctorRegisterPayload = {
  nombre: string
  apellido: string
  email: string
  password: string
  telefono: string
  especialidad: string
  matricula: string
  hospital: string
}

type ApiDoctorRegisterPayload = {
  nombre: string
  apellido: string
  firstName?: string
  lastName?: string
  email: string
  password: string
  password_hash?: string
  telefono: string
  phoneNumber?: string
  especialidad_medica: string
  especialidad?: string
  specialty?: string
  matricula: string
  numero_licencia?: string
  licencia?: string
  licenseNumber?: string
  hospital: string
  clinic?: string
}

export const registerDoctor = async (payload: DoctorRegisterPayload): Promise<void> => {
  const apiPayload: ApiDoctorRegisterPayload = {
    nombre: payload.nombre,
    apellido: payload.apellido,
    firstName: payload.nombre,
    lastName: payload.apellido,
    email: payload.email,
    password: payload.password,
    password_hash: payload.password,
    telefono: payload.telefono,
    phoneNumber: payload.telefono,
    especialidad_medica: payload.especialidad,
    especialidad: payload.especialidad,
    specialty: payload.especialidad,
    matricula: payload.matricula,
    numero_licencia: payload.matricula,
    licencia: payload.matricula,
    licenseNumber: payload.matricula,
    hospital: payload.hospital,
    clinic: payload.hospital,
  }

  const { data } = await api.post<ApiRegisterResponse>('/doctors/register', apiPayload)
  if (!data.success) {
    throw new Error(data.message || 'Error al registrarse')
  }
}
