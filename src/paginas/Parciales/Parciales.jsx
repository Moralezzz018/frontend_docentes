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
import ParcialDialog from '@componentes/parciales/ParcialDialog'
import { parcialesService, periodosService } from '@servicios/catalogosService'

const Parciales = () => {
    const [parciales, setParciales] = useState([])
    const [periodos, setPeriodos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedParcial, setSelectedParcial] = useState(null)
    const [parcialToDelete, setParcialToDelete] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const [parcialesData, periodosData] = await Promise.allSettled([
                parcialesService.listar(),
                periodosService.listar(),
            ])
            
            if (parcialesData.status === 'fulfilled' && Array.isArray(parcialesData.value)) {
                setParciales(parcialesData.value)
            } else {
                console.error('Error cargando parciales:', parcialesData.reason)
                setParciales([])
            }
            
            if (periodosData.status === 'fulfilled' && Array.isArray(periodosData.value)) {
                setPeriodos(periodosData.value)
            } else {
                console.error('Error cargando periodos:', periodosData.reason)
                setPeriodos([])
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

    const handleOpenDialog = (parcial = null) => {
        setSelectedParcial(parcial)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setSelectedParcial(null)
        setDialogOpen(false)
    }

    const handleSave = async (data) => {
        try {
            if (selectedParcial) {
                await parcialesService.editar(selectedParcial.id, data)
                setSnackbar({ open: true, message: 'Parcial actualizado exitosamente', severity: 'success' })
            } else {
                await parcialesService.guardar(data)
                setSnackbar({ open: true, message: 'Parcial creado exitosamente', severity: 'success' })
            }
            handleCloseDialog()
            cargarDatos()
        } catch (err) {
            console.error('Error al guardar:', err.response?.data)
            const errorMsg = err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar el parcial'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (parcial) => {
        setParcialToDelete(parcial)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await parcialesService.eliminar(parcialToDelete.id)
            setSnackbar({ open: true, message: 'Parcial eliminado exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setParcialToDelete(null)
            cargarDatos()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.error || 'Error al eliminar el parcial', 
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

    const getPeriodoNombre = (periodoId) => {
        const periodo = periodos.find(p => p.id === periodoId)
        return periodo ? periodo.nombre : '-'
    }

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} />

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Parciales
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
                        Nuevo Parcial
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Periodo</TableCell>
                            <TableCell>Fecha de Inicio</TableCell>
                            <TableCell>Fecha de Fin</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parciales && parciales.length > 0 ? (
                            parciales.map((parcial) => (
                                <TableRow key={parcial.id}>
                                    <TableCell>{parcial.nombre}</TableCell>
                                    <TableCell>{getPeriodoNombre(parcial.periodoId)}</TableCell>
                                    <TableCell>{formatDate(parcial.fechaInicio)}</TableCell>
                                    <TableCell>{formatDate(parcial.fechaFin)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDialog(parcial)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(parcial)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay parciales registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ParcialDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                parcial={selectedParcial}
                periodos={periodos}
            />

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Parcial"
                message={`¿Está seguro que desea eliminar el parcial "${parcialToDelete?.nombre}"? Esta acción no se puede deshacer.`}
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

export default Parciales
