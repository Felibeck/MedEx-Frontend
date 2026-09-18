import { useEffect, useState } from 'react'
import { getMiHistorialClinico } from '../api/historialPaciente'
import { getRecetas, type Receta } from '../api/recetas'
import type { historialClinicoPaciente } from '../types/historialClinicoPaciente'

interface HistorialPacienteData {
  historial: historialClinicoPaciente | null
  recetas: Receta[]
  loading: boolean
  error: string | null
}

export const useHistorialPaciente = () => {
  const [data, setData] = useState<HistorialPacienteData>({
    historial: null,
    recetas: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))
        
        const [historialData, recetasData] = await Promise.all([
          getMiHistorialClinico(),
          getRecetas(),
        ])

        setData({
          historial: historialData,
          recetas: recetasData || [],
          loading: false,
          error: null,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar datos'
        setData(prev => ({
          ...prev,
          loading: false,
          error: message,
        }))
      }
    }

    fetchData()
  }, [])

  return data
}
