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
    Stepper,
    Step,
    StepLabel,
    Link,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PinIcon from '@mui/icons-material/Pin'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { authService } from '@servicios/authService'

const steps = ['Ingresar correo', 'Validar PIN', 'Nueva contraseña']

const RecuperarContrasena = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [correo, setCorreo] = useState('')
    const [pin, setPin] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [confirmarContrasena, setConfirmarContrasena] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState('')
    const navigate = useNavigate()

    const handleSolicitarPin = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!correo.trim()) {
            setError('El correo es requerido')
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            setError('El correo no es válido')
            return
        }

        setLoading(true)

        try {
            await authService.solicitarRestablecimiento(correo)
            setSuccess('PIN enviado a tu correo. Revisa tu bandeja de entrada.')
            setActiveStep(1)
        } catch (err) {
            console.error('Error al solicitar PIN:', err)
            setError(err.response?.data?.error || 'Error al enviar el PIN')
        } finally {
            setLoading(false)
        }
    }

    const handleValidarPin = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!pin.trim()) {
            setError('El PIN es requerido')
            return
        }
        if (pin.length !== 6) {
            setError('El PIN debe tener 6 dígitos')
            return
        }

        setLoading(true)

        try {
            const response = await authService.validarPin(correo, pin)
            setToken(response.token)
            setSuccess('PIN validado correctamente. Ahora puedes restablecer tu contraseña.')
            setActiveStep(2)
        } catch (err) {
            console.error('Error al validar PIN:', err)
            setError(err.response?.data?.error || 'PIN inválido o expirado')
        } finally {
            setLoading(false)
        }
    }

    const handleRestablecerContrasena = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!contrasena) {
            setError('La contraseña es requerida')
            return
        }
        if (contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }
        if (contrasena !== confirmarContrasena) {
            setError('Las contraseñas no coinciden')
            return
        }

        setLoading(true)

        try {
            await authService.restablecerContrasena(token, contrasena)
            setSuccess('¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión...')
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            console.error('Error al restablecer contraseña:', err)
            setError(err.response?.data?.error || 'Error al restablecer la contraseña')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        setError('')
        setSuccess('')
        if (activeStep === 1) {
            setPin('')
            setActiveStep(0)
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
                            Recuperar Contraseña
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sistema de Gestión Docente
                        </Typography>
                    </Box>

                    <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {/* Paso 1: Ingresar correo */}
                    {activeStep === 0 && (
                        <form onSubmit={handleSolicitarPin}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Ingresa tu correo electrónico y te enviaremos un PIN de 6 dígitos para restablecer tu contraseña.
                            </Typography>

                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                margin="normal"
                                required
                                autoFocus
                                disabled={loading}
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
                                disabled={loading}
                            >
                                {loading ? 'Enviando PIN...' : 'Enviar PIN'}
                            </Button>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Link component={RouterLink} to="/login" underline="hover">
                                    <Button startIcon={<ArrowBackIcon />}>
                                        Volver al inicio de sesión
                                    </Button>
                                </Link>
                            </Box>
                        </form>
                    )}

                    {/* Paso 2: Validar PIN */}
                    {activeStep === 1 && (
                        <form onSubmit={handleValidarPin}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Ingresa el PIN de 6 dígitos que te enviamos a <strong>{correo}</strong>
                            </Typography>

                            <TextField
                                fullWidth
                                label="PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                margin="normal"
                                required
                                autoFocus
                                disabled={loading}
                                inputProps={{ 
                                    maxLength: 6,
                                    pattern: '[0-9]*',
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PinIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                helperText="El PIN expira en 15 minutos"
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
                                disabled={loading || pin.length !== 6}
                            >
                                {loading ? 'Validando...' : 'Validar PIN'}
                            </Button>

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Button 
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleBack}
                                    disabled={loading}
                                >
                                    Atrás
                                </Button>
                                <Button 
                                    onClick={handleSolicitarPin}
                                    disabled={loading}
                                >
                                    Reenviar PIN
                                </Button>
                            </Box>
                        </form>
                    )}

                    {/* Paso 3: Nueva contraseña */}
                    {activeStep === 2 && (
                        <form onSubmit={handleRestablecerContrasena}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Ingresa tu nueva contraseña
                            </Typography>

                            <TextField
                                fullWidth
                                label="Nueva Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                margin="normal"
                                required
                                autoFocus
                                disabled={loading}
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
                                                disabled={loading}
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
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                margin="normal"
                                required
                                disabled={loading}
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
                                                disabled={loading}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                                {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
                            </Button>
                        </form>
                    )}
                </Paper>
            </Box>
        </Container>
    )
}

export default RecuperarContrasena
