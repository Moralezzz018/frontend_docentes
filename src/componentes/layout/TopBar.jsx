import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@almacen/authStore'
import { useThemeStore } from '@almacen/themeStore'

const TopBar = ({ drawerWidth, handleDrawerToggle }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [avatarKey, setAvatarKey] = useState(Date.now())
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const { mode, toggleMode } = useThemeStore()

    // Actualizar avatar cuando cambie la imagen del usuario
    useEffect(() => {
        setAvatarKey(Date.now())
    }, [user?.imagen])

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
        handleClose()
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Sistema de Gestión Docente
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={toggleMode} color="inherit" title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <Typography variant="body2">{user?.nombre || user?.login || 'Usuario'}</Typography>
                    <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                        <Avatar 
                            alt={user?.nombre || user?.login} 
                            src={user?.imagen ? `${user.imagen}?t=${avatarKey}` : undefined}
                        >
                            {!user?.imagen && (user?.login?.charAt(0).toUpperCase() || 'U')}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={() => { navigate('/perfil'); handleClose() }}>
                            Mi Perfil
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default TopBar
