import { api } from './client'
import type { pacienteResumen } from '../types/pacienteResumen'
import type { historialClinico, historialTabla } from '../types/historialClinico'

type apiEnvelope<T> = {
  success: boolean
  data: T
}

export type historialPayload = {
  ant: string | null
  ago: string | null
  ahf: string | null
  mx:  string | null
  eco: string | null
  ef:  string | null
  otros: string | null
}

export const getMisPacientes = async (): Promise<pacienteResumen[]> => {
  const { data } = await api.get<apiEnvelope<pacienteResumen[]>>('/doctors/mis-pacientes')
  return data.data ?? []
}

export const getHistorialClinico = async (pacienteId: string): Promise<historialClinico> => {
  const { data } = await api.get<apiEnvelope<historialClinico>>(`/doctors/pacientes/${pacienteId}/historial`)
  return data.data
}

export const guardarHistorial = async (pacienteId: string, payload: historialPayload): Promise<historialTabla> => {
  const { data } = await api.post<apiEnvelope<historialTabla>>(`/doctors/pacientes/${pacienteId}/historial`, payload)
  return data.data
}
