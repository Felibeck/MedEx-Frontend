// src/doctorHome.tsx
import { useState } from "react";
import SearchBar from "./components/web/searchBar";
import RegistroConsulta from "./components/web/registroConsulta";
import type { paciente } from "./types/paciente";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientHome from "./patientHome";
import DoctorHome from "./doctorHome";
import DetalleEstudioPage from "./pages/mobile/DetalleEstudioPage";

const DoctorHome = () => {
    const [paciente, setPaciente] = useState<paciente | null>(null);

    return (
        <main style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
            <h1>Panel del Médico</h1>

            <SearchBar onPacienteEncontrado={setPaciente} />

            {paciente && (
    <div>
        <h2>Paciente encontrado</h2>
        <p>{paciente.nombre} {paciente.apellido} — DNI: {paciente.dni}</p>
        {/* <RegistroConsulta pacienteId={Number(paciente.paciente_id)} /> */}
    </div>
)}
            
        </main>
    );
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/patients" element={<PatientHome />} />
      <Route path="/patients/estudio/:id" element={<DetalleEstudioPage />} />
      <Route path="/doctor" element={<DoctorHome />} />
    </Routes>
  );
};

export default DoctorHome;