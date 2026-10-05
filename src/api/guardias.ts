import guardiasMock from '../mocks/guardias.json'
import type { guardia, guardiasCercanas } from '../types/guardia'

// ── Tipos que devuelve el backend ────────────────────────────────────────────

type ApiGuardia = {
  id: string
  nombre: string
  distancia_km: number
  espera_min: number
}

// ── Mappers ──────────────────────────────────────────────────────────────────

const mapGuardiaFromApi = (raw: ApiGuardia): guardia => ({
  id: raw.id,
  nombre: raw.nombre,
  distanciaKm: raw.distancia_km,
  esperaMin: raw.espera_min,
})

// ── Fetch ────────────────────────────────────────────────────────────────────

/**
 * Guardias cercanas al paciente.
 *
 * TODO(backend): todavía no existe un endpoint ni una tabla de guardias, así
 * que por ahora se resuelve con `src/mocks/guardias.json`. Cuando el backend lo
 * exponga, reemplazar el cuerpo por la llamada con `api` (validando `success`)
 * — el resto de la app ya consume el tipo mapeado. El estado del tránsito
 * tampoco tiene fuente de datos, por eso vuelve en null.
 */
export const getGuardiasCercanas = async (): Promise<guardiasCercanas> => ({
  transito: null,
  guardias: (guardiasMock as ApiGuardia[]).map(mapGuardiaFromApi),
})
