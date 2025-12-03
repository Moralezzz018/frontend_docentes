import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Grid,
    TextField,
    MenuItem,
    Snackbar,
    Alert,
    Card,
    CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import PercentIcon from '@mui/icons-material/Percent';
import LoadingSpinner from '@componentes/common/LoadingSpinner';
import ErrorMessage from '@componentes/common/ErrorMessage';
import ConfirmDialog from '@componentes/common/ConfirmDialog';
import ConfiguracionEstructuraDialog from '@componentes/evaluaciones/ConfiguracionEstructuraDialog';
import { estructuraCalificacionService } from '@servicios/estructuraCalificacionService';
import { periodosService, parcialesService, clasesService } from '@servicios/catalogosService';
import { useAuthStore } from '@almacen/authStore';

const EstructuraCalificacion = () => {
    const user = useAuthStore((state) => state.user);
    const esEstudiante = user?.rol?.nombre === 'ESTUDIANTE';
    const esDocente = user?.rol?.nombre === 'DOCENTE';
    const esAdmin = user?.rol?.nombre === 'ADMIN';

    const [estructuras, setEstructuras] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [parciales, setParciales] = useState([]);
    const [clases, setClases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedEstructura, setSelectedEstructura] = useState(null);
    const [estructuraToDelete, setEstructuraToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Filtros
    const [filtros, setFiltros] = useState({
        periodoId: '',
        parcialId: '',
        claseId: '',
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            const [estructurasData, periodosData, parcialesData, clasesData] = await Promise.allSettled([
                estructuraCalificacionService.listar(filtros),
                periodosService.listar(),
                parcialesService.listar(),
                clasesService.listar(),
            ]);

            if (estructurasData.status === 'fulfilled' && Array.isArray(estructurasData.value)) {
                setEstructuras(estructurasData.value);
            } else {
                setEstructuras([]);
            }

            if (periodosData.status === 'fulfilled' && Array.isArray(periodosData.value)) {
                setPeriodos(periodosData.value);
            } else {
                setPeriodos([]);
            }

            if (parcialesData.status === 'fulfilled' && Array.isArray(parcialesData.value)) {
                setParciales(parcialesData.value);
            } else {
                setParciales([]);
            }

            if (clasesData.status === 'fulfilled' && Array.isArray(clasesData.value)) {
                setClases(clasesData.value);
            } else {
                setClases([]);
            }

            setLoading(false);
        } catch (err) {
            setError('Error al cargar datos');
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const aplicarFiltros = () => {
        cargarDatos();
    };

    const limpiarFiltros = () => {
        setFiltros({ periodoId: '', parcialId: '', claseId: '' });
        setTimeout(() => cargarDatos(), 100);
    };

    const handleOpenDialog = (estructura = null) => {
        if (estructura) {
            setSelectedEstructura(estructura);
        } else {
            setSelectedEstructura(null);
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedEstructura(null);
    };

    const handleGuardado = () => {
        setSnackbar({
            open: true,
            message: selectedEstructura ? 'Estructura actualizada exitosamente' : 'Estructura creada exitosamente',
            severity: 'success',
        });
        handleCloseDialog();
        cargarDatos();
    };

    const handleDeleteClick = (estructura) => {
        setEstructuraToDelete(estructura);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await estructuraCalificacionService.eliminar(estructuraToDelete.id);
            setSnackbar({
                open: true,
                message: 'Estructura eliminada exitosamente',
                severity: 'success',
            });
            setConfirmOpen(false);
            setEstructuraToDelete(null);
            cargarDatos();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.error || 'Error al eliminar estructura',
                severity: 'error',
            });
            setConfirmOpen(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getChipColor = (peso) => {
        if (peso >= 50) return 'error';
        if (peso >= 30) return 'warning';
        return 'info';
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={cargarDatos} />;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    <PercentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Estructura de Calificación
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={cargarDatos} color="primary" title="Actualizar">
                        <RefreshIcon />
                    </IconButton>
                    {!esEstudiante && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Nueva Estructura
                        </Button>
                    )}
                </Box>
            </Box>

            {esEstudiante && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Aquí puedes ver cómo se distribuyen las calificaciones de tus clases. La suma de los porcentajes siempre es 100%.
                </Alert>
            )}

            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Filtros
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            select
                            label="Periodo"
                            name="periodoId"
                            value={filtros.periodoId}
                            onChange={handleFiltroChange}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {periodos.map((periodo) => (
                                <MenuItem key={periodo.id} value={periodo.id}>
                                    {periodo.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            select
                            label="Parcial"
                            name="parcialId"
                            value={filtros.parcialId}
                            onChange={handleFiltroChange}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {parciales.map((parcial) => (
                                <MenuItem key={parcial.id} value={parcial.id}>
                                    {parcial.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            select
                            label="Clase"
                            name="claseId"
                            value={filtros.claseId}
                            onChange={handleFiltroChange}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {clases.map((clase) => (
                                <MenuItem key={clase.id} value={clase.id}>
                                    {clase.codigo} - {clase.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                            <Button variant="contained" onClick={aplicarFiltros} fullWidth>
                                Aplicar
                            </Button>
                            <Button variant="outlined" onClick={limpiarFiltros} fullWidth>
                                Limpiar
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla o Cards según el rol */}
            {estructuras.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        {esEstudiante
                            ? 'No hay estructuras de calificación configuradas para tus clases'
                            : 'No hay estructuras de calificación registradas. Crea una nueva.'}
                    </Typography>
                </Paper>
            ) : esEstudiante ? (
                // Vista de Cards para estudiantes
                <Grid container spacing={2}>
                    {estructuras.map((estructura) => (
                        <Grid item xs={12} md={6} key={estructura.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {estructura.clase?.codigo} - {estructura.clase?.nombre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {estructura.parcial?.nombre}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Acumulativo:</Typography>
                                            <Chip
                                                label={`${estructura.pesoAcumulativo}%`}
                                                color={getChipColor(estructura.pesoAcumulativo)}
                                                size="small"
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Examen:</Typography>
                                            <Chip
                                                label={`${estructura.pesoExamen}%`}
                                                color={getChipColor(estructura.pesoExamen)}
                                                size="small"
                                            />
                                        </Box>
                                        {estructura.pesoReposicion > 0 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">Reposición:</Typography>
                                                <Chip
                                                    label={`${estructura.pesoReposicion}%`}
                                                    color={getChipColor(estructura.pesoReposicion)}
                                                    size="small"
                                                />
                                            </Box>
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 2,
                                            pt: 2,
                                            borderTop: 1,
                                            borderColor: 'divider',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography variant="body2">Nota Máxima:</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {estructura.notaMaximaParcial} pts
                                        </Typography>
                                    </Box>

                                    {estructura.observaciones && (
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            {estructura.observaciones}
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                // Vista de Tabla para docentes y admin
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Parcial</TableCell>
                                <TableCell>Clase</TableCell>
                                {esAdmin && <TableCell>Docente</TableCell>}
                                <TableCell align="center">Acumulativo</TableCell>
                                <TableCell align="center">Examen</TableCell>
                                <TableCell align="center">Reposición</TableCell>
                                <TableCell align="center">Nota Máx</TableCell>
                                <TableCell align="center">Estado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estructuras.map((estructura) => (
                                <TableRow key={estructura.id}>
                                    <TableCell>{estructura.parcial?.nombre || '-'}</TableCell>
                                    <TableCell>
                                        {estructura.clase?.codigo} - {estructura.clase?.nombre}
                                    </TableCell>
                                    {esAdmin && <TableCell>{estructura.docente?.nombre || '-'}</TableCell>}
                                    <TableCell align="center">
                                        <Chip
                                            label={`${estructura.pesoAcumulativo}%`}
                                            color={getChipColor(estructura.pesoAcumulativo)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={`${estructura.pesoExamen}%`}
                                            color={getChipColor(estructura.pesoExamen)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={`${estructura.pesoReposicion || 0}%`}
                                            color={getChipColor(estructura.pesoReposicion || 0)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">{estructura.notaMaximaParcial}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={estructura.estado}
                                            color={estructura.estado === 'ACTIVO' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenDialog(estructura)}
                                            title="Editar"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(estructura)}
                                            title="Eliminar"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Diálogo de configuración */}
            {dialogOpen && (
                <ConfiguracionEstructuraDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    parcialId={selectedEstructura?.parcialId || filtros.parcialId || null}
                    claseId={selectedEstructura?.claseId || filtros.claseId || null}
                    docenteId={user?.docenteId || null}
                    estructuraExistente={selectedEstructura}
                    onGuardado={handleGuardado}
                />
            )}

            {/* Diálogo de confirmación */}
            <ConfirmDialog
                open={confirmOpen}
                title="Confirmar Eliminación"
                message={`¿Está seguro que desea eliminar la estructura de calificación de ${estructuraToDelete?.clase?.nombre}?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setEstructuraToDelete(null);
                }}
            />

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EstructuraCalificacion;
