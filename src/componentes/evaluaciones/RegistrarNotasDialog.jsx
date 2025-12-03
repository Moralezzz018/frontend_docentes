import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Typography,
    Box,
    Chip,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import RefreshIcon from '@mui/icons-material/Refresh';
import { evaluacionesService } from '@servicios/evaluacionesService';
import { estudiantesService } from '@servicios/estudiantesService';

/**
 * Dialog para registrar/editar notas de estudiantes en una evaluación
 */
const RegistrarNotasDialog = ({ open, onClose, evaluacion, onNotaGuardada }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [notas, setNotas] = useState({});
    const [guardando, setGuardando] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (open && evaluacion) {
            cargarEstudiantes();
        }
    }, [open, evaluacion]);

    const cargarEstudiantes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener estudiantes de la clase y sección de la evaluación
            const params = {
                claseId: evaluacion.claseId,
                seccionId: evaluacion.seccionId,
            };

            const data = await estudiantesService.listarPorClase(params);
            
            // Asegurar que data sea un array
            const estudiantesArray = Array.isArray(data) ? data : (data?.estudiantes || data?.data || []);
            
            // Si la evaluación tiene estudiantes asignados, usar esos datos
            if (evaluacion.estudiantes && Array.isArray(evaluacion.estudiantes) && evaluacion.estudiantes.length > 0) {
                const estudiantesConNotas = evaluacion.estudiantes.map(e => ({
                    ...e,
                    notaActual: e.EvaluacionesEstudiantes?.nota || null,
                    estadoNota: e.EvaluacionesEstudiantes?.estado || 'PENDIENTE',
                }));
                setEstudiantes(estudiantesConNotas);
                
                // Pre-llenar notas existentes
                const notasIniciales = {};
                estudiantesConNotas.forEach(e => {
                    if (e.notaActual !== null) {
                        notasIniciales[e.id] = e.notaActual;
                    }
                });
                setNotas(notasIniciales);
            } else {
                setEstudiantes(estudiantesArray);
            }
        } catch (err) {
            console.error('Error al cargar estudiantes:', err);
            setError(err.response?.data?.error || 'Error al cargar estudiantes');
            setEstudiantes([]); // Asegurar que siempre sea un array
        } finally {
            setLoading(false);
        }
    };

    const handleNotaChange = (estudianteId, valor) => {
        setNotas(prev => ({
            ...prev,
            [estudianteId]: valor,
        }));
    };

    const handleGuardarNota = async (estudiante) => {
        const nota = notas[estudiante.id];
        
        if (nota === undefined || nota === '') {
            setError('Debe ingresar una nota');
            return;
        }

        const notaNum = parseFloat(nota);
        
        // Validación de número válido
        if (isNaN(notaNum)) {
            setError('La nota debe ser un número válido');
            return;
        }

        // Validación de nota negativa
        if (notaNum < 0) {
            setError('La nota no puede ser negativa. Ingrese un valor entre 0 y ' + evaluacion.notaMaxima);
            return;
        }

        // Validación de nota máxima
        if (evaluacion.notaMaxima && notaNum > parseFloat(evaluacion.notaMaxima)) {
            setError(`La nota no puede ser mayor a ${evaluacion.notaMaxima}. Ingrese un valor entre 0 y ${evaluacion.notaMaxima}`);
            return;
        }

        try {
            setGuardando(prev => ({ ...prev, [estudiante.id]: true }));
            setError(null);

            await evaluacionesService.registrarNota(
                evaluacion.id,
                estudiante.id,
                evaluacion.claseId,
                evaluacion.seccionId,
                notaNum
            );

            // Actualizar estado local
            setEstudiantes(prev =>
                prev.map(e =>
                    e.id === estudiante.id
                        ? { ...e, notaActual: notaNum, estadoNota: 'CALIFICADO' }
                        : e
                )
            );

            setSuccess(`✅ Nota guardada para ${estudiante.nombre} ${estudiante.apellido}: ${notaNum}/${evaluacion.notaMaxima}`);
            
            if (onNotaGuardada) {
                onNotaGuardada();
            }

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error al guardar nota:', err);
            const errorMsg = err.response?.data?.msj || err.response?.data?.error || 'Error al guardar la nota';
            setError(`❌ ${errorMsg}`);
        } finally {
            setGuardando(prev => ({ ...prev, [estudiante.id]: false }));
        }
    };

    const handleGuardarTodas = async () => {
        const notasParaGuardar = Object.entries(notas).filter(([_, valor]) => valor !== '' && valor !== undefined);

        if (notasParaGuardar.length === 0) {
            setError('No hay notas para guardar');
            return;
        }

        // Validar todas las notas antes de guardar
        for (const [estudianteId, nota] of notasParaGuardar) {
            const notaNum = parseFloat(nota);
            if (isNaN(notaNum)) {
                setError(`La nota del estudiante ID ${estudianteId} no es válida`);
                return;
            }
            if (notaNum < 0) {
                setError(`La nota del estudiante ID ${estudianteId} no puede ser negativa`);
                return;
            }
            if (evaluacion.notaMaxima && notaNum > parseFloat(evaluacion.notaMaxima)) {
                setError(`La nota del estudiante ID ${estudianteId} no puede ser mayor a ${evaluacion.notaMaxima}`);
                return;
            }
        }

        setGuardando({ todas: true });
        setError(null);
        let errores = 0;
        let exitosos = 0;

        for (const [estudianteId, nota] of notasParaGuardar) {
            try {
                const notaNum = parseFloat(nota);

                await evaluacionesService.registrarNota(
                    evaluacion.id,
                    parseInt(estudianteId),
                    evaluacion.claseId,
                    evaluacion.seccionId,
                    notaNum
                );

                exitosos++;

                // Actualizar estado local
                setEstudiantes(prev =>
                    prev.map(e =>
                        e.id === parseInt(estudianteId)
                            ? { ...e, notaActual: notaNum, estadoNota: 'CALIFICADO' }
                            : e
                    )
                );
            } catch (err) {
                console.error(`Error al guardar nota del estudiante ${estudianteId}:`, err);
                errores++;
            }
        }

        setGuardando({ todas: false });
        
        if (errores === 0) {
            setSuccess(`🎉 ¡Excelente! Todas las notas han sido calificadas exitosamente (${exitosos} estudiantes)`);
        } else if (exitosos > 0) {
            setError(`⚠️ ${exitosos} notas guardadas correctamente, pero ${errores} fallaron`);
        } else {
            setError(`❌ No se pudo guardar ninguna nota. Por favor, intente nuevamente`);
        }

        if (onNotaGuardada) {
            onNotaGuardada();
        }

        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 5000);
    };

    const getEstadoChip = (estado) => {
        if (estado === 'CALIFICADO') {
            return <Chip icon={<CheckCircleIcon />} label="Calificado" color="success" size="small" />;
        }
        return <Chip icon={<PendingIcon />} label="Pendiente" color="warning" size="small" />;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">Registrar Notas</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {evaluacion?.titulo} - Nota Máxima: {evaluacion?.notaMaxima}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {evaluacion?.clase?.nombre} - {evaluacion?.seccion?.nombre}
                        </Typography>
                    </Box>
                    <Tooltip title="Recargar estudiantes">
                        <IconButton onClick={cargarEstudiantes} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : estudiantes.length === 0 ? (
                    <Alert severity="info">
                        No hay estudiantes inscritos en esta clase y sección
                    </Alert>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Carné</TableCell>
                                    <TableCell>Nombre Completo</TableCell>
                                    <TableCell>Correo</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                    <TableCell align="center">Nota</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(estudiantes) && estudiantes.length > 0 ? (
                                    estudiantes.map((estudiante) => (
                                        <TableRow key={estudiante.id}>
                                            <TableCell>{estudiante.carne || '-'}</TableCell>
                                            <TableCell>
                                                {estudiante.nombre} {estudiante.apellido}
                                            </TableCell>
                                            <TableCell>{estudiante.correo}</TableCell>
                                            <TableCell align="center">
                                                {getEstadoChip(estudiante.estadoNota)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={notas[estudiante.id] ?? estudiante.notaActual ?? ''}
                                                    onChange={(e) => handleNotaChange(estudiante.id, e.target.value)}
                                                    inputProps={{
                                                        min: 0,
                                                        max: evaluacion?.notaMaxima,
                                                        step: 0.01,
                                                    }}
                                                    sx={{ width: '100px' }}
                                                    placeholder={`0-${evaluacion?.notaMaxima}`}
                                                    error={
                                                        notas[estudiante.id] !== undefined && 
                                                        (parseFloat(notas[estudiante.id]) < 0 || 
                                                         parseFloat(notas[estudiante.id]) > parseFloat(evaluacion?.notaMaxima))
                                                    }
                                                    helperText={
                                                        notas[estudiante.id] !== undefined && 
                                                        parseFloat(notas[estudiante.id]) < 0 
                                                            ? 'No negativo' 
                                                            : notas[estudiante.id] !== undefined && 
                                                              parseFloat(notas[estudiante.id]) > parseFloat(evaluacion?.notaMaxima)
                                                            ? `Máx ${evaluacion?.notaMaxima}`
                                                            : ''
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleGuardarNota(estudiante)}
                                                    disabled={
                                                        guardando[estudiante.id] ||
                                                        notas[estudiante.id] === undefined ||
                                                        notas[estudiante.id] === ''
                                                    }
                                                    startIcon={
                                                        guardando[estudiante.id] ? (
                                                            <CircularProgress size={16} />
                                                        ) : (
                                                            <SaveIcon />
                                                        )
                                                    }
                                                >
                                                    Guardar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            {loading ? 'Cargando estudiantes...' : 'No hay estudiantes registrados'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        {Array.isArray(estudiantes) ? estudiantes.filter(e => e.estadoNota === 'CALIFICADO').length : 0} de {Array.isArray(estudiantes) ? estudiantes.length : 0} calificados
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={guardando.todas ? <CircularProgress size={16} /> : <SaveIcon />}
                        onClick={handleGuardarTodas}
                        disabled={guardando.todas || Object.keys(notas).length === 0 || loading}
                    >
                        Guardar Todas las Notas
                    </Button>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={guardando.todas}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegistrarNotasDialog;
