import type { medico } from "./medico";

export type estudio = 
{
    fotos: Array<string>;
    tipoEstudio:string;
    fecha: Date;
    institucion:string;
    informe?:string;
    medico?: medico;

}