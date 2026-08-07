import axios from 'axios'
import { api } from './client'
import { clearSession } from '../utils/session'

type AuthUser = {
  id: string
  email: string
  nombre: string
  apellido: string
  es_medico: boolean
}

type LoginResult = {
  user: AuthUser
  token: string
}

type ApiSimpleResponse = {
  success: boolean
  message?: string
}

export const loginPatient = async (email: string, password: string): Promise<LoginResult> => {
  const { data } = await api.post<{ success: boolean; data: LoginResult }>('/patients/login', {
    email,
    password,
  })
  if (!data.success) throw new Error('Error al iniciar sesión')
  return data.data
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  dni?: string
}

export const registerPatient = async (payload: RegisterPayload): Promise<void> => {
  const { data } = await api.post<ApiSimpleResponse>('/patients/register', payload)
  if (!data.success) throw new Error(data.message || 'Error al registrarse')
}

export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('token')
  if (!token) {
    clearSession()
    return
  }

  const { data } = await api.post<ApiSimpleResponse>('/auth/logout')
  if (!data.success) {
    throw new Error(data.message || 'No se pudo cerrar sesión')
  }

  clearSession()
}

export const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback
  }
  if (err instanceof Error) return err.message
  return fallback
}
