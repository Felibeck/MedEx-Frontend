import { useEffect, useMemo, useState } from 'react'
import type { pacienteResumen } from '../../../types/pacienteResumen'
import { getMisPacientes } from '../../../api/doctors'
import { calcularEdad, esEstadoAlerta, formatearFecha, getCoberturaBadge } from '../../../utils/paciente'
import './registroPacientes.css'

const PAGE_SIZE = 5

type Props = {
  onVerDetalle: (pacienteId: string) => void
}

const PacienteAvatar = ({ paciente }: { paciente: pacienteResumen }) => {
  const alerta = esEstadoAlerta(paciente.cobertura_estado)
  return (
    <div className={`registro-pacientes__avatar${alerta ? ' registro-pacientes__avatar--alerta' : ''}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" />
        <path d="M12 13.6c-4.8 0-8.4 2.4-8.4 5.4v1.2h16.8V19c0-3-3.6-5.4-8.4-5.4z" />
      </svg>
    </div>
  )
}

const RegistroPacientes = ({ onVerDetalle }: Props) => {
  const [pacientes, setPacientes] = useState<pacienteResumen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    let cancelado = false

    const cargar = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getMisPacientes()
        if (!cancelado) setPacientes(data)
      } catch {
        if (!cancelado) setError('No se pudo cargar el listado de pacientes.')
      } finally {
        if (!cancelado) setLoading(false)
      }
    }

    cargar()
    return () => {
      cancelado = true
    }
  }, [])

  const totalPaginas = Math.max(1, Math.ceil(pacientes.length / PAGE_SIZE))

  const pacientesPagina = useMemo(() => {
    const inicio = (pagina - 1) * PAGE_SIZE
    return pacientes.slice(inicio, inicio + PAGE_SIZE)
  }, [pacientes, pagina])

  const rangoInicio = pacientes.length === 0 ? 0 : (pagina - 1) * PAGE_SIZE + 1
  const rangoFin = Math.min(pagina * PAGE_SIZE, pacientes.length)

  const numerosPagina = useMemo(() => {
    if (totalPaginas <= 5) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1)
    }
    const paginas: (number | 'ellipsis')[] = [1, 2, 3, 'ellipsis', totalPaginas]
    return paginas
  }, [totalPaginas])

  return (
    <div className="registro-pacientes">
      <div className="registro-pacientes__header">
        <div>
          <h2 className="registro-pacientes__titulo">Registro de Pacientes</h2>
          <p className="registro-pacientes__subtitulo">Gestiona y consulta el historial clínico de tu base de pacientes.</p>
        </div>
        <div className="registro-pacientes__acciones">
          <button type="button" className="registro-pacientes__btn-secundario" disabled title="Función no disponible aún">
            <svg width="18" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filtros
          </button>
          <button type="button" className="registro-pacientes__btn-secundario" disabled title="Función no disponible aún">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar
          </button>
        </div>
      </div>

      {loading && <p className="registro-pacientes__estado">Cargando pacientes...</p>}
      {error && <p className="registro-pacientes__estado registro-pacientes__estado--error">{error}</p>}
      {!loading && !error && pacientes.length === 0 && (
        <p className="registro-pacientes__estado">Todavía no tenés pacientes con alguna consulta registrada.</p>
      )}

      {!loading && !error && pacientes.length > 0 && (
        <>
          <div className="registro-pacientes__lista">
            {pacientesPagina.map((paciente) => {
              const badge = getCoberturaBadge(paciente.cobertura_estado)
              const alerta = esEstadoAlerta(paciente.cobertura_estado)
              const edad = calcularEdad(paciente.fecha_nacimiento)
              const ultimaConsulta = formatearFecha(paciente.ultima_consulta)

              return (
                <div
                  key={paciente.paciente_id}
                  className={`registro-pacientes__card${alerta ? ' registro-pacientes__card--alerta' : ''}`}
                >
                  <PacienteAvatar paciente={paciente} />

                  <div className="registro-pacientes__info">
                    <div className="registro-pacientes__info-top">
                      <h3 className="registro-pacientes__nombre">
                        {paciente.nombre} {paciente.apellido}
                      </h3>
                      {badge && (
                        <span
                          className="registro-pacientes__badge"
                          style={{ color: badge.color, background: `${badge.color}1f` }}
                        >
                          {badge.label}
                        </span>
                      )}
                    </div>

                    <div className="registro-pacientes__campos">
                      <div className="registro-pacientes__campo">
                        <span>DNI:</span>
                        <span>{paciente.dni || '—'}</span>
                      </div>
                      <div className="registro-pacientes__campo">
                        <span>Edad:</span>
                        <span>{edad !== null ? `${edad} años` : '—'}</span>
                      </div>
                      <div className="registro-pacientes__campo">
                        <span>OS:</span>
                        <span>{paciente.obra_social || '—'}</span>
                      </div>
                      <div className="registro-pacientes__campo">
                        <span>Última consulta:</span>
                        <span>{ultimaConsulta || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="registro-pacientes__btn-detalle"
                    onClick={() => onVerDetalle(paciente.paciente_id)}
                  >
                    <svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    Ver Detalle
                  </button>
                </div>
              )
            })}
          </div>

          <div className="registro-pacientes__paginacion">
            <span className="registro-pacientes__paginacion-info">
              Mostrando {rangoInicio}-{rangoFin} de {pacientes.length} pacientes
            </span>

            <div className="registro-pacientes__paginacion-controles">
              <button
                type="button"
                className="registro-pacientes__pagina-btn"
                disabled={pagina === 1}
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                aria-label="Página anterior"
              >
                <svg width="7" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {numerosPagina.map((n, i) =>
                n === 'ellipsis' ? (
                  <span key={`ellipsis-${i}`} className="registro-pacientes__pagina-ellipsis">...</span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    className={`registro-pacientes__pagina-btn${pagina === n ? ' registro-pacientes__pagina-btn--activo' : ''}`}
                    onClick={() => setPagina(n)}
                  >
                    {n}
                  </button>
                )
              )}

              <button
                type="button"
                className="registro-pacientes__pagina-btn"
                disabled={pagina === totalPaginas}
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                aria-label="Página siguiente"
              >
                <svg width="7" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RegistroPacientes
