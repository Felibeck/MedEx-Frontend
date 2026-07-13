import { useState } from 'react'
import type { historialTabla } from '../../../types/historialClinico'
import type { historialPayload } from '../../../api/doctors'
import { guardarHistorial } from '../../../api/doctors'

type Props = {
  pacienteId: string
  historialActual: historialTabla | null
  onGuardado: (historial: historialTabla) => void
  onCancelar: () => void
}

const CAMPOS: { key: keyof historialPayload; label: string; placeholder: string }[] = [
  { key: 'ant',   label: 'Antecedentes personales (médicos y clínicos)', placeholder: 'Ej: Hipertensión arterial diagnosticada en 2018, rinitis estacional...' },
  { key: 'ago',   label: 'Antecedentes gineco-obstétricos',              placeholder: 'Ej: Menarca a los 13 años, fórmula obstétrica G2P1...' },
  { key: 'ahf',   label: 'Antecedentes heredofamiliares',                placeholder: 'Ej: Madre con diabetes tipo 2, padre con HTA...' },
  { key: 'mx',    label: 'Mamografía',                                   placeholder: 'Ej: Mamografía 03/2024, BIRADS 1, sin hallazgos...' },
  { key: 'eco',   label: 'Ecografía',                                    placeholder: 'Ej: Ecografía abdominal 03/2024 sin hallazgos...' },
  { key: 'ef',    label: 'Examen físico',                                placeholder: 'Ej: TA 135/85 mmHg, peso 68kg, talla 1.64m, IMC 25.3...' },
  { key: 'otros', label: 'Otros antecedentes o información relevante',   placeholder: 'Cualquier otra información relevante...' },
]

const FormHistorial = ({ pacienteId, historialActual, onGuardado, onCancelar }: Props) => {
  const [form, setForm] = useState<historialPayload>({
    ant:   historialActual?.ant   ?? null,
    ago:   historialActual?.ago   ?? null,
    ahf:   historialActual?.ahf   ?? null,
    mx:    historialActual?.mx    ?? null,
    eco:   historialActual?.eco   ?? null,
    ef:    historialActual?.ef    ?? null,
    otros: historialActual?.otros ?? null,
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (key: keyof historialPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value.trim() === '' ? null : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const resultado = await guardarHistorial(pacienteId, form)
      onGuardado(resultado)
    } catch {
      setError('No se pudo guardar el historial. Intentá de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="form-historial" onSubmit={handleSubmit}>
      <div className="form-historial__header">
        <h3 className="form-historial__titulo">
          {historialActual?.id ? 'Editar Historial Clínico' : 'Crear Historial Clínico'}
        </h3>
        <p className="form-historial__subtitulo">
          Completá solo los campos que correspondan. Los campos vacíos se guardarán como sin datos.
        </p>
      </div>

      <div className="form-historial__campos">
        {CAMPOS.map(({ key, label, placeholder }) => (
          <div key={key} className="form-historial__campo">
            <label className="form-historial__label" htmlFor={`historial-${key}`}>
              {label}
            </label>
            <textarea
              id={`historial-${key}`}
              className="form-historial__textarea"
              rows={3}
              placeholder={placeholder}
              value={form[key] ?? ''}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {error && <p className="form-historial__error">{error}</p>}

      <div className="form-historial__acciones">
        <button
          type="button"
          className="form-historial__btn form-historial__btn--cancelar"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="form-historial__btn form-historial__btn--guardar"
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar historial'}
        </button>
      </div>
    </form>
  )
}

export default FormHistorial
