import { useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeviceType } from '../../hooks/useDeviceType'
import { resolveHomePath, clearMedicoSession, clearPatientSession } from '../../utils/session'

/**
 * ⚠️ ESTO NO ES UN MECANISMO DE SEGURIDAD ⚠️
 *
 * DeviceGuard es una redirección de UX por conveniencia: manda al usuario a la
 * superficie que corresponde al tamaño de su ventana (angosta → vista Paciente,
 * ancha → vista Médico). El ancho de ventana es completamente manipulable por
 * el usuario (DevTools, device toolbar, redimensionar la ventana), así que
 * cualquiera puede saltearse esta redirección.
 *
 * Además de redirigir, limpia del localStorage la sesión del rol que ya no
 * corresponde al dispositivo actual (clearMedicoSession / clearPatientSession
 * en utils/session.ts), tanto en la carga inicial como en un resize en
 * caliente que cruce el breakpoint. Esto tampoco es un mecanismo de
 * seguridad — es limpieza de estado local para que no quede una sesión de
 * médico "colgada" en un dispositivo mobile (o viceversa) después de la
 * redirección.
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
      clearMedicoSession()
      navigate(resolveHomePath('mobile'), { replace: true })
      return
    }

    // En desktop no tiene sentido la vista de paciente (mobile-first, 390px).
    if (deviceType === 'desktop' && startsWithAny(pathname, PATIENT_PREFIXES)) {
      clearPatientSession()
      navigate(resolveHomePath('desktop'), { replace: true })
    }
  }, [deviceType, pathname, navigate])

  return <>{children}</>
}

export default DeviceGuard
