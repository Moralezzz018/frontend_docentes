import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Snackbar,
    Alert,
    TextField,
    InputAdornment,
    Divider,
} from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import ConfirmDialog from '@componentes/common/ConfirmDialog'
import { usuariosService } from '@servicios/usuariosService'
import { useAuthStore } from '@almacen/authStore'
import API_BASE_URL from '@configuracion/api'

const Perfil = () => {
    const { user, updateUser } = useAuthStore()
    const [imagenes, setImagenes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [imagenToDelete, setImagenToDelete] = useState(null)
    const [editingImage, setEditingImage] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [imageKey, setImageKey] = useState(Date.now()) // Para forzar recarga de imágenes
    const [profileData, setProfileData] = useState({
        login: user?.login || '',
        correo: user?.correo || '',
    })
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [editProfileData, setEditProfileData] = useState({
        login: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [profileErrors, setProfileErrors] = useState({})

    const cargarImagenes = async () => {
        if (!user?.id) return
        
        try {
            setLoading(true)
            setError(null)
            const data = await usuariosService.listarImagenes(user.id)
            console.log('Datos de imágenes recibidos:', data) // Debug
            console.log('API_BASE_URL:', API_BASE_URL) // Debug
            setImagenes(Array.isArray(data) ? data : [])
            setImageKey(Date.now()) // Actualizar key para forzar recarga
            
            // Actualizar la imagen del usuario en el store si hay una imagen principal
            const imagenPrincipal = data.find(img => img.estado === 'AC')
            if (imagenPrincipal) {
                const rutaImagen = imagenPrincipal.ruta || imagenPrincipal.imagen
                const urlCompleta = `${API_BASE_URL}${rutaImagen}`
                console.log('URL de imagen principal:', urlCompleta)
                updateUser({
                    ...user,
                    imagen: urlCompleta
                })
            } else {
                // Si no hay imagen principal, remover imagen del usuario
                updateUser({
                    ...user,
                    imagen: null
                })
            }
        } catch (err) {
            console.error('Error:', err)
            setError(err.response?.data?.error || err.message || 'Error al cargar las imágenes')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarImagenes()
        if (user) {
            setProfileData({
                login: user.login || '',
                correo: user.correo || '',
            })
        }
    }, [user?.id])

    const handleEditProfileClick = () => {
        setEditProfileData({
            login: profileData.login,
            correo: profileData.correo,
            contrasena: '',
            confirmarContrasena: '',
        })
        setProfileErrors({})
        setIsEditingProfile(true)
    }

    const handleCancelEdit = () => {
        setIsEditingProfile(false)
        setEditProfileData({
            login: '',
            correo: '',
            contrasena: '',
            confirmarContrasena: '',
        })
        setProfileErrors({})
        setShowPassword(false)
        setShowConfirmPassword(false)
    }

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setEditProfileData({
            ...editProfileData,
            [name]: value,
        })
        // Limpiar error del campo al editar
        if (profileErrors[name]) {
            setProfileErrors({
                ...profileErrors,
                [name]: '',
            })
        }
    }

    const validateProfileForm = () => {
        const errors = {}

        if (!editProfileData.login.trim()) {
            errors.login = 'El login es requerido'
        } else if (editProfileData.login.length < 3) {
            errors.login = 'El login debe tener al menos 3 caracteres'
        }

        if (!editProfileData.correo.trim()) {
            errors.correo = 'El correo es requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editProfileData.correo)) {
            errors.correo = 'El correo no es válido'
        }

        // Solo validar contraseña si se está cambiando
        if (editProfileData.contrasena) {
            if (editProfileData.contrasena.length < 6) {
                errors.contrasena = 'La contraseña debe tener al menos 6 caracteres'
            }
            if (editProfileData.contrasena !== editProfileData.confirmarContrasena) {
                errors.confirmarContrasena = 'Las contraseñas no coinciden'
            }
        }

        setProfileErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSaveProfile = async () => {
        if (!validateProfileForm()) {
            return
        }

        try {
            const dataToUpdate = {
                login: editProfileData.login,
                correo: editProfileData.correo,
            }

            // Solo incluir contraseña si se está cambiando
            if (editProfileData.contrasena) {
                dataToUpdate.contrasena = editProfileData.contrasena
            }

            await usuariosService.editar(user.id, dataToUpdate)
            
            // Actualizar el store y el estado local
            const updatedUser = {
                ...user,
                login: editProfileData.login,
                correo: editProfileData.correo,
            }
            updateUser(updatedUser)
            setProfileData({
                login: editProfileData.login,
                correo: editProfileData.correo,
            })

            setSnackbar({ 
                open: true, 
                message: 'Perfil actualizado exitosamente', 
                severity: 'success' 
            })
            setIsEditingProfile(false)
            handleCancelEdit()
        } catch (err) {
            console.error('Error al actualizar perfil:', err)
            const errorMsg = err.response?.data?.mensaje 
                || err.response?.data?.error
                || err.response?.data?.errores?.[0]?.msg
                || 'Error al actualizar el perfil'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleFileSelect = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!validTypes.includes(file.type)) {
            setSnackbar({ 
                open: true, 
                message: 'Solo se permiten archivos JPG, PNG o GIF', 
                severity: 'error' 
            })
            return
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({ 
                open: true, 
                message: 'El archivo no debe exceder 5MB', 
                severity: 'error' 
            })
            return
        }

        try {
            console.log('Subiendo imagen para usuario:', user.id)
            console.log('Archivo:', file.name, file.type, file.size)
            await usuariosService.guardarImagen(user.id, file)
            setSnackbar({ open: true, message: 'Imagen subida exitosamente', severity: 'success' })
            cargarImagenes()
            // Resetear el input file
            event.target.value = null
        } catch (err) {
            console.error('Error al subir imagen:', err)
            console.error('Detalles del error:', err.response?.data)
            const errorMsg = err.response?.data?.error 
                || err.response?.data?.mensaje 
                || err.response?.data?.errores?.[0]?.msg
                || 'Error al subir la imagen'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleEditImage = async (event, imagenId) => {
        const file = event.target.files[0]
        if (!file) return

        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!validTypes.includes(file.type)) {
            setSnackbar({ 
                open: true, 
                message: 'Solo se permiten archivos JPG, PNG o GIF', 
                severity: 'error' 
            })
            return
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({ 
                open: true, 
                message: 'El archivo no debe exceder 5MB', 
                severity: 'error' 
            })
            return
        }

        try {
            console.log('Editando imagen:', imagenId)
            console.log('Archivo:', file.name, file.type, file.size)
            await usuariosService.editarImagen(imagenId, file)
            setSnackbar({ open: true, message: 'Imagen actualizada exitosamente', severity: 'success' })
            setEditingImage(null)
            cargarImagenes()
            // Resetear el input file
            event.target.value = null
        } catch (err) {
            console.error('Error al editar imagen:', err)
            console.error('Detalles del error:', err.response?.data)
            const errorMsg = err.response?.data?.error 
                || err.response?.data?.mensaje 
                || err.response?.data?.errores?.[0]?.msg
                || 'Error al actualizar la imagen'
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error' 
            })
        }
    }

    const handleDeleteClick = (imagen) => {
        setImagenToDelete(imagen)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await usuariosService.eliminarImagen(imagenToDelete.id)
            setSnackbar({ open: true, message: 'Imagen eliminada exitosamente', severity: 'success' })
            setConfirmOpen(false)
            setImagenToDelete(null)
            cargarImagenes()
        } catch (err) {
            setSnackbar({ 
                open: true, 
                message: err.response?.data?.error || 'Error al eliminar la imagen', 
                severity: 'error' 
            })
        }
    }

    const getImageUrl = (ruta) => {
        if (!ruta) {
            console.warn('getImageUrl: ruta vacía')
            return null
        }
        // Si ya es una URL completa, retornarla
        if (ruta.startsWith('http')) {
            console.log('URL completa detectada:', ruta)
            return `${ruta}?t=${imageKey}`
        }
        // Si es una ruta relativa, construir la URL completa
        const rutaLimpia = ruta.startsWith('/') ? ruta : `/${ruta}`
        const urlFinal = `${API_BASE_URL}${rutaLimpia}?t=${imageKey}`
        console.log('URL construida:', urlFinal, 'desde ruta:', ruta)
        return urlFinal
    }

    const imagenPrincipal = imagenes.find(img => img.estado === 'AC')
    
    // Log para debug
    if (imagenPrincipal) {
        console.log('Imagen principal encontrada:', imagenPrincipal)
        console.log('URL que se usará:', getImageUrl(imagenPrincipal.ruta || imagenPrincipal.imagen))
    }

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} />

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Mi Perfil
            </Typography>

            <Grid container spacing={3}>
                {/* Información del perfil */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar
                            src={imagenPrincipal ? getImageUrl(imagenPrincipal.ruta || imagenPrincipal.imagen) : undefined}
                            sx={{ 
                                width: 200, 
                                height: 200, 
                                mx: 'auto', 
                                mb: 2,
                                fontSize: '5rem'
                            }}
                            onError={(e) => {
                                console.error('Error al cargar avatar principal')
                                console.error('Imagen principal objeto:', imagenPrincipal)
                                console.error('URL intentada:', e.target?.src)
                                console.error('API_BASE_URL:', API_BASE_URL)
                            }}
                        >
                            {!imagenPrincipal && user?.login?.charAt(0).toUpperCase()}
                        </Avatar>
                        
                        {!isEditingProfile ? (
                            <>
                                <Typography variant="h5" gutterBottom>
                                    {profileData.login}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {profileData.correo}
                                </Typography>
                                
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                    Rol: {user?.rol?.nombre || 'Sin rol'}
                                </Typography>

                                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<PhotoCamera />}
                                    >
                                        Subir Foto
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                            onChange={handleFileSelect}
                                        />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={handleEditProfileClick}
                                    >
                                        Editar Perfil
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Editar Información
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                <TextField
                                    fullWidth
                                    label="Usuario"
                                    name="login"
                                    value={editProfileData.login}
                                    onChange={handleProfileChange}
                                    margin="dense"
                                    size="small"
                                    required
                                    error={!!profileErrors.login}
                                    helperText={profileErrors.login || 'Mínimo 3 caracteres'}
                                    inputProps={{ maxLength: 50 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Correo"
                                    name="correo"
                                    type="email"
                                    value={editProfileData.correo}
                                    onChange={handleProfileChange}
                                    margin="dense"
                                    size="small"
                                    required
                                    error={!!profileErrors.correo}
                                    helperText={profileErrors.correo}
                                    inputProps={{ maxLength: 150 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Divider sx={{ my: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Cambiar contraseña (opcional)
                                    </Typography>
                                </Divider>

                                <TextField
                                    fullWidth
                                    label="Nueva Contraseña"
                                    name="contrasena"
                                    type={showPassword ? 'text' : 'password'}
                                    value={editProfileData.contrasena}
                                    onChange={handleProfileChange}
                                    margin="dense"
                                    size="small"
                                    error={!!profileErrors.contrasena}
                                    helperText={profileErrors.contrasena || 'Dejar vacío para no cambiar'}
                                    inputProps={{ maxLength: 250 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {editProfileData.contrasena && (
                                    <TextField
                                        fullWidth
                                        label="Confirmar Contraseña"
                                        name="confirmarContrasena"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={editProfileData.confirmarContrasena}
                                        onChange={handleProfileChange}
                                        margin="dense"
                                        size="small"
                                        error={!!profileErrors.confirmarContrasena}
                                        helperText={profileErrors.confirmarContrasena}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}

                                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSaveProfile}
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancelEdit}
                                    >
                                        Cancelar
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Galería de imágenes */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Mis Fotos
                        </Typography>
                        
                        {imagenes.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                No hay fotos disponibles. Sube tu primera foto de perfil.
                            </Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {imagenes.map((imagen) => (
                                    <Grid item xs={12} sm={6} md={4} key={imagen.id}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={getImageUrl(imagen.ruta || imagen.imagen)}
                                                alt="Foto de perfil"
                                                sx={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    console.error('Error al cargar imagen en galería')
                                                    console.error('Imagen objeto:', imagen)
                                                    console.error('URL intentada:', e.target?.src)
                                                    console.error('API_BASE_URL:', API_BASE_URL)
                                                }}
                                            />
                                            <CardContent sx={{ p: 1 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {imagen.estado === 'AC' ? 'Foto Principal' : 'Foto Guardada'}
                                                </Typography>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'center', p: 1 }}>
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    component="label"
                                                    title="Editar imagen"
                                                >
                                                    <EditIcon />
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/jpeg,image/jpg,image/png,image/gif"
                                                        onChange={(e) => handleEditImage(e, imagen.id)}
                                                    />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDeleteClick(imagen)}
                                                    title="Eliminar imagen"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Foto"
                message="¿Está seguro que desea eliminar esta foto? Esta acción no se puede deshacer."
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

export default Perfil
