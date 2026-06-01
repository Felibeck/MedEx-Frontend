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


<button>
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
  <path d="M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.475l6.733-3.366A2.52 2.52 0 0 1 13 4.5Z" />
</svg>

</button>

        </div>    
    )

}

export default cardEstudio