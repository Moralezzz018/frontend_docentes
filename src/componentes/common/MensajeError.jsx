import { Alert, AlertTitle, Box, Button, Collapse } from '@mui/material'
import { useState } from 'react'
import { 
    ErrorOutline, 
    WarningAmber, 
    InfoOutlined,
    WifiOff,
    LockOutlined,
    BugReport
} from '@mui/icons-material'

/**
 * Componente para mostrar mensajes de error amigables
 */
const MensajeError = ({ 
    error, 
    tipo = 'error',
    mostrarDetalles = false,
    onReintentar,
    onCerrar
}) => {
    const [mostrarTecnico, setMostrarTecnico] = useState(false)

    if (!error) return null

    // Detectar tipo de error y proporcionar mensaje amigable
    const obtenerMensajeAmigable = (error) => {
        const errorStr = typeof error === 'string' ? error : error?.message || ''
        const errorCode = error?.response?.status
        const errorData = error?.response?.data

        // Errores de red
        if (error?.code === 'ERR_NETWORK' || errorStr.includes('Network Error')) {
            return {
                icono: WifiOff,
                titulo: 'Sin conexión',
                mensaje: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
                severidad: 'error'
            }
        }

        // Errores de autenticación
        if (errorCode === 401) {
            return {
                icono: LockOutlined,
                titulo: 'Sesión expirada',
                mensaje: 'Tu sesión ha caducado. Por favor, inicia sesión nuevamente.',
                severidad: 'warning'
            }
        }

        // Errores de permisos
        if (errorCode === 403) {
            // Detectar si es un problema de clase no autorizada
            if (errorStr.includes('clase') || errorData?.error?.includes('clase')) {
                return {
                    icono: LockOutlined,
                    titulo: 'Clase no autorizada',
                    mensaje: 'Solo puedes ver análisis de tus propias clases. Selecciona una clase donde seas el docente asignado.',
                    severidad: 'warning'
                }
            }
            return {
                icono: LockOutlined,
                titulo: 'Acceso denegado',
                mensaje: 'No tienes permisos para realizar esta acción.',
                severidad: 'warning'
            }
        }

        // Errores 404
        if (errorCode === 404) {
            return {
                icono: InfoOutlined,
                titulo: 'No encontrado',
                mensaje: errorData?.error || 'La información solicitada no existe.',
                severidad: 'info'
            }
        }

        // Errores de validación (400)
        if (errorCode === 400) {
            return {
                icono: WarningAmber,
                titulo: 'Datos incorrectos',
                mensaje: errorData?.error || errorData?.mensaje || 'Por favor, verifica la información ingresada.',
                severidad: 'warning'
            }
        }

        // Errores del servidor (500)
        if (errorCode >= 500) {
            return {
                icono: ErrorOutline,
                titulo: 'Error del servidor',
                mensaje: 'Ocurrió un problema en el servidor. Intenta nuevamente en unos momentos.',
                severidad: 'error'
            }
        }

        // Errores específicos del backend
        if (errorData?.error) {
            return {
                icono: WarningAmber,
                titulo: 'Atención',
                mensaje: errorData.error,
                severidad: 'warning'
            }
        }

        // Error genérico
        return {
            icono: ErrorOutline,
            titulo: 'Algo salió mal',
            mensaje: errorStr || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
            severidad: tipo
        }
    }

    const infoError = obtenerMensajeAmigable(error)
    const IconoError = infoError.icono

    // Obtener detalles técnicos
    const obtenerDetallesTecnicos = () => {
        if (typeof error === 'string') return error

        const detalles = []
        
        if (error?.response?.status) {
            detalles.push(`Código: ${error.response.status}`)
        }
        
        if (error?.message) {
            detalles.push(`Mensaje: ${error.message}`)
        }
        
        if (error?.response?.data?.detalles) {
            detalles.push(`Detalles: ${error.response.data.detalles}`)
        }

        return detalles.join(' | ')
    }

    return (
        <Box sx={{ my: 2 }}>
            <Alert
                severity={infoError.severidad}
                icon={<IconoError />}
                onClose={onCerrar}
                action={
                    onReintentar && (
                        <Button 
                            color="inherit" 
                            size="small"
                            onClick={onReintentar}
                        >
                            Reintentar
                        </Button>
                    )
                }
            >
                <AlertTitle sx={{ fontWeight: 600 }}>
                    {infoError.titulo}
                </AlertTitle>
                {infoError.mensaje}
                
                {mostrarDetalles && (
                    <>
                        <Button
                            size="small"
                            startIcon={<BugReport />}
                            onClick={() => setMostrarTecnico(!mostrarTecnico)}
                            sx={{ mt: 1, textTransform: 'none' }}
                        >
                            {mostrarTecnico ? 'Ocultar' : 'Ver'} detalles técnicos
                        </Button>
                        <Collapse in={mostrarTecnico}>
                            <Box
                                sx={{
                                    mt: 1,
                                    p: 1,
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontFamily: 'monospace',
                                    wordBreak: 'break-all'
                                }}
                            >
                                {obtenerDetallesTecnicos()}
                            </Box>
                        </Collapse>
                    </>
                )}
            </Alert>
        </Box>
    )
}

export default MensajeError
