import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import {
  CheckBadgeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid'
import type { medico } from '../../../types/medico'
import type { ChatItem, ChatItemConfirmacion } from '../../../types/chatMedico'
import { TIPO_CONSULTA_LABELS, type TipoConsulta } from '../../../config/tiposConsulta'
import AsistenteMark from './asistenteMark'
import './medicoChat.css'

type Props = {
  medico: medico
  items: ChatItem[]
  enviando: boolean
  onEnviar: (texto: string) => void
  onReintentar: () => void
  onConfirmar: (item: ChatItemConfirmacion) => void
  onCancelar: (item: ChatItemConfirmacion) => void
}

// Solo sugieren lo que el backend soporta: buscar paciente por DNI, ver historial y crear consulta.
const SUGERENCIAS = [
  'Quiero buscar un paciente por DNI',
  'Quiero ver el historial de un paciente',
  'Quiero crear una consulta',
]

const ETIQUETAS_CAMPO: Record<string, string> = {
  dni: 'Paciente (DNI)',
  tipo_consulta: 'Tipo de consulta',
  notas: 'Nota',
}
const ORDEN_CAMPOS = Object.keys(ETIQUETAS_CAMPO)

// react-markdown no inyecta HTML crudo (lo ignora) y descarta URLs peligrosas. Además se
// bloquean las imágenes para que el texto del asistente no dispare pedidos a sitios externos.
const MD_COMPONENTS: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

const saludoSegunHora = (hora: number) => {
  if (hora < 12) return 'Buenos días'
  if (hora < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

const formatearEtiqueta = (clave: string) => {
  if (ETIQUETAS_CAMPO[clave]) return ETIQUETAS_CAMPO[clave]
  const texto = clave
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const formatearValor = (clave: string, valor: unknown): string => {
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No'
  if (typeof valor === 'object') return JSON.stringify(valor)
  const texto = String(valor)
  if (clave === 'tipo_consulta') return TIPO_CONSULTA_LABELS[texto as TipoConsulta] ?? texto
  return texto
}

// Solo los campos que vienen en `parametros` (sin inventar ninguno), con los conocidos primero.
const filasConfirmacion = (parametros: Record<string, unknown>) => {
  const indice = (clave: string) => {
    const i = ORDEN_CAMPOS.indexOf(clave)
    return i === -1 ? ORDEN_CAMPOS.length : i
  }
  return Object.entries(parametros)
    .filter(([, valor]) => valor !== null && valor !== undefined && valor !== '')
    .sort(([a], [b]) => indice(a) - indice(b))
}

type TarjetaProps = {
  item: ChatItemConfirmacion
  deshabilitado: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

const TarjetaConfirmacion = ({ item, deshabilitado, onConfirmar, onCancelar }: TarjetaProps) => {
  const filas = filasConfirmacion(item.parametros)
  const confirmando = item.estado === 'confirmando'
  const abierta = item.estado === 'pendiente' || confirmando

  return (
    <section className={`mc-confirmacion mc-confirmacion--${item.estado}`} aria-label="Confirmación requerida">
      <header className="mc-confirmacion__header">
        <CheckBadgeIcon className="mc-confirmacion__icono" width={28} height={28} aria-hidden="true" />
        <h2 className="mc-confirmacion__titulo">Revisá antes de confirmar</h2>
      </header>

      <dl className="mc-confirmacion__filas">
        {filas.map(([clave, valor]) => (
          <div key={clave} className="mc-confirmacion__fila">
            <dt className="mc-confirmacion__clave">{formatearEtiqueta(clave)}</dt>
            <dd className="mc-confirmacion__valor">{formatearValor(clave, valor)}</dd>
          </div>
        ))}
      </dl>

      {abierta && (
        <div className="mc-confirmacion__acciones">
          <button
            type="button"
            className="mc-btn mc-btn--secundario"
            onClick={onCancelar}
            disabled={deshabilitado || confirmando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="mc-btn mc-btn--primario"
            onClick={onConfirmar}
            disabled={deshabilitado || confirmando}
          >
            {confirmando && <span className="mc-spinner" aria-hidden="true" />}
            {confirmando ? 'Confirmando…' : 'Confirmar'}
          </button>
        </div>
      )}

      {item.estado === 'resuelta' && (
        <p className="mc-confirmacion__estado mc-confirmacion__estado--resuelta">
          <CheckCircleIcon width={20} height={20} aria-hidden="true" />
          Confirmada
        </p>
      )}

      {item.estado === 'cancelada' && (
        <p className="mc-confirmacion__estado mc-confirmacion__estado--cancelada">
          <XCircleIcon width={20} height={20} aria-hidden="true" />
          Cancelada
        </p>
      )}
    </section>
  )
}

const MedicoChat = ({ medico, items, enviando, onEnviar, onReintentar, onConfirmar, onCancelar }: Props) => {
  const [texto, setTexto] = useState('')
  const [hora] = useState(() => new Date().getHours())
  const listaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const primerScrollRef = useRef(true)

  const nombreSaludo = medico.apellido || medico.nombre

  // Auto-scroll al último mensaje (sin animación la primera vez o si el sistema pide reducir movimiento).
  useEffect(() => {
    const lista = listaRef.current
    if (!lista) return
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    lista.scrollTo({
      top: lista.scrollHeight,
      behavior: primerScrollRef.current || reducir ? 'auto' : 'smooth',
    })
    primerScrollRef.current = false
  }, [items, enviando])

  // El textarea crece con el contenido; el tope de ~6 líneas lo pone el CSS (max-height).
  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.style.height = 'auto'
    input.style.height = `${input.scrollHeight}px`
  }, [texto])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Al deshabilitarse el textarea se pierde el foco; se recupera cuando llega la respuesta,
  // salvo que el médico ya haya puesto el foco en otro lado.
  useEffect(() => {
    if (!enviando && document.activeElement === document.body) {
      inputRef.current?.focus()
    }
  }, [enviando])

  const enviarActual = () => {
    const mensaje = texto.trim()
    if (!mensaje || enviando) return
    setTexto('')
    onEnviar(mensaje)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      enviarActual()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    enviarActual()
  }

  const renderItem = (item: ChatItem, indice: number) => {
    if (item.kind === 'confirmacion') {
      return (
        <TarjetaConfirmacion
          key={item.id}
          item={item}
          deshabilitado={enviando}
          onConfirmar={() => onConfirmar(item)}
          onCancelar={() => onCancelar(item)}
        />
      )
    }

    if (item.autor === 'medico') {
      return (
        <div key={item.id} className="mc-fila mc-fila--medico">
          <div className="mc-burbuja">
            <span className="mc-sr">Vos: </span>
            {item.texto}
          </div>
        </div>
      )
    }

    if (item.autor === 'asistente') {
      return (
        <div key={item.id} className="mc-fila mc-fila--asistente">
          <AsistenteMark size={32} />
          <div className="mc-md">
            <span className="mc-sr">Asistente: </span>
            <ReactMarkdown components={MD_COMPONENTS} disallowedElements={['img']}>
              {item.texto}
            </ReactMarkdown>
          </div>
        </div>
      )
    }

    if (item.autor === 'error') {
      const puedeReintentar = item.reintentable && indice === items.length - 1
      return (
        <div key={item.id} className="mc-error">
          <ExclamationCircleIcon className="mc-error__icono" width={20} height={20} aria-hidden="true" />
          <span>{item.texto}</span>
          {puedeReintentar && (
            <button type="button" className="mc-error__reintentar" onClick={onReintentar} disabled={enviando}>
              Reintentar
            </button>
          )}
        </div>
      )
    }

    return (
      <p key={item.id} className="mc-sistema">
        {item.texto}
      </p>
    )
  }

  return (
    <div className="mc-vista">
      <div className="mc-scroll" ref={listaRef} role="log" aria-live="polite" aria-label="Conversación con el asistente">
        <div className="mc-columna">
          {items.length === 0 && !enviando ? (
            <div className="mc-bienvenida">
              <AsistenteMark size={88} showSecondSpark />
              <h1 className="mc-bienvenida__saludo">
                {saludoSegunHora(hora)}, Dr. {nombreSaludo}
              </h1>
              <p className="mc-bienvenida__sub">¿En qué te puedo ayudar hoy?</p>
              <div className="mc-chips" role="group" aria-label="Sugerencias">
                {SUGERENCIAS.map((sugerencia) => (
                  <button key={sugerencia} type="button" className="mc-chip" onClick={() => onEnviar(sugerencia)}>
                    {sugerencia}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {items.map(renderItem)}

              {enviando && (
                <div className="mc-fila mc-fila--asistente">
                  <AsistenteMark size={32} />
                  <div className="mc-escribiendo">
                    <span className="mc-sr">El asistente está escribiendo…</span>
                    <span className="mc-escribiendo__punto" aria-hidden="true" />
                    <span className="mc-escribiendo__punto" aria-hidden="true" />
                    <span className="mc-escribiendo__punto" aria-hidden="true" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mc-compositor">
        <div className="mc-columna">
          <form className="mc-pildora" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="mc-input"
              placeholder="Escribí tu mensaje…"
              aria-label="Mensaje para el asistente"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={enviando}
              rows={1}
            />
            <button
              type="submit"
              className="mc-enviar"
              disabled={enviando || !texto.trim()}
              aria-label="Enviar mensaje"
            >
              <PaperAirplaneIcon width={20} height={20} aria-hidden="true" />
            </button>
          </form>
          <p className="mc-ayuda">El asistente puede equivocarse. Revisá siempre antes de confirmar.</p>
        </div>
      </div>
    </div>
  )
}

export default MedicoChat
