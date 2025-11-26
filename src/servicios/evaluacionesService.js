import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const evaluacionesService = {
  // Listar evaluaciones con filtros opcionales
  listar: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUACIONES.LISTAR, { params })
    return response.data
  },

  // Crear evaluación
  guardar: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.EVALUACIONES.GUARDAR, data)
    return response.data
  },

  // Editar evaluación
  editar: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.EVALUACIONES.EDITAR}?id=${id}`, data)
    return response.data
  },

  // Eliminar evaluación
  eliminar: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.EVALUACIONES.ELIMINAR}?id=${id}`)
    return response.data
  },

  // Registrar nota
  registrarNota: async (evaluacionId, estudianteId, claseId, seccionId, nota) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.EVALUACIONES.REGISTRAR_NOTA}?evaluacionId=${evaluacionId}&estudianteId=${estudianteId}&claseId=${claseId}&seccionId=${seccionId}`,
      { nota }
    )
    return response.data
  },

  // Obtener total del parcial
  getTotalParcial: async (estudianteId, parcialId) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUACIONES.TOTAL_PARCIAL, {
      params: { estudianteId, parcialId }
    })
    return response.data
  },

  // Obtener promedio del periodo
  getPromedioPeriodo: async (estudianteId, periodoId) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUACIONES.PROMEDIO_PERIODO, {
      params: { estudianteId, periodoId }
    })
    return response.data
  },

  // Asignar evaluación
  asignar: async (evaluacionId, data) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.EVALUACIONES.ASIGNAR}?evaluacionId=${evaluacionId}`,
      data
    )
    return response.data
  },
}
