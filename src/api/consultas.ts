import { api } from './client'
import type { consulta } from '../types/consulta'

type notaAPI = {
  consulta_id?: string
  nota?: string
}

export const getUltimaNotaPorProfesional = async (profesionalId: string): Promise<string | null> => {
  const response = await api.get(`/doctors/${profesionalId}/notas`)
  const data = response.data
  const notas: notaAPI[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : []

  const notasConTexto = notas
    .filter((nota): nota is { nota: string } => typeof nota?.nota === 'string' && nota.nota.trim().length > 0)
    .map((nota) => nota.nota.trim())

  if (!notasConTexto.length) {
    return null
  }

  return notasConTexto[notasConTexto.length - 1]
}

export const postConsulta = async (data: consulta): Promise<void> => {
  await api.post('/doctors/consultas', data)
}
