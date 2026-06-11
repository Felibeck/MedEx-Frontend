import type { usuario } from './Usuario'

export type medico = usuario & {
  usuarioId: string
  organizacionId: string
  matricula: string
  especialidad: string
  fotoPerfil: string
}

// Forma reducida que devuelve el backend cuando el médico está embebido en un estudio
export type medicoEnEstudio = {
  id: string
  usuario: {
    email: string
    nombre: string
    apellido: string
  }
  matricula: string
  profile_picture: string
  especialidad_medica: string
}
