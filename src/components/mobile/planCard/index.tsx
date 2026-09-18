import './planCard.css'

interface PlanCardProps {
  obraSocial?: string | null
  coberturaEstado?: string | null
}

const PlanCard = ({ obraSocial, coberturaEstado }: PlanCardProps) => {
  const mostrarCTA = !obraSocial || !coberturaEstado

  return (
    <div className="plan-card">
      <div className="plan-card__header">
        <div className="plan-card__icon-check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
            <path d="M10 14.5L7 11.5M10 14.5L17 7.5M10 14.5L17 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <h2 className="plan-card__title">Cobertura Integrada</h2>
      </div>

      <div className="plan-card__content">
        <div className="plan-card__item">
          <span className="plan-card__label">PLAN ACTIVO</span>
          <p className="plan-card__value">
            {obraSocial || 'Sin plan registrado'}
          </p>
        </div>

        {coberturaEstado && (
          <div className="plan-card__item">
            <span className="plan-card__label">Estado</span>
            <p className="plan-card__value">{coberturaEstado}</p>
          </div>
        )}
      </div>

      {mostrarCTA && (
        <button type="button" className="plan-card__cta">
          Completar perfil
        </button>
      )}
    </div>
  )
}

export default PlanCard
