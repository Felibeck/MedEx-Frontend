import { DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import type { Receta } from '../../../api/recetas'
import './recetasList.css'

interface RecetasListProps {
  recetas: Receta[]
  loading?: boolean
}

const RecetasList = ({ recetas, loading = false }: RecetasListProps) => {
  if (loading) {
    return (
      <div className="recetas-list">
        <div className="recetas-list__empty">
          <p>Cargando recetas...</p>
        </div>
      </div>
    )
  }

  if (recetas.length === 0) {
    return (
      <div className="recetas-list">
        <div className="recetas-list__empty">
          <p>No hay recetas disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="recetas-list">
      <h2 className="recetas-list__title">Recetas Recientes</h2>
      <div className="recetas-list__items">
        {recetas.slice(0, 3).map(receta => (
          <div key={receta.id} className="receta-item">
            <div className="receta-item__content">
              <h3 className="receta-item__titulo">{receta.titulo}</h3>
              <p className="receta-item__fecha">
                {new Date(receta.created_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <a
              href={receta.url}
              download
              className="receta-item__download"
              title={`Descargar ${receta.titulo}`}
            >
              <DocumentArrowDownIcon className="receta-item__icon" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecetasList
