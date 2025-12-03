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

/**
 * Dialog para configurar la estructura de calificación por parcial y clase
 * Permite definir los pesos de acumulativo, examen y reposición
 */
const ConfiguracionEstructuraDialog = ({ 
    open, 
    onClose, 
    parcialId, 
    claseId, 
    docenteId,
    estructuraExistente = null,
    onGuardado 
}) => {
    const [estructura, setEstructura] = useState({
        pesoAcumulativo: 60,
        pesoExamen: 40,
        pesoReposicion: 0,
        notaMaximaParcial: 100,
        notaMinimaAprobacion: 60,
        observaciones: '',
    });
    const [estructuraId, setEstructuraId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (open) {
            if (estructuraExistente) {
                // Modo edición: cargar datos de la estructura existente
                setEstructuraId(estructuraExistente.id);
                setEstructura({
                    pesoAcumulativo: parseFloat(estructuraExistente.pesoAcumulativo || 60),
                    pesoExamen: parseFloat(estructuraExistente.pesoExamen || 40),
                    pesoReposicion: parseFloat(estructuraExistente.pesoReposicion || 0),
                    notaMaximaParcial: parseFloat(estructuraExistente.notaMaximaParcial || 100),
                    notaMinimaAprobacion: parseFloat(estructuraExistente.notaMinimaAprobacion || 60),
                    observaciones: estructuraExistente.observaciones || '',
                });
            } else if (parcialId && claseId) {
                // Modo creación: intentar cargar si existe estructura para ese parcial/clase
                cargarEstructura();
            } else {
                // Valores por defecto
                resetEstructura();
            }
        }
    }, [open, estructuraExistente, parcialId, claseId]);

    const resetEstructura = () => {
        setEstructuraId(null);
        setEstructura({
            pesoAcumulativo: 60,
            pesoExamen: 40,
            pesoReposicion: 0,
            notaMaximaParcial: 100,
            notaMinimaAprobacion: 60,
            observaciones: '',
        });
    };

    const cargarEstructura = async () => {
        if (!parcialId || !claseId) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const data = await estructuraCalificacionService.obtenerPorParcialYClase(parcialId, claseId);
            
            if (data && data.id) {
                // Estructura existente
                setEstructuraId(data.id);
                setEstructura({
                    pesoAcumulativo: parseFloat(data.pesoAcumulativo || 60),
                    pesoExamen: parseFloat(data.pesoExamen || 40),
                    pesoReposicion: parseFloat(data.pesoReposicion || 0),
                    notaMaximaParcial: parseFloat(data.notaMaximaParcial || 100),
                    notaMinimaAprobacion: parseFloat(data.notaMinimaAprobacion || 60),
                    observaciones: data.observaciones || '',
                });
            } else {
                // Sin estructura, usar valores por defecto
                resetEstructura();
            }
        } catch (err) {
            console.error('Error al cargar estructura:', err);
            // No es error crítico si no existe, usar valores por defecto
            resetEstructura();
        } finally {
            setLoading(false);
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

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Nota Máxima del Parcial"
                                    type="number"
                                    value={estructura.notaMaximaParcial}
                                    onChange={handleTextFieldChange('notaMaximaParcial')}
                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                    helperText="Normalmente 100"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Nota Mínima de Aprobación"
                                    type="number"
                                    value={estructura.notaMinimaAprobacion}
                                    onChange={handleTextFieldChange('notaMinimaAprobacion')}
                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                    helperText="Normalmente 60"
                                />
                            </Grid>
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
                    disabled={!valido || guardando || loading}
                >
                    {guardando ? 'Guardando...' : estructuraId ? 'Actualizar' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfiguracionEstructuraDialog;
