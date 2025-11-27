import { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Grid,
} from '@mui/material'

const ParcialDialog = ({ open, onClose, onSave, parcial = null, periodos = [] }) => {
    const [formData, setFormData] = useState({
        nombre: parcial?.nombre || '',
        fechaInicio: parcial?.fechaInicio ? new Date(parcial.fechaInicio).toISOString().substring(0, 10) : '',
        fechaFin: parcial?.fechaFin ? new Date(parcial.fechaFin).toISOString().substring(0, 10) : '',
        periodoId: parcial?.periodoId || '',
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio'
        } else if (formData.nombre.length > 50) {
            newErrors.nombre = 'El nombre no puede exceder 50 caracteres'
        }

        if (!formData.fechaInicio) {
            newErrors.fechaInicio = 'La fecha de inicio es obligatoria'
        }

        if (!formData.fechaFin) {
            newErrors.fechaFin = 'La fecha de fin es obligatoria'
        }

        if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio >= formData.fechaFin) {
            newErrors.fechaFin = 'La fecha de fin debe ser posterior a la de inicio'
        }

        if (!formData.periodoId) {
            newErrors.periodoId = 'Seleccione un periodo'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            const data = {
                nombre: formData.nombre.trim(),
                fechaInicio: new Date(formData.fechaInicio).toISOString(),
                fechaFin: new Date(formData.fechaFin).toISOString(),
                periodoId: parseInt(formData.periodoId),
            }
            onSave(data)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {parcial ? 'Editar Parcial' : 'Nuevo Parcial'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            error={!!errors.nombre}
                            helperText={errors.nombre || 'Ej: Parcial 1'}
                            required
                            inputProps={{ maxLength: 50 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="Periodo"
                            name="periodoId"
                            value={formData.periodoId}
                            onChange={handleChange}
                            error={!!errors.periodoId}
                            helperText={errors.periodoId}
                            required
                        >
                            {Array.isArray(periodos) && periodos.map((periodo) => (
                                <MenuItem key={periodo.id} value={periodo.id}>
                                    {periodo.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Inicio"
                            name="fechaInicio"
                            type="date"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            error={!!errors.fechaInicio}
                            helperText={errors.fechaInicio}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Fin"
                            name="fechaFin"
                            type="date"
                            value={formData.fechaFin}
                            onChange={handleChange}
                            error={!!errors.fechaFin}
                            helperText={errors.fechaFin}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {parcial ? 'Guardar Cambios' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ParcialDialog
