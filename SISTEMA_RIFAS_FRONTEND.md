# Sistema de Rifas - Frontend

## 📋 Descripción

Interfaz de usuario para el sistema de rifas de proyectos, que permite a docentes y administradores crear grupos automáticamente asignando proyectos de forma aleatoria y luego asignar estudiantes a cada grupo.

## 🗂️ Archivos Implementados

### 1. **Servicio: `gruposService.js`**
- **Ubicación:** `src/servicios/gruposService.js`
- **Funciones:**
  - `validarCantidad(claseId, cantidad)` - Valida estudiantes disponibles
  - `rifarProyectos(claseId)` - Crea grupos y asigna proyectos aleatoriamente
  - `asignarEstudiantes(grupoId, estudiantesIds)` - Asigna estudiantes a un grupo
  - `listarPorClase(claseId)` - Lista grupos de una clase
  - `eliminarPorClase(claseId)` - Elimina todos los grupos de una clase

### 2. **Página Principal: `Rifas.jsx`**
- **Ubicación:** `src/paginas/Rifas/Rifas.jsx`
- **Características:**
  - Selector de clase
  - Botón para rifar proyectos automáticamente
  - Vista de tarjetas (cards) de grupos con proyectos y estudiantes
  - Diálogo para asignar estudiantes a grupos
  - Botón para eliminar todos los grupos
  - Estadísticas en tiempo real (cantidad de proyectos y grupos)

### 3. **Configuración de API: `api.js`**
- **Endpoints agregados en `GRUPOS`:**
  ```javascript
  GRUPOS: {
    VALIDAR_CANTIDAD: '/api/grupos/validar-cantidad',
    RIFAR_PROYECTOS: '/api/grupos/rifar-proyectos',
    ASIGNAR_ESTUDIANTES: '/api/grupos/asignar-estudiantes',
    LISTAR: '/api/grupos/listar',
    ELIMINAR_CLASE: '/api/grupos/eliminar-clase',
  }
  ```

### 4. **Rutas: `App.jsx`**
- Ruta agregada: `/rifas`
- Protección por rol: ADMIN y DOCENTE
- Usa el mismo permiso que `proyectos`

### 5. **Navegación: `Sidebar.jsx`**
- Ítem agregado en el menú lateral
- Ícono: `CasinoIcon` 🎲
- Solo visible para ADMIN y DOCENTE

### 6. **Configuración de Roles: `rolesConfig.js`**
- Módulo `rifas` agregado para ADMIN y DOCENTE
- ESTUDIANTE no tiene acceso

## 🎨 Componentes Visuales

