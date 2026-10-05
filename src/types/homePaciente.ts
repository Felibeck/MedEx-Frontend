// src/types/homePaciente.ts
// Datos de la pantalla Inicio del paciente (GET /patients/me/home), ya mapeados.

export type profesionalHome = {
    nombre: string | null;
    apellido: string | null;
    especialidad: string | null;
}

export type pacienteHome = {
    nombre: string | null;
    apellido: string | null;
    obraSocial: string | null;
    coberturaEstado: string;
}

export type ultimaConsultaHome = {
    id: string;
    fecha: string;
    tipoConsulta: string | null;
    diagnostico: string | null;
    profesional: profesionalHome;
    organizacion: string | null;
}

export type tipoPendienteHome = 'cita_seguimiento' | 'estudio_solicitado'

export type pendienteHome = {
    tipo: tipoPendienteHome;
    consultaId: string;
    fecha: string;
    profesional: profesionalHome;
}

export type recetaHome = {
    id: string;
    titulo: string;
    fecha: string;
    url: string | null;
}

export type estudioHome = {
    id: string;
    titulo: string | null;
    tipoEstudio: string | null;
    fecha: string;
    institucion: string | null;
}

export type totalesHome = {
    consultas: number;
    estudios: number;
    recetas: number;
}

export type homePaciente = {
    paciente: pacienteHome;
    ultimaConsulta: ultimaConsultaHome | null;
    pendientes: pendienteHome[];
    totales: totalesHome;
    recetasRecientes: recetaHome[];
    estudiosRecientes: estudioHome[];
}
