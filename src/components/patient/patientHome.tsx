import ListaEstudios from "./listaEstudios"
import type { estudio } from "../../types/estudio";

const mockEstudios: estudio[] = [
  {
    fotos: ["../../public/medex-logo.png"],
    tipoEstudio: "Radiografía de tórax",
    fecha: new Date("2024-05-20"),
    institucion: "Hospital Central",
    informe: "Informe de ejemplo 1",
  },
  {
    fotos: ["../../public/medex-logo.png"],
    tipoEstudio: "Tomografía computada",
    fecha: new Date("2023-11-10"),
    institucion: "Clínica San José",
    informe: "Informe de ejemplo 2",
  },
];

const PatientHome = () => {
  return (
    <main style={{ padding: 20 }}>
      <h1>Home Médico — Visualización de estudios</h1>
      <ListaEstudios estudios={mockEstudios} />
    </main>
  );
};

export default PatientHome;