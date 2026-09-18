import { api } from './client'

// ── Tipos que devuelve el backend ────────────────────────────────────────────
// El backend ya responde en camelCase para este endpoint (no hay snake_case que
// mapear), pero se mantiene la capa de tipos + mapper para seguir el mismo
// patrón que el resto de `src/api/`.

type ApiChatMensaje = {
  tipo: 'mensaje'
  mensaje: string
}

type ApiChatConfirmacionRequerida = {
  tipo: 'confirmacion_requerida'
  mensaje: string
  accion: string
  parametros: Record<string, unknown>
}

type ApiChatData = ApiChatMensaje | ApiChatConfirmacionRequerida

type ApiChatEnvelope<T> = {
  success: boolean
  message?: string
  data: T
}

// ── Tipos internos que consume la UI ─────────────────────────────────────────

export type ChatRespuestaMensaje = {
  tipo: 'mensaje'
  mensaje: string
}

export type ChatRespuestaConfirmacion = {
  tipo: 'confirmacion_requerida'
  mensaje: string
  accion: string
  parametros: Record<string, unknown>
}

export type ChatRespuesta = ChatRespuestaMensaje | ChatRespuestaConfirmacion

// ── Mappers ──────────────────────────────────────────────────────────────────

const mapChatDataFromApi = (raw: ApiChatData): ChatRespuesta => {
  if (raw.tipo === 'confirmacion_requerida') {
    return {
      tipo: 'confirmacion_requerida',
      mensaje: raw.mensaje,
      accion: raw.accion,
      parametros: raw.parametros,
    }
  }
  return { tipo: 'mensaje', mensaje: raw.mensaje }
}

// ── Fetch/Mutations ──────────────────────────────────────────────────────────

/**
 * Envía un mensaje del médico al asistente de IA dentro de una conversación.
 * El JWT se adjunta automáticamente vía el interceptor de `api`.
 */
export const enviarMensajeChat = async (
  conversationId: string,
  mensaje: string
): Promise<ChatRespuesta> => {
  const { data } = await api.post<ApiChatEnvelope<ApiChatData>>('/medico/chat', {
    conversationId,
    mensaje,
  })

  if (!data.success) {
    throw new Error(data.message || 'No se pudo procesar el mensaje')
  }

  return mapChatDataFromApi(data.data)
}

// El shape exacto de /medico/chat/confirmar no está confirmado (a diferencia de
// /medico/chat, no se especificó si trae "tipo"). Solo se asume que `data.mensaje`
// es un string con el resultado — es lo único que la UI necesita mostrar.
type ApiChatConfirmarData = {
  mensaje: string
}

/**
 * Confirma una acción sugerida por el asistente (ej: crear una consulta).
 */
export const confirmarAccionChat = async (
  conversationId: string,
  accion: string,
  parametros: Record<string, unknown>
): Promise<ChatRespuestaMensaje> => {
  const { data } = await api.post<ApiChatEnvelope<ApiChatConfirmarData>>('/medico/chat/confirmar', {
    conversationId,
    accion,
    parametros,
  })

  if (!data.success) {
    throw new Error(data.message || 'No se pudo confirmar la acción')
  }

  return { tipo: 'mensaje', mensaje: data.data.mensaje }
}
