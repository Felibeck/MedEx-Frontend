import './mobileHeader.css'

const MobileHeader = () => {
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
          {/* Ícono persona con nube — chatbot */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z"/>
            <path d="M12 13.6c-4.8 0-8.4 2.4-8.4 5.4v1.2h16.8V19c0-3-3.6-5.4-8.4-5.4z"/>
            <circle cx="18.5" cy="6.5" r="3" fill="#1f6f6b"/>
            <text x="16.5" y="9" fontSize="5" fill="white" fontWeight="bold">AI</text>
          </svg>
        </button>

        {/* Notificaciones — no funcional por ahora */}
        <button type="button" className="mobile-header__icon-btn" aria-label="Notificaciones">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default MobileHeader
