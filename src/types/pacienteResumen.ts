// src/types/pacienteResumen.ts
// Shape real de GET /doctors/mis-pacientes (doctor-repository.js#getPacientesByProfesional)
export type pacienteResumen = {
    paciente_id: string;
    dni: string;
    fecha_nacimiento: string | null;
    telefono: string | null;
    identidad_genero: string | null;
    obra_social: string | null;
    cobertura_estado: string;
    nombre: string | null;
    apellido: string | null;
    email: string | null;
    ultima_consulta: string | null;
}