### Vista Principal
```
┌─────────────────────────────────────────────┐
│  🎲 Rifas de Proyectos         [Actualizar] │
├─────────────────────────────────────────────┤
│  [Seleccionar Clase ▼]                      │
│  [Rifar Proyectos]  [Eliminar Grupos]       │
│  📋 5 Proyectos  👥 5 Grupos                │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Grupo 1  │  │ Grupo 2  │  │ Grupo 3  │  │
│  │ ━━━━━━━━ │  │ ━━━━━━━━ │  │ ━━━━━━━━ │  │
│  │ Proyecto │  │ Proyecto │  │ Proyecto │  │
│  │ Sistema  │  │ Web App  │  │ Móvil    │  │
│  │          │  │          │  │          │  │
│  │ 👤 Juan  │  │ 👤 María │  │ 👤 Pedro │  │
│  │ 👤 Ana   │  │ 👤 Luis  │  │ 👤 Rosa  │  │
│  │          │  │          │  │          │  │
│  │ [Asignar]│  │ [Asignar]│  │ [Asignar]│  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

### Diálogo de Asignación
```
┌─────────────────────────────────────────┐
│  Asignar Estudiantes - Grupo 1         │
├─────────────────────────────────────────┤
│  Proyecto: Sistema de Gestión          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Seleccione estudiantes:                │
│  ┌───────────────────────────────────┐ │
│  │ ☑ Juan Pérez - juan@mail.com     │ │
│  │ ☑ Ana García - ana@mail.com      │ │
│  │ ☐ Carlos López - carlos@mail.com │ │
│  │ ☐ María Torres - maria@mail.com  │ │
│  └───────────────────────────────────┘ │
│  Estudiantes seleccionados: 2           │
├─────────────────────────────────────────┤
│              [Cancelar]  [Asignar]      │
└─────────────────────────────────────────┘
```

## 🔄 Flujo de Trabajo del Usuario

### 1. Crear Rifas
1. Ingresar a **Rifas** desde el menú lateral
2. Seleccionar una **clase** del dropdown
3. Ver cantidad de **proyectos disponibles**
4. Hacer clic en **"Rifar Proyectos"**
5. El sistema crea grupos automáticamente y asigna proyectos al azar

### 2. Asignar Estudiantes
1. Ver las tarjetas de grupos creados
2. Hacer clic en **"Asignar Estudiantes"** en un grupo
3. Seleccionar estudiantes del dropdown (múltiple selección)
4. Hacer clic en **"Asignar"**
5. Los estudiantes se agregan al grupo

### 3. Eliminar y Reiniciar
1. Hacer clic en **"Eliminar Grupos"**
2. Confirmar la acción
3. Todos los grupos se eliminan
4. Rifar nuevamente si es necesario

## 🎯 Características Clave

### ✅ Validaciones
- No permite rifar si no hay proyectos en la clase
- No permite rifar si ya existen grupos (debe eliminarlos primero)
- No permite asignar estudiantes que ya están en otro grupo
- Valida que los estudiantes estén disponibles

### 🎨 UX/UI
- **Cards visuales** para cada grupo con información completa
- **Chips de estadísticas** mostrando proyectos y grupos
- **Diálogos modales** para asignación de estudiantes
- **Snackbars** para notificaciones de éxito/error
- **Loading spinners** durante operaciones
- **Confirmación** antes de eliminar grupos

### 📱 Responsive
- Diseño adaptable a diferentes tamaños de pantalla
- Grid de tarjetas que se ajusta automáticamente
- Compatible con dispositivos móviles

## 🔐 Seguridad

- **Autenticación requerida**: Solo usuarios autenticados
- **Control de roles**: Solo ADMIN y DOCENTE
- **Protección de rutas**: RoleProtectedRoute
- **JWT en headers**: Todas las peticiones autenticadas

## 🧪 Casos de Uso

### Caso 1: Profesor crea rifas para proyecto final
```
1. Profesor selecciona "Programación Web"
2. Ve que hay 8 proyectos y 32 estudiantes
3. Hace clic en "Rifar Proyectos"
4. Se crean 8 grupos automáticamente
5. Asigna 4 estudiantes a cada grupo
6. Los grupos quedan listos para trabajar
```

### Caso 2: Rehacer asignación
```
1. Grupos ya existen pero hay error
2. Hace clic en "Eliminar Grupos"
3. Confirma la acción
4. Vuelve a hacer clic en "Rifar Proyectos"
5. Nueva asignación aleatoria generada
```

### Caso 3: Ajustar integrantes
```
1. Grupo tiene 3 estudiantes
2. Hace clic en "Asignar Estudiantes"
3. Agrega 1 estudiante más
4. Total: 4 estudiantes en el grupo
```

## 📊 Estados de la UI

| Estado | Descripción | Acción |
|--------|-------------|--------|
| **Sin clase** | No hay clase seleccionada | Seleccionar clase |
| **Sin grupos** | Clase sin grupos creados | Rifar proyectos |
| **Con grupos** | Grupos ya creados | Asignar estudiantes o eliminar |
| **Loading** | Operación en progreso | Mostrar spinner |
| **Error** | Ocurrió un error | Mostrar snackbar |

## 🎨 Iconografía

- 🎲 `CasinoIcon` - Rifas (menú y título)
- 📋 `AssignmentIcon` - Proyectos
- 👥 `PeopleIcon` - Estudiantes
- ➕ `GroupAddIcon` - Asignar estudiantes
- 🔄 `RefreshIcon` - Actualizar
- 🗑️ `DeleteIcon` - Eliminar
- ⬇️ `ExpandMoreIcon` - Expandir acordeón

## 🔗 Integración con Backend

Todos los endpoints están documentados en `SISTEMA_RIFAS_DOCUMENTACION.md` del backend.

### Endpoints Utilizados
- `GET /api/grupos/listar?claseId={id}`
- `POST /api/grupos/rifar-proyectos`
- `POST /api/grupos/asignar-estudiantes`
- `DELETE /api/grupos/eliminar-clase?claseId={id}`

## 📝 Notas Técnicas

- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios (via apiClient)
- **UI Library**: Material-UI v5
- **Routing**: React Router v6
- **Notificaciones**: Snackbar + Alert (MUI)
- **Dialogs**: Material-UI Dialog component

## 🚀 Próximas Mejoras Sugeridas

1. **Arrastrar y soltar** estudiantes entre grupos
2. **Vista de calendario** para fechas de entrega
3. **Exportar** asignaciones a PDF/Excel
4. **Notificaciones** por email a estudiantes asignados
5. **Chat grupal** integrado
6. **Historial** de rifas anteriores
7. **Estadísticas** de desempeño por grupo

---

**Implementado el:** 1 de diciembre de 2025  
**Rama:** MoralesaFront  
**Autor:** Sistema recuperado y reimplementado
