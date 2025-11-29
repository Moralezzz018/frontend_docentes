import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'

const estados = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EN_PROGRESO', label: 'En progreso' },
  { value: 'COMPLETO', label: 'Completo' },
]

const ProyectoDialog = ({ open, onClose, onSave, proyecto, clases = [] }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaEntrega: '',
    estado: 'PENDIENTE',
    claseId: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (proyecto) {
      setFormData({
        nombre: proyecto.nombre || '',
        descripcion: proyecto.descripcion || '',
        fechaEntrega: proyecto.fechaEntrega ? proyecto.fechaEntrega.split('T')[0] : '',
        estado: proyecto.estado || 'PENDIENTE',
        claseId: proyecto.claseId || '',
      })
    } else {
      setFormData({ nombre: '', descripcion: '', fechaEntrega: '', estado: 'PENDIENTE', claseId: '' })
    }
    setErrors({})
  }, [proyecto, open])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (formData.nombre.length > 100) newErrors.nombre = 'Máximo 100 caracteres'
    if (formData.descripcion.length > 1000) newErrors.descripcion = 'Máximo 1000 caracteres'
    if (!formData.claseId) newErrors.claseId = 'La clase es obligatoria'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    const dataToSave = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fechaEntrega: formData.fechaEntrega ? `${formData.fechaEntrega}T00:00:00` : '',
      estado: formData.estado,
      claseId: formData.claseId ? parseInt(formData.claseId) : null,
    }
    onSave(dataToSave)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{proyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.nombre}
          helperText={errors.nombre || 'Título del proyecto'}
          inputProps={{ maxLength: 100 }}
        />

        <TextField
          margin="normal"
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          error={!!errors.descripcion}
          helperText={errors.descripcion || 'Descripción breve del proyecto'}
          inputProps={{ maxLength: 1000 }}
        />

        <TextField
          margin="normal"
          label="Fecha de entrega"
          name="fechaEntrega"
          type="date"
          value={formData.fechaEntrega}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            {estados.map((e) => (
              <MenuItem key={e.value} value={e.value}>
                {e.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          label="Clase"
          name="claseId"
          value={formData.claseId}
          onChange={handleChange}
          fullWidth
          select
          required
          error={!!errors.claseId}
          helperText={errors.claseId || 'Seleccione la clase a la que pertenece el proyecto'}
        >
          <MenuItem value="">Seleccione una clase</MenuItem>
          {clases && clases.length > 0 ? (
            clases.map((clase) => (
              <MenuItem key={clase.id} value={clase.id}>
                {clase.codigo ? `${clase.codigo} - ${clase.nombre}` : clase.nombre}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay clases disponibles</MenuItem>
          )}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {proyecto ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProyectoDialog
