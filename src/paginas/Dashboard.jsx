import { useState, useEffect } from 'react'
import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PeopleIcon from '@mui/icons-material/People'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SchoolIcon from '@mui/icons-material/School'
import ClassIcon from '@mui/icons-material/Class'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import PersonIcon from '@mui/icons-material/Person'
import FolderIcon from '@mui/icons-material/Folder'
import { dashboardService } from '@servicios/dashboardService'
import { useAuthStore } from '@almacen/authStore'
import ErrorMessage from '@componentes/common/ErrorMessage'

const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: onClick ? 'translateY(-4px)' : 'none',
        boxShadow: onClick ? 4 : 1,
      },
    }}
    onClick={onClick}
  >
    <Box
      sx={{
        backgroundColor: `${color}.light`,
        borderRadius: 2,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="h4" component="div" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Paper>
)

const Dashboard = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.obtenerEstadisticas()
      setEstadisticas(data)
    } catch (err) {
      console.error('Error al cargar estadísticas:', err)
      setError('Error al cargar las estadísticas del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = user?.rol?.nombre === 'ADMIN'
  const isDocente = user?.rol?.nombre === 'DOCENTE'
  const isEstudiante = user?.rol?.nombre === 'ESTUDIANTE'

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Bienvenido, <strong>{user?.login}</strong> ({user?.rol?.nombre || 'Usuario'})
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Evaluaciones - Todos los roles */}
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <StatCard
              title="Evaluaciones"
              value={estadisticas?.totalEvaluaciones || 0}
              icon={<AssignmentIcon fontSize="large" />}
              color="primary"
              onClick={() => navigate('/evaluaciones')}
            />
          )}
        </Grid>

        {/* Estudiantes - Admin y Docente */}
        {(isAdmin || isDocente) && (
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={120} />
            ) : (
              <StatCard
                title="Estudiantes"
                value={estadisticas?.totalEstudiantes || 0}
                subtitle={`${estadisticas?.estudiantesActivos || 0} activos`}
                icon={<PeopleIcon fontSize="large" />}
                color="success"
                onClick={() => navigate('/estudiantes')}
              />
            )}
          </Grid>
        )}

        {/* Asistencias Hoy - Todos los roles */}
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <StatCard
              title="Asistencia Hoy"
              value={`${estadisticas?.asistenciaHoy?.porcentaje || 0}%`}
              subtitle={`${estadisticas?.asistenciaHoy?.presentes || 0}/${estadisticas?.asistenciaHoy?.total || 0} presentes`}
              icon={<CheckCircleIcon fontSize="large" />}
              color="info"
              onClick={() => navigate('/asistencias')}
            />
          )}
        </Grid>

        {/* Clases - Todos los roles */}
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <StatCard
              title="Clases"
              value={estadisticas?.totalClases || 0}
              subtitle={`${estadisticas?.clasesActivas || 0} activas`}
              icon={<ClassIcon fontSize="large" />}
              color="warning"
              onClick={() => navigate('/clases')}
            />
          )}
        </Grid>

        {/* Proyectos - Todos los roles */}
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <StatCard
              title="Proyectos"
              value={estadisticas?.totalProyectos || 0}
              icon={<FolderIcon fontSize="large" />}
              color="secondary"
              onClick={() => navigate('/proyectos')}
            />
          )}
        </Grid>

        {/* Aulas - Solo Admin */}
        {isAdmin && (
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={120} />
            ) : (
              <StatCard
                title="Aulas"
                value={estadisticas?.totalAulas || 0}
                icon={<MeetingRoomIcon fontSize="large" />}
                color="secondary"
                onClick={() => navigate('/aulas')}
              />
            )}
          </Grid>
        )}

        {/* Usuarios - Solo Admin */}
        {isAdmin && (
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={120} />
            ) : (
              <StatCard
                title="Usuarios"
                value={estadisticas?.totalUsuarios || 0}
                icon={<PersonIcon fontSize="large" />}
                color="error"
                onClick={() => navigate('/usuarios')}
              />
            )}
          </Grid>
        )}
      </Grid>

      {/* Información adicional según el rol */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isAdmin && 'Panel de Administrador'}
          {isDocente && 'Panel de Docente'}
          {isEstudiante && 'Panel de Estudiante'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isAdmin && 'Tienes acceso completo a todas las funciones del sistema. Gestiona usuarios, clases, evaluaciones y más.'}
          {isDocente && 'Desde aquí puedes gestionar tus clases, evaluar estudiantes y registrar asistencias.'}
          {isEstudiante && 'Consulta tus evaluaciones, asistencias y el progreso en tus clases.'}
        </Typography>
        
        {!loading && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              📊 <strong>Última actualización:</strong> {new Date().toLocaleString('es-ES')}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default Dashboard
