import type { paciente } from './paciente'

export type turno = {
  id: number
  hora: string          // ej: "09:30"
  horaFin?: string      // ej: "10:00"
  paciente: paciente
  motivo: string        // ej: "Chequeo Post-Operatorio"
  esActual?: boolean
}
