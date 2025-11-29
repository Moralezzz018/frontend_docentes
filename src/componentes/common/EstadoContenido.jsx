import CargandoDatos from './CargandoDatos'
import MensajeError from './MensajeError'
import EstadoVacio from './EstadoVacio'

/**
 * Componente wrapper que maneja todos los estados de contenido:
 * - Cargando
 * - Error
 * - Sin datos
 * - Con datos (muestra children)
 */
const EstadoContenido = ({
    cargando = false,
    error = null,
    datos = null,
    children,
    mensajeCarga = 'Cargando información...',
    tipoCarga = 'circular',
    alturaCarga = 200,
    filas = 5,
    tipoVacio = 'datos',
    mensajeVacio,
    descripcionVacio,
    mostrarDetallesError = false,
    onReintentar,
    onCerrarError,
    verificarVacio = true
}) => {
    // Debug: ver el estado actual
    console.log('EstadoContenido - Estado:', { 
        cargando, 
        error: !!error, 
        datosLength: Array.isArray(datos) ? datos.length : 'no es array',
        verificarVacio 
    })

    // Estado de carga
    if (cargando) {
        return (
            <CargandoDatos
                mensaje={mensajeCarga}
                tipo={tipoCarga}
                altura={alturaCarga}
                filas={filas}
            />
        )
    }

    // Estado de error
    if (error) {
        return (
            <MensajeError
                error={error}
                mostrarDetalles={mostrarDetallesError}
                onReintentar={onReintentar}
                onCerrar={onCerrarError}
            />
        )
    }

    // Estado vacío (verificar si datos es array vacío, null o undefined)
    if (verificarVacio) {
        const estaVacio = datos === null || 
                         datos === undefined || 
                         (Array.isArray(datos) && datos.length === 0) ||
                         (typeof datos === 'object' && !Array.isArray(datos) && Object.keys(datos).length === 0)

        if (estaVacio) {
            return (
                <EstadoVacio
                    tipo={tipoVacio}
                    mensaje={mensajeVacio}
                    descripcion={descripcionVacio}
                />
            )
        }
    }

    // Estado con datos
    return <>{children}</>
}

export default EstadoContenido
