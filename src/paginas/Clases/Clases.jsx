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
import ClaseDialog from '@componentes/clases/ClaseDialog'
import { clasesService } from '@servicios/catalogosService'

const Clases = () => {
    const [clases, setClases] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedClase, setSelectedClase] = useState(null)
    const [claseToDelete, setClaseToDelete] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await clasesService.listar()
            setClases(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error:', err)
            setError(err.response?.data?.error || err.message || 'Error al cargar las clases')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const handleOpenDialog = (clase = null) => {
        setSelectedClase(clase)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setSelectedClase(null)
        setDialogOpen(false)
    }

    const handleSave = async (data) => {
        try {
            if (selectedClase) {
                await clasesService.editar(selectedClase.id, data)
                setSnackbar({ open: true, message: 'Clase actualizada exitosamente', severity: 'success' })
            } else {
                await clasesService.guardar(data)
                setSnackbar({ open: true, message: 'Clase creada exitosamente', severity: 'success' })
            }
            handleCloseDialog()
            cargarDatos()
        } catch (err) {
            console.error('Error al guardar:', err.response?.data)
            const errorMsg = err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar la clase'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (clase) => {
        setClaseToDelete(clase)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await clasesService.eliminar(claseToDelete.id)
            setSnackbar({ open: true, message: 'Clase eliminada exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setClaseToDelete(null)
            cargarDatos()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.error || 'Error al eliminar la clase', 
                severity: 'error' 
            })
        }
    }

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} />

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Clases
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
                        Nueva Clase
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Créditos</TableCell>
                            <TableCell>Días de la semana</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clases && clases.length > 0 ? (
                            clases.map((clase) => (
                                <TableRow key={clase.id}>
                                    <TableCell>{clase.codigo}</TableCell>
                                    <TableCell>{clase.nombre}</TableCell>
                                    <TableCell>{clase.creditos || '-'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {Array.isArray(clase.diaSemana) && clase.diaSemana.map((dia) => (
                                                <Chip key={dia} label={dia} size="small" />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDialog(clase)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(clase)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay clases registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ClaseDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                clase={selectedClase}
            />

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Clase"
                message={`¿Está seguro que desea eliminar la clase "${claseToDelete?.codigo} - ${claseToDelete?.nombre}"? Esta acción no se puede deshacer.`}
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

export default Clases
