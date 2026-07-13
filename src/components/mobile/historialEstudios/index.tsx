import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MobileHeader from '../mobileHeader'
import ListaEstudios from '../listaEstudios'
import BottomNavBar from '../bottomNavBar'
import { fetchEstudiosPaciente } from '../../../api/estudios'
import { getPacienteId } from '../../../config/constants'
import { FILTROS_TIPO, type FiltroTipo } from '../../../config/tiposEstudio'
import type { estudioResumen } from '../../../types/estudio'
import './historialEstudios.css'

type Props = {
  titulo?: string
  subtitulo?: string
}

export type HistorialEstudiosHandle = {
  refetch: () => void
}

const HistorialEstudios = forwardRef<HistorialEstudiosHandle, Props>(({
  titulo = 'Analisis Completo',
  subtitulo = 'Un estudio mas profundo de tu salud',
}, ref) => {
  const navigate = useNavigate()
  const [estudios, setEstudios] = useState<estudioResumen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<FiltroTipo>('TODOS')

  const loadEstudios = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchEstudiosPaciente(getPacienteId())
      setEstudios(data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('No se pudieron cargar los estudios')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useImperativeHandle(ref, () => ({ refetch: loadEstudios }), [loadEstudios])

  useEffect(() => {
    loadEstudios()
  }, [loadEstudios])

  const estudiosFiltrados =
    filtro === 'TODOS'
      ? estudios
      : estudios.filter((e) => e.tipo === filtro)

  return (
    <div className="historial-page">
      <MobileHeader />

      <div className="historial-content">
        <div className="historial-titulo-wrap">
          <h1 className="historial-titulo">
            <button
              type="button"
              className="historial-back-arrow"
              aria-label="Volver al inicio"
              onClick={() => navigate('/')}
            >
              ←
            </button>
            {titulo}
          </h1>
          <p className="historial-subtitulo">{subtitulo}</p>
        </div>

        <div className="historial-seccion-header">
          <h2 className="historial-seccion-titulo">Estudios e Imágenes</h2>
        </div>

        <div className="historial-filtros-wrap">
          <div
            className="historial-filtros"
            role="tablist"
            aria-label="Filtrar por tipo de estudio"
          >
            {FILTROS_TIPO.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={filtro === id}
                className={`historial-chip${filtro === id ? ' historial-chip--active' : ''}`}
                onClick={() => setFiltro(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="historial-estado">Cargando estudios...</p>}
        {error && <p className="historial-estado historial-estado--error">{error}</p>}
        {!loading && !error && estudiosFiltrados.length === 0 && (
          <p className="historial-estado">No hay estudios</p>
        )}
        {!loading && !error && estudiosFiltrados.length > 0 && (
          <ListaEstudios estudios={estudiosFiltrados} />
        )}
      </div>
      <BottomNavBar />
    </div>
  )
})

export default HistorialEstudios
