import type { usuario } from "./Usuario";

export type medico = usuario & {

    usuarioId: string;
    organizacionId: string;
    matricula: string;
    especialidad: string;
    fotoPerfil: string;

}