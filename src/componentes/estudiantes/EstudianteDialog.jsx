import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material'
import { useState, useEffect } from 'react'

const EstudianteDialog = ({ open, onClose, onSave, estudiante = null }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        estado: 'ACTIVO'
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (estudiante) {
            setFormData({
                nombre: estudiante.nombre || '',
                correo: estudiante.correo || '',
                estado: estudiante.estado || 'ACTIVO'
            })
        } else {
            setFormData({
                nombre: '',
                correo: '',
                estado: 'ACTIVO'
            })
        }
        setErrors({})
    }, [estudiante, open])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Limpiar error del campo al modificarlo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio'
        } else if (formData.nombre.length > 100) {
            newErrors.nombre = 'El nombre no puede exceder 100 caracteres'
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es obligatorio'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Formato de correo inválido'
        } else if (formData.correo.length > 100) {
            newErrors.correo = 'El correo no puede exceder 100 caracteres'
        }

        if (!formData.estado) {
            newErrors.estado = 'El estado es obligatorio'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validate()) {
            onSave(formData)
            onClose()
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {estudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="nombre"
                    label="Nombre Completo"
                    type="text"
                    fullWidth
                    value={formData.nombre}
                    onChange={handleChange}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    required
                />
                <TextField
                    margin="dense"
                    name="correo"
                    label="Correo Electrónico"
                    type="email"
                    fullWidth
                    value={formData.correo}
                    onChange={handleChange}
                    error={!!errors.correo}
                    helperText={errors.correo}
                    required
                />
                <TextField
                    margin="dense"
                    name="estado"
                    label="Estado"
                    select
                    fullWidth
                    value={formData.estado}
                    onChange={handleChange}
                    error={!!errors.estado}
                    helperText={errors.estado}
                    required
                >
                    <MenuItem value="ACTIVO">Activo</MenuItem>
                    <MenuItem value="INACTIVO">Inactivo</MenuItem>
                    <MenuItem value="RETIRADO">Retirado</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {estudiante ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EstudianteDialog
