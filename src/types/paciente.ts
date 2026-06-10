// src/types/paciente.ts
import { v4 as uuidv4 } from 'uuid';
import type { usuario } from './Usuario';

export type paciente = usuario & {
    paciente_id: string;
    dni: string;
    edad: number;
    identidadGenero: string;
    telefono: string;
    fotoPerfil?: string;
}