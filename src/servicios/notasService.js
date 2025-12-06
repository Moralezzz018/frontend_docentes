import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const notasService = {
  // Obtener notas de estudiantes por clase y periodo (DOCENTE/ADMIN)
  obtenerNotas: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTAS.OBTENER, { params })
    return response.data
  },

  // Obtener mis notas (ESTUDIANTE)
  obtenerMisNotas: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTAS.MIS_NOTAS, { params })
    return response.data
  },
}

export default notasService
