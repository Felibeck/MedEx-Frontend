import { api } from './client'
import type { consulta } from '../types/consulta'

type notaAPI = {
  nota?: string
  fecha?: string
  createdAt?: string
  created_at?: string
}

const parseNotaFecha = (nota: notaAPI): number => {
  const fecha = nota.fecha ?? nota.createdAt ?? nota.created_at ?? ''
  const timestamp = Date.parse(String(fecha))
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export const getUltimaNotaPorProfesional = async (profesionalId: string): Promise<string | null> => {
  const response = await api.get(`/doctors/${profesionalId}/notas`)
  const data = response.data
  const notas: notaAPI[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : []

  const notasConTexto = notas.filter(
    (nota): nota is { nota: string } => typeof nota?.nota === 'string' && nota.nota.trim().length > 0
  )

  if (!notasConTexto.length) {
    return null
  }

  notasConTexto.sort((a, b) => parseNotaFecha(b) - parseNotaFecha(a))
  return notasConTexto[0].nota.trim()
}

export const postConsulta = async (data: consulta): Promise<void> => {
  await api.post('/doctors/consultas', data)
}
