import HistorialEstudios from './components/mobile/historialEstudios'
import { MOCK_ESTUDIOS } from './data/mockEstudios'

const PatientHome = () => {
  return <HistorialEstudios estudios={MOCK_ESTUDIOS} />
}

export default PatientHome
