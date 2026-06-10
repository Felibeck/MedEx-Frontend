// src/components/web/searchBar/index.tsx
import { useState } from "react";
import axios from "axios";
import type { paciente } from "../../../types/paciente";
import "./searchBar.css";

type Props = {
    onPacienteEncontrado: (paciente: paciente) => void;
};

const SearchBar = ({ onPacienteEncontrado }: Props) => {
    const [dni, setDni] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarPaciente = async () => {
        if (!dni.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const resp = await axios.get(
                "http://localhost:3000/api/doctors/pacientes/buscar",
                { params: { dni } }
            );
            onPacienteEncontrado(resp.data.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setError("No se encontró ningún paciente con ese DNI.");
            } else {
                setError("Error al conectar con el servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") buscarPaciente();
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                className="search-bar__input"
                placeholder="Buscar paciente por DNI..."
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button
                type="button"
                className="search-bar__btn"
                onClick={buscarPaciente}
                disabled={loading || !dni.trim()}
            >
                {loading ? "Buscando..." : "Buscar"}
            </button>

            {error && <p className="search-bar__error">{error}</p>}
        </div>
    );
};

export default SearchBar;