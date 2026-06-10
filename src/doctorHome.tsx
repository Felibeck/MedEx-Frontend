import { useState } from 'react'
import Sidebar from './components/web/sidebar'
import Agenda from './components/web/agenda'
import ConsultaWeb from './components/web/consulta'
import SearchBar from './components/web/searchBar'
import type { medico } from './types/medico'
import type { turno } from './types/turno'
import type { paciente } from './types/paciente'
import type { consulta } from './types/consulta'
import './doctorHome.css'

// ── Mock data — reemplazar con fetch real ──────────────────────────
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

const MOCK_PACIENTE_BASE: paciente = {
  id: 1,
  nombre: 'Martina',
  apellido: 'Zuviria',
  email: 'martina@email.com',
  password: '',
  esMedico: false,
  usuarioId: 'pac-001',
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
    paciente: MOCK_PACIENTE_BASE,
    motivo: 'Chequeo Post-Operatorio',
    esActual: true,
  },
  {
    id: 2,
    hora: '10:15',
    paciente: { ...MOCK_PACIENTE_BASE, id: 2, nombre: 'Roberto', apellido: 'Gomez', edad: 55 },
    motivo: 'Hipertensión / Control',
  },
  {
    id: 3,
    hora: '11:00',
    paciente: { ...MOCK_PACIENTE_BASE, id: 3, nombre: 'Elena', apellido: 'Vazquez', edad: 34 },
    motivo: 'Primera Consulta',
  },
  {
    id: 4,
    hora: '11:45',
    paciente: { ...MOCK_PACIENTE_BASE, id: 4, nombre: 'Claudio', apellido: 'Lopez', edad: 61 },
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
// ────────────────────────────────────────────────────────────────────

const DoctorHome = () => {
  const [activeNav, setActiveNav] = useState('agenda')
  const [turnoActivo, setTurnoActivo] = useState<turno>(MOCK_TURNOS[0])
  // Paciente encontrado por búsqueda de DNI — sobrescribe el turno activo
  const [pacienteBuscado, setPacienteBuscado] = useState<paciente | null>(null)

  // El paciente a mostrar: si hay búsqueda activa usa ese, sino el del turno seleccionado
  const pacienteActual: paciente = pacienteBuscado ?? turnoActivo.paciente

  const datos = ANTECEDENTES[turnoActivo.id] ?? {
    antecedentes: '',
    notaAnterior: '',
    motivoAnterior: '',
  }

  const handleSeleccionarTurno = (t: turno) => {
    setTurnoActivo(t)
    setPacienteBuscado(null) // limpiar búsqueda al seleccionar de agenda
  }

  const handlePacienteEncontrado = (p: paciente) => {
    setPacienteBuscado(p)
  }

  const handleFinalizar = (data: consulta) => {
    console.log('Consulta finalizada:', data)
  }

  const handleBorrador = (data: consulta) => {
    console.log('Guardado como borrador:', data)
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
        {/* Search bar */}
        <header className="doctor-topbar">
          <div className="doctor-search-wrap">
            <SearchBar onPacienteEncontrado={handlePacienteEncontrado} />
          </div>
        </header>

        {/* Content */}
        <div className="doctor-content">
          <Agenda
            turnos={MOCK_TURNOS}
            turnoActivoId={turnoActivo.id}
            onSeleccionar={handleSeleccionarTurno}
          />

          <ConsultaWeb
            key={`${turnoActivo.id}-${pacienteActual.id}`}
            paciente={pacienteActual}
            antecedentes={pacienteBuscado ? undefined : datos.antecedentes}
            motivoConsultaPrevia={pacienteBuscado ? undefined : datos.motivoAnterior}
            notaConsultaPrevia={pacienteBuscado ? undefined : datos.notaAnterior}
            onFinalizar={handleFinalizar}
            onGuardarBorrador={handleBorrador}
            onVerHistorial={() => console.log('Ver historial:', pacienteActual.id)}
          />
        </div>
      </div>
    </div>
  )
}

export default DoctorHome
