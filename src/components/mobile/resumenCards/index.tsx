import { useNavigate } from 'react-router-dom'
import './resumenCards.css'

interface ResumenCardsProps {
  recetasCount?: number
  estudiosCount?: number
  consultasProximas?: number
}

const ResumenCards = ({ 
  recetasCount = 0, 
  estudiosCount = 0,
  consultasProximas = 0
}: ResumenCardsProps) => {
  const navigate = useNavigate()

  const cards = [
    {
      id: 'recetas',
      label: 'Recetas',
      count: recetasCount,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15 8H22L17 12L19 18L12 14L5 18L7 12L2 8H9L12 2Z" fill="currentColor"/>
        </svg>
      ),
      onClick: () => navigate('/recetas'),
    },
    {
      id: 'estudios',
      label: 'Estudios',
      count: estudiosCount,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
        </svg>
      ),
      onClick: () => navigate('/patients/historial'),
    },
    {
      id: 'consultas',
      label: 'Citas próximas',
      count: consultasProximas,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-2h2v-2h-2v2zm0-4h2v-2h-2v2zm-4 4h2v-2H8v2zm0-4h2v-2H8v2z" fill="currentColor"/>
        </svg>
      ),
      onClick: () => {},
    },
  ]

  return (
    <div className="resumen-cards">
      {cards.map(card => (
        <button
          key={card.id}
          type="button"
          className="resumen-card"
          onClick={card.onClick}
        >
          <div className="resumen-card__icon">
            {card.icon}
          </div>
          <div className="resumen-card__content">
            <p className="resumen-card__label">{card.label}</p>
            <p className="resumen-card__count">{card.count}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ResumenCards
