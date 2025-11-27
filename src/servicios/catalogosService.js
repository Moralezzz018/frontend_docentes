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
        // El backend de parciales devuelve directamente el array
        return Array.isArray(response.data) ? response.data : []
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

export const clasesService = {
    listar: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.CLASES.LISTAR, { params })
        return Array.isArray(response.data) ? response.data : []
    },

    guardar: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.CLASES.GUARDAR, data)
        return response.data
    },

    editar: async (id, data) => {
        const response = await apiClient.put(`${API_ENDPOINTS.CLASES.EDITAR}?id=${id}`, data)
        return response.data
    },

    eliminar: async (id) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.CLASES.ELIMINAR}?id=${id}`)
        return response.data
    },
}

export const seccionesService = {
    listar: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.SECCIONES.LISTAR, { params })
        return Array.isArray(response.data) ? response.data : []
    },

    guardar: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.SECCIONES.GUARDAR, data)
        return response.data
    },

    editar: async (id, data) => {
        const response = await apiClient.put(`${API_ENDPOINTS.SECCIONES.EDITAR}?id=${id}`, data)
        return response.data
    },

    eliminar: async (id) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.SECCIONES.ELIMINAR}?id=${id}`)
        return response.data
    },
}

export const aulasService = {
    listar: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.AULAS.LISTAR, { params })
        return Array.isArray(response.data) ? response.data : []
    },

    guardar: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.AULAS.GUARDAR, data)
        return response.data
    },

    editar: async (id, data) => {
        const response = await apiClient.put(`${API_ENDPOINTS.AULAS.EDITAR}?id=${id}`, data)
        return response.data
    },

    eliminar: async (id) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.AULAS.ELIMINAR}?id=${id}`)
        return response.data
    },
}
