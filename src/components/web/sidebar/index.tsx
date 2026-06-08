import type { medico } from "../../../types/medico";

const sidebar = ( { medico }: {medico:medico} ) =>
{
    return (
        <div className="sidebar">
            <h2>MedEx</h2>
            <h3>Tu salud, en un mismo lugar</h3>

            <ul>
                <li><a href="#">Agenda</a></li>
                <li><a href="#">Registro de Pacientes</a></li>
                <li><a href="#">Notificaciones</a></li>
                <li><a href="#">Configuración</a></li>
            </ul>

            <div>
                <img src={medico.fotoPerfil} alt={medico.nombre} />
                <p>{medico.nombre} {medico.apellido}</p>
                <p>{medico.especialidad}</p>
            </div>

            <button>
                CHATBOT
            </button>

            <button>
                CERRAR SESIÓN
            </button>

        </div>
    )
}

export default sidebar;