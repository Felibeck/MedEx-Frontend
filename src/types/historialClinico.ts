// src/types/historialClinico.ts
// Shape real de GET /doctors/pacientes/:pacienteId/historial (doctor-repository.js#getHistorialClinico)

export type fichaPaciente = {
    paciente_id: string;
    dni: string;
    fecha_nacimiento: string | null;
    identidad_genero: string | null;
    telefono: string | null;
    obra_social: string | null;
    cobertura_estado: string;
    foto_perfil: string | null;
    grupo_sanguineo: string | null;
    nombre: string | null;
    apellido: string | null;
    email: string | null;
}

export type alergia = {
    id: string;
    nombre: string;
}

export type condicionCronica = {
    id: string;
    nombre: string;
}

export type prescripcion = {
    id: string;
    consulta_id: string;
    medicamento: string;
    indicaciones: string | null;
    activa: boolean;
}

export type adjuntoConsulta = {
    id: string;
    nombre_archivo: string | null;
    url_archivo: string | null;
}

export type consultaHistorial = {
    id: string;
    fecha: string;
    diagnostico: string | null;
    notas: string | null;
    solicitud_estudio: boolean;
    solicitud_receta: boolean;
    solicitud_citaprox: boolean;
    profesional: {
        id: string;
        matricula: string;
        especialidad_medica: string | null;
        usuario: { nombre: string; apellido: string } | null;
    } | null;
    organizacion: { nombre: string } | null;
    prescripciones: prescripcion[];
    adjuntos: adjuntoConsulta[];
}

export type estudioHistorial = {
    id: string;
    consulta_id: string | null;
    nombre_archivo: string | null;
    url_archivo: string | null;
    tipo_estudio: string | null;
    fecha: string;
    institucion: string | null;
    descripcion: string | null;
}

export type antecedentePatologicoDoc = {
    id: string;
    nombre: string;
}

export type ginecoObstetricoDoc = {
    menarcaEdad: number | null;
    formulaObstetrica: string | null;
    ultimoPapFecha: string | null;
    ultimoPapResultado: string | null;
}

export type examenFisicoDoc = {
    presionArterial: string | null;
    pesoKg: number | null;
    tallaM: number | null;
    imc: number | null;
    fecha: string | null;
}

export type fichaPacienteCompleta = fichaPaciente & {
    antecedentesQuirurgicos: string | null;
    heredofamiliares: string | null;
    ginecoObstetrico: ginecoObstetricoDoc | null;
}

export type historialClinico = {
    paciente: fichaPacienteCompleta | null;
    alergias: alergia[];
    condicionesCronicas: condicionCronica[];
    antecedentesPatologicos: antecedentePatologicoDoc[];
    consultas: consultaHistorial[];
    estudios: estudioHistorial[];
    examenFisico: examenFisicoDoc | null;
}
