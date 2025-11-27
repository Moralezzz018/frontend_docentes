import apiClient from './apiClient'
import { AULAS } from '../configuracion/api'

export const aulasService = {
    listar: async () => {
        const response = await apiClient.get(AULAS.LISTAR)
        return response.data
    },

    crear: async (data) => {
        const response = await apiClient.post(AULAS.GUARDAR, data)
        return response.data
    },

    actualizar: async (id, data) => {
        const response = await apiClient.put(`${AULAS.EDITAR}?id=${id}`, data)
        return response.data
    },

    eliminar: async (id) => {
        const response = await apiClient.delete(`${AULAS.ELIMINAR}?id=${id}`)
        return response.data
    }
}
