import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileHeader from '../mobileHeader'
import type { estudio } from '../../../types/estudio'
import './historialEstudios.css'

type Filtro = 'Todos' | 'Imágenes' | 'Laboratorio' | 'Cirugías'
const FILTROS: Filtro[] = ['Todos', 'Imágenes', 'Laboratorio', 'Cirugías']

type Props = {
  estudios: estudio[]
  titulo?: string
  subtitulo?: string
}

const HistorialEstudios = ({
  estudios,
  titulo = 'Analisis Completo',
  subtitulo = 'Un estudio mas profundo de tu salud',
}: Props) => {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState<Filtro>('Todos')

  const estudiosFiltrados = filtro === 'Todos'
    ? estudios
    : estudios.filter((e) => e.categoria?.toLowerCase().includes(filtro.toLowerCase()))

  return (
    <div className="historial-page">
      <MobileHeader />

      <div className="historial-content">
        {/* Título */}
        <div className="historial-titulo-wrap">
          <h1 className="historial-titulo">
            <span className="historial-back-arrow">←</span>
            {titulo}
          </h1>
          <p className="historial-subtitulo">{subtitulo}</p>
        </div>

        {/* Sección header + toggle vista */}
        <div className="historial-seccion-header">
          <h2 className="historial-seccion-titulo">Estudios e Imágenes</h2>
          <div className="historial-vista-toggle">
            <button type="button" className="historial-vista-btn historial-vista-btn--active" aria-label="Vista cuadrícula">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button type="button" className="historial-vista-btn" aria-label="Vista lista">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="4" rx="1"/>
                <rect x="3" y="10" width="18" height="4" rx="1"/>
                <rect x="3" y="16" width="18" height="4" rx="1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="historial-filtros">
          {FILTROS.map((f) => (
            <button
              key={f}
              type="button"
              className={`historial-chip${filtro === f ? ' historial-chip--active' : ''}`}
              onClick={() => setFiltro(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="historial-lista">
          {estudiosFiltrados.map((est) => (
            <div key={est.id} className="estudio-card">
              <div className="estudio-card__img-wrap">
                <img
                  src={est.fotos[0]}
                  alt={est.tipoEstudio}
                  className="estudio-card__img"
                />
                <span className="estudio-card__label">{est.tipoEstudio}</span>
              </div>

              <div className="estudio-card__meta">
                <span className="estudio-card__fecha">
                  {est.fecha.toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).toUpperCase()}
                </span>
                <span className="estudio-card__institucion">
                  {est.institucion.toUpperCase()}
                </span>
              </div>

              <div className="estudio-card__acciones">
                <button
                  type="button"
                  className="estudio-card__btn-ver"
                  onClick={() => navigate(`/patients/estudio/${est.id}`)}
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistorialEstudios
