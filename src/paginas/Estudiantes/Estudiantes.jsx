import { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Chip,
    Tooltip,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { estudiantesService } from '../../servicios/estudiantesService'
import { aulasService } from '../../servicios/aulasService'
import EstudianteDialog from '../../componentes/estudiantes/EstudianteDialog'
import CargarExcelDialog from '../../componentes/estudiantes/CargarExcelDialog'

const Estudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([])
    const [aulas, setAulas] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [excelDialogOpen, setExcelDialogOpen] = useState(false)
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            setLoading(true)
            const [estudiantesData, aulasData] = await Promise.all([
                estudiantesService.listar(),
                aulasService.listar()
            ])
            setEstudiantes(estudiantesData)
            setAulas(aulasData)
        } catch (error) {
            console.error('Error al cargar datos:', error)
            mostrarSnackbar('Error al cargar datos', 'error')
        } finally {
            setLoading(false)
        }
    }

    const mostrarSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity })
    }

    const handleOpenDialog = (estudiante = null) => {
        setEstudianteSeleccionado(estudiante)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setEstudianteSeleccionado(null)
    }

    const handleSave = async (data) => {
        try {
            if (estudianteSeleccionado) {
                await estudiantesService.actualizar(estudianteSeleccionado.id, data)
                mostrarSnackbar('Estudiante actualizado exitosamente')
            } else {
                await estudiantesService.crear(data)
                mostrarSnackbar('Estudiante creado exitosamente')
            }
            cargarDatos()
        } catch (error) {
            console.error('Error al guardar estudiante:', error)
            mostrarSnackbar(error.response?.data?.error || 'Error al guardar estudiante', 'error')
            throw error
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
            try {
                await estudiantesService.eliminar(id)
                mostrarSnackbar('Estudiante eliminado exitosamente')
                cargarDatos()
            } catch (error) {
                console.error('Error al eliminar estudiante:', error)
                mostrarSnackbar('Error al eliminar estudiante', 'error')
            }
        }
    }

    const handleUploadExcel = async (file, creditos, aulaId) => {
        try {
            const result = await estudiantesService.cargarExcel(file, creditos, aulaId)
            
            const mensaje = `
                Proceso completado:
                - Estudiantes nuevos: ${result.resumen.estudiantesNuevos}
                - Inscripciones creadas: ${result.resumen.inscripcionesCreadas}
                - Errores: ${result.resumen.errores}
            `
            
            mostrarSnackbar(mensaje, result.resumen.errores > 0 ? 'warning' : 'success')
            cargarDatos()
        } catch (error) {
            console.error('Error al cargar Excel:', error)
            throw error
        }
    }

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'ACTIVO':
                return 'success'
            case 'INACTIVO':
                return 'warning'
            case 'RETIRADO':
                return 'error'
            default:
                return 'default'
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Estudiantes
                </Typography>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        color="secondary"
                        onClick={() => setExcelDialogOpen(true)}
                    >
                        Cargar Excel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Nuevo Estudiante
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Clases Inscritas</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {estudiantes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body2" color="text.secondary" py={3}>
                                        No hay estudiantes registrados
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            estudiantes.map((estudiante) => (
                                <TableRow key={estudiante.id} hover>
                                    <TableCell>{estudiante.id}</TableCell>
                                    <TableCell>{estudiante.nombre}</TableCell>
                                    <TableCell>{estudiante.correo}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={estudiante.estado}
                                            color={getEstadoColor(estudiante.estado)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {estudiante.inscripciones?.length || 0} clase(s)
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Editar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(estudiante)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(estudiante.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <EstudianteDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                estudiante={estudianteSeleccionado}
            />

            <CargarExcelDialog
                open={excelDialogOpen}
                onClose={() => setExcelDialogOpen(false)}
                onUpload={handleUploadExcel}
                aulas={aulas}
            />

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
                    sx={{ whiteSpace: 'pre-line' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Estudiantes
