import { useNavigate } from 'react-router-dom'
import IconCobertura from '../../../assets/icons/inicio/cobertura.svg'
import { getCoberturaBadge } from '../../../utils/paciente'
import './planCard.css'

interface PlanCardProps {
  obraSocial?: string | null
  coberturaEstado?: string | null
}

const SIN_INFORMACION = 'sin_informacion'

// Label legible del estado de cobertura que devuelve el backend (snake_case).
const formatearEstado = (coberturaEstado?: string | null): string | null => {
  if (!coberturaEstado || coberturaEstado === SIN_INFORMACION) return null
  const badge = getCoberturaBadge(coberturaEstado)
  const texto = (badge?.label ?? coberturaEstado).replace(/_/g, ' ').toLowerCase()
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const PlanCard = ({ obraSocial, coberturaEstado }: PlanCardProps) => {
  const navigate = useNavigate()
  const estado = formatearEstado(coberturaEstado)

  return (
    <section className="plan-card">
      <div className="plan-card__top">
        <h2 className="plan-card__title">
          <img src={IconCobertura} alt="" className="plan-card__title-icon" />
          Cobertura Integrada
        </h2>

        <div className="plan-card__plan">
          <span className="plan-card__label">Tu plan actual</span>
          <p className="plan-card__value">{obraSocial || 'Sin plan registrado'}</p>
        </div>
      </div>

      {estado && (
        <div className="plan-card__rows">
          <div className="plan-card__row">
            <span className="plan-card__row-label">Estado de cobertura</span>
            <span className="plan-card__row-value">{estado}</span>
          </div>
        </div>
      )}

      {obraSocial ? (
        <button type="button" className="plan-card__cta">
          Ver Carnet Digital
        </button>
      ) : (
        <button
          type="button"
          className="plan-card__cta"
          onClick={() => navigate('/patients/perfil')}
        >
          Completar perfil
        </button>
      )}
    </section>
  )
}

export default PlanCard
