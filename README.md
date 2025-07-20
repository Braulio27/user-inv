# Sistema de Inventario de Usuarios

Sistema de gestión de inventario de usuarios y equipos tecnológicos para la Municipalidad de Carrillo.

## 🚀 Características

### ✅ Implementadas
- **Dashboard interactivo** con métricas en tiempo real
- **Gestión de usuarios** con información completa de equipos
- **CRUD completo** de usuarios (crear, leer, actualizar, eliminar)
- **Modales interactivos** para crear y editar usuarios
- **Validación de formularios** con mensajes de error en tiempo real
- **Búsqueda y filtrado** de usuarios por nombre, departamento, etc.
- **Interfaz responsive** optimizada para móviles y desktop
- **Navegación mejorada** con menú lateral y breadcrumbs
- **Indicadores visuales** de estado (activo, inactivo, en reparación)
- **Accesibilidad mejorada** con aria-labels y navegación por teclado
- **Tipos TypeScript** centralizados y bien definidos
- **Arquitectura modular** con separación de datos y componentes
- **Notificaciones** con Snackbar para feedback del usuario
- **Validación de datos únicos** (número de empleado)

### 🔄 Funcionalidades Pendientes
- [ ] Autenticación y autorización
- [ ] Exportación de datos a CSV/Excel
- [ ] Paginación para listas grandes
- [ ] Filtros avanzados por departamento, estado, etc.
- [ ] Historial de cambios
- [ ] Notificaciones en tiempo real
- [ ] Backup automático de datos
- [ ] Búsqueda avanzada con múltiples criterios
- [ ] **Configuración del Sistema**:
  - [ ] Cambio de idioma (Español, Inglés)
  - [ ] Modo nocturno / tema oscuro
  - [ ] Sistema de notificaciones
  - [ ] Configuración de seguridad y permisos
  - [ ] Backup y restauración automática
  - [ ] Personalización de interfaz
  - [ ] Configuración de reportes

## 🛠️ Tecnologías

- **Frontend**: Next.js 15.4.2, React 19.1.0
- **UI**: Material-UI (MUI) 7.2.0
- **Lenguaje**: TypeScript 5
- **Estilos**: CSS Grid, Flexbox, Emotion
- **Herramientas**: ESLint, Next.js Lint

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Dashboard
│   └── login/             # Página de login
├── components/            # Componentes reutilizables
│   └── userItem.tsx       # Componente de tarjeta de usuario
├── layouts/               # Layouts específicos
│   └── LayoutPrivado.tsx  # Layout con navegación lateral
├── users/                 # Página de gestión de usuarios
│   └── page.tsx
├── types/                 # Definiciones de tipos TypeScript
│   └── user.ts
└── data/                  # Datos mock y utilidades
    └── users.ts
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd user-inv

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

### Scripts Disponibles
- `npm run dev` - Servidor de desarrollo con Turbopack
- `npm run build` - Construcción optimizada para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Verificación de código con ESLint

## 📊 Datos de Ejemplo

El sistema incluye datos mock de usuarios con información completa:
- Información personal y laboral
- Detalles del equipo asignado
- Estados de usuario y equipo
- Información técnica (Service Tag, MAC, etc.)

## 🔧 Funcionalidades CRUD

### Crear Usuario
- Modal con formulario completo y validación
- Campos obligatorios marcados con asterisco
- Validación de formato de dirección MAC
- Verificación de número de empleado único
- Valores por defecto para campos comunes

### Editar Usuario
- Modal pre-poblado con datos existentes
- Misma validación que crear usuario
- Actualización en tiempo real de la lista
- Preservación de datos no modificados

### Eliminar Usuario
- Confirmación antes de eliminar
- Eliminación inmediata de la lista
- Notificación de éxito

### Validaciones Implementadas
- Número de empleado: requerido y único
- Nombre completo: requerido
- Usuario: requerido
- Edificio: requerido (selección de lista)
- Departamento: requerido (selección de lista)
- Puesto: requerido (selección de lista)
- Service Tag: requerido
- Modelo: requerido
- Dirección MAC: requerido y formato válido

## 🎨 Características de UI/UX

- **Diseño responsive** que se adapta a diferentes tamaños de pantalla
- **Tema consistente** con Material-UI
- **Indicadores visuales** con chips de colores para estados
- **Navegación intuitiva** con menú lateral y breadcrumbs
- **Búsqueda en tiempo real** con filtrado instantáneo
- **Accesibilidad** siguiendo estándares WCAG

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_APP_NAME="Sistema de Inventario de Usuarios"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### TypeScript
El proyecto está configurado con TypeScript estricto para mayor seguridad de tipos.

## 📝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Material-UI por el sistema de componentes
- Next.js por el framework de React
- La comunidad de TypeScript por las herramientas de desarrollo
