import type { estudio } from "../../../types/estudio";
import CarruselFotos from "../carruselFotos";


const infoEstudio = ( {fotos, tipoEstudio, fecha, institucion, informe, medico}: estudio ) =>
{
    return (
        <>

            <div>
                <h1>{tipoEstudio}</h1>
                <p>fecha: {fecha.toLocaleDateString()}</p>
                <p>institucion: {institucion}</p>    
            </div>
                

            <CarruselFotos cortes={fotos.map((img, i) => ({ id: `c${i}`, label: `C${i + 1}`, imagen: img }))} />

                <div>

                    <h2>Informe Médico</h2>

                    <p>{informe}</p>

                    <div>
                        <img src={medico.fotoPerfil} alt={medico.nombre} />
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