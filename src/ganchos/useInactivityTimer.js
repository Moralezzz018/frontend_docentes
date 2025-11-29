import { useEffect, useRef } from 'react'
import { useAuthStore } from '@almacen/authStore'

/**
 * Hook para detectar inactividad del usuario y cerrar sesión automáticamente
 * @param {number} timeout - Tiempo de inactividad en milisegundos (default: 5 minutos)
 */
export const useInactivityTimer = (timeout = 2 * 60 * 1000) => {
    const logout = useAuthStore((state) => state.logout)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const timerRef = useRef(null)

    const resetTimer = () => {
        // Limpiar el timer anterior
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }

        // Solo iniciar el timer si el usuario está autenticado
        if (isAuthenticated) {
            timerRef.current = setTimeout(() => {
                console.log('⏱️ Sesión cerrada por inactividad')
                logout()
            }, timeout)
        }
    }

    useEffect(() => {
        // Solo activar si el usuario está autenticado
        if (!isAuthenticated) {
            return
        }

        // Eventos que resetean el timer de inactividad
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click',
        ]

        // Iniciar el timer al montar el componente
        resetTimer()

        // Agregar listeners para todos los eventos
        events.forEach((event) => {
            window.addEventListener(event, resetTimer)
        })

        // Cleanup: remover listeners y limpiar timer
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer)
            })
        }
    }, [isAuthenticated, timeout])

    return null
}
