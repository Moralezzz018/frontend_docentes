import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Slider,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Paper,
    Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PercentIcon from '@mui/icons-material/Percent';
import { estructuraCalificacionService } from '@servicios/estructuraCalificacionService';
import { periodosService, parcialesService, clasesService } from '@servicios/catalogosService';

/**
 * Dialog para configurar la estructura de calificación por parcial y clase
 * Permite definir los pesos de acumulativo, examen y reposición
 */
const ConfiguracionEstructuraDialog = ({ 
    open, 
    onClose, 
    parcialId: parcialIdProp, 
    claseId: claseIdProp, 
    docenteId,
    estructuraExistente = null,
    onGuardado 
}) => {
    const [estructura, setEstructura] = useState({
        pesoAcumulativo: 60,
        pesoExamen: 40,
        pesoReposicion: 0,
        notaMaximaParcial: 100,
        notaMinimaAprobacion: 70,
        observaciones: '',
    });
    const [estructuraId, setEstructuraId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Estados para los catálogos
    const [periodos, setPeriodos] = useState([]);
    const [parciales, setParciales] = useState([]);
    const [clases, setClases] = useState([]);
    
    // Estados para los valores seleccionados
    const [periodoId, setPeriodoId] = useState('');
    const [parcialId, setParcialId] = useState('');
    const [claseId, setClaseId] = useState('');

    useEffect(() => {
        if (open) {
            cargarCatalogos();
            
            if (estructuraExistente) {
                // Modo edición: cargar datos de la estructura existente
                setEstructuraId(estructuraExistente.id);
                setParcialId(estructuraExistente.parcialId || '');
                setClaseId(estructuraExistente.claseId || '');
                setEstructura({
                    pesoAcumulativo: parseFloat(estructuraExistente.pesoAcumulativo || 60),
                    pesoExamen: parseFloat(estructuraExistente.pesoExamen || 40),
                    pesoReposicion: parseFloat(estructuraExistente.pesoReposicion || 0),
                    notaMaximaParcial: parseFloat(estructuraExistente.notaMaximaParcial || 100),
                    notaMinimaAprobacion: parseFloat(estructuraExistente.notaMinimaAprobacion || 60),
                    observaciones: estructuraExistente.observaciones || '',
                });
            } else {
                // Modo creación: usar valores de props si existen
                setParcialId(parcialIdProp || '');
                setClaseId(claseIdProp || '');
                resetEstructura();
            }
        }
    }, [open, estructuraExistente, parcialIdProp, claseIdProp]);

    const cargarCatalogos = async () => {
        try {
            setLoading(true);
            const [periodosData, parcialesData, clasesData] = await Promise.allSettled([
                periodosService.listar(),
                parcialesService.listar(),
                clasesService.listar(),
            ]);

            if (periodosData.status === 'fulfilled' && Array.isArray(periodosData.value)) {
                setPeriodos(periodosData.value);
            }
            if (parcialesData.status === 'fulfilled' && Array.isArray(parcialesData.value)) {
                setParciales(parcialesData.value);
            }
            if (clasesData.status === 'fulfilled' && Array.isArray(clasesData.value)) {
                setClases(clasesData.value);
            }
        } catch (err) {
            console.error('Error al cargar catálogos:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetEstructura = () => {
        setEstructuraId(null);
        setEstructura({
            pesoAcumulativo: 60,
            pesoExamen: 40,
            pesoReposicion: 0,
            notaMaximaParcial: 100,
            notaMinimaAprobacion: 70,
            observaciones: '',
        });
    };

    // Efecto para verificar si ya existe estructura cuando cambian parcial o clase
    useEffect(() => {
        if (parcialId && claseId && !estructuraExistente) {
            cargarEstructura();
        }
    }, [parcialId, claseId]);

    const cargarEstructura = async () => {
        if (!parcialId || !claseId) return;
        
        try {
            const data = await estructuraCalificacionService.obtenerPorParcialYClase(parcialId, claseId);
            
            if (data && data.id) {
                // Estructura existente encontrada
                setEstructuraId(data.id);
                setEstructura({
                    pesoAcumulativo: parseFloat(data.pesoAcumulativo || 60),
                    pesoExamen: parseFloat(data.pesoExamen || 40),
                    pesoReposicion: parseFloat(data.pesoReposicion || 0),
                    notaMaximaParcial: parseFloat(data.notaMaximaParcial || 100),
                    notaMinimaAprobacion: parseFloat(data.notaMinimaAprobacion || 60),
                    observaciones: data.observaciones || '',
                });
                setError('Ya existe una estructura para este Parcial y Clase. Los datos se han cargado para editar.');
            } else {
                // Sin estructura, usar valores por defecto
                resetEstructura();
            }
        } catch (err) {
            console.error('Error al cargar estructura:', err);
            // No es error crítico si no existe, usar valores por defecto
            resetEstructura();
        }
    };

    const handleSliderChange = (field) => (event, newValue) => {
        setEstructura(prev => ({
            ...prev,
            [field]: newValue,
        }));
    };

    const handleTextFieldChange = (field) => (event) => {
        const value = event.target.value === '' ? 0 : parseFloat(event.target.value);
        if (!isNaN(value)) {
            setEstructura(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const calcularTotal = () => {
        return estructura.pesoAcumulativo + estructura.pesoExamen + estructura.pesoReposicion;
    };

    const esValido = () => {
        const total = calcularTotal();
        return Math.abs(total - 100) < 0.01;
    };

    const handleGuardar = async () => {
        if (!esValido()) {
            setError('La suma de los porcentajes debe ser 100%');
            return;
        }

        if (!parcialId || !claseId) {
            setError('Debe seleccionar un Parcial y una Clase');
            return;
        }

        try {
            setGuardando(true);
            setError(null);

            const datos = {
                parcialId,
                claseId,
                docenteId,
                pesoAcumulativo: estructura.pesoAcumulativo,
                pesoExamen: estructura.pesoExamen,
                pesoReposicion: estructura.pesoReposicion,
                notaMaximaParcial: estructura.notaMaximaParcial,
                notaMinimaAprobacion: estructura.notaMinimaAprobacion,
                observaciones: estructura.observaciones,
                estado: 'ACTIVO',
            };

            let resultado;
            if (estructuraId) {
                // Editar existente
                resultado = await estructuraCalificacionService.editar(estructuraId, datos);
                setSuccess('✅ Estructura de calificación actualizada correctamente');
            } else {
                // Crear nueva
                resultado = await estructuraCalificacionService.guardar(datos);
                setSuccess('✅ Estructura de calificación guardada correctamente');
            }

            setTimeout(() => {
                if (onGuardado) onGuardado(resultado);
                onClose();
            }, 1500);

        } catch (err) {
            console.error('Error al guardar estructura:', err);
            setError(err.response?.data?.message || 'Error al guardar la estructura de calificación');
        } finally {
            setGuardando(false);
        }
    };

    const total = calcularTotal();
    const valido = esValido();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <PercentIcon />
                    <Typography variant="h6">
                        Configurar Estructura de Calificación
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ pt: 2 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                                {success}
                            </Alert>
                        )}

                        {/* Selectores de Período, Parcial y Clase */}
                        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                                📋 Seleccione el Período, Parcial y Clase
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small" disabled={!!estructuraExistente}>
                                        <InputLabel>Período</InputLabel>
                                        <Select
                                            value={periodoId}
                                            onChange={(e) => {
                                                setPeriodoId(e.target.value);
                                                setParcialId(''); // Reset parcial cuando cambia período
                                            }}
                                            label="Período"
                                            sx={{ 
                                                bgcolor: 'white',
                                                '& .MuiSelect-select': { py: 1 }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione un período</em>
                                            </MenuItem>
                                            {periodos.map((periodo) => (
                                                <MenuItem key={periodo.id} value={periodo.id}>
                                                    {periodo.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small" disabled={!!estructuraExistente || !periodoId}>
                                        <InputLabel>Parcial</InputLabel>
                                        <Select
                                            value={parcialId}
                                            onChange={(e) => setParcialId(e.target.value)}
                                            label="Parcial"
                                            sx={{ 
                                                bgcolor: 'white',
                                                '& .MuiSelect-select': { py: 1 }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione un parcial</em>
                                            </MenuItem>
                                            {parciales
                                                .filter(p => p.periodoId === periodoId)
                                                .map((parcial) => (
                                                    <MenuItem key={parcial.id} value={parcial.id}>
                                                        {parcial.nombre}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small" disabled={!!estructuraExistente}>
                                        <InputLabel>Clase</InputLabel>
                                        <Select
                                            value={claseId}
                                            onChange={(e) => setClaseId(e.target.value)}
                                            label="Clase"
                                            sx={{ 
                                                bgcolor: 'white',
                                                '& .MuiSelect-select': { py: 1 }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione una clase</em>
                                            </MenuItem>
                                            {clases.map((clase) => (
                                                <MenuItem key={clase.id} value={clase.id}>
                                                    {clase.codigo} - {clase.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {estructuraExistente && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Modo edición: No puede cambiar el Período, Parcial o Clase de una estructura existente.
                                </Alert>
                            )}
                        </Paper>

                        <Typography variant="body2" sx={{ mb: 3, color: '#424242', fontWeight: 500 }}>
                            Defina la distribución de pesos para las calificaciones. La suma debe ser 100%.
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Peso Acumulativo */}
                            <Grid item xs={12}>
                                <Paper elevation={1} sx={{ p: 2 }}>
                                    <Typography gutterBottom fontWeight="bold">
                                        Acumulativo (Evaluaciones Regulares)
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <Slider
                                            value={estructura.pesoAcumulativo}
                                            onChange={handleSliderChange('pesoAcumulativo')}
                                            min={0}
                                            max={100}
                                            step={1}
                                            marks={[
                                                { value: 0, label: '0%' },
                                                { value: 50, label: '50%' },
                                                { value: 100, label: '100%' },
                                            ]}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => `${value}%`}
                                        />
                                    </Box>
                                    <TextField
                                        type="number"
                                        value={estructura.pesoAcumulativo}
                                        onChange={handleTextFieldChange('pesoAcumulativo')}
                                        size="small"
                                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                                        sx={{ mt: 1, width: 120 }}
                                        label="Porcentaje"
                                    />
                                </Paper>
                            </Grid>

                            {/* Peso Examen */}
                            <Grid item xs={12}>
                                <Paper elevation={1} sx={{ p: 2 }}>
                                    <Typography gutterBottom fontWeight="bold">
                                        Examen
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <Slider
                                            value={estructura.pesoExamen}
                                            onChange={handleSliderChange('pesoExamen')}
                                            min={0}
                                            max={100}
                                            step={1}
                                            marks={[
                                                { value: 0, label: '0%' },
                                                { value: 50, label: '50%' },
                                                { value: 100, label: '100%' },
                                            ]}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => `${value}%`}
                                        />
                                    </Box>
                                    <TextField
                                        type="number"
                                        value={estructura.pesoExamen}
                                        onChange={handleTextFieldChange('pesoExamen')}
                                        size="small"
                                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                                        sx={{ mt: 1, width: 120 }}
                                        label="Porcentaje"
                                    />
                                </Paper>
                            </Grid>

                            {/* Peso Reposición */}
                            <Grid item xs={12}>
                                <Paper elevation={1} sx={{ p: 2 }}>
                                    <Typography gutterBottom fontWeight="bold">
                                        Reposición (Opcional)
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <Slider
                                            value={estructura.pesoReposicion}
                                            onChange={handleSliderChange('pesoReposicion')}
                                            min={0}
                                            max={100}
                                            step={1}
                                            marks={[
                                                { value: 0, label: '0%' },
                                                { value: 50, label: '50%' },
                                                { value: 100, label: '100%' },
                                            ]}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => `${value}%`}
                                        />
                                    </Box>
                                    <TextField
                                        type="number"
                                        value={estructura.pesoReposicion}
                                        onChange={handleTextFieldChange('pesoReposicion')}
                                        size="small"
                                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                                        sx={{ mt: 1, width: 120 }}
                                        label="Porcentaje"
                                    />
                                </Paper>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Resumen de totales */}
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 2, 
                                mb: 2,
                                bgcolor: valido ? 'success.light' : 'error.light',
                                color: valido ? 'success.contrastText' : 'error.contrastText',
                            }}
                        >
                            <Typography variant="h6" align="center">
                                Total: {total.toFixed(2)}%
                            </Typography>
                            <Typography variant="body2" align="center">
                                {valido ? '✓ Suma válida (100%)' : `✗ Debe sumar 100% (Falta/Sobra: ${(100 - total).toFixed(2)}%)`}
                            </Typography>
                        </Paper>

                        {/* Configuraciones adicionales */}
                        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: 'rgba(33, 150, 243, 0.08)' }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                ⚙️ Configuración de Notas
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Nota Máxima del Parcial"
                                        type="number"
                                        value={estructura.notaMaximaParcial}
                                        onChange={handleTextFieldChange('notaMaximaParcial')}
                                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                                        helperText="Normalmente 100 puntos"
                                        sx={{ 
                                            bgcolor: 'background.paper'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Nota Mínima de Aprobación"
                                        type="number"
                                        value={estructura.notaMinimaAprobacion}
                                        onChange={handleTextFieldChange('notaMinimaAprobacion')}
                                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                                        helperText="Con cuánto se pasa la clase"
                                        sx={{ 
                                            bgcolor: 'background.paper'
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Nota de Aprobación:</strong> Define el puntaje mínimo que un estudiante debe alcanzar para aprobar el parcial. 
                                    Por ejemplo: Si configuras 70, el estudiante debe obtener al menos 70 puntos de {estructura.notaMaximaParcial} para aprobar.
                                </Typography>
                            </Alert>
                        </Paper>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Observaciones (Opcional)"
                                    multiline
                                    rows={2}
                                    value={estructura.observaciones}
                                    onChange={(e) => setEstructura(prev => ({ ...prev, observaciones: e.target.value }))}
                                    placeholder="Notas adicionales sobre esta configuración..."
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={guardando}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleGuardar}
                    variant="contained"
                    startIcon={guardando ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={!valido || guardando || loading || !parcialId || !claseId}
                >
                    {guardando ? 'Guardando...' : estructuraId ? 'Actualizar' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfiguracionEstructuraDialog;
