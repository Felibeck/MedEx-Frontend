import { useRef, useState } from 'react'
import './cargarRecetaModal.css'

type Props = {
  nombrePaciente: string
  onSubir: (archivo: File, titulo: string) => void
  onCancelar: () => void
}

const CargarRecetaModal = ({ nombrePaciente, onSubir, onCancelar }: Props) => {
  const [archivo, setArchivo] = useState<File | null>(null)
  const [titulo, setTitulo] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validarArchivo = (file: File): string | null => {
    if (file.type !== 'application/pdf') return 'Solo se aceptan archivos PDF.'
    if (file.size > 10 * 1024 * 1024) return 'El archivo supera el máximo de 10 MB.'
    return null
  }

  const handleFile = (file: File) => {
    const err = validarArchivo(file)
    if (err) { setError(err); return }
    setError(null)
    setArchivo(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSubmit = () => {
    if (!archivo) { setError('Debe seleccionar un archivo PDF.'); return }
    onSubir(archivo, titulo.trim())
  }

  return (
    <div className="rcm-overlay" role="dialog" aria-modal="true" aria-labelledby="rcm-title">
      <div className="rcm-card">

        {/* Header */}
        <div className="rcm-header">
          <div className="rcm-header__avatar" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z"/>
              <path d="M12 13.6c-4.8 0-8.4 2.4-8.4 5.4v1.2h16.8V19c0-3-3.6-5.4-8.4-5.4z"/>
            </svg>
          </div>
          <div className="rcm-header__info">
            <span className="rcm-header__nombre">{nombrePaciente}</span>
          </div>
          <button className="rcm-header__close" onClick={onCancelar} aria-label="Cerrar modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="rcm-body">
          <h2 className="rcm-body__titulo" id="rcm-title">Cargar Receta PDF</h2>
          <p className="rcm-body__subtitulo">
            Suba el archivo de la prescripción para guardarlo en la historia clínica.
          </p>

          {/* Nombre de la receta */}
          <div className="rcm-field">
            <label className="rcm-field__label" htmlFor="rcm-titulo">NOMBRE DE LA RECETA</label>
            <input
              id="rcm-titulo"
              className="rcm-field__input"
              type="text"
              placeholder="Ej: Receta Médica - Cardiología"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
            />
          </div>

          {/* Drop zone */}
          <div
            className={`rcm-dropzone${dragOver ? ' rcm-dropzone--over' : ''}${archivo ? ' rcm-dropzone--filled' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
            aria-label="Área para subir PDF"
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="rcm-dropzone__input"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
            <div className="rcm-dropzone__icon-wrap" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f6f6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 12 15 15"/>
              </svg>
              <span className="rcm-dropzone__pdf-badge">PDF</span>
            </div>
            {archivo ? (
              <span className="rcm-dropzone__filename">{archivo.name}</span>
            ) : (
              <>
                <span className="rcm-dropzone__cta">Click para seleccionar o arrastre el archivo</span>
                <span className="rcm-dropzone__hint">Solo archivos PDF (Máx. 10MB)</span>
              </>
            )}
          </div>

          {error && <p className="rcm-error">{error}</p>}
        </div>

        {/* Footer */}
        <div className="rcm-footer">
          <button className="rcm-btn rcm-btn--ghost" type="button" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="rcm-btn rcm-btn--primary" type="button" onClick={handleSubmit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Subir Receta
          </button>
        </div>

      </div>
    </div>
  )
}

export default CargarRecetaModal
