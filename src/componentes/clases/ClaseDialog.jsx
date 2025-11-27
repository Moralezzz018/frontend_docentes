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
    Chip,
    Box,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
} from '@mui/material'

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const CREDITOS = [3, 4]

const ClaseDialog = ({ open, onClose, onSave, clase = null }) => {
    const [formData, setFormData] = useState({
        codigo: clase?.codigo || '',
        nombre: clase?.nombre || '',
        creditos: clase?.creditos || 3,
        diaSemana: clase?.diaSemana || [],
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

    const handleDiasChange = (event) => {
        const value = event.target.value
        setFormData(prev => ({
            ...prev,
            diaSemana: typeof value === 'string' ? value.split(',') : value,
        }))
        
        if (errors.diaSemana) {
            setErrors(prev => ({ ...prev, diaSemana: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.codigo.trim()) {
            newErrors.codigo = 'El código es obligatorio'
        } else if (formData.codigo.length > 20) {
            newErrors.codigo = 'El código no puede exceder 20 caracteres'
        }

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio'
        } else if (formData.nombre.length > 50) {
            newErrors.nombre = 'El nombre no puede exceder 50 caracteres'
        }

        if (!formData.creditos) {
            newErrors.creditos = 'Seleccione los créditos'
        }

        if (!formData.diaSemana || formData.diaSemana.length === 0) {
            newErrors.diaSemana = 'Seleccione al menos un día'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            const data = {
                codigo: formData.codigo.trim(),
                nombre: formData.nombre.trim(),
                creditos: parseInt(formData.creditos),
                diaSemana: formData.diaSemana,
            }
            onSave(data)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {clase ? 'Editar Clase' : 'Nueva Clase'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Código"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            error={!!errors.codigo}
                            helperText={errors.codigo || 'Ej: MAT101'}
                            required
                            inputProps={{ maxLength: 20 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Créditos"
                            name="creditos"
                            value={formData.creditos}
                            onChange={handleChange}
                            error={!!errors.creditos}
                            helperText={errors.creditos}
                            required
                        >
                            {CREDITOS.map((credito) => (
                                <MenuItem key={credito} value={credito}>
                                    {credito}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            error={!!errors.nombre}
                            helperText={errors.nombre || 'Ej: Matemáticas I'}
                            required
                            inputProps={{ maxLength: 50 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!errors.diaSemana}>
                            <InputLabel>Días de la semana *</InputLabel>
                            <Select
                                multiple
                                value={formData.diaSemana}
                                onChange={handleDiasChange}
                                input={<OutlinedInput label="Días de la semana *" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {DIAS_SEMANA.map((dia) => (
                                    <MenuItem key={dia} value={dia}>
                                        {dia}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.diaSemana && (
                                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                                    {errors.diaSemana}
                                </Box>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {clase ? 'Guardar Cambios' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ClaseDialog
