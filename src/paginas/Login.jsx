import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    InputAdornment,
    IconButton,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAuthStore } from '@almacen/authStore'

const Login = () => {
    const [credentials, setCredentials] = useState({ login: '', contrasena: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: ''
    })
    const [passwordError, setPasswordError] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await login(credentials)
            
            // Verificar si requiere cambio de contraseña
            if (data.requiereCambioContrasena) {
                setPasswordData({
                    contrasenaActual: credentials.contrasena,
                    contrasenaNueva: '',
                    confirmarContrasena: ''
                })
                setOpenChangePasswordModal(true)
            } else {
                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.msj || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        })
    }

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        })
        setPasswordError('')
    }

    const handleChangePasswordSubmit = async () => {
        setPasswordError('')

        // Validaciones
        if (!passwordData.contrasenaNueva || !passwordData.confirmarContrasena) {
            setPasswordError('Todos los campos son requeridos')
            return
        }

        if (passwordData.contrasenaNueva.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
            return
        }

        if (passwordData.contrasenaNueva !== passwordData.confirmarContrasena) {
            setPasswordError('Las contraseñas no coinciden')
            return
        }

        if (passwordData.contrasenaActual === passwordData.contrasenaNueva) {
            setPasswordError('La nueva contraseña debe ser diferente a la actual')
            return
        }

        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/cambiar-contrasena-primera-vez`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    contrasenaActual: passwordData.contrasenaActual,
                    contrasenaNueva: passwordData.contrasenaNueva
                })
            })

            if (!response.ok) {
                // Intentar parsear como JSON, si falla mostrar el texto
                let errorMsg = 'Error al cambiar contraseña'
                try {
                    const data = await response.json()
                    errorMsg = data.error || data.mensaje || errorMsg
                } catch (parseError) {
                    const text = await response.text()
                    console.error('Respuesta del servidor:', text)
                    errorMsg = `Error ${response.status}: ${response.statusText}`
                }
                throw new Error(errorMsg)
            }

            const data = await response.json()

            // Actualizar token
            localStorage.setItem('token', data.token)
            
            // Cerrar modal y redirigir
            setOpenChangePasswordModal(false)
            navigate('/')
        } catch (err) {
            console.error('Error completo:', err)
            setPasswordError(err.message || 'Error al cambiar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                            Iniciar Sesión
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sistema de Gestión Docente
                        </Typography>
                    </Box>

                    <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            <strong>¿Eres nuevo?</strong> Si eres docente o estudiante recién registrado, 
                            revisa tu correo electrónico para obtener tus credenciales de acceso.
                        </Typography>
                    </Alert>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Usuario o Correo Electrónico"
                            name="login"
                            value={credentials.login}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoFocus
                            variant="outlined"
                            helperText="Puedes usar tu nombre de usuario o correo electrónico"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Contraseña"
                            name="contrasena"
                            type={showPassword ? 'text' : 'password'}
                            value={credentials.contrasena}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ 
                                mt: 3,
                                py: 1.5,
                                fontWeight: 600,
                                boxShadow: 2,
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Link 
                                component={RouterLink} 
                                to="/recuperar-contrasena" 
                                variant="body2"
                                underline="hover"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                            <Link 
                                component={RouterLink} 
                                to="/registro" 
                                variant="body2"
                                underline="hover"
                            >
                                Crear cuenta
                            </Link>
                        </Box>
                    </form>
                </Paper>
            </Box>

            {/* Modal de Cambio de Contraseña Obligatorio */}
            <Dialog 
                open={openChangePasswordModal} 
                onClose={() => {}} 
                disableEscapeKeyDown
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LockIcon color="primary" />
                        <Typography variant="h6" component="span">
                            Cambio de Contraseña Requerido
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
                    </Alert>

                    {passwordError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {passwordError}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Contraseña Actual"
                        name="contrasenaActual"
                        type="password"
                        value={passwordData.contrasenaActual}
                        margin="normal"
                        disabled
                        helperText="Esta es tu contraseña temporal recibida por correo"
                    />

                    <TextField
                        fullWidth
                        label="Nueva Contraseña"
                        name="contrasenaNueva"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.contrasenaNueva}
                        onChange={handlePasswordChange}
                        margin="normal"
                        required
                        helperText="Mínimo 6 caracteres"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Confirmar Nueva Contraseña"
                        name="confirmarContrasena"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmarContrasena}
                        onChange={handlePasswordChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleChangePasswordSubmit}
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        size="large"
                    >
                        {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Login
