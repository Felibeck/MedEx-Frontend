import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from './components/web/sidebar'
import SearchBar from './components/web/searchBar'
import FichaPaciente from './components/web/fichaPaciente'
import type { medico } from './types/medico'
import './doctorHome.css'

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

const PacienteDetalle = () => {
  const navigate = useNavigate()
  const { pacienteId } = useParams<{ pacienteId: string }>()

  return (
    <div className="doctor-layout">
      <Sidebar
        medico={MOCK_MEDICO}
        activeNav="pacientes"
        onNavChange={(key) => navigate('/doctor', { state: { activeNav: key } })}
        onChatbot={() => console.log('Abrir chatbot')}
        onCerrarSesion={() => navigate('/')}
      />

      <div className="doctor-main">
        <header className="doctor-topbar">
          <div className="doctor-search-wrap">
            <SearchBar onPacienteEncontrado={() => navigate('/doctor')} />
          </div>
        </header>

        <div className="doctor-content doctor-content--columna">
          {pacienteId ? (
            <FichaPaciente pacienteId={pacienteId} />
          ) : (
            <p>Paciente no especificado.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PacienteDetalle
