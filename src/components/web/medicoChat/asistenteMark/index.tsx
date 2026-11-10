import type { CSSProperties } from 'react'
import './asistenteMark.css'

type Props = {
  size: number
  showSecondSpark?: boolean
}

// Estrella de cuatro puntas (viewBox 24)
const Spark = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C12.8 6.5 17.5 11.2 24 12C17.5 12.8 12.8 17.5 12 24C11.2 17.5 6.5 12.8 0 12C6.5 11.2 11.2 6.5 12 0Z" />
  </svg>
)

// Marca del asistente: logo de MedEx + destello de IA, sin contenedor. Todo es decorativo
// (alt vacío, SVG aria-hidden): el texto "Asistente:" lo anuncia el chat para lectores de pantalla.
const AsistenteMark = ({ size, showSecondSpark = false }: Props) => (
  <span className="am" style={{ '--am-size': `${size}px` } as CSSProperties}>
    <img className="am__logo" src="/medex-logo.png" alt="" />
    <Spark className="am__spark am__spark--grande" />
    {showSecondSpark && <Spark className="am__spark am__spark--chico" />}
  </span>
)

export default AsistenteMark
