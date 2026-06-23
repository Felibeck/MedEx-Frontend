import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientHome from "./patientHome";
import DoctorHome from "./doctorHome";
import DetalleEstudioPage from "./pages/mobile/DetalleEstudioPage";
import PatientLogin from "./pages/mobile/PatientLogin";
import PatientSignup from "./pages/mobile/PatientSignup";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/patients/login" element={<PatientLogin />} />
      <Route path="/patients/signup" element={<PatientSignup />} />
      <Route path="/patients" element={<PatientHome />} />
      <Route path="/patients/estudio/:estudioId" element={<DetalleEstudioPage />} />
      <Route path="/doctor" element={<DoctorHome />} />
    </Routes>
  );
};

export default App;
