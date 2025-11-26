import { Box, Typography, Button } from '@mui/material'

const EvaluacionesSimple = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">Evaluaciones - Modo Prueba</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Si ves este mensaje, el componente se está renderizando correctamente.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
                Botón de Prueba
            </Button>
        </Box>
    )
}

export default EvaluacionesSimple
