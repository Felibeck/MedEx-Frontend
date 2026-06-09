// src/types/paciente.ts
import { uuid } from 'uuid';
import type { usuario } from './Usuario';

export type paciente = usuario & {
    paciente_id: uuid.UUID;
    dni: string;
    edad: number;
    identidad_genero: string;
    telefono: string;
    fotoPerfil?: string;
}