import { useNavigate } from "react-router-dom";
import type { estudio } from "../../../types/estudio";

const infoEstudio = ( {fotos, tipoEstudio, fecha, institucion, informe, medico}: estudio ) =>
{
    const navigate = useNavigate();
    return (
        <>

            <div>
                <h1>{tipoEstudio}</h1>
                <p>fecha: {fecha.toLocaleDateString()}</p>
                <p>institucion: {institucion}</p>    
            </div>
                
                <div>
                {fotos.map((foto, index) =>
                {
                    return <img key={index} src={foto} alt={`foto ${index}`} />
                })}
                </div>


                <div>

                    <h2>Informe Médico</h2>

                    <p>{informe}</p>

                    <div>
                        <img src={medico.foto} alt={medico.nombre} />
                        <p>{medico.especialidad}</p>
                        <p>{medico.nombre}</p>
                    </div>

                </div>


                <button>
                    Descargar PDF
                </button>

                <button>
                    Compartir con Médico
                </button>


                <div>
                    <p>Este resultado está disponible para tu médico de cabecera automáticamente a través de la Red MedEx.</p>
                </div>
        </>
    )
}

export default infoEstudio;