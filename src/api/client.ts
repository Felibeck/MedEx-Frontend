import axios, { type AxiosRequestHeaders } from 'axios'

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