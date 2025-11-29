# 🎨 Sistema de Roles - Frontend

## 📋 Resumen

El frontend ahora implementa control visual por roles, mostrando solo los módulos permitidos según el tipo de usuario:

### **Permisos por Rol:**

| Rol | Módulos Visibles |
|-----|------------------|
| **ADMIN** | ✅ Todos los módulos (Dashboard, Evaluaciones, Estudiantes, Clases, Secciones, Periodos, Parciales, Aulas, Asistencias, Proyectos, **Usuarios**, Análisis) |
| **DOCENTE** | ✅ Todos **EXCEPTO** "Usuarios" (Dashboard, Evaluaciones, Estudiantes, Clases, Secciones, Periodos, Parciales, Aulas, Asistencias, Proyectos, Análisis) |
| **ESTUDIANTE** | ✅ Solo: Dashboard, Evaluaciones, Asistencias |

---

## 🚀 Cambios Implementados

### **1. Configuración de Roles** (`src/configuracion/rolesConfig.js`)
- Define los módulos permitidos para cada rol
- Funciones helper para verificar permisos

### **2. Auth Store Mejorado** (`src/almacen/authStore.js`)
- Nuevos métodos: `getRol()`, `isAdmin()`, `isDocente()`, `isEstudiante()`
- Facilita la verificación de roles en cualquier componente

### **3. Sidebar con Filtrado** (`src/componentes/layout/Sidebar.jsx`)
- Filtra automáticamente los módulos según el rol del usuario
- Muestra el rol del usuario debajo del título
- Solo renderiza los módulos permitidos

### **4. TopBar con Indicador de Rol** (`src/componentes/layout/TopBar.jsx`)
- Chip visual que muestra el rol del usuario
- Íconos diferenciados por rol:
  - 🛡️ ADMIN (Rojo)
  - 🎓 DOCENTE (Azul)
  - 👤 ESTUDIANTE (Verde)

### **5. Protección de Rutas** (`src/componentes/auth/RoleProtectedRoute.jsx`)
- Componente que protege rutas basado en roles
- Muestra pantalla de "Acceso Denegado" si el usuario no tiene permisos
- Implementado en todas las rutas del `App.jsx`

---

## 🧪 Cómo Probar

### **Paso 1: Crear Usuarios de Prueba en el Backend**

```bash
# En el terminal del backend
cd docentes_api
npm run dev
```

#### **Usuario ADMIN:**
```bash
POST http://localhost:3002/api/usuarios/guardar
Content-Type: application/json

{
  "login": "admin",
  "correo": "admin@unicah.edu",
  "contrasena": "admin123",
  "rolId": 1
}
```

#### **Usuario DOCENTE:**
```bash
POST http://localhost:3002/api/usuarios/guardar
Content-Type: application/json

{
  "login": "docente1",
  "correo": "docente@unicah.edu",
  "contrasena": "123456",
  "docenteId": 1
}
```

#### **Usuario ESTUDIANTE:**
```bash
POST http://localhost:3002/api/usuarios/guardar
Content-Type: application/json

{
  "login": "estudiante1",
  "correo": "estudiante@unicah.edu",
  "contrasena": "123456",
  "estudianteId": 1
}
```

---

### **Paso 2: Iniciar el Frontend**

```bash
# En el terminal del frontend
cd frontend/frontend_docentes
npm run dev
```

---

### **Paso 3: Probar cada Rol**

#### **Prueba 1: Login como ADMIN**
1. Ir a `http://localhost:3000/login`
2. Usuario: `admin`
3. Contraseña: `admin123`
4. **Resultado esperado:**
   - ✅ Ver TODOS los módulos en el sidebar
   - ✅ Chip rojo "Administrador" en el TopBar
   - ✅ Acceso a "Usuarios"

#### **Prueba 2: Login como DOCENTE**
1. Cerrar sesión
2. Usuario: `docente1`
3. Contraseña: `123456`
4. **Resultado esperado:**
   - ✅ Ver todos los módulos EXCEPTO "Usuarios"
   - ✅ Chip azul "Docente" en el TopBar
   - ❌ No ver "Usuarios" en el sidebar
   - ❌ Si intenta acceder a `/usuarios` directamente → Pantalla "Acceso Denegado"

