import { api } from './client'
import type { consulta } from '../types/consulta'
import { getToken } from '../utils/session'

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

export type RecetaPayload = {
  archivo: File
  titulo?: string
}

/**
 * Crea una consulta como multipart/form-data.
 * Si se pasa `receta`, se anida el PDF al mismo request.
 * No se setea Content-Type manualmente — el browser lo resuelve con el boundary correcto.
 */
export const postConsulta = async (data: consulta, receta?: RecetaPayload): Promise<void> => {
  const formData = new FormData()

  if (data.dni)               formData.append('dni', data.dni)
  if (data.notas)             formData.append('notas', data.notas as string)
  if (data.fecha)             formData.append('fecha', data.fecha)
  if (data.tipo_consulta)     formData.append('tipo_consulta', data.tipo_consulta)

  formData.append('solicitud_estudio',  String(data.solicitud_estudio  ?? false))
  formData.append('solicitud_receta',   String(data.solicitud_receta   ?? false))
  formData.append('solicitud_citaprox', String(data.solicitud_citaprox ?? false))

  if (receta) {
    formData.append('receta_pdf', receta.archivo)
    if (receta.titulo) formData.append('receta_titulo', receta.titulo)
  }

  const token = getToken()

  const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/doctors/consultas`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body?.message ?? `Error ${response.status} al guardar la consulta`)
  }
}

export const patchConsulta = async (
  consultaId: string,
  payload: { notas?: string | null; tipo_consulta?: string | null }
): Promise<any> => {
  const token = getToken()
  const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/doctors/consultas/${consultaId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body?.message ?? `Error ${response.status} al actualizar la consulta`)
  }

  return response.json().catch(() => ({}))
}
