import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const estructuraCalificacionService = {
  // Listar estructuras de calificación con filtros opcionales
  listar: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ESTRUCTURA_CALIFICACION.LISTAR, { params })
    return Array.isArray(response.data) ? response.data : []
  },

  // Obtener estructura de calificación por ID
  obtener: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.ESTRUCTURA_CALIFICACION.OBTENER}?id=${id}`)
    return response.data
  },

  // Obtener estructura de calificación por parcial y clase
  obtenerPorParcialYClase: async (parcialId, claseId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ESTRUCTURA_CALIFICACION.POR_PARCIAL_CLASE}?parcialId=${parcialId}&claseId=${claseId}`
    )
    return response.data
  },

  // Guardar nueva estructura de calificación
  guardar: async (data) => {
    console.log('🔍 DEBUG estructuraCalificacionService.guardar():')
    console.log('  - URL del endpoint:', API_ENDPOINTS.ESTRUCTURA_CALIFICACION.GUARDAR)
    console.log('  - Datos a enviar:', data)
    try {
      const response = await apiClient.post(API_ENDPOINTS.ESTRUCTURA_CALIFICACION.GUARDAR, data)
      console.log('  - ✅ Respuesta exitosa:', response)
      return response.data
    } catch (error) {
      console.log('  - ❌ Error capturado:', error)
      console.log('  - URL solicitada:', error.config?.url)
      console.log('  - Status:', error.response?.status)
      console.log('  - Mensaje:', error.message)
      throw error
    }
  },

  // Editar estructura de calificación
  editar: async (id, data) => {
    const response = await apiClient.put(
      `${API_ENDPOINTS.ESTRUCTURA_CALIFICACION.EDITAR}?id=${id}`,
      data
    )
    return response.data
  },

  // Eliminar estructura de calificación
  eliminar: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.ESTRUCTURA_CALIFICACION.ELIMINAR}?id=${id}`)
    return response.data
  },
}
