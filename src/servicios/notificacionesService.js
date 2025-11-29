import apiClient from './apiClient';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const notificacionesService = {
    // Obtener estadísticas de correos
    obtenerEstadisticas: async () => {
        try {
            const response = await apiClient.get(`${API_BASE}/api/notificaciones/estadisticas`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas de notificaciones:', error);
            throw error;
        }
    },

    // Obtener estado de la cola
    obtenerCola: async () => {
        try {
            const response = await apiClient.get(`${API_BASE}/api/notificaciones/cola`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener cola de notificaciones:', error);
            throw error;
        }
    },

    // Limpiar estadísticas
    limpiarEstadisticas: async () => {
        try {
            const response = await apiClient.post(`${API_BASE}/api/notificaciones/limpiar`);
            return response.data;
        } catch (error) {
            console.error('Error al limpiar estadísticas:', error);
            throw error;
        }
    }
};

export default notificacionesService;
