# Resumen del Proyecto: user-inv

## Descripción General

`user-inv` es una aplicación web construida con Next.js y TypeScript, diseñada para la gestión de inventario de usuarios. La interfaz de usuario está desarrollada con Material-UI (MUI), lo que le da un aspecto moderno y profesional. El proyecto está configurado con ESLint para mantener la calidad del código y sigue las mejores prácticas de desarrollo de Next.js.

## Características Principales

- **Gestión de Usuarios:** La funcionalidad central de la aplicación es la gestión de usuarios. Permite ver una lista de usuarios, con detalles como nombre, nombre de usuario, correo electrónico, rol y teléfono.
- **Interfaz de Usuario Moderna:** Utiliza Material-UI para componentes de interfaz de usuario, como tarjetas, botones, íconos y un layout de panel de administración.
- **Panel de Administración:** Cuenta con un layout privado (`LayoutPrivado`) que incluye una barra de navegación superior y un menú lateral (Drawer) para la navegación principal.
- **Página de Inicio de Sesión:** Incluye una página de inicio de sesión (`/login`) con campos para correo y contraseña.
- **Componentes Reutilizables:** El componente `UserItem` se utiliza para mostrar la información de cada usuario de manera consistente.

## Estructura del Proyecto

El proyecto sigue la estructura estándar de una aplicación Next.js:

- **`src/app/`:** Contiene las rutas principales de la aplicación.
  - **`layout.tsx`:** El layout raíz de la aplicación.
  - **`page.tsx`:** La página de inicio, que actualmente renderiza la página de gestión de usuarios.
  - **`login/page.tsx`:** La página de inicio de sesión.
- **`src/components/`:** Contiene componentes de React reutilizables.
  - **`userItem.tsx`:** Componente para mostrar la información de un usuario.
- **`src/layouts/`:** Contiene los layouts de la aplicación.
  - **`LayoutPrivado.tsx`:** Layout para las páginas privadas que requieren autenticación.
- **`src/users/`:** Contiene las páginas relacionadas con la gestión de usuarios.
  - **`page.tsx`:** La página principal para la gestión de usuarios.
- **`public/`:** Contiene los archivos estáticos, como imágenes y SVGs.
- **`package.json`:** Define los scripts y dependencias del proyecto, que incluyen `next`, `react`, `react-dom`, `@mui/material`, `@emotion/react`, y `@emotion/styled`.

## Scripts Disponibles

- **`npm run dev`:** Inicia el servidor de desarrollo con Turbopack.
- **`npm run build`:** Compila la aplicación para producción.
- **`npm run start`:** Inicia el servidor de producción.
- **`npm run lint`:** Ejecuta ESLint para analizar el código en busca de errores y problemas de estilo.

## Próximos Pasos

- **Implementar la lógica de autenticación:** Conectar la página de inicio de sesión a un servicio de autenticación real.
- **Conectar a una base de datos:** Reemplazar los datos de ejemplo en `users/page.tsx` con datos de una base de datos.
- **Implementar la funcionalidad de edición y eliminación:** Agregar la lógica para editar y eliminar usuarios.
- **Mejorar la UI/UX:** Añadir feedback al usuario en las acciones de editar/eliminar, implementar paginación o búsqueda si la lista de usuarios crece.
- **Crear un loop para la lista de usuarios:** En `src/users/page.tsx`, iterar sobre una lista de usuarios para renderizar dinámicamente los componentes `UserItem`. **HECHO**
- **Refactorizar `UserItem` para aceptar props:** El componente `UserItem` ha sido refactorizado para aceptar las propiedades de un usuario y mostrarlas dinámicamente. **HECHO**
