import { useState } from "react";
import type PatientHome from "../mobile/patientHome";
import SearchBar from "./searchBar";

const doctorHome = () => {

    const [dni, setDni] = useState("");

  return (
    <main style={{ padding: 20 }}>
      <h1>Pagina del medico</h1>
      <SearchBar setDni={setDni} />
        <h1>{dni}</h1>
    </main>

  );
};

export default doctorHome;