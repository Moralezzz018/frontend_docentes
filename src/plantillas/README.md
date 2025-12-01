# 📧 Plantillas de Correo - Frontend

Este directorio contiene las plantillas de correo electrónico profesionales usando **React Email**, renderizadas en el frontend.

## 📋 Plantillas Disponibles

### 1. RecuperacionPassword.jsx
Plantilla para el envío del código PIN de recuperación de contraseña.

**Parámetros:**
- `pin` (string): Código PIN de 6 dígitos
- `nombreUsuario` (string): Nombre del usuario

## 🎨 Servicio de Correo

El archivo `servicios/correoService.js` proporciona funciones para renderizar y enviar correos:

### generarCorreoRecuperacion(pin, nombreUsuario)
Genera el HTML de la plantilla de recuperación de contraseña.

```javascript
import { generarCorreoRecuperacion } from '@servicios/correoService';

const html = await generarCorreoRecuperacion('123456', 'Juan Pérez');
```

### enviarCorreoRecuperacion(correo, pin, nombreUsuario)
Renderiza la plantilla y envía el correo al backend.

```javascript
import { enviarCorreoRecuperacion } from '@servicios/correoService';

await enviarCorreoRecuperacion('usuario@mail.com', '123456', 'Juan Pérez');
```

## 🔄 Flujo de Trabajo

1. **Frontend** genera el PIN en el backend: `/api/usuarios/solicitar-restablecimiento`
2. **Frontend** renderiza la plantilla usando React Email
3. **Frontend** envía el HTML al endpoint: `/api/correo/enviar`
4. **Backend** envía el correo usando Nodemailer

## 🎯 Ventajas de este Enfoque

- ✅ **Componentes React reutilizables**: Las plantillas son componentes React normales
- ✅ **Preview en desarrollo**: Puedes ver las plantillas en Storybook o en la app
- ✅ **TypeScript friendly**: Soporte completo para tipos
- ✅ **Hot reload**: Cambios en plantillas se reflejan inmediatamente
- ✅ **Testing**: Puedes testear las plantillas como cualquier componente
- ✅ **Separación de responsabilidades**: Backend solo envía, frontend diseña

## 📦 Dependencias

```json
{
  "react-email": "^latest",
  "@react-email/components": "^latest"
}
```

## 🏗️ Estructura

```
src/
├── plantillas/
│   ├── RecuperacionPassword.jsx
│   └── README.md
└── servicios/
    └── correoService.js
```

## 🔧 Personalización

Los estilos están definidos como objetos JavaScript al final de cada archivo de plantilla. Puedes modificar:

- Colores principales
- Tipografía  
- Espaciados
- Tamaños de fuente
- Bordes y sombras

## 📝 Crear Nueva Plantilla

1. Crear archivo en `src/plantillas/NuevaPlantilla.jsx`
2. Usar componentes de `@react-email/components`
3. Agregar función en `correoService.js` para renderizar
4. Usar en tu componente

```jsx
import RecuperacionPasswordEmail from '../plantillas/RecuperacionPassword';
import { render } from '@react-email/render';

const html = await render(<RecuperacionPasswordEmail pin="123456" />);
```

## 🌐 Integración con Backend

El backend expone el endpoint `/api/correo/enviar`:

```javascript
POST /api/correo/enviar
{
  "destinatario": "usuario@mail.com",
  "asunto": "Asunto del correo",
  "contenido": "<html>...</html>",
  "docenteId": 123 // opcional
}
```
