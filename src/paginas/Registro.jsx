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
    MenuItem,
    Link,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { authService } from '@servicios/authService'

const ESTADOS = [
    { value: 'AC', label: 'Activo' },
    { value: 'IN', label: 'Inactivo' },
]

const Registro = () => {
    const [formData, setFormData] = useState({
        login: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        estado: 'AC',
        rolId: '3', // Por defecto ESTUDIANTE
        docenteId: '',
        estudianteId: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const validateForm = () => {
        if (!formData.login.trim()) {
            setError('El login es requerido')
            return false
        }
        if (formData.login.length < 3) {
            setError('El login debe tener al menos 3 caracteres')
            return false
        }
        if (!formData.correo.trim()) {
            setError('El correo es requerido')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            setError('El correo no es válido')
            return false
        }
        if (!formData.contrasena) {
            setError('La contraseña es requerida')
            return false
        }
        if (formData.contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return false
        }
        if (formData.contrasena !== formData.confirmarContrasena) {
            setError('Las contraseñas no coinciden')
            return false
        }
        if (!formData.rolId && !formData.docenteId && !formData.estudianteId) {
            setError('Debe seleccionar un rol, docente o estudiante')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const dataToSend = {
                login: formData.login,
                correo: formData.correo,
                contrasena: formData.contrasena,
                estado: formData.estado,
            }

            // Incluir IDs opcionales solo si tienen valor
            if (formData.rolId) dataToSend.rolId = parseInt(formData.rolId)
            if (formData.docenteId) dataToSend.docenteId = parseInt(formData.docenteId)
            if (formData.estudianteId) dataToSend.estudianteId = parseInt(formData.estudianteId)

            await authService.register(dataToSend)
            setSuccess(true)
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            console.error('Error de registro:', err)
            if (err.response?.data?.errores && Array.isArray(err.response.data.errores)) {
                setError(err.response.data.errores.map(e => e.msg).join(', '))
            } else {
                setError(err.response?.data?.error || err.response?.data?.mensaje || 'Error al registrarse')
            }
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
                    py: 4,
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                            Crear Cuenta
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sistema de Gestión Docente
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            ¡Registro exitoso! Redirigiendo al inicio de sesión...
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Usuario"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            margin="dense"
                            required
                            autoFocus
                            disabled={loading || success}
                            helperText="Mínimo 3 caracteres"
                            inputProps={{ maxLength: 50 }}
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
                            label="Correo Electrónico"
                            name="correo"
                            type="email"
                            value={formData.correo}
                            onChange={handleChange}
                            margin="dense"
                            required
                            disabled={loading || success}
                            inputProps={{ maxLength: 150 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Contraseña"
                            name="contrasena"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.contrasena}
                            onChange={handleChange}
                            margin="dense"
                            required
                            disabled={loading || success}
                            helperText="Mínimo 6 caracteres"
                            inputProps={{ maxLength: 250 }}
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
                                            disabled={loading || success}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirmar Contraseña"
                            name="confirmarContrasena"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                            margin="dense"
                            required
                            disabled={loading || success}
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
                                            tabIndex={-1}
                                            disabled={loading || success}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Tipo de Usuario"
                            name="rolId"
                            value={formData.rolId}
                            onChange={handleChange}
                            margin="dense"
                            select
                            disabled={loading || success}
                            helperText="Seleccione su tipo de usuario"
                        >
                            <MenuItem value="">Ninguno (requerirá ID de docente/estudiante)</MenuItem>
                            <MenuItem value="2">Docente</MenuItem>
                            <MenuItem value="3">Estudiante</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            label="ID Docente (Opcional)"
                            name="docenteId"
                            type="number"
                            value={formData.docenteId}
                            onChange={handleChange}
                            margin="dense"
                            disabled={loading || success}
                            helperText="Si es docente y conoce su ID"
                        />

                        <TextField
                            fullWidth
                            label="ID Estudiante (Opcional)"
                            name="estudianteId"
                            type="number"
                            value={formData.estudianteId}
                            onChange={handleChange}
                            margin="dense"
                            disabled={loading || success}
                            helperText="Si es estudiante y conoce su ID"
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
                            disabled={loading || success}
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                ¿Ya tienes una cuenta?{' '}
                                <Link component={RouterLink} to="/login" underline="hover">
                                    Iniciar Sesión
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}

export default Registro
