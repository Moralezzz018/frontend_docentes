import React, { useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import App from './App.jsx'
import { getTheme } from './configuracion/theme.js'
import { useThemeStore } from './almacen/themeStore.js'

const ThemedApp = () => {
    const mode = useThemeStore((state) => state.mode)
    const theme = useMemo(() => getTheme(mode), [mode])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <ThemedApp />
        </BrowserRouter>
    </React.StrictMode>,
)
