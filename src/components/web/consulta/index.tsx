import type { paciente } from '../../../types/paciente'
import type { consulta } from '../../../types/consulta'
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
  onFinalizar?: (data: consulta) => void
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

  const buildConsulta = (): consulta => ({
    paciente_id: paciente?.paciente_id,
    dni: paciente?.dni,
    profesional_id: profesionalId,
    organizacion_id: organizacionId,
    solicitud_estudio: false,
    solicitud_receta: false,
    solicitud_citaprox: false,
    notas: otros ? { nota: otros } : undefined,
  })

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
          <span className="consulta-antecedentes__label">MOTIVO CONSULTA PREVIA</span>
          <p className="consulta-antecedentes__valor">
            {motivoConsultaPrevia ?? '—'}
          </p>
        </div>
      </div>

      {/* ── Registro de consulta ── */}
      <div className="consulta-form-card">
        <h3 className="consulta-form-card__titulo">Registro de Consulta</h3>

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

        {/* Acciones rápidas */}
        <div className="consulta-form-card__acciones">
          <button type="button" className="consulta-accion-btn">
            <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <span>Cargar Receta</span>
          </button>
          <button type="button" className="consulta-accion-btn">
            <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Cargar Diagnóstico</span>
          </button>
          <button type="button" className="consulta-accion-btn">
            <svg width="18" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>Solicitar Estudio</span>
          </button>
        </div>

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
            onClick={() => onFinalizar?.(buildConsulta())}
            disabled={!paciente}
          >
            Finalizar y Guardar Consulta
          </button>
        </div>
      </div>

    </div>
  )
}

export default ConsultaWeb
