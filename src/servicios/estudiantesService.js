import apiClient from './apiClient'
import { ESTUDIANTES } from '../configuracion/api'

export const estudiantesService = {
    listar: async () => {
        const response = await apiClient.get(ESTUDIANTES.LISTAR)
        return response.data
    },

    crear: async (data) => {
        const response = await apiClient.post(ESTUDIANTES.CREAR, data)
        return response.data
    },

    actualizar: async (id, data) => {
        const response = await apiClient.put(`${ESTUDIANTES.ACTUALIZAR}?id=${id}`, data)
        return response.data
    },

    eliminar: async (id) => {
        const response = await apiClient.delete(`${ESTUDIANTES.ELIMINAR}?id=${id}`)
        return response.data
    },

    cargarExcel: async (file, creditos, aulaId) => {
        const formData = new FormData()
        formData.append('excel', file)  // El backend espera 'excel', no 'archivo'
        formData.append('creditos', creditos)
        formData.append('aulaId', aulaId)

        const response = await apiClient.post(ESTUDIANTES.CARGAR_EXCEL, formData)
        return response.data
    },

    filtrarPorNombreYEstado: async (nombre = '', estado = '') => {
        const params = new URLSearchParams()
        if (nombre) params.append('nombre', nombre)
        if (estado) params.append('estado', estado)

        const response = await apiClient.get(`${ESTUDIANTES.FILTRAR_NOMBRE_ESTADO}?${params.toString()}`)
        return response.data
    },

    filtrarPorCorreo: async (correo, tipoBusqueda = 'exacta') => {
        const response = await apiClient.get(
            `${ESTUDIANTES.FILTRAR_CORREO}?correo=${correo}&tipoBusqueda=${tipoBusqueda}`
        )
        return response.data
    },

    filtrarConEstadisticas: async (estado = '', minimoClases = '') => {
        const params = new URLSearchParams()
        if (estado) params.append('estado', estado)
        if (minimoClases) params.append('minimoClases', minimoClases)

        const response = await apiClient.get(`${ESTUDIANTES.FILTRAR_ESTADISTICAS}?${params.toString()}`)
        return response.data
    },

    obtenerPorClase: async (claseId) => {
        const response = await apiClient.get(`${ESTUDIANTES.POR_CLASE}?claseId=${claseId}`)
        return response.data
    },

    listarPorClase: async (params = {}) => {
        const response = await apiClient.get(ESTUDIANTES.POR_CLASE, { params })
        return response.data
    }
}
