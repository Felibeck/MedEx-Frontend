import { isAxiosError } from 'axios'
import { api } from './client'
import type {
  homePaciente,
  profesionalHome,
  tipoPendienteHome,
} from '../types/homePaciente'

// ── Tipos que devuelve el backend ────────────────────────────────────────────

type ApiProfesional = {
  nombre: string | null
  apellido: string | null
  especialidad_medica: string | null
}

type ApiHome = {
  paciente: {
    nombre: string | null
    apellido: string | null
    obra_social: string | null
    cobertura_estado: string
  }
  ultima_consulta: {
    id: string
    fecha: string
    tipo_consulta: string | null
    diagnostico: string | null
    profesional: ApiProfesional
    organizacion: string | null
  } | null
  pendientes: {
    tipo: tipoPendienteHome
    consulta_id: string
    fecha: string
    profesional: ApiProfesional
  }[]
  totales: {
    consultas: number
    estudios: number
    recetas: number
  }
  recetas_recientes: {
    id: string
    titulo: string
    created_at: string
    url: string | null
  }[]
  estudios_recientes: {
    id: string
    titulo: string | null
    tipo_estudio: string | null
    fecha: string
    institucion: string | null
  }[]
}

type ApiHomeResponse = {
  success: boolean
  message?: string
  data?: ApiHome
}

// ── Mappers ──────────────────────────────────────────────────────────────────

const mapProfesional = (raw: ApiProfesional): profesionalHome => ({
  nombre: raw.nombre,
  apellido: raw.apellido,
  especialidad: raw.especialidad_medica,
})

const mapHomeFromApi = (raw: ApiHome): homePaciente => ({
  paciente: {
    nombre: raw.paciente.nombre,
    apellido: raw.paciente.apellido,
    obraSocial: raw.paciente.obra_social,
    coberturaEstado: raw.paciente.cobertura_estado,
  },
  ultimaConsulta: raw.ultima_consulta
    ? {
        id: raw.ultima_consulta.id,
        fecha: raw.ultima_consulta.fecha,
        tipoConsulta: raw.ultima_consulta.tipo_consulta,
        diagnostico: raw.ultima_consulta.diagnostico,
        profesional: mapProfesional(raw.ultima_consulta.profesional),
        organizacion: raw.ultima_consulta.organizacion,
      }
    : null,
  pendientes: raw.pendientes.map(p => ({
    tipo: p.tipo,
    consultaId: p.consulta_id,
    fecha: p.fecha,
    profesional: mapProfesional(p.profesional),
  })),
  totales: {
    consultas: raw.totales.consultas,
    estudios: raw.totales.estudios,
    recetas: raw.totales.recetas,
  },
  recetasRecientes: raw.recetas_recientes.map(r => ({
    id: r.id,
    titulo: r.titulo,
    fecha: r.created_at,
    url: r.url,
  })),
  estudiosRecientes: raw.estudios_recientes.map(e => ({
    id: e.id,
    titulo: e.titulo,
    tipoEstudio: e.tipo_estudio,
    fecha: e.fecha,
    institucion: e.institucion,
  })),
})

// ── Fetch ────────────────────────────────────────────────────────────────────

export const getHomePaciente = async (): Promise<homePaciente> => {
  let data: ApiHomeResponse

  try {
    const response = await api.get<ApiHomeResponse>('/patients/me/home')
    data = response.data
  } catch (err) {
    // Ante un 4xx/5xx se muestra el mensaje del backend, no el genérico de Axios.
    if (isAxiosError<ApiHomeResponse>(err) && err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: err })
    }
    throw new Error('No pudimos conectar con el servidor', { cause: err })
  }

  if (!data.success || !data.data) {
    throw new Error(data.message || 'No se pudo cargar tu información')
  }

  return mapHomeFromApi(data.data)
}
