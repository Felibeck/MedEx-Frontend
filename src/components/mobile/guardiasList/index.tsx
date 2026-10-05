import IconHospital from '../../../assets/icons/inicio/guardia-hospital.svg'
import IconSanatorio from '../../../assets/icons/inicio/guardia-sanatorio.svg'
import IconEscudo from '../../../assets/icons/inicio/guardia-escudo.svg'
import mapaGuardias from '../../../assets/mapa-guardias.png'
import type { guardia } from '../../../types/guardia'
import './guardiasList.css'

interface GuardiasListProps {
  guardias: guardia[]
  transito?: string | null
}

const ICONOS = [IconHospital, IconSanatorio, IconEscudo]
const MAX_GUARDIAS = 3

// Umbrales (en minutos) para el color del tiempo de espera.
const ESPERA_CORTA_MIN = 20
const ESPERA_LARGA_MIN = 40

const getTonoEspera = (esperaMin: number): 'corta' | 'media' | 'larga' => {
  if (esperaMin < ESPERA_CORTA_MIN) return 'corta'
  if (esperaMin < ESPERA_LARGA_MIN) return 'media'
  return 'larga'
}

const GuardiasList = ({ guardias, transito }: GuardiasListProps) => {
  if (guardias.length === 0) {
    return null
  }

  return (
    <section className="guardias-list">
      <h2 className="guardias-list__title">Guardias Cercanas</h2>

      <div className="guardias-list__mapa">
        <img src={mapaGuardias} alt="Mapa de guardias cercanas" className="guardias-list__mapa-img" />
        {transito && (
          <div className="guardias-list__transito">
            <span className="guardias-list__transito-dot" />
            <span className="guardias-list__transito-text">Tránsito: {transito}</span>
          </div>
        )}
      </div>

      <ul className="guardias-list__container">
        {guardias.slice(0, MAX_GUARDIAS).map((item, index) => (
          <li key={item.id} className="guardia-card">
            <div className="guardia-card__icon-wrap">
              <img src={ICONOS[index % ICONOS.length]} alt="" className="guardia-card__icon" />
            </div>

            <div className="guardia-card__content">
              <h3 className="guardia-card__nombre">{item.nombre}</h3>
              <p className="guardia-card__distancia">A {item.distanciaKm.toFixed(1)} km</p>
            </div>

            <div className="guardia-card__espera">
              <span className={`guardia-card__espera-valor guardia-card__espera-valor--${getTonoEspera(item.esperaMin)}`}>
                {item.esperaMin} min
              </span>
              <span className="guardia-card__espera-label">Espera</span>
            </div>
          </li>
        ))}
      </ul>

      <button type="button" className="guardias-list__farmacias">
        Ver Farmacias de Turno
      </button>
    </section>
  )
}

export default GuardiasList
