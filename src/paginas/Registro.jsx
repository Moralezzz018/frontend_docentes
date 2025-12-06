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
    Card,
    CardContent,
    Divider,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { docentesService } from '@servicios/docentesService'
import ProgressIndicator from '@componentes/common/ProgressIndicator'

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [correoEnviado, setCorreoEnviado] = useState('')
    const [progress, setProgress] = useState(0)
    const [progressMessage, setProgressMessage] = useState('')
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
        setProgress(0)
        setProgressMessage('Validando datos...')

        // Simular progreso
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev
                return prev + 15
            })
        }, 300)

        try {
            setProgressMessage('Creando cuenta de docente...')
            await new Promise(resolve => setTimeout(resolve, 500))
            
            setProgressMessage('Generando credenciales de acceso...')
            await new Promise(resolve => setTimeout(resolve, 400))
            
            setProgressMessage('Enviando correo con credenciales...')
            await docentesService.guardar(formData)
            
            clearInterval(progressInterval)
            setProgress(100)
            setProgressMessage('¡Registro completado exitosamente!')
            setSuccess(true)
            setCorreoEnviado(formData.correo)
            
            // Redirigir al login después de 8 segundos (más tiempo para leer el mensaje)
            setTimeout(() => {
                navigate('/login')
            }, 8000)
        } catch (err) {
            clearInterval(progressInterval)
            console.error('Error al crear docente:', err)
            if (err.response?.data?.error) {
                setError(err.response.data.error)
            } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                setError(err.response.data.errors.map(e => e.msg).join(', '))
            } else {
                setError('Error al crear el docente')
            }
            setLoading(false)
            setProgress(0)
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

                    <ProgressIndicator
                        loading={loading && !success}
                        progress={progress}
                        message={progressMessage}
                        completed={success}
                        variant="both"
                    />

                    {success && (
                        <Card 
                            sx={{ 
                                mb: 3, 
                                bgcolor: '#e8f5e9',
                                border: '2px solid #4caf50',
                                boxShadow: 3
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                                    <Typography variant="h6" component="div" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                                        ¡Registro Exitoso!
                                    </Typography>
                                </Box>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                    <MailOutlineIcon sx={{ color: '#1976d2', mr: 2, mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: '#1565c0' }}>
                                            Credenciales Enviadas
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#424242', mb: 1 }}>
                                            Hemos enviado tus credenciales de acceso a:
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                mt: 1,
                                                p: 1.5, 
                                                bgcolor: '#f5f5f5', 
                                                borderRadius: 1,
                                                fontFamily: 'monospace',
                                                fontSize: '0.95rem',
                                                color: '#0d47a1',
                                                fontWeight: 600,
                                                border: '1px solid #1976d2'
                                            }}
                                        >
                                            {correoEnviado}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                    <VpnKeyIcon sx={{ color: '#f57c00', mr: 2, mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: '#e65100' }}>
                                            ¿Qué hacer ahora?
                                        </Typography>
                                        <Typography variant="body2" component="div" sx={{ color: '#424242' }}>
                                            <ol style={{ margin: 0, paddingLeft: '20px' }}>
                                                <li>Revisa tu bandeja de entrada y correo no deseado</li>
                                                <li>Busca el correo con tus credenciales (usuario y contraseña temporal)</li>
                                                <li>Inicia sesión con el usuario o tu correo electrónico</li>
                                                <li>Cambia tu contraseña temporal por una nueva</li>
                                            </ol>
                                        </Typography>
                                    </Box>
                                </Box>

                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Importante:</strong> Si no recibes el correo en los próximos minutos, 
                                        verifica tu carpeta de spam o contacta al administrador.
                                    </Typography>
                                </Alert>

                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    sx={{ display: 'block', textAlign: 'center', mt: 2 }}
                                >
                                    Redirigiendo al inicio de sesión en unos segundos...
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    {!success && (
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
                    )}

                    {success && (
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{ mt: 2 }}
                        >
                            Ir a Iniciar Sesión Ahora
                        </Button>
                    )}
                </Paper>
            </Box>
        </Container>
    )
}

export default Registro
