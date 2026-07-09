import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientHome from "./patientHome";
import DoctorHome from "./doctorHome";
import PacienteDetalle from "./pacienteDetalle";
import DetalleEstudioPage from "./pages/mobile/DetalleEstudioPage";
import PatientLogin from "./pages/mobile/PatientLogin";
import PatientSignup from "./pages/mobile/PatientSignup";
import DoctorLogin from "./pages/doctor/DoctorLogin";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/patients/login" element={<PatientLogin />} />
      <Route path="/patients/signup" element={<PatientSignup />} />
      <Route path="/patients" element={<PatientHome />} />
      <Route path="/patients/estudio/:estudioId" element={<DetalleEstudioPage />} />
      <Route path="/doctors/login" element={<DoctorLogin />} />
      {/* <Route path="/doctors/register" element={<DoctorSignup />} /> */}
      <Route path="/doctor" element={<DoctorHome />} />
      <Route path="/doctor/pacientes/:pacienteId" element={<PacienteDetalle />} />
    </Routes>
  );
};

export default App;
