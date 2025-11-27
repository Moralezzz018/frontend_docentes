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
    FormHelperText,
} from '@mui/material'

const ESTADOS = ['PRESENTE', 'AUSENTE', 'TARDANZA']

const AsistenciaDialog = ({ 
    open, 
    onClose, 
    onSave, 
    asistencia = null, 
    estudiantes = [], 
    clases = [], 
    periodos = [], 
    parciales = [] 
}) => {
    const [formData, setFormData] = useState({
        estudianteId: asistencia?.estudianteId || '',
        claseId: asistencia?.claseId || '',
        periodoId: asistencia?.periodoId || '',
        parcialId: asistencia?.parcialId || '',
        fecha: asistencia?.fecha ? new Date(asistencia.fecha).toISOString().substring(0, 16) : '',
        estado: asistencia?.estado || 'PRESENTE',
        descripcion: asistencia?.descripcion || '',
    })

    const [errors, setErrors] = useState({})

    // Filtrar parciales según el periodo seleccionado
    const parcialesFiltrados = formData.periodoId 
        ? parciales.filter(parcial => parcial.periodoId === parseInt(formData.periodoId))
        : parciales

    const handleChange = (e) => {
        const { name, value } = e.target
        const updates = { [name]: value }
        
        // Si cambia el periodo, limpiar el parcial seleccionado
        if (name === 'periodoId') {
            updates.parcialId = ''
        }
        
        setFormData(prev => ({
            ...prev,
            ...updates
        }))
        
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.estudianteId) {
            newErrors.estudianteId = 'Seleccione un estudiante'
        }

        if (!formData.claseId) {
            newErrors.claseId = 'Seleccione una clase'
        }

        if (!formData.periodoId) {
            newErrors.periodoId = 'Seleccione un periodo'
        }

        if (!formData.parcialId) {
            newErrors.parcialId = 'Seleccione un parcial'
        }

        if (!formData.fecha) {
            newErrors.fecha = 'La fecha es obligatoria'
        }

        if (!formData.estado) {
            newErrors.estado = 'Seleccione un estado'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            const data = {
                estudianteId: parseInt(formData.estudianteId),
                claseId: parseInt(formData.claseId),
                periodoId: parseInt(formData.periodoId),
                parcialId: parseInt(formData.parcialId),
                fecha: new Date(formData.fecha).toISOString(),
                estado: formData.estado,
                descripcion: formData.descripcion || null,
            }
            onSave(data)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {asistencia ? 'Editar Asistencia' : 'Nueva Asistencia'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Estudiante"
                            name="estudianteId"
                            value={formData.estudianteId}
                            onChange={handleChange}
                            error={!!errors.estudianteId}
                            helperText={errors.estudianteId}
                            required
                        >
                            {Array.isArray(estudiantes) && estudiantes.map((estudiante) => (
                                <MenuItem key={estudiante.id} value={estudiante.id}>
                                    {estudiante.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Clase"
                            name="claseId"
                            value={formData.claseId}
                            onChange={handleChange}
                            error={!!errors.claseId}
                            helperText={errors.claseId}
                            required
                        >
                            {Array.isArray(clases) && clases.map((clase) => (
                                <MenuItem key={clase.id} value={clase.id}>
                                    {clase.codigo} - {clase.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Periodo"
                            name="periodoId"
                            value={formData.periodoId}
                            onChange={handleChange}
                            error={!!errors.periodoId}
                            helperText={errors.periodoId || "Primero seleccione el periodo"}
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
                            select
                            label="Parcial"
                            name="parcialId"
                            value={formData.parcialId}
                            onChange={handleChange}
                            error={!!errors.parcialId}
                            helperText={errors.parcialId || (formData.periodoId ? "Seleccione un parcial" : "Primero seleccione un periodo")}
                            required
                            disabled={!formData.periodoId}
                        >
                            {Array.isArray(parcialesFiltrados) && parcialesFiltrados.map((parcial) => (
                                <MenuItem key={parcial.id} value={parcial.id}>
                                    {parcial.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fecha y Hora"
                            name="fecha"
                            type="datetime-local"
                            value={formData.fecha}
                            onChange={handleChange}
                            error={!!errors.fecha}
                            helperText={errors.fecha}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            error={!!errors.estado}
                            helperText={errors.estado}
                            required
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
                            label="Descripción (Opcional)"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Ej: Llegó 10 minutos tarde, tuvo permiso médico, etc."
                            helperText="Agregue notas adicionales sobre la asistencia"
                            multiline
                            rows={2}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {asistencia ? 'Guardar Cambios' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AsistenciaDialog
