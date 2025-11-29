import { Box, Typography, Button } from '@mui/material'
import {
    FolderOff,
    SearchOff,
    AssignmentLate,
    PersonOff,
    ClassOutlined,
    EventBusy,
    SchoolOutlined,
    BarChartOutlined
} from '@mui/icons-material'

/**
 * Componente para mostrar estados vacíos de forma amigable
 */
const EstadoVacio = ({ 
    tipo = 'datos',
    mensaje,
    descripcion,
    icono: IconoCustom,
    accion,
    textoAccion
}) => {
    // Mapeo de íconos según el tipo
    const iconos = {
        datos: FolderOff,
        busqueda: SearchOff,
        estudiantes: PersonOff,
        clases: ClassOutlined,
        periodos: EventBusy,
        evaluaciones: AssignmentLate,
        docentes: SchoolOutlined,
        analisis: BarChartOutlined
    }

    const Icono = IconoCustom || iconos[tipo] || FolderOff

    // Mensajes por defecto según el tipo
    const mensajesPorTipo = {
        datos: 'No hay información disponible',
        busqueda: 'No se encontraron resultados',
        estudiantes: 'No hay estudiantes registrados',
        clases: 'No hay clases disponibles',
        periodos: 'No hay periodos configurados',
        evaluaciones: 'No hay evaluaciones registradas',
        docentes: 'No hay docentes asignados',
        analisis: 'No hay datos para analizar'
    }

    const descripcionesPorTipo = {
        datos: 'Aún no se ha registrado ninguna información en esta sección',
        busqueda: 'Intenta con otros criterios de búsqueda',
        estudiantes: 'Comienza agregando estudiantes al sistema',
        clases: 'Crea una clase para comenzar',
        periodos: 'Configura un periodo académico primero',
        evaluaciones: 'Registra evaluaciones para ver resultados',
        docentes: 'Asigna docentes a las clases',
        analisis: 'Selecciona los filtros necesarios para generar el análisis'
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                py: 4,
                px: 2,
                textAlign: 'center'
            }}
        >
            <Icono
                sx={{
                    fontSize: 80,
                    color: 'text.disabled',
                    mb: 2,
                    opacity: 0.5
                }}
            />
            <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{ fontWeight: 500 }}
            >
                {mensaje || mensajesPorTipo[tipo]}
            </Typography>
            <Typography
                variant="body2"
                color="text.disabled"
                sx={{ maxWidth: 400, mb: 3 }}
            >
                {descripcion || descripcionesPorTipo[tipo]}
            </Typography>
            {accion && textoAccion && (
                <Button
                    variant="contained"
                    onClick={accion}
                    sx={{ mt: 1 }}
                >
                    {textoAccion}
                </Button>
            )}
        </Box>
    )
}

export default EstadoVacio
