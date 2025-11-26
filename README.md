# Frontend Docentes - Sistema de Gestión Docente

Aplicación React con Material-UI para la gestión del sistema de docentes.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Material-UI (MUI)** - Framework de componentes
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Zustand** - Gestión de estado global
- **Axios** - Cliente HTTP
- **date-fns** - Manejo de fechas

## 📁 Estructura del Proyecto

```
frontend_docentes/
├── src/
│   ├── recursos/            # Recursos estáticos (imágenes, iconos)
│   ├── componentes/         # Componentes reutilizables
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── common/         # Componentes comunes (LoadingSpinner, etc.)
│   │   └── layout/         # Componentes de layout (Sidebar, TopBar, etc.)
│   ├── configuracion/      # Configuraciones
│   │   ├── api.js         # URLs y endpoints de la API
│   │   └── theme.js       # Tema de Material-UI
│   ├── ganchos/            # Custom hooks
│   │   └── useFetch.js    # Hook para peticiones HTTP
│   ├── paginas/            # Páginas/Vistas principales
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Evaluaciones/
│   ├── servicios/          # Servicios para APIs
│   │   ├── apiClient.js   # Cliente Axios configurado
│   │   ├── authService.js
│   │   └── evaluacionesService.js
│   ├── almacen/            # Estado global (Zustand)
│   │   ├── authStore.js
│   │   └── evaluacionesStore.js
│   ├── utilidades/         # Utilidades y helpers
│   │   ├── dateUtils.js
│   │   └── gradeUtils.js
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── .env.example            # Variables de entorno de ejemplo
├── index.html
├── package.json
└── vite.config.js
```

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
copy .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo en http://localhost:3000
- `npm run build` - Genera la build de producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🌐 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3500
```

## 🎨 Características

### Componentes de Layout
- **MainLayout**: Layout principal con sidebar y topbar
- **Sidebar**: Menú de navegación lateral
- **TopBar**: Barra superior con información del usuario

### Gestión de Estado
- **Zustand** para estado global
- Stores separados por dominio (auth, evaluaciones, etc.)

### Servicios
- Cliente Axios configurado con interceptores
- Manejo automático de tokens JWT
- Redirección automática en caso de sesión expirada

### Utilidades
- Formateo de fechas
- Cálculo de promedios y notas
- Validaciones

## 🔐 Autenticación

El sistema usa JWT almacenado en localStorage. El token se incluye automáticamente en todas las peticiones a través de interceptores de Axios.

## 📱 Responsive

Diseño responsive con Material-UI:
- Sidebar colapsable en móviles
- Grids adaptables
- Componentes optimizados para diferentes tamaños de pantalla

## 🛣️ Rutas

- `/login` - Página de inicio de sesión
- `/` - Dashboard principal (protegida)
- `/evaluaciones` - Gestión de evaluaciones (protegida)
- `/estudiantes` - Gestión de estudiantes (protegida)
- `/clases` - Gestión de clases (protegida)
- Y más rutas protegidas...

## 🚧 Próximos Pasos

1. Implementar formularios de creación/edición
2. Agregar modales de confirmación
3. Implementar filtros y búsquedas
4. Agregar gráficas y estadísticas
5. Implementar sistema de notificaciones
