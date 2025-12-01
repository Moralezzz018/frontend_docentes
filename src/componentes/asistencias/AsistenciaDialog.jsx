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
    Box,
    Typography,
    Alert,
} from '@mui/material'
import { CloudUpload as CloudUploadIcon, Image as ImageIcon } from '@mui/icons-material'
import { useAuthStore } from '@almacen/authStore'

const ESTADOS = ['PRESENTE', 'AUSENTE', 'TARDANZA', 'EXCUSA']

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
        estudianteId: '',
        claseId: '',
        periodoId: '',
        parcialId: '',
        fecha: '',
        estado: 'PRESENTE',
        descripcion: '',
    })

    const [errors, setErrors] = useState({})
    const [imagenExcusa, setImagenExcusa] = useState(null)
    const [imagenExcusaPreview, setImagenExcusaPreview] = useState(null)
    
    // Actualizar formData cuando cambie asistencia o se abra el diálogo
    useEffect(() => {
        if (open) {
            if (asistencia) {
                setFormData({
                    estudianteId: asistencia.estudianteId || '',
                    claseId: asistencia.claseId || '',
                    periodoId: asistencia.periodoId || '',
                    parcialId: asistencia.parcialId || '',
                    fecha: asistencia.fecha ? new Date(asistencia.fecha).toISOString().substring(0, 16) : '',
                    estado: asistencia.estado || 'PRESENTE',
                    descripcion: asistencia.descripcion || '',
                })
                // Si tiene imágenes de excusa, mostrar la primera
                if (asistencia.imagenes && asistencia.imagenes.length > 0) {
                    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
                    const primeraImagen = asistencia.imagenes[0]
                    setImagenExcusaPreview(`${baseUrl}/img/asistencias/excusas/${primeraImagen.imagen}`)
                } else {
                    setImagenExcusa(null)
                    setImagenExcusaPreview(null)
                }
            } else {
                // Si es nuevo registro
                setFormData({
                    estudianteId: esEstudiante && user?.estudianteId ? user.estudianteId : '',
                    claseId: '',
                    periodoId: '',
                    parcialId: '',
                    fecha: '',
                    estado: 'PRESENTE',
                    descripcion: '',
                })
                setImagenExcusa(null)
                setImagenExcusaPreview(null)
            }
            setErrors({})
        }
    }, [open, asistencia, esEstudiante, user])

    // Filtrar parciales según el periodo seleccionado
    const parcialesFiltrados = formData.periodoId 
        ? parciales.filter(parcial => parcial.periodoId === parseInt(formData.periodoId))
        : parciales

    // Las clases ya vienen filtradas desde el padre (Asistencias.jsx)
    // Para estudiantes: solo sus clases inscritas
    // Para docentes: todas las clases
    const clasesFiltradas = clases

    // Filtrar estudiantes según la clase seleccionada (solo para docentes)
    const estudiantesFiltrados = formData.claseId 
        ? estudiantes.filter(estudiante => {
            // Verificar si el estudiante tiene inscripciones en la clase seleccionada
            if (!estudiante.inscripciones || !Array.isArray(estudiante.inscripciones)) {
                return false
            }
            
            return estudiante.inscripciones.some(inscripcion => {
                // La estructura del backend es: inscripcion.clase.id
                const claseIdInscripcion = inscripcion.clase?.id
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

        // Si cambia el estado y NO es EXCUSA, limpiar imagen
        if (name === 'estado' && value !== 'EXCUSA') {
            setImagenExcusa(null)
            setImagenExcusaPreview(null)
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

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, imagenExcusa: 'Solo se permiten archivos de imagen' }))
                return
            }
            
            // Validar tamaño (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, imagenExcusa: 'La imagen no debe superar los 5MB' }))
                return
            }

            setImagenExcusa(file)
            
            // Crear preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagenExcusaPreview(reader.result)
            }
            reader.readAsDataURL(file)
            
            // Limpiar error
            setErrors(prev => ({ ...prev, imagenExcusa: '' }))
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

        // Si el estado es EXCUSA y es nuevo registro, validar que haya imagen
        if (formData.estado === 'EXCUSA' && !imagenExcusa && !asistencia) {
            newErrors.imagenExcusa = 'Debe subir una imagen de excusa'
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
            
            // Si hay imagen de excusa, agregarla
            if (imagenExcusa) {
                data.imagenExcusa = imagenExcusa
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

                    {/* Campo de imagen de excusa - solo visible cuando estado es EXCUSA */}
                    {formData.estado === 'EXCUSA' && (
                        <Grid item xs={12}>
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Imagen de Excusa {!asistencia && <span style={{ color: 'red' }}>*</span>}
                                </Typography>
                                
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                >
                                    {imagenExcusa ? 'Cambiar Imagen' : 'Subir Imagen de Excusa'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>

                                {errors.imagenExcusa && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {errors.imagenExcusa}
                                    </Alert>
                                )}

                                {imagenExcusaPreview && (
                                    <Box sx={{ 
                                        border: '2px solid #e0e0e0', 
                                        borderRadius: 2, 
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <ImageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Vista previa de la imagen
                                        </Typography>
                                        <img 
                                            src={imagenExcusaPreview} 
                                            alt="Preview excusa" 
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '300px',
                                                borderRadius: '8px',
                                                objectFit: 'contain'
                                            }} 
                                        />
                                    </Box>
                                )}

                                <FormHelperText>
                                    Formatos permitidos: JPG, PNG, JPEG. Tamaño máximo: 5MB
                                </FormHelperText>
                            </Box>
                        </Grid>
                    )}
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
