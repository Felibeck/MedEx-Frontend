import { useState } from "react";
import type { corte } from "../../../types/corte";
import "./carruselFotos.css";

type CarruselFotosProps = {
    cortes: corte[];
    nombreEstudio?: string;
};

const ORDINAL = [
    "Primer", "Segundo", "Tercer", "Cuarto", "Quinto",
    "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo",
];

const getTipoCorte = (index: number): string => {
    const ordinal = ORDINAL[index] ?? `${index + 1}°`;
    return `${ordinal} Corte - Axial`;
};

const CarruselFotos = ({ cortes }: CarruselFotosProps) => {
    const [indexActual, setIndexActual] = useState(0);

    if (!cortes || cortes.length === 0) return null;

    const corteActual = cortes[indexActual];

    const anterior = () =>
        setIndexActual((prev) => (prev - 1 + cortes.length) % cortes.length);

    const siguiente = () =>
        setIndexActual((prev) => (prev + 1) % cortes.length);

    return (
        <div className="carrusel-wrapper">
            {/* Header con metadata */}
            <div className="carrusel-meta">
                <span>ID: #MED-982-S</span>
                <span>DOB: 14/05/1978</span>
                <span>TE: 12.0ms | TR: 450ms | Series: AX T2 W</span>
                <span>Slice: {indexActual + 1}/{cortes.length}</span>
            </div>

            {/* Imagen principal */}
            <div className="carrusel-imagen-wrapper">
                <button
                    className="carrusel-btn carrusel-btn--prev"
                    onClick={anterior}
                    aria-label="Imagen anterior"
                >
                    &#8249;
                </button>

                <img
                    className="carrusel-imagen"
                    src={corteActual.imagen}
                    alt={corteActual.label}
                />

                <button
                    className="carrusel-btn carrusel-btn--next"
                    onClick={siguiente}
                    aria-label="Imagen siguiente"
                >
                    &#8250;
                </button>
            </div>

            {/* Label del corte actual */}
            <div className="carrusel-label">{getTipoCorte(indexActual)}</div>

            {/* Tira de miniaturas */}
            <div className="carrusel-footer">
                <p className="carrusel-footer__titulo">
                    SECUENCIA DE CORTES
                    <span className="carrusel-footer__count">
                        {cortes.length} Imágenes cargadas
                    </span>
                </p>
                <div className="carrusel-miniaturas">
                    {cortes.map((corte, i) => (
                        <button
                            key={corte.id}
                            className={`miniatura ${i === indexActual ? "miniatura--activa" : ""}`}
                            onClick={() => setIndexActual(i)}
                            aria-label={`Ir al corte ${corte.label}`}
                        >
                            <img src={corte.imagen} alt={corte.label} />
                            <span>{corte.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarruselFotos;