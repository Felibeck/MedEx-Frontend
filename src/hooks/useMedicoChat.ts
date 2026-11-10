import { useRef, useState } from 'react'
import axios from 'axios'
import { enviarMensajeChat, confirmarAccionChat } from '../api/chatMedico'
import type { ChatItem, ChatItemConfirmacion, EstadoConfirmacion } from '../types/chatMedico'

const MENSAJE_ERROR = 'Hubo un problema, intentá de nuevo.'
const MENSAJE_IA_NO_DISPONIBLE = 'El asistente de IA no está disponible en este momento.'

// El backend devuelve 429 (se agotó la cuota diaria de la IA) y 503 (IA saturada) con un message
// pensado para el médico. Cualquier otro error puede traer un message técnico: nunca se muestra.
const describirError = (error: unknown): { texto: string; reintentable: boolean } => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 429 || status === 503) {
      const message: unknown = error.response?.data?.message
      const texto = typeof message === 'string' && message.trim() ? message.trim() : MENSAJE_IA_NO_DISPONIBLE
      // Con la cuota diaria agotada reintentar no sirve; con la IA saturada sí.
      return { texto, reintentable: status === 503 }
    }
  }
  return { texto: MENSAJE_ERROR, reintentable: true }
}

const crearId = () => crypto.randomUUID()

// Estado de la conversación con el asistente. Vive en doctorHome (no en la vista del
// chat) para que no se pierda al cambiar de sección; se descarta al cerrar sesión o
// recargar la pestaña.
export const useMedicoChat = () => {
  const [conversationId] = useState(crearId)
  const [items, setItems] = useState<ChatItem[]>([])
  const [enviando, setEnviando] = useState(false)
  // Evita doble envío antes de que React re-renderice con enviando = true.
  const ocupadoRef = useRef(false)

  const agregarItem = (item: ChatItem) => setItems((prev) => [...prev, item])

  const actualizarConfirmacion = (id: string, estado: EstadoConfirmacion) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id && it.kind === 'confirmacion' ? { ...it, estado } : it))
    )

  const iniciar = () => {
    ocupadoRef.current = true
    setEnviando(true)
  }

  const terminar = () => {
    ocupadoRef.current = false
    setEnviando(false)
  }

  const pedirRespuesta = async (mensaje: string) => {
    try {
      const respuesta = await enviarMensajeChat(conversationId, mensaje)

      agregarItem({ id: crearId(), kind: 'burbuja', autor: 'asistente', texto: respuesta.mensaje })

      if (respuesta.tipo === 'confirmacion_requerida') {
        agregarItem({
          id: crearId(),
          kind: 'confirmacion',
          mensaje: respuesta.mensaje,
          accion: respuesta.accion,
          parametros: respuesta.parametros,
          estado: 'pendiente',
        })
      }
    } catch (error) {
      const { texto, reintentable } = describirError(error)
      agregarItem({
        id: crearId(),
        kind: 'burbuja',
        autor: 'error',
        texto,
        reintentable,
      })
    } finally {
      terminar()
    }
  }

  const enviar = async (texto: string) => {
    const mensaje = texto.trim()
    if (!mensaje || ocupadoRef.current) return

    agregarItem({ id: crearId(), kind: 'burbuja', autor: 'medico', texto: mensaje })
    iniciar()
    await pedirRespuesta(mensaje)
  }

  // Reenvía el último mensaje del médico sin duplicar su burbuja.
  const reintentar = async () => {
    if (ocupadoRef.current) return

    const ultimoMensaje = [...items]
      .reverse()
      .find((it) => it.kind === 'burbuja' && it.autor === 'medico')
    if (!ultimoMensaje || ultimoMensaje.kind !== 'burbuja') return

    setItems((prev) => prev.filter((it) => !(it.kind === 'burbuja' && it.reintentable)))
    iniciar()
    await pedirRespuesta(ultimoMensaje.texto)
  }

  const confirmar = async (item: ChatItemConfirmacion) => {
    if (ocupadoRef.current) return
    actualizarConfirmacion(item.id, 'confirmando')
    iniciar()

    try {
      const respuesta = await confirmarAccionChat(conversationId, item.accion, item.parametros)
      actualizarConfirmacion(item.id, 'resuelta')
      agregarItem({ id: crearId(), kind: 'burbuja', autor: 'asistente', texto: respuesta.mensaje })
    } catch {
      // La tarjeta vuelve a 'pendiente' y conserva su propio botón Confirmar.
      actualizarConfirmacion(item.id, 'pendiente')
      agregarItem({ id: crearId(), kind: 'burbuja', autor: 'error', texto: MENSAJE_ERROR })
    } finally {
      terminar()
    }
  }

  const cancelar = (item: ChatItemConfirmacion) => {
    actualizarConfirmacion(item.id, 'cancelada')
    agregarItem({ id: crearId(), kind: 'burbuja', autor: 'sistema', texto: 'Acción cancelada' })
  }

  return { items, enviando, enviar, reintentar, confirmar, cancelar }
}
