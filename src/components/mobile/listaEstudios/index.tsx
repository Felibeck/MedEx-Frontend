import type { estudioResumen } from '../../../types/estudio'
import CardEstudio from '../cardEstudio'

const ListaEstudios = ({ estudios }: { estudios: estudioResumen[] }) => {
  return (
    <div className="historial-lista">
      {estudios.map((est) => (
        <CardEstudio key={est.id} estudio={est} />
      ))}
    </div>
  )
}

export default ListaEstudios
