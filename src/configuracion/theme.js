import { createTheme } from '@mui/material/styles'

export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: mode === 'dark' ? '#42a5f5' : '#1976d2',
            light: '#64b5f6',
            dark: '#1565c0',
        },
        secondary: {
            main: mode === 'dark' ? '#ff6e40' : '#ff5722',
            light: '#ff9e80',
            dark: '#e64a19',
        },
        error: {
            main: '#f44336',
        },
        warning: {
            main: '#ff9800',
        },
        info: {
            main: '#42a5f5',
        },
        success: {
            main: '#4caf50',
        },
        background: {
            default: mode === 'dark' ? '#0a1929' : '#f5f5f5',
            paper: mode === 'dark' ? '#132f4c' : '#ffffff',
        },
        text: {
            primary: mode === 'dark' ? '#e3f2fd' : '#000000',
            secondary: mode === 'dark' ? '#b0bec5' : '#666666',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'dark' 
                        ? '0 2px 8px rgba(0,0,0,0.5)' 
                        : '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: mode === 'dark' ? '#0a1929' : '#ffffff',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'dark' ? '#132f4c' : '#1976d2',
                },
            },
        },
    },
})

export default getTheme('dark')

