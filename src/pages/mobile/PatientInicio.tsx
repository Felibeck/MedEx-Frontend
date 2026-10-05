import { useEffect, useState } from 'react'
import MobileHeader from '../../components/mobile/mobileHeader'
import HomeHeader from '../../components/mobile/homeHeader'
import HomePendientes from '../../components/mobile/homePendientes'
import AccesosRapidos from '../../components/mobile/accesosRapidos'
import PlanCard from '../../components/mobile/planCard'
import GuardiasList from '../../components/mobile/guardiasList'
import BottomNavBar from '../../components/mobile/bottomNavBar'
import { getHomePaciente } from '../../api/home'
import { getGuardiasCercanas } from '../../api/guardias'
import { getCurrentPaciente } from '../../utils/session'
import type { homePaciente } from '../../types/homePaciente'
import type { guardiasCercanas } from '../../types/guardia'
import './patientInicio.css'

const PatientInicio = () => {
  const [home, setHome] = useState<homePaciente | null>(null)
  const [guardias, setGuardias] = useState<guardiasCercanas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelado = false

    getHomePaciente()
      .then(data => {
        if (!cancelado) setHome(data)
      })
      .catch(() => {
        // Sin resumen, los accesos rápidos se muestran igual pero sin datos del paciente.
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  useEffect(() => {
    let cancelado = false

    getGuardiasCercanas()
      .then(data => {
        if (!cancelado) setGuardias(data)
      })
      .catch(() => {
        // Sin guardias la sección simplemente no se muestra.
      })

    return () => {
      cancelado = true
    }
  }, [])

  // Mientras llega el perfil se muestra el nombre guardado en la sesión.
  const sesion = getCurrentPaciente()
  const nombre = home?.paciente.nombre || sesion?.nombre || ''
  const apellido = home?.paciente.apellido || sesion?.apellido || ''

  return (
    <div className="patient-inicio">
      <MobileHeader />

      <main className="patient-inicio__main">
        <HomeHeader nombre={nombre} apellido={apellido} />

        {home && <HomePendientes pendientes={home.pendientes} />}

        <AccesosRapidos home={home} loading={loading} />

        {home && (
          <PlanCard
            obraSocial={home.paciente.obraSocial}
            coberturaEstado={home.paciente.coberturaEstado}
          />
        )}

        {guardias && (
          <GuardiasList guardias={guardias.guardias} transito={guardias.transito} />
        )}
      </main>

      <BottomNavBar />
    </div>
  )
}

export default PatientInicio
