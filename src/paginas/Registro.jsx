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
    MenuItem,
    Link,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import WorkIcon from '@mui/icons-material/Work'
import { docentesService } from '@servicios/docentesService'

const ESTADOS = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
]

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        especialidad: '',
        estado: 'ACTIVO',
    })
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
        if (!formData.nombre.trim()) {
            setError('El nombre completo es requerido')
            return false
        }
        if (formData.nombre.length < 3) {
            setError('El nombre debe tener al menos 3 caracteres')
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
            await docentesService.guardar(formData)
            setSuccess(true)
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err) {
            console.error('Error al crear docente:', err)
            if (err.response?.data?.error) {
                setError(err.response.data.error)
            } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                setError(err.response.data.errors.map(e => e.msg).join(', '))
            } else {
                setError('Error al crear el docente')
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
                            Registro de Docente
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sistema de Gestión Docente
                        </Typography>
                    </Box>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            <strong>🔐 Creación automática de usuario:</strong>
                            <br />
                            Al registrar un docente, se creará automáticamente una cuenta de usuario y 
                            se enviarán las credenciales de acceso al correo electrónico proporcionado.
                        </Typography>
                    </Alert>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            ¡Docente registrado exitosamente! Se han enviado las credenciales por correo. 
                            Redirigiendo al inicio de sesión...
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Nombre Completo"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            margin="dense"
                            required
                            autoFocus
                            disabled={loading || success}
                            helperText="Ejemplo: Juan Pérez García"
                            inputProps={{ maxLength: 100 }}
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
                            helperText="Se usará para enviar las credenciales de acceso"
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
                            label="Especialidad"
                            name="especialidad"
                            value={formData.especialidad}
                            onChange={handleChange}
                            margin="dense"
                            disabled={loading || success}
                            helperText="Ejemplo: Matemáticas, Programación, Física (opcional)"
                            inputProps={{ maxLength: 100 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <WorkIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            select
                            label="Estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            margin="dense"
                            disabled={loading || success}
                        >
                            {ESTADOS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

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
                            {loading ? 'Registrando docente...' : 'Registrar Docente'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link
                                component={RouterLink}
                                to="/login"
                                variant="body2"
                                underline="hover"
                            >
                                ¿Ya tienes cuenta? Inicia sesión
                            </Link>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}

export default Registro
