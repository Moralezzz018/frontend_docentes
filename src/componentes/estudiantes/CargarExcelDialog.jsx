import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box, Typography, Alert } from '@mui/material'
import { useState, useEffect } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const CargarExcelDialog = ({ open, onClose, onUpload, aulas = [] }) => {
    const [file, setFile] = useState(null)
    const [creditos, setCreditos] = useState('')
    const [aulaId, setAulaId] = useState('')
    const [error, setError] = useState('')
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (!open) {
            // Reset form when dialog closes
            setFile(null)
            setCreditos('')
            setAulaId('')
            setError('')
            setUploading(false)
        }
    }, [open])

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            // Validar extensión
            const validExtensions = ['.xlsx', '.xls']
            const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
            
            if (!validExtensions.includes(fileExtension)) {
                setError('Por favor selecciona un archivo Excel válido (.xlsx o .xls)')
                setFile(null)
                return
            }

            // Validar tamaño (máximo 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('El archivo no puede superar los 5MB')
                setFile(null)
                return
            }

            setFile(selectedFile)
            setError('')
        }
    }

    const handleSubmit = async () => {
        // Validaciones
        if (!file) {
            setError('Debes seleccionar un archivo')
            return
        }

        if (!aulaId) {
            setError('Debes seleccionar un aula')
            return
        }

        if (creditos && ![3, 4].includes(parseInt(creditos))) {
            setError('Los créditos deben ser 3 o 4')
            return
        }

        setUploading(true)
        setError('')

        try {
            await onUpload(file, creditos, aulaId)
            onClose()
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar el archivo')
        } finally {
            setUploading(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cargar Estudiantes desde Excel</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        El archivo Excel debe tener el siguiente formato:
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ ml: 2, mt: 1 }}>
                        • <strong>B1:</strong> Código de clase<br />
                        • <strong>B2:</strong> Nombre de clase (requerido)<br />
                        • <strong>B3:</strong> Nombre de sección<br />
                        • <strong>B4:</strong> Fecha inicio (opcional)<br />
                        • <strong>B5:</strong> Fecha fin (opcional)<br />
                        • <strong>Desde fila 8:</strong> Cuenta, Nombre, Correo (columnas B, C, D)
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                >
                    {file ? file.name : 'Seleccionar archivo Excel'}
                    <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                    />
                </Button>

                <TextField
                    margin="dense"
                    label="Aula"
                    select
                    fullWidth
                    value={aulaId}
                    onChange={(e) => setAulaId(e.target.value)}
                    required
                    helperText="Aula donde se impartirá la clase"
                >
                    <MenuItem value="">Selecciona un aula</MenuItem>
                    {aulas.map((aula) => (
                        <MenuItem key={aula.id} value={aula.id}>
                            {aula.nombre} (Capacidad: {aula.capacidad})
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    margin="dense"
                    label="Créditos (opcional)"
                    select
                    fullWidth
                    value={creditos}
                    onChange={(e) => setCreditos(e.target.value)}
                    helperText="Créditos de la clase (3 o 4). Se usa para asignar días automáticamente"
                >
                    <MenuItem value="">Sin especificar</MenuItem>
                    <MenuItem value="3">3 créditos</MenuItem>
                    <MenuItem value="4">4 créditos</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={uploading}>
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    color="primary"
                    disabled={uploading || !file || !aulaId}
                >
                    {uploading ? 'Cargando...' : 'Cargar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CargarExcelDialog
