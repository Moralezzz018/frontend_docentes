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
    Alert,
    AlertTitle,
    Typography,
} from '@mui/material'
import { seccionesService } from '@servicios/catalogosService'
import { estructuraCalificacionService } from '@servicios/estructuraCalificacionService'

const TIPOS_EVALUACION = ['NORMAL', 'REPOSICION', 'EXAMEN']
const ESTADOS = ['ACTIVO', 'INACTIVO']

const EvaluacionDialog = ({ open, onClose, onSave, evaluacion = null, parciales = [], periodos = [], clases = [] }) => {
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
    const [seccionesFiltradas, setSeccionesFiltradas] = useState([])
    const [loadingSecciones, setLoadingSecciones] = useState(false)
    const [estructuraCalificacion, setEstructuraCalificacion] = useState(null)
    const [errorEstructura, setErrorEstructura] = useState(null)

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
    
    // Cargar secciones cuando se selecciona una clase
    useEffect(() => {
        const cargarSecciones = async () => {
            if (formData.claseId) {
                setLoadingSecciones(true)
                try {
                    const secciones = await seccionesService.listar({ claseId: formData.claseId })
                    setSeccionesFiltradas(Array.isArray(secciones) ? secciones : [])
                } catch (error) {
                    console.error('Error cargando secciones:', error)
                    setSeccionesFiltradas([])
                } finally {
                    setLoadingSecciones(false)
                }
            } else {
                setSeccionesFiltradas([])
            }
        }
        cargarSecciones()
    }, [formData.claseId])
    
    // Verificar estructura de calificación cuando se selecciona parcial y clase
    useEffect(() => {
        const verificarEstructura = async () => {
            if (formData.parcialId && formData.claseId) {
                try {
                    const estructura = await estructuraCalificacionService.obtenerPorParcialYClase(
                        formData.parcialId, 
                        formData.claseId
                    )
                    
                    if (estructura && estructura.id) {
                        setEstructuraCalificacion(estructura)
                        setErrorEstructura(null)
                    } else {
                        setEstructuraCalificacion(null)
                        setErrorEstructura('No existe estructura de calificación para este Parcial y Clase')
                    }
                } catch (error) {
                    console.error('Error verificando estructura:', error)
                    setEstructuraCalificacion(null)
                    setErrorEstructura('No existe estructura de calificación para este Parcial y Clase')
                }
            } else {
                setEstructuraCalificacion(null)
                setErrorEstructura(null)
            }
        }
        
        verificarEstructura()
    }, [formData.parcialId, formData.claseId])
    
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
                    {errorEstructura && formData.claseId && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            <AlertTitle>⚠️ Estructura de Calificación No Configurada</AlertTitle>
                            {errorEstructura}
                            <Box sx={{ mt: 1 }}>
                                Debe crear primero la estructura de calificación para este Parcial y Clase desde el módulo <strong>"Estructura Calificación"</strong>.
                            </Box>
                        </Alert>
                    )}
                    
                    {estructuraCalificacion && formData.claseId && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            <AlertTitle>✅ Estructura de Calificación Configurada</AlertTitle>
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Distribución de Pesos del Parcial:</strong>
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Box sx={{ 
                                        bgcolor: 'info.light', 
                                        color: 'info.contrastText', 
                                        px: 2, 
                                        py: 1, 
                                        borderRadius: 1 
                                    }}>
                                        <Typography variant="body2">
                                            <strong>Acumulativo:</strong> {estructuraCalificacion.pesoAcumulativo}%
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                            (Evaluaciones, tareas, proyectos, participación)
                                        </Typography>
                                    </Box>
                                    <Box sx={{ 
                                        bgcolor: 'warning.light', 
                                        color: 'warning.contrastText', 
                                        px: 2, 
                                        py: 1, 
                                        borderRadius: 1 
                                    }}>
                                        <Typography variant="body2">
                                            <strong>Examen:</strong> {estructuraCalificacion.pesoExamen}%
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                            (Examen final del parcial)
                                        </Typography>
                                    </Box>
                                    {estructuraCalificacion.pesoReposicion > 0 && (
                                        <Box sx={{ 
                                            bgcolor: 'error.light', 
                                            color: 'error.contrastText', 
                                            px: 2, 
                                            py: 1, 
                                            borderRadius: 1 
                                        }}>
                                            <Typography variant="body2">
                                                <strong>Reposición:</strong> {estructuraCalificacion.pesoReposicion}%
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                                (Examen de segunda oportunidad)
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                                <Typography variant="caption" sx={{ display: 'block', mt: 1.5, fontStyle: 'italic' }}>
                                    💡 Tip: Las evaluaciones tipo <strong>NORMAL</strong> cuentan para el <strong>Acumulativo</strong>.
                                    Selecciona tipo <strong>EXAMEN</strong> o <strong>REPOSICION</strong> según corresponda.
                                </Typography>
                            </Box>
                        </Alert>
                    )}

                    {!formData.claseId && formData.parcialId && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <AlertTitle>ℹ️ Evaluación sin Clase Específica</AlertTitle>
                            Esta evaluación no está asignada a una clase específica. No requiere estructura de calificación.
                            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                Útil para evaluaciones generales o plantillas que se asignarán posteriormente.
                            </Typography>
                        </Alert>
                    )}
                    
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
                                helperText={
                                    loadingSecciones 
                                        ? "Cargando secciones..." 
                                        : formData.claseId 
                                            ? `${seccionesFiltradas.length} sección(es) disponible(s)` 
                                            : "Primero seleccione una clase"
                                }
                                disabled={!formData.claseId || loadingSecciones}
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
                <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                    disabled={formData.claseId && !!errorEstructura}
                >
                    {evaluacion ? 'Guardar Cambios' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EvaluacionDialog
