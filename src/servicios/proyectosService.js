import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const proyectosService = {
  listar: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PROYECTOS.LISTAR, { params })
    return Array.isArray(response.data) ? response.data : []
  },

  guardar: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.PROYECTOS.GUARDAR, data)
    return response.data
  },

  editar: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.PROYECTOS.EDITAR}?id=${id}`, data)
    return response.data
  },

  eliminar: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.PROYECTOS.ELIMINAR}?id=${id}`)
    return response.data
  },
}

export default proyectosService
