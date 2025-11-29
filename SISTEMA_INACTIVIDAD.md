# 🕐 Sistema de Cierre de Sesión por Inactividad

## 📋 Descripción

Sistema implementado en el frontend que cierra automáticamente la sesión del usuario después de **5 minutos de inactividad**, con una advertencia visual **1 minuto antes** de cerrar la sesión.

---

## ⚙️ Funcionamiento

### **Flujo de Trabajo:**

1. **Usuario inicia sesión** → El sistema comienza a monitorear la actividad
2. **Usuario está activo** → El timer se resetea con cada interacción
3. **4 minutos de inactividad** → Se muestra un diálogo de advertencia con countdown de 60 segundos
4. **Usuario hace clic en "Continuar"** → Se resetea el timer y continúa la sesión
5. **5 minutos de inactividad** → Sesión cerrada automáticamente + redirección al login

---

## 📁 Archivos Implementados

### 1. **Hook: `useInactivityTimer.js`**
**Ubicación:** `src/ganchos/useInactivityTimer.js`

Hook básico para cerrar sesión silenciosamente sin advertencia visual.

**Características:**
- Monitorea eventos del usuario: `mousedown`, `mousemove`, `keypress`, `scroll`, `touchstart`, `click`
- Timer configurable (default: 5 minutos)
- Se resetea automáticamente con cualquier interacción
- Solo activo si el usuario está autenticado

**Uso:**
```jsx
import { useInactivityTimer } from '@ganchos/useInactivityTimer'

function App() {
  useInactivityTimer(5 * 60 * 1000) // 5 minutos
}
```

---

### 2. **Componente: `InactivityWarning.jsx`**
**Ubicación:** `src/componentes/common/InactivityWarning.jsx`

Componente con diálogo de advertencia visual antes de cerrar sesión.

**Características:**
- Muestra advertencia **1 minuto antes** de cerrar sesión
- Countdown visual de 60 segundos
- Botones:
  - **"Continuar"**: Resetea el timer y mantiene la sesión activa
  - **"Cerrar Sesión"**: Cierra la sesión inmediatamente
- Diálogo no cerrable con clic afuera (usuario debe tomar acción)

**Props:**
```jsx
<InactivityWarning 
  timeout={5 * 60 * 1000}      // Tiempo total (5 min)
  warningTime={1 * 60 * 1000}  // Tiempo de advertencia (1 min)
/>
```

---

### 3. **Implementación en `App.jsx`**
**Ubicación:** `src/App.jsx`

```jsx
import { InactivityWarning } from '@componentes/common/InactivityWarning'

function App() {
  return (
    <>
      {/* Sistema de inactividad */}
      <InactivityWarning timeout={5 * 60 * 1000} warningTime={1 * 60 * 1000} />
      
      <Routes>
        {/* ... rutas ... */}
      </Routes>
    </>
  )
}
```

---

## 🎯 Eventos Monitoreados

El sistema detecta las siguientes interacciones como "actividad":

| Evento | Descripción |
|--------|-------------|
| `mousedown` | Click del mouse |
| `mousemove` | Movimiento del mouse |
| `keypress` | Tecla presionada |
| `scroll` | Desplazamiento de la página |
| `touchstart` | Toque en pantallas táctiles |
| `click` | Clic en cualquier elemento |

---

## ⏱️ Configuración de Tiempos

### **Valores por Defecto:**
```javascript
timeout: 5 * 60 * 1000      // 5 minutos = 300,000 ms
warningTime: 1 * 60 * 1000  // 1 minuto = 60,000 ms
```

### **Personalización:**

**Para cambiar el tiempo de inactividad a 10 minutos:**
```jsx
<InactivityWarning 
  timeout={10 * 60 * 1000}      // 10 minutos
  warningTime={2 * 60 * 1000}   // Advertencia 2 min antes
/>
```

**Para cambiar a 3 minutos (desarrollo/testing):**
```jsx
<InactivityWarning 
  timeout={3 * 60 * 1000}       // 3 minutos
  warningTime={30 * 1000}       // Advertencia 30 seg antes
/>
```

---

## 🧪 Cómo Probar

### **Prueba 1: Advertencia de Inactividad**
1. Iniciar sesión en la aplicación
2. **Dejar la ventana sin tocar por 4 minutos**
3. **Resultado esperado:**
   - ✅ Aparece diálogo de advertencia
   - ✅ Countdown de 60 segundos
   - ✅ Botones "Continuar" y "Cerrar Sesión"

### **Prueba 2: Continuar Sesión**
1. Cuando aparezca la advertencia
2. **Hacer clic en "Continuar"**
3. **Resultado esperado:**
   - ✅ Diálogo se cierra
   - ✅ Timer se resetea
   - ✅ Usuario continúa en la sesión

