const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
    // Autenticación
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/usuarios/iniciar-sesion`,
        REGISTER: `${API_BASE_URL}/api/usuarios/registrar`,
        PROFILE: `${API_BASE_URL}/api/usuarios/perfil`,
    },

    // Evaluaciones
    EVALUACIONES: {
        LISTAR: `${API_BASE_URL}/api/evaluaciones/listar`,
        GUARDAR: `${API_BASE_URL}/api/evaluaciones/guardar`,
        EDITAR: `${API_BASE_URL}/api/evaluaciones/editar`,
        ELIMINAR: `${API_BASE_URL}/api/evaluaciones/eliminar`,
        REGISTRAR_NOTA: `${API_BASE_URL}/api/evaluaciones/registrarNota`,
        TOTAL_PARCIAL: `${API_BASE_URL}/api/evaluaciones/total-parcial`,
        PROMEDIO_PERIODO: `${API_BASE_URL}/api/evaluaciones/promedio-periodo`,
        ASIGNAR: `${API_BASE_URL}/api/evaluaciones/asignar`,
    },

    // Estudiantes
    ESTUDIANTES: {
        LISTAR: `${API_BASE_URL}/api/estudiantes/listar`,
        GUARDAR: `${API_BASE_URL}/api/estudiantes/guardar`,
        EDITAR: `${API_BASE_URL}/api/estudiantes/editar`,
        ELIMINAR: `${API_BASE_URL}/api/estudiantes/eliminar`,
    },

    // Clases
    CLASES: {
        LISTAR: `${API_BASE_URL}/api/clases/listar`,
        GUARDAR: `${API_BASE_URL}/api/clases/guardar`,
        EDITAR: `${API_BASE_URL}/api/clases/editar`,
        ELIMINAR: `${API_BASE_URL}/api/clases/eliminar`,
    },

    // Secciones
    SECCIONES: {
        LISTAR: `${API_BASE_URL}/api/secciones/listar`,
        GUARDAR: `${API_BASE_URL}/api/secciones/guardar`,
        EDITAR: `${API_BASE_URL}/api/secciones/editar`,
        ELIMINAR: `${API_BASE_URL}/api/secciones/eliminar`,
    },

    // Periodos
    PERIODOS: {
        LISTAR: `${API_BASE_URL}/api/periodos/listar`,
        GUARDAR: `${API_BASE_URL}/api/periodos/guardar`,
        EDITAR: `${API_BASE_URL}/api/periodos/editar`,
        ELIMINAR: `${API_BASE_URL}/api/periodos/eliminar`,
    },

    // Parciales
    PARCIALES: {
        LISTAR: `${API_BASE_URL}/api/parciales/listar`,
        GUARDAR: `${API_BASE_URL}/api/parciales/guardar`,
        EDITAR: `${API_BASE_URL}/api/parciales/editar`,
        ELIMINAR: `${API_BASE_URL}/api/parciales/eliminar`,
    },

    // Asistencias
    ASISTENCIAS: {
        LISTAR: `${API_BASE_URL}/api/asistencias/listar`,
        GUARDAR: `${API_BASE_URL}/api/asistencias/guardar`,
        EDITAR: `${API_BASE_URL}/api/asistencias/editar`,
    },

    // Proyectos
    PROYECTOS: {
        LISTAR: `${API_BASE_URL}/api/proyectos/listar`,
        GUARDAR: `${API_BASE_URL}/api/proyectos/guardar`,
        EDITAR: `${API_BASE_URL}/api/proyectos/editar`,
        ELIMINAR: `${API_BASE_URL}/api/proyectos/eliminar`,
    },
}

export default API_BASE_URL
