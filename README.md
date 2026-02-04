# CRUDTASK - Sistema de Gestión de Tareas Académicas

Sistema completo de gestión de tareas académicas desarrollado con HTML, CSS (Bootstrap Icons), JavaScript Vanilla y JSON Server.

## 📋 Descripción del Proyecto

CRUDTASK es una aplicación web que permite a usuarios y administradores gestionar tareas académicas de manera eficiente. El sistema cuenta con autenticación de usuarios, manejo de roles (user/admin), y todas las operaciones CRUD para tareas.

## 🎯 Características Principales

### Módulo de Usuario (User)
- ✅ Registro de cuenta nueva (rol "user" asignado automáticamente)
- ✅ Inicio de sesión con validación de credenciales
- ✅ Gestión de tareas propias (listar, crear, editar, eliminar)
- ✅ Cambio de estado de tareas (Pending, In Progress, Completed)
- ✅ Visualización y edición de perfil
- ✅ Dashboard con estadísticas personales
- ✅ Búsqueda y filtrado de tareas

### Módulo de Administrador (Admin)
- ✅ Inicio de sesión con rol admin
- ✅ Dashboard con métricas globales del sistema
- ✅ Gestión de todas las tareas (ver, editar, eliminar)
- ✅ Asignación de tareas a usuarios
- ✅ Cambio de estados de cualquier tarea
- ✅ Vista de todos los usuarios del sistema
- ✅ Búsqueda y filtrado avanzado

### Funcionalidades Generales
- ✅ Sistema de autenticación completo
- ✅ Manejo de sesión con SessionStorage
- ✅ Protección de rutas según rol
- ✅ Diseño responsive
- ✅ Interfaz moderna y profesional
- ✅ Validación de formularios
- ✅ Alertas y notificaciones
- ✅ API RESTful con JSON Server

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados con variables CSS
- **Bootstrap Icons 1.11.3**: Sistema de iconos
- **JavaScript (Vanilla)**: Lógica de aplicación sin frameworks

### Backend (Simulado)
- **JSON Server**: API REST falsa para simulación

## 📁 Estructura del Proyecto

```
crudtask/
├── index.html              # Página de login
├── register.html           # Página de registro
├── dashboard.html          # Dashboard de usuario
├── admin-dashboard.html    # Dashboard de administrador
├── create-task.html        # Crear/editar tareas
├── profile.html            # Perfil de usuario
├── css/
│   ├── styles.css          # Estilos globales
│   └── dashboard.css       # Estilos de dashboard
├── js/
│   ├── config.js           # Configuración y utilidades
│   ├── auth.js             # Autenticación
│   ├── dashboard.js        # Dashboard de usuario
│   ├── admin-dashboard.js  # Dashboard de admin
│   ├── create-task.js      # Gestión de tareas
│   └── profile.js          # Gestión de perfil
├── data/
│   └── db.json             # Base de datos JSON Server
└── README.md               # Documentación
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm (normalmente viene con Node.js)

### Paso 1: Instalar JSON Server

```bash
npm install -g json-server
```

### Paso 2: Iniciar el Servidor

Desde el directorio raíz del proyecto:

```bash
json-server --watch data/db.json --port 3000
```

El servidor estará disponible en: `http://localhost:3000`

### Paso 3: Abrir la Aplicación

Abre el archivo `index.html` en tu navegador web, o usa un servidor local como Live Server (extensión de VS Code).

**Opción con Live Server:**
```bash
# Si tienes VS Code con Live Server instalado
# Click derecho en index.html > Open with Live Server
```

## 👥 Usuarios de Prueba

### Usuario Administrador
- **Email**: `admin@crudzaso.com`
- **Password**: `admin123`
- **Rol**: admin

### Usuario Normal
- **Email**: `student@university.edu`
- **Password**: `student123`
- **Rol**: user

## 🔐 Sistema de Autenticación

### Flujo de Registro
1. Usuario completa formulario de registro
2. Sistema valida datos (email único, contraseñas coinciden)
3. Usuario se crea con rol "user" automáticamente
4. Sesión se guarda en SessionStorage
5. Redirección a dashboard de usuario

### Flujo de Login
1. Usuario ingresa credenciales
2. Sistema valida contra API
3. Sesión se guarda con datos del usuario
4. Redirección según rol:
   - Admin → `admin-dashboard.html`
   - User → `dashboard.html`

### Protección de Rutas
Cada página protegida verifica:
- ✅ Existencia de sesión activa
- ✅ Rol apropiado para la página
- ✅ Redirige a login si no hay sesión
- ✅ Redirige a dashboard correcto si rol no coincide

## 📊 Funcionalidades de Tareas

### Usuario Normal (User)
- **Ver**: Solo sus propias tareas
- **Crear**: Tareas asignadas automáticamente a sí mismo
- **Editar**: Solo sus propias tareas
- **Eliminar**: Solo sus propias tareas
- **Cambiar estado**: De sus propias tareas

### Administrador (Admin)
- **Ver**: Todas las tareas del sistema
- **Crear**: Tareas y asignarlas a cualquier usuario
- **Editar**: Cualquier tarea
- **Eliminar**: Cualquier tarea
- **Cambiar estado**: De cualquier tarea
- **Ver métricas**: Estadísticas globales del sistema

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: `#2563eb` (Azul)
- **Éxito**: `#10b981` (Verde)
- **Advertencia**: `#f59e0b` (Naranja)
- **Peligro**: `#ef4444` (Rojo)
- **Secundario**: `#64748b` (Gris)

