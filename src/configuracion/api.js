const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const API_ENDPOINTS = {
    // Autenticación
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/usuarios/iniciar-sesion`,
        REGISTER: `${API_BASE_URL}/api/usuarios/guardar`,
        PROFILE: `${API_BASE_URL}/api/usuarios/perfil`,
        SOLICITAR_RESTABLECIMIENTO: `${API_BASE_URL}/api/usuarios/solicitar-restablecimiento`,
        VALIDAR_PIN: `${API_BASE_URL}/api/usuarios/validar-pin`,
        RESTABLECER_CONTRASENA: `${API_BASE_URL}/api/usuarios/restablecer-contrasena`,
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
        CREAR: `${API_BASE_URL}/api/estudiantes/guardar`,
        ACTUALIZAR: `${API_BASE_URL}/api/estudiantes/editar`,
        ELIMINAR: `${API_BASE_URL}/api/estudiantes/eliminar`,
        CARGAR_EXCEL: `${API_BASE_URL}/api/estudiantes/importar-excel`,
        FILTRAR_NOMBRE_ESTADO: `${API_BASE_URL}/api/estudiantes/filtrar-nombre-estado`,
        FILTRAR_CORREO: `${API_BASE_URL}/api/estudiantes/filtrar-correo`,
        FILTRAR_ESTADISTICAS: `${API_BASE_URL}/api/estudiantes/filtrar-estadisticas`,
        POR_CLASE: `${API_BASE_URL}/api/estudiantes/por-clase`,
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
        GUARDAR_MULTIPLE: `${API_BASE_URL}/api/asistencias/guardar-multiple`,
        EDITAR: `${API_BASE_URL}/api/asistencias/editar`,
        ELIMINAR: `${API_BASE_URL}/api/asistencias/eliminar`,
        FILTRAR_FECHA: `${API_BASE_URL}/api/asistencias/filtrar-fecha`,
        FILTRAR_ESTADO_CLASE: `${API_BASE_URL}/api/asistencias/filtrar-estado-clase`,
        CALCULAR_ASISTENCIA_PERFECTA: `${API_BASE_URL}/api/asistencias/calcular-asistencia-perfecta`,
    },

    // Proyectos
    PROYECTOS: {
        LISTAR: `${API_BASE_URL}/api/proyectos/listar`,
        GUARDAR: `${API_BASE_URL}/api/proyectos/guardar`,
        EDITAR: `${API_BASE_URL}/api/proyectos/editar`,
        ELIMINAR: `${API_BASE_URL}/api/proyectos/eliminar`,
        ASIGNAR: `${API_BASE_URL}/api/proyectos/asignar`,
        ASIGNAR_ALEATORIO: `${API_BASE_URL}/api/proyectos/asignar-aleatorio`,
    },

    // Aulas
    AULAS: {
        LISTAR: `${API_BASE_URL}/api/aulas/listar`,
        GUARDAR: `${API_BASE_URL}/api/aulas/guardar`,
        EDITAR: `${API_BASE_URL}/api/aulas/editar`,
        ELIMINAR: `${API_BASE_URL}/api/aulas/eliminar`,
    },

    // Usuarios
    USUARIOS: {
        LISTAR: `${API_BASE_URL}/api/usuarios/listar`,
        GUARDAR: `${API_BASE_URL}/api/usuarios/guardar`,
        EDITAR: `${API_BASE_URL}/api/usuarios/editar`,
        ELIMINAR: `${API_BASE_URL}/api/usuarios/eliminar`,
        IMAGENES: {
            LISTAR: `${API_BASE_URL}/api/usuarios/imagenes/listar`,
            GUARDAR: `${API_BASE_URL}/api/usuarios/imagenes/guardar`,
            EDITAR: `${API_BASE_URL}/api/usuarios/imagenes/editar`,
            ELIMINAR: `${API_BASE_URL}/api/usuarios/imagenes/eliminar`,
        },
    },

    // Notificaciones
    NOTIFICACIONES: {
        ESTADISTICAS: `${API_BASE_URL}/api/notificaciones/estadisticas`,
        COLA: `${API_BASE_URL}/api/notificaciones/cola`,
        LIMPIAR: `${API_BASE_URL}/api/notificaciones/limpiar`,
    },

    // Correo
    CORREO: {
        ENVIAR: `${API_BASE_URL}/api/correo/enviar`,
    },

    // Grupos (Rifas)
    GRUPOS: {
        VALIDAR_CANTIDAD: `${API_BASE_URL}/api/grupos/validar-cantidad`,
        RIFAR_PROYECTOS: `${API_BASE_URL}/api/grupos/rifar-proyectos`,
        ASIGNAR_ESTUDIANTES: `${API_BASE_URL}/api/grupos/asignar-estudiantes`,
        LISTAR: `${API_BASE_URL}/api/grupos/listar`,
        ELIMINAR_CLASE: `${API_BASE_URL}/api/grupos/eliminar-clase`,
    },

    // Análisis
    ANALISIS: {
        PARCIAL: `${API_BASE_URL}/api/analisis/parcial`,
        PERIODO: `${API_BASE_URL}/api/analisis/periodo`,
        REPORTE_ESTUDIANTE: `${API_BASE_URL}/api/analisis/reporte/estudiante`,
        REPORTE_CLASE: `${API_BASE_URL}/api/analisis/reporte/clase`,
        REPORTE_DOCENTE: `${API_BASE_URL}/api/analisis/reporte/docente`,
    },

    // Auditoría
    AUDITORIA: {
        LOGS: `${API_BASE_URL}/api/auditoria/logs`,
        ESTADISTICAS: `${API_BASE_URL}/api/auditoria/estadisticas`,
        DETALLE: `${API_BASE_URL}/api/auditoria/logs`, // + /:id
        LIMPIAR: `${API_BASE_URL}/api/auditoria/limpiar`,
    },

    // Docentes
    DOCENTES: {
        LISTAR: `${API_BASE_URL}/api/docentes/Listar`,
        GUARDAR: `${API_BASE_URL}/api/docentes/guardar`,
        EDITAR: `${API_BASE_URL}/api/docentes/Editar`,
        ELIMINAR: `${API_BASE_URL}/api/docentes/Eliminar`,
        FILTRAR_NOMBRE: `${API_BASE_URL}/api/docentes/filtrar-nombre`,
    },

    // Estructura de Calificación
    ESTRUCTURA_CALIFICACION: {
        LISTAR: '/api/estructura-calificacion/listar',
        OBTENER: '/api/estructura-calificacion/obtener',
        POR_PARCIAL_CLASE: '/api/estructura-calificacion/por-parcial-clase',
        GUARDAR: '/api/estructura-calificacion/guardar',
        EDITAR: '/api/estructura-calificacion/editar',
        ELIMINAR: '/api/estructura-calificacion/eliminar',
    },
}

// Exportar endpoints individuales para compatibilidad
export const { 
    AUTH, 
    EVALUACIONES, 
    ESTUDIANTES, 
    CLASES, 
    SECCIONES, 
    PERIODOS, 
    PARCIALES, 
    ASISTENCIAS, 
    PROYECTOS, 
    AULAS, 
    USUARIOS,
    NOTIFICACIONES,
    CORREO,
    GRUPOS,
    ANALISIS,
    AUDITORIA,
    DOCENTES,
    ESTRUCTURA_CALIFICACION
} = API_ENDPOINTS

export default API_BASE_URL
