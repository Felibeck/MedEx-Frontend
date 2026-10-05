import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import IconChatbot from '../../../assets/icons/inicio/chatbot.svg'
import IconNotificaciones from '../../../assets/icons/inicio/notificaciones.svg'
import './mobileHeader.css'

type Props = {
  // Sin `titulo` muestra la marca (pantallas raíz de cada pestaña).
  // Con `titulo` muestra volver + título (pantallas hijas: Recetas, detalle de estudio).
  titulo?: string
  // Por defecto vuelve a la pantalla anterior.
  onVolver?: () => void
}

/**
 * Header único de la vista Paciente (TopAppBar del Figma de Inicio). Toma el
 * fondo de la página que lo contiene, así que no hay que pasarle color.
 */
const MobileHeader = ({ titulo, onVolver }: Props) => {
  const navigate = useNavigate()

  return (
    <header className="mobile-header">
      {titulo ? (
        <div className="mobile-header__brand">
          <button
            type="button"
            className="mobile-header__back"
            onClick={onVolver ?? (() => navigate(-1))}
            aria-label="Volver"
          >
            <ChevronLeftIcon className="mobile-header__back-icon" />
          </button>
          <h1 className="mobile-header__title mobile-header__title--seccion">{titulo}</h1>
        </div>
      ) : (
        <div className="mobile-header__brand">
          <div className="mobile-header__logo-wrap">
            <img src="/medex-logo.png" alt="MedEx Logo" className="mobile-header__logo" />
          </div>
          <span className="mobile-header__title">MedEx</span>
        </div>
      )}

      {/* Acciones derecha — todavía sin pantalla de destino */}
      <div className="mobile-header__actions">
        <button type="button" className="mobile-header__icon-btn" aria-label="Chatbot">
          <img src={IconChatbot} alt="" />
        </button>

        <button type="button" className="mobile-header__icon-btn" aria-label="Notificaciones">
          <img src={IconNotificaciones} alt="" />
        </button>
      </div>
    </header>
  )
}

export default MobileHeader
