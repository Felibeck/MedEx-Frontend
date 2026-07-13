import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './recetasScreen.css'
import { getRecetas, type Receta } from '../../../api/recetas'

const RecetasScreen = () => {
  const navigate = useNavigate()
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        setLoading(true)
        const data = await getRecetas()
        setRecetas(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar recetas')
        setRecetas([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecetas()
  }, [])

  const handleOpenPdf = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="recetas-screen">
      <header className="recetas-screen__header">
        <button
          className="recetas-screen__back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="recetas-screen__title">Recetas</h1>
      </header>

      <main className="recetas-screen__content">
        {loading && (
          <div className="recetas-screen__loading">
            <div className="recetas-screen__spinner" />
            <span>Cargando recetas...</span>
          </div>
        )}

        {error && (
          <div className="recetas-screen__empty">
            <span className="recetas-screen__empty-icon">⚠️</span>
            <p className="recetas-screen__empty-text">{error}</p>
          </div>
        )}

        {!loading && !error && recetas.length === 0 && (
          <div className="recetas-screen__empty">
            <span className="recetas-screen__empty-icon">📄</span>
            <p className="recetas-screen__empty-text">No hay recetas disponibles</p>
          </div>
        )}

        {!loading && !error && recetas.length > 0 && (
          <div>
            {recetas.map((receta) => (
              <article key={receta.id} className="receta-card">
                <h2 className="receta-card__title">{receta.titulo}</h2>
                <p className="receta-card__date">
                  {new Date(receta.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <button
                  className="receta-card__btn"
                  onClick={() => handleOpenPdf(receta.url)}
                >
                  <svg className="receta-card__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18c-1.26 0-2.26 1-2.26 2.05C4.74 21.09 5.74 22 7 22s3-1 3-2.05c0-1.06-1-2-2-2zm0-2c.89 0 1.73-.2 2.5-.55V7h5V5h-5V3.5a.5.5 0 0 0-.5-.5H11a.5.5 0 0 0-.5.5V5H6c-1.1 0-2 .9-2 2v10c0 2.21 1.79 4 4 4z" fill="currentColor" />
                  </svg>
                  Abrir PDF
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default RecetasScreen
