import { useLocation, useNavigate } from 'react-router-dom'
import './bottomNavBar.css'

const ICON_INICIO_ACTIVE    = 'https://www.figma.com/api/mcp/asset/94039aa8-f7fb-46ce-a9ed-b4bf3f4c179a'
const ICON_INICIO_INACTIVE  = 'https://www.figma.com/api/mcp/asset/e6c49f19-8017-4536-b4be-05677505d2ed'
const ICON_FAMILIA_ACTIVE   = 'https://www.figma.com/api/mcp/asset/7019d102-64d1-47a7-b1cc-d68f29951e5c'
const ICON_FAMILIA_INACTIVE = 'https://www.figma.com/api/mcp/asset/ddbb40a8-6bbb-42b9-8b60-b4833ec78150'
const ICON_CUIDADOS_ACTIVE  = 'https://www.figma.com/api/mcp/asset/11117ef5-3c46-49cd-9bcb-038d5bf4f644'
const ICON_CUIDADOS_INACTIVE= 'https://www.figma.com/api/mcp/asset/bb610824-946a-4881-b0ed-abf3b570f580'
const ICON_HISTORIAL_ACTIVE = 'https://www.figma.com/api/mcp/asset/18e7aaf4-f986-4f35-8b79-ba79f6481bb4'
const ICON_HISTORIAL_INACTIVE='https://www.figma.com/api/mcp/asset/2df73337-410b-493b-86c3-48d53afd0b8c'
const ICON_PERFIL_ACTIVE    = 'https://www.figma.com/api/mcp/asset/9390c5a9-e604-4ddc-a612-a8fb07255768'
const ICON_PERFIL_INACTIVE  = 'https://www.figma.com/api/mcp/asset/89aaa36f-cb8d-4201-ba31-a7c6b44c9387'

type TabId = 'inicio' | 'familia' | 'cuidados' | 'historial' | 'perfil'

const TABS: {
  id: TabId
  label: string
  path: string
  iconActive: string
  iconInactive: string
}[] = [
  { id: 'inicio',    label: 'Inicio',    path: '/patients/inicio',    iconActive: ICON_INICIO_ACTIVE,    iconInactive: ICON_INICIO_INACTIVE    },
  { id: 'familia',   label: 'Familia',   path: '/patients/familia',   iconActive: ICON_FAMILIA_ACTIVE,   iconInactive: ICON_FAMILIA_INACTIVE   },
<<<<<<< HEAD
  { id: 'cuidados',  label: 'Cuidados',  path: '/patients',           iconActive: ICON_CUIDADOS_ACTIVE,  iconInactive: ICON_CUIDADOS_INACTIVE  },
  { id: 'historial', label: 'Historial', path: '/patients/historial', iconActive: ICON_HISTORIAL_ACTIVE, iconInactive: ICON_HISTORIAL_INACTIVE },
=======
  { id: 'cuidados',  label: 'Cuidados',  path: '/patients',  iconActive: ICON_CUIDADOS_ACTIVE,  iconInactive: ICON_CUIDADOS_INACTIVE  },
  { id: 'historial', label: 'Historial', path: '/patients/historial',           iconActive: ICON_HISTORIAL_ACTIVE, iconInactive: ICON_HISTORIAL_INACTIVE },
>>>>>>> 7ee4a7a6bb4155dbadabe4bfbf7b7d7666e25bf1
  { id: 'perfil',    label: 'Perfil',    path: '/patients/perfil',    iconActive: ICON_PERFIL_ACTIVE,    iconInactive: ICON_PERFIL_INACTIVE    },
]

function getActiveTab(pathname: string): TabId {
<<<<<<< HEAD
  if (pathname.startsWith('/patients/inicio'))    return 'inicio'
  if (pathname.startsWith('/patients/familia'))   return 'familia'
  if (pathname.startsWith('/patients/historial')) return 'historial'
  if (pathname.startsWith('/patients/perfil'))    return 'perfil'
  if (pathname === '/patients' || pathname.startsWith('/patients/estudio/')) return 'cuidados'
  return 'historial'
=======
  if (pathname.startsWith('/patients/inicio'))   return 'inicio'
  if (pathname.startsWith('/patients/familia'))  return 'familia'
  if (pathname.startsWith('/patients/historial')) return 'historial'
  if (pathname.startsWith('/patients/perfil'))   return 'perfil'
  return 'cuidados'
>>>>>>> 7ee4a7a6bb4155dbadabe4bfbf7b7d7666e25bf1
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
