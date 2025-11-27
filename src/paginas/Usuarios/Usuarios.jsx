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
    Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import ConfirmDialog from '@componentes/common/ConfirmDialog'
import UsuarioDialog from '@componentes/usuarios/UsuarioDialog'
import { usuariosService } from '@servicios/usuariosService'

const ESTADO_CONFIG = {
    AC: { label: 'Activo', color: 'success' },
    IN: { label: 'Inactivo', color: 'default' },
    BL: { label: 'Bloqueado', color: 'error' },
}

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedUsuario, setSelectedUsuario] = useState(null)
    const [usuarioToDelete, setUsuarioToDelete] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const cargarDatos = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await usuariosService.listar()
            setUsuarios(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error:', err)
            setError(err.response?.data?.error || err.message || 'Error al cargar los usuarios')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const handleOpenDialog = (usuario = null) => {
        setSelectedUsuario(usuario)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setSelectedUsuario(null)
        setDialogOpen(false)
    }

    const handleSave = async (data) => {
        try {
            if (selectedUsuario) {
                await usuariosService.editar(selectedUsuario.id, data)
                setSnackbar({ open: true, message: 'Usuario actualizado exitosamente', severity: 'success' })
            } else {
                await usuariosService.guardar(data)
                setSnackbar({ open: true, message: 'Usuario creado exitosamente', severity: 'success' })
            }
            handleCloseDialog()
            cargarDatos()
        } catch (err) {
            console.error('Error al guardar:', err.response?.data)
            const errorMsg = err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar el usuario'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (usuario) => {
        setUsuarioToDelete(usuario)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await usuariosService.eliminar(usuarioToDelete.id)
            setSnackbar({ open: true, message: 'Usuario eliminado exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setUsuarioToDelete(null)
            cargarDatos()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.error || 'Error al eliminar el usuario', 
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
                    Usuarios
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
                        Nuevo Usuario
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Login</TableCell>
                            <TableCell>Correo Electrónico</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios && usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <TableRow key={usuario.id}>
                                    <TableCell>{usuario.login}</TableCell>
                                    <TableCell>{usuario.correo}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={ESTADO_CONFIG[usuario.estado]?.label || usuario.estado}
                                            color={ESTADO_CONFIG[usuario.estado]?.color || 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenDialog(usuario)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(usuario)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No hay usuarios registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <UsuarioDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSave}
                usuario={selectedUsuario}
            />

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Usuario"
                message={`¿Está seguro que desea eliminar el usuario "${usuarioToDelete?.login}"? Esta acción no se puede deshacer.`}
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

export default Usuarios
