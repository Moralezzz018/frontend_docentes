import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@almacen/authStore'
import { tieneAccesoAModulo } from '@configuracion/rolesConfig'
import { Box, Typography, Button } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import { useNavigate } from 'react-router-dom'

/**
 * Componente para proteger rutas basado en roles
 * 
 * Verifica si el usuario tiene permiso para acceder a un módulo específico
 * Si no tiene permiso, muestra una pantalla de acceso denegado
 * 
 * @param {string} moduloRequerido - ID del módulo que se requiere para acceder
 * @param {ReactNode} children - Componente hijo a renderizar si tiene acceso
 */
export const RoleProtectedRoute = ({ moduloRequerido, children }) => {
    const user = useAuthStore((state) => state.user)
    const navigate = useNavigate()
    const rolUsuario = user?.rol?.nombre || null

    // Verificar si el usuario tiene acceso al módulo
    const tieneAcceso = tieneAccesoAModulo(rolUsuario, moduloRequerido)

    if (!tieneAcceso) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    p: 3,
                }}
            >
                <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Acceso Denegado
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                    No tienes permisos para acceder a este módulo. Tu rol actual es: <strong>{rolUsuario || 'Sin rol'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Si crees que esto es un error, contacta al administrador del sistema.
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/')}
                    size="large"
                >
                    Volver al Dashboard
                </Button>
            </Box>
        )
    }

    return children
}
