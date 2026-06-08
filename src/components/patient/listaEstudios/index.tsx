import type { estudio } from "../../../types/estudio";
import CardEstudio from "../cardEstudio";


const ListaEstudios = ({ estudios }: { estudios: estudio[] }) => {
    return (
        <div className="lista-estudios">
            {estudios.map((est, index) => (
                <CardEstudio key={index} estudio={est} />
            ))}
        </div>
    );
};

export default ListaEstudios;