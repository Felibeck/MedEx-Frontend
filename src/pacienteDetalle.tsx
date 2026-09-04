import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from './components/web/sidebar'
import SearchBar from './components/web/searchBar'
import FichaPaciente from './components/web/fichaPaciente'
import Breadcrumbs, { type BreadcrumbItem } from './components/web/breadcrumbs'
import type { medico } from './types/medico'
import { logout } from './api/auth'
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
  const [nombrePaciente, setNombrePaciente] = useState('')

  // useCallback para no reiniciar el fetch de la ficha en cada render.
  const handlePacienteCargado = useCallback((nombreCompleto: string) => {
    setNombrePaciente(nombreCompleto)
  }, [])

  // "Pacientes" vuelve a /doctor con el estado de navegación ya en 'pacientes'
  // (doctorHome lee location.state?.activeNav al montar).
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', onClick: () => navigate('/doctor') },
    { label: 'Pacientes', onClick: () => navigate('/doctor', { state: { activeNav: 'pacientes' } }) },
    { label: `Ficha de ${nombrePaciente || 'Paciente'}` },
  ]

  const handleCerrarSesion = async () => {
    try {
      await logout()
      navigate('/doctors/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cerrar sesión'
      window.alert(message)
    }
  }

  return (
    <div className="doctor-layout">
      <Sidebar
        medico={MOCK_MEDICO}
        activeNav="pacientes"
        onNavChange={(key) => navigate('/doctor', { state: { activeNav: key } })}
        onChatbot={() => console.log('Abrir chatbot')}
        onCerrarSesion={handleCerrarSesion}
      />

      <div className="doctor-main">
        <header className="doctor-topbar">
          <div className="doctor-search-wrap">
            <SearchBar onPacienteEncontrado={() => navigate('/doctor')} />
          </div>
        </header>

        <Breadcrumbs items={breadcrumbItems} />

        <div className="doctor-content doctor-content--columna">
          {pacienteId ? (
            <FichaPaciente pacienteId={pacienteId} onPacienteCargado={handlePacienteCargado} />
          ) : (
            <p>Paciente no especificado.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PacienteDetalle
