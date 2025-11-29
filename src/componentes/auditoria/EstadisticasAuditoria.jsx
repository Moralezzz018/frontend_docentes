import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { auditoriaService } from '../../servicios/auditoriaService';
import { EstadoContenido } from '../common';

const COLORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const EstadisticasAuditoria = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await auditoriaService.obtenerEstadisticas(fechaInicio, fechaFin);
            setEstadisticas(data);
        } catch (err) {
            setError(err.error || 'Error al cargar estadísticas');
        } finally {
            setCargando(false);
        }
    };

    const aplicarFiltros = () => {
        cargarEstadisticas();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                    Estadísticas de Auditoría
                </Typography>

                <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.main', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Fecha Inicio"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                InputLabelProps={{ 
                                    shrink: true,
                                    style: { color: 'white' }
                                }}
                                sx={{ 
                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                    borderRadius: 1,
                                    '& .MuiInputLabel-root': { color: 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Fecha Fin"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                InputLabelProps={{ 
                                    shrink: true,
                                    style: { color: 'white' }
                                }}
                                sx={{ 
                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                    borderRadius: 1,
                                    '& .MuiInputLabel-root': { color: 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button variant="contained" fullWidth onClick={aplicarFiltros}>
                                Aplicar Filtros
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <EstadoContenido
                    cargando={cargando}
                    error={error}
                    datos={estadisticas}
                    tipoCarga="circular"
                >
                    {estadisticas && (
                        <Grid container spacing={3}>
                            {/* Tarjeta de Total */}
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>
                                            Total de Logs
                                        </Typography>
                                        <Typography variant="h3" component="div">
                                            {estadisticas.totalLogs.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Gráfico de Logs por Resultado */}
                            <Grid item xs={12} md={8}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Logs por Resultado
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie
                                                    data={estadisticas.logsPorResultado.map(item => ({
                                                        name: item.resultado,
                                                        value: parseInt(item.cantidad)
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {estadisticas.logsPorResultado.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.resultado === 'EXITOSO' ? '#00C49F' : '#FF8042'} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Gráfico de Logs por Acción */}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Logs por Acción
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart
                                                data={estadisticas.logsPorAccion.map(item => ({
                                                    accion: item.accion,
                                                    cantidad: parseInt(item.cantidad)
                                                }))}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="accion" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="cantidad" fill="#0088FE" name="Cantidad" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Gráfico de Actividad por Día */}
                            {estadisticas.actividadPorDia && estadisticas.actividadPorDia.length > 0 && (
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Actividad Diaria (Últimos 30 días)
                                            </Typography>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart
                                                    data={estadisticas.actividadPorDia.map(item => ({
                                                        fecha: item.fecha,
                                                        cantidad: parseInt(item.cantidad)
                                                    }))}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="fecha" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="cantidad" stroke="#8884d8" name="Actividad" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {/* Usuarios Más Activos */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Usuarios Más Activos
                                        </Typography>
                                        <List dense>
                                            {estadisticas.usuariosMasActivos.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary={item.usuario?.login || 'Usuario desconocido'}
                                                            secondary={`${item.cantidad} acciones`}
                                                        />
                                                    </ListItem>
                                                    {index < estadisticas.usuariosMasActivos.length - 1 && <Divider />}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Logs por Entidad */}
                            {estadisticas.logsPorEntidad && estadisticas.logsPorEntidad.length > 0 && (
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Logs por Entidad
                                            </Typography>
                                            <List dense>
                                                {estadisticas.logsPorEntidad.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={item.entidad}
                                                                secondary={`${item.cantidad} registros`}
                                                            />
                                                        </ListItem>
                                                        {index < estadisticas.logsPorEntidad.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </EstadoContenido>
            </Paper>
        </Box>
    );
};

export default EstadisticasAuditoria;
