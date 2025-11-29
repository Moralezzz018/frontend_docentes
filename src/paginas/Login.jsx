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
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(credentials)
            navigate('/')
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

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Usuario"
                            name="login"
                            value={credentials.login}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoFocus
                            variant="outlined"
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
        </Container>
    )
}

export default Login
