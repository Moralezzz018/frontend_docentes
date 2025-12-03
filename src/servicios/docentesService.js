import apiClient from './apiClient';
import { DOCENTES } from '@configuracion/api';

/**
 * Servicio para gestión de docentes
 */
export const docentesService = {
    /**
     * Listar todos los docentes
     */
    listar: async () => {
        const response = await apiClient.get(DOCENTES.LISTAR);
        return response.data;
    },

    /**
     * Crear un nuevo docente
     * @param {Object} data - Datos del docente (nombre, apellido, correo, telefono, direccion, especialidad, estado)
     */
    guardar: async (data) => {
        const response = await apiClient.post(DOCENTES.GUARDAR, data);
        return response.data;
    },

    /**
     * Editar un docente existente
     * @param {number} id - ID del docente
     * @param {Object} data - Datos a actualizar
     */
    editar: async (id, data) => {
        const response = await apiClient.put(`${DOCENTES.EDITAR}?id=${id}`, data);
        return response.data;
    },

    /**
     * Eliminar un docente
     * @param {number} id - ID del docente
     */
    eliminar: async (id) => {
        const response = await apiClient.delete(`${DOCENTES.ELIMINAR}?id=${id}`);
        return response.data;
    },

    /**
     * Filtrar docentes por nombre
     * @param {string} nombre - Nombre a buscar
     * @param {string} tipoBusqueda - Tipo de búsqueda ('exacta' o 'parcial')
     */
    filtrarPorNombre: async (nombre, tipoBusqueda = 'parcial') => {
        const response = await apiClient.get(DOCENTES.FILTRAR_NOMBRE, {
            params: { nombre, tipoBusqueda }
        });
        return response.data;
    },
};

export default docentesService;
