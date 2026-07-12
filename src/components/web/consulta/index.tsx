import { useState } from 'react'
import type { paciente } from '../../../types/paciente'
import type { consulta } from '../../../types/consulta'
import { TIPOS_CONSULTA, TIPO_CONSULTA_LABELS, type TipoConsulta } from '../../../config/tiposConsulta'
import CargarRecetaModal from '../cargarRecetaModal'
import type { RecetaPayload } from '../../../api/consultas'
import './consulta.css'

type Props = {
  paciente?: paciente | null
  profesionalId?: string
  organizacionId?: string
  otros?: string
  onOtrosChange?: (v: string) => void
  antecedentes?: string
  motivoConsultaPrevia?: string
  notaConsultaPrevia?: string
  onFinalizar?: (data: consulta, receta?: RecetaPayload) => void
  onVerHistorial?: () => void
}

const ConsultaWeb = ({
  paciente,
  profesionalId = '',
  organizacionId = '',
  otros = '',
  onOtrosChange,
  antecedentes,
  motivoConsultaPrevia,
  notaConsultaPrevia,
  onFinalizar,
  onVerHistorial,
}: Props) => {
  const [proximaCita, setProximaCita] = useState(false)
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta | ''>('')
  const [solicitudEstudio, setSolicitudEstudio] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null)
  const [modalRecetaAbierto, setModalRecetaAbierto] = useState(false)
  const [receta, setReceta] = useState<RecetaPayload | null>(null)

  const handleToggleSolicitudEstudio = () => {
    setSolicitudEstudio((prev) => !prev)
  }

  const buildConsulta = (): consulta => ({
    dni: paciente?.dni,
    profesional_id: profesionalId,
    organizacion_id: organizacionId,
    tipo_consulta: tipoConsulta as TipoConsulta,
    solicitud_estudio: solicitudEstudio,
    solicitud_receta: receta !== null,
    solicitud_citaprox: proximaCita,
    notas: otros ? otros.trim() : undefined,
  })

  const handleFinalizarClick = () => {
    if (!tipoConsulta) {
      setErrorFormulario('Debe seleccionar un tipo de consulta.')
      return
    }
    setErrorFormulario(null)
    onFinalizar?.(buildConsulta(), receta ?? undefined)
  }

  return (
    <div className="consulta-panel">

      {/* ── Info del paciente ── */}
      <div className="consulta-paciente-card">
        <div className="consulta-paciente-card__left">
          <div className="consulta-paciente-card__avatar">
            {paciente && paciente.fotoPerfil ? (
              <img src={paciente.fotoPerfil} alt={paciente.nombre} />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#1f6f6b">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z"/>
                <path d="M12 13.6c-4.8 0-8.4 2.4-8.4 5.4v1.2h16.8V19c0-3-3.6-5.4-8.4-5.4z"/>
              </svg>
            )}
          </div>
          <div className="consulta-paciente-card__info">
            <h2 className="consulta-paciente-card__nombre">
              {paciente ? `${paciente.nombre} ${paciente.apellido}` : ''}
            </h2>
            <div className="consulta-paciente-card__meta">
              <span>{paciente ? `${paciente.edad} años` : ''}</span>
              <span className="consulta-paciente-card__dot">·</span>
              <span>{paciente ? 'OSDE 410' : ''}</span>
              <span className="consulta-paciente-card__dot">·</span>
              <span className="consulta-paciente-card__cobertura">
                {/* check */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#1f6f6b"/>
                  <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                COBERTURA VALIDADA
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="consulta-paciente-card__btn-historial"
          onClick={onVerHistorial}
        >
          {/* ícono historial */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Ver Historial Clínico Completo
        </button>
      </div>

      {/* ── Antecedentes / Consulta previa ── */}
      <div className="consulta-antecedentes">
        <div className="consulta-antecedentes__col">
          <span className="consulta-antecedentes__label">ANTECEDENTES RELEVANTES</span>
          <p className="consulta-antecedentes__valor">
            {antecedentes ?? '—'}
          </p>
          {notaConsultaPrevia && (
            <p className="consulta-antecedentes__nota">{notaConsultaPrevia}</p>
          )}
        </div>
        <div className="consulta-antecedentes__divider" />
        <div className="consulta-antecedentes__col">
          <span className="consulta-antecedentes__label">ÚLTIMO MOTIVO DE CONSULTA</span>
          <p className="consulta-antecedentes__valor">
            {motivoConsultaPrevia ?? '—'}
          </p>
        </div>
      </div>

      {/* ── Registro de consulta ── */}
      <div className="consulta-form-card">
        <h3 className="consulta-form-card__titulo">Registro de Consulta</h3>

        {/* Tipo de consulta */}
        <div className="consulta-form-card__field">
          <label className="consulta-form-card__label" htmlFor="tipo-consulta">
            Tipo de Consulta
          </label>
          <select
            id="tipo-consulta"
            className="consulta-form-card__select"
            value={tipoConsulta}
            onChange={(e) => setTipoConsulta(e.target.value as TipoConsulta)}
          >
            <option value="" disabled>
              Seleccione un tipo de consulta
            </option>
            {TIPOS_CONSULTA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_CONSULTA_LABELS[tipo]}
              </option>
            ))}
          </select>
        </div>

        {/* Textarea */}
        <div className="consulta-form-card__field">
          <label className="consulta-form-card__label">
            Motivo de consulta y síntomas
          </label>
          <textarea
            className="consulta-form-card__textarea"
            placeholder="Describa el cuadro actual del paciente..."
            value={otros}
            onChange={(e) => onOtrosChange?.(e.target.value)}
            rows={4}
          />
        </div>

        <div className="consulta-form-card__recordatorio">
          <div className="consulta-form-card__recordatorio-left">
            <span className="consulta-form-card__recordatorio-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <div>
              <div className="consulta-form-card__label">Recordatorio Próxima Cita</div>
              <div className="consulta-form-card__nota">Activa para agendar una próxima visita del paciente.</div>
            </div>
          </div>
          <button
            type="button"
            className={`consulta-toggle ${proximaCita ? 'consulta-toggle--on' : ''}`}
            onClick={() => setProximaCita((prev) => !prev)}
            aria-pressed={proximaCita}
          >
            <span className="consulta-toggle__thumb" />
          </button>
        </div>

        {/* Acciones rápidas */}
        <div className="consulta-form-card__acciones">
          <button
            type="button"
            className={`consulta-accion-btn ${receta ? 'consulta-accion-btn--active' : ''}`}
            onClick={() => setModalRecetaAbierto(true)}
            aria-pressed={receta !== null}
            disabled={!paciente}
          >
            <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <span>{receta ? `Receta: ${receta.titulo || receta.archivo.name}` : 'Cargar Receta'}</span>
          </button>
          <button type="button" className="consulta-accion-btn">
            <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Cargar Diagnóstico</span>
          </button>
          <button
            type="button"
            className={`consulta-accion-btn ${solicitudEstudio ? 'consulta-accion-btn--active' : ''}`}
            onClick={handleToggleSolicitudEstudio}
            aria-pressed={solicitudEstudio}
          >
            <svg width="18" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>Solicitar Estudio</span>
          </button>
        </div>

        {errorFormulario && <p className="consulta-form-card__error">{errorFormulario}</p>}

        {/* Botones finales */}
        <div className="consulta-form-card__footer">
          <button
            type="button"
            className="consulta-btn consulta-btn--ghost"
            disabled
            title="Función no disponible aún"
          >
            Guardar como Borrador
          </button>
          <button
            type="button"
            className="consulta-btn consulta-btn--primary"
            onClick={handleFinalizarClick}
            disabled={!paciente}
          >
            Finalizar y Guardar Consulta
          </button>
        </div>
      </div>

      {modalRecetaAbierto && paciente && (
        <CargarRecetaModal
          nombrePaciente={`${paciente.nombre} ${paciente.apellido}`}
          onSubir={(archivo, titulo) => {
            setReceta({ archivo, titulo: titulo || undefined })
            setModalRecetaAbierto(false)
          }}
          onCancelar={() => setModalRecetaAbierto(false)}
        />
      )}
    </div>
  )
}

export default ConsultaWeb
