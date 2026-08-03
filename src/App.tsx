import { Navigate, Route, Routes } from "react-router-dom";
import PatientHome from "./patientHome";
import DoctorHome from "./doctorHome";
import PacienteDetalle from "./pacienteDetalle";
import DetalleEstudioPage from "./pages/mobile/DetalleEstudioPage";
import PatientLogin from "./pages/mobile/PatientLogin";
import PatientSignup from "./pages/mobile/PatientSignup";
import DoctorLogin from "./pages/doctor/DoctorLogin";
import HistorialClinico from "./components/mobile/historialClinico";
import RecetasScreen from "./components/mobile/recetasScreen";
import DeviceGuard from "./components/deviceGuard";
import { useDeviceType } from "./hooks/useDeviceType";
import { resolveHomePath } from "./utils/session";

/**
 * "/" ya no muestra una pantalla de selección de vista: manda directo a la
 * superficie que corresponde al ancho de pantalla. Es solo conveniencia de UX
 * (ver el comentario de seguridad en components/deviceGuard).
 */
const RootRedirect = () => {
  const deviceType = useDeviceType();
  return <Navigate to={resolveHomePath(deviceType)} replace />;
};

const App = () => {
  return (
    <DeviceGuard>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/patients/login" element={<PatientLogin />} />
        <Route path="/patients/signup" element={<PatientSignup />} />
        <Route path="/patients" element={<PatientHome />} />
        <Route path="/patients/historial" element={<HistorialClinico />} />
        <Route path="/recetas" element={<RecetasScreen />} />
        <Route path="/patients/estudio/:estudioId" element={<DetalleEstudioPage />} />
        <Route path="/doctors/login" element={<DoctorLogin />} />
        {/* <Route path="/doctors/register" element={<DoctorSignup />} /> */}
        <Route path="/doctor" element={<DoctorHome />} />
        <Route path="/doctor/pacientes/:pacienteId" element={<PacienteDetalle />} />
      </Routes>
    </DeviceGuard>
  );
};

export default App;
