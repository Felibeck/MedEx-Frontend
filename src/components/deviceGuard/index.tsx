import { useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceType } from '../../hooks/useDeviceType'
import { resolveHomePath } from '../../utils/session'

/**
 * ⚠️ ESTO NO ES UN MECANISMO DE SEGURIDAD ⚠️
 *
 * DeviceGuard es una redirección de UX por conveniencia: manda al usuario a la
 * superficie que corresponde al tamaño de su ventana (angosta → vista Paciente,
 * ancha → vista Médico). El ancho de ventana es completamente manipulable por
 * el usuario (DevTools, device toolbar, redimensionar la ventana), así que
 * cualquiera puede saltearse esta redirección.
 *
 * La protección real de acceso sigue siendo `requireMedico` / `requirePaciente`
 * en el backend, que ya existe y no se toca acá. Nunca poner acá lógica de la
 * que dependa la autorización.
 */

const DOCTOR_PREFIXES = ['/doctor', '/doctors']
const PATIENT_PREFIXES = ['/patients']

const startsWithAny = (pathname: string, prefixes: string[]): boolean =>
  prefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))

type Props = {
  children: ReactNode
}

const DeviceGuard = ({ children }: Props) => {
  const deviceType = useDeviceType()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Se re-evalúa ante cada cambio de deviceType: si el usuario redimensiona la
  // ventana cruzando el breakpoint estando en una vista que ya no corresponde,
  // lo sacamos en el momento.
  useEffect(() => {
    // En mobile no tiene sentido la vista de médico (layout desktop, sidebar).
    if (deviceType === 'mobile' && startsWithAny(pathname, DOCTOR_PREFIXES)) {
      navigate(resolveHomePath('mobile'), { replace: true })
      return
    }

    // En desktop no tiene sentido la vista de paciente (mobile-first, 390px).
    if (deviceType === 'desktop' && startsWithAny(pathname, PATIENT_PREFIXES)) {
      navigate(resolveHomePath('desktop'), { replace: true })
    }
  }, [deviceType, pathname, navigate])

  return <>{children}</>
}

export default DeviceGuard
