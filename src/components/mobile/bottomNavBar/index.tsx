import { useLocation, useNavigate } from 'react-router-dom'
import IconInicioActivo from '../../../assets/icons/nav/inicio-activo.svg'
import IconInicioInactivo from '../../../assets/icons/nav/inicio-inactivo.svg'
import IconFamiliaActivo from '../../../assets/icons/nav/familia-activo.svg'
import IconFamiliaInactivo from '../../../assets/icons/nav/familia-inactivo.svg'
import IconCuidadosActivo from '../../../assets/icons/nav/cuidados-activo.svg'
import IconCuidadosInactivo from '../../../assets/icons/nav/cuidados-inactivo.svg'
import IconHistorialActivo from '../../../assets/icons/nav/historial-activo.svg'
import IconHistorialInactivo from '../../../assets/icons/nav/historial-inactivo.svg'
import IconPerfilActivo from '../../../assets/icons/nav/perfil-activo.svg'
import IconPerfilInactivo from '../../../assets/icons/nav/perfil-inactivo.svg'
import './bottomNavBar.css'

type TabId = 'inicio' | 'familia' | 'cuidados' | 'historial' | 'perfil'

const TABS: {
  id: TabId
  label: string
  path: string
  iconActive: string
  iconInactive: string
}[] = [
  { id: 'inicio',    label: 'Inicio',    path: '/patients/inicio',    iconActive: IconInicioActivo,    iconInactive: IconInicioInactivo    },
  { id: 'familia',   label: 'Familia',   path: '/patients/familia',   iconActive: IconFamiliaActivo,   iconInactive: IconFamiliaInactivo   },
  { id: 'cuidados',  label: 'Cuidados',  path: '/patients',           iconActive: IconCuidadosActivo,  iconInactive: IconCuidadosInactivo  },
  { id: 'historial', label: 'Historial', path: '/patients/historial', iconActive: IconHistorialActivo, iconInactive: IconHistorialInactivo },
  { id: 'perfil',    label: 'Perfil',    path: '/patients/perfil',    iconActive: IconPerfilActivo,    iconInactive: IconPerfilInactivo    },
]

function getActiveTab(pathname: string): TabId {
  if (pathname.startsWith('/patients/inicio'))    return 'inicio'
  if (pathname.startsWith('/patients/familia'))   return 'familia'
  if (pathname.startsWith('/patients/historial')) return 'historial' 
  if (pathname.startsWith('/patients/perfil'))    return 'perfil'
  if (pathname === '/patients' || pathname.startsWith('/patients/estudio/')) return 'cuidados'
  return 'historial'
}

const BottomNavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = getActiveTab(location.pathname)

  return (
    <nav className="bottom-nav-bar" aria-label="Navegación principal">
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className={`bottom-nav-bar__tab bottom-nav-bar__tab--${tab.id}${isActive ? ' bottom-nav-bar__tab--active' : ''}`}
            onClick={() => navigate(tab.path)}
            aria-current={isActive ? 'page' : undefined}
          >
            <img
              src={isActive ? tab.iconActive : tab.iconInactive}
              alt=""
              className="bottom-nav-bar__icon"
            />
            <span className="bottom-nav-bar__label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNavBar
