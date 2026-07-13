import { useRef, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import HistorialEstudios, { type HistorialEstudiosHandle } from './components/mobile/historialEstudios'
import SubirEstudioModal from './components/mobile/subirEstudioModal'
import { getPacienteId } from './config/constants'
import './patientHome.css'

const PatientHome = () => {
  const historialRef = useRef<HistorialEstudiosHandle>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

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
