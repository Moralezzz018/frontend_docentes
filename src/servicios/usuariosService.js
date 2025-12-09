import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const usuariosService = {
    listar: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.USUARIOS.LISTAR, { params })
        return response.data || []
    },

    guardar: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.USUARIOS.GUARDAR, data)
        return response.data
    },

    editar: async (id, data) => {
        const response = await apiClient.put(`${API_ENDPOINTS.USUARIOS.EDITAR}?id=${id}`, data)
        return response.data
    },

    eliminar: async (id) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.USUARIOS.ELIMINAR}?id=${id}`)
        return response.data
    },

    // Imágenes
    listarImagenes: async (usuarioId) => {
        const response = await apiClient.get(`${API_ENDPOINTS.USUARIOS.IMAGENES.LISTAR}?usuarioId=${usuarioId}`)
        return response.data.datos || []
    },

    guardarImagen: async (usuarioId, file) => {
        const formData = new FormData()
        formData.append('imagen', file)
        const url = `${API_ENDPOINTS.USUARIOS.IMAGENES.GUARDAR}?id=${usuarioId}`
        console.log('URL de guardar imagen:', url)
        const response = await apiClient.post(url, formData)
        return response.data
    },

    editarImagen: async (imagenId, file) => {
        const formData = new FormData()
        formData.append('imagen', file)
        const response = await apiClient.put(`${API_ENDPOINTS.USUARIOS.IMAGENES.EDITAR}?id=${imagenId}`, formData)
        return response.data
    },

    eliminarImagen: async (imagenId) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.USUARIOS.IMAGENES.ELIMINAR}?id=${imagenId}`)
        return response.data
    },
}
