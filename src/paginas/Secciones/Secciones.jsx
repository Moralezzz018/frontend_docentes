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
    Snackbar,
    Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import ConfirmDialog from '@componentes/common/ConfirmDialog'
import SeccionDialog from '@componentes/secciones/SeccionDialog'
import { seccionesService, clasesService, aulasService } from '@servicios/catalogosService'

const Secciones = () => {
    const [secciones, setSecciones] = useState([])
    const [clases, setClases] = useState([])
    const [aulas, setAulas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedSeccion, setSelectedSeccion] = useState(null)
    const [seccionToDelete, setSeccionToDelete] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const [seccionesData, clasesData, aulasData] = await Promise.allSettled([
                seccionesService.listar(),
                clasesService.listar(),
                aulasService.listar(),
            ])
            
            if (seccionesData.status === 'fulfilled' && Array.isArray(seccionesData.value)) {
                setSecciones(seccionesData.value)
            } else {
                console.error('Error cargando secciones:', seccionesData.reason)
                setSecciones([])
            }
            
            if (clasesData.status === 'fulfilled' && Array.isArray(clasesData.value)) {
                setClases(clasesData.value)
            } else {
                console.error('Error cargando clases:', clasesData.reason)
                setClases([])
            }
            
            if (aulasData.status === 'fulfilled' && Array.isArray(aulasData.value)) {
                setAulas(aulasData.value)
            } else {
                console.error('Error cargando aulas:', aulasData.reason)
                setAulas([])
            }
        } catch (err) {
            console.error('Error:', err)
            setError(err.response?.data?.error || err.message || 'Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const handleOpenDialog = (seccion = null) => {
        setSelectedSeccion(seccion)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setSelectedSeccion(null)
        setDialogOpen(false)
    }

    const handleSave = async (data) => {
        try {
            if (selectedSeccion) {
                await seccionesService.editar(selectedSeccion.id, data)
                setSnackbar({ open: true, message: 'Sección actualizada exitosamente', severity: 'success' })
            } else {
                await seccionesService.guardar(data)
                setSnackbar({ open: true, message: 'Sección creada exitosamente', severity: 'success' })
            }
            handleCloseDialog()
            cargarDatos()
        } catch (err) {
            console.error('Error al guardar:', err.response?.data)
            const errorMsg = err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar la sección'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (seccion) => {
        setSeccionToDelete(seccion)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await seccionesService.eliminar(seccionToDelete.id)
            setSnackbar({ open: true, message: 'Sección eliminada exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setSeccionToDelete(null)
            cargarDatos()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.error || 'Error al eliminar la sección', 
                severity: 'error' 
            })
        }
    }

    const getClaseNombre = (claseId) => {
        const clase = clases.find(c => c.id === claseId)
        return clase ? `${clase.codigo} - ${clase.nombre}` : '-'
    }

    const getAulaNombre = (aulaId) => {
        if (!aulaId) return 'Sin asignar'
        const aula = aulas.find(a => a.id === aulaId)
        return aula ? aula.nombre : '-'
    }

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} />

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Secciones
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
                        Nueva Sección
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Clase</TableCell>
                            <TableCell>Aula</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {secciones && secciones.length > 0 ? (
                            secciones.map((seccion) => (
                                <TableRow key={seccion.id}>
                                    <TableCell>{seccion.nombre}</TableCell>
                                    <TableCell>{getClaseNombre(seccion.claseId)}</TableCell>
                                    <TableCell>{getAulaNombre(seccion.aulaId)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDialog(seccion)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(seccion)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No hay secciones registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <SeccionDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                seccion={selectedSeccion}
                clases={clases}
                aulas={aulas}
            />

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Sección"
                message={`¿Está seguro que desea eliminar la sección "${seccionToDelete?.nombre}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
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
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Secciones
