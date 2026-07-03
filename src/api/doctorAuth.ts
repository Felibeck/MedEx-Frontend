import { api } from './client'

// Tipos de respuesta desde el backend

type ApiUserPublic = {
  id: string
  email: string
  nombre: string
  apellido: string
  es_medico: boolean
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
}

const mapDoctorFromApi = (raw: ApiUserPublic): DoctorSession => ({
  id: raw.id,
  email: raw.email,
  nombre: raw.nombre,
  apellido: raw.apellido,
  esMedico: raw.es_medico,
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
