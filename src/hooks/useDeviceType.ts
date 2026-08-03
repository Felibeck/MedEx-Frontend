import { useEffect, useState } from 'react'
import { MOBILE_BREAKPOINT } from '../config/constants'

export type DeviceType = 'mobile' | 'desktop'

/** Ventana de debounce para no recalcular en cada pixel del resize. */
const RESIZE_DEBOUNCE_MS = 150

const getDeviceType = (): DeviceType =>
  window.innerWidth < MOBILE_BREAKPOINT ? 'mobile' : 'desktop'

/**
 * Devuelve la superficie actual ('mobile' | 'desktop') según el ancho de la
 * ventana, y se recalcula en cada resize (con debounce).
 *
 * OJO: el ancho de ventana es un dato de conveniencia de UX, no una señal de
 * confianza. Ver el comentario de seguridad en `components/deviceGuard`.
 */
export const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        // setState con el mismo valor no re-renderiza, así que no hace falta
        // comparar contra el estado anterior.
        setDeviceType(getDeviceType())
      }, RESIZE_DEBOUNCE_MS)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return deviceType
}

export default useDeviceType
