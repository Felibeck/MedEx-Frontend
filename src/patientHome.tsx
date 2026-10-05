import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/solid'
import HistorialEstudios, { type HistorialEstudiosHandle } from './components/mobile/historialEstudios'
import SubirEstudioModal from './components/mobile/subirEstudioModal'
import { getPacienteId } from './config/constants'
import './patientHome.css'

const PatientHome = () => {
  const historialRef = useRef<HistorialEstudiosHandle>(null)
  const location = useLocation()
  const navigate = useNavigate()
  // Desde Inicio se puede llegar pidiendo abrir directamente el modal de carga.
  const pidioSubir = location.state?.subirEstudio === true
  const [modalAbierto, setModalAbierto] = useState(pidioSubir)

  // Se limpia el state para que el modal no se reabra al volver o recargar.
  useEffect(() => {
    if (pidioSubir) navigate(location.pathname, { replace: true, state: null })
  }, [pidioSubir, navigate, location.pathname])

  const handleUploadSuccess = () => {
    setModalAbierto(false)
    historialRef.current?.refetch()
  }

  return (
    <>
      <HistorialEstudios ref={historialRef} />

      <button
        type="button"
        className="patient-home__fab"
        aria-label="Agregar estudio"
        onClick={() => setModalAbierto(true)}
      >
        <PlusIcon className="patient-home__fab-icon" />
      </button>

      {modalAbierto && (
        <SubirEstudioModal
          pacienteId={getPacienteId()}
          onClose={() => setModalAbierto(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  )
}

export default PatientHome
