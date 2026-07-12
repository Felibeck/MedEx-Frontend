// src/types/historialClinicoPaciente.ts
// Shape real de GET /patients/me/historial — vista del propio paciente sobre su
// historial clínico completo. Extiende el shape de historialClinico.ts (que
// documenta la vista del médico) con los campos propios de esta pantalla.

import type { fichaPaciente, alergia, condicionCronica, estudioHistorial, consultaHistorial } from './historialClinico'

export type antecedentePatologico = {
    id: string;
    nombre: string;
}

export type ginecoObstetrico = {
    menarcaEdad: number | null;
    formulaObstetrica: string | null;
    ultimoPapFecha: string | null;
    ultimoPapResultado: string | null;
}

export type examenFisico = {
    presionArterial: string | null;
    pesoKg: number | null;
    tallaM: number | null;
    imc: number | null;
    fecha: string | null;
}

export type pacienteHistorialCompleto = fichaPaciente & {
    antecedentesQuirurgicos: string | null;
    heredofamiliares: string | null;
    ginecoObstetrico: ginecoObstetrico | null;
}

export type historialClinicoPaciente = {
    paciente: pacienteHistorialCompleto | null;
    alergias: alergia[];
    condicionesCronicas: condicionCronica[];
    antecedentesPatologicos: antecedentePatologico[];
    consultas: consultaHistorial[];
    estudios: estudioHistorial[];
    examenFisico: examenFisico | null;
}
