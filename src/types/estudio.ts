import type { TipoEstudioEnum } from '../config/tiposEstudio'
import type { medicoEnEstudio } from './medico'

export type corteEstudio = {
  id: string
  label: string
  imagen: string
}

// Versión reducida que devuelve el listado /:id/estudios
export type estudioResumen = {
  id: string
  tipo: TipoEstudioEnum
  tipoEstudio: string
  fecha: Date
  institucion: string
  titulo?: string
}

// Versión completa que devuelve /:id/estudios/:estudioId
export type estudio = estudioResumen & {
  fotos: string[]
  cortes?: corteEstudio[]
  informe?: string
  medico?: medicoEnEstudio
  pacienteDob?: string
  metadataDicom?: string
  nombreArchivo?: string
  urlArchivo?: string
  descripcion?: string
}
