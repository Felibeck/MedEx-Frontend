// src/components/web/registroConsulta/index.tsx
import { useState } from "react";
import axios from "axios";
import "./registroConsulta.css";

type Props = {
    pacienteId: string; // antes era number
    onGuardado?: () => void;
};

const RegistroConsulta = ({ pacienteId, onGuardado }: Props) => {
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [recordatorio, setRecordatorio] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (esBorrador: boolean) => {
        setLoading(true);
        setError(null);

        try {
            await axios.post("http://localhost:3000/api/doctors/consultas", {
                pacienteId,
                otros: motivoConsulta,
                recordatorioProximaCita: recordatorio,
                borrador: esBorrador,
            });

            onGuardado?.();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.message);
            } else {
                setError("Error inesperado");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-consulta">
            <h2 className="registro-consulta__titulo">Registro de Consulta</h2>

            <section className="registro-consulta__seccion">
                <p className="registro-consulta__label">Motivo de consulta y síntomas</p>
                <textarea
                    className="registro-consulta__textarea"
                    placeholder="Describa el cuadro actual del paciente..."
                    value={motivoConsulta}
                    onChange={(e) => setMotivoConsulta(e.target.value)}
                    rows={4}
                />
            </section>

            {/* <section className="registro-consulta__acciones-grid">
                <button type="button" className="registro-consulta__accion-btn">
                    <span className="registro-consulta__accion-icon">📋</span>
                    Cargar Receta
                </button>
                <button type="button" className="registro-consulta__accion-btn">
                    <span className="registro-consulta__accion-icon">✅</span>
                    Cargar Diagnóstico
                </button>
                <button type="button" className="registro-consulta__accion-btn">
                    <span className="registro-consulta__accion-icon">🔬</span>
                    Solicitar Estudio
                </button>
            </section> */}

            <section className="registro-consulta__recordatorio">
                <div className="registro-consulta__recordatorio-info">
                    <span className="registro-consulta__recordatorio-icon">📅</span>
                    <span>Recordatorio Próxima Cita</span>
                </div>
                <label className="registro-consulta__toggle">
                    <input
                        type="checkbox"
                        checked={recordatorio}
                        onChange={(e) => setRecordatorio(e.target.checked)}
                    />
                    <span className="registro-consulta__toggle-slider" />
                </label>
            </section>

            {error && <p className="registro-consulta__error">{error}</p>}

            <div className="registro-consulta__footer">
                <button
                    type="button"
                    className="registro-consulta__btn-borrador"
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                >
                    Guardar como Borrador
                </button>
                <button
                    type="button"
                    className="registro-consulta__btn-guardar"
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Finalizar y Guardar Consulta"}
                </button>
            </div>
        </div>
    );
};

export default RegistroConsulta;