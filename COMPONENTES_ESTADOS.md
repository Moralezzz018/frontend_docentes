# Componentes Reutilizables para Manejo de Estados

Esta guía muestra cómo utilizar los componentes reutilizables para el manejo de estados de carga, error y vacío en el sistema.

## Componentes Disponibles

### 1. EstadoContenido (Recomendado)

Componente wrapper que maneja automáticamente todos los estados: cargando, error, vacío y con datos.

#### Uso Básico

```jsx
import { EstadoContenido } from '../../componentes/common'

function MiComponente() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [datos, setDatos] = useState([])

    return (
        <EstadoContenido
            cargando={loading}
            error={error}
            datos={datos}
            tipoVacio="estudiantes"
        >
            {/* Tu contenido aquí - solo se muestra si hay datos */}
            {datos.map(item => <div key={item.id}>{item.nombre}</div>)}
        </EstadoContenido>
    )
}
```

#### Ejemplo con Tabla

```jsx
<EstadoContenido
    cargando={loading}
    datos={estudiantes}
    tipoVacio="estudiantes"
    mensajeVacio="No hay estudiantes registrados"
    descripcionVacio="Comienza agregando estudiantes manualmente o cargando un archivo Excel"
    tipoCarga="tabla"
    filas={5}
>
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Correo</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {estudiantes.map((est) => (
                    <TableRow key={est.id}>
                        <TableCell>{est.nombre}</TableCell>
                        <TableCell>{est.correo}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
</EstadoContenido>
```

#### Ejemplo con Formularios

```jsx
<EstadoContenido
    cargando={loadingOpciones}
    datos={periodos}
    mensajeCarga="Cargando opciones..."
    tipoCarga="skeleton"
    filas={3}
    verificarVacio={false} // No mostrar "vacío" para formularios
>
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField
                select
                label="Periodo"
                value={periodoId}
                onChange={(e) => setPeriodoId(e.target.value)}
            >
                {periodos.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                        {p.nombre}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    </Grid>
</EstadoContenido>
```

### 2. MensajeError

Muestra errores de forma amigable con traducciones automáticas de códigos HTTP.

#### Uso Básico

```jsx
import { MensajeError } from '../../componentes/common'

function MiComponente() {
    const [error, setError] = useState(null)

    return (
        <>
            {error && (
                <MensajeError
                    error={error}
                    mostrarDetalles={true}
                    onReintentar={() => cargarDatos()}
                    onCerrar={() => setError(null)}
                />
            )}
        </>
    )
}
```

#### Tipos de Errores que Reconoce

El componente detecta automáticamente:

- **Error de red** (ERR_NETWORK): "Sin conexión - Verifica tu conexión a internet"
- **401**: "Sesión expirada - Inicia sesión nuevamente"
- **403**: "Acceso denegado - No tienes permisos"
- **404**: "No encontrado - La información no existe"
- **400**: "Datos incorrectos - Verifica la información"
- **500+**: "Error del servidor - Intenta en unos momentos"

### 3. EstadoVacio

Muestra mensajes cuando no hay datos disponibles.

#### Uso Básico

```jsx
import { EstadoVacio } from '../../componentes/common'

{estudiantes.length === 0 && (
    <EstadoVacio
        tipo="estudiantes"
        mensaje="No hay estudiantes registrados"
        descripcion="Comienza agregando estudiantes al sistema"
        accion={() => setDialogOpen(true)}
        textoAccion="Agregar Estudiante"
    />
)}
```

#### Tipos Disponibles

- `datos`: General
- `busqueda`: Búsquedas sin resultados
- `estudiantes`: Lista de estudiantes vacía
- `clases`: Lista de clases vacía
- `periodos`: Sin periodos configurados
- `evaluaciones`: Sin evaluaciones registradas
- `docentes`: Sin docentes asignados
- `analisis`: Sin datos para analizar

### 4. CargandoDatos

Muestra estados de carga.

#### Tipos de Carga

```jsx
import { CargandoDatos } from '../../componentes/common'

// Carga circular (por defecto)
<CargandoDatos mensaje="Cargando información..." />

// Skeleton para tablas
<CargandoDatos 
    tipo="tabla" 
    filas={5}
    mensaje="Cargando estudiantes..."
/>

// Skeleton para formularios
<CargandoDatos 
    tipo="skeleton" 
    filas={3}
/>
```

