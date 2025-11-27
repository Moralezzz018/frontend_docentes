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
import RefreshIcon from '@mui/icons-material/Refresh'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { formatDateTime } from '@utilidades/dateUtils'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import ConfirmDialog from '@componentes/common/ConfirmDialog'
import AsistenciaDialog from '@componentes/asistencias/AsistenciaDialog'
import { asistenciasService } from '@servicios/asistenciasService'
import { periodosService, parcialesService, clasesService } from '@servicios/catalogosService'

// Importar servicio de estudiantes si existe
const estudiantesService = {
    listar: async () => {
        const apiClient = (await import('@servicios/apiClient')).default
        const { API_ENDPOINTS } = await import('@configuracion/api')
        const response = await apiClient.get(API_ENDPOINTS.ESTUDIANTES.LISTAR)
        return Array.isArray(response.data) ? response.data : []
    }
}

const Asistencias = () => {
    const [asistencias, setAsistencias] = useState([])
    const [estudiantes, setEstudiantes] = useState([])
    const [clases, setClases] = useState([])
    const [periodos, setPeriodos] = useState([])
    const [parciales, setParciales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedAsistencia, setSelectedAsistencia] = useState(null)
    const [asistenciaToDelete, setAsistenciaToDelete] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    
    // Filtros
    const [filtros, setFiltros] = useState({
        estudianteId: '',
        claseId: '',
        periodoId: '',
        parcialId: '',
        estado: '',
    })

    const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const [asistenciasData, estudiantesData, clasesData, periodosData, parcialesData] = await Promise.allSettled([
                asistenciasService.listar(),
                estudiantesService.listar(),
                clasesService.listar(),
                periodosService.listar(),
                parcialesService.listar(),
            ])
            
            if (asistenciasData.status === 'fulfilled' && Array.isArray(asistenciasData.value)) {
                setAsistencias(asistenciasData.value)
            } else {
                console.error('Error cargando asistencias:', asistenciasData.reason)
                setAsistencias([])
            }
            
            if (estudiantesData.status === 'fulfilled' && Array.isArray(estudiantesData.value)) {
                setEstudiantes(estudiantesData.value)
            } else {
                console.error('Error cargando estudiantes:', estudiantesData.reason)
                setEstudiantes([])
            }
            
            if (clasesData.status === 'fulfilled' && Array.isArray(clasesData.value)) {
                setClases(clasesData.value)
            } else {
                console.error('Error cargando clases:', clasesData.reason)
                setClases([])
            }
            
            if (periodosData.status === 'fulfilled' && Array.isArray(periodosData.value)) {
                setPeriodos(periodosData.value)
            } else {
                console.error('Error cargando periodos:', periodosData.reason)
                setPeriodos([])
            }
            
            if (parcialesData.status === 'fulfilled' && Array.isArray(parcialesData.value)) {
                setParciales(parcialesData.value)
            } else {
                console.error('Error cargando parciales:', parcialesData.reason)
                setParciales([])
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
    }, [])

    const handleOpenDialog = (asistencia = null) => {
        setSelectedAsistencia(asistencia)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setSelectedAsistencia(null)
        setDialogOpen(false)
    }

    const handleSave = async (data) => {
        try {
            if (selectedAsistencia) {
                await asistenciasService.editar(selectedAsistencia.id, data)
                setSnackbar({ open: true, message: 'Asistencia actualizada exitosamente', severity: 'success' })
            } else {
                await asistenciasService.guardar(data)
                setSnackbar({ open: true, message: 'Asistencia registrada exitosamente', severity: 'success' })
            }
            handleCloseDialog()
            cargarDatos()
        } catch (err) {
            console.error('Error al guardar:', err.response?.data)
            const errorMsg = err.response?.data?.mensaje || err.response?.data?.error || 'Error al guardar la asistencia'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (asistencia) => {
        setAsistenciaToDelete(asistencia)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await asistenciasService.eliminar(asistenciaToDelete.id)
            setSnackbar({ open: true, message: 'Asistencia eliminada exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setAsistenciaToDelete(null)
            cargarDatos()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.mensaje || 'Error al eliminar la asistencia', 
                severity: 'error' 
            })
        }
    }

    const getEstadoChip = (estado) => {
        const colors = {
            PRESENTE: 'success',
            AUSENTE: 'error',
            TARDANZA: 'warning',
        }
        return <Chip label={estado} color={colors[estado] || 'default'} size="small" />
    }

    const aplicarFiltros = () => {
        // Los filtros se aplicarán en el backend
        cargarDatos()
    }

    const limpiarFiltros = () => {
        setFiltros({
            estudianteId: '',
            claseId: '',
            periodoId: '',
            parcialId: '',
            estado: '',
        })
        cargarDatos()
    }

    // Filtrar asistencias en el frontend según los filtros seleccionados
    const asistenciasFiltradas = asistencias.filter(asistencia => {
        if (filtros.estudianteId && asistencia.estudianteId !== parseInt(filtros.estudianteId)) return false
        if (filtros.claseId && asistencia.claseId !== parseInt(filtros.claseId)) return false
        if (filtros.periodoId && asistencia.periodoId !== parseInt(filtros.periodoId)) return false
        if (filtros.parcialId && asistencia.parcialId !== parseInt(filtros.parcialId)) return false
        if (filtros.estado && asistencia.estado !== filtros.estado) return false
        return true
    })

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} />

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Asistencias
                </Typography>
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
                        Nueva Asistencia
                    </Button>
                </Box>
            </Box>

            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Filtros
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Estudiante"
                            value={filtros.estudianteId}
                            onChange={(e) => setFiltros({ ...filtros, estudianteId: e.target.value })}
                            size="small"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {Array.isArray(estudiantes) && estudiantes.map((estudiante) => (
                                <MenuItem key={estudiante.id} value={estudiante.id}>
                                    {estudiante.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Clase"
                            value={filtros.claseId}
                            onChange={(e) => setFiltros({ ...filtros, claseId: e.target.value })}
                            size="small"
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {Array.isArray(clases) && clases.map((clase) => (
                                <MenuItem key={clase.id} value={clase.id}>
                                    {clase.codigo} - {clase.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            select
                            label="Periodo"
                            value={filtros.periodoId}
                            onChange={(e) => setFiltros({ ...filtros, periodoId: e.target.value })}
                            size="small"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {Array.isArray(periodos) && periodos.map((periodo) => (
                                <MenuItem key={periodo.id} value={periodo.id}>
                                    {periodo.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            select
                            label="Estado"
                            value={filtros.estado}
                            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                            size="small"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="PRESENTE">PRESENTE</MenuItem>
                            <MenuItem value="AUSENTE">AUSENTE</MenuItem>
                            <MenuItem value="TARDANZA">TARDANZA</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
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
                            <TableCell>Estudiante</TableCell>
                            <TableCell>Clase</TableCell>
                            <TableCell>Periodo</TableCell>
                            <TableCell>Parcial</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {asistenciasFiltradas && asistenciasFiltradas.length > 0 ? (
                            asistenciasFiltradas.map((asistencia) => (
                                <TableRow key={asistencia.id}>
                                    <TableCell>
                                        {asistencia.estudiante?.nombre || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {asistencia.clase?.nombre || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {asistencia.periodo?.nombre || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {asistencia.parcial?.nombre || '-'}
                                    </TableCell>
                                    <TableCell>{formatDateTime(asistencia.fecha)}</TableCell>
                                    <TableCell>{getEstadoChip(asistencia.estado)}</TableCell>
                                    <TableCell>{asistencia.descripcion || '-'}</TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDialog(asistencia)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(asistencia)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    No hay asistencias registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog para crear/editar */}
            <AsistenciaDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                asistencia={selectedAsistencia}
                estudiantes={estudiantes}
                clases={clases}
                periodos={periodos}
                parciales={parciales}
            />

            {/* Dialog de confirmación para eliminar */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Asistencia"
                message={`¿Está seguro que desea eliminar esta asistencia? Esta acción no se puede deshacer.`}
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

export default Asistencias
