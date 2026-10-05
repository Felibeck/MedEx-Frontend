export type EstadoConfirmacion = 'pendiente' | 'confirmando' | 'resuelta' | 'cancelada'

export type ChatItemBurbuja = {
  id: string
  kind: 'burbuja'
  autor: 'medico' | 'asistente' | 'sistema' | 'error'
  texto: string
  // Solo para autor 'error': si el fallo fue al enviar un mensaje, se puede reenviar.
  reintentable?: boolean
}

export type ChatItemConfirmacion = {
  id: string
  kind: 'confirmacion'
  mensaje: string
  accion: string
  parametros: Record<string, unknown>
  estado: EstadoConfirmacion
}

export type ChatItem = ChatItemBurbuja | ChatItemConfirmacion
