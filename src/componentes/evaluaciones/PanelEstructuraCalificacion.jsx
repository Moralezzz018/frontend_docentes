import { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Alert,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { estructuraCalificacionService } from '@servicios/estructuraCalificacionService';

/**
 * Panel que muestra el resumen de la estructura de calificación
 * y el progreso de puntos asignados en evaluaciones
 */
const PanelEstructuraCalificacion = ({ parcialId, claseId, evaluaciones }) => {
    const [estructura, setEstructura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (parcialId && claseId) {
            cargarEstructura();
        }
    }, [parcialId, claseId]);

    const cargarEstructura = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await estructuraCalificacionService.obtenerPorParcialYClase(parcialId, claseId);
            setEstructura(data);
        } catch (err) {
            console.error('Error al cargar estructura:', err);
            setError('No se pudo cargar la estructura de calificación');
        } finally {
            setLoading(false);
        }
    };

    // Calcular totales por tipo de evaluación
    const calcularTotales = () => {
        const totales = {
            acumulativo: 0,
            examen: 0,
            reposicion: 0,
        };

        const evaluacionesPorTipo = {
            NORMAL: [],
            EXAMEN: [],
            REPOSICION: [],
        };

        // Si no hay evaluaciones, retornar valores por defecto
        if (!evaluaciones || !Array.isArray(evaluaciones) || evaluaciones.length === 0) {
            return { totales, evaluacionesPorTipo };
        }

        // Agrupar evaluaciones por tipo y calcular sus puntos
        evaluaciones.forEach(ev => {
            const puntos = parseFloat(ev.notaMaxima || 0);
            const tipo = ev.tipo || 'NORMAL';
            
            if (tipo === 'NORMAL') {
                totales.acumulativo += puntos;
                evaluacionesPorTipo.NORMAL.push({ titulo: ev.titulo, puntos });
            } else if (tipo === 'EXAMEN') {
                totales.examen += puntos;
                evaluacionesPorTipo.EXAMEN.push({ titulo: ev.titulo, puntos });
            } else if (tipo === 'REPOSICION') {
                totales.reposicion += puntos;
                evaluacionesPorTipo.REPOSICION.push({ titulo: ev.titulo, puntos });
            }
        });

        return { totales, evaluacionesPorTipo };
    };

    const { totales = { acumulativo: 0, examen: 0, reposicion: 0 }, evaluacionesPorTipo = { NORMAL: [], EXAMEN: [], REPOSICION: [] } } = calcularTotales();

    // Calcular límites según estructura
    const limites = {
        acumulativo: estructura ? parseFloat(estructura.pesoAcumulativo || 0) : 60,
        examen: estructura ? parseFloat(estructura.pesoExamen || 0) : 40,
        reposicion: estructura ? parseFloat(estructura.pesoReposicion || 0) : 0,
    };

    // Calcular restantes (con validación de seguridad)
    const restantes = {
        acumulativo: limites.acumulativo - (totales?.acumulativo || 0),
        examen: limites.examen - (totales?.examen || 0),
        reposicion: limites.reposicion - (totales?.reposicion || 0),
    };

    // Calcular porcentajes de progreso
    const porcentajes = {
        acumulativo: limites.acumulativo > 0 ? ((totales?.acumulativo || 0) / limites.acumulativo) * 100 : 0,
        examen: limites.examen > 0 ? ((totales?.examen || 0) / limites.examen) * 100 : 0,
        reposicion: limites.reposicion > 0 ? ((totales?.reposicion || 0) / limites.reposicion) * 100 : 0,
    };

    // Determinar estado general
    const totalAsignado = (totales?.acumulativo || 0) + (totales?.examen || 0) + (totales?.reposicion || 0);
    const totalLimite = limites.acumulativo + limites.examen + limites.reposicion;
    const totalRestante = totalLimite - totalAsignado;

    const getEstadoColor = (restante) => {
        if (restante < 0) return 'error'; // Excede
        if (restante === 0) return 'success'; // Completo
        return 'warning'; // Faltan puntos
    };

    const getEstadoIcon = (restante) => {
        if (restante < 0) return <ErrorIcon />;
        if (restante === 0) return <CheckCircleIcon />;
        return <WarningIcon />;
    };

    const getEstadoMensaje = () => {
        if (totalRestante < 0) {
            return `⚠️ ADVERTENCIA: Se han excedido ${Math.abs(totalRestante).toFixed(2)} puntos del total permitido`;
        }
        if (totalRestante === 0) {
            return '✅ Estructura completa: Todos los puntos han sido asignados';
        }
        return `⚠️ Faltan ${totalRestante.toFixed(2)} puntos por asignar`;
    };

    const CardTipoEvaluacion = ({ titulo, icon, color, limite, asignado, restante, porcentaje, evaluacionesLista }) => (
        <Card sx={{ height: '100%', border: `2px solid ${restante < 0 ? '#d32f2f' : 'transparent'}` }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {icon}
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                        {titulo} ({limite}%)
                    </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Asignado: <strong>{asignado.toFixed(2)}/{limite} pts</strong>
                        </Typography>
                        <Chip 
                            label={`${porcentaje.toFixed(0)}%`} 
                            size="small" 
                            color={restante < 0 ? 'error' : restante === 0 ? 'success' : 'warning'} 
                        />
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={Math.min(porcentaje, 100)} 
                        color={restante < 0 ? 'error' : restante === 0 ? 'success' : 'primary'}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography 
                        variant="body2" 
                        color={restante < 0 ? 'error' : restante === 0 ? 'success.main' : 'warning.main'}
                        sx={{ fontWeight: 600 }}
                    >
                        {restante < 0 
                            ? `⚠️ EXCEDE: ${Math.abs(restante).toFixed(2)} pts de más`
                            : restante === 0 
                            ? '✅ COMPLETO' 
                            : `Restante: ${restante.toFixed(2)} pts`}
                    </Typography>
                </Box>

                {evaluacionesLista && evaluacionesLista.length > 0 && (
                    <>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Evaluaciones:
                        </Typography>
                        <List dense sx={{ p: 0 }}>
                            {evaluacionesLista.map((ev, idx) => (
                                <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                                    <ListItemText 
                                        primary={
                                            <Typography variant="caption">
                                                • {ev.titulo}: <strong>{ev.puntos} pts</strong>
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography>Cargando estructura de calificación...</Typography>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 2, mt: 3 }}>
                <Alert severity="warning">{error}</Alert>
            </Paper>
        );
    }

    if (!estructura) {
        return null;
    }

    return (
        <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                📊 Resumen de Estructura de Calificación
            </Typography>

            {/* Alert de estado general */}
            <Alert 
                severity={totalRestante < 0 ? 'error' : totalRestante === 0 ? 'success' : 'warning'}
                icon={getEstadoIcon(totalRestante)}
                sx={{ mb: 3 }}
            >
                <Typography variant="body1">
                    {getEstadoMensaje()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Total asignado: <strong>{totalAsignado.toFixed(2)} pts</strong> de{' '}
                    <strong>{totalLimite} pts</strong> ({estructura.notaMaximaParcial || 100} puntos máximos del parcial)
                </Typography>
            </Alert>

            {/* Tarjetas por tipo de evaluación */}
            <Grid container spacing={3}>
                {/* Acumulativo */}
                <Grid item xs={12} md={limites.reposicion > 0 ? 4 : 6}>
                    <CardTipoEvaluacion
                        titulo="📝 ACUMULATIVO"
                        icon={<Typography fontSize="2rem">📝</Typography>}
                        color="primary"
                        limite={limites.acumulativo}
                        asignado={totales?.acumulativo || 0}
                        restante={restantes.acumulativo}
                        porcentaje={porcentajes.acumulativo}
                        evaluacionesLista={evaluacionesPorTipo?.NORMAL || []}
                    />
                </Grid>

                {/* Examen */}
                <Grid item xs={12} md={limites.reposicion > 0 ? 4 : 6}>
                    <CardTipoEvaluacion
                        titulo="📄 EXAMEN"
                        icon={<Typography fontSize="2rem">📄</Typography>}
                        color="error"
                        limite={limites.examen}
                        asignado={totales?.examen || 0}
                        restante={restantes.examen}
                        porcentaje={porcentajes.examen}
                        evaluacionesLista={evaluacionesPorTipo?.EXAMEN || []}
                    />
                </Grid>

                {/* Reposición (solo si está configurado) */}
                {limites.reposicion > 0 && (
                    <Grid item xs={12} md={4}>
                        <CardTipoEvaluacion
                            titulo="🔄 REPOSICIÓN"
                            icon={<Typography fontSize="2rem">🔄</Typography>}
                            color="warning"
                            limite={limites.reposicion}
                            asignado={totales?.reposicion || 0}
                            restante={restantes.reposicion}
                            porcentaje={porcentajes.reposicion}
                            evaluacionesLista={evaluacionesPorTipo?.REPOSICION || []}
                        />
                    </Grid>
                )}
            </Grid>

            {/* Información adicional de la estructura */}
            {estructura && !estructura.esDefault && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        <strong>Nota mínima de aprobación:</strong> {estructura.notaMinimaAprobacion || 70} puntos
                    </Typography>
                    {estructura.observaciones && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            <strong>Observaciones:</strong> {estructura.observaciones}
                        </Typography>
                    )}
                </Box>
            )}
        </Paper>
    );
};

export default PanelEstructuraCalificacion;
