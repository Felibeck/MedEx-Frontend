// src/types/guardia.ts

export type guardia = {
    id: string;
    nombre: string;
    distanciaKm: number;
    esperaMin: number;
}

export type guardiasCercanas = {
    transito: string | null;
    guardias: guardia[];
}
