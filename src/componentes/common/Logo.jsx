import React from 'react';
import { Box } from '@mui/material';

/**
 * Logo del Sistema de Gestión Docente
 * @param {number} size - Tamaño del logo (default: 40)
 * @param {string} color - Color principal (default: primary.main)
 */
const Logo = ({ size = 40, color = '#1976d2' }) => {
    return (
        <Box 
            sx={{ 
                width: size, 
                height: size, 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <svg 
                width={size} 
                height={size} 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Fondo del logo */}
                <rect 
                    width="48" 
                    height="48" 
                    rx="8" 
                    fill={color}
                />
                
                {/* Birrete de graduación */}
                <g transform="translate(24, 24)">
                    {/* Base del birrete */}
                    <path
                        d="M-12,-6 L0,-10 L12,-6 L12,-2 L0,2 L-12,-2 Z"
                        fill="white"
                        fillOpacity="0.95"
                    />
                    
                    {/* Parte superior del birrete */}
                    <rect
                        x="-10"
                        y="-10"
                        width="20"
                        height="3"
                        rx="1"
                        fill="white"
                    />
                    
                    {/* Borla */}
                    <line
                        x1="10"
                        y1="-9"
                        x2="14"
                        y2="-5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="14"
                        cy="-5"
                        r="2"
                        fill="white"
                    />
                    
                    {/* Libro abierto debajo */}
                    <path
                        d="M-8,0 L-8,8 L0,6 L8,8 L8,0 Z"
                        fill="white"
                        fillOpacity="0.8"
                    />
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="6"
                        stroke={color}
                        strokeWidth="1"
                    />
                </g>
            </svg>
        </Box>
    );
};

export default Logo;
