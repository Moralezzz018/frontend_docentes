import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    InputAdornment,
    IconButton,
    Box,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const ESTADOS = [
    { value: 'AC', label: 'Activo' },
    { value: 'IN', label: 'Inactivo' },
    { value: 'BL', label: 'Bloqueado' },
]

const UsuarioDialog = ({ open, onClose, onSave, usuario }) => {
    const [formData, setFormData] = useState({
        login: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        estado: 'AC',
        rolId: '',
        docenteId: '',
        estudianteId: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (usuario) {
            setFormData({
                login: usuario.login || '',
                correo: usuario.correo || '',
                contrasena: '',
                confirmarContrasena: '',
                estado: usuario.estado || 'AC',
                rolId: usuario.rolId || '',
                docenteId: usuario.docenteId || '',
                estudianteId: usuario.estudianteId || ''
            })
        } else {
            setFormData({
                login: '',
                correo: '',
                contrasena: '',
                confirmarContrasena: '',
                estado: 'AC',
                rolId: '',
                docenteId: '',
                estudianteId: ''
            })
        }
        setErrors({})
        setShowPassword(false)
        setShowConfirmPassword(false)
    }, [usuario, open])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.login.trim()) {
            newErrors.login = 'El login es requerido'
        } else if (formData.login.length < 3) {
            newErrors.login = 'El login debe tener al menos 3 caracteres'
        } else if (formData.login.length > 50) {
            newErrors.login = 'El login no puede exceder 50 caracteres'
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'El correo no es válido'
        } else if (formData.correo.length > 150) {
            newErrors.correo = 'El correo no puede exceder 150 caracteres'
        }

        // Solo validar contraseña si es nuevo usuario o si se está cambiando
        if (!usuario && !formData.contrasena.trim()) {
            newErrors.contrasena = 'La contraseña es requerida'
        } else if (formData.contrasena && formData.contrasena.length < 6) {
            newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres'
        } else if (formData.contrasena && formData.contrasena.length > 250) {
            newErrors.contrasena = 'La contraseña no puede exceder 250 caracteres'
        }

        // Validar confirmación de contraseña
        if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
            newErrors.confirmarContrasena = 'Las contraseñas no coinciden'
        }

        // Validar que al menos haya un rol, docente o estudiante
        if (!formData.rolId && !formData.docenteId && !formData.estudianteId) {
            newErrors.rolId = 'Debe seleccionar un rol, docente o estudiante'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = () => {
        if (validateForm()) {
            const dataToSave = {
                login: formData.login,
                correo: formData.correo,
                estado: formData.estado
            }
            
            // Solo incluir contraseña si hay una
            if (formData.contrasena) {
                dataToSave.contrasena = formData.contrasena
            }

            // Incluir IDs opcionales solo si tienen valor
            if (formData.rolId) dataToSave.rolId = parseInt(formData.rolId)
            if (formData.docenteId) dataToSave.docenteId = parseInt(formData.docenteId)
            if (formData.estudianteId) dataToSave.estudianteId = parseInt(formData.estudianteId)

            onSave(dataToSave)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <TextField
                        margin="dense"
                        label="Login / Usuario"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.login}
                        helperText={errors.login || 'Mínimo 3 caracteres, máximo 50'}
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
                        margin="dense"
                        label="Correo Electrónico"
                        name="correo"
                        type="email"
                        value={formData.correo}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.correo}
                        helperText={errors.correo || 'Máximo 150 caracteres'}
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
                        margin="dense"
                        label={usuario ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                        name="contrasena"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.contrasena}
                        onChange={handleChange}
                        fullWidth
                        required={!usuario}
                        error={!!errors.contrasena}
                        helperText={errors.contrasena || (usuario ? 'Dejar en blanco para mantener la actual' : 'Mínimo 6 caracteres')}
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
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {(formData.contrasena || !usuario) && (
                        <TextField
                            margin="dense"
                            label="Confirmar Contraseña"
                            name="confirmarContrasena"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                            fullWidth
                            required={!!formData.contrasena || !usuario}
                            error={!!errors.confirmarContrasena}
                            helperText={errors.confirmarContrasena}
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
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}

                    <TextField
                        margin="dense"
                        label="Estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        fullWidth
                        required
                        select
                        helperText="Seleccione el estado del usuario"
                    >
                        {ESTADOS.map((estado) => (
                            <MenuItem key={estado.value} value={estado.value}>
                                {estado.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Rol (Opcional - Solo para ADMIN)"
                        name="rolId"
                        value={formData.rolId}
                        onChange={handleChange}
                        fullWidth
                        select
                        error={!!errors.rolId}
                        helperText={errors.rolId || "Para usuarios ADMIN. Si es docente/estudiante, use los campos abajo"}
                    >
                        <MenuItem value="">Sin rol (se asignará automáticamente)</MenuItem>
                        <MenuItem value="1">Administrador</MenuItem>
                        <MenuItem value="2">Docente</MenuItem>
                        <MenuItem value="3">Estudiante</MenuItem>
                    </TextField>

                    <TextField
                        margin="dense"
                        label="ID Docente (Opcional)"
                        name="docenteId"
                        type="number"
                        value={formData.docenteId}
                        onChange={handleChange}
                        fullWidth
                        helperText="Si es docente, ingrese el ID (asigna rol DOCENTE automáticamente)"
                    />

                    <TextField
                        margin="dense"
                        label="ID Estudiante (Opcional)"
                        name="estudianteId"
                        type="number"
                        value={formData.estudianteId}
                        onChange={handleChange}
                        fullWidth
                        helperText="Si es estudiante, ingrese el ID (asigna rol ESTUDIANTE automáticamente)"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    {usuario ? 'Actualizar' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default UsuarioDialog
