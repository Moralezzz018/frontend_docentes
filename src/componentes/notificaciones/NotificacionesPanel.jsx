import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    CircularProgress,
    Button,
    Chip,
    Alert,
    Paper,
    LinearProgress
} from '@mui/material';
import {
    Email as EmailIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Schedule as ScheduleIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import notificacionesService from '@servicios/notificacionesService';

const NotificacionesPanel = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    const cargarEstadisticas = async () => {
        try {
            setActualizando(true);
            const data = await notificacionesService.obtenerEstadisticas();
            setEstadisticas(data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
            setActualizando(false);
        }
    };

    const handleLimpiar = async () => {
        try {
            await notificacionesService.limpiarEstadisticas();
            await cargarEstadisticas();
        } catch (error) {
            console.error('Error al limpiar estadísticas:', error);
        }
    };

    useEffect(() => {
        cargarEstadisticas();
        
        // Actualizar cada 5 segundos
        const intervalo = setInterval(cargarEstadisticas, 5000);
        
        return () => clearInterval(intervalo);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    const totalCorreos = (estadisticas?.enviados || 0) + (estadisticas?.fallidos || 0);
    const tasaExito = totalCorreos > 0 
        ? Math.round((estadisticas.enviados / totalCorreos) * 100) 
        : 0;

    return (
        <Box sx={{ p: 3 }}>
            {/* Acciones */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={cargarEstadisticas}
                    disabled={actualizando}
                >
                    Actualizar
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleLimpiar}
                >
                    Limpiar Estadísticas
                </Button>
            </Box>

            {/* Estado de la cola */}
            {estadisticas?.enCola > 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ScheduleIcon />
                        <Typography variant="body2">
                            Hay <strong>{estadisticas.enCola}</strong> correo(s) en cola esperando ser enviados
                        </Typography>
                        {estadisticas.procesando && (
                            <Chip 
                                label="Procesando..." 
                                color="primary" 
                                size="small"
                                icon={<CircularProgress size={16} color="inherit" />}
                            />
                        )}
                    </Box>
                </Alert>
            )}

            {/* Tarjetas de estadísticas */}
            <Grid container spacing={3}>
                {/* Correos Enviados */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', bgcolor: '#e8f5e9' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                                <Box>
                                    <Typography variant="h4" component="div" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                        {estadisticas?.enviados || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Enviados
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Correos Fallidos */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', bgcolor: '#ffebee' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ErrorIcon sx={{ fontSize: 40, color: '#f44336', mr: 2 }} />
                                <Box>
                                    <Typography variant="h4" component="div" sx={{ color: '#c62828', fontWeight: 'bold' }}>
                                        {estadisticas?.fallidos || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Fallidos
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* En Cola */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ScheduleIcon sx={{ fontSize: 40, color: '#2196f3', mr: 2 }} />
                                <Box>
                                    <Typography variant="h4" component="div" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                                        {estadisticas?.enCola || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        En Cola
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tasa de Éxito */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', bgcolor: '#f3e5f5' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <EmailIcon sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h4" component="div" sx={{ color: '#6a1b9a', fontWeight: 'bold' }}>
                                        {tasaExito}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tasa de Éxito
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Información adicional */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Último Envío */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            📅 Último Envío
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {estadisticas?.ultimoEnvio 
                                ? new Date(estadisticas.ultimoEnvio).toLocaleString('es-ES', {
                                    dateStyle: 'full',
                                    timeStyle: 'medium'
                                })
                                : 'No hay envíos registrados'
                            }
                        </Typography>
                    </Paper>
                </Grid>

                {/* Progreso */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            📊 Progreso General
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Exitosos</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {estadisticas?.enviados || 0} / {totalCorreos}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={tasaExito} 
                                sx={{ 
                                    height: 10, 
                                    borderRadius: 5,
                                    bgcolor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: tasaExito > 90 ? '#4caf50' : tasaExito > 70 ? '#ff9800' : '#f44336'
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Errores recientes */}
                {estadisticas?.errores && estadisticas.errores.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom color="error">
                                ⚠️ Errores Recientes
                            </Typography>
                            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {estadisticas.errores.slice(-5).reverse().map((error, index) => (
                                    <Alert severity="error" sx={{ mb: 1 }} key={index}>
                                        <Typography variant="body2">
                                            <strong>{error.correo}</strong> - {error.asunto}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {error.error}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            {new Date(error.timestamp).toLocaleString('es-ES')}
                                        </Typography>
                                    </Alert>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default NotificacionesPanel;
