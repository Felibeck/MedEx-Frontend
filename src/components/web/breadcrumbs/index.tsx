import { Fragment } from 'react'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import './breadcrumbs.css'

export type BreadcrumbItem = {
  label: string
  onClick?: () => void
}

type Props = {
  items: BreadcrumbItem[]
}

/**
 * Migas de pan de la vista médico. Representa la jerarquía lógica del sitio
 * (Inicio > Pacientes > Ficha de X), no el historial de navegación del usuario.
 * El último item siempre es la pantalla actual: se renderiza como texto, sin
 * click ni estilo de link, aunque venga con `onClick`.
 */
const Breadcrumbs = ({ items }: Props) => {
  if (items.length === 0) return null

  return (
    <nav className="breadcrumbs" aria-label="Ubicación">
      <ol className="breadcrumbs__lista">
        {items.map((item, i) => {
          const esActual = i === items.length - 1

          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className="breadcrumbs__item">
                {esActual || !item.onClick ? (
                  <span
                    className="breadcrumbs__actual"
                    aria-current={esActual ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <button type="button" className="breadcrumbs__link" onClick={item.onClick}>
                    {item.label}
                  </button>
                )}
              </li>
              {!esActual && (
                <li className="breadcrumbs__sep" aria-hidden="true">
                  <ChevronRightIcon className="breadcrumbs__chevron" />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
