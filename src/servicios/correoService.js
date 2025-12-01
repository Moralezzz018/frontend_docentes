import React from 'react';
import { render } from '@react-email/render';
import RecuperacionPasswordEmail from '../plantillas/RecuperacionPassword';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@configuracion/api';

/**
 * Servicio para renderizar plantillas de correo
 */

/**
 * Genera el HTML para el correo de recuperación de contraseña
 * @param {string} pin - Código PIN de 6 dígitos
 * @param {string} nombreUsuario - Nombre del usuario
 * @returns {Promise<string>} HTML renderizado
 */
export const generarCorreoRecuperacion = async (pin, nombreUsuario = 'Usuario') => {
  const html = await render(
    React.createElement(RecuperacionPasswordEmail, { pin, nombreUsuario })
  );
  return html;
};

/**
 * Envía un correo de recuperación de contraseña
 * @param {string} correo - Email del destinatario
 * @param {string} pin - Código PIN generado
 * @param {string} nombreUsuario - Nombre del usuario
 * @returns {Promise<boolean>} True si se envió correctamente
 */
export const enviarCorreoRecuperacion = async (correo, pin, nombreUsuario) => {
  try {
    const htmlContent = await generarCorreoRecuperacion(pin, nombreUsuario);
    
    // Enviar al backend
    const response = await apiClient.post(API_ENDPOINTS.CORREO.ENVIAR, {
      destinatario: correo,
      asunto: 'Verificación de identidad - Código de recuperación',
      contenido: htmlContent,
    });

    return response.status === 200;
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    return false;
  }
};

export default {
  generarCorreoRecuperacion,
  enviarCorreoRecuperacion,
};
