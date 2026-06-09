import type { medico } from './medico'

export type corteEstudio = {
  id: string
  label: string
  imagen: string
}

export type estudio = {
  id: number
  tipoEstudio: string   // ej: "Mamografia"
  categoria: string     // ej: "RESONANCIA" — badge superior
  fecha: Date
  institucion: string
  fotos: string[]       // usado en historial (primera foto = thumbnail)
  cortes?: corteEstudio[] // imágenes del visor DICOM, si aplica
  informe?: string
  medico?: medico
  // Metadata DICOM opcional
  pacienteId?: string   // ej: "#MED-982-S"
  pacienteDob?: string  // ej: "14/05/1978"
  metadataDicom?: string // ej: "TE: 12.8ms | TR: 450ms"
}
