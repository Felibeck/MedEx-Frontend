import { useNavigate } from 'react-router-dom'
import './mobileHeader.css'

const MobileHeader = () => {
  const navigate = useNavigate()

  return (
    <header className="mobile-header">
      {/* Logo + nombre */}
      <div className="mobile-header__brand">
        <div className="mobile-header__logo-wrap">
          <img src="/medex-logo.png" alt="MedEx Logo" className="mobile-header__logo" />
        </div>
        <span className="mobile-header__title">MedEx</span>
      </div>

      {/* Acciones derecha */}
      <div className="mobile-header__actions">

        {/* Chatbot — no funcional por ahora */}
        <button type="button" className="mobile-header__icon-btn" aria-label="Chatbot">
          {/* Nube con rayo — AI */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
        </button>

        {/* Recetas */}
        <button
          type="button"
          className="mobile-header__icon-btn"
          onClick={() => navigate('/recetas')}
          aria-label="Recetas"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>

      </div>
    </header>
  )
}

export default MobileHeader
