import { Link } from 'react-router-dom'
import './homePage.css'

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-card">

        {/* Logo + nombre */}
        <div className="home-brand">
          <div className="home-logo-wrap">
            <img src="/medex-logo.png" alt="MedEx" className="home-logo" />
          </div>
          <span className="home-brand-name">MedEx</span>
        </div>

        {/* Texto introductorio */}
        <div className="home-intro">
          <h1 className="home-intro__title">Tu salud, en un mismo lugar</h1>
          <p className="home-intro__desc">
            Accedé a tus estudios médicos, gestioná turnos y conectá con tus
            profesionales de salud desde cualquier lugar.
          </p>
        </div>

        {/* Separador */}
        <div className="home-divider">
          <span className="home-divider__line" />
          <span className="home-divider__text">¿Cómo querés ingresar?</span>
          <span className="home-divider__line" />
        </div>

        {/* Botones de rol */}
        <div className="home-roles">

          {/* Paciente */}
          <Link to="/patients" className="home-role-btn home-role-btn--patient">
            <div className="home-role-btn__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="home-role-btn__text">
              <span className="home-role-btn__label">Soy Paciente</span>
              <span className="home-role-btn__sub">Ver mis estudios e historial</span>
            </div>
            <svg className="home-role-btn__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>

          {/* Doctor */}
          <Link to="/doctor" className="home-role-btn home-role-btn--doctor">
            <div className="home-role-btn__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div className="home-role-btn__text">
              <span className="home-role-btn__label">Soy Doctor</span>
              <span className="home-role-btn__sub">Gestionar agenda y consultas</span>
            </div>
            <svg className="home-role-btn__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>

        </div>

        <p className="home-footer">© 2025 MedEx · Todos los derechos reservados</p>
      </div>
    </div>
  )
}

export default HomePage
