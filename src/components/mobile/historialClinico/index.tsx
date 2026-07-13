import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  IdentificationIcon,
  CalendarIcon,
  UserIcon,
  InformationCircleIcon,
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

  const gineco = paciente.ginecoObstetrico

  const construirTexto = (valores: Array<string | null | undefined>): string =>
    valores
      .map((valor) => valor?.trim())
      .filter((valor): valor is string => Boolean(valor))
      .join('\n\n')

  const getTextoHistorial = (keys: string[]): string | null => {
    const fuentes = [historial, historial.historial ?? null]

    for (const fuente of fuentes) {
      if (!fuente) continue

      for (const key of keys) {
        const valor = fuente[key as keyof typeof fuente]
        if (typeof valor === 'string' && valor.trim()) {
          return valor.trim()
        }
      }
    }

    return null
  }

  const textoAnt = construirTexto([
    getTextoHistorial(['ant', 'antecedentes', 'antecedentes_personales']),
  ])

  const textoAgo = construirTexto([
    getTextoHistorial(['ago', 'gineco_obstetrico', 'antecedentes_gineco_obstetricos']),
    gineco
      ? [
          gineco.menarcaEdad !== null ? `Menarca: ${gineco.menarcaEdad} años` : null,
          gineco.formulaObstetrica ? `Fórmula: ${gineco.formulaObstetrica}` : null,
          gineco.ultimoPapFecha
            ? `Último PAP: ${formatearFecha(gineco.ultimoPapFecha)}${gineco.ultimoPapResultado ? ` (${gineco.ultimoPapResultado})` : ''}`
            : null,
        ]
          .filter((valor): valor is string => Boolean(valor))
          .join('\n')
      : null,
  ])

  const textoAhf = construirTexto([
    getTextoHistorial(['ahf', 'heredofamiliares', 'antecedentes_familiares']),
    paciente.heredofamiliares ?? null,
  ])

  const textoMx = construirTexto([getTextoHistorial(['mx', 'mamografia'])])
  const textoEco = construirTexto([getTextoHistorial(['eco', 'ecografia'])])
  const textoEf = construirTexto([
    getTextoHistorial(['ef', 'examen_fisico']),
    historial.examenFisico
      ? [
          historial.examenFisico.presionArterial ? `TA: ${historial.examenFisico.presionArterial}` : null,
          historial.examenFisico.pesoKg !== null ? `Peso: ${historial.examenFisico.pesoKg} kg` : null,
          historial.examenFisico.tallaM !== null ? `Talla: ${historial.examenFisico.tallaM} m` : null,
          historial.examenFisico.imc !== null ? `IMC: ${historial.examenFisico.imc}` : null,
        ]
          .filter((valor): valor is string => Boolean(valor))
          .join('\n')
      : null,
  ])
  const textoOtros = construirTexto([getTextoHistorial(['otros', 'otros_antecedentes'])])

  const secciones = [
    {
      titulo: 'Antecedentes personales (médicos y clínicos)',
      icono: <ClipboardDocumentCheckIcon24 className="historial-clinico__card-icono" />,
      valor: textoAnt,
    },
    {
      titulo: 'Antecedentes gineco-obstétricos',
      icono: <IconoVenus />,
      valor: textoAgo,
    },
    {
      titulo: 'Antecedentes heredofamiliares / antecedentes familiares',
      icono: <UsersIcon24 className="historial-clinico__card-icono" />,
      valor: textoAhf,
    },
    {
      titulo: 'Mamografía',
      icono: <HeartIcon24 className="historial-clinico__card-icono" />,
      valor: textoMx,
    },
    {
      titulo: 'Ecografía',
      icono: <DocumentChartBarIcon24 className="historial-clinico__card-icono" />,
      valor: textoEco,
    },
    {
      titulo: 'Examen físico',
      icono: <HeartIcon24 className="historial-clinico__card-icono" />,
      valor: textoEf,
    },
    {
      titulo: 'Otros antecedentes o información relevante',
      icono: <InformationCircleIcon className="historial-clinico__card-icono" />,
      valor: textoOtros,
    },
  ].filter((seccion) => seccion.valor.trim().length > 0)

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

      {secciones.map((seccion) => (
        <section key={seccion.titulo} className="historial-clinico__card">
          <div className="historial-clinico__card-titulo">
            {seccion.icono}
            <h3>{seccion.titulo}</h3>
          </div>
          <p className="historial-clinico__parrafo">{seccion.valor}</p>
        </section>
      ))}

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
    </>
  )
}

export default HistorialClinico
