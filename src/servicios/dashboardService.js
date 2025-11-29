import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const dashboardService = {
    // Obtener estadísticas del dashboard
    obtenerEstadisticas: async () => {
        try {
            const [evaluaciones, estudiantes, asistencias, clases, aulas, usuarios] = await Promise.all([
                apiClient.get(API_ENDPOINTS.EVALUACIONES.LISTAR).catch(() => ({ data: [] })),
                apiClient.get(API_ENDPOINTS.ESTUDIANTES.LISTAR).catch(() => ({ data: [] })),
                apiClient.get(API_ENDPOINTS.ASISTENCIAS.LISTAR).catch(() => ({ data: [] })),
                apiClient.get(API_ENDPOINTS.CLASES.LISTAR).catch(() => ({ data: [] })),
                apiClient.get(API_ENDPOINTS.AULAS.LISTAR).catch(() => ({ data: [] })),
                apiClient.get(API_ENDPOINTS.USUARIOS.LISTAR).catch(() => ({ data: [] })),
            ])

            // Procesar datos
            const totalEvaluaciones = Array.isArray(evaluaciones.data) ? evaluaciones.data.length : 0
            const totalEstudiantes = Array.isArray(estudiantes.data) ? estudiantes.data.length : 0
            const totalClases = Array.isArray(clases.data) ? clases.data.length : 0
            const totalAulas = Array.isArray(aulas.data) ? aulas.data.length : 0
            const totalUsuarios = Array.isArray(usuarios.data) ? usuarios.data.length : 0

            // Calcular asistencias de hoy
            const hoy = new Date().toISOString().split('T')[0]
            const asistenciasData = Array.isArray(asistencias.data) ? asistencias.data : []
            const asistenciasHoy = asistenciasData.filter(a => {
                if (!a.fecha) return false
                const fechaAsistencia = new Date(a.fecha).toISOString().split('T')[0]
                return fechaAsistencia === hoy
            })

            const totalAsistenciasHoy = asistenciasHoy.length
            const asistenciasPresentesHoy = asistenciasHoy.filter(a => a.estado === 'PRESENTE').length
            const porcentajeAsistencia = totalAsistenciasHoy > 0 
                ? Math.round((asistenciasPresentesHoy / totalAsistenciasHoy) * 100) 
                : 0

            // Estudiantes activos
            const estudiantesActivos = Array.isArray(estudiantes.data) 
                ? estudiantes.data.filter(e => e.estado === 'ACTIVO').length 
                : 0

            // Clases activas (todas las clases son activas, no tienen campo estado)
            const clasesActivas = Array.isArray(clases.data)
                ? clases.data.length
                : 0

            return {
                totalEvaluaciones,
                totalEstudiantes,
                estudiantesActivos,
                totalClases,
                clasesActivas,
                totalAulas,
                totalUsuarios,
                asistenciaHoy: {
                    porcentaje: porcentajeAsistencia,
                    presentes: asistenciasPresentesHoy,
                    total: totalAsistenciasHoy
                }
            }
        } catch (error) {
            console.error('Error al obtener estadísticas:', error)
            throw error
        }
    },

    // Obtener resumen por rol
    obtenerResumenPorRol: async (rol, usuarioId) => {
        try {
            // Según el rol, obtener datos específicos
            if (rol === 'ESTUDIANTE') {
                // Para estudiantes: sus clases, evaluaciones, asistencias
                const [clases, evaluaciones, asistencias] = await Promise.all([
                    apiClient.get(API_ENDPOINTS.CLASES.LISTAR).catch(() => ({ data: [] })),
                    apiClient.get(API_ENDPOINTS.EVALUACIONES.LISTAR).catch(() => ({ data: [] })),
                    apiClient.get(API_ENDPOINTS.ASISTENCIAS.LISTAR).catch(() => ({ data: [] })),
                ])

                return {
                    misClases: Array.isArray(clases.data) ? clases.data.length : 0,
                    misEvaluaciones: Array.isArray(evaluaciones.data) ? evaluaciones.data.length : 0,
                    misAsistencias: Array.isArray(asistencias.data) ? asistencias.data.length : 0,
                }
            } else if (rol === 'DOCENTE') {
                // Para docentes: clases que imparte, evaluaciones, estudiantes
                const [clases, evaluaciones, estudiantes] = await Promise.all([
                    apiClient.get(API_ENDPOINTS.CLASES.LISTAR).catch(() => ({ data: [] })),
                    apiClient.get(API_ENDPOINTS.EVALUACIONES.LISTAR).catch(() => ({ data: [] })),
                    apiClient.get(API_ENDPOINTS.ESTUDIANTES.LISTAR).catch(() => ({ data: [] })),
                ])

                return {
                    misClases: Array.isArray(clases.data) ? clases.data.length : 0,
                    evaluacionesCreadas: Array.isArray(evaluaciones.data) ? evaluaciones.data.length : 0,
                    totalEstudiantes: Array.isArray(estudiantes.data) ? estudiantes.data.length : 0,
                }
            }

            return {}
        } catch (error) {
            console.error('Error al obtener resumen por rol:', error)
            throw error
        }
    }
}
