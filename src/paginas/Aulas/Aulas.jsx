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
import AulaDialog from '@componentes/aulas/AulaDialog'
import { aulasService } from '@servicios/catalogosService'

const Aulas = () => {
    const [aulas, setAulas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedAula, setSelectedAula] = useState(null)
    const [aulaToDelete, setAulaToDelete] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await aulasService.listar()
            setAulas(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error:', err)
            setError(err.response?.data?.error || err.message || 'Error al cargar las aulas')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const handleOpenDialog = (aula = null) => {
        setSelectedAula(aula)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setSelectedAula(null)
        setDialogOpen(false)
    }

    const handleSave = async (data) => {
        try {
            if (selectedAula) {
                await aulasService.editar(selectedAula.id, data)
                setSnackbar({ open: true, message: 'Aula actualizada exitosamente', severity: 'success' })
            } else {
                await aulasService.guardar(data)
                setSnackbar({ open: true, message: 'Aula creada exitosamente', severity: 'success' })
            }
            handleCloseDialog()
            cargarDatos()
        } catch (err) {
            console.error('Error al guardar:', err.response?.data)
            const errorMsg = err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar el aula'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (aula) => {
        setAulaToDelete(aula)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await aulasService.eliminar(aulaToDelete.id)
            setSnackbar({ open: true, message: 'Aula eliminada exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setAulaToDelete(null)
            cargarDatos()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.error || 'Error al eliminar el aula', 
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
                    Aulas
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
                        Nueva Aula
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Capacidad</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {aulas && aulas.length > 0 ? (
                            aulas.map((aula) => (
                                <TableRow key={aula.id}>
                                    <TableCell>{aula.nombre}</TableCell>
                                    <TableCell>{aula.capacidad} estudiantes</TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDialog(aula)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(aula)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No hay aulas registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <AulaDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                aula={selectedAula}
            />

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Aula"
                message={`¿Está seguro que desea eliminar el aula "${aulaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
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

export default Aulas
