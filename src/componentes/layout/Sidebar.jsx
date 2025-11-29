import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Toolbar, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@almacen/authStore'
import { tieneAccesoAModulo } from '@configuracion/rolesConfig'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PeopleIcon from '@mui/icons-material/People'
import ClassIcon from '@mui/icons-material/Class'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WorkIcon from '@mui/icons-material/Work'
import BarChartIcon from '@mui/icons-material/BarChart'
import ViewListIcon from '@mui/icons-material/ViewList'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HistoryIcon from '@mui/icons-material/History'
import NotificationsIcon from '@mui/icons-material/Notifications'

// Definición completa de todos los módulos del sistema
const todosLosModulos = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { id: 'evaluaciones', text: 'Evaluaciones', icon: <AssignmentIcon />, path: '/evaluaciones' },
    { id: 'estudiantes', text: 'Estudiantes', icon: <PeopleIcon />, path: '/estudiantes' },
    { id: 'clases', text: 'Clases', icon: <ClassIcon />, path: '/clases' },
    { id: 'secciones', text: 'Secciones', icon: <ViewListIcon />, path: '/secciones' },
    { id: 'periodos', text: 'Periodos', icon: <CalendarTodayIcon />, path: '/periodos' },
    { id: 'parciales', text: 'Parciales', icon: <ViewListIcon />, path: '/parciales' },
    { id: 'aulas', text: 'Aulas', icon: <MeetingRoomIcon />, path: '/aulas' },
    { id: 'asistencias', text: 'Asistencias', icon: <CheckCircleIcon />, path: '/asistencias' },
    { id: 'proyectos', text: 'Proyectos', icon: <WorkIcon />, path: '/proyectos' },
    { id: 'usuarios', text: 'Usuarios', icon: <AccountCircleIcon />, path: '/usuarios' },
    { id: 'analisis', text: 'Análisis', icon: <BarChartIcon />, path: '/analisis' },
    { id: 'auditoria', text: 'Auditoría', icon: <HistoryIcon />, path: '/auditoria' },
    { id: 'notificaciones', text: 'Notificaciones', icon: <NotificationsIcon />, path: '/notificaciones' },
]

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const user = useAuthStore((state) => state.user)
    
    // Obtener el rol del usuario
    const rolUsuario = user?.rol?.nombre || null

    // Filtrar los módulos según el rol del usuario
    const menuItems = todosLosModulos.filter((modulo) => 
        tieneAccesoAModulo(rolUsuario, modulo.id)
    )

    const drawer = (
        <Box>
            <Toolbar>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" noWrap component="div">
                        Docentes App
                    </Typography>
                    {user?.rol?.nombre && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {user.rol.nombre}
                        </Typography>
                    )}
                </Box>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path)
                                if (mobileOpen) handleDrawerToggle()
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    )
}

export default Sidebar
