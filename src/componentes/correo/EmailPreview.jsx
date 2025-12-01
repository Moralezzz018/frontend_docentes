import { useState } from 'react';
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material';
import { render } from '@react-email/render';
import RecuperacionPasswordEmail from './RecuperacionPassword';

/**
 * Componente para previsualizar plantillas de correo en desarrollo
 * Acceso: /preview-email (solo en desarrollo)
 */
const EmailPreview = () => {
    const [pin, setPin] = useState('144833');
    const [nombreUsuario, setNombreUsuario] = useState('Juan Pérez');
    const [html, setHtml] = useState('');

    const handleGenerar = async () => {
        const htmlContent = await render(
            <RecuperacionPasswordEmail pin={pin} nombreUsuario={nombreUsuario} />
        );
        setHtml(htmlContent);
    };

    const handleDescargar = () => {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'preview-correo.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                📧 Preview de Plantillas de Correo
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Recuperación de Contraseña
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        label="PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        inputProps={{ maxLength: 6 }}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Nombre Usuario"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        sx={{ flex: 2 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleGenerar}>
                        Generar Preview
                    </Button>
                    {html && (
                        <Button variant="outlined" onClick={handleDescargar}>
                            Descargar HTML
                        </Button>
                    )}
                </Box>
            </Paper>

            {html && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Preview
                    </Typography>
                    <Box
                        sx={{
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            overflow: 'auto',
                            maxHeight: '80vh',
                        }}
                    >
                        <iframe
                            srcDoc={html}
                            style={{
                                width: '100%',
                                height: '600px',
                                border: 'none',
                            }}
                            title="Email Preview"
                        />
                    </Box>
                </Paper>
            )}
        </Container>
    );
};

export default EmailPreview;
