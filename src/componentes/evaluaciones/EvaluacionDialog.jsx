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
    Box,
} from '@mui/material'

const TIPOS_EVALUACION = ['NORMAL', 'REPOSICION', 'EXAMEN']
const ESTADOS = ['ACTIVO', 'INACTIVO']

const EvaluacionDialog = ({ open, onClose, onSave, evaluacion = null, parciales = [], periodos = [], clases = [], secciones = [] }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        fechaInicio: '',
        fechaCierre: '',
        notaMaxima: 100,
        tipo: 'NORMAL',
        estado: 'ACTIVO',
        parcialId: '',
        periodoId: '',
        claseId: '',
        seccionId: '',
        descripcion: '',
    })

    const [errors, setErrors] = useState({})

    // Actualizar formData cuando cambie evaluacion o se abra el diálogo
    useEffect(() => {
        if (open) {
            if (evaluacion) {
                setFormData({
                    titulo: evaluacion.titulo || '',
                    fechaInicio: evaluacion.fechaInicio ? evaluacion.fechaInicio.substring(0, 16) : '',
                    fechaCierre: evaluacion.fechaCierre ? evaluacion.fechaCierre.substring(0, 16) : '',
                    notaMaxima: evaluacion.notaMaxima || 100,
                    tipo: evaluacion.tipo || 'NORMAL',
                    estado: evaluacion.estado || 'ACTIVO',
                    parcialId: evaluacion.parcialId || '',
                    periodoId: evaluacion.periodoId || '',
                    claseId: evaluacion.claseId || '',
                    seccionId: evaluacion.seccionId || '',
                    descripcion: evaluacion.estructura?.descripcion || '',
                })
            } else {
                setFormData({
                    titulo: '',
                    fechaInicio: '',
                    fechaCierre: '',
                    notaMaxima: 100,
                    tipo: 'NORMAL',
                    estado: 'ACTIVO',
                    parcialId: '',
                    periodoId: '',
                    claseId: '',
                    seccionId: '',
                    descripcion: '',
                })
            }
            setErrors({})
        }
    }, [open, evaluacion])
    
    // Filtrar parciales según el periodo seleccionado
    const parcialesFiltrados = formData.periodoId 
        ? parciales.filter(parcial => parcial.periodoId === parseInt(formData.periodoId))
        : parciales
    
    // Filtrar secciones según la clase seleccionada
    const seccionesFiltradas = formData.claseId
        ? secciones.filter(seccion => seccion.claseId === parseInt(formData.claseId))
        : secciones

    const handleChange = (e) => {
        const { name, value } = e.target
        const updates = { [name]: value }
        
        // Si cambia el periodo, limpiar el parcial seleccionado
        if (name === 'periodoId') {
            updates.parcialId = ''
        }
        
        // Si cambia la clase, limpiar la sección seleccionada
        if (name === 'claseId') {
            updates.seccionId = ''
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

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            const data = {
                titulo: formData.titulo,
                fechaInicio: new Date(formData.fechaInicio).toISOString(),
                fechaCierre: new Date(formData.fechaCierre).toISOString(),
                notaMaxima: parseFloat(formData.notaMaxima),
                peso: 1, // Peso fijo en 1 para análisis posteriores
                tipo: formData.tipo,
                estado: formData.estado,
                parcialId: parseInt(formData.parcialId),
                periodoId: parseInt(formData.periodoId),
                claseId: formData.claseId ? parseInt(formData.claseId) : null,
                seccionId: formData.seccionId ? parseInt(formData.seccionId) : null,
                estructura: {
                    descripcion: formData.descripcion || ''
                },
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

                        <Grid item xs={12} sm={6}>
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

                        <Grid item xs={12} sm={6}>
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

                        <Grid item xs={12}>
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

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Clase (Opcional)"
                                name="claseId"
                                value={formData.claseId}
                                onChange={handleChange}
                                helperText="Seleccione una clase si desea asignar la evaluación"
                            >
                                <MenuItem value="">Ninguna</MenuItem>
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
                                label="Sección (Opcional)"
                                name="seccionId"
                                value={formData.seccionId}
                                onChange={handleChange}
                                helperText={formData.claseId ? "Seleccione una sección" : "Primero seleccione una clase"}
                                disabled={!formData.claseId}
                            >
                                <MenuItem value="">Ninguna</MenuItem>
                                {Array.isArray(seccionesFiltradas) && seccionesFiltradas.map((seccion) => (
                                    <MenuItem key={seccion.id} value={seccion.id}>
                                        {seccion.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descripción o Instrucciones"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Ej: Investigación sobre node.js, incluir ejemplos de código"
                                helperText="Describa brevemente el contenido o instrucciones de la evaluación"
                                multiline
                                rows={3}
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
