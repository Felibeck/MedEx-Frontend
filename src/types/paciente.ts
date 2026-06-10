// src/types/paciente.ts
import type { usuario } from './Usuario';

export type paciente = usuario & {
    paciente_id: string;
    dni: string;
    edad: number;
    identidadGenero: string;
    telefono: string;
    fotoPerfil?: string;
}