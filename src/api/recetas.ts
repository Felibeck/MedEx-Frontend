import { api } from './client'

export interface Receta {
  id: number
  consulta_id: number
  titulo: string
  pathFile: string
  created_at: string
  url: string
}

export async function getRecetas(): Promise<Receta[]> {
  const response = await api.get('/patients/me/recetas')
  if (response.data.success) {
    return response.data.data || []
  }
  throw new Error(response.data.message || 'Error al obtener recetas')
}
