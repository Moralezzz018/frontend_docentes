import { useState } from 'react'
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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { formatDateTime } from '@utilidades/dateUtils'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import { useFetch } from '@ganchos/useFetch'
import { evaluacionesService } from '@servicios/evaluacionesService'

const Evaluaciones = () => {
    const { data: evaluaciones, loading, error, refetch } = useFetch(
        () => evaluacionesService.listar(),
        []
    )

    const getTipoChip = (tipo) => {
        const colors = {
            NORMAL: 'primary',
            REPOSICION: 'warning',
            EXAMEN: 'error',
        }
        return <Chip label={tipo} color={colors[tipo] || 'default'} size="small" />
    }

    const getEstadoChip = (estado) => {
        return (
            <Chip
                label={estado}
                color={estado === 'ACTIVO' ? 'success' : 'default'}
                size="small"
            />
        )
    }

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage error={error} />

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Evaluaciones</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => console.log('Crear evaluación')}
                >
                    Nueva Evaluación
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Fecha Inicio</TableCell>
                            <TableCell>Fecha Cierre</TableCell>
                            <TableCell>Nota Máxima</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluaciones && evaluaciones.length > 0 ? (
                            evaluaciones.map((evaluacion) => (
                                <TableRow key={evaluacion.id}>
                                    <TableCell>{evaluacion.titulo}</TableCell>
                                    <TableCell>{getTipoChip(evaluacion.tipo)}</TableCell>
                                    <TableCell>{formatDateTime(evaluacion.fechaInicio)}</TableCell>
                                    <TableCell>{formatDateTime(evaluacion.fechaCierre)}</TableCell>
                                    <TableCell>{evaluacion.notaMaxima}</TableCell>
                                    <TableCell>{getEstadoChip(evaluacion.estado)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small" color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="info">
                                            <AssignmentIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay evaluaciones registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Evaluaciones