### **Prueba 3: Cierre Automático**
1. Cuando aparezca la advertencia
2. **No hacer nada por 60 segundos**
3. **Resultado esperado:**
   - ✅ Sesión se cierra automáticamente
   - ✅ Redirección a `/login`
   - ✅ Mensaje en consola: "⏱️ Sesión cerrada por inactividad"

### **Prueba 4: Reset del Timer**
1. Después de 3 minutos de inactividad
2. **Mover el mouse o hacer scroll**
3. **Dejar sin tocar otros 3 minutos**
4. **Resultado esperado:**
   - ✅ Timer se resetea con la interacción
   - ✅ Advertencia aparece después de 4 minutos DESDE el último movimiento

### **Prueba 5: Solo para Usuarios Autenticados**
1. **Cerrar sesión manualmente**
2. **Estar en `/login` por 10 minutos**
3. **Resultado esperado:**
   - ✅ NO aparece advertencia
   - ✅ Sistema solo activo en sesiones autenticadas

---

## 🔒 Seguridad

### **Validación en Frontend:**
- El sistema solo se activa si `isAuthenticated === true`
- Se limpia automáticamente al cerrar sesión
- No se ejecuta en rutas públicas (`/login`, `/registro`, etc.)

### **Validación en Backend:**
- El token JWT **ya tiene expiración propia** configurada en el backend
- Si el token expira antes de los 5 minutos, el backend rechazará las peticiones
- El frontend detectará el error 401 y cerrará sesión automáticamente

### **Doble Capa de Protección:**
1. **Frontend**: Cierra sesión por inactividad (UX)
2. **Backend**: Token JWT con expiración (Seguridad)

---

## 🐛 Solución de Problemas

### **Problema: El timer no se resetea con interacciones**
**Solución:** 
- Verifica que los eventos estén registrados correctamente
- Abre la consola del navegador y busca mensajes de error
- Asegúrate de que `isAuthenticated` sea `true`

### **Problema: La advertencia no aparece**
**Solución:**
- Verifica que el componente `<InactivityWarning />` esté en `App.jsx`
- Revisa que el tiempo de advertencia sea menor que el timeout total
- Ejemplo: `timeout: 5min`, `warningTime: 1min` ✅

### **Problema: Se cierra sesión inmediatamente**
**Solución:**
- Revisa que los valores de `timeout` y `warningTime` estén en milisegundos
- Ejemplo correcto: `5 * 60 * 1000` (5 minutos en ms)

### **Problema: La advertencia aparece en `/login`**
**Solución:**
- El sistema verifica `isAuthenticated` antes de activarse
- Si aparece en login, revisa el `authStore` y asegúrate de que el logout limpie el estado correctamente

---

## 📊 Ventajas de esta Implementación

✅ **Sin dependencias externas** - Solo usa React hooks y MUI
✅ **Configurable** - Tiempos ajustables fácilmente
✅ **UX mejorado** - Advertencia antes de cerrar sesión
✅ **Ligero** - No consume recursos significativos
✅ **Compatible** - Funciona en todos los navegadores modernos
✅ **Responsive** - Funciona en desktop y móviles

---

## 🔄 Alternativas

### **Opción A: Sin advertencia visual (hook simple)**
```jsx
import { useInactivityTimer } from '@ganchos/useInactivityTimer'

function App() {
  useInactivityTimer(5 * 60 * 1000)
  // Cierra sesión silenciosamente sin advertencia
}
```

### **Opción B: Con advertencia (componente actual)**
```jsx
import { InactivityWarning } from '@componentes/common/InactivityWarning'

function App() {
  return (
    <>
      <InactivityWarning timeout={5 * 60 * 1000} warningTime={1 * 60 * 1000} />
      {/* ... */}
    </>
  )
}
```

**Recomendación:** Opción B (actual) - Mejor UX

---

## 📝 Notas Importantes

1. **El sistema solo se activa en sesiones autenticadas**
2. **Cualquier interacción del usuario resetea el timer**
3. **El diálogo de advertencia NO se puede cerrar con clic afuera** (debe tomar acción)
4. **El logout se ejecuta con `authStore.logout()`** (limpia token y estado)
5. **Compatible con el sistema de roles existente**

---

## 🚀 Próximas Mejoras (Opcional)

1. **Persistir tiempo de inactividad en localStorage** - Mantener el timer entre recargas
2. **Notificación sonora** - Alerta audible cuando aparezca la advertencia
3. **Registro de cierre por inactividad** - Enviar evento al backend para auditoría
4. **Configuración por rol** - ADMIN puede tener más tiempo que ESTUDIANTE

---

**Fecha de Implementación:** 28 de noviembre de 2025  
**Versión:** 1.0  
**Tiempo de Inactividad Configurado:** 5 minutos  
**Tiempo de Advertencia:** 1 minuto
