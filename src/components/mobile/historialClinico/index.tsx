import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  IdentificationIcon,
  CalendarIcon,
  UserIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/16/solid'
import {
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIcon24,
  UsersIcon as UsersIcon24,
  DocumentChartBarIcon as DocumentChartBarIcon24,
  DocumentMagnifyingGlassIcon as DocumentMagnifyingGlassIcon24,
  HeartIcon as HeartIcon24,
} from '@heroicons/react/24/solid'
import MobileHeader from '../mobileHeader'
import BottomNavBar from '../bottomNavBar'
import { getMiHistorialClinico } from '../../../api/historialPaciente'
import { getPacienteId } from '../../../config/constants'
import { calcularEdad, formatearFecha } from '../../../utils/paciente'
import type { historialClinicoPaciente } from '../../../types/historialClinicoPaciente'
import './historialClinico.css'

const IconoAvatarFallback = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" />
    <path d="M12 13.6c-4.8 0-8.4 2.4-8.4 5.4v1.2h16.8V19c0-3-3.6-5.4-8.4-5.4z" />
  </svg>
)

const IconoVenus = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006562" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="6" />
    <path d="M12 15v7" />
    <path d="M9 19h6" />
  </svg>
)

// Separa un bloque de texto libre en líneas — soporta '\n' o ';' como
// delimitador. Si no encuentra ninguno, devuelve un único elemento (el
// bloque completo) para que se renderice como párrafo simple.
const partirEnLineas = (texto: string): string[] => {
  const porSalto = texto.split('\n').map((l) => l.trim()).filter(Boolean)
  if (porSalto.length > 1) return porSalto
  const porPuntoYComa = texto.split(';').map((l) => l.trim()).filter(Boolean)
  if (porPuntoYComa.length > 1) return porPuntoYComa
  return [texto.trim()]
}

const HistorialClinico = () => {
  const [historial, setHistorial] = useState<historialClinicoPaciente | null>(null)
  const [loading, setLoading] = useState(() => !!getPacienteId())
  const [error, setError] = useState<string | null>(() =>
    getPacienteId() ? null : 'No se encontró la sesión del paciente'
  )

  useEffect(() => {
    if (!getPacienteId()) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getMiHistorialClinico()
        if (!cancelled) setHistorial(data)
      } catch (err: unknown) {
        if (!cancelled) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message ?? err.message)
          } else if (err instanceof Error) {
            setError(err.message)
          } else {
            setError('No se pudo cargar el historial clínico')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => { cancelled = true }
  }, [])

  return (
    <div className="historial-clinico-page">
      <MobileHeader />

      <div className="historial-clinico__content">
        {loading && <p className="historial-clinico__estado">Cargando historial clínico...</p>}
        {error && <p className="historial-clinico__estado historial-clinico__estado--error">{error}</p>}

        {!loading && !error && historial && !historial.paciente && (
          <p className="historial-clinico__estado">No se encontró información del paciente.</p>
        )}

        {!loading && !error && historial?.paciente && (
          <HistorialClinicoContenido historial={historial} />
        )}
      </div>

      <BottomNavBar />
    </div>
  )
}

