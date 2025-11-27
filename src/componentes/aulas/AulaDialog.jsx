import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material'

const AulaDialog = ({ open, onClose, onSave, aula }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        capacidad: '',
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (aula) {
            setFormData({
                nombre: aula.nombre || '',
                capacidad: aula.capacidad || '',
            })
        } else {
            setFormData({
                nombre: '',
                capacidad: '',
            })
        }
        setErrors({})
    }, [aula, open])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido'
        } else if (formData.nombre.length > 50) {
            newErrors.nombre = 'El nombre no puede exceder 50 caracteres'
        }

        if (!formData.capacidad) {
            newErrors.capacidad = 'La capacidad es requerida'
        } else if (isNaN(formData.capacidad) || formData.capacidad < 1) {
            newErrors.capacidad = 'La capacidad debe ser un número mayor a 0'
        } else if (formData.capacidad > 200) {
            newErrors.capacidad = 'La capacidad no puede exceder 200 estudiantes'
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
                ...formData,
                capacidad: parseInt(formData.capacidad)
            }
            onSave(dataToSave)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {aula ? 'Editar Aula' : 'Nueva Aula'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.nombre}
                    helperText={errors.nombre || 'Máximo 50 caracteres (ej: Aula 101, Lab. Computación)'}
                    inputProps={{ maxLength: 50 }}
                />

                <TextField
                    margin="normal"
                    label="Capacidad"
                    name="capacidad"
                    type="number"
                    value={formData.capacidad}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.capacidad}
                    helperText={errors.capacidad || 'Número de estudiantes que puede albergar el aula'}
                    inputProps={{ min: 1, max: 200 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    {aula ? 'Actualizar' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AulaDialog