## Propiedades de EstadoContenido

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `cargando` | boolean | false | Si está cargando datos |
| `error` | object/string | null | Error a mostrar |
| `datos` | any | null | Datos cargados |
| `children` | ReactNode | - | Contenido a mostrar cuando hay datos |
| `mensajeCarga` | string | "Cargando información..." | Mensaje durante carga |
| `tipoCarga` | string | "circular" | Tipo: circular, skeleton, tabla |
| `alturaCarga` | number | 200 | Altura del indicador de carga |
| `tipoVacio` | string | "datos" | Tipo de mensaje vacío |
| `mensajeVacio` | string | auto | Mensaje personalizado vacío |
| `descripcionVacio` | string | auto | Descripción personalizada vacío |
| `mostrarDetallesError` | boolean | false | Mostrar detalles técnicos del error |
| `onReintentar` | function | - | Función al hacer clic en "Reintentar" |
| `onCerrarError` | function | - | Función al cerrar el error |
| `verificarVacio` | boolean | true | Si debe verificar datos vacíos |

## Ejemplos Completos

### Listado con Búsqueda

```jsx
function ListaEstudiantes() {
    const [estudiantes, setEstudiantes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        cargarEstudiantes()
    }, [])

    const cargarEstudiantes = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await estudiantesService.listar()
            setEstudiantes(data)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const estudiantesFiltrados = estudiantes.filter(e =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <Box>
            <TextField
                fullWidth
                placeholder="Buscar estudiante..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                sx={{ mb: 2 }}
            />

            {error && (
                <MensajeError
                    error={error}
                    onReintentar={cargarEstudiantes}
                    onCerrar={() => setError(null)}
                />
            )}

            <EstadoContenido
                cargando={loading}
                datos={estudiantesFiltrados}
                tipoVacio={busqueda ? "busqueda" : "estudiantes"}
                tipoCarga="tabla"
                filas={5}
            >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Correo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estudiantesFiltrados.map((est) => (
                                <TableRow key={est.id}>
                                    <TableCell>{est.nombre}</TableCell>
                                    <TableCell>{est.correo}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </EstadoContenido>
        </Box>
    )
}
```

### Análisis con Múltiples Estados

```jsx
function PaginaAnalisis() {
    const [loading, setLoading] = useState(false)
    const [loadingOpciones, setLoadingOpciones] = useState(true)
    const [error, setError] = useState(null)
    const [periodos, setPeriodos] = useState([])
    const [resultados, setResultados] = useState(null)

    useEffect(() => {
        cargarOpciones()
    }, [])

    const cargarOpciones = async () => {
        setLoadingOpciones(true)
        try {
            const data = await periodosService.listar()
            setPeriodos(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingOpciones(false)
        }
    }

    const analizar = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await analisisService.generar(filtros)
            setResultados(data)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            {/* Filtros */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <EstadoContenido
                    cargando={loadingOpciones}
                    datos={periodos}
                    tipoCarga="skeleton"
                    filas={2}
                    verificarVacio={false}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField select label="Periodo">
                                {periodos.map(p => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button onClick={analizar}>
                                Analizar
                            </Button>
                        </Grid>
                    </Grid>
                </EstadoContenido>
            </Paper>

            {/* Error */}
            {error && (
                <MensajeError
                    error={error}
                    mostrarDetalles={true}
                    onReintentar={analizar}
                    onCerrar={() => setError(null)}
                />
            )}

            {/* Resultados */}
            <EstadoContenido
                cargando={loading}
                datos={resultados}
                mensajeCarga="Generando análisis..."
                tipoVacio="analisis"
            >
                {resultados && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Resultados del Análisis
                        </Typography>
                        {/* Gráficos y tablas aquí */}
                    </Paper>
                )}
            </EstadoContenido>
        </Box>
    )
}
```

## Mejores Prácticas

1. **Usa EstadoContenido** como primera opción - maneja todo automáticamente
2. **Separa errores de validación** - usa `setError(err)` directamente con el objeto de error
3. **Personaliza mensajes** según el contexto del usuario
4. **Usa tipos específicos** para estados vacíos (estudiantes, clases, etc.)
5. **Proporciona acciones** cuando sea posible (onReintentar, textoAccion)
6. **Skeleton para formularios**, tabla para listados, circular para operaciones
7. **verificarVacio={false}** en formularios de filtros
8. **mostrarDetalles={true}** en páginas de administración, false para usuarios finales
