import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 80 }}>
      <h1>Bienvenido</h1>
      <Link to="/patients">
        <button>Vista Paciente</button>
      </Link>
      <Link to="/doctor">
        <button>Vista Doctor</button>
      </Link>
    </div>
  );
};

export default HomePage;