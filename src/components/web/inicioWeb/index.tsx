import { CalendarDaysIcon, MagnifyingGlassIcon, BriefcaseIcon } from '@heroicons/react/24/solid'
import type { medico } from '../../../types/medico'
import './inicioWeb.css'

type Props = {
  medico: medico
  turnosCount?: number
  onIrAgenda: () => void
  onBuscarPaciente: () => void
}

const InicioWeb = ({ medico, turnosCount, onIrAgenda, onBuscarPaciente }: Props) => {
  const badgeAgenda = turnosCount !== undefined ? `${turnosCount} PENDIENTES` : 'PENDIENTES'
  const descripcion =
    turnosCount !== undefined
      ? `Su agenda para hoy tiene ${turnosCount} turno${turnosCount === 1 ? '' : 's'} programado${turnosCount === 1 ? '' : 's'}. Gestione sus consultas, acceda al historial de sus pacientes y mantenga su práctica organizada desde un solo lugar.`
      : 'Gestione sus consultas, acceda al historial de sus pacientes y mantenga su práctica organizada desde un solo lugar.'

  return (
    <div className="inicio-web">
      <section className="inicio-web__bienvenida">
        <h1 className="inicio-web__titulo">MedEx</h1>
        <div className="inicio-web__divisor" aria-hidden="true" />
        <h2 className="inicio-web__saludo">
          Bienvenido, Dr. {medico.nombre} {medico.apellido}
        </h2>
        <p className="inicio-web__descripcion">{descripcion}</p>
      </section>

      <section className="inicio-web__bento">
        <button
          type="button"
          className="inicio-web__card inicio-web__card--agenda"
          onClick={onIrAgenda}
        >
          <span className="inicio-web__card-icono">
            <CalendarDaysIcon width={24} height={24} />
          </span>
          <span className="inicio-web__card-info">
            <span className="inicio-web__card-titulo">Ver Agenda</span>
            <span className="inicio-web__card-texto">Revise sus turnos y horarios del día</span>
          </span>
          <span className="inicio-web__card-badge">{badgeAgenda}</span>
        </button>

        <button type="button" className="inicio-web__card" onClick={onBuscarPaciente}>
          <span className="inicio-web__card-icono">
            <MagnifyingGlassIcon width={24} height={24} />
          </span>
          <span className="inicio-web__card-titulo">Buscar Paciente</span>
          <span className="inicio-web__card-texto">Acceda al historial clínico completo</span>
          <span className="inicio-web__card-hint">CTRL + K</span>
        </button>

        <button type="button" className="inicio-web__card" onClick={onIrAgenda}>
          <span className="inicio-web__card-icono">
            <BriefcaseIcon width={24} height={24} />
          </span>
          <span className="inicio-web__card-titulo">Nueva Consulta</span>
          <span className="inicio-web__card-texto">Iniciar registro de atención médica</span>
          <span className="inicio-web__card-badge">ACCESO RÁPIDO</span>
        </button>
      </section>
    </div>
  )
}

export default InicioWeb
