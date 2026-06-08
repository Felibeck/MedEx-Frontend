import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import PatientHome from "./components/mobile/patientHome";
import DoctorHome from "./components/web/doctorHome";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/patients" element={<PatientHome />} />
      <Route path="/doctor" element={<DoctorHome />} />
    </Routes>
  );
};

export default App;