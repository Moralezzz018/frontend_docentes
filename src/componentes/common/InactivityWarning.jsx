import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { useAuthStore } from '@almacen/authStore'

/**
 * Componente que muestra una advertencia antes de cerrar sesión por inactividad
 * Muestra un diálogo 1 minuto antes de cerrar la sesión automáticamente
 */
export const InactivityWarning = ({ timeout = 5 * 60 * 1000, warningTime = 1 * 60 * 1000 }) => {
    const [showWarning, setShowWarning] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const logout = useAuthStore((state) => state.logout)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const timerRef = useRef(null)
    const warningTimerRef = useRef(null)
    const countdownIntervalRef = useRef(null)

    const resetTimer = () => {
        // Limpiar timers anteriores
        if (timerRef.current) clearTimeout(timerRef.current)
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
        
        // Ocultar advertencia
        setShowWarning(false)

        if (!isAuthenticated) return

        const warningSeconds = Math.floor(warningTime / 1000)

        // Timer para mostrar advertencia
        warningTimerRef.current = setTimeout(() => {
            setShowWarning(true)
            setCountdown(warningSeconds)

            // Iniciar countdown
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }, timeout - warningTime)

        // Timer para cerrar sesión
        timerRef.current = setTimeout(() => {
            logout()
        }, timeout)
    }

    const handleStayActive = () => {
        resetTimer()
    }

    useEffect(() => {
        if (!isAuthenticated) {
            return
        }

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

        // Función wrapper para evitar dependencias en resetTimer
        const handleActivity = () => {
            resetTimer()
        }

        // Iniciar el timer
        resetTimer()

        // Agregar listeners
        events.forEach((event) => {
            window.addEventListener(event, handleActivity, { passive: true })
        })

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity)
            })
        }
    }, [isAuthenticated])

    if (!showWarning) return null

    return (
        <Dialog
            open={showWarning}
            onClose={() => {}} // No permitir cerrar con clic afuera
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white' }}>
                ⚠️ Advertencia de Inactividad
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                    Tu sesión está a punto de expirar debido a inactividad.
                </Typography>
                <Typography variant="h4" color="error" sx={{ my: 2, textAlign: 'center' }}>
                    {countdown}s
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Haz clic en "Continuar" para mantener tu sesión activa.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={logout} color="error" variant="outlined">
                    Cerrar Sesión
                </Button>
                <Button onClick={handleStayActive} variant="contained" color="primary" autoFocus>
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
