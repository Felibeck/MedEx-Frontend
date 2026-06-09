import { useState } from 'react'
import MobileHeader from '../mobileHeader'
import './historialEstudios.css'

type Estudio = {
  id: number
  titulo: string
  fecha: string
  institucion: string
  imagen: string
}

const mockEstudios: Estudio[] = [
  {
    id: 1,
    titulo: 'Rayos X Tórax',
    fecha: '12 MAYO 2024',
    institucion: 'HOSPITAL ITALIANO',
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chest_X-ray_in_influenza_and_Haemophilus_influenzae.jpg/800px-Chest_X-ray_in_influenza_and_Haemophilus_influenzae.jpg',
  },
  {
    id: 2,
    titulo: 'Rayos X Tórax',
    fecha: '12 MAYO 2024',
    institucion: 'HOSPITAL ITALIANO',
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chest_X-ray_in_influenza_and_Haemophilus_influenzae.jpg/800px-Chest_X-ray_in_influenza_and_Haemophilus_influenzae.jpg',
  },
]

type Filtro = 'Todos' | 'Imágenes' | 'Laboratorio' | 'Cirugías'
const FILTROS: Filtro[] = ['Todos', 'Imágenes', 'Laboratorio', 'Cirugías']

const HistorialEstudios = () => {
  const [filtro, setFiltro] = useState<Filtro>('Todos')

  return (
    <div className="historial-page">
      <MobileHeader />

      <div className="historial-content">
        {/* Título con flecha */}
        <div className="historial-titulo-wrap">
          <h1 className="historial-titulo">
            <span className="historial-back-arrow">←</span>
            Analisis Completo
          </h1>
          <p className="historial-subtitulo">Un estudio mas profundo de tu salud</p>
        </div>

        {/* Sección estudios + toggle vista */}
        <div className="historial-seccion-header">
          <h2 className="historial-seccion-titulo">Estudios e Imágenes</h2>
          <div className="historial-vista-toggle">
            {/* Vista cuadrícula */}
            <button type="button" className="historial-vista-btn historial-vista-btn--active" aria-label="Vista cuadrícula">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            {/* Vista lista */}
            <button type="button" className="historial-vista-btn" aria-label="Vista lista">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="4" rx="1"/>
                <rect x="3" y="10" width="18" height="4" rx="1"/>
                <rect x="3" y="16" width="18" height="4" rx="1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filtros chips */}
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

        {/* Cards de estudios */}
        <div className="historial-lista">
          {mockEstudios.map((est) => (
            <div key={est.id} className="estudio-card">
              {/* Imagen con label encima */}
              <div className="estudio-card__img-wrap">
                <img
                  src={est.imagen}
                  alt={est.titulo}
                  className="estudio-card__img"
                />
                <span className="estudio-card__label">{est.titulo}</span>
              </div>

              {/* Metadata */}
              <div className="estudio-card__meta">
                <span className="estudio-card__fecha">{est.fecha}</span>
                <span className="estudio-card__institucion">{est.institucion}</span>
              </div>

              {/* Acciones */}
              <div className="estudio-card__acciones">
                <button type="button" className="estudio-card__btn-ver">
                  {/* Ícono ojo */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Ver
                </button>
                <button type="button" className="estudio-card__btn-share" aria-label="Compartir">
                  {/* Ícono compartir */}
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
