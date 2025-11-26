import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
} from '@mui/material'
import { useAuthStore } from '@almacen/authStore'

const Login = () => {
    const [credentials, setCredentials] = useState({ login: '', contrasena: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
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
                        />
                        <TextField
                            fullWidth
                            label="Contraseña"
                            name="contrasena"
                            type="password"
                            value={credentials.contrasena}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
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
                    </form>
                </Paper>
            </Box>
        </Container>
    )
}

export default Login
