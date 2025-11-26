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
    Box,
} from '@mui/material'

const TIPOS_EVALUACION = ['NORMAL', 'REPOSICION', 'EXAMEN']
const ESTADOS = ['ACTIVO', 'INACTIVO']

const EvaluacionDialog = ({ open, onClose, onSave, evaluacion = null, parciales = [], periodos = [] }) => {
    const [formData, setFormData] = useState({
        titulo: evaluacion?.titulo || '',
        fechaInicio: evaluacion?.fechaInicio ? evaluacion.fechaInicio.substring(0, 16) : '',
        fechaCierre: evaluacion?.fechaCierre ? evaluacion.fechaCierre.substring(0, 16) : '',
        notaMaxima: evaluacion?.notaMaxima || 100,
        peso: evaluacion?.peso || 1,
        tipo: evaluacion?.tipo || 'NORMAL',
        estado: evaluacion?.estado || 'ACTIVO',
        parcialId: evaluacion?.parcialId || '',
        periodoId: evaluacion?.periodoId || '',
        estructura: evaluacion?.estructura ? JSON.stringify(evaluacion.estructura, null, 2) : '{}',
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'El título es obligatorio'
        }

        if (!formData.fechaInicio) {
            newErrors.fechaInicio = 'La fecha de inicio es obligatoria'
        }

        if (!formData.fechaCierre) {
            newErrors.fechaCierre = 'La fecha de cierre es obligatoria'
        }

        if (formData.fechaInicio && formData.fechaCierre && formData.fechaInicio >= formData.fechaCierre) {
            newErrors.fechaCierre = 'La fecha de cierre debe ser posterior a la de inicio'
        }

        if (!formData.notaMaxima || formData.notaMaxima <= 0) {
            newErrors.notaMaxima = 'La nota máxima debe ser mayor a 0'
        }

        if (!formData.parcialId) {
            newErrors.parcialId = 'Seleccione un parcial'
        }

        if (!formData.periodoId) {
            newErrors.periodoId = 'Seleccione un periodo'
        }

        try {
            JSON.parse(formData.estructura)
        } catch (e) {
            newErrors.estructura = 'La estructura debe ser un JSON válido'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            const data = {
                ...formData,
                notaMaxima: parseFloat(formData.notaMaxima),
                peso: parseFloat(formData.peso),
                parcialId: parseInt(formData.parcialId),
                periodoId: parseInt(formData.periodoId),
                estructura: JSON.parse(formData.estructura),
                fechaInicio: new Date(formData.fechaInicio).toISOString(),
                fechaCierre: new Date(formData.fechaCierre).toISOString(),
            }
            onSave(data)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {evaluacion ? 'Editar Evaluación' : 'Nueva Evaluación'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Título"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                error={!!errors.titulo}
                                helperText={errors.titulo}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Fecha de Inicio"
                                name="fechaInicio"
                                type="datetime-local"
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
                                label="Fecha de Cierre"
                                name="fechaCierre"
                                type="datetime-local"
                                value={formData.fechaCierre}
                                onChange={handleChange}
                                error={!!errors.fechaCierre}
                                helperText={errors.fechaCierre}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                select
                                label="Tipo"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                            >
                                {TIPOS_EVALUACION.map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Nota Máxima"
                                name="notaMaxima"
                                type="number"
                                value={formData.notaMaxima}
                                onChange={handleChange}
                                error={!!errors.notaMaxima}
                                helperText={errors.notaMaxima}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Peso"
                                name="peso"
                                type="number"
                                inputProps={{ step: 0.1 }}
                                value={formData.peso}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
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

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                select
                                label="Parcial"
                                name="parcialId"
                                value={formData.parcialId}
                                onChange={handleChange}
                                error={!!errors.parcialId}
                                helperText={errors.parcialId}
                                required
                            >
                                {Array.isArray(parciales) && parciales.map((parcial) => (
                                    <MenuItem key={parcial.id} value={parcial.id}>
                                        {parcial.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                select
                                label="Estado"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                            >
                                {ESTADOS.map((estado) => (
                                    <MenuItem key={estado} value={estado}>
                                        {estado}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Estructura (JSON)"
                                name="estructura"
                                value={formData.estructura}
                                onChange={handleChange}
                                error={!!errors.estructura}
                                helperText={errors.estructura}
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {evaluacion ? 'Guardar Cambios' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EvaluacionDialog
