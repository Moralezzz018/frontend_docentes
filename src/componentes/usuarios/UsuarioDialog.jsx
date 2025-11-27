import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
} from '@mui/material'

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
        estado: 'AC',
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (usuario) {
            setFormData({
                login: usuario.login || '',
                correo: usuario.correo || '',
                contrasena: '',
                estado: usuario.estado || 'AC',
            })
        } else {
            setFormData({
                login: '',
                correo: '',
                contrasena: '',
                estado: 'AC',
            })
        }
        setErrors({})
    }, [usuario, open])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.login.trim()) {
            newErrors.login = 'El login es requerido'
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
            const dataToSave = { ...formData }
            // Si es edición y no hay contraseña, no enviarla
            if (usuario && !formData.contrasena) {
                delete dataToSave.contrasena
            }
            onSave(dataToSave)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    label="Login"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.login}
                    helperText={errors.login || 'Máximo 50 caracteres'}
                    inputProps={{ maxLength: 50 }}
                />

                <TextField
                    margin="normal"
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
                />

                <TextField
                    margin="normal"
                    label={usuario ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                    name="contrasena"
                    type="password"
                    value={formData.contrasena}
                    onChange={handleChange}
                    fullWidth
                    required={!usuario}
                    error={!!errors.contrasena}
                    helperText={errors.contrasena || (usuario ? 'Dejar en blanco para mantener la actual' : 'Mínimo 6 caracteres')}
                    inputProps={{ maxLength: 250 }}
                />

                <TextField
                    margin="normal"
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
