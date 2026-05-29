import { EyeIcon } from "@heroicons/react/16/solid"
import type { estudio } from "../../types/estudio"

const cardEstudio = ( {fotos, tipoEstudio, fecha, institucion}: estudio ) =>
{

    return (
        <div>
            <img src={fotos[0]} alt="foto-estudio"/>
            <h3>{tipoEstudio}</h3>
            <p>{new Date(fecha).toLocaleDateString('es-AR')}</p>
            <p>{institucion}</p> 

            <button>

                <EyeIcon width={20} height={20} />
                Ver
            </button>
        </div>    
    )

}

export default cardEstudio