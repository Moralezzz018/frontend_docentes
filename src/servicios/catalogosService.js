import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const periodosService = {
    listar: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.PERIODOS.LISTAR, { params })
        return response.data.data || []
    },

    guardar: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.PERIODOS.GUARDAR, data)
        return response.data
    },

    editar: async (id, data) => {
        const response = await apiClient.put(`${API_ENDPOINTS.PERIODOS.EDITAR}?id=${id}`, data)
        return response.data
    },

    eliminar: async (id) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.PERIODOS.ELIMINAR}?id=${id}`)
        return response.data
    },
}

export const parcialesService = {
    listar: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.PARCIALES.LISTAR, { params })
        return response.data.data || []
    },

    guardar: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.PARCIALES.GUARDAR, data)
        return response.data
    },

    editar: async (id, data) => {
        const response = await apiClient.put(`${API_ENDPOINTS.PARCIALES.EDITAR}?id=${id}`, data)
        return response.data
    },

    eliminar: async (id) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.PARCIALES.ELIMINAR}?id=${id}`)
        return response.data
    },
}
