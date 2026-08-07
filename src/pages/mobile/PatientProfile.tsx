import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileHeader from '../../components/mobile/mobileHeader'
import BottomNavBar from '../../components/mobile/bottomNavBar'
import { logout } from '../../api/auth'
import { getCurrentPaciente } from '../../utils/session'
import './PatientProfile.css'

type PatientSession = {
  id: string
  nombre: string
  apellido: string
  email: string
}

const PatientProfile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<PatientSession | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const current = getCurrentPaciente()
    if (!current) {
      navigate('/patients/login')
      return
    }

    setUser({
      id: current.id,
      nombre: current.nombre,
      apellido: current.apellido,
      email: current.email,
    })
  }, [navigate])

  const handleLogout = async () => {
    setError(null)
    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/patients/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cerrar sesión'
      setError(message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="patient-profile-page">
      <MobileHeader />

      <main className="patient-profile-content">
        <section className="patient-profile-card">
          <div className="patient-profile-header">
            <h1 className="patient-profile-title">Perfil</h1>
            <p className="patient-profile-subtitle">Gestione su cuenta y cierre sesión de forma segura.</p>
          </div>

          <div className="patient-profile-details">
            <div className="patient-profile-row">
              <span className="patient-profile-label">Nombre</span>
              <span className="patient-profile-value">{user ? `${user.nombre} ${user.apellido}` : 'Cargando...'}</span>
            </div>
            <div className="patient-profile-row">
              <span className="patient-profile-label">Email</span>
              <span className="patient-profile-value">{user ? user.email : 'Cargando...'}</span>
            </div>
          </div>

          {error && <p className="patient-profile-error">{error}</p>}

          <button
            type="button"
            className="patient-profile-logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>
        </section>
      </main>

      <BottomNavBar />
    </div>
  )
}

export default PatientProfile
