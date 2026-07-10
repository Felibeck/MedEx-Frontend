import { api } from './client'

export type TipoEstudioCatalogo = {
  id: number
  nombre: string
}

export const getTiposEstudio = async (): Promise<TipoEstudioCatalogo[]> => {
  const response = await api.get('/catalogos/tipos-estudio')
  const { data } = response.data
  return data
}
