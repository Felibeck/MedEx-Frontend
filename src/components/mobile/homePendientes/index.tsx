import { useNavigate } from 'react-router-dom'
import { CalendarDaysIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { formatearFechaDia, nombreCompleto } from '../../../utils/paciente'
import type { pendienteHome } from '../../../types/homePaciente'
import './homePendientes.css'

interface HomePendientesProps {
  pendientes: pendienteHome[]
}

const TITULOS: Record<pendienteHome['tipo'], string> = {
  cita_seguimiento: 'Cita de seguimiento pendiente',
  estudio_solicitado: 'Estudio solicitado',
}

const getDetalle = (pendiente: pendienteHome): string => {
  const profesional =
    nombreCompleto(pendiente.profesional.nombre, pendiente.profesional.apellido) || 'Tu profesional'
  const fecha = formatearFechaDia(pendiente.fecha)
  const cuando = fecha ? ` en tu consulta del ${fecha}` : ''

  if (pendiente.tipo === 'estudio_solicitado') {
    return `${profesional} te pidió un estudio${cuando}.`
  }
  return `${profesional} indicó una próxima cita${cuando}.`
}

const HomePendientes = ({ pendientes }: HomePendientesProps) => {
  const navigate = useNavigate()

  if (pendientes.length === 0) {
    return null
  }

  return (
    <section className="home-pendientes">
      <h2 className="home-pendientes__title">Pendientes</h2>

      <ul className="home-pendientes__list">
        {pendientes.map(pendiente => {
          const esEstudio = pendiente.tipo === 'estudio_solicitado'
          const Icono = esEstudio ? DocumentArrowUpIcon : CalendarDaysIcon

          return (
            <li key={`${pendiente.tipo}-${pendiente.consultaId}`} className="home-pendiente">
              <div className="home-pendiente__icon-wrap">
                <Icono className="home-pendiente__icon" />
              </div>

              <div className="home-pendiente__content">
                <h3 className="home-pendiente__titulo">{TITULOS[pendiente.tipo]}</h3>
                <p className="home-pendiente__detalle">{getDetalle(pendiente)}</p>

                {esEstudio && (
                  <button
                    type="button"
                    className="home-pendiente__cta"
                    onClick={() => navigate('/patients', { state: { subirEstudio: true } })}
                  >
                    Subir estudio
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default HomePendientes
