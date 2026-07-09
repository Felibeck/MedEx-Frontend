import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './components/web/sidebar'
import Agenda from './components/web/agenda'
import ConsultaWeb from './components/web/consulta'
import RegistroPacientes from './components/web/registroPacientes'
import type { medico } from './types/medico'
import type { turno } from './types/turno'
import type { paciente } from './types/paciente'
import type { consulta } from './types/consulta'
import { getUltimaNotaPorProfesional, postConsulta } from './api/consultas'
import './doctorHome.css'
import SearchBar from './components/web/searchBar'
import { getCurrentMedico } from './utils/session'

type EstadoGuardado = 'idle' | 'guardando' | 'ok' | 'error'

const DoctorHome = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeNav, setActiveNav] = useState(
    () => (location.state as { activeNav?: string } | null)?.activeNav ?? 'agenda'
  )
  const [medico, setMedico] = useState<medico | null>(null)
  const [turnoActivo, setTurnoActivo] = useState<turno | null>(null)
  const [pacienteBuscado, setPacienteBuscado] = useState<paciente | null>(null)
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>('idle')
  const [otrosConsulta, setOtrosConsulta] = useState('')
  const [ultimoMotivoConsulta, setUltimoMotivoConsulta] = useState('')
  const [motivoConsultaLoading, setMotivoConsultaLoading] = useState(false)

  const ejecutarGuardado = async (data: consulta) => {
    setEstadoGuardado('guardando')
    try {
      await postConsulta(data)
      setEstadoGuardado('ok')
    } catch {
      setEstadoGuardado('error')
    }
  }

  const cargarUltimoMotivo = async () => {
    if (!medico?.usuarioId) {
      setUltimoMotivoConsulta('')
      return
    }

    setMotivoConsultaLoading(true)
    try {
      const nota = await getUltimaNotaPorProfesional(medico.usuarioId)
      setUltimoMotivoConsulta(nota ?? '')
    } catch {
      setUltimoMotivoConsulta('')
    } finally {
      setMotivoConsultaLoading(false)
    }
  }

  useEffect(() => {
    if (pacienteBuscado) {
      cargarUltimoMotivo()
    } else {
      setUltimoMotivoConsulta('')
    }
  }, [pacienteBuscado])

  useEffect(() => {
    const current = getCurrentMedico()
    if (!current) {
      // No session — redirigir al login de doctores
      navigate('/doctors/login')
      return
    }
    setMedico(current)
  }, [navigate])

  if (medico === null) return null

  const handleFinalizar = (data: consulta) => {
    ejecutarGuardado(data)
  }

  const handleReintentar = () => {
    // Vuelve al formulario con los datos que el médico había cargado
    setEstadoGuardado('idle')
  }

  const handleAceptarOk = () => {
    setPacienteBuscado(null)
    setEstadoGuardado('idle')
    setOtrosConsulta('')
  }

  const handlePacienteEncontrado = (p: paciente) => {
    setPacienteBuscado(p)
    setEstadoGuardado('idle')
    setOtrosConsulta('')
    setActiveNav('agenda')
  }

  const handleSeleccionarTurno = (t: turno) => {
    if (pacienteBuscado) return
    setTurnoActivo(t)
  }

  const renderAreaConsulta = () => {
    if (!pacienteBuscado) {
      return (
        <div className="consulta-empty">
          <p>Busque un paciente por DNI para comenzar la consulta.</p>
        </div>
      )
    }

    if (estadoGuardado === 'guardando') {
      return (
        <div className="consulta-estado">
          <div className="consulta-estado__spinner" aria-label="Guardando consulta" />
          <p className="consulta-estado__texto">Guardando consulta...</p>
        </div>
      )
    }

    if (estadoGuardado === 'ok') {
      return (
        <div className="consulta-estado consulta-estado--ok">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="#1f6f6b" />
            <path d="M7 12l4 4 6-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="consulta-estado__texto">Consulta creada correctamente</p>
          <button
            type="button"
            className="consulta-btn consulta-btn--primary"
            onClick={handleAceptarOk}
          >
            Aceptar
          </button>
        </div>
      )
    }

    if (estadoGuardado === 'error') {
      return (
        <div className="consulta-estado consulta-estado--error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="#e55353" />
            <path d="M12 7v5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1.2" fill="#fff" />
          </svg>
          <p className="consulta-estado__texto">Hubo un error al guardar la consulta</p>
          <button
            type="button"
            className="consulta-btn consulta-btn--primary"
            onClick={handleReintentar}
          >
            Volver al formulario
          </button>
        </div>
      )
    }

    // idle — mostrar formulario
    return (
      <ConsultaWeb
        key={pacienteBuscado.paciente_id}
        paciente={pacienteBuscado}
        profesionalId={medico.usuarioId}
        organizacionId={medico.organizacionId}
        otros={otrosConsulta}
        onOtrosChange={setOtrosConsulta}
        antecedentes=""
        motivoConsultaPrevia={motivoConsultaLoading ? 'Cargando...' : ultimoMotivoConsulta}
        notaConsultaPrevia=""
        onFinalizar={handleFinalizar}
        onVerHistorial={() => console.log('Ver historial:', pacienteBuscado.paciente_id)}
      />
    )
  }

  return (
    <div className="doctor-layout">
      <Sidebar
        medico={medico}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onChatbot={() => console.log('Abrir chatbot')}
        onCerrarSesion={() => navigate('/')}
      />

      <div className="doctor-main">
        <header className="doctor-topbar">
          <div className="doctor-search-wrap">
            <SearchBar onPacienteEncontrado={handlePacienteEncontrado} />
          </div>
        </header>

        <div className="doctor-content">
          {activeNav === 'pacientes' ? (
            <RegistroPacientes onVerDetalle={(pacienteId) => navigate(`/doctor/pacientes/${pacienteId}`)} />
          ) : (
            <>
              <Agenda
                turnos={[]}
                turnoActivoId={turnoActivo?.id}
                onSeleccionar={handleSeleccionarTurno}
              />

              {renderAreaConsulta()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorHome
