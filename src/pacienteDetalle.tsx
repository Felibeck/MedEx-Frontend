import { useCallback, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './components/web/sidebar'
import SearchBar from './components/web/searchBar'
import FichaPaciente from './components/web/fichaPaciente'
import Breadcrumbs, { type BreadcrumbItem } from './components/web/breadcrumbs'
import { logout } from './api/auth'
import { getCurrentMedico } from './utils/session'
import './doctorHome.css'

const PacienteDetalle = () => {
  const navigate = useNavigate()
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const [nombrePaciente, setNombrePaciente] = useState('')
  // Médico logueado (el mismo que usa doctorHome); se lee una sola vez al montar.
  const [medico] = useState(getCurrentMedico)

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

  if (!medico) return <Navigate to="/doctors/login" replace />

  return (
    <div className="doctor-layout">
      <Sidebar
        medico={medico}
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
