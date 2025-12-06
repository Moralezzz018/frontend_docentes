import { Box, LinearProgress, Typography, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

/**
 * Componente reutilizable para mostrar progreso de operaciones largas
 * @param {boolean} loading - Si está en proceso de carga
 * @param {number} progress - Porcentaje de progreso (0-100)
 * @param {string} message - Mensaje descriptivo del progreso
 * @param {boolean} completed - Si la operación se completó exitosamente
 * @param {boolean} error - Si hubo un error
 * @param {string} variant - Tipo de indicador: 'linear', 'circular', 'both'
 */
const ProgressIndicator = ({ 
    loading = false, 
    progress = 0, 
    message = '', 
    completed = false,
    error = false,
    variant = 'linear'
}) => {
    if (!loading && !completed && !error) return null

    const showLinear = variant === 'linear' || variant === 'both'
    const showCircular = variant === 'circular' || variant === 'both'

    return (
        <Box sx={{ mb: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {completed && (
                    <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 28 }} />
                )}
                {error && (
                    <ErrorIcon sx={{ color: 'error.main', mr: 1, fontSize: 28 }} />
                )}
                {loading && !completed && !error && showCircular && (
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                )}
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontWeight: 600, 
                        color: completed ? 'success.main' : error ? 'error.main' : 'primary.main' 
                    }}
                >
                    {message}
                </Typography>
            </Box>
            
            {showLinear && (
                <>
                    <LinearProgress 
                        variant={completed || error ? "determinate" : "determinate"} 
                        value={progress} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: completed ? 'success.main' : error ? 'error.main' : 'primary.main'
                            }
                        }} 
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {progress}% completado
                    </Typography>
                </>
            )}
        </Box>
    )
}

export default ProgressIndicator
