import { api } from './client'

// ── Tipos que devuelve o espera el backend ───────────────────────────────────

type ApiUserPublic = {
  id: string
  email: string
  nombre: string
  apellido: string
  es_medico: boolean
}

type ApiPerfilPaciente = {
  id: string
  usuario_id: string
  dni: string
  fecha_nacimiento: string
  telefono: string | null
  identidad_genero: string
  created_at: string
}

// Estructura de la respuesta del Login de Pacientes
type ApiLoginResponse = {
  success: boolean
  data: {
    user: ApiUserPublic
    token: string
  }
}

// Estructura de la respuesta del Registro de Pacientes
type ApiRegisterResponse = {
  success: boolean
  message: string
  data: ApiUserPublic & {
    perfil: ApiPerfilPaciente | null
  }
}

// Interfaces internas que usa tu Frontend (CamelCase)
export interface UserSession {
  id: string
  email: string
  nombre: string
  apellido: string
  esMedico: boolean
}

export interface PatientRegisterPayload {
  email: string
  password_hash?: string // El backend espera password en registerPatient, se mapea abajo
  password?: string
  firstName?: string
  lastName?: string
  nombre: string
  apellido: string
  dni: string | null
  dateOfBirth: string | null // yyyy-mm-dd
  phoneNumber: string | null
  gender: string | null
}

// ── Mappers ──────────────────────────────────────────────────────────────────

const mapUserFromApi = (raw: ApiUserPublic): UserSession => ({
  id: raw.id,
  email: raw.email,
  nombre: raw.nombre,
  apellido: raw.apellido,
  esMedico: raw.es_medico,
})

// ── Fetch/Mutations ──────────────────────────────────────────────────────────

/**
 * Inicia sesión para un paciente enviando credenciales al backend.
 * Guarda el token en el localStorage de manera inmediata si la petición es exitosa.
 */
export const loginPatient = async (email: string, password: string): Promise<UserSession> => {
  const { data } = await api.post<ApiLoginResponse>('/patients/login', {
    email,
    password,
  })

  if (!data.success || !data.data.token) {
    throw new Error('Credenciales o respuesta inválidas del servidor')
  }

  // Interceptor local o guardado rápido del JWT
  localStorage.setItem('token', data.data.token)
  
  return mapUserFromApi(data.data.user)
}

/**
 * Registra un nuevo perfil de paciente en el sistema.
 */
export const registerPatient = async (payload: PatientRegisterPayload): Promise<void> => {
  const { data } = await api.post<ApiRegisterResponse>('/patients/register', payload)

  if (!data.success) {
    throw new Error(data.message || 'Ocurrió un error en el registro')
  }
}