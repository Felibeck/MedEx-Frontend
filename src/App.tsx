import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientHome from "./patientHome";
import DoctorHome from "./doctorHome";
import DetalleEstudioPage from "./pages/mobile/DetalleEstudioPage";

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

export default App;