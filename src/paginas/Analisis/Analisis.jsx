import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Grid,
    Paper,
    TextField,
    MenuItem,
    Button,
    Card,
    CardContent,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tooltip,
    Skeleton,
} from '@mui/material'
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
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import SearchIcon from '@mui/icons-material/Search'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import EventNoteIcon from '@mui/icons-material/EventNote'
import SchoolIcon from '@mui/icons-material/School'
import { analisisService } from '@servicios/analisisService'
import { catalogosService } from '@servicios/catalogosService'
import { useAuthStore } from '@almacen/authStore'
import EstadoContenido from '@componentes/common/EstadoContenido'
import MensajeError from '@componentes/common/MensajeError'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const Analisis = () => {
    const { user } = useAuthStore()
    const [tabValue, setTabValue] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingCatalogos, setLoadingCatalogos] = useState(true)
    const [error, setError] = useState(null)

    // Catálogos
    const [periodos, setPeriodos] = useState([])
    const [clases, setClases] = useState([])
    const [parciales, setParciales] = useState([])
    const [estudiantes, setEstudiantes] = useState([])

    // Filtros
    const [filtros, setFiltros] = useState({
        periodoId: '',
        claseId: '',
        parcialId: '',
        estudianteId: '',
    })

    // Datos de análisis
    const [datosAnalisis, setDatosAnalisis] = useState(null)

    const isAdmin = user?.rol?.nombre === 'ADMIN'
    const isDocente = user?.rol?.nombre === 'DOCENTE'

    useEffect(() => {
        cargarCatalogos()
    }, [])

    const cargarCatalogos = async () => {
        setLoadingCatalogos(true)
        try {
            const [periodosData, clasesData, estudiantesData] = await Promise.all([
                catalogosService.obtenerPeriodos().catch((e) => { console.error('Error periodos:', e); return []; }),
                catalogosService.obtenerClases().catch((e) => { console.error('Error clases:', e); return []; }),
                catalogosService.obtenerEstudiantes().catch((e) => { console.error('Error estudiantes:', e); return []; }),
            ])
            
            console.log('Periodos cargados:', periodosData)
            console.log('Clases cargadas:', clasesData)
            console.log('Estudiantes cargados:', estudiantesData)
            
            setPeriodos(Array.isArray(periodosData) ? periodosData : [])
            setClases(Array.isArray(clasesData) ? clasesData : [])
            setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : [])
        } catch (err) {
            console.error('Error al cargar catálogos:', err)
            setError(err)
        } finally {
            setLoadingCatalogos(false)
        }
    }

    const cargarParciales = async (periodoId) => {
        try {
            const data = await catalogosService.obtenerParciales(periodoId)
            console.log('Parciales cargados:', data)
            setParciales(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error al cargar parciales:', err)
            setParciales([])
        }
    }

    const handleFiltroChange = (e) => {
        const { name, value } = e.target
        setFiltros({
            ...filtros,
            [name]: value,
        })

        // Si cambia el periodo, cargar parciales
        if (name === 'periodoId' && value) {
            cargarParciales(value)
        }
    }

    const handleAnalizar = async () => {
        setError(null)
        setLoading(true)

        try {
            let datos = null

            console.log('Analizando con filtros:', filtros)
            console.log('Tab actual:', tabValue)

            switch (tabValue) {
                case 0: // Análisis por Parcial
                    if (!filtros.parcialId || !filtros.claseId) {
                        setError('Seleccione un parcial y una clase')
                        setLoading(false)
                        return
                    }
                    console.log('Llamando analizarParcial con:', filtros.parcialId, filtros.claseId)
                    datos = await analisisService.analizarParcial(filtros.parcialId, filtros.claseId)
                    break

                case 1: // Análisis por Periodo
                    if (!filtros.periodoId || !filtros.claseId) {
                        setError('Seleccione un periodo y una clase')
                        setLoading(false)
                        return
                    }
                    console.log('Llamando analizarPeriodo con:', filtros.periodoId, filtros.claseId)
                    datos = await analisisService.analizarPeriodo(filtros.periodoId, filtros.claseId)
                    break

                case 2: // Reporte de Estudiante
                    if (!filtros.estudianteId || !filtros.periodoId) {
                        setError('Seleccione un estudiante y un periodo')
                        setLoading(false)
                        return
                    }
                    console.log('Llamando reporteEstudiante con:', filtros.estudianteId, filtros.periodoId)
                    datos = await analisisService.reporteEstudiante(filtros.estudianteId, filtros.periodoId)
                    break

                case 3: // Reporte de Clase
                    if (!filtros.claseId || !filtros.periodoId) {
                        setError('Seleccione una clase y un periodo')
                        setLoading(false)
                        return
                    }
                    console.log('Llamando reporteClase con:', filtros.claseId, filtros.periodoId)
                    datos = await analisisService.reporteClase(filtros.claseId, filtros.periodoId)
                    break

                default:
                    break
            }

            console.log('Datos recibidos:', datos)
            setDatosAnalisis(datos)
            setError(null) // Limpiar error anterior si fue exitoso
        } catch (err) {
            console.error('Error completo al analizar:', err)
            console.error('Respuesta del error:', err.response)
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        setDatosAnalisis(null)
        setError(null)
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AssessmentIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h4">
                    Análisis y Reportes
                </Typography>
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<EventNoteIcon />} label="Análisis por Parcial" iconPosition="start" />
                    <Tab icon={<TrendingUpIcon />} label="Análisis por Periodo" iconPosition="start" />
                    <Tab icon={<SchoolIcon />} label="Reporte de Estudiante" iconPosition="start" />
                    <Tab icon={<PeopleIcon />} label="Reporte de Clase" iconPosition="start" />
                </Tabs>

                {/* Filtros */}
                <Box sx={{ p: 3 }}>
                    <EstadoContenido
                        cargando={loadingCatalogos}
                        error={null}
                        datos={periodos}
                        mensajeCarga="Cargando opciones de filtros..."
                        tipoCarga="skeleton"
                        filas={2}
                        verificarVacio={false}
                    >
                        <Grid container spacing={2}>
                            {/* Filtro de Periodo */}
                            {(tabValue === 1 || tabValue === 2 || tabValue === 3) && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Periodo"
                                        name="periodoId"
                                        value={filtros.periodoId}
                                        onChange={handleFiltroChange}
                                        size="small"
                                    >
                                        <MenuItem value="">Seleccione...</MenuItem>
                                        {periodos.map((periodo) => (
                                            <MenuItem key={periodo.id} value={periodo.id}>
                                            {periodo.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}

                        {/* Filtro de Parcial */}
                        {tabValue === 0 && (
                            <>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Periodo"
                                        name="periodoId"
                                        value={filtros.periodoId}
                                        onChange={handleFiltroChange}
                                        size="small"
                                    >
                                        <MenuItem value="">Seleccione...</MenuItem>
                                        {periodos.map((periodo) => (
                                            <MenuItem key={periodo.id} value={periodo.id}>
                                                {periodo.nombre}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Parcial"
                                        name="parcialId"
                                        value={filtros.parcialId}
                                        onChange={handleFiltroChange}
                                        size="small"
                                        disabled={!filtros.periodoId}
                                    >
                                        <MenuItem value="">Seleccione...</MenuItem>
                                        {parciales.map((parcial) => (
                                            <MenuItem key={parcial.id} value={parcial.id}>
                                                {parcial.nombre}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </>
                        )}

                        {/* Filtro de Clase */}
                        {(tabValue === 0 || tabValue === 1 || tabValue === 3) && (
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Clase"
                                    name="claseId"
                                    value={filtros.claseId}
                                    onChange={handleFiltroChange}
                                    size="small"
                                >
                                    <MenuItem value="">Seleccione...</MenuItem>
                                    {clases.map((clase) => (
                                        <MenuItem key={clase.id} value={clase.id}>
                                            {clase.codigo} - {clase.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}

                        {/* Filtro de Estudiante */}
                        {tabValue === 2 && (
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Estudiante"
                                    name="estudianteId"
                                    value={filtros.estudianteId}
                                    onChange={handleFiltroChange}
                                    size="small"
                                >
                                    <MenuItem value="">Seleccione...</MenuItem>
                                    {estudiantes.map((est) => (
                                        <MenuItem key={est.id} value={est.id}>
                                            {est.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={handleAnalizar}
                                disabled={loading}
                                sx={{ height: '40px' }}
                            >
                                {loading ? 'Analizando...' : 'Analizar'}
                            </Button>
                        </Grid>
                    </Grid>
                    </EstadoContenido>
                </Box>
            </Paper>

            {/* Mensaje de error */}
            {error && (
                <MensajeError
                    error={error}
                    mostrarDetalles={true}
                    onReintentar={handleAnalizar}
                    onCerrar={() => setError(null)}
                />
            )}

            {/* Resultados */}
            <EstadoContenido
                cargando={loading}
                error={null}
                datos={datosAnalisis}
                mensajeCarga="Generando análisis estadístico..."
                tipoCarga="circular"
                alturaCarga={300}
                tipoVacio="analisis"
                mensajeVacio="Sin resultados"
                descripcionVacio="Selecciona los filtros y presiona 'Analizar' para generar el reporte"
            >
                {datosAnalisis && (
                    <>
                        {tabValue === 0 && <AnalisisParcial datos={datosAnalisis} />}
                        {tabValue === 1 && <AnalisisPeriodo datos={datosAnalisis} />}
                        {tabValue === 2 && <ReporteEstudiante datos={datosAnalisis} />}
                        {tabValue === 3 && <ReporteClase datos={datosAnalisis} />}
                    </>
                )}
            </EstadoContenido>
        </Box>
    )
}

// Componente para Análisis por Parcial
const AnalisisParcial = ({ datos }) => {
    const { estadisticas, detalleEstudiantes, parcial, clase } = datos

    const datosGrafico = [
        { name: 'Promedio General', value: estadisticas.promedioGeneral },
        { name: 'Asistencia', value: estadisticas.promedioAsistencia },
    ]

    return (
        <Grid container spacing={3}>
            {/* Tarjetas de estadísticas */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                            Promedio General
                        </Typography>
                        <Typography variant="h3" color="primary">
                            {estadisticas.promedioGeneral.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {parcial.nombre} - {clase.codigo}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                            Asistencia Promedio
                        </Typography>
                        <Typography variant="h3" color="success.main">
                            {estadisticas.promedioAsistencia.toFixed(2)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {estadisticas.totalEstudiantes} estudiantes
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                            Inasistencias
                        </Typography>
                        <Typography variant="h3" color="error.main">
                            {estadisticas.porcentajeInasistencias.toFixed(2)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Del total de clases
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Gráfico de barras */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Resumen de Rendimiento
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={datosGrafico}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            {/* Gráfico de pastel */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Distribución de Asistencia
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Presentes', value: estadisticas.promedioAsistencia },
                                    { name: 'Ausentes', value: estadisticas.porcentajeInasistencias },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {[0, 1].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            {/* Tabla de estudiantes */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Detalle por Estudiante
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Estudiante</TableCell>
                                    <TableCell align="center">Promedio</TableCell>
                                    <TableCell align="center">Asistencias</TableCell>
                                    <TableCell align="center">Tardanzas</TableCell>
                                    <TableCell align="center">Inasistencias</TableCell>
                                    <TableCell align="center">% Asistencia</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalleEstudiantes.map((est) => (
                                    <TableRow key={est.estudianteId}>
                                        <TableCell>{est.nombre}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={est.promedioNotas.toFixed(2)}
                                                color={est.promedioNotas >= 70 ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">{est.asistencias}</TableCell>
                                        <TableCell align="center">{est.tardanzas}</TableCell>
                                        <TableCell align="center">{est.inasistencias}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={`${est.porcentajeAsistencia.toFixed(1)}%`}
                                                color={est.porcentajeAsistencia >= 80 ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}

// Componente para Análisis por Periodo
const AnalisisPeriodo = ({ datos }) => {
    const { estadisticas, evolucionPorParcial, detalleEstudiantes, periodo, clase } = datos

    return (
        <Grid container spacing={3}>
            {/* Tarjetas de estadísticas */}
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                            Promedio Acumulado
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {estadisticas.promedioAcumulado.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                            Asistencia
                        </Typography>
                        <Typography variant="h4" color="success.main">
                            {estadisticas.porcentajeAsistencia.toFixed(1)}%
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                            Proyectos Entregados
                        </Typography>
                        <Typography variant="h4" color="info.main">
                            {estadisticas.proyectosEntregados}/{estadisticas.totalProyectos}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                            Proyectos Pendientes
                        </Typography>
                        <Typography variant="h4" color="warning.main">
                            {estadisticas.proyectosPendientes}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Gráfico de evolución */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Evolución del Rendimiento por Parcial
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={evolucionPorParcial}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="promedio" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            {/* Tabla de estudiantes */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Rendimiento por Estudiante - {periodo.nombre}
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Estudiante</TableCell>
                                    <TableCell align="center">Promedio</TableCell>
                                    <TableCell align="center">% Asistencia</TableCell>
                                    <TableCell align="center">Proyectos Entregados</TableCell>
                                    <TableCell align="center">Proyectos Pendientes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalleEstudiantes.map((est) => (
                                    <TableRow key={est.estudianteId}>
                                        <TableCell>{est.nombre}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={est.promedioGeneral.toFixed(2)}
                                                color={est.promedioGeneral >= 70 ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {est.porcentajeAsistencia.toFixed(1)}%
                                        </TableCell>
                                        <TableCell align="center">{est.proyectosEntregados}</TableCell>
                                        <TableCell align="center">{est.proyectosPendientes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}

// Componente para Reporte de Estudiante
const ReporteEstudiante = ({ datos }) => {
    const { estudiante, periodo, clases } = datos

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {estudiante.nombre}
                        </Typography>
                        <Typography color="text.secondary">
                            {estudiante.correo} - {periodo.nombre}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {clases.map((clase) => (
                <Grid item xs={12} md={6} key={clase.claseId}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {clase.codigo} - {clase.nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Docente: {clase.docente}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Promedio
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            {clase.promedio.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Asistencia
                                        </Typography>
                                        <Typography variant="h5" color="success.main">
                                            {clase.porcentajeAsistencia.toFixed(1)}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Proyectos Entregados
                                        </Typography>
                                        <Typography variant="h6">
                                            {clase.proyectosEntregados}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Proyectos Pendientes
                                        </Typography>
                                        <Typography variant="h6" color="warning.main">
                                            {clase.proyectosPendientes}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

// Componente para Reporte de Clase
const ReporteClase = ({ datos }) => {
    const { clase, periodo, estadisticasPorParcial, totalEstudiantes } = datos

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {clase.codigo} - {clase.nombre}
                        </Typography>
                        <Typography color="text.secondary">
                            Docente: {clase.docente?.nombre || 'Sin asignar'} - {periodo.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Total de estudiantes: {totalEstudiantes}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Evolución del Rendimiento
                    </Typography>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={estadisticasPorParcial}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="promedio" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Detalle por Parcial
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parcial</TableCell>
                                    <TableCell align="center">Promedio de Clase</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {estadisticasPorParcial.map((parcial) => (
                                    <TableRow key={parcial.parcialId}>
                                        <TableCell>{parcial.nombre}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={parcial.promedio.toFixed(2)}
                                                color={parcial.promedio >= 70 ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Analisis
