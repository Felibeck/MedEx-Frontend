import type { TipoEstudioEnum } from '../config/tiposEstudio'
import type { medico } from './medico'

export type corteEstudio = {
  id: string
  label: string
  imagen: string
}

export type estudio = {
  id: string | number
  tipo: TipoEstudioEnum
  tipoEstudio: string
  categoria: string
  fecha: Date
  institucion: string
  fotos: string[]
  cortes?: corteEstudio[]
  informe?: string
  medico?: medico
  pacienteId?: string
  pacienteDob?: string
  metadataDicom?: string
}
