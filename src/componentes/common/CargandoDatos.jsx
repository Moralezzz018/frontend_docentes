import { Box, CircularProgress, Typography, Skeleton } from '@mui/material'
import { HourglassEmpty } from '@mui/icons-material'

/**
 * Componente para mostrar estados de carga
 */
const CargandoDatos = ({ 
    mensaje = 'Cargando información...',
    tipo = 'circular',
    altura = 200,
    filas = 5
}) => {
    if (tipo === 'skeleton') {
        return (
            <Box sx={{ width: '100%', py: 2 }}>
                {[...Array(filas)].map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rectangular"
                        height={60}
                        sx={{ mb: 1, borderRadius: 1 }}
                    />
                ))}
            </Box>
        )
    }

    if (tipo === 'tabla') {
        return (
            <Box sx={{ width: '100%', py: 2 }}>
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
                {[...Array(filas)].map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rectangular"
                        height={50}
                        sx={{ mb: 1, borderRadius: 1 }}
                    />
                ))}
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: altura,
                py: 4,
                gap: 2
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress size={50} thickness={4} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <HourglassEmpty sx={{ color: 'primary.main', fontSize: 24 }} />
                </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
                {mensaje}
            </Typography>
        </Box>
    )
}

export default CargandoDatos
