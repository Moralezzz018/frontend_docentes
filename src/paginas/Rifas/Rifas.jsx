import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CasinoIcon from '@mui/icons-material/Casino'
import DeleteIcon from '@mui/icons-material/Delete'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PeopleIcon from '@mui/icons-material/People'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import ConfirmDialog from '@componentes/common/ConfirmDialog'
import { gruposService } from '@servicios/gruposService'
import { clasesService } from '@servicios/catalogosService'
import { estudiantesService } from '@servicios/estudiantesService'
import { proyectosService } from '@servicios/proyectosService'

const Rifas = () => {
  const [clases, setClases] = useState([])
  const [claseSeleccionada, setClaseSeleccionada] = useState('')
  const [grupos, setGrupos] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [estudiantesClase, setEstudiantesClase] = useState([]) // Estudiantes de la clase seleccionada
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [asignarDialogOpen, setAsignarDialogOpen] = useState(false)
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null)
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([])

  // Cargar clases al montar el componente
  useEffect(() => {
    cargarClases()
  }, [])

  // Cargar grupos cuando se selecciona una clase
  useEffect(() => {
    if (claseSeleccionada) {
      cargarDatosClase()
    } else {
      setGrupos([])
      setEstudiantes([])
      setEstudiantesClase([])
      setProyectos([])
    }
  }, [claseSeleccionada])

  const cargarClases = async () => {
    try {
      const data = await clasesService.listar()
      setClases(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error cargando clases:', err)
      setSnackbar({ open: true, message: 'Error al cargar clases', severity: 'error' })
    }
  }

  const cargarDatosClase = async () => {
    try {
      setLoading(true)
      setError(null)

      // Cargar grupos, estudiantes de la clase y proyectos en paralelo
      const [gruposData, estudiantesClaseData, proyectosData] = await Promise.allSettled([
        gruposService.listarPorClase(claseSeleccionada),
        estudiantesService.obtenerPorClase(claseSeleccionada),
        proyectosService.listar(),
      ])

      if (gruposData.status === 'fulfilled') {
        setGrupos(gruposData.value?.grupos || [])
      } else {
        console.error('Error cargando grupos:', gruposData.reason)
        setGrupos([])
      }

      if (estudiantesClaseData.status === 'fulfilled') {
        // Usar los estudiantes de la clase específica
        const estudiantesData = estudiantesClaseData.value?.data || []
        setEstudiantesClase(Array.isArray(estudiantesData) ? estudiantesData : [])
      } else {
        console.error('Error cargando estudiantes de la clase:', estudiantesClaseData.reason)
        setEstudiantesClase([])
      }

      if (proyectosData.status === 'fulfilled') {
        // Filtrar proyectos de la clase seleccionada
        const todosProyectos = Array.isArray(proyectosData.value) ? proyectosData.value : []
        const proyectosClase = todosProyectos.filter(p => p.claseId === parseInt(claseSeleccionada))
        setProyectos(proyectosClase)
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleRifarProyectos = async () => {
    if (!claseSeleccionada) {
      setSnackbar({ open: true, message: 'Seleccione una clase primero', severity: 'warning' })
      return
    }

    if (proyectos.length === 0) {
      setSnackbar({ open: true, message: 'No hay proyectos en esta clase para rifar', severity: 'warning' })
      return
    }

    if (grupos.length > 0) {
      setSnackbar({ open: true, message: 'Ya existen grupos. Elimínelos primero si desea rifar nuevamente', severity: 'warning' })
      return
    }

    try {
      setLoading(true)
      const result = await gruposService.rifarProyectos(claseSeleccionada)
      setSnackbar({ 
        open: true, 
        message: `${result.totalGrupos} grupos creados exitosamente`, 
        severity: 'success' 
      })
      await cargarDatosClase()
    } catch (err) {
      console.error('Error rifando proyectos:', err)
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.error || 'Error al rifar proyectos', 
        severity: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarGrupos = async () => {
    try {
      setLoading(true)
      const result = await gruposService.eliminarPorClase(claseSeleccionada)
      setSnackbar({ 
        open: true, 
        message: `${result.totalEliminados} grupos eliminados exitosamente`, 
        severity: 'success' 
      })
      setConfirmDeleteOpen(false)
      await cargarDatosClase()
    } catch (err) {
      console.error('Error eliminando grupos:', err)
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.error || 'Error al eliminar grupos', 
        severity: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAsignarDialog = (grupo) => {
    setGrupoSeleccionado(grupo)
    // Pre-seleccionar estudiantes que ya están en el grupo
    const estudiantesGrupo = grupo.estudiantes?.map(e => e.id) || []
    setEstudiantesSeleccionados(estudiantesGrupo)
    setAsignarDialogOpen(true)
  }

  const handleAsignarEstudiantes = async () => {
    if (!grupoSeleccionado) return

    if (estudiantesSeleccionados.length === 0) {
      setSnackbar({ open: true, message: 'Seleccione al menos un estudiante', severity: 'warning' })
      return
    }

    try {
      setLoading(true)
      await gruposService.asignarEstudiantes(grupoSeleccionado.id, estudiantesSeleccionados)
      setSnackbar({ 
        open: true, 
        message: 'Estudiantes asignados exitosamente', 
        severity: 'success' 
      })
      setAsignarDialogOpen(false)
      setGrupoSeleccionado(null)
      setEstudiantesSeleccionados([])
      await cargarDatosClase()
    } catch (err) {
      console.error('Error asignando estudiantes:', err)
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.error || 'Error al asignar estudiantes', 
        severity: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Obtener estudiantes disponibles (inscritos en la clase y no asignados a otro grupo)
  const getEstudiantesDisponibles = () => {
    // Obtener estudiantes que ya están en otros grupos
    const estudiantesEnOtrosGrupos = new Set()
    
    grupos.forEach(g => {
      if (g.id !== grupoSeleccionado?.id && g.estudiantes) {
        g.estudiantes.forEach(e => estudiantesEnOtrosGrupos.add(e.id))
      }
    })

    // Filtrar estudiantes de la clase que no están en otros grupos
    return estudiantesClase.filter(e => 
      e.estado === 'ACTIVO' && !estudiantesEnOtrosGrupos.has(e.id)
    )
  }

  if (loading && !claseSeleccionada) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <CasinoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Rifas de Proyectos
        </Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => cargarDatosClase()}>
          Actualizar
        </Button>
      </Box>

      {/* Selector de clase */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Seleccionar Clase"
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(e.target.value)}
            >
              <MenuItem value="">Seleccione una clase</MenuItem>
              {clases.map((clase) => (
                <MenuItem key={clase.id} value={clase.id}>
                  {clase.codigo ? `${clase.codigo} - ${clase.nombre}` : clase.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CasinoIcon />}
                onClick={handleRifarProyectos}
                disabled={!claseSeleccionada || grupos.length > 0 || loading}
                fullWidth
              >
                Rifar Proyectos
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={!claseSeleccionada || grupos.length === 0 || loading}
              >
                Eliminar Grupos
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Información de la clase */}
        {claseSeleccionada && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<AssignmentIcon />} 
              label={`${proyectos.length} Proyectos`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              icon={<PeopleIcon />} 
              label={`${grupos.length} Grupos`} 
              color="secondary" 
              variant="outlined" 
            />
          </Box>
        )}
      </Paper>

      {/* Lista de grupos */}
      {claseSeleccionada && (
        <Box>
          {grupos.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No hay grupos creados para esta clase
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Haga clic en "Rifar Proyectos" para crear grupos automáticamente
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {grupos.map((grupo) => (
                <Grid item xs={12} md={6} lg={4} key={grupo.id}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {grupo.nombre}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      {/* Proyecto asignado */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          <AssignmentIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                          Proyecto:
                        </Typography>
                        <Typography variant="body2">
                          {grupo.proyecto?.nombre || 'Sin asignar'}
                        </Typography>
                        {grupo.proyecto?.descripcion && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            {grupo.proyecto.descripcion.substring(0, 60)}
                            {grupo.proyecto.descripcion.length > 60 ? '...' : ''}
                          </Typography>
                        )}
                      </Box>

                      {/* Estudiantes */}
                      <Box>
                        <Typography variant="subtitle2" color="secondary" gutterBottom>
                          <PeopleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                          Estudiantes ({grupo.estudiantes?.length || 0}):
                        </Typography>
                        
                        {grupo.estudiantes && grupo.estudiantes.length > 0 ? (
                          <List dense sx={{ maxHeight: 150, overflow: 'auto' }}>
                            {grupo.estudiantes.map((estudiante) => (
                              <ListItem key={estudiante.id} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={estudiante.nombre}
                                  secondary={estudiante.correo}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Sin estudiantes asignados
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<GroupAddIcon />}
                        onClick={() => handleOpenAsignarDialog(grupo)}
                      >
                        Asignar Estudiantes
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Diálogo para asignar estudiantes */}
      <Dialog 
        open={asignarDialogOpen} 
        onClose={() => setAsignarDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Asignar Estudiantes - {grupoSeleccionado?.nombre}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Proyecto: {grupoSeleccionado?.proyecto?.nombre}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Seleccione estudiantes:
            </Typography>
            
            <TextField
              select
              fullWidth
              label="Estudiantes"
              SelectProps={{
                multiple: true,
                value: estudiantesSeleccionados,
                onChange: (e) => setEstudiantesSeleccionados(e.target.value),
              }}
              helperText="Puede seleccionar múltiples estudiantes"
            >
              {getEstudiantesDisponibles().map((estudiante) => (
                <MenuItem key={estudiante.id} value={estudiante.id}>
                  {`${estudiante.nombres || estudiante.nombre || ''} ${estudiante.apellidos || estudiante.apellido || ''}`.trim()} - {estudiante.correo}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Estudiantes seleccionados: {estudiantesSeleccionados.length}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAsignarDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAsignarEstudiantes}
            disabled={loading}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleEliminarGrupos}
        title="Eliminar Todos los Grupos"
        message={`¿Está seguro que desea eliminar todos los grupos de esta clase? Se eliminarán ${grupos.length} grupos y todas sus asignaciones de estudiantes. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />

      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Rifas
