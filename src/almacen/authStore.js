import { create } from 'zustand'
import { authService } from '@servicios/authService'

export const useAuthStore = create((set) => ({
    user: authService.getCurrentUser(),
    token: localStorage.getItem('token'),
    isAuthenticated: authService.isAuthenticated(),

    login: async (credentials) => {
        const data = await authService.login(credentials)
        set({
            user: data.usuario,
            token: data.token,
            isAuthenticated: true,
        })
        return data
    },

    logout: () => {
        authService.logout()
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        })
    },

    updateUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user))
        set({ user })
    },

    // Helpers para obtener información del rol
    getRol: () => {
        const state = useAuthStore.getState()
        return state.user?.rol?.nombre || null
    },

    isAdmin: () => {
        const state = useAuthStore.getState()
        return state.user?.rol?.nombre === 'ADMIN'
    },

    isDocente: () => {
        const state = useAuthStore.getState()
        return state.user?.rol?.nombre === 'DOCENTE'
    },

    isEstudiante: () => {
        const state = useAuthStore.getState()
        return state.user?.rol?.nombre === 'ESTUDIANTE'
    },
}))
