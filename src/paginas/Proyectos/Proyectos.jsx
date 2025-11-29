import { useState, useEffect } from 'react'
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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import LoadingSpinner from '@componentes/common/LoadingSpinner'
import ErrorMessage from '@componentes/common/ErrorMessage'
import ConfirmDialog from '@componentes/common/ConfirmDialog'
import ProyectoDialog from '@componentes/Proyectos/ProyectoDialog'
import { proyectosService } from '@servicios/proyectosService'
import { clasesService } from '@servicios/catalogosService'
import { estudiantesService } from '@servicios/estudiantesService'

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([])
  const [clases, setClases] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedProyecto, setSelectedProyecto] = useState(null)
  const [proyectoToDelete, setProyectoToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorDialogData, setErrorDialogData] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const cargarDatos = async () => {
    try {
      setLoading(true)
      setError(null)
      const [proyectosData, clasesData] = await Promise.allSettled([
        proyectosService.listar(),
        clasesService.listar(),
      ])

      if (proyectosData.status === 'fulfilled' && Array.isArray(proyectosData.value)) {
        setProyectos(proyectosData.value)
      } else {
        console.error('Error cargando proyectos:', proyectosData.reason)
        setProyectos([])
      }

      if (clasesData.status === 'fulfilled' && Array.isArray(clasesData.value)) {
        setClases(clasesData.value)
      } else {
        console.error('Error cargando clases:', clasesData.reason)
        setClases([])
      }

      // Cargar estudiantes (para asignarlos a proyectos)
      try {
        const est = await estudiantesService.listar()
        setEstudiantes(Array.isArray(est) ? est : [])
      } catch (e) {
        console.error('Error cargando estudiantes:', e)
        setEstudiantes([])
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err.response?.data?.error || err.message || 'Error al cargar los proyectos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleOpenDialog = (proyecto = null) => {
    setSelectedProyecto(proyecto)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedProyecto(null)
    setDialogOpen(false)
  }

  const handleSave = async (data) => {
    console.log('Proyectos: enviando payload ->', JSON.stringify(data))
    try {
      if (selectedProyecto) {
        await proyectosService.editar(selectedProyecto.id, data)
        setSnackbar({ open: true, message: 'Proyecto actualizado exitosamente', severity: 'success' })
        // Si se solicitó asignación aleatoria al actualizar
        if (data.asignacionAleatoria && (data.cantidadAleatoria || 0) > 0) {
          try {
            await proyectosService.asignarAleatorio(selectedProyecto.id, data.cantidadAleatoria)
          } catch (e) {
            console.error('Error asignando aleatorio después de editar:', e)
          }
        }
      } else {
        const saved = await proyectosService.guardar(data)
        setSnackbar({ open: true, message: 'Proyecto creado exitosamente', severity: 'success' })
        // Si guardamos y se pidió asignación aleatoria, llamar al endpoint
        if (data.asignacionAleatoria && (data.cantidadAleatoria || 0) > 0) {
          try {
            const proyectoId = saved?.proyecto?.id || saved?.id
            if (proyectoId) await proyectosService.asignarAleatorio(proyectoId, data.cantidadAleatoria)
          } catch (e) {
            console.error('Error asignando aleatorio después de crear:', e)
          }
        }
      }
      handleCloseDialog()
      cargarDatos()
    } catch (err) {
      console.error('Error al guardar completo:', err)
      // Mostrar información más completa si está disponible
      const status = err.response?.status
      const respData = err.response?.data
      console.error('Respuesta del servidor:', status, respData)
      const errorMsg =
        respData?.error || respData?.mensaje || (status ? `Error ${status} al guardar` : err.message) || 'Error al guardar el proyecto'
      setSnackbar({ open: true, message: errorMsg, severity: 'error' })
      // Abrir dialog con detalle completo para debugging
      setErrorDialogData({ status, respData, payload: data })
      setErrorDialogOpen(true)
    }
  }

  const handleDeleteClick = (proyecto) => {
    setProyectoToDelete(proyecto)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await proyectosService.eliminar(proyectoToDelete.id)
      setSnackbar({ open: true, message: 'Proyecto eliminado exitosamente', severity: 'success' })
      setConfirmOpen(false)
      setProyectoToDelete(null)
      cargarDatos()
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Error al eliminar el proyecto', severity: 'error' })
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  const truncate = (text, len = 80) => {
    if (!text) return ''
    return text.length > len ? text.slice(0, len) + '...' : text
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Proyectos</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={cargarDatos}>Actualizar</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Nuevo Proyecto</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha entrega</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proyectos && proyectos.length > 0 ? (
              proyectos.map((p) => (
                <>
                  <TableRow key={p.id}>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{truncate(p.descripcion)}</TableCell>
                    <TableCell>{p.fecha_entrega ? p.fecha_entrega.split('T')[0] : '-'}</TableCell>
                    <TableCell>{p.estado || '-'}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                        {expandedId === p.id ? <CloseOutlinedIcon /> : <InfoOutlinedIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(p)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(p)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {expandedId === p.id && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <strong>Clase:</strong>{' '}
                        {(() => {
                          const clase = clases.find((c) => c.id === p.claseId)
                          return clase ? `${clase.codigo ? `${clase.codigo} - ` : ''}${clase.nombre}` : '-'
                        })()}
                        <div style={{ marginTop: 8 }}>
                          <strong>Estudiantes:</strong>
                          {p.estudiantes && p.estudiantes.length > 0 ? (
                            <ul style={{ margin: '6px 0 0 16px' }}>
                              {p.estudiantes.map((s, idx) => {
                                const id = typeof s === 'object' ? (s.id || s) : s
                                const stud = estudiantes.find((e) => e.id === id)
                                const label = stud ? `${stud.nombres || stud.nombre || ''} ${stud.apellidos || stud.apellido || ''}`.trim() : (typeof s === 'object' ? (s.nombres || s.nombre || String(s.id || '')) : String(s))
                                return <li key={idx}>{label}</li>
                              })}
                            </ul>
                          ) : (
                            <span> Ninguno</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No hay proyectos registrados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ProyectoDialog open={dialogOpen} onClose={handleCloseDialog} onSave={handleSave} proyecto={selectedProyecto} clases={clases} estudiantes={estudiantes} />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Proyecto"
        message={`¿Está seguro que desea eliminar el proyecto "${proyectoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Error al guardar (detalles)</DialogTitle>
        <DialogContent dividers>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(errorDialogData, null, 2)}
          </pre>
        </DialogContent>
        <DialogActions>
          <Tooltip title="Copiar detalles">
            <IconButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(JSON.stringify(errorDialogData, null, 2))
                } catch (e) {
                  console.error('Error copiando al portapapeles:', e)
                }
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Button onClick={() => setErrorDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Proyectos

