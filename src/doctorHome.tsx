import { useState } from 'react'
import Sidebar from './components/web/sidebar'
import Agenda from './components/web/agenda'
import ConsultaWeb from './components/web/consulta'
import type { medico } from './types/medico'
import type { turno } from './types/turno'
import type { paciente } from './types/paciente'
import type { consulta } from './types/consulta'
import './doctorHome.css'
import SearchBar from './components/web/searchBar'
import { v4 as uuidv4 } from 'uuid';

const MOCK_MEDICO: medico = {
  id: 1,
  nombre: 'Dr. Julian',
  apellido: 'Rivera',
  email: 'julian@medex.com',
  password: '',
  esMedico: true,
  usuarioId: 'med-001',
  organizacionId: 'org-001',
  matricula: '12345',
  especialidad: 'Cirujano',
  fotoPerfil: '',
}

const MOCK_PACIENTE_1: paciente = {
  id: 1,
  nombre: 'Martina',
  apellido: 'Zuviria',
  email: 'martina@email.com',
  password: '',
  esMedico: false,
  paciente_id: uuidv4(),
  dni: '32000001',
  edad: 42,
  identidadGenero: 'Femenino',
  telefono: '1100000001',
  fotoPerfil: '',
}

const MOCK_TURNOS: turno[] = [
  {
    id: 1,
    hora: '09:30',
    horaFin: '10:00',
    paciente: MOCK_PACIENTE_1,
    motivo: 'Chequeo Post-Operatorio',
    esActual: true,
  },
  {
    id: 2,
    hora: '10:15',
    paciente: { ...MOCK_PACIENTE_1, id: 2, nombre: 'Roberto', apellido: 'Gomez' },
    motivo: 'Hipertensión / Control',
  },
  {
    id: 3,
    hora: '11:00',
    paciente: { ...MOCK_PACIENTE_1, id: 3, nombre: 'Elena', apellido: 'Vazquez' },
    motivo: 'Primera Consulta',
  },
  {
    id: 4,
    hora: '11:45',
    paciente: { ...MOCK_PACIENTE_1, id: 4, nombre: 'Claudio', apellido: 'Lopez' },
    motivo: 'Revisión de Estudios',
  },
]

const ANTECEDENTES: Record<number, { antecedentes: string; notaAnterior: string; motivoAnterior: string }> = {
  1: {
    antecedentes: 'Insuficiencia Mitral Leve (2022)',
    notaAnterior: 'Seguimiento semestral. Último ECG sin cambios significativos.',
    motivoAnterior: 'Control de medicación',
  },
  2: {
    antecedentes: 'Hipertensión arterial (2020)',
    notaAnterior: 'Tratamiento con Enalapril 5mg. Tensión controlada.',
    motivoAnterior: 'Control de presión arterial',
  },
  3: {
    antecedentes: 'Sin antecedentes conocidos',
    notaAnterior: '',
    motivoAnterior: 'Primera visita',
  },
  4: {
    antecedentes: 'Diabetes Tipo 2 (2018)',
    notaAnterior: 'Hemoglobina glicosilada estable. Dieta controlada.',
    motivoAnterior: 'Revisión de estudios periódicos',
  },
}

const DoctorHome = () => {
  const [activeNav, setActiveNav] = useState('agenda')
  const [turnoActivo, setTurnoActivo] = useState<turno>(MOCK_TURNOS[0])
  const [pacienteBuscado, setPacienteBuscado] = useState<paciente | null>(null)

  const datos = ANTECEDENTES[turnoActivo.id] ?? {
    antecedentes: '',
    notaAnterior: '',
    motivoAnterior: '',
  }

  const handleFinalizar = (data: consulta) => {
    console.log('Consulta finalizada:', data)
  }

  const handleBorrador = (data: consulta) => {
    console.log('Guardado como borrador:', data)
  }

  const handlePacienteEncontrado = (p: paciente) => {
    console.log('Paciente encontrado:', p)
    setPacienteBuscado(p)
    setActiveNav('agenda')
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
            turnos={MOCK_TURNOS}
            turnoActivoId={turnoActivo.id}
            onSeleccionar={setTurnoActivo}
          />

          {pacienteBuscado ? (
            <ConsultaWeb
              key={turnoActivo.id}
              paciente={pacienteBuscado}
              antecedentes={datos.antecedentes}
              motivoConsultaPrevia={datos.motivoAnterior}
              notaConsultaPrevia={datos.notaAnterior}
              onFinalizar={handleFinalizar}
              onGuardarBorrador={handleBorrador}
              onVerHistorial={() => console.log('Ver historial:', pacienteBuscado?.id)}
            />
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
