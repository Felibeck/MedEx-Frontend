import { useNavigate } from 'react-router-dom'
import type { estudio } from '../../../types/estudio'
import './cardEstudio.css'

type Props = {
  estudio: estudio
}

const isImageUrl = (url: string) => /\.(jpe?g|png|gif|webp|bmp)(\?|$)/i.test(url)

const CardEstudio = ({ estudio }: Props) => {
  const navigate = useNavigate()
  const { id, fotos, tipoEstudio, fecha, institucion } = estudio
  const thumbnail = fotos[0]
  const showImage = thumbnail && isImageUrl(thumbnail)

  return (
    <div className="estudio-card">
      <div className="estudio-card__img-wrap">
        {showImage ? (
          <img
            src={thumbnail}
            alt={tipoEstudio}
            className="estudio-card__img"
          />
        ) : (
          <div className="estudio-card__placeholder">PDF</div>
        )}
        <span className="estudio-card__label">{tipoEstudio}</span>
      </div>

      <div className="estudio-card__meta">
        <span className="estudio-card__fecha">
          {fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).toUpperCase()}
        </span>
        <span className="estudio-card__institucion">
          {institucion.toUpperCase()}
        </span>
      </div>

      <div className="estudio-card__acciones">
        <button
          type="button"
          className="estudio-card__btn-ver"
          onClick={() => navigate(`/patients/estudio/${id}`)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Ver
        </button>
        <button type="button" className="estudio-card__btn-share" aria-label="Compartir">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CardEstudio
