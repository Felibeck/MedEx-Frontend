import MobileHeader from '../../components/mobile/mobileHeader'
import BottomNavBar from '../../components/mobile/bottomNavBar'
import './PatientFamilia.css'

const PatientFamilia = () => {
  return (
    <div className="patient-familia-page">
      <MobileHeader />

      <main className="patient-familia-content">
        <section className="patient-familia-card">
          <h1 className="patient-familia-title">Página no implementada</h1>
          <p className="patient-familia-text">
            La sección Familia todavía no está disponible. Estamos trabajando en ella.
          </p>
        </section>
      </main>

      <BottomNavBar />
    </div>
  )
}

export default PatientFamilia
