import type { historialClinico } from '../../../types/historialClinico'
import { formatearFecha } from '../../../utils/paciente'

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

// ── Tarjeta de dato con label + valor ────────────────────────────
const DatoCard = ({ label, valor }: { label: string; valor: React.ReactNode }) => (
  <div className="tab-historial__dato-card">
    <span className="tab-historial__dato-label">{label}</span>
    <span className="tab-historial__dato-valor">{valor ?? '—'}</span>
  </div>
)

// ── Icono: Antecedentes médicos ──────────────────────────────────
const IconoMedico = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11v4M10 13h4" />
  </svg>
)

// ── Icono: Gineco-obstétrico ─────────────────────────────────────
const IconoGineco = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M12 13v8M9 18h6" />
  </svg>
)

// ── Icono: Examen físico ─────────────────────────────────────────
const IconoVitales = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

// ── Icono: Antecedentes familiares ───────────────────────────────
const IconoFamilia = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const TabHistorial = ({ historial }: Props) => {
  const { paciente, antecedentesPatologicos, examenFisico } = historial

  const ginecoObs = paciente?.ginecoObstetrico ?? null
  const antecedentesQuirurgicos = paciente?.antecedentesQuirurgicos ?? null
  const heredofamiliares = paciente?.heredofamiliares ?? null

  const hayAntMedicos = (antecedentesPatologicos?.length ?? 0) > 0 || antecedentesQuirurgicos
  const hayGineco = ginecoObs !== null
  const hayExamen = examenFisico !== null
  const hayFamiliares = !!heredofamiliares

  if (!hayAntMedicos && !hayGineco && !hayExamen && !hayFamiliares) {
    return (
      <p className="ficha-paciente__vacio tab-historial__vacio-global">
        No hay información de historial clínico registrada para este paciente.
      </p>
    )
  }

  return (
    <div className="tab-historial">

      {/* ── Antecedentes Médicos ── */}
      {hayAntMedicos && (
        <Seccion titulo="Antecedentes Médicos" icono={<IconoMedico />}>
          <div className="tab-historial__grid-columnas">
            {(antecedentesPatologicos?.length ?? 0) > 0 && (
              <div className="tab-historial__caja tab-historial__caja--clinicos">
                <span className="tab-historial__caja-label">CLÍNICOS</span>
                <p className="tab-historial__caja-texto">
                  {antecedentesPatologicos.map((a) => a.nombre).join('. ')}
                </p>
              </div>
            )}
            {antecedentesQuirurgicos && (
              <div className="tab-historial__caja">
                <span className="tab-historial__caja-label">QUIRÚRGICOS</span>
                <p className="tab-historial__caja-texto">{antecedentesQuirurgicos}</p>
              </div>
            )}
          </div>
        </Seccion>
      )}

      {/* ── Antecedentes Gineco-obstétricos ── */}
      {hayGineco && (
        <Seccion titulo="Antecedentes Gineco-obstétricos" icono={<IconoGineco />}>
          <div className="tab-historial__datos-row">
            <DatoCard
              label="MENARCA"
              valor={ginecoObs!.menarcaEdad !== null ? `${ginecoObs!.menarcaEdad} años` : null}
            />
            <DatoCard
              label="FÓRMULA"
              valor={ginecoObs!.formulaObstetrica}
            />
            <DatoCard
              label="FUM"
              valor={ginecoObs!.ultimoPapFecha ? formatearFecha(ginecoObs!.ultimoPapFecha) : null}
            />
            <DatoCard
              label="G/P/C"
              valor={ginecoObs!.ultimoPapResultado}
            />
          </div>
        </Seccion>
      )}

      {/* ── Examen Físico & Vitales ── */}
      {hayExamen && (
        <Seccion titulo="Examen Físico & Vitales" icono={<IconoVitales />}>
          <div className="tab-historial__datos-row">
            <DatoCard
              label="TA"
              valor={examenFisico!.presionArterial ? `${examenFisico!.presionArterial} mmHg` : null}
            />
            <DatoCard
              label="PESO"
              valor={examenFisico!.pesoKg !== null ? `${examenFisico!.pesoKg} kg` : null}
            />
            <DatoCard
              label="TALLA"
              valor={examenFisico!.tallaM !== null ? `${examenFisico!.tallaM} m` : null}
            />
            <DatoCard
              label="IMC"
              valor={examenFisico!.imc !== null
                ? `${examenFisico!.imc} ${examenFisico!.imc < 18.5 ? '(B/P)' : examenFisico!.imc < 25 ? '(N)' : examenFisico!.imc < 30 ? '(S/P)' : '(OB)'}`
                : null}
            />
          </div>
          {examenFisico!.fecha && (
            <p className="tab-historial__fecha-examen">
              Registrado el {formatearFecha(examenFisico!.fecha)}
            </p>
          )}
        </Seccion>
      )}

      {/* ── Antecedentes Familiares ── */}
      {hayFamiliares && (
        <Seccion titulo="Antecedentes Familiares" icono={<IconoFamilia />}>
          <div className="tab-historial__caja">
            <p className="tab-historial__caja-texto">{heredofamiliares}</p>
          </div>
        </Seccion>
      )}

    </div>
  )
}

export default TabHistorial
