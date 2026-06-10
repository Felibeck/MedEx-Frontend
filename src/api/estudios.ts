import { isTipoEstudio, TIPO_LABELS } from '../config/tiposEstudio'
import type { estudio } from '../types/estudio'
import { api } from './client'

type ApiEstudioRaw = {
  id: string
  tipo: string
  nombre_archivo: string
  url_archivo: string
  descripcion: string
  subido_at: string
  institucion?: string
}

type ApiEstudiosResponse = {
  success: boolean
  data: ApiEstudioRaw[]
}

const normalizeTipo = (tipo: string) => {
  const normalized = tipo.toUpperCase()
  if (!isTipoEstudio(normalized)) {
    throw new Error(`Tipo de estudio no reconocido: ${tipo}`)
  }
  return normalized
}

export const mapEstudioFromApi = (raw: ApiEstudioRaw): estudio => {
  const tipo = normalizeTipo(raw.tipo)

  return {
    id: raw.id,
    tipo,
    tipoEstudio: TIPO_LABELS[tipo],
    categoria: TIPO_LABELS[tipo],
    fecha: new Date(raw.subido_at),
    institucion: raw.institucion ?? raw.nombre_archivo,
    fotos: raw.url_archivo ? [raw.url_archivo] : [],
    informe: raw.descripcion,
  }
}

export const fetchEstudiosPaciente = async (pacienteId: string): Promise<estudio[]> => {
  const { data } = await api.get<ApiEstudiosResponse>(`/patients/${pacienteId}/estudios`)

  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Respuesta inválida del servidor')
  }

  return data.data.map(mapEstudioFromApi)
}
