import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Toolbar, Typography, Collapse } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '@almacen/authStore'
import { tieneAccesoAModulo } from '@configuracion/rolesConfig'
import Logo from '@componentes/common/Logo'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PeopleIcon from '@mui/icons-material/People'
import ClassIcon from '@mui/icons-material/Class'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WorkIcon from '@mui/icons-material/Work'
import CasinoIcon from '@mui/icons-material/Casino'
import BarChartIcon from '@mui/icons-material/BarChart'
import ViewListIcon from '@mui/icons-material/ViewList'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HistoryIcon from '@mui/icons-material/History'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PercentIcon from '@mui/icons-material/Percent'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import SchoolIcon from '@mui/icons-material/School'
import GroupsIcon from '@mui/icons-material/Groups'

// Definición de módulos organizados en categorías desplegables
const categoriasModulos = [
    {
        id: 'principal',
        titulo: 'Principal',
        icon: <DashboardIcon />,
        collapsible: false,
        modulos: [
            { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
            { id: 'notificaciones', text: 'Notificaciones', icon: <NotificationsIcon />, path: '/notificaciones' },
        ]
    },
    {
        id: 'configuracion',
        titulo: 'Configuración',
        icon: <SettingsIcon />,
        collapsible: true,
        modulos: [
            { id: 'periodos', text: 'Periodos', icon: <CalendarTodayIcon />, path: '/periodos' },
            { id: 'parciales', text: 'Parciales', icon: <ViewListIcon />, path: '/parciales' },
            { id: 'aulas', text: 'Aulas', icon: <MeetingRoomIcon />, path: '/aulas' },
            { id: 'secciones', text: 'Secciones', icon: <ViewListIcon />, path: '/secciones' },
            { id: 'estructura-calificacion', text: 'Estructura Calificación', icon: <PercentIcon />, path: '/estructura-calificacion' },
        ]
    },
    {
        id: 'estudiantes',
        titulo: 'Estudiantes',
        icon: <SchoolIcon />,
        collapsible: true,
        modulos: [
            { id: 'estudiantes', text: 'Gestión Estudiantes', icon: <PeopleIcon />, path: '/estudiantes' },
            { id: 'clases', text: 'Clases', icon: <ClassIcon />, path: '/clases' },
            { id: 'proyectos', text: 'Proyectos', icon: <WorkIcon />, path: '/proyectos' },
            { id: 'rifas', text: 'Rifas', icon: <CasinoIcon />, path: '/rifas' },
        ]
    },
    {
        id: 'academico',
        titulo: 'Académico',
        icon: <AssignmentIcon />,
        collapsible: true,
        modulos: [
            { id: 'asistencias', text: 'Asistencias', icon: <CheckCircleIcon />, path: '/asistencias' },
            { id: 'evaluaciones', text: 'Evaluaciones', icon: <AssignmentIcon />, path: '/evaluaciones' },
            { id: 'notas', text: 'Notas', icon: <MenuBookIcon />, path: '/notas' },
        ]
    },
    {
        id: 'administracion',
        titulo: 'Administración',
        icon: <GroupsIcon />,
        collapsible: true,
        modulos: [
            { id: 'usuarios', text: 'Usuarios', icon: <AccountCircleIcon />, path: '/usuarios' },
            { id: 'analisis', text: 'Análisis', icon: <BarChartIcon />, path: '/analisis' },
            { id: 'auditoria', text: 'Auditoría', icon: <HistoryIcon />, path: '/auditoria' },
        ]
    },
]

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const user = useAuthStore((state) => state.user)
    
    // Estado para controlar qué categorías están abiertas
    const [openCategories, setOpenCategories] = useState({
        configuracion: false,
        estudiantes: false,
        academico: false,
        administracion: false,
    })

    const handleToggleCategory = (categoryId) => {
        setOpenCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }))
    }
    
    // Obtener el rol del usuario
    const rolUsuario = user?.rol?.nombre || null

    // Filtrar las categorías y módulos según el rol del usuario
    const categoriasFiltradas = categoriasModulos
        .map(categoria => ({
            ...categoria,
            modulos: categoria.modulos.filter(modulo => tieneAccesoAModulo(rolUsuario, modulo.id))
        }))
        .filter(categoria => categoria.modulos.length > 0)

    const drawer = (
        <Box>
            <Toolbar>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Logo size={40} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                            Docentes App
                        </Typography>
                        {user?.rol?.nombre && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                {user.rol.nombre}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Toolbar>
            <Divider />
            <Box sx={{ overflow: 'auto' }}>
                <List sx={{ py: 1 }}>
                    {categoriasFiltradas.map((categoria) => (
                        <Box key={categoria.id}>
                            {!categoria.collapsible ? (
                                // Categorías no colapsables (Principal)
                                categoria.modulos.map((item) => (
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
                                ))
                            ) : (
                                // Categorías colapsables
                                <>
                                    <ListItemButton 
                                        onClick={() => handleToggleCategory(categoria.id)}
                                        sx={{
                                            backgroundColor: openCategories[categoria.id] ? 'action.selected' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            }
                                        }}
                                    >
                                        <ListItemIcon>{categoria.icon}</ListItemIcon>
                                        <ListItemText 
                                            primary={categoria.titulo}
                                            primaryTypographyProps={{ 
                                                fontWeight: 600,
                                                fontSize: '0.95rem'
                                            }} 
                                        />
                                        {openCategories[categoria.id] ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={openCategories[categoria.id]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {categoria.modulos.map((item) => (
                                                <ListItem key={item.text} disablePadding>
                                                    <ListItemButton
                                                        selected={location.pathname === item.path}
                                                        onClick={() => {
                                                            navigate(item.path)
                                                            if (mobileOpen) handleDrawerToggle()
                                                        }}
                                                        sx={{ pl: 4 }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                                        <ListItemText 
                                                            primary={item.text}
                                                            primaryTypographyProps={{ fontSize: '0.875rem' }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                </>
                            )}
                        </Box>
                    ))}
                </List>
            </Box>
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
