import { useState } from 'react'
import Sidebar from './components/web/sidebar'
import Agenda from './components/web/agenda'
import ConsultaWeb from './components/web/consulta'
import type { medico } from './types/medico'
import type { turno } from './types/turno'
import type { paciente } from './types/paciente'
import type { consulta } from './types/consulta'
import { postConsulta } from './api/consultas'
import './doctorHome.css'
import SearchBar from './components/web/searchBar'

const MOCK_MEDICO: medico = {
  id: 1,
  nombre: 'Dr. Julian',
  apellido: 'Rivera',
  email: 'julian@medex.com',
  password: '',
  esMedico: true,
  usuarioId: '7c4f0c93-2b4c-4c79-a5f6-1e8d4f6a9d21',
  organizacionId: '02e27451-a22b-40ae-b080-9f924b861495',
  matricula: '12345',
  especialidad: 'Cirujano',
  fotoPerfil: '',
}

const DoctorHome = () => {
  const [activeNav, setActiveNav] = useState('agenda')
  const [turnoActivo, setTurnoActivo] = useState<turno | null>(null)
  const [pacienteBuscado, setPacienteBuscado] = useState<paciente | null>(null)
  const [guardadoMsg, setGuardadoMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  const handleGuardar = async (data: consulta) => {
    setGuardadoMsg(null)
    try {
      await postConsulta(data)
      setGuardadoMsg({ tipo: 'ok', texto: 'Consulta guardada correctamente.' })
    } catch {
      setGuardadoMsg({ tipo: 'error', texto: 'Error al guardar la consulta. Intente nuevamente.' })
    }
  }

  const handlePacienteEncontrado = (p: paciente) => {
    setPacienteBuscado(p)
    setGuardadoMsg(null)
    setActiveNav('agenda')
  }

  const handleSeleccionarTurno = (turno: turno) => {
    // Si hay una consulta activa por búsqueda de DNI, ignorar el click
    if (pacienteBuscado) return
    setTurnoActivo(turno)
  }

  return (
    <div className="doctor-layout">
      <Sidebar
        medico={MOCK_MEDICO}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onChatbot={() => console.log('Abrir chatbot')}
        onCerrarSesion={() => console.log('Cerrar sesión')}
      />

      <div className="doctor-main">
        <header className="doctor-topbar">
          <div className="doctor-search-wrap">
            <SearchBar onPacienteEncontrado={handlePacienteEncontrado} />
          </div>
        </header>

        <div className="doctor-content">
          <Agenda
            turnos={[]}
            turnoActivoId={turnoActivo?.id}
            onSeleccionar={handleSeleccionarTurno}
          />

          {pacienteBuscado ? (
            <>
              {guardadoMsg && (
                <div className={`consulta-msg consulta-msg--${guardadoMsg.tipo}`}>
                  {guardadoMsg.texto}
                </div>
              )}
              <ConsultaWeb
                key={pacienteBuscado.paciente_id}
                paciente={pacienteBuscado}
                profesionalId={MOCK_MEDICO.usuarioId}
                organizacionId={MOCK_MEDICO.organizacionId}
                antecedentes=""
                motivoConsultaPrevia=""
                notaConsultaPrevia=""
                onFinalizar={handleGuardar}
                onVerHistorial={() => console.log('Ver historial:', pacienteBuscado.paciente_id)}
              />
            </>
          ) : (
            <div className="consulta-empty">
              <p>Busque un paciente por DNI para comenzar la consulta.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorHome
