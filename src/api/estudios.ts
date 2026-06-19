import { isTipoEstudio } from '../config/tiposEstudio'
import type { estudio, estudioResumen } from '../types/estudio'
import type { medicoEnEstudio } from '../types/medico'
import { api } from './client'

// ── Tipos que devuelve el backend ────────────────────────────────────────────

type ApiMedicoUsuario = {
  email: string
  nombre: string
  apellido: string
}

type ApiMedico = {
  id: string
  usuario: ApiMedicoUsuario
  matricula: string
  profile_picture: string
  especialidad_medica: string
}

// Forma reducida — listado /:pacienteId/estudios
type ApiEstudioResumenRaw = {
  id: string
  tipo_estudio: string
  fecha: string
  institucion: string
}

// Forma completa — detalle /:pacienteId/estudios/:estudioId
type ApiEstudioRaw = ApiEstudioResumenRaw & {
  fotos: string[]
  informe: string | null
  paciente_dob: string | null
  metadata_dicom: string | null
  nombre_archivo: string
  url_archivo: string
  descripcion: string
  subido_at: string
  medico: ApiMedico | null
}

type ApiEstudiosResponse = {
  success: boolean
  data: ApiEstudioResumenRaw[]
}

type ApiEstudioResponse = {
  success: boolean
  data: ApiEstudioRaw
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const normalizeTipo = (tipoEstudio: string) => {
  const normalized = tipoEstudio
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()

  if (!isTipoEstudio(normalized)) {
    throw new Error(`Tipo de estudio no reconocido: ${tipoEstudio}`)
  }
  return normalized
}

const mapMedico = (raw: ApiMedico): medicoEnEstudio => ({
  id: raw.id,
  usuario: raw.usuario,
  matricula: raw.matricula,
  profile_picture: raw.profile_picture,
  especialidad_medica: raw.especialidad_medica,
})

// ── Mappers ──────────────────────────────────────────────────────────────────

export const mapEstudioResumenFromApi = (raw: ApiEstudioResumenRaw): estudioResumen => ({
  id: raw.id,
  tipo: normalizeTipo(raw.tipo_estudio),
  tipoEstudio: raw.tipo_estudio,
  fecha: new Date(raw.fecha),
  institucion: raw.institucion,
})

export const mapEstudioFromApi = (raw: ApiEstudioRaw): estudio => ({
  ...mapEstudioResumenFromApi(raw),
  fotos: raw.fotos ?? [],
  informe: raw.informe ?? undefined,
  pacienteDob: raw.paciente_dob ?? undefined,
  metadataDicom: raw.metadata_dicom ?? undefined,
  nombreArchivo: raw.nombre_archivo,
  urlArchivo: raw.url_archivo,
  descripcion: raw.descripcion,
  medico: raw.medico ? mapMedico(raw.medico) : undefined,
})

// ── Fetch ────────────────────────────────────────────────────────────────────

export const fetchEstudiosPaciente = async (pacienteId: string): Promise<estudioResumen[]> => {
  const { data } = await api.get<ApiEstudiosResponse>(`/patients/${pacienteId}/estudios`)

  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Respuesta inválida del servidor')
  }

  return data.data.map(mapEstudioResumenFromApi)
}

export const fetchEstudioById = async (
  pacienteId: string,
  estudioId: string,
): Promise<estudio> => {
  const { data } = await api.get<ApiEstudioResponse>(
    `/patients/${pacienteId}/estudios/${estudioId}`,
  )

  if (!data.success || !data.data) {
    throw new Error('Respuesta inválida del servidor')
  }

  return mapEstudioFromApi(data.data)
}
