import apiClient from './apiClient'
import API_BASE_URL from '@configuracion/api'

export const analisisService = {
    // Análisis por parcial
    analizarParcial: async (parcialId, claseId) => {
        const response = await apiClient.get(`${API_BASE_URL}/api/analisis/parcial`, {
            params: { parcialId, claseId }
        })
        return response.data
    },

    // Análisis por periodo
    analizarPeriodo: async (periodoId, claseId) => {
        const response = await apiClient.get(`${API_BASE_URL}/api/analisis/periodo`, {
            params: { periodoId, claseId }
        })
        return response.data
    },

    // Reporte de estudiante
    reporteEstudiante: async (estudianteId, periodoId) => {
        const response = await apiClient.get(`${API_BASE_URL}/api/analisis/reporte/estudiante`, {
            params: { estudianteId, periodoId }
        })
        return response.data
    },

    // Reporte de clase
    reporteClase: async (claseId, periodoId) => {
        const response = await apiClient.get(`${API_BASE_URL}/api/analisis/reporte/clase`, {
            params: { claseId, periodoId }
        })
        return response.data
    },

    // Reporte de docente
    reporteDocente: async (docenteId, periodoId) => {
        const response = await apiClient.get(`${API_BASE_URL}/api/analisis/reporte/docente`, {
            params: { docenteId, periodoId }
        })
        return response.data
    }
}
