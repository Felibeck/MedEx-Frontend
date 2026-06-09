import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { estudio } from '../../../types/estudio'
import './detalleEstudio.css'

type Props = {
  estudio: estudio
  onDescargarPdf?: () => void
  onCompartir?: () => void
  onVolver?: () => void
}

const ORDINAL = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto', 'Sexto']
const getLabelCorte = (i: number) => `${ORDINAL[i] ?? `${i + 1}°`} Corte - Axial`

const DetalleEstudio = ({ estudio, onDescargarPdf, onCompartir, onVolver }: Props) => {
  const navigate = useNavigate()
  const cortes = estudio.cortes ?? []
  const [indexActual, setIndexActual] = useState(0)

  const anterior = () => setIndexActual((p) => (p - 1 + cortes.length) % cortes.length)
  const siguiente = () => setIndexActual((p) => (p + 1) % cortes.length)

  const handleVolver = () => {
    if (onVolver) onVolver()
    else navigate(-1)
  }

  const fechaFormateada = estudio.fecha.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="detalle-page">

      {/* ── Header ── */}
      <header className="detalle-header">
        <button
          type="button"
          className="detalle-header__back"
          onClick={handleVolver}
          aria-label="Volver"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span className="detalle-header__title">MedEx</span>
        <div className="detalle-header__avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z"/>
            <path d="M12 13.6c-4.8 0-8.4 2.4-8.4 5.4v1.2h16.8V19c0-3-3.6-5.4-8.4-5.4z"/>
          </svg>
        </div>
      </header>

      <div className="detalle-content">

        {/* ── Info card ── */}
        <div className="detalle-info-card">
          <span className="detalle-badge">{estudio.categoria}</span>
          <h1 className="detalle-titulo">{estudio.tipoEstudio}</h1>
          <div className="detalle-meta-row">
            <div className="detalle-meta-item">
              <span className="detalle-meta-label">FECHA</span>
              <div className="detalle-meta-value-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span className="detalle-meta-value">{fechaFormateada}</span>
              </div>
            </div>
            <div className="detalle-meta-divider"/>
            <div className="detalle-meta-item">
              <span className="detalle-meta-label">INSTITUCIÓN</span>
              <div className="detalle-meta-value-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v4m0 4v3m4-11v4m0 4v3m4-11v4m0 4v3"/>
                </svg>
                <span className="detalle-meta-value">{estudio.institucion}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Visor DICOM (solo si hay cortes) ── */}
        {cortes.length > 0 && (
          <div className="visor-wrap">
            <div className="visor-meta">
              {estudio.pacienteId && <span>ID: {estudio.pacienteId}</span>}
              {estudio.pacienteDob && <span>DOB: {estudio.pacienteDob}</span>}
              {estudio.metadataDicom && <span>{estudio.metadataDicom}</span>}
              <span>Slice: {indexActual + 1}/{cortes.length}</span>
            </div>

            <div className="visor-imagen-wrap">
              <button className="visor-btn visor-btn--prev" onClick={anterior} aria-label="Anterior">&#8249;</button>
              <img
                className="visor-imagen"
                src={cortes[indexActual].imagen}
                alt={cortes[indexActual].label}
              />
              <button className="visor-btn visor-btn--next" onClick={siguiente} aria-label="Siguiente">&#8250;</button>
            </div>

            <div className="visor-corte-label">{getLabelCorte(indexActual)}</div>

            <div className="visor-footer">
              <div className="visor-footer-header">
                <span className="visor-footer-titulo">SECUENCIA DE CORTES</span>
                <span className="visor-footer-count">{cortes.length} Imágenes cargadas</span>
              </div>
              <div className="visor-miniaturas">
                {cortes.map((c, i) => (
                  <button
                    key={c.id}
                    className={`visor-miniatura${i === indexActual ? ' visor-miniatura--activa' : ''}`}
                    onClick={() => setIndexActual(i)}
                    aria-label={`Ir al corte ${c.label}`}
                  >
                    <img src={c.imagen} alt={c.label}/>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Imagen simple (si no hay cortes pero sí fotos) ── */}
        {cortes.length === 0 && estudio.fotos.length > 0 && (
          <div className="visor-wrap">
            <div className="visor-imagen-wrap">
              <img
                className="visor-imagen"
                src={estudio.fotos[0]}
                alt={estudio.tipoEstudio}
              />
            </div>
          </div>
        )}

        {/* ── Informe Médico (solo si hay informe o médico) ── */}
        {(estudio.informe || estudio.medico) && (
          <div className="detalle-informe-card">
            <h2 className="detalle-informe-titulo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Informe Médico
            </h2>

            {estudio.informe && (
              <div className="detalle-informe-texto">
                <p>{estudio.informe}</p>
              </div>
            )}

            {estudio.medico && (
              <div className="detalle-doctor">
                <div className="detalle-doctor__avatar">
                  {estudio.medico.fotoPerfil ? (
                    <img
                      src={estudio.medico.fotoPerfil}
                      alt={estudio.medico.nombre}
                      className="detalle-doctor__foto"
                    />
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1f6f6b">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z"/>
                      <path d="M12 13.6c-4.8 0-8.4 2.4-8.4 5.4v1.2h16.8V19c0-3-3.6-5.4-8.4-5.4z"/>
                    </svg>
                  )}
                </div>
                <div className="detalle-doctor__info">
                  <span className="detalle-doctor__nombre">
                    {estudio.medico.nombre} {estudio.medico.apellido}
                  </span>
                  <span className="detalle-doctor__especialidad">{estudio.medico.especialidad}</span>
                </div>
                <div className="detalle-doctor__badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#1f6f6b"/>
                    <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Botones de acción ── */}
        <button
          type="button"
          className="detalle-btn detalle-btn--primary"
          onClick={onDescargarPdf}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Descargar PDF
        </button>

        <button
          type="button"
          className="detalle-btn detalle-btn--secondary"
          onClick={onCompartir}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Compartir con Médico
        </button>

        <p className="detalle-nota">
          Este resultado está disponible para tu médico de cabecera automáticamente a través de la Red MedEx.
        </p>

      </div>
    </div>
  )
}

export default DetalleEstudio
