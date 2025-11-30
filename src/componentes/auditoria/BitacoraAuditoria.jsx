import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { auditoriaService } from '../../servicios/auditoriaService';
import { EstadoContenido, MensajeError } from '../common';

const BitacoraAuditoria = () => {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [detalleLog, setDetalleLog] = useState(null);
    const [dialogDetalle, setDialogDetalle] = useState(false);

    // Filtros
    const [filtros, setFiltros] = useState({
        accion: '',
        entidad: '',
        resultado: '',
        fechaInicio: '',
        fechaFin: ''
    });

    useEffect(() => {
        cargarLogs();
    }, [page, rowsPerPage]);

    const cargarLogs = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await auditoriaService.listarLogs({
                ...filtros,
                page: page + 1,
                limit: rowsPerPage
            });
            setLogs(data.logs);
            setTotal(data.total);
        } catch (err) {
            setError(err.error || 'Error al cargar logs');
        } finally {
            setCargando(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    const aplicarFiltros = () => {
        setPage(0);
        cargarLogs();
    };

    const limpiarFiltros = () => {
        setFiltros({
            accion: '',
            entidad: '',
            resultado: '',
            fechaInicio: '',
            fechaFin: ''
        });
        setPage(0);
        setTimeout(() => cargarLogs(), 100);
    };

    const verDetalle = async (logId) => {
        try {
            const detalle = await auditoriaService.obtenerDetalle(logId);
            setDetalleLog(detalle);
            setDialogDetalle(true);
        } catch (err) {
            console.error('Error al cargar detalle:', err);
        }
    };

    const getChipResultado = (resultado) => {
        return resultado === 'EXITOSO' 
            ? <Chip label="Exitoso" color="success" size="small" />
            : <Chip label="Fallido" color="error" size="small" />;
    };

    const getChipAccion = (accion) => {
        const colores = {
            'LOGIN': 'primary',
            'LOGIN_FALLIDO': 'error',
            'LOGOUT': 'default',
            'CREAR': 'success',
            'EDITAR': 'warning',
            'ELIMINAR': 'error',
            'LIMPIAR_LOGS': 'secondary'
        };
        return <Chip label={accion.replace('_', ' ')} color={colores[accion] || 'default'} size="small" />;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2">
                        Bitácora de Auditoría
                    </Typography>
                    <Box>
                        <Tooltip title="Actualizar">
                            <IconButton onClick={cargarLogs} color="primary">
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}>
                            <IconButton onClick={() => setMostrarFiltros(!mostrarFiltros)} color="primary">
                                <FilterIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {mostrarFiltros && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: '#0d47a1', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel 
                                        sx={{ 
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            '&.Mui-focused': { color: 'white' },
                                            '&.MuiInputLabel-shrink': { color: 'rgba(255, 255, 255, 0.9)' }
                                        }}
                                    >
                                        Acción
                                    </InputLabel>
                                    <Select
                                        value={filtros.accion}
                                        label="Acción"
                                        onChange={(e) => handleFiltroChange('accion', e.target.value)}
                                        sx={{ 
                                            bgcolor: '#42a5f5',
                                            borderRadius: 1,
                                            color: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                            '& .MuiSelect-icon': { color: 'white' },
                                            '& .MuiSelect-select': { color: 'white' }
                                        }}
                                    >
                                        <MenuItem value="">Todas</MenuItem>
                                        <MenuItem value="LOGIN">LOGIN</MenuItem>
                                        <MenuItem value="LOGIN_FALLIDO">LOGIN FALLIDO</MenuItem>
                                        <MenuItem value="LOGOUT">LOGOUT</MenuItem>
                                        <MenuItem value="CREAR">CREAR</MenuItem>
                                        <MenuItem value="EDITAR">EDITAR</MenuItem>
                                        <MenuItem value="ELIMINAR">ELIMINAR</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel 
                                        sx={{ 
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            '&.Mui-focused': { color: 'white' },
                                            '&.MuiInputLabel-shrink': { color: 'rgba(255, 255, 255, 0.9)' }
                                        }}
                                    >
                                        Resultado
                                    </InputLabel>
                                    <Select
                                        value={filtros.resultado}
                                        label="Resultado"
                                        onChange={(e) => handleFiltroChange('resultado', e.target.value)}
                                        sx={{ 
                                            bgcolor: '#42a5f5',
                                            borderRadius: 1,
                                            color: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                            '& .MuiSelect-icon': { color: 'white' },
                                            '& .MuiSelect-select': { color: 'white' }
                                        }}
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        <MenuItem value="EXITOSO">Exitoso</MenuItem>
                                        <MenuItem value="FALLIDO">Fallido</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Fecha Inicio"
                                    value={filtros.fechaInicio}
                                    onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                                    InputLabelProps={{ 
                                        shrink: true,
                                        sx: { 
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            '&.Mui-focused': { color: 'white' }
                                        }
                                    }}
                                    sx={{
                                        bgcolor: '#42a5f5',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'white' }
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                            '&::placeholder': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                opacity: 1
                                            }
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'white'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Fecha Fin"
                                    value={filtros.fechaFin}
                                    onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                                    InputLabelProps={{ 
                                        shrink: true,
                                        sx: { 
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            '&.Mui-focused': { color: 'white' }
                                        }
                                    }}
                                    sx={{
                                        bgcolor: '#42a5f5',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'white' }
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                            '&::placeholder': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                opacity: 1
                                            }
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'white'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" onClick={limpiarFiltros}>
                                        Limpiar
                                    </Button>
                                    <Button variant="contained" onClick={aplicarFiltros}>
                                        Aplicar Filtros
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                <EstadoContenido
                    cargando={cargando}
                    error={error}
                    datos={logs}
                    tipoCarga="tabla"
                    tipoVacio="datos"
                    filas={rowsPerPage}
                >
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Usuario</TableCell>
                                    <TableCell>Acción</TableCell>
                                    <TableCell>Entidad</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>IP</TableCell>
                                    <TableCell>Resultado</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id} hover>
                                        <TableCell>
                                            {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                                        </TableCell>
                                        <TableCell>
                                            {log.usuario?.login || 'Sistema'}
                                        </TableCell>
                                        <TableCell>{getChipAccion(log.accion)}</TableCell>
                                        <TableCell>{log.entidad || '-'}</TableCell>
                                        <TableCell>
                                            <Tooltip title={log.descripcion || ''}>
                                                <span>
                                                    {log.descripcion?.substring(0, 50)}
                                                    {log.descripcion?.length > 50 ? '...' : ''}
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{log.ip || '-'}</TableCell>
                                        <TableCell>{getChipResultado(log.resultado)}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Ver detalle">
                                                <IconButton size="small" onClick={() => verDetalle(log.id)}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    />
                </EstadoContenido>
            </Paper>

            {/* Dialog de Detalle */}
            <Dialog
                open={dialogDetalle}
                onClose={() => setDialogDetalle(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Detalle del Log</DialogTitle>
                <DialogContent dividers>
                    {detalleLog && (
                        <Box sx={{ '& > *': { mb: 2 } }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Fecha y Hora
                                </Typography>
                                <Typography>
                                    {format(new Date(detalleLog.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Usuario
                                </Typography>
                                <Typography>
                                    {detalleLog.usuario?.login || 'Sistema'} ({detalleLog.usuario?.correo})
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Rol
                                </Typography>
                                <Typography>
                                    {detalleLog.usuario?.rol?.nombre || 'N/A'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Acción
                                </Typography>
                                {getChipAccion(detalleLog.accion)}
                            </Box>
                            {detalleLog.entidad && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Entidad / ID
                                    </Typography>
                                    <Typography>
                                        {detalleLog.entidad} {detalleLog.entidadId && `#${detalleLog.entidadId}`}
                                    </Typography>
                                </Box>
                            )}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Descripción
                                </Typography>
                                <Typography>{detalleLog.descripcion || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Dirección IP
                                </Typography>
                                <Typography>{detalleLog.ip || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    User Agent
                                </Typography>
                                <Typography sx={{ wordBreak: 'break-all', fontSize: '0.875rem' }}>
                                    {detalleLog.userAgent || '-'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Resultado
                                </Typography>
                                {getChipResultado(detalleLog.resultado)}
                            </Box>
                            {detalleLog.mensajeError && (
                                <Box>
                                    <Typography variant="subtitle2" color="error">
                                        Mensaje de Error
                                    </Typography>
                                    <Typography color="error">{detalleLog.mensajeError}</Typography>
                                </Box>
                            )}
                            {detalleLog.datosAnteriores && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Datos Anteriores
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50' }}>
                                        <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto' }}>
                                            {JSON.stringify(detalleLog.datosAnteriores, null, 2)}
                                        </pre>
                                    </Paper>
                                </Box>
                            )}
                            {detalleLog.datosNuevos && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Datos Nuevos
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50' }}>
                                        <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto' }}>
                                            {JSON.stringify(detalleLog.datosNuevos, null, 2)}
                                        </pre>
                                    </Paper>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogDetalle(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BitacoraAuditoria;
