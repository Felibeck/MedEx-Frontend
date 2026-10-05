// src/utils/paciente.ts

export const calcularEdad = (fechaNacimiento: string | null): number | null => {
  if (!fechaNacimiento) return null
  const nacimiento = new Date(fechaNacimiento)
  if (isNaN(nacimiento.getTime())) return null

  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mesDiff = hoy.getMonth() - nacimiento.getMonth()
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

export const formatearFecha = (fecha: string | null): string | null => {
  if (!fecha) return null
  const date = new Date(fecha)
  if (isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

// Igual que formatearFecha, pero las fechas sin hora ('YYYY-MM-DD') se toman como
// día local: `new Date('YYYY-MM-DD')` es medianoche UTC y en Argentina muestra el día anterior.
export const formatearFechaDia = (fecha: string | null): string | null => {
  if (!fecha) return null
  return formatearFecha(/^\d{4}-\d{2}-\d{2}$/.test(fecha) ? `${fecha}T00:00:00` : fecha)
}

export const nombreCompleto = (nombre: string | null, apellido: string | null): string =>
  `${nombre ?? ''} ${apellido ?? ''}`.trim()

export type coberturaBadge = {
  label: string
  color: string
}

export const getCoberturaBadge = (coberturaEstado: string | null | undefined): coberturaBadge | null => {
  const normalizado = (coberturaEstado || '').toLowerCase()
  if (normalizado.includes('alerta')) return { label: 'ALERTA MÉDICA', color: '#ba1a1a' }
  if (normalizado.includes('pendiente')) return { label: 'PENDIENTE PAGO', color: '#6e7978' }
  if (normalizado.includes('valid')) return { label: 'COBERTURA VALIDADA', color: '#006562' }
  return null
}

export const esEstadoAlerta = (coberturaEstado: string | null | undefined): boolean =>
  (coberturaEstado || '').toLowerCase().includes('alerta')

const COMPATIBILIDAD_DONANTE: Record<string, string[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
}

export const gruposCompatibles = (grupoSanguineo: string | null | undefined): string[] | null => {
  if (!grupoSanguineo) return null
  const normalizado = grupoSanguineo.trim().toUpperCase()
  return COMPATIBILIDAD_DONANTE[normalizado] ?? null
}
