import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@componentes': path.resolve(__dirname, './src/componentes'),
            '@paginas': path.resolve(__dirname, './src/paginas'),
            '@servicios': path.resolve(__dirname, './src/servicios'),
            '@ganchos': path.resolve(__dirname, './src/ganchos'),
            '@utilidades': path.resolve(__dirname, './src/utilidades'),
            '@almacen': path.resolve(__dirname, './src/almacen'),
            '@configuracion': path.resolve(__dirname, './src/configuracion'),
            '@recursos': path.resolve(__dirname, './src/recursos'),
        }
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
