import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const gruposService = {
  /**
   * Valida si hay suficientes estudiantes inscritos para rifar
   * @param {number} claseId - ID de la clase
   * @param {number} cantidad - Cantidad de estudiantes a validar
   */
  validarCantidad: async (claseId, cantidad) => {
    const response = await apiClient.get(API_ENDPOINTS.GRUPOS.VALIDAR_CANTIDAD, {
      params: { claseId, cantidad }
    })
    return response.data
  },

  /**
   * Rifa proyectos y crea grupos automáticamente
   * @param {number} claseId - ID de la clase
   */
  rifarProyectos: async (claseId) => {
    const response = await apiClient.post(API_ENDPOINTS.GRUPOS.RIFAR_PROYECTOS, { claseId })
    return response.data
  },

  /**
   * Asigna estudiantes a un grupo específico
   * @param {number} grupoId - ID del grupo
   * @param {number[]} estudiantesIds - Array de IDs de estudiantes
   */
  asignarEstudiantes: async (grupoId, estudiantesIds) => {
    const response = await apiClient.post(API_ENDPOINTS.GRUPOS.ASIGNAR_ESTUDIANTES, {
      grupoId,
      estudiantesIds
    })
    return response.data
  },

  /**
   * Lista todos los grupos de una clase con sus estudiantes y proyectos
   * @param {number} claseId - ID de la clase
   */
  listarPorClase: async (claseId) => {
    const response = await apiClient.get(API_ENDPOINTS.GRUPOS.LISTAR, {
      params: { claseId }
    })
    return response.data
  },

  /**
   * Elimina todos los grupos de una clase
   * @param {number} claseId - ID de la clase
   */
  eliminarPorClase: async (claseId) => {
    const response = await apiClient.delete(API_ENDPOINTS.GRUPOS.ELIMINAR_CLASE, {
      params: { claseId }
    })
    return response.data
  },
}

export default gruposService
