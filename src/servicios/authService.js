import apiClient from './apiClient'
import { API_ENDPOINTS } from '@configuracion/api'

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.usuario))
    }
    return response.data
  },

  // Registro
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response.data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Solicitar restablecimiento de contraseña
  solicitarRestablecimiento: async (correo) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SOLICITAR_RESTABLECIMIENTO, { correo })
    return response.data
  },

  // Validar PIN de recuperación
  validarPin: async (correo, pin) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VALIDAR_PIN, { correo, pin })
    return response.data
  },

  // Restablecer contraseña con token
  restablecerContrasena: async (token, contrasena) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.RESTABLECER_CONTRASENA,
      { contrasena },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },
}
