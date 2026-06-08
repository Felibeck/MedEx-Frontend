import { useState } from "react";
import axios from "axios";
import "./registroConsulta.css";

const RegistroConsulta = () => {
	const [otros, setOtros] = useState(""); //comentarios de la consulta
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
		setLoading(true);
		setResult(null);

		try {
			// Build the URL with query params as provided
			const base = "http://localhost:3000/api/doctors/consultas";
			const params = new URLSearchParams({
				otros: otros || "",
			});

			const url = `${base}?${params.toString()}`;

			// If the endpoint expects POST with body, adjust accordingly.
			const resp = await axios.post(url);

			setResult(JSON.stringify(resp.data));
		} catch (err: any) {
			setResult(err?.message || "Error");
		} finally {
			setLoading(false);
		} 
    }


	return (
		<div className="registro-consulta">
			<h2>Registro de Consulta</h2>
			<form onSubmit={handleSubmit} className="registro-form">
				<label>
					Comentarios de la consulta:
					<textarea value={otros} onChange={(e) => setOtros(e.target.value)} />
				</label>

				<button type="submit" disabled={loading}>Registrar</button>
			</form>

			{loading && <p>Enviando...</p>}
			{result && (
				<div className="registro-result">
					<h3>Respuesta</h3>
					<pre>{result}</pre>
				</div>
			)}      
		</div>
	);
};

export default RegistroConsulta;
