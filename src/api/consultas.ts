import { api } from './client'
import type { consulta } from '../types/consulta'

export const postConsulta = async (data: consulta): Promise<void> => {
  await api.post('/doctors/consultas', data)
}
