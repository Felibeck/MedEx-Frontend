import type { usuario } from "./Usuario";

export type paciente = usuario & {
    usuarioId: string;
    dni: string;
    edad: number;
    identidadGenero: string;
    telefono: string;
    fotoPerfil: string;

}