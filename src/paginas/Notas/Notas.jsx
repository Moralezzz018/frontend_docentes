import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { notasService } from '@servicios/notasService';
import { clasesService, periodosService, parcialesService } from '@servicios/catalogosService';
import { useAuthStore } from '@almacen/authStore'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Notas = () => {
  const { usuario } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Filtros
  const [clases, setClases] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [parciales, setParciales] = useState([])
  const [parcialesFiltrados, setParcialesFiltrados] = useState([])
  const [selectedClase, setSelectedClase] = useState('')
  const [selectedPeriodo, setSelectedPeriodo] = useState('')
  const [selectedParcial, setSelectedParcial] = useState('')

  // Datos
  const [notasData, setNotasData] = useState(null)

  // Cargar catálogos iniciales
  useEffect(() => {
    cargarCatalogos()
  }, [])

  const cargarCatalogos = async () => {
    try {
      const [clasesRes, periodosRes, parcialesRes] = await Promise.all([
        clasesService.listar(),
        periodosService.listar(),
        parcialesService.listar(),
      ])
      setClases(Array.isArray(clasesRes) ? clasesRes : [])
      setPeriodos(Array.isArray(periodosRes) ? periodosRes : [])
      setParciales(Array.isArray(parcialesRes) ? parcialesRes : [])
    } catch (err) {
      console.error('Error cargando catálogos:', err)
      setError('Error al cargar catálogos')
    }
  }

  // Filtrar parciales cuando se selecciona periodo
  useEffect(() => {
    if (selectedPeriodo) {
      const parcialesPorPeriodo = parciales.filter(
        parcial => parcial.periodoId === parseInt(selectedPeriodo)
      )
      setParcialesFiltrados(parcialesPorPeriodo)
      
      // Si el parcial seleccionado no pertenece al periodo, limpiarlo
      if (selectedParcial) {
        const parcialValido = parcialesPorPeriodo.find(
          p => p.id === parseInt(selectedParcial)
        )
        if (!parcialValido) {
          setSelectedParcial('')
        }
      }
    } else {
      setParcialesFiltrados([])
      setSelectedParcial('')
    }
  }, [selectedPeriodo, parciales])

  // Cargar notas
  const cargarNotas = async () => {
    if (!selectedClase || !selectedPeriodo) {
      setError('Seleccione clase y periodo')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = {
        claseId: selectedClase,
        periodoId: selectedPeriodo,
      }

      if (selectedParcial) {
        params.parcialId = selectedParcial
      }

      const data = await notasService.obtenerNotas(params)
      setNotasData(data)
    } catch (err) {
      console.error('Error cargando notas:', err)
      setError(err.response?.data?.error || 'Error al cargar notas')
      setNotasData(null)
    } finally {
      setLoading(false)
    }
  }

  // Exportar a Excel
  const exportarExcel = () => {
    if (!notasData || !notasData.estudiantes || notasData.estudiantes.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    const datos = []

    // Encabezado
    const encabezado = ['N°', 'Nombre']
    notasData.parciales.forEach(parcial => {
      encabezado.push(`${parcial.nombre} - Acumulativo`)
      encabezado.push(`${parcial.nombre} - Examen`)
      encabezado.push(`${parcial.nombre} - Reposición`)
      encabezado.push(`${parcial.nombre} - Total`)
    })
    datos.push(encabezado)

    // Filas de estudiantes
    notasData.estudiantes.forEach((estudiante, index) => {
      const fila = [
        index + 1,
        estudiante.nombre,
      ]

      estudiante.parciales.forEach(parcial => {
        fila.push(parcial.acumulativo)
        fila.push(parcial.examen)
        fila.push(parcial.reposicion || '-')
        fila.push(parcial.total)
      })

      datos.push(fila)
    })

    const ws = XLSX.utils.aoa_to_sheet(datos)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Notas')

    const nombreArchivo = `Notas_${notasData.clase.codigo}_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, nombreArchivo)
  }

  // Exportar a PDF
  const exportarPDF = () => {
    if (!notasData || !notasData.estudiantes || notasData.estudiantes.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    const doc = new jsPDF('landscape')

    // Título
    doc.setFontSize(16)
    doc.text(`Notas - ${notasData.clase.nombre}`, 14, 15)
    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 22)

    // Tabla
    const encabezado = [['N°', 'Nombre']]
    const columnasExtra = []
    
    notasData.parciales.forEach(parcial => {
      columnasExtra.push(`${parcial.nombre}\nAcum`)
      columnasExtra.push(`${parcial.nombre}\nExam`)
      columnasExtra.push(`${parcial.nombre}\nRepo`)
      columnasExtra.push(`${parcial.nombre}\nTotal`)
    })
    
    encabezado[0] = encabezado[0].concat(columnasExtra)

    const filas = notasData.estudiantes.map((estudiante, index) => {
      const fila = [
        index + 1,
        estudiante.nombre,
      ]

      estudiante.parciales.forEach(parcial => {
        fila.push(parcial.acumulativo)
        fila.push(parcial.examen)
        fila.push(parcial.reposicion || '-')
        fila.push(parcial.total)
      })

      return fila
    })

    doc.autoTable({
      head: encabezado,
      body: filas,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [63, 81, 181] },
    })

    const nombreArchivo = `Notas_${notasData.clase.codigo}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(nombreArchivo)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          📊 Gestión de Notas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Consulta las calificaciones de los estudiantes por clase, periodo y parcial
        </Typography>
      </Paper>

      {/* Filtros */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros de Búsqueda
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Clase"
              value={selectedClase}
              onChange={(e) => setSelectedClase(e.target.value)}
              required
            >
              <MenuItem value="">Seleccione una clase</MenuItem>
              {clases.map((clase) => (
                <MenuItem key={clase.id} value={clase.id}>
                  {clase.codigo} - {clase.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Periodo"
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
              required
            >
              <MenuItem value="">Seleccione un periodo</MenuItem>
              {periodos.map((periodo) => (
                <MenuItem key={periodo.id} value={periodo.id}>
                  {periodo.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Parcial (Opcional)"
              value={selectedParcial}
              onChange={(e) => setSelectedParcial(e.target.value)}
              disabled={!selectedPeriodo || parcialesFiltrados.length === 0}
              helperText={!selectedPeriodo ? 'Primero seleccione un periodo' : 'Dejar vacío para ver todos'}
            >
              <MenuItem value="">Todos los parciales</MenuItem>
              {parcialesFiltrados.map((parcial) => (
                <MenuItem key={parcial.id} value={parcial.id}>
                  {parcial.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={cargarNotas}
                disabled={!selectedClase || !selectedPeriodo || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              >
                {loading ? 'Cargando...' : 'Consultar Notas'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Errores */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabla de Notas */}
      {notasData && notasData.estudiantes && notasData.estudiantes.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              📋 Calificaciones - {notasData.clase.nombre}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Exportar a Excel">
                <IconButton color="success" onClick={exportarExcel}>
                  <ExcelIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exportar a PDF">
                <IconButton color="error" onClick={exportarPDF}>
                  <PdfIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>N°</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>Nombre</TableCell>
                  
                  {notasData.parciales.map((parcial) => (
                    <TableCell
                      key={parcial.id}
                      colSpan={4}
                      align="center"
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'white' }}
                    >
                      {parcial.nombre}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} />
                  {notasData.parciales.map((parcial) => (
                    <>
                      <TableCell key={`${parcial.id}-acum`} align="center" sx={{ bgcolor: 'info.light' }}>Acum</TableCell>
                      <TableCell key={`${parcial.id}-exam`} align="center" sx={{ bgcolor: 'warning.light' }}>Exam</TableCell>
                      <TableCell key={`${parcial.id}-repo`} align="center" sx={{ bgcolor: 'error.light' }}>Repo</TableCell>
                      <TableCell key={`${parcial.id}-total`} align="center" sx={{ bgcolor: 'success.light', fontWeight: 'bold' }}>Total</TableCell>
                    </>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {notasData.estudiantes.map((estudiante, index) => (
                  <TableRow key={estudiante.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{estudiante.nombre}</TableCell>
                    
                    {estudiante.parciales.map((parcial) => (
                      <>
                        <TableCell key={`${estudiante.id}-${parcial.parcialId}-acum`} align="center">
                          {parcial.acumulativo}
                        </TableCell>
                        <TableCell key={`${estudiante.id}-${parcial.parcialId}-exam`} align="center">
                          {parcial.examen}
                        </TableCell>
                        <TableCell key={`${estudiante.id}-${parcial.parcialId}-repo`} align="center">
                          {parcial.reposicion !== null ? (
                            <Chip label={parcial.reposicion} size="small" color="error" />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell key={`${estudiante.id}-${parcial.parcialId}-total`} align="center" sx={{ fontWeight: 'bold' }}>
                          {parcial.total}
                        </TableCell>
                      </>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total de estudiantes: {notasData.estudiantes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Parciales mostrados: {notasData.parciales.length}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Sin datos */}
      {notasData && notasData.estudiantes && notasData.estudiantes.length === 0 && (
        <Alert severity="info">
          No se encontraron estudiantes con notas para los filtros seleccionados
        </Alert>
      )}
    </Box>
  )
}

export default Notas
