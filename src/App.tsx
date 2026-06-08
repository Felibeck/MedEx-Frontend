import { Route, Routes } from "react-router-dom";
import PatientHome from "./components/patient/patientHome";

const App = () => {
return (
  <Routes>
    <Route path="/" element={<PatientHome />} />
    <Route path="/patients" element={<PatientHome />} />
  </Routes>
)};

export default App;