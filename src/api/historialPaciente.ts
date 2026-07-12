import { api } from './client'
import type { historialClinicoPaciente } from '../types/historialClinicoPaciente'

type ApiEnvelope<T> = {
  success: boolean
  message?: string
  data: T
}

export const getMiHistorialClinico = async (): Promise<historialClinicoPaciente> => {
  const { data } = await api.get<ApiEnvelope<historialClinicoPaciente>>('/patients/me/historial')

  if (!data.success) {
    throw new Error(data.message || 'No se pudo cargar el historial clínico')
  }

  return data.data
}
