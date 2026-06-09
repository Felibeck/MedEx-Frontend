import { useParams, useNavigate } from 'react-router-dom'
import DetalleEstudio from '../../components/mobile/detalleEstudio'
import { MOCK_ESTUDIOS } from '../../data/mockEstudios'

const DetalleEstudioPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const estudio = MOCK_ESTUDIOS.find((e) => e.id === Number(id))

  if (!estudio) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#416464' }}>
        <p>Estudio no encontrado.</p>
        <button onClick={() => navigate('/patients')} style={{ marginTop: 16 }}>
          Volver
        </button>
      </div>
    )
  }

  return (
    <DetalleEstudio
      estudio={estudio}
      onDescargarPdf={() => console.log('Descargar PDF:', estudio.id)}
      onCompartir={() => console.log('Compartir:', estudio.id)}
    />
  )
}

export default DetalleEstudioPage
