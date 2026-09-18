import { useState, useEffect } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import guardiasData from '../../../mocks/guardias.json'
import './guardiasList.css'

interface Guardia {
  id: string
  nombre: string
  distancia_km: number
  espera_min: number
  imagen?: string
  especialidad?: string
}

const GuardiasList = () => {
  const [guardias, setGuardias] = useState<Guardia[]>([])

  useEffect(() => {
    // Simular fetch del mock
    setGuardias(guardiasData)
  }, [])

  if (guardias.length === 0) {
    return null
  }

  const mostrado = guardias.slice(0, 2) // Mostrar solo 2 guardias en la preview

  return (
    <div className="guardias-list">
      <div className="guardias-list__header">
        <h2 className="guardias-list__title">Guardias Cercanas</h2>
        <button type="button" className="guardias-list__ver-mas">
          Ver más
          <ChevronRightIcon className="guardias-list__arrow" />
        </button>
      </div>

      <div className="guardias-list__container">
        {mostrado.map(guardia => (
          <div key={guardia.id} className="guardia-card">
            <div className="guardia-card__image">
              {guardia.imagen ? (
                <img src={guardia.imagen} alt={guardia.nombre} />
              ) : (
                <div className="guardia-card__image-placeholder">🏥</div>
              )}
            </div>

            <div className="guardia-card__content">
              <h3 className="guardia-card__nombre">{guardia.nombre}</h3>
              
              <div className="guardia-card__info">
                <div className="guardia-card__item">
                  <span className="guardia-card__label">Distancia</span>
                  <span className="guardia-card__value">{guardia.distancia_km} km</span>
                </div>
                <div className="guardia-card__item">
                  <span className="guardia-card__label">Espera</span>
                  <span className="guardia-card__value">{guardia.espera_min} min</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuardiasList
