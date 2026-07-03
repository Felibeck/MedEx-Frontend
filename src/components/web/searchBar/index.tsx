import { useState } from "react";
import { api } from "../../../api/client";
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
            const resp = await api.get("/doctors/pacientes/buscar", {
                params: { dni },
            });
            onPacienteEncontrado(resp.data.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setError("No se encontró ningún paciente con ese DNI.");
            } else if (axios.isAxiosError(err) && err.response?.status === 401) {
                setError("No autorizado. Por favor inicia sesión como doctor.");
            } else {
                setError("Error al conectar con el servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!loading && dni.trim()) buscarPaciente();
        }
    };

    const limpiar = () => {
        setDni("");
        setError(null);
    };

    return (
        <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
                type="text"
                className="doctor-search"
                placeholder="Buscar paciente por DNI..."
                value={dni}
                onChange={(e) => { setDni(e.target.value); setError(null); }}
                onKeyDown={handleKeyDown}
            />
            {dni && (
                <button
                    type="button"
                    className="search-bar__btn-clear"
                    onClick={limpiar}
                    aria-label="Limpiar búsqueda"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            )}
            <button
                type="button"
                className="search-bar__btn--hidden"
                onClick={buscarPaciente}
                disabled={loading || !dni.trim()}
            >
                {loading ? "Buscando..." : "Buscar"}
            </button>

            {error && <p className="search-bar__error">{error}</p>}
        </>
    );
};

export default SearchBar;