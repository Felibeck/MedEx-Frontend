import { useEffect, useState } from 'react'
import HomeHeader from '../../components/mobile/homeHeader'
import PlanCard from '../../components/mobile/planCard'
import ResumenCards from '../../components/mobile/resumenCards'
import GuardiasList from '../../components/mobile/guardiasList'
import RecetasList from '../../components/mobile/recetasList'
import BottomNavBar from '../../components/mobile/bottomNavBar'
import { useHistorialPaciente } from '../../hooks/useHistorialPaciente'
import type { Receta } from '../../api/recetas'
import './patientInicio.css'

const PatientInicio = () => {
  const { historial, recetas, loading, error } = useHistorialPaciente()
  const [recetasData, setRecetasData] = useState<Receta[]>([])

  useEffect(() => {
    if (recetas && recetas.length > 0) {
      setRecetasData(recetas)
    }
  }, [recetas])

  if (error && !historial) {
    return (
      <div className="patient-inicio patient-inicio--error">
        <div className="patient-inicio__error-message">
          <p>Error al cargar los datos</p>
          <p className="patient-inicio__error-details">{error}</p>
        </div>
      </div>
    )
  }

  const paciente = historial?.paciente
  const nombre = paciente?.nombre || 'Usuario'
  const apellido = paciente?.apellido || ''
  const fotoPerfil = paciente?.foto_perfil
  const obraSocial = paciente?.obra_social
  const coberturaEstado = paciente?.cobertura_estado

  const recetasCount = recetasData.length
  const estudiosCount = historial?.estudios?.length || 0
  const consultasProximas = historial?.consultas?.filter(
    c => new Date(c.fecha) > new Date()
  ).length || 0

  return (
    <div className="patient-inicio">
      <div className="patient-inicio__scroll-container">
        {/* Header con saludo */}
        {!loading && (
          <>
            <HomeHeader 
              nombre={nombre}
              apellido={apellido}
              fotoPerfil={fotoPerfil}
            />

            {/* Plan Card */}
            <PlanCard 
              obraSocial={obraSocial}
              coberturaEstado={coberturaEstado}
            />

            {/* Resumen de Cards */}
            <ResumenCards 
              recetasCount={recetasCount}
              estudiosCount={estudiosCount}
              consultasProximas={consultasProximas}
            />

            {/* Guardias Cercanas */}
            <GuardiasList />

            {/* Recetas Recientes */}
            <RecetasList 
              recetas={recetasData}
              loading={loading}
            />
          </>
        )}

        {loading && (
          <div className="patient-inicio__loading">
            <p>Cargando información...</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  )
}

export default PatientInicio
