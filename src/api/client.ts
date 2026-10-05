import axios, { type AxiosRequestHeaders } from 'axios'
import { clearSession } from '../utils/session'

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// Intercepta cada petición saliente e inyecta el token si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...(config.headers as AxiosRequestHeaders | undefined),
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Si el backend rechaza el token (vencido o inválido), se cierra la sesión local
// y se vuelve al login de la superficie en la que estaba el usuario.
api.interceptors.response.use((response) => response, (error) => {
  const esLogin = String(error.config?.url ?? '').includes('/login')

  if (axios.isAxiosError(error) && error.response?.status === 401 && !esLogin && localStorage.getItem('token')) {
    clearSession()
    const enMedico = window.location.pathname.startsWith('/doctor')
    window.location.assign(enMedico ? '/doctors/login' : '/patients/login')
  }

  return Promise.reject(error)
})