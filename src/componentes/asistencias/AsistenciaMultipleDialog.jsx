import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Box,
    Typography,
    Paper,
    Alert,
    Chip,
    Stack,
} from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ProgressIndicator from '@componentes/common/ProgressIndicator'

const AsistenciaMultipleDialog = ({ 
    open, 
    onClose, 
    onSave, 
    clases = [],
    estudiantes = [] 
}) => {
    const [formData, setFormData] = useState({
        claseId: '',
        fecha: '',
    })
    const [errors, setErrors] = useState({})
    const [periodoCalculado, setPeriodoCalculado] = useState('Se calculará automáticamente')
    const [parcialCalculado, setParcialCalculado] = useState('Se calculará automáticamente')
    const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([])
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [progressMessage, setProgressMessage] = useState('')
    const [completed, setCompleted] = useState(false)

    // Al abrir el diálogo, establecer fecha actual
    useEffect(() => {
        if (open) {
            const now = new Date()
            // Ajustar al timezone local para evitar desfase de fechas
            const offsetMs = now.getTimezoneOffset() * 60000
            const fechaLocal = new Date(now.getTime() - offsetMs)
            const fechaActual = fechaLocal.toISOString().substring(0, 16)
            
            setFormData({
                claseId: '',
                fecha: fechaActual,
            })
            setErrors({})
            setPeriodoCalculado('Se calculará automáticamente')
            setParcialCalculado('Se calculará automáticamente')
            setEstudiantesFiltrados([])
        }
    }, [open])

    // Filtrar estudiantes cuando se selecciona una clase
    useEffect(() => {
        if (formData.claseId) {
            const estudiantesDeClase = estudiantes.filter(estudiante => {
                if (!estudiante.inscripciones || !Array.isArray(estudiante.inscripciones)) {
                    return false
                }
                
                return estudiante.inscripciones.some(inscripcion => {
                    const claseIdInscripcion = inscripcion.clase?.id
                    return claseIdInscripcion === parseInt(formData.claseId)
                })
            })
            setEstudiantesFiltrados(estudiantesDeClase)
        } else {
            setEstudiantesFiltrados([])
        }
    }, [formData.claseId, estudiantes])

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

        if (!formData.claseId) {
            newErrors.claseId = 'Seleccione una clase'
        }

        if (!formData.fecha) {
            newErrors.fecha = 'La fecha es obligatoria'
        }

        if (estudiantesFiltrados.length === 0 && formData.claseId) {
            newErrors.claseId = 'No hay estudiantes matriculados en esta clase'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true)
            setProgress(0)
            setCompleted(false)
            setProgressMessage('Preparando datos...')

            // Simular progreso
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev
                    return prev + 15
                })
            }, 400)

            try {
                const data = {
                    claseId: parseInt(formData.claseId),
                    fecha: new Date(formData.fecha).toISOString(),
                    estadoPredeterminado: 'PRESENTE',
                }
                
                setProgressMessage(`Registrando asistencia de ${estudiantesFiltrados.length} estudiantes...`)
                await new Promise(resolve => setTimeout(resolve, 500))
                
                setProgressMessage('Guardando en base de datos...')
                await onSave(data)
                
                clearInterval(progressInterval)
                setProgress(100)
                setProgressMessage('¡Asistencias registradas exitosamente!')
                setCompleted(true)
                
                // Cerrar después de 2 segundos
                setTimeout(() => {
                    setLoading(false)
                    setProgress(0)
                    setCompleted(false)
                }, 2000)
            } catch (error) {
                clearInterval(progressInterval)
                setLoading(false)
                setProgress(0)
                setProgressMessage('')
            }
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <GroupAddIcon color="primary" />
                    <Typography variant="h6">Registrar Asistencia Múltiple</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Esta opción marcará como <strong>PRESENTE</strong> a todos los estudiantes matriculados en la clase seleccionada.
                    </Alert>

                    <ProgressIndicator
                        loading={loading && !completed}
                        progress={progress}
                        message={progressMessage}
                        completed={completed}
                        variant="both"
                    />

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Clase"
                                name="claseId"
                                value={formData.claseId}
                                onChange={handleChange}
                                error={!!errors.claseId}
                                helperText={errors.claseId || "Seleccione la clase para registrar asistencia"}
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
                                label="Periodo"
                                value={periodoCalculado}
                                disabled
                                helperText="Se calcula automáticamente según la fecha"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Parcial"
                                value={parcialCalculado}
                                disabled
                                helperText="Se calcula automáticamente según la fecha"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fecha y Hora"
                                name="fecha"
                                type="datetime-local"
                                value={formData.fecha}
                                onChange={handleChange}
                                error={!!errors.fecha}
                                helperText={errors.fecha || "Fecha y hora automática del sistema"}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        {/* Mostrar lista de estudiantes que se marcarán como presentes */}
                        {formData.claseId && estudiantesFiltrados.length > 0 && (
                            <Grid item xs={12}>
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 2, 
                                        backgroundColor: 'success.lighter',
                                        border: '1px solid',
                                        borderColor: 'success.main',
                                        borderRadius: 2
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <CheckCircleIcon color="success" />
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Estudiantes que se marcarán como PRESENTE
                                        </Typography>
                                        <Chip 
                                            label={`${estudiantesFiltrados.length} estudiantes`}
                                            color="success" 
                                            size="small"
                                        />
                                    </Box>
                                    
                                    <Stack 
                                        spacing={1} 
                                        sx={{ 
                                            maxHeight: '300px', 
                                            overflowY: 'auto',
                                            pr: 1
                                        }}
                                    >
                                        {estudiantesFiltrados.map((estudiante, index) => (
                                            <Paper 
                                                key={estudiante.id} 
                                                elevation={1}
                                                sx={{ 
                                                    p: 1.5, 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    backgroundColor: 'background.paper'
                                                }}
                                            >
                                                <Chip 
                                                    label={index + 1} 
                                                    size="small" 
                                                    color="primary"
                                                    sx={{ minWidth: 35 }}
                                                />
                                                <Box flexGrow={1}>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {estudiante.nombre}
                                                    </Typography>
                                                    {estudiante.correo && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {estudiante.correo}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Chip 
                                                    label="PRESENTE" 
                                                    color="success" 
                                                    size="small"
                                                    icon={<CheckCircleIcon />}
                                                />
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Grid>
                        )}

                        {formData.claseId && estudiantesFiltrados.length === 0 && (
                            <Grid item xs={12}>
                                <Alert severity="warning">
                                    No hay estudiantes matriculados en esta clase.
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    color="success"
                    startIcon={<GroupAddIcon />}
                    disabled={estudiantesFiltrados.length === 0 || loading}
                >
                    {loading ? 'Registrando...' : `Marcar Todos como Presente (${estudiantesFiltrados.length})`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AsistenciaMultipleDialog
