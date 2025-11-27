import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Grid,
    TextField,
    MenuItem,
    Snackbar,
    Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AssignmentIcon from '@mui/icons-material/Assignment'
import RefreshIcon from '@mui/icons-material/Refresh'
import { formatDateTime } from '@utilidades/dateUtils'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import ConfirmDialog from '@componentes/common/ConfirmDialog'
import EvaluacionDialog from '@componentes/evaluaciones/EvaluacionDialog'
import { evaluacionesService } from '@servicios/evaluacionesService'
import { periodosService, parcialesService, clasesService, seccionesService } from '@servicios/catalogosService'

const Evaluaciones = () => {
    const [evaluaciones, setEvaluaciones] = useState([])
    const [periodos, setPeriodos] = useState([])
    const [parciales, setParciales] = useState([])
    const [clases, setClases] = useState([])
    const [secciones, setSecciones] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedEvaluacion, setSelectedEvaluacion] = useState(null)
    const [evaluacionToDelete, setEvaluacionToDelete] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    
    // Filtros
    const [filtros, setFiltros] = useState({
        periodoId: '',
        parcialId: '',
        claseId: '',
    })

    const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Cargar datos en paralelo con manejo de errores individual
            const [evaluacionesData, periodosData, parcialesData, clasesData, seccionesData] = await Promise.allSettled([
                evaluacionesService.listar(filtros),
                periodosService.listar(),
                parcialesService.listar(),
                clasesService.listar(),
                seccionesService.listar(),
            ])
            
            // Procesar evaluaciones
            if (evaluacionesData.status === 'fulfilled' && Array.isArray(evaluacionesData.value)) {
                setEvaluaciones(evaluacionesData.value)
            } else {
                console.error('Error cargando evaluaciones:', evaluacionesData.reason)
                setEvaluaciones([])
            }
            
            // Procesar periodos
            if (periodosData.status === 'fulfilled' && Array.isArray(periodosData.value)) {
                setPeriodos(periodosData.value)
            } else {
                console.error('Error cargando periodos:', periodosData.reason)
                setPeriodos([])
            }
            
            // Procesar parciales
            if (parcialesData.status === 'fulfilled' && Array.isArray(parcialesData.value)) {
                setParciales(parcialesData.value)
            } else {
                console.error('Error cargando parciales:', parcialesData.reason)
                setParciales([])
            }
            
            // Procesar clases
            if (clasesData.status === 'fulfilled' && Array.isArray(clasesData.value)) {
                setClases(clasesData.value)
            } else {
                console.error('Error cargando clases:', clasesData.reason)
                setClases([])
            }
            
            // Procesar secciones
            if (seccionesData.status === 'fulfilled' && Array.isArray(seccionesData.value)) {
                setSecciones(seccionesData.value)
            } else {
                console.error('Error cargando secciones:', seccionesData.reason)
                setSecciones([])
            }
            
        } catch (err) {
            console.error('Error general:', err)
            setError(err.response?.data?.error || err.message || 'Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarDatos()
    }, []) // Solo cargar al montar el componente

    const handleFiltroChange = (e) => {
        const { name, value } = e.target
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const aplicarFiltros = () => {
        cargarDatos()
    }

    const limpiarFiltros = () => {
        setFiltros({
            periodoId: '',
            parcialId: '',
            claseId: '',
        })
        setTimeout(() => cargarDatos(), 100)
    }

    const handleOpenDialog = (evaluacion = null) => {
        setSelectedEvaluacion(evaluacion)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setSelectedEvaluacion(null)
        setDialogOpen(false)
    }

    const handleSave = async (data) => {
        try {
            if (selectedEvaluacion) {
                await evaluacionesService.editar(selectedEvaluacion.id, data)
                setSnackbar({ open: true, message: 'Evaluación actualizada exitosamente', severity: 'success' })
            } else {
                await evaluacionesService.guardar(data)
                setSnackbar({ open: true, message: 'Evaluación creada exitosamente', severity: 'success' })
            }
            handleCloseDialog()
            cargarDatos()
        } catch (err) {
            console.error('Error al guardar:', err.response?.data)
            const errorMsg = err.response?.data?.msj || err.response?.data?.error || 'Error al guardar la evaluación'
            const errorDetails = err.response?.data?.data ? JSON.stringify(err.response.data.data) : ''
            setSnackbar({ 
                open: true, 
                message: `${errorMsg}${errorDetails ? ': ' + errorDetails : ''}`, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (evaluacion) => {
        setEvaluacionToDelete(evaluacion)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await evaluacionesService.eliminar(evaluacionToDelete.id)
            setSnackbar({ open: true, message: 'Evaluación eliminada exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setEvaluacionToDelete(null)
            cargarDatos()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.error || 'Error al eliminar la evaluación', 
                severity: 'error' 
            })
        }
    }

    const getTipoChip = (tipo) => {
        const colors = {
            NORMAL: 'primary',
            REPOSICION: 'warning',
            EXAMEN: 'error',
        }
        return <Chip label={tipo} color={colors[tipo] || 'default'} size="small" />
    }

    const getEstadoChip = (estado) => {
        return (
            <Chip
                label={estado}
                color={estado === 'ACTIVO' ? 'success' : 'default'}
                size="small"
            />
        )
    }

    if (loading && evaluaciones.length === 0) return <LoadingSpinner />
    if (error && evaluaciones.length === 0) {
        return (
            <Box>
                <Typography variant="h4" gutterBottom>Evaluaciones</Typography>
                <ErrorMessage error={error} />
                <Button 
                    variant="contained" 
                    onClick={cargarDatos}
                    sx={{ mt: 2 }}
                >
                    Reintentar
                </Button>
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Evaluaciones</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={cargarDatos}
                    >
                        Actualizar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Nueva Evaluación
                    </Button>
                </Box>
            </Box>

            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Filtros
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            select
                            label="Periodo"
                            name="periodoId"
                            value={filtros.periodoId}
                            onChange={handleFiltroChange}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {Array.isArray(periodos) && periodos.map((periodo) => (
                                <MenuItem key={periodo.id} value={periodo.id}>
                                    {periodo.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            select
                            label="Parcial"
                            name="parcialId"
                            value={filtros.parcialId}
                            onChange={handleFiltroChange}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {Array.isArray(parciales) && parciales.map((parcial) => (
                                <MenuItem key={parcial.id} value={parcial.id}>
                                    {parcial.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={aplicarFiltros}
                                fullWidth
                            >
                                Aplicar
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={limpiarFiltros}
                                fullWidth
                            >
                                Limpiar
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Fecha Inicio</TableCell>
                            <TableCell>Fecha Cierre</TableCell>
                            <TableCell>Nota Máxima</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluaciones && evaluaciones.length > 0 ? (
                            evaluaciones.map((evaluacion) => (
                                <TableRow key={evaluacion.id}>
                                    <TableCell>{evaluacion.titulo}</TableCell>
                                    <TableCell>{getTipoChip(evaluacion.tipo)}</TableCell>
                                    <TableCell>{formatDateTime(evaluacion.fechaInicio)}</TableCell>
                                    <TableCell>{formatDateTime(evaluacion.fechaCierre)}</TableCell>
                                    <TableCell>{evaluacion.notaMaxima}</TableCell>
                                    <TableCell>{getEstadoChip(evaluacion.estado)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDialog(evaluacion)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="info">
                                            <AssignmentIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(evaluacion)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay evaluaciones registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog para crear/editar */}
            <EvaluacionDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                evaluacion={selectedEvaluacion}
                periodos={periodos}
                parciales={parciales}
                clases={clases}
                secciones={secciones}
            />

            {/* Dialog de confirmación para eliminar */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Evaluación"
                message={`¿Está seguro que desea eliminar la evaluación "${evaluacionToDelete?.titulo}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
            />

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Evaluaciones
