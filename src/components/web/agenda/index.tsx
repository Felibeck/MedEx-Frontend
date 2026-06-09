import type { turno } from '../../../types/turno'
import './agenda.css'

type Props = {
  turnos: turno[]
  onSeleccionar?: (turno: turno) => void
  turnoActivoId?: number
}

const Agenda = ({ turnos, onSeleccionar, turnoActivoId }: Props) => {
  return (
    <div className="agenda">
      <div className="agenda__header">
        <h2 className="agenda__titulo">Agenda del Día</h2>
        <span className="agenda__badge">{turnos.length} TURNOS</span>
      </div>

      <div className="agenda__lista">
        {turnos.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`agenda__item${t.esActual ? ' agenda__item--activo' : ''}${turnoActivoId === t.id ? ' agenda__item--seleccionado' : ''}`}
            onClick={() => onSeleccionar?.(t)}
          >
            <div className="agenda__item-hora">
              {t.esActual ? (
                <span className="agenda__ahora">
                  AHORA · {t.hora}{t.horaFin ? ` – ${t.horaFin}` : ''}
                </span>
              ) : (
                <span className="agenda__hora-texto">{t.hora}</span>
              )}
              {t.esActual && (
                <span className="agenda__dot-activo" aria-hidden="true" />
              )}
            </div>
            <p className="agenda__item-nombre">
              {t.paciente.nombre} {t.paciente.apellido}
            </p>
            <p className="agenda__item-motivo">{t.motivo}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Agenda
