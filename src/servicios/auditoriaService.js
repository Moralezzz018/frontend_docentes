import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const auditoriaService = {
    /**
     * Listar logs de auditoría con filtros
     */
    listarLogs: async (filtros = {}) => {
        try {
            const params = new URLSearchParams();
            
            if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
            if (filtros.accion) params.append('accion', filtros.accion);
            if (filtros.entidad) params.append('entidad', filtros.entidad);
            if (filtros.resultado) params.append('resultado', filtros.resultado);
            if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
            if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
            if (filtros.page) params.append('page', filtros.page);
            if (filtros.limit) params.append('limit', filtros.limit);

            const response = await axios.get(`${API_URL}/api/auditoria/logs?${params.toString()}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener estadísticas de auditoría
     */
    obtenerEstadisticas: async (fechaInicio = null, fechaFin = null) => {
        try {
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);

            const response = await axios.get(`${API_URL}/api/auditoria/estadisticas?${params.toString()}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Obtener detalle de un log específico
     */
    obtenerDetalle: async (logId) => {
        try {
            const response = await axios.get(`${API_URL}/api/auditoria/logs/${logId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Limpiar logs antiguos
     */
    limpiarLogsAntiguos: async (diasAntiguedad = 90) => {
        try {
            const response = await axios.post(`${API_URL}/api/auditoria/limpiar`, 
                { diasAntiguedad },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
