import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { uploadEstudio } from '../../../api/estudios'
import { getTiposEstudio, type TipoEstudioCatalogo } from '../../../api/catalogos'
import './subirEstudioModal.css'

const MAX_SIZE_BYTES = 10 * 1024 * 1024
const TIPOS_ACEPTADOS = ['image/', 'application/pdf']

type Props = {
  pacienteId: string
  onClose: () => void
  onSuccess: () => void
}

const validarArchivo = (file: File): string | null => {
  const tipoValido = TIPOS_ACEPTADOS.some((prefijo) => file.type.startsWith(prefijo))
  if (!tipoValido) return 'Solo se aceptan imágenes o archivos PDF.'
  if (file.size > MAX_SIZE_BYTES) return 'El archivo supera el máximo de 10MB.'
  return null
}

const SubirEstudioModal = ({ pacienteId, onClose, onSuccess }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [archivo, setArchivo] = useState<File | null>(null)
  const [archivoError, setArchivoError] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [tipoEstudioId, setTipoEstudioId] = useState('')
  const [fecha, setFecha] = useState('')
  const [institucion, setInstitucion] = useState('')
  const [notas, setNotas] = useState('')

  const [tiposEstudio, setTiposEstudio] = useState<TipoEstudioCatalogo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getTiposEstudio()
      .then((tipos) => {
        if (!cancelled) setTiposEstudio(tipos)
      })
      .catch(() => {
        if (!cancelled) setSubmitError('No se pudieron cargar las categorías de estudio')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleFile = (file: File) => {
    const err = validarArchivo(file)
    if (err) {
      setArchivoError(err)
      setArchivo(null)
      return
    }
    setArchivoError(null)
    setArchivo(file)
  }

  const puedeSubir =
    !!archivo && !archivoError && titulo.trim() !== '' && tipoEstudioId !== '' && fecha !== '' && !isSubmitting

  const handleSubmit = async () => {
    if (!archivo || !puedeSubir) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await uploadEstudio(pacienteId, {
        archivo,
        titulo: titulo.trim(),
        tipoEstudioId: Number(tipoEstudioId),
        fecha,
        institucion: institucion.trim() || undefined,
        notas: notas.trim() || undefined,
      })
      onSuccess()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setSubmitError(err.response?.data?.message ?? err.message)
      } else if (err instanceof Error) {
        setSubmitError(err.message)
      } else {
        setSubmitError('No se pudo subir el estudio')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="sem-overlay" role="dialog" aria-modal="true" aria-labelledby="sem-title">
      <div className="sem-card">
        <div className="sem-header">
          <h2 className="sem-header__titulo" id="sem-title">Subir Documento</h2>
          <button
            type="button"
            className="sem-header__close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="sem-header__close-icon" />
          </button>
        </div>

        <div className="sem-content">
          <div
            className={`sem-dropzone${archivo ? ' sem-dropzone--filled' : ''}`}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            aria-label="Área para subir foto o PDF"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf"
              className="sem-dropzone__input"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
            <div className="sem-dropzone__icon-wrap" aria-hidden="true">
              <CloudArrowUpIcon className="sem-dropzone__icon" />
            </div>
            {archivo ? (
              <>
                <span className="sem-dropzone__filename">{archivo.name}</span>
                <span className="sem-dropzone__cambiar">Click para cambiar el archivo</span>
              </>
            ) : (
              <>
                <span className="sem-dropzone__cta">Subir foto o PDF</span>
                <span className="sem-dropzone__hint">Tamaño max compatible: 10MB</span>
              </>
            )}
          </div>
          {archivoError && <p className="sem-error">{archivoError}</p>}

          <div className="sem-field">
            <label className="sem-field__label" htmlFor="sem-titulo">Título</label>
            <input
              id="sem-titulo"
              className="sem-field__input"
              type="text"
              placeholder="ej: Resultados Estudio de sangre"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="sem-row">
            <div className="sem-field">
              <label className="sem-field__label" htmlFor="sem-categoria">Categoría</label>
              <select
                id="sem-categoria"
                className="sem-field__input sem-field__select"
                value={tipoEstudioId}
                onChange={(e) => setTipoEstudioId(e.target.value)}
                required
              >
                <option value="" disabled>Seleccionar</option>
                {tiposEstudio.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>

            <div className="sem-field">
              <label className="sem-field__label" htmlFor="sem-fecha">Fecha</label>
              <input
                id="sem-fecha"
                className="sem-field__input"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="sem-field">
            <label className="sem-field__label" htmlFor="sem-institucion">Institución médica</label>
            <input
              id="sem-institucion"
              className="sem-field__input"
              type="text"
              placeholder="Ej: Laboratorio Stamboulian"
              value={institucion}
              onChange={(e) => setInstitucion(e.target.value)}
            />
          </div>

          <div className="sem-field">
            <label className="sem-field__label" htmlFor="sem-notas">Notas adicionales</label>
            <textarea
              id="sem-notas"
              className="sem-field__input sem-field__textarea"
              placeholder="Detalles específicos para recordar..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>

          {submitError && <p className="sem-error">{submitError}</p>}

          <button
            type="button"
            className="sem-submit"
            disabled={!puedeSubir}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Subiendo...' : 'Subir Documento'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubirEstudioModal
