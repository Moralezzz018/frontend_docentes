import { useState, useEffect } from 'react'
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
import { useAuthStore } from '@almacen/authStore'

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
    const { user, isEstudiante } = useAuthStore()
    const esEstudiante = isEstudiante()
    
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
    
    // Si es estudiante, establecer automáticamente su ID
    useEffect(() => {
        if (esEstudiante && user?.estudianteId && !asistencia) {
            setFormData(prev => ({
                ...prev,
                estudianteId: user.estudianteId
            }))
        }
    }, [esEstudiante, user, asistencia])

    // Filtrar parciales según el periodo seleccionado
    const parcialesFiltrados = formData.periodoId 
        ? parciales.filter(parcial => parcial.periodoId === parseInt(formData.periodoId))
        : parciales

    // Filtrar clases para estudiantes: solo mostrar clases en las que está inscrito
    const clasesFiltradas = (esEstudiante && user?.estudianteId)
        ? clases.filter(clase => {
            // Buscar al estudiante actual en la lista de estudiantes
            const estudianteActual = estudiantes.find(est => est.id === user.estudianteId)
            
            if (!estudianteActual?.inscripciones || !Array.isArray(estudianteActual.inscripciones)) {
                return false
            }
            
            // Verificar si tiene inscripción en esta clase
            return estudianteActual.inscripciones.some(inscripcion => {
                const claseIdInscripcion = inscripcion.claseId || inscripcion.clase?.id
                return claseIdInscripcion === clase.id
            })
        })
        : clases

    // Filtrar estudiantes según la clase seleccionada (solo para docentes)
    const estudiantesFiltrados = formData.claseId 
        ? estudiantes.filter(estudiante => {
            // Verificar si el estudiante tiene inscripciones en la clase seleccionada
            if (!estudiante.inscripciones || !Array.isArray(estudiante.inscripciones)) {
                return false
            }
            
            return estudiante.inscripciones.some(inscripcion => {
                // La inscripción puede tener claseId directamente o en inscripcion.clase.id
                const claseIdInscripcion = inscripcion.claseId || inscripcion.clase?.id
                return claseIdInscripcion === parseInt(formData.claseId)
            })
        })
        : estudiantes

    const handleChange = (e) => {
        const { name, value } = e.target
        const updates = { [name]: value }
        
        // Si cambia el periodo, limpiar el parcial seleccionado
        if (name === 'periodoId') {
            updates.parcialId = ''
        }
        
        // Si cambia la clase, limpiar el estudiante seleccionado
        if (name === 'claseId') {
            updates.estudianteId = ''
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

        // Para estudiantes, el estudianteId debe estar auto-establecido
        if (!formData.estudianteId) {
            if (esEstudiante && user?.estudianteId) {
                // Auto-establecer si falta
                setFormData(prev => ({ ...prev, estudianteId: user.estudianteId }))
            } else {
                newErrors.estudianteId = 'Seleccione un estudiante'
            }
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
                    {/* Solo mostrar selector de estudiante si NO es estudiante logueado */}
                    {!esEstudiante && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Estudiante"
                                name="estudianteId"
                                value={formData.estudianteId}
                                onChange={handleChange}
                                error={!!errors.estudianteId}
                                helperText={errors.estudianteId || (formData.claseId ? "Estudiantes inscritos en la clase seleccionada" : "Primero seleccione una clase")}
                                required
                                disabled={!formData.claseId}
                            >
                                {Array.isArray(estudiantesFiltrados) && estudiantesFiltrados.map((estudiante) => (
                                    <MenuItem key={estudiante.id} value={estudiante.id}>
                                        {estudiante.nombre}
                                    </MenuItem>
                                ))}
                                {formData.claseId && estudiantesFiltrados.length === 0 && (
                                    <MenuItem value="" disabled>
                                        No hay estudiantes inscritos en esta clase
                                    </MenuItem>
                                )}
                            </TextField>
                        </Grid>
                    )}

                    <Grid item xs={12} sm={esEstudiante ? 12 : 6}>
                        <TextField
                            fullWidth
                            select
                            label="Clase"
                            name="claseId"
                            value={formData.claseId}
                            onChange={handleChange}
                            error={!!errors.claseId}
                            helperText={errors.claseId || (esEstudiante ? "Tus clases inscritas" : "")}
                            required
                        >
                            {Array.isArray(clasesFiltradas) && clasesFiltradas.map((clase) => (
                                <MenuItem key={clase.id} value={clase.id}>
                                    {clase.codigo} - {clase.nombre}
                                </MenuItem>
                            ))}
                            {esEstudiante && clasesFiltradas.length === 0 && (
                                <MenuItem value="" disabled>
                                    No tienes clases inscritas
                                </MenuItem>
                            )}
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
                            {/* Estudiantes solo pueden marcar PRESENTE o AUSENTE */}
                            {(esEstudiante ? ['PRESENTE', 'AUSENTE'] : ESTADOS).map((estado) => (
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
