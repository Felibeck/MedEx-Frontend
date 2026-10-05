import { useRef, useState, type ComponentType, type SVGProps } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRightIcon,
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'
import { formatearFechaDia, nombreCompleto } from '../../../utils/paciente'
import type { homePaciente } from '../../../types/homePaciente'
import './accesosRapidos.css'

interface AccesosRapidosProps {
  // null mientras carga o si el resumen no se pudo obtener: las tarjetas se
  // muestran igual, con un texto genérico en lugar de los datos del paciente.
  home: homePaciente | null
  loading?: boolean
}

type Acceso = {
  id: string
  Icono: ComponentType<SVGProps<SVGSVGElement>>
  chip: string | null
  titulo: string
  descripcion: string
  cta: string
  onClick: () => void
}

const SKELETONS = 2

const contar = (cantidad: number, singular: string, plural: string): string =>
  `${cantidad} ${cantidad === 1 ? singular : plural}`

const AccesosRapidos = ({ home, loading = false }: AccesosRapidosProps) => {
  const navigate = useNavigate()
  const trackRef = useRef<HTMLDivElement>(null)
  const [activo, setActivo] = useState(0)

  const ultimoEstudio = home?.estudiosRecientes[0]
  const ultimaReceta = home?.recetasRecientes[0]
  const ultimaConsulta = home?.ultimaConsulta
  const profesional = ultimaConsulta
    ? nombreCompleto(ultimaConsulta.profesional.nombre, ultimaConsulta.profesional.apellido)
    : ''

  const accesos: Acceso[] = [
    {
      id: 'estudios',
      Icono: ClipboardDocumentListIcon,
      chip: home
        ? home.totales.estudios > 0
          ? contar(home.totales.estudios, 'disponible', 'disponibles')
          : 'Sin estudios aún'
        : null,
      titulo: 'Mis estudios',
      descripcion: !home
        ? 'Análisis, imágenes e informes, todo en un solo lugar.'
        : ultimoEstudio
          ? `El más reciente: ${ultimoEstudio.titulo || ultimoEstudio.tipoEstudio || 'estudio'}, del ${formatearFechaDia(ultimoEstudio.fecha)}.`
          : 'Todavía no tenés estudios cargados. Cuando subas uno, lo vas a ver acá.',
      cta: 'Ver estudios',
      onClick: () => navigate('/patients'),
    },
    {
      id: 'recetas',
      Icono: DocumentTextIcon,
      chip: home
        ? home.totales.recetas > 0
          ? contar(home.totales.recetas, 'receta', 'recetas')
          : 'Sin recetas aún'
        : null,
      titulo: 'Mis recetas',
      descripcion: !home
        ? 'Las recetas que te cargan tus médicos, listas para abrir.'
        : ultimaReceta
          ? `La última: ${ultimaReceta.titulo}, del ${formatearFechaDia(ultimaReceta.fecha)}.`
          : 'Cuando tu médico cargue una receta, la vas a encontrar acá.',
      cta: 'Ver recetas',
      onClick: () => navigate('/recetas'),
    },
    {
      id: 'historial',
      Icono: HeartIcon,
      chip: home
        ? home.totales.consultas > 0
          ? contar(home.totales.consultas, 'consulta', 'consultas')
          : 'Sin consultas aún'
        : null,
      titulo: 'Historial clínico',
      descripcion: !home
        ? 'Tus consultas, antecedentes y datos de salud.'
        : ultimaConsulta
          ? `Tu última consulta fue el ${formatearFechaDia(ultimaConsulta.fecha)}${profesional ? ` con ${profesional}` : ''}.`
          : 'Tus consultas y antecedentes van a aparecer acá.',
      cta: 'Ver historial',
      onClick: () => navigate('/patients/historial'),
    },
    {
      id: 'subir',
      Icono: ArrowUpTrayIcon,
      chip: 'Imagen o PDF',
      titulo: 'Subir un estudio',
      descripcion: 'Guardá tus resultados en MedEx y tenelos siempre a mano. Hasta 10 MB por archivo.',
      cta: 'Subir estudio',
      // Cuidados abre el modal de carga cuando recibe este state.
      onClick: () => navigate('/patients', { state: { subirEstudio: true } }),
    },
  ]

  const total = loading ? SKELETONS : accesos.length

  // Distancia entre el inicio de una tarjeta y la siguiente (ancho + gap).
  const getPaso = (track: HTMLDivElement): number => {
    const [primera, segunda] = Array.from(track.children) as HTMLElement[]
    if (!primera) return 0
    return segunda ? segunda.offsetLeft - primera.offsetLeft : primera.offsetWidth
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const paso = getPaso(track)
    if (!paso) return

    const alFinal = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2
    const indice = alFinal ? total - 1 : Math.round(track.scrollLeft / paso)
    setActivo(Math.max(0, Math.min(total - 1, indice)))
  }

  const irA = (indice: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: indice * getPaso(track), behavior: 'smooth' })
  }

  return (
    <section className="accesos-rapidos" aria-label="Accesos rápidos">
      <div className="accesos-rapidos__header">
        <div className="accesos-rapidos__titulos">
          <h2 className="accesos-rapidos__title">Accesos rápidos</h2>
          <p className="accesos-rapidos__subtitle">¿Qué necesitás hacer hoy?</p>
        </div>

        <div className="accesos-rapidos__flechas">
          <button
            type="button"
            className="accesos-rapidos__flecha"
            onClick={() => irA(activo - 1)}
            disabled={activo === 0}
            aria-label="Anterior"
          >
            <ChevronLeftIcon className="accesos-rapidos__flecha-icon" />
          </button>
          <button
            type="button"
            className="accesos-rapidos__flecha"
            onClick={() => irA(activo + 1)}
            disabled={activo >= total - 1}
            aria-label="Siguiente"
          >
            <ChevronRightIcon className="accesos-rapidos__flecha-icon" />
          </button>
        </div>
      </div>

      <div className="accesos-rapidos__track" ref={trackRef} onScroll={handleScroll}>
        {loading
          ? Array.from({ length: SKELETONS }, (_, i) => (
              <div key={i} className="acceso-card acceso-card--skeleton" aria-hidden="true">
                <div className="acceso-card__top">
                  <div className="acceso-card__skeleton acceso-card__skeleton--icono" />
                  <div className="acceso-card__encabezado">
                    <div className="acceso-card__skeleton acceso-card__skeleton--chip" />
                    <div className="acceso-card__skeleton acceso-card__skeleton--titulo" />
                  </div>
                </div>
                <div className="acceso-card__skeleton acceso-card__skeleton--texto" />
                <div className="acceso-card__skeleton acceso-card__skeleton--boton" />
              </div>
            ))
          : accesos.map(({ id, Icono, chip, titulo, descripcion, cta, onClick }) => (
              <article key={id} className="acceso-card">
                <div className="acceso-card__top">
                  <div className="acceso-card__icon-wrap">
                    <Icono className="acceso-card__icon" />
                  </div>
                  <div className="acceso-card__encabezado">
                    {chip && <span className="acceso-card__chip">{chip}</span>}
                    <h3 className="acceso-card__titulo">{titulo}</h3>
                  </div>
                </div>

                <p className="acceso-card__descripcion">{descripcion}</p>

                <button type="button" className="acceso-card__cta" onClick={onClick}>
                  {cta}
                  <ArrowRightIcon className="acceso-card__cta-icon" />
                </button>
              </article>
            ))}
      </div>

      <div className="accesos-rapidos__dots">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`accesos-rapidos__dot${i === activo ? ' accesos-rapidos__dot--activo' : ''}`}
            onClick={() => irA(i)}
            aria-label={`Ir a la tarjeta ${i + 1} de ${total}`}
            aria-current={i === activo ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  )
}

export default AccesosRapidos