### Componentes UI
- Cards con sombras sutiles
- Badges de estado con colores semánticos
- Botones con hover effects
- Formularios con validación visual
- Tablas responsivas
- Sidebar fijo con navegación
- Header con información de usuario
- Estadísticas con iconos

### Responsive Design
- Desktop: Sidebar completo + contenido principal
- Tablet: Sidebar reducido
- Mobile: Sidebar colapsable, tabla scrollable

## 🔧 API Endpoints (JSON Server)

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario específico
- `POST /users` - Crear nuevo usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Tareas
- `GET /tasks` - Obtener todas las tareas
- `GET /tasks/:id` - Obtener tarea específica
- `POST /tasks` - Crear nueva tarea
- `PUT /tasks/:id` - Actualizar tarea
- `PATCH /tasks/:id` - Actualizar parcialmente
- `DELETE /tasks/:id` - Eliminar tarea

### Búsqueda y Filtrado
JSON Server soporta query parameters:
- `GET /tasks?assigneeId=2` - Tareas de un usuario
- `GET /tasks?status=Pending` - Tareas pendientes
- `GET /tasks?priority=High` - Tareas de alta prioridad

## 📱 Páginas de la Aplicación

### 1. Login (`index.html`)
- Formulario de inicio de sesión
- Validación de credenciales
- Toggle de visibilidad de contraseña
- Link a registro

### 2. Registro (`register.html`)
- Formulario de registro completo
- Validación de email único
- Confirmación de contraseña
- Asignación automática de rol "user"

### 3. Dashboard Usuario (`dashboard.html`)
- Estadísticas personales
- Tabla de tareas propias
- Filtros por estado
- Búsqueda de tareas
- Botón para crear nueva tarea

### 4. Dashboard Admin (`admin-dashboard.html`)
- Estadísticas globales del sistema
- Tabla con todas las tareas
- Información de usuarios asignados
- Gestión completa de tareas

### 5. Crear/Editar Tarea (`create-task.html`)
- Formulario completo de tarea
- Campo de asignación (solo para admin)
- Validación de campos requeridos
- Modo creación y edición

### 6. Perfil (`profile.html`)
- Información del usuario
- Edición de datos personales
- Cambio de contraseña
- Avatar con iniciales

## 🔒 Reglas de Seguridad

1. **Validación de Sesión**: Todas las páginas protegidas verifican sesión activa
2. **Validación de Rol**: Los usuarios no pueden acceder a vistas de admin
3. **Validación de Datos**: Todos los formularios validan entrada de usuario
4. **Protección CSRF**: SessionStorage en lugar de cookies
5. **Sanitización**: Prevención de XSS en inputs

## 🐛 Solución de Problemas

### JSON Server no inicia
```bash
# Verificar que está instalado
json-server --version

# Reinstalar si es necesario
npm install -g json-server
```

### Error de CORS
JSON Server incluye CORS por defecto. Si hay problemas:
```bash
json-server --watch data/db.json --port 3000 --host 0.0.0.0
```

### Las tareas no se cargan
1. Verificar que JSON Server está corriendo
2. Abrir `http://localhost:3000/tasks` en el navegador
3. Verificar que el archivo `data/db.json` existe

### No se puede iniciar sesión
1. Verificar credenciales en `data/db.json`
2. Verificar que la API responde: `http://localhost:3000/users`
3. Revisar la consola del navegador para errores

## 📈 Mejoras Futuras

- [ ] Backend real con Node.js + Express
- [ ] Base de datos PostgreSQL o MongoDB
- [ ] Autenticación con JWT
- [ ] Paginación de tareas
- [ ] Notificaciones en tiempo real
- [ ] Historial de cambios en tareas
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Adjuntar archivos a tareas
- [ ] Comentarios en tareas
- [ ] Sistema de notificaciones por email

## 👨‍💻 Desarrollo

### Agregar Nueva Tarea
1. Usuario llena formulario en `create-task.html`
2. JavaScript valida datos
3. POST a `/tasks` con datos de tarea
4. Redirección a dashboard correspondiente

### Editar Tarea
1. Click en botón editar (ícono lápiz)
2. Redirección a `create-task.html?id={taskId}`
3. Sistema carga datos de tarea
4. Usuario modifica y guarda
5. PUT a `/tasks/{id}` con datos actualizados

### Eliminar Tarea
1. Click en botón eliminar (ícono basura)
2. Confirmación con `confirm()`
3. DELETE a `/tasks/{id}`
4. Recarga de tabla de tareas

## 📝 Notas Importantes

- **Persistencia**: Los datos se guardan en `data/db.json` y persisten entre reinicios
- **Sesión**: La sesión se guarda en SessionStorage (se pierde al cerrar pestaña)
- **Roles**: Solo hay dos roles: "user" y "admin"
- **Validación**: Toda validación es del lado del cliente (en producción usar backend)

## 🤝 Contribuir

Este proyecto fue desarrollado como parte de una actividad académica siguiendo especificaciones estrictas.

## 📄 Licencia

Proyecto educativo - Todos los derechos reservados.

## ✨ Créditos

Desarrollado siguiendo las especificaciones del proyecto CRUDTASK para gestión de tareas académicas.
