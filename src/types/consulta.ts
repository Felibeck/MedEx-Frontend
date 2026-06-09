
import type { paciente } from "./paciente";

export type consulta = {
    pacienteId: number;
    motivoConsulta: string;
    otros?: string;
    recordatorioProximaCita?: boolean;
}