#### **Prueba 3: Login como ESTUDIANTE**
1. Cerrar sesión
2. Usuario: `estudiante1`
3. Contraseña: `123456`
4. **Resultado esperado:**
   - ✅ Solo ver: Dashboard, Evaluaciones, Asistencias
   - ✅ Chip verde "Estudiante" en el TopBar
   - ❌ No ver otros módulos
   - ❌ Si intenta acceder a `/clases` → Pantalla "Acceso Denegado"

---

## 🔧 Estructura de Archivos

```
src/
├── almacen/
│   └── authStore.js                    # ← Mejorado con helpers de rol
├── componentes/
│   ├── auth/
│   │   ├── ProtectedRoute.jsx         # Protección de autenticación
│   │   └── RoleProtectedRoute.jsx     # ← NUEVO: Protección por rol
│   └── layout/
│       ├── Sidebar.jsx                 # ← Mejorado: Filtrado por rol
│       └── TopBar.jsx                  # ← Mejorado: Chip de rol
├── configuracion/
│   └── rolesConfig.js                  # ← NUEVO: Configuración de permisos
└── App.jsx                             # ← Actualizado: Rutas protegidas
```

---

## 🎯 Funciones Útiles

### **Verificar Permisos en Componentes:**

```jsx
import { useAuthStore } from '@almacen/authStore'
import { tieneAccesoAModulo } from '@configuracion/rolesConfig'

function MiComponente() {
    const user = useAuthStore((state) => state.user)
    const rolUsuario = user?.rol?.nombre
    
    // Opción 1: Verificar con tieneAccesoAModulo
    const puedeVerUsuarios = tieneAccesoAModulo(rolUsuario, 'usuarios')
    
    // Opción 2: Usar helpers del store
    const { isAdmin, isDocente, isEstudiante } = useAuthStore()
    
    if (isAdmin()) {
        return <div>Panel de Administrador</div>
    }
    
    if (isDocente()) {
        return <div>Panel de Docente</div>
    }
    
    if (isEstudiante()) {
        return <div>Panel de Estudiante</div>
    }
}
```

---

## 📝 Notas Importantes

1. **Doble Capa de Seguridad:**
   - Frontend: Oculta módulos y protege rutas
   - Backend: Valida permisos en cada endpoint (middlewares)

2. **El filtrado visual NO es suficiente:**
   - Un usuario técnico podría intentar acceder directamente a rutas
   - Por eso implementamos `RoleProtectedRoute`
   - Y el backend SIEMPRE valida permisos

3. **Personalización:**
   - Para cambiar permisos, edita `src/configuracion/rolesConfig.js`
   - Para cambiar colores/íconos de roles, edita `TopBar.jsx`

---

## 🐛 Solución de Problemas

### **Problema: No se muestra el rol en el TopBar**
**Solución:** Verifica que el backend esté retornando el objeto `rol` en el login:
```javascript
// Response esperado del backend
{
  "token": "...",
  "usuario": {
    "id": 1,
    "login": "admin",
    "rol": {
      "nombre": "ADMIN",  // ← Debe estar presente
      "descripcion": "..."
    }
  }
}
```

### **Problema: Se muestran todos los módulos para todos los roles**
**Solución:** 
1. Verifica que `user.rol.nombre` no sea null en `localStorage`
2. Abre DevTools → Application → Local Storage → Revisa el objeto `user`
3. Si es null, vuelve a iniciar sesión

### **Problema: El sidebar no se actualiza al cambiar de usuario**
**Solución:** Cierra sesión completamente y vuelve a iniciar sesión. El sidebar lee el rol del `authStore`.

---

## ✅ Checklist de Verificación

- [ ] Backend retorna `rol` en el login
- [ ] Frontend muestra chip de rol en TopBar
- [ ] Sidebar filtra módulos según el rol
- [ ] ADMIN ve todos los módulos incluyendo "Usuarios"
- [ ] DOCENTE ve todos excepto "Usuarios"
- [ ] ESTUDIANTE solo ve Dashboard, Evaluaciones y Asistencias
- [ ] Intentar acceder a ruta no permitida muestra "Acceso Denegado"
- [ ] Al cerrar sesión y volver a entrar, los permisos son correctos

---

**Fecha de Implementación:** 28 de noviembre de 2025  
**Versión:** 1.0
