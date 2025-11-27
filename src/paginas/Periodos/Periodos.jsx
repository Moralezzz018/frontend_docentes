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
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import ConfirmDialog from '@componentes/common/ConfirmDialog'
import PeriodoDialog from '@componentes/periodos/PeriodoDialog'
import { periodosService } from '@servicios/catalogosService'

const Periodos = () => {
    const [periodos, setPeriodos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedPeriodo, setSelectedPeriodo] = useState(null)
    const [periodoToDelete, setPeriodoToDelete] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await periodosService.listar()
            setPeriodos(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error:', err)
            setError(err.response?.data?.error || err.message || 'Error al cargar los periodos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const handleOpenDialog = (periodo = null) => {
        setSelectedPeriodo(periodo)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setSelectedPeriodo(null)
        setDialogOpen(false)
    }

    const handleSave = async (data) => {
        try {
            if (selectedPeriodo) {
                await periodosService.editar(selectedPeriodo.id, data)
                setSnackbar({ open: true, message: 'Periodo actualizado exitosamente', severity: 'success' })
            } else {
                await periodosService.guardar(data)
                setSnackbar({ open: true, message: 'Periodo creado exitosamente', severity: 'success' })
            }
            handleCloseDialog()
            cargarDatos()
        } catch (err) {
            console.error('Error al guardar:', err.response?.data)
            const errorMsg = err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar el periodo'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (periodo) => {
        setPeriodoToDelete(periodo)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await periodosService.eliminar(periodoToDelete.id)
            setSnackbar({ open: true, message: 'Periodo eliminado exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setPeriodoToDelete(null)
            cargarDatos()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.error || 'Error al eliminar el periodo', 
                severity: 'error' 
            })
        }
    }

    const formatDate = (date) => {
        try {
            return format(new Date(date), 'dd/MM/yyyy', { locale: es })
        } catch {
            return '-'
        }
    }

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} />

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Periodos
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
                        Nuevo Periodo
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Fecha de Inicio</TableCell>
                            <TableCell>Fecha de Fin</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {periodos && periodos.length > 0 ? (
                            periodos.map((periodo) => (
                                <TableRow key={periodo.id}>
                                    <TableCell>{periodo.nombre}</TableCell>
                                    <TableCell>{formatDate(periodo.fechaInicio)}</TableCell>
                                    <TableCell>{formatDate(periodo.fechaFin)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDialog(periodo)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(periodo)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No hay periodos registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <PeriodoDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                periodo={selectedPeriodo}
            />

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Periodo"
                message={`¿Está seguro que desea eliminar el periodo "${periodoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
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

export default Periodos
