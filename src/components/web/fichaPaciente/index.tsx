import { useEffect, useState } from 'react'
import type { historialClinico, consultaHistorial } from '../../../types/historialClinico'
import type { estudioResumen } from '../../../types/estudio'
import { getHistorialClinico } from '../../../api/doctors'
import { fetchEstudiosPaciente } from '../../../api/estudios'
import { calcularEdad, formatearFecha, gruposCompatibles } from '../../../utils/paciente'
import TabHistorial from './TabHistorial'
import './fichaPaciente.css'

type Props = {
  pacienteId: string
}

type Tab = 'consultas' | 'estudios' | 'historial'

const IconoFallback = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" />
    <path d="M12 13.6c-4.8 0-8.4 2.4-8.4 5.4v1.2h16.8V19c0-3-3.6-5.4-8.4-5.4z" />
  </svg>
)

const nombreProfesional = (consulta: consultaHistorial) => {
  const usuario = consulta.profesional?.usuario
  if (!usuario) return 'Profesional sin asignar'
  return `${usuario.nombre} ${usuario.apellido}`
}

const FichaPaciente = ({ pacienteId }: Props) => {
  const [historial, setHistorial] = useState<historialClinico | null>(null)
  const [estudios, setEstudios] = useState<estudioResumen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('consultas')
  const [consultaActivaId, setConsultaActivaId] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    const cargar = async () => {
      setLoading(true)
      setError(null)
      try {
        const [historialData, estudiosData] = await Promise.all([
          getHistorialClinico(pacienteId),
          fetchEstudiosPaciente(pacienteId).catch(() => []),
        ])
        if (cancelado) return
        setHistorial(historialData)
        setEstudios(estudiosData)
        setConsultaActivaId(historialData.consultas[0]?.id ?? null)
      } catch {
        if (!cancelado) setError('No se pudo cargar la ficha del paciente.')
      } finally {
        if (!cancelado) setLoading(false)
      }
    }

    cargar()
    return () => {
      cancelado = true
    }
  }, [pacienteId])

  if (loading) {
    return <p className="ficha-paciente__estado">Cargando ficha del paciente...</p>
  }

  if (error || !historial || !historial.paciente) {
    return <p className="ficha-paciente__estado ficha-paciente__estado--error">{error || 'Paciente no encontrado.'}</p>
  }

  const { paciente, alergias, condicionesCronicas, consultas } = historial
  const edad = calcularEdad(paciente.fecha_nacimiento)
  const fechaNacimiento = formatearFecha(paciente.fecha_nacimiento)
  const compatibles = gruposCompatibles(paciente.grupo_sanguineo)
  const ultimoControl = consultas[0] ? formatearFecha(consultas[0].fecha) : null
  const consultaActiva = consultas.find((c) => c.id === consultaActivaId) ?? consultas[0] ?? null

  return (
    <div className="ficha-paciente">
      <div className="ficha-paciente__header">
        <div className="ficha-paciente__identidad">
          <div className="ficha-paciente__avatar">
            {paciente.foto_perfil ? <img src={paciente.foto_perfil} alt={paciente.nombre ?? ''} /> : <IconoFallback />}
          </div>
          <div>
            <h2 className="ficha-paciente__nombre">{paciente.nombre} {paciente.apellido}</h2>
            <div className="ficha-paciente__meta">
              {edad !== null && <span>{edad} años{fechaNacimiento ? ` (${fechaNacimiento})` : ''}</span>}
              <span className="ficha-paciente__meta-dot">·</span>
              <span>DNI {paciente.dni}</span>
            </div>
          </div>
        </div>
        <button type="button" className="ficha-paciente__btn-imprimir" disabled title="Función no disponible aún">
          <svg width="18" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimir Ficha
        </button>
      </div>

      <div className="ficha-paciente__vitales">
        <div className="ficha-paciente__card ficha-paciente__card--alergias">
          <div className="ficha-paciente__card-titulo">
            <h3>Alergias</h3>
            <svg width="20" height="18" viewBox="0 0 24 24" fill="none" stroke="#ba1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          {alergias.length > 0 ? (
            <ul className="ficha-paciente__lista-puntos">
              {alergias.map((a) => (
                <li key={a.id}><span className="ficha-paciente__punto ficha-paciente__punto--rojo" />{a.nombre}</li>
              ))}
            </ul>
          ) : (
            <p className="ficha-paciente__vacio">Sin alergias registradas.</p>
          )}
        </div>

        <div className="ficha-paciente__card ficha-paciente__card--sangre">
          <div className="ficha-paciente__card-titulo">
            <h3>Grupo Sanguíneo</h3>
            <svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69s-7 7.44-7 11.31a7 7 0 0 0 14 0c0-3.87-7-11.31-7-11.31z" />
            </svg>
          </div>
          {paciente.grupo_sanguineo ? (
            <div className="ficha-paciente__sangre">
              <span className="ficha-paciente__sangre-tipo">{paciente.grupo_sanguineo}</span>
              {compatibles && (
                <span className="ficha-paciente__sangre-compat">Compatible con {compatibles.join(', ')}</span>
              )}
            </div>
          ) : (
            <p className="ficha-paciente__vacio">Sin dato de grupo sanguíneo.</p>
          )}
        </div>

        <div className="ficha-paciente__card ficha-paciente__card--condiciones">
          <div className="ficha-paciente__card-titulo">
            <h3>Condiciones Crónicas</h3>
            <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="#00665f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          {condicionesCronicas.length > 0 ? (
            <div className="ficha-paciente__chips">
              {condicionesCronicas.map((c) => (
                <span key={c.id} className="ficha-paciente__chip">{c.nombre}</span>
              ))}
            </div>
          ) : (
            <p className="ficha-paciente__vacio">Sin condiciones registradas.</p>
          )}
          {ultimoControl && <p className="ficha-paciente__ultimo-control">Último control: {ultimoControl}</p>}
        </div>
      </div>

      <div className="ficha-paciente__tabs">
        <button
          type="button"
          className={`ficha-paciente__tab${tab === 'consultas' ? ' ficha-paciente__tab--activo' : ''}`}
          onClick={() => setTab('consultas')}
        >
          Consultas
        </button>
        <button
          type="button"
          className={`ficha-paciente__tab${tab === 'estudios' ? ' ficha-paciente__tab--activo' : ''}`}
          onClick={() => setTab('estudios')}
        >
          Estudios
        </button>
        <button
          type="button"
          className={`ficha-paciente__tab${tab === 'historial' ? ' ficha-paciente__tab--activo' : ''}`}
          onClick={() => setTab('historial')}
        >
          Historial
        </button>
      </div>

      {tab === 'consultas' ? (
        consultas.length === 0 ? (
          <p className="ficha-paciente__vacio">Este paciente todavía no tiene consultas registradas.</p>
        ) : (
          <div className="ficha-paciente__split">
            <div className="ficha-paciente__lista-consultas">
              {consultas.map((consulta, i) => {
                const activa = consulta.id === consultaActiva?.id
                return (
                  <button
                    type="button"
                    key={consulta.id}
                    className={`ficha-paciente__consulta-card${activa ? ' ficha-paciente__consulta-card--activa' : ''}`}
                    onClick={() => setConsultaActivaId(consulta.id)}
                  >
                    <div className="ficha-paciente__consulta-card-top">
                      <span>{formatearFecha(consulta.fecha)}</span>
                      {i === 0 && <span className="ficha-paciente__pill-reciente">RECIENTE</span>}
                    </div>
                    <p className="ficha-paciente__consulta-especialidad">
                      {consulta.profesional?.especialidad_medica || 'Consulta general'}
                    </p>
                    <p className="ficha-paciente__consulta-profesional">{nombreProfesional(consulta)}</p>
                  </button>
                )
              })}
            </div>

            {consultaActiva && (
              <div className="ficha-paciente__detalle-panel">
                <div className="ficha-paciente__detalle-header">
                  <div>
                    <h3>Detalle de Consulta: {consultaActiva.profesional?.especialidad_medica || 'General'}</h3>
                    <p>{formatearFecha(consultaActiva.fecha)}</p>
                  </div>
                  <div className="ficha-paciente__detalle-estado">
                    <span className="ficha-paciente__pill-finalizada">Estado: Finalizada</span>
                    {consultaActiva.organizacion?.nombre && <p>Sede: {consultaActiva.organizacion.nombre}</p>}
                  </div>
                </div>

                <div className="ficha-paciente__detalle-body">
                  <section className="ficha-paciente__seccion">
                    <h4>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <path d="m9 14 2 2 4-4" />
                      </svg>
                      Diagnóstico Principal
                    </h4>
                    <div className="ficha-paciente__caja">
                      <p>{consultaActiva.diagnostico || 'Sin diagnóstico registrado.'}</p>
                    </div>
                  </section>

                  <section className="ficha-paciente__seccion">
                    <h4>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <path d="m9 14 2 2 4-4" />
                      </svg>
                      Notas
                    </h4>
                    <div className="ficha-paciente__caja">
                      <p>{consultaActiva.notas || 'Sin notas registradas.'}</p>
                    </div>
                  </section>

                  <section className="ficha-paciente__seccion">
                    <h4>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7Z" />
                        <path d="m8.5 8.5 7 7" />
                      </svg>
                      Prescripciones
                    </h4>
                    {(consultaActiva.prescripciones ?? []).length > 0 ? (
                      <div className="ficha-paciente__prescripciones">
                        {(consultaActiva.prescripciones ?? []).map((p) => (
                          <div key={p.id} className="ficha-paciente__prescripcion">
                            <div className="ficha-paciente__prescripcion-icono">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e3fffc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7Z" />
                                <path d="m8.5 8.5 7 7" />
                              </svg>
                            </div>
                            <div>
                              <p className="ficha-paciente__prescripcion-nombre">{p.medicamento}</p>
                              {p.indicaciones && <p className="ficha-paciente__prescripcion-indicaciones">{p.indicaciones}</p>}
                            </div>
                            <span className="ficha-paciente__prescripcion-estado">{p.activa ? 'Receta Activa' : 'Inactiva'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="ficha-paciente__vacio">Sin prescripciones registradas.</p>
                    )}
                  </section>

                  <section className="ficha-paciente__seccion">
                    <h4>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      Adjuntos
                    </h4>
                    {(consultaActiva.adjuntos ?? []).length > 0 ? (
                      <div className="ficha-paciente__adjuntos">
                        {(consultaActiva.adjuntos ?? []).map((a) => (
                          <a key={a.id} href={a.url_archivo ?? '#'} target="_blank" rel="noreferrer" className="ficha-paciente__adjunto">
                            <svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="#131d1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            {a.nombre_archivo || 'Archivo adjunto'}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="ficha-paciente__vacio">Sin adjuntos.</p>
                    )}
                  </section>
                </div>
              </div>
            )}
          </div>
        )
      ) : tab === 'estudios' ? (
        <div className="ficha-paciente__estudios">
          {estudios.length === 0 ? (
            <p className="ficha-paciente__vacio">Este paciente todavía no tiene estudios registrados.</p>
          ) : (
            estudios.map((e) => (
              <div key={e.id} className="ficha-paciente__estudio-card">
                <p className="ficha-paciente__estudio-tipo">{e.tipoEstudio}</p>
                <p className="ficha-paciente__estudio-meta">{formatearFecha(e.fecha.toISOString())} · {e.institucion}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <TabHistorial
          pacienteId={pacienteId}
          historial={historial}
          onHistorialActualizado={(nuevoHistorial) =>
            setHistorial((prev) => prev ? { ...prev, historial: nuevoHistorial } : prev)
          }
        />
      )}
    </div>
  )
}

export default FichaPaciente
