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

const SeccionDialog = ({ open, onClose, onSave, seccion, clases, aulas }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        claseId: '',
        aulaId: '',
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (seccion) {
            setFormData({
                nombre: seccion.nombre || '',
                claseId: seccion.claseId || '',
                aulaId: seccion.aulaId || '',
            })
        } else {
            setFormData({
                nombre: '',
                claseId: '',
                aulaId: '',
            })
        }
        setErrors({})
    }, [seccion, open])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido'
        } else if (formData.nombre.length > 6) {
            newErrors.nombre = 'El nombre no puede exceder 6 caracteres'
        }

        if (!formData.claseId) {
            newErrors.claseId = 'La clase es requerida'
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
                aulaId: formData.aulaId || null
            }
            onSave(dataToSave)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {seccion ? 'Editar Sección' : 'Nueva Sección'}
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
                    helperText={errors.nombre || 'Máximo 6 caracteres (ej: A, B, 1A)'}
                    inputProps={{ maxLength: 6 }}
                />

                <TextField
                    margin="normal"
                    label="Clase"
                    name="claseId"
                    value={formData.claseId}
                    onChange={handleChange}
                    fullWidth
                    required
                    select
                    error={!!errors.claseId}
                    helperText={errors.claseId || 'Seleccione la clase'}
                >
                    <MenuItem value="">Seleccione una clase</MenuItem>
                    {clases && clases.length > 0 ? (
                        clases.map((clase) => (
                            <MenuItem key={clase.id} value={clase.id}>
                                {clase.codigo} - {clase.nombre}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No hay clases disponibles</MenuItem>
                    )}
                </TextField>

                <TextField
                    margin="normal"
                    label="Aula"
                    name="aulaId"
                    value={formData.aulaId}
                    onChange={handleChange}
                    fullWidth
                    select
                    helperText="Opcional - Seleccione el aula"
                >
                    <MenuItem value="">Sin aula asignada</MenuItem>
                    {aulas && aulas.length > 0 ? (
                        aulas.map((aula) => (
                            <MenuItem key={aula.id} value={aula.id}>
                                {aula.nombre} (Capacidad: {aula.capacidad})
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No hay aulas disponibles</MenuItem>
                    )}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    {seccion ? 'Actualizar' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SeccionDialog
