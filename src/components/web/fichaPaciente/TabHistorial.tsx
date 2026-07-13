import type { historialClinico } from '../../../types/historialClinico'

type Props = {
  historial: historialClinico
}

// ── Sección wrapper ──────────────────────────────────────────────
const Seccion = ({ titulo, icono, children }: { titulo: string; icono: React.ReactNode; children: React.ReactNode }) => (
  <div className="tab-historial__seccion">
    <div className="tab-historial__seccion-header">
      <span className="tab-historial__seccion-icono">{icono}</span>
      <h3 className="tab-historial__seccion-titulo">{titulo}</h3>
    </div>
    <div className="tab-historial__seccion-cuerpo">{children}</div>
  </div>
)

// ── Caja de texto con label ──────────────────────────────────────
const CajaTexto = ({ label, texto }: { label?: string; texto: string }) => (
  <div className="tab-historial__caja">
    {label && <span className="tab-historial__caja-label">{label}</span>}
    <p className="tab-historial__caja-texto">{texto}</p>
  </div>
)

// ── Iconos ───────────────────────────────────────────────────────
const IconoMedico = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11v4M10 13h4" />
  </svg>
)

const IconoGineco = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M12 13v8M9 18h6" />
  </svg>
)

const IconoVitales = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

const IconoFamilia = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconoPastilla = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </svg>
)

const IconoOtros = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

// ────────────────────────────────────────────────────────────────
const TabHistorial = ({ historial }: Props) => {
  const h = historial.historial

  if (!h) {
    return (
      <p className="ficha-paciente__vacio tab-historial__vacio-global">
        No hay información de historial clínico registrada para este paciente.
      </p>
    )
  }

  const hayAlgo = h.ant || h.ago || h.ahf || h.ef || h.mx || h.eco || h.otros

  if (!hayAlgo) {
    return (
      <p className="ficha-paciente__vacio tab-historial__vacio-global">
        No hay información de historial clínico registrada para este paciente.
      </p>
    )
  }

  return (
    <div className="tab-historial">

      {/* Antecedentes patológicos */}
      {h.ant && (
        <Seccion titulo="Antecedentes Médicos" icono={<IconoMedico />}>
          <CajaTexto label="CLÍNICOS" texto={h.ant} />
        </Seccion>
      )}

      {/* Antecedentes gineco-obstétricos */}
      {h.ago && (
        <Seccion titulo="Antecedentes Gineco-obstétricos" icono={<IconoGineco />}>
          <CajaTexto label="OBSERVACIONES GYN/OBS" texto={h.ago} />
        </Seccion>
      )}

      {/* Examen físico */}
      {h.ef && (
        <Seccion titulo="Examen Físico & Vitales" icono={<IconoVitales />}>
          <CajaTexto texto={h.ef} />
        </Seccion>
      )}

      {/* Antecedentes heredo-familiares */}
      {h.ahf && (
        <Seccion titulo="Antecedentes Familiares" icono={<IconoFamilia />}>
          <CajaTexto texto={h.ahf} />
        </Seccion>
      )}

      {/* Medicación actual */}
      {h.mx && (
        <Seccion titulo="Medicación Actual" icono={<IconoPastilla />}>
          <CajaTexto texto={h.mx} />
        </Seccion>
      )}

      {/* Estudios / ecografías */}
      {h.eco && (
        <Seccion titulo="Estudios Complementarios" icono={<IconoVitales />}>
          <CajaTexto texto={h.eco} />
        </Seccion>
      )}

      {/* Otros */}
      {h.otros && (
        <Seccion titulo="Otros" icono={<IconoOtros />}>
          <CajaTexto texto={h.otros} />
        </Seccion>
      )}

    </div>
  )
}

export default TabHistorial