const HistorialClinicoContenido = ({ historial }: { historial: historialClinicoPaciente }) => {
  const paciente = historial.paciente!
  const edad = calcularEdad(paciente.fecha_nacimiento)

  const patologicos = [
    ...historial.antecedentesPatologicos.map((a) => a.nombre),
    ...historial.condicionesCronicas.map((c) => c.nombre),
  ]
  const alergias = historial.alergias.map((a) => a.nombre)

  const gineco = paciente.ginecoObstetrico
  const ginecoTieneDatos =
    !!gineco && (gineco.menarcaEdad !== null || gineco.formulaObstetrica !== null || gineco.ultimoPapFecha !== null || gineco.ultimoPapResultado !== null)

  const heredoLineas = paciente.heredofamiliares ? partirEnLineas(paciente.heredofamiliares) : []
  const heredoEsLista = heredoLineas.length > 1

  return (
    <>
      <div className="historial-clinico__titulo-wrap">
        <h1 className="historial-clinico__titulo">Historial Clínico Detallado</h1>
        <p className="historial-clinico__subtitulo">Consulta tu trayectoria de salud de forma clara y profesional.</p>
      </div>

      <div className="historial-clinico__identidad">
        <div className="historial-clinico__avatar">
          {paciente.foto_perfil ? <img src={paciente.foto_perfil} alt={paciente.nombre ?? ''} /> : <IconoAvatarFallback />}
        </div>
        <div>
          <h2 className="historial-clinico__nombre">{paciente.nombre} {paciente.apellido}</h2>
          <div className="historial-clinico__meta">
            <div className="historial-clinico__meta-row">
              <IdentificationIcon className="historial-clinico__meta-icon" />
              <span>DNI {paciente.dni}</span>
            </div>
            {edad !== null && (
              <div className="historial-clinico__meta-row">
                <CalendarIcon className="historial-clinico__meta-icon" />
                <span>{edad} años</span>
              </div>
            )}
            {paciente.identidad_genero && (
              <div className="historial-clinico__meta-row">
                <UserIcon className="historial-clinico__meta-icon" />
                <span>Identidad {paciente.identidad_genero}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Antecedentes Médicos ── */}
      <section className="historial-clinico__card">
        <div className="historial-clinico__card-titulo">
          <ClipboardDocumentCheckIcon24 className="historial-clinico__card-icono" />
          <h3>Antecedentes Médicos</h3>
        </div>

        <div className="historial-clinico__pill">
          <InformationCircleIcon className="historial-clinico__pill-icono" />
          <div>
            <p className="historial-clinico__pill-label">Patológicos</p>
            {patologicos.length > 0 ? (
              patologicos.map((p, i) => <p key={i} className="historial-clinico__pill-detalle">{p}</p>)
            ) : (
              <p className="historial-clinico__pill-detalle">Sin antecedentes patológicos registrados.</p>
            )}
          </div>
        </div>

        <div className="historial-clinico__pill historial-clinico__pill--alerta">
          <ExclamationTriangleIcon className="historial-clinico__pill-icono historial-clinico__pill-icono--alerta" />
          <div>
            <p className="historial-clinico__pill-label historial-clinico__pill-label--alerta">Alergias</p>
            {alergias.length > 0 ? (
              alergias.map((a, i) => <p key={i} className="historial-clinico__pill-detalle">{a}</p>)
            ) : (
              <p className="historial-clinico__pill-detalle">Sin alergias registradas.</p>
            )}
          </div>
        </div>

        <div className="historial-clinico__pill">
          <InformationCircleIcon className="historial-clinico__pill-icono" />
          <div>
            <p className="historial-clinico__pill-label">Quirúrgicos</p>
            <p className="historial-clinico__pill-detalle">
              {paciente.antecedentesQuirurgicos || 'Sin antecedentes quirúrgicos registrados.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Gineco-obstétricos ── */}
      <section className="historial-clinico__card">
        <div className="historial-clinico__card-titulo">
          <IconoVenus />
          <h3>Gineco-obstétricos</h3>
        </div>

        {ginecoTieneDatos && gineco ? (
          <div className="historial-clinico__filas">
            <div className="historial-clinico__fila">
              <span className="historial-clinico__fila-label">Menarca</span>
              <span className="historial-clinico__fila-valor">{gineco.menarcaEdad !== null ? `${gineco.menarcaEdad} años` : 'No registrado'}</span>
            </div>
            <div className="historial-clinico__fila">
              <span className="historial-clinico__fila-label">Fórmula</span>
              <span className="historial-clinico__fila-valor">{gineco.formulaObstetrica ?? 'No registrado'}</span>
            </div>
            <div className="historial-clinico__fila">
              <span className="historial-clinico__fila-label">Último PAP</span>
              <span className="historial-clinico__fila-valor">
                {gineco.ultimoPapFecha
                  ? `${formatearFecha(gineco.ultimoPapFecha)}${gineco.ultimoPapResultado ? ` (${gineco.ultimoPapResultado})` : ''}`
                  : 'No registrado'}
              </span>
            </div>
          </div>
        ) : (
          <p className="historial-clinico__vacio">Sin datos gineco-obstétricos registrados.</p>
        )}
      </section>

      {/* ── Heredofamiliares ── */}
      <section className="historial-clinico__card">
        <div className="historial-clinico__card-titulo">
          <UsersIcon24 className="historial-clinico__card-icono" />
          <h3>Heredofamiliares</h3>
        </div>

        {heredoLineas.length === 0 && (
          <p className="historial-clinico__vacio">Sin antecedentes heredofamiliares registrados.</p>
        )}

        {heredoLineas.length > 0 && heredoEsLista && (
          <ul className="historial-clinico__lista-puntos">
            {heredoLineas.map((linea, i) => {
              const idxDosPuntos = linea.indexOf(':')
              return (
                <li key={i}>
                  <span className="historial-clinico__punto" />
                  {idxDosPuntos > -1 ? (
                    <span>
                      <strong>{linea.slice(0, idxDosPuntos + 1)}</strong>{linea.slice(idxDosPuntos + 1)}
                    </span>
                  ) : (
                    <span>{linea}</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {heredoLineas.length > 0 && !heredoEsLista && (
          <p className="historial-clinico__parrafo">{heredoLineas[0]}</p>
        )}
      </section>

      {/* ── Estudios Recientes ── */}
      <div className="historial-clinico__seccion-heading">
        <DocumentChartBarIcon24 className="historial-clinico__seccion-icono" />
        <h3>Estudios Recientes</h3>
      </div>

      {historial.estudios.length === 0 && (
        <p className="historial-clinico__vacio">No hay estudios registrados.</p>
      )}

      {historial.estudios.map((estudio) => (
        <section key={estudio.id} className="historial-clinico__card historial-clinico__card--estudio">
          <div className="historial-clinico__card-titulo">
            <span className="historial-clinico__icono-caja">
              <DocumentMagnifyingGlassIcon24 className="historial-clinico__card-icono" />
            </span>
            <h3>{estudio.tipo_estudio ?? 'Estudio'}</h3>
          </div>
          <ul className="historial-clinico__lista-puntos">
            <li>
              <span className="historial-clinico__punto" />
              <span>Fecha: {formatearFecha(estudio.fecha)}</span>
            </li>
            {estudio.descripcion && (
              <li>
                <span className="historial-clinico__punto" />
                <span>Resultado: {estudio.descripcion}</span>
              </li>
            )}
          </ul>
        </section>
      ))}

      {/* ── Examen Físico ── */}
      <section className="historial-clinico__card">
        <div className="historial-clinico__card-titulo">
          <HeartIcon24 className="historial-clinico__card-icono" />
          <h3>Examen Físico</h3>
        </div>

        {historial.examenFisico ? (
          <div className="historial-clinico__tiles">
            <div className="historial-clinico__tile">
              <span className="historial-clinico__tile-label">TA</span>
              <span className="historial-clinico__tile-valor">{historial.examenFisico.presionArterial ?? '—'}</span>
              <span className="historial-clinico__tile-unidad">mmHg</span>
            </div>
            <div className="historial-clinico__tile">
              <span className="historial-clinico__tile-label">Peso</span>
              <span className="historial-clinico__tile-valor">{historial.examenFisico.pesoKg ?? '—'}</span>
              <span className="historial-clinico__tile-unidad">kg</span>
            </div>
            <div className="historial-clinico__tile">
              <span className="historial-clinico__tile-label">Talla</span>
              <span className="historial-clinico__tile-valor">{historial.examenFisico.tallaM ?? '—'}</span>
              <span className="historial-clinico__tile-unidad">m</span>
            </div>
            <div className="historial-clinico__tile">
              <span className="historial-clinico__tile-label">IMC</span>
              <span className="historial-clinico__tile-valor">{historial.examenFisico.imc ?? '—'}</span>
              <span className="historial-clinico__tile-unidad">kg/m²</span>
            </div>
          </div>
        ) : (
          <p className="historial-clinico__vacio">Sin examen físico registrado aún.</p>
        )}
      </section>
    </>
  )
}

export default HistorialClinico
