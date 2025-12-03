/**
 * CONFIGURACIÓN DE PERMISOS POR ROL
 * 
 * Define qué módulos puede ver cada tipo de usuario
 */

export const ROLES = {
    ADMIN: 'ADMIN',
    DOCENTE: 'DOCENTE',
    ESTUDIANTE: 'ESTUDIANTE'
}

/**
 * Configuración de módulos accesibles por rol
 * 
 * - ADMIN: Ve TODOS los módulos
 * - DOCENTE: Ve todo EXCEPTO "Usuarios"
 * - ESTUDIANTE: Solo ve "Evaluaciones" y "Asistencias"
 */
export const MODULOS_POR_ROL = {
    [ROLES.ADMIN]: [
        'dashboard',
        'evaluaciones',
        'estudiantes',
        'clases',
        'secciones',
        'periodos',
        'parciales',
        'aulas',
        'asistencias',
        'proyectos',
        'rifas',
        'usuarios',
        'analisis',
        'auditoria',
        'notificaciones',
        'estructura-calificacion'
    ],
    [ROLES.DOCENTE]: [
        'dashboard',
        'evaluaciones',
        'estudiantes',
        'clases',
        'secciones',
        'periodos',
        'parciales',
        'aulas',
        'asistencias',
        'proyectos',
        'rifas',
        'analisis',
        'notificaciones',
        'estructura-calificacion'
        // NO incluye 'usuarios' ni 'auditoria'
    ],
    [ROLES.ESTUDIANTE]: [
        'dashboard',
        'evaluaciones',
        'asistencias',
        'estructura-calificacion'
        // Solo evaluaciones, asistencias y estructura de calificación
    ]
}

/**
 * Verifica si un usuario tiene acceso a un módulo específico
 * 
 * @param {string} rol - Rol del usuario (ADMIN, DOCENTE, ESTUDIANTE)
 * @param {string} modulo - ID del módulo a verificar
 * @returns {boolean} - true si tiene acceso, false si no
 */
export const tieneAccesoAModulo = (rol, modulo) => {
    if (!rol) return false
    
    const modulosPermitidos = MODULOS_POR_ROL[rol] || []
    return modulosPermitidos.includes(modulo)
}

/**
 * Obtiene todos los módulos permitidos para un rol
 * 
 * @param {string} rol - Rol del usuario
 * @returns {Array<string>} - Array de IDs de módulos permitidos
 */
export const obtenerModulosPermitidos = (rol) => {
    if (!rol) return []
    return MODULOS_POR_ROL[rol] || []
}
