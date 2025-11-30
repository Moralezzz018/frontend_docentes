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
    LinearProgress,
    Grow,
    Zoom,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Email as EmailIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Schedule as ScheduleIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon,
    TrendingUp as TrendingUpIcon,
    Close as CloseIcon,
    AccessTime as AccessTimeIcon,
    Done as DoneIcon
} from '@mui/icons-material';
import notificacionesService from '@servicios/notificacionesService';

const NotificacionesPanel = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [dialogTipo, setDialogTipo] = useState('');
    const [dialogDatos, setDialogDatos] = useState(null);

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

    const handleAbrirDialog = (tipo) => {
        setDialogTipo(tipo);
        setDialogDatos(estadisticas);
        setDialogAbierto(true);
    };

    const handleCerrarDialog = () => {
        setDialogAbierto(false);
        setDialogTipo('');
        setDialogDatos(null);
    };

    const renderDialogContent = () => {
        if (!dialogDatos) return null;

        switch (dialogTipo) {
            case 'enviados':
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom color="success.main">
                            ✅ Correos Enviados Exitosamente
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <DoneIcon color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Total enviados"
                                    secondary={`${dialogDatos.enviados} correo(s) entregado(s) exitosamente`}
                                />
                            </ListItem>
                            {dialogDatos.ultimoEnvio && (
                                <ListItem>
                                    <ListItemIcon>
                                        <AccessTimeIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Último envío"
                                        secondary={new Date(dialogDatos.ultimoEnvio).toLocaleString('es-ES', {
                                            dateStyle: 'full',
                                            timeStyle: 'medium'
                                        })}
                                    />
                                </ListItem>
                            )}
                            <ListItem>
                                <ListItemIcon>
                                    <TrendingUpIcon color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Tasa de éxito"
                                    secondary={`${dialogDatos.porcentajeExito}% de efectividad`}
                                />
                            </ListItem>
                        </List>
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Los correos fueron entregados correctamente a los destinatarios. 
                            Esto incluye notificaciones de evaluaciones, asistencias y proyectos.
                        </Alert>
                    </Box>
                );

            case 'fallidos':
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom color="error.main">
                            ❌ Correos Fallidos
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <ErrorIcon color="error" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Total fallidos"
                                    secondary={`${dialogDatos.fallidos} correo(s) no pudieron ser enviados`}
                                />
                            </ListItem>
                        </List>
                        {dialogDatos.errores && dialogDatos.errores.length > 0 ? (
                            <>
                                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                    Últimos errores registrados:
                                </Typography>
                                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {dialogDatos.errores.slice(-5).reverse().map((error, index) => (
                                        <Alert severity="error" sx={{ mb: 1 }} key={index}>
                                            <Typography variant="body2">
                                                {error.mensaje}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(error.fecha).toLocaleString('es-ES')}
                                            </Typography>
                                        </Alert>
                                    ))}
                                </Box>
                            </>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No hay errores registrados actualmente.
                            </Alert>
                        )}
                    </Box>
                );

            case 'cola':
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom color="primary.main">
                            ⏳ Correos en Cola
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <ScheduleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Correos pendientes"
                                    secondary={`${dialogDatos.enCola} correo(s) esperando ser procesados`}
                                />
                            </ListItem>
                        </List>
                        {dialogDatos.enCola > 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Estos correos están en cola y serán enviados automáticamente en los próximos minutos.
                                El sistema procesa los correos de forma asíncrona para no afectar el rendimiento.
                            </Alert>
                        ) : (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                ¡Excelente! No hay correos pendientes en este momento. 
                                Todos los correos programados han sido procesados.
                            </Alert>
                        )}
                    </Box>
                );

            case 'tasa':
                const totalCorreos = (dialogDatos.enviados || 0) + (dialogDatos.fallidos || 0);
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom color="secondary.main">
                            📊 Análisis de Tasa de Éxito
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <TrendingUpIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Tasa de éxito"
                                    secondary={`${dialogDatos.porcentajeExito}%`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <EmailIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Total procesados"
                                    secondary={`${totalCorreos} correo(s)`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Exitosos"
                                    secondary={`${dialogDatos.enviados} correo(s)`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ErrorIcon color="error" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Fallidos"
                                    secondary={`${dialogDatos.fallidos} correo(s)`}
                                />
                            </ListItem>
                        </List>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                Distribución visual:
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={dialogDatos.porcentajeExito} 
                                sx={{ 
                                    height: 20, 
                                    borderRadius: 5,
                                    bgcolor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: dialogDatos.porcentajeExito > 90 ? '#4caf50' : 
                                                dialogDatos.porcentajeExito > 70 ? '#ff9800' : '#f44336'
                                    }
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                {dialogDatos.porcentajeExito > 90 
                                    ? '¡Excelente rendimiento! El sistema está funcionando óptimamente.' 
                                    : dialogDatos.porcentajeExito > 70 
                                    ? 'Buen rendimiento, pero hay algunas fallas que revisar.'
                                    : 'Se detectan problemas. Revisa la configuración del correo.'}
                            </Typography>
                        </Box>
                    </Box>
                );

            default:
                return null;
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
                    <Grow in={!loading} timeout={500}>
                        <Card 
                            onClick={() => handleAbrirDialog('enviados')}
                            sx={{ 
                                height: '100%', 
                                bgcolor: '#e8f5e9',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(76, 175, 80, 0.3)',
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Zoom in={!loading} timeout={700}>
                                        <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                                    </Zoom>
                                    <Box>
                                        <Typography 
                                            variant="h4" 
                                            component="div" 
                                            sx={{ 
                                                color: '#2e7d32', 
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        >
                                            {estadisticas?.enviados || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Enviados
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>

                {/* Correos Fallidos */}
                <Grid item xs={12} sm={6} md={3}>
                    <Grow in={!loading} timeout={700}>
                        <Card 
                            onClick={() => handleAbrirDialog('fallidos')}
                            sx={{ 
                                height: '100%', 
                                bgcolor: '#ffebee',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(244, 67, 54, 0.3)',
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Zoom in={!loading} timeout={900}>
                                        <ErrorIcon sx={{ fontSize: 40, color: '#f44336', mr: 2 }} />
                                    </Zoom>
                                    <Box>
                                        <Typography 
                                            variant="h4" 
                                            component="div" 
                                            sx={{ 
                                                color: '#c62828', 
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        >
                                            {estadisticas?.fallidos || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fallidos
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>

                {/* En Cola */}
                <Grid item xs={12} sm={6} md={3}>
                    <Grow in={!loading} timeout={900}>
                        <Card 
                            onClick={() => handleAbrirDialog('cola')}
                            sx={{ 
                                height: '100%', 
                                bgcolor: '#e3f2fd',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(33, 150, 243, 0.3)',
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Zoom in={!loading} timeout={1100}>
                                        <ScheduleIcon 
                                            sx={{ 
                                                fontSize: 40, 
                                                color: '#2196f3', 
                                                mr: 2,
                                                animation: estadisticas?.enCola > 0 ? 'pulse 2s infinite' : 'none',
                                                '@keyframes pulse': {
                                                    '0%': { transform: 'scale(1)' },
                                                    '50%': { transform: 'scale(1.1)' },
                                                    '100%': { transform: 'scale(1)' }
                                                }
                                            }} 
                                        />
                                    </Zoom>
                                    <Box>
                                        <Typography 
                                            variant="h4" 
                                            component="div" 
                                            sx={{ 
                                                color: '#1565c0', 
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        >
                                            {estadisticas?.enCola || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            En Cola
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>

                {/* Tasa de Éxito */}
                <Grid item xs={12} sm={6} md={3}>
                    <Grow in={!loading} timeout={1100}>
                        <Card 
                            onClick={() => handleAbrirDialog('tasa')}
                            sx={{ 
                                height: '100%', 
                                bgcolor: '#f3e5f5',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(156, 39, 176, 0.3)',
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Zoom in={!loading} timeout={1300}>
                                        <TrendingUpIcon sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />
                                    </Zoom>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography 
                                            variant="h4" 
                                            component="div" 
                                            sx={{ 
                                                color: '#6a1b9a', 
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        >
                                            {tasaExito}%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tasa de Éxito
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>
            </Grid>

            {/* Información adicional */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Último Envío */}
                <Grid item xs={12} md={6}>
                    <Fade in={!loading} timeout={1000}>
                        <Paper 
                            sx={{ 
                                p: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateX(8px)',
                                    boxShadow: 4
                                }
                            }}
                        >
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
                    </Fade>
                </Grid>

                {/* Progreso */}
                <Grid item xs={12} md={6}>
                    <Fade in={!loading} timeout={1200}>
                        <Paper 
                            sx={{ 
                                p: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateX(8px)',
                                    boxShadow: 4
                                }
                            }}
                        >
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
                                        transition: 'all 0.5s ease',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: tasaExito > 90 ? '#4caf50' : tasaExito > 70 ? '#ff9800' : '#f44336',
                                            transition: 'all 0.5s ease'
                                        }
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Fade>
                </Grid>

                {/* Errores recientes */}
                {estadisticas?.errores && estadisticas.errores.length > 0 && (
                    <Grid item xs={12}>
                        <Fade in={!loading} timeout={1400}>
                            <Paper 
                                sx={{ 
                                    p: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <Typography variant="h6" gutterBottom color="error">
                                    ⚠️ Errores Recientes
                                </Typography>
                                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                    {estadisticas.errores.slice(-5).reverse().map((error, index) => (
                                        <Zoom in={!loading} timeout={500 + (index * 100)} key={index}>
                                            <Alert 
                                                severity="error" 
                                                sx={{ 
                                                    mb: 1,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(8px)',
                                                        boxShadow: 2
                                                    }
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    <strong>{error.mensaje}</strong>
                                                </Typography>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    {new Date(error.fecha).toLocaleString('es-ES')}
                                                </Typography>
                                            </Alert>
                                        </Zoom>
                                    ))}
                                </Box>
                            </Paper>
                        </Fade>
                    </Grid>
                )}
            </Grid>

            {/* Dialog de información detallada */}
            <Dialog 
                open={dialogAbierto} 
                onClose={handleCerrarDialog}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Zoom}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    bgcolor: dialogTipo === 'enviados' ? '#e8f5e9' : 
                             dialogTipo === 'fallidos' ? '#ffebee' : 
                             dialogTipo === 'cola' ? '#e3f2fd' : '#f3e5f5'
                }}>
                    <Typography variant="h6">
                        Detalles de Notificaciones
                    </Typography>
                    <Button 
                        onClick={handleCerrarDialog} 
                        color="inherit" 
                        size="small"
                        sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent dividers>
                    {renderDialogContent()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCerrarDialog} variant="contained">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NotificacionesPanel;
