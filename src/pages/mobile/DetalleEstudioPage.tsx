import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import DetalleEstudio from '../../components/mobile/detalleEstudio'
import { fetchEstudioById } from '../../api/estudios'
import { PACIENTE_ID } from '../../config/constants'
import type { estudio as Estudio } from '../../types/estudio'

const DetalleEstudioPage = () => {
  const { estudioId } = useParams<{ estudioId: string }>()
  const navigate = useNavigate()

  const [estudio, setEstudio] = useState<Estudio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!estudioId) {
      setError('ID de estudio no válido')
      setLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchEstudioById(PACIENTE_ID, estudioId)
        if (!cancelled) setEstudio(data)
      } catch (err: unknown) {
        if (!cancelled) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message ?? err.message)
          } else if (err instanceof Error) {
            setError(err.message)
          } else {
            setError('No se pudo cargar el estudio')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [estudioId])

  if (loading) {
    return (
      <div className="detalle-page">
        <div className="detalle-estado">
          <p>Cargando estudio...</p>
        </div>
      </div>
    )
  }

  if (error || !estudio) {
    return (
      <div className="detalle-page">
        <div className="detalle-estado detalle-estado--error">
          <p>{error ?? 'Estudio no encontrado.'}</p>
          <button onClick={() => navigate('/patients')}>Volver</button>
        </div>
      </div>
    )
  }

  const handleDescargarPdf = () => {
    if (estudio.urlArchivo) {
      window.open(estudio.urlArchivo, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <DetalleEstudio
      estudio={estudio}
      onDescargarPdf={handleDescargarPdf}
      onCompartir={() => console.log('Compartir:', estudio.id)}
    />
  )
}

export default DetalleEstudioPage
