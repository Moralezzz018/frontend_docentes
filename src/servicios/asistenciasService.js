import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const asistenciasService = {
    // Listar todas las asistencias
    listar: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.ASISTENCIAS.LISTAR, { params })
        return Array.isArray(response.data) ? response.data : []
    },

    // Guardar una asistencia individual
    guardar: async (data) => {
        // Si hay imagen de excusa, enviar como FormData
        if (data.imagenExcusa && data.imagenExcusa instanceof File) {
            const formData = new FormData()
            
            // Agregar todos los campos del formulario
            Object.keys(data).forEach(key => {
                if (key === 'imagenExcusa') {
                    formData.append('imagenExcusa', data[key])
                } else if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                    formData.append(key, data[key])
                }
            })
            
            // Asegurar que descripcion se envíe aunque esté vacía
            if (!formData.has('descripcion')) {
                formData.append('descripcion', '')
            }
            
            const response = await apiClient.post(API_ENDPOINTS.ASISTENCIAS.GUARDAR, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        }
        
        // Si no hay imagen, enviar JSON normal
        const response = await apiClient.post(API_ENDPOINTS.ASISTENCIAS.GUARDAR, data)
        return response.data
    },

    // Guardar asistencias múltiples (por clase/sección)
    guardarMultiple: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.ASISTENCIAS.GUARDAR_MULTIPLE, data)
        return response.data
    },

    // Editar una asistencia
    editar: async (id, data) => {
        // Si hay imagen de excusa, enviar como FormData
        if (data.imagenExcusa && data.imagenExcusa instanceof File) {
            const formData = new FormData()
            
            // Agregar todos los campos del formulario
            Object.keys(data).forEach(key => {
                if (key === 'imagenExcusa') {
                    formData.append('imagenExcusa', data[key])
                } else if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key])
                }
            })
            
            const response = await apiClient.put(`${API_ENDPOINTS.ASISTENCIAS.EDITAR}?id=${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        }
        
        // Si no hay imagen, enviar JSON normal
        const response = await apiClient.put(`${API_ENDPOINTS.ASISTENCIAS.EDITAR}?id=${id}`, data)
        return response.data
    },

    // Eliminar una asistencia
    eliminar: async (id) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.ASISTENCIAS.ELIMINAR}?id=${id}`)
        return response.data
    },

    // Filtrar por fecha
    filtrarPorFecha: async (fechaInicio, fechaFin) => {
        const response = await apiClient.get(API_ENDPOINTS.ASISTENCIAS.FILTRAR_FECHA, {
            params: { fechaInicio, fechaFin }
        })
        return Array.isArray(response.data) ? response.data : []
    },

    // Filtrar por estado y clase
    filtrarPorEstadoClase: async (estado, claseId) => {
        const response = await apiClient.get(API_ENDPOINTS.ASISTENCIAS.FILTRAR_ESTADO_CLASE, {
            params: { estado, claseId }
        })
        return Array.isArray(response.data) ? response.data : []
    },

    // Calcular asistencia perfecta
    calcularAsistenciaPerfecta: async (estudianteId, parcialId, claseId) => {
        const response = await apiClient.get(API_ENDPOINTS.ASISTENCIAS.CALCULAR_ASISTENCIA_PERFECTA, {
            params: { estudianteId, parcialId, claseId }
        })
        return response.data
    },
}
