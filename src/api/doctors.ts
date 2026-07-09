import { api } from './client'
import type { pacienteResumen } from '../types/pacienteResumen'
import type { historialClinico } from '../types/historialClinico'

type apiEnvelope<T> = {
  success: boolean
  data: T
}

export const getMisPacientes = async (): Promise<pacienteResumen[]> => {
  const { data } = await api.get<apiEnvelope<pacienteResumen[]>>('/doctors/mis-pacientes')
  return data.data ?? []
}

export const getHistorialClinico = async (pacienteId: string): Promise<historialClinico> => {
  const { data } = await api.get<apiEnvelope<historialClinico>>(`/doctors/pacientes/${pacienteId}/historial`)
  return data.data
}
