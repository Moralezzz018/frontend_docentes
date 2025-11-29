import { Box, Typography, Paper } from '@mui/material';
import NotificacionesPanel from '@componentes/notificaciones/NotificacionesPanel';

const Notificaciones = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    📧 Panel de Notificaciones
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Monitorea el estado de las notificaciones por correo electrónico enviadas automáticamente
                    cuando se editan o eliminan evaluaciones y se registran asistencias.
                </Typography>
            </Paper>

            <NotificacionesPanel />
        </Box>
    );
};

export default Notificaciones;
