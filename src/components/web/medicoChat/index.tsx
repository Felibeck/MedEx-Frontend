import { useEffect, useRef, useState } from 'react'
import { enviarMensajeChat, confirmarAccionChat, type ChatRespuestaConfirmacion } from '../../../api/chatMedico'
import './medicoChat.css'

type EstadoConfirmacion = 'pendiente' | 'confirmando' | 'resuelta' | 'cancelada'

type ItemBurbuja = {
  id: string
  kind: 'burbuja'
  autor: 'medico' | 'asistente' | 'sistema' | 'error'
  texto: string
}

type ItemConfirmacion = {
  id: string
  kind: 'confirmacion'
  mensaje: string
  accion: string
  parametros: Record<string, unknown>
  estado: EstadoConfirmacion
}

type Item = ItemBurbuja | ItemConfirmacion

type Props = {
  conversationId: string
  onClose: () => void
}

const crearId = () => crypto.randomUUID()

const formatearLabel = (clave: string) =>
  clave
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const formatearValor = (valor: unknown): string => {
  if (valor === null || valor === undefined || valor === '') return '—'
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
  return String(valor)
}

const MedicoChat = ({ conversationId, onClose }: Props) => {
  const [items, setItems] = useState<Item[]>([
    {
      id: crearId(),
      kind: 'burbuja',
      autor: 'asistente',
      texto: '¡Hola! Soy el asistente médico. ¿En qué te puedo ayudar?',
    },
  ])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [items])

  const agregarItem = (item: Item) => setItems((prev) => [...prev, item])

  const actualizarConfirmacion = (id: string, estado: EstadoConfirmacion) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id && it.kind === 'confirmacion' ? { ...it, estado } : it))
    )

  const handleEnviar = async () => {
    const mensaje = texto.trim()
    if (!mensaje || enviando) return

    agregarItem({ id: crearId(), kind: 'burbuja', autor: 'medico', texto: mensaje })
    setTexto('')
    setEnviando(true)

    try {
      const respuesta = await enviarMensajeChat(conversationId, mensaje)

      agregarItem({ id: crearId(), kind: 'burbuja', autor: 'asistente', texto: respuesta.mensaje })

      if (respuesta.tipo === 'confirmacion_requerida') {
        const confirmacion = respuesta as ChatRespuestaConfirmacion
        agregarItem({
          id: crearId(),
          kind: 'confirmacion',
          mensaje: confirmacion.mensaje,
          accion: confirmacion.accion,
          parametros: confirmacion.parametros,
          estado: 'pendiente',
        })
      }
    } catch {
      agregarItem({
        id: crearId(),
        kind: 'burbuja',
        autor: 'error',
        texto: 'Hubo un problema, intentá de nuevo.',
      })
    } finally {
      setEnviando(false)
    }
  }

  const handleConfirmar = async (item: ItemConfirmacion) => {
    if (enviando) return
    actualizarConfirmacion(item.id, 'confirmando')
    setEnviando(true)

    try {
      const respuesta = await confirmarAccionChat(conversationId, item.accion, item.parametros)
      actualizarConfirmacion(item.id, 'resuelta')
      agregarItem({ id: crearId(), kind: 'burbuja', autor: 'asistente', texto: respuesta.mensaje })
    } catch {
      actualizarConfirmacion(item.id, 'pendiente')
      agregarItem({
        id: crearId(),
        kind: 'burbuja',
        autor: 'error',
        texto: 'Hubo un problema, intentá de nuevo.',
      })
    } finally {
      setEnviando(false)
    }
  }

  const handleCancelar = (item: ItemConfirmacion) => {
    actualizarConfirmacion(item.id, 'cancelada')
    agregarItem({ id: crearId(), kind: 'burbuja', autor: 'sistema', texto: 'Acción cancelada' })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  return (
    <div className="mc-overlay" role="dialog" aria-modal="true" aria-labelledby="mc-title">
      <div className="mc-card">
        {/* Header */}
        <div className="mc-header">
          <div className="mc-header__avatar" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
          </div>
          <div className="mc-header__info">
            <span className="mc-header__titulo" id="mc-title">Asistente Médico</span>
          </div>
          <button className="mc-header__close" onClick={onClose} aria-label="Cerrar chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="mc-body" ref={bodyRef}>
          {items.map((item) => {
            if (item.kind === 'burbuja') {
              return (
                <div key={item.id} className={`mc-burbuja mc-burbuja--${item.autor}`}>
                  {item.texto}
                </div>
              )
            }

            return (
              <div key={item.id} className="mc-confirmacion">
                <div className="mc-confirmacion__header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Confirmación requerida</span>
                </div>

                <ul className="mc-confirmacion__lista">
                  {Object.entries(item.parametros).map(([clave, valor]) => (
                    <li key={clave}>
                      <span className="mc-confirmacion__clave">{formatearLabel(clave)}:</span>{' '}
                      <span className="mc-confirmacion__valor">{formatearValor(valor)}</span>
                    </li>
                  ))}
                </ul>

                {item.estado === 'pendiente' && (
                  <div className="mc-confirmacion__acciones">
                    <button
                      type="button"
                      className="mc-btn mc-btn--ghost"
                      onClick={() => handleCancelar(item)}
                      disabled={enviando}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="mc-btn mc-btn--primary"
                      onClick={() => handleConfirmar(item)}
                      disabled={enviando}
                    >
                      Confirmar
                    </button>
                  </div>
                )}

                {item.estado === 'confirmando' && (
                  <div className="mc-confirmacion__estado">
                    <span className="mc-spinner" aria-hidden="true" />
                    Confirmando...
                  </div>
                )}

                {item.estado === 'cancelada' && (
                  <div className="mc-confirmacion__estado mc-confirmacion__estado--cancelada">
                    Cancelada
                  </div>
                )}

                {item.estado === 'resuelta' && (
                  <div className="mc-confirmacion__estado mc-confirmacion__estado--resuelta">
                    Confirmada
                  </div>
                )}
              </div>
            )
          })}

          {enviando && (
            <div className="mc-burbuja mc-burbuja--asistente mc-burbuja--loading">
              <span className="mc-spinner" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mc-footer">
          <textarea
            className="mc-input"
            placeholder="Escribí tu mensaje..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={enviando}
            rows={1}
          />
          <button
            type="button"
            className="mc-enviar"
            onClick={handleEnviar}
            disabled={enviando || !texto.trim()}
            aria-label="Enviar mensaje"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MedicoChat
