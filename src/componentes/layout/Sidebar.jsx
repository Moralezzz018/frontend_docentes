import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Toolbar, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
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

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Evaluaciones', icon: <AssignmentIcon />, path: '/evaluaciones' },
    { text: 'Estudiantes', icon: <PeopleIcon />, path: '/estudiantes' },
    { text: 'Clases', icon: <ClassIcon />, path: '/clases' },
    { text: 'Secciones', icon: <ViewListIcon />, path: '/secciones' },
    { text: 'Periodos', icon: <CalendarTodayIcon />, path: '/periodos' },
    { text: 'Parciales', icon: <ViewListIcon />, path: '/parciales' },
    { text: 'Aulas', icon: <MeetingRoomIcon />, path: '/aulas' },
    { text: 'Asistencias', icon: <CheckCircleIcon />, path: '/asistencias' },
    { text: 'Proyectos', icon: <WorkIcon />, path: '/proyectos' },
    { text: 'Usuarios', icon: <AccountCircleIcon />, path: '/usuarios' },
    { text: 'Análisis', icon: <BarChartIcon />, path: '/analisis' },
]

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Docentes App
                </Typography>
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
