# Two to Tango 💃🕺

Una aplicación web completa para la gestión de eventos y conexión de personas con intereses similares. Los usuarios pueden crear eventos, buscar eventos por intereses, y conectar con otras personas que comparten sus pasiones.

## 🏗️ Arquitectura del Proyecto

El proyecto está dividido en dos partes principales:

- **Backend**: API REST construida con NestJS, Prisma ORM y SQLite
- **Frontend**: Aplicación web construida con Next.js 15, React 19 y TailwindCSS

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- **Git** - [Descargar aquí](https://git-scm.com/)

### Verificar instalaciones

```bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar 8.x.x o superior
git --version   # Debe mostrar la versión de Git
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd two-to-tango
```

### 2. Instalar dependencias del proyecto raíz

```bash
npm install
```

### 3. Configurar el Backend

#### 3.1 Navegar al directorio del backend

```bash
cd backend
```

#### 3.2 Instalar dependencias del backend

```bash
npm install
```

#### 3.3 Configurar variables de entorno

Crea un archivo `.env` en el directorio `backend/` con el siguiente contenido:

```env
# Base de datos SQLite
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="tu_clave_secreta_muy_segura_aqui"
JWT_EXPIRATION="24h"

# Puerto del servidor (opcional, por defecto 3001)
PORT=3001
```

**⚠️ Importante**: Cambia `tu_clave_secreta_muy_segura_aqui` por una clave secreta real y segura.

#### 3.4 Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones para crear las tablas
npx prisma migrate deploy

# Poblar la base de datos con datos de ejemplo (opcional)
npm run seed
```

### 4. Configurar el Frontend

#### 4.1 Abrir una nueva terminal y navegar al directorio del frontend

```bash
cd frontend
```

#### 4.2 Instalar dependencias del frontend

```bash
npm install
```

#### 4.3 Configurar variables de entorno (opcional)

Crea un archivo `.env.local` en el directorio `frontend/` si necesitas personalizar la URL del backend:

```env
# URL del backend (opcional, por defecto http://localhost:3001/api)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🏃‍♂️ Ejecutar la Aplicación

### Opción 1: Ejecutar ambos servicios por separado

#### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

El backend estará disponible en: `http://localhost:3001`

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### Opción 2: Ejecutar desde el directorio raíz (si está configurado)

```bash
# Desde el directorio raíz del proyecto
npm run dev:backend   # En una terminal
npm run dev:frontend  # En otra terminal
```

## 🛠️ Tecnologías Utilizadas

### Backend

- **NestJS** (v11.0.1) - Framework de Node.js para construir APIs escalables
- **Prisma** (v6.13.0) - ORM moderno para TypeScript y Node.js
- **SQLite** - Base de datos ligera y sin configuración
- **JWT** - Autenticación basada en tokens
- **bcrypt** - Hashing de contraseñas
- **Passport** - Middleware de autenticación
- **TypeScript** (v5.7.3) - Superset tipado de JavaScript
- **Jest** - Framework de testing

### Frontend

- **Next.js** (v15.4.6) - Framework de React con SSR y SSG
- **React** (v19.1.0) - Biblioteca para construir interfaces de usuario
- **TypeScript** (v5) - Superset tipado de JavaScript
- **TailwindCSS** (v4) - Framework de CSS utilitario
- **React Hook Form** (v7.62.0) - Manejo de formularios
- **Zod** (v4.0.15) - Validación de esquemas
- **Axios** (v1.11.0) - Cliente HTTP
- **date-fns** (v4.1.0) - Utilidades para fechas
- **React Hot Toast** (v2.5.2) - Notificaciones
- **JWT Decode** (v4.0.0) - Decodificación de tokens JWT

## 📁 Estructura del Proyecto

```
two-to-tango/
├── backend/                 # API Backend (NestJS)
│   ├── src/
│   │   ├── auth/           # Módulo de autenticación
│   │   ├── events/         # Módulo de eventos
│   │   ├── interests/      # Módulo de intereses
│   │   ├── users/          # Módulo de usuarios
│   │   ├── prisma/         # Servicio de Prisma
│   │   └── main.ts         # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma   # Esquema de base de datos
│   │   ├── migrations/     # Migraciones de DB
│   │   └── seed.ts         # Datos de ejemplo
│   └── package.json
├── frontend/               # Aplicación Frontend (Next.js)
│   ├── src/app/
│   │   ├── auth/          # Páginas de autenticación
│   │   ├── events/        # Páginas de eventos
│   │   ├── components/    # Componentes reutilizables
│   │   ├── services/      # Servicios de API
│   │   ├── hooks/         # Hooks personalizados
│   │   └── layout.tsx     # Layout principal
│   └── package.json
├── Imagenes/              # Screenshots del proyecto
└── package.json           # Dependencias del proyecto raíz
```

## 🔧 Scripts Disponibles

### Backend

```bash
npm run start:dev    # Ejecutar en modo desarrollo con hot reload
npm run build        # Construir para producción
npm run start        # Ejecutar en modo producción
npm run test         # Ejecutar tests
npm run seed         # Poblar base de datos con datos de ejemplo
npm run lint         # Ejecutar linter
npm run format       # Formatear código con Prettier
```

### Frontend

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar build de producción
npm run lint         # Ejecutar linter
```

## 🗄️ Base de Datos

El proyecto utiliza SQLite como base de datos, que se crea automáticamente en `backend/prisma/dev.db`. El esquema incluye:

- **Users**: Usuarios del sistema con autenticación
- **Events**: Eventos creados por usuarios
- **Interests**: Intereses que pueden tener los usuarios
- **Tags**: Etiquetas para categorizar eventos
- **RSVP**: Confirmaciones de asistencia a eventos

### Herramientas de Base de Datos

```bash
# Ver la base de datos en el navegador
cd backend
npx prisma studio
```

Esto abrirá Prisma Studio en `http://localhost:5555`

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación:

- Los tokens se almacenan en localStorage del navegador
- Los tokens tienen una duración de 24 horas por defecto
- Las rutas protegidas requieren autenticación

## 🌐 API Endpoints

El backend expone los siguientes endpoints principales:

- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento
- `GET /api/events/:id` - Obtener evento específico
- `GET /api/interests` - Listar intereses
- `GET /api/users/:id` - Obtener perfil de usuario

## 🎨 Características Principales

- ✅ Registro y autenticación de usuarios
- ✅ Creación y gestión de eventos
- ✅ Búsqueda de eventos por intereses
- ✅ Sistema de confirmación de asistencia (RSVP)
- ✅ Perfiles de usuario con intereses
- ✅ Interfaz responsive y moderna
- ✅ Notificaciones en tiempo real
- ✅ Validación de formularios

## 🐛 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"

```bash
cd backend
npx prisma generate
```

### Error: "Database does not exist"

```bash
cd backend
npx prisma migrate deploy
```

### Error de puerto en uso

Si el puerto 3001 (backend) o 3000 (frontend) están en uso:

```bash
# Para encontrar y terminar procesos en el puerto
lsof -ti:3001 | xargs kill -9  # Para puerto 3001
lsof -ti:3000 | xargs kill -9  # Para puerto 3000
```

### Problemas con dependencias

```bash
# Limpiar cache de npm y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas Adicionales

- El proyecto está configurado para desarrollo local
- La base de datos SQLite se crea automáticamente
- Los datos de ejemplo se pueden cargar con `npm run seed`
- El proyecto incluye ESLint y Prettier para mantener calidad de código
- Todas las rutas del frontend están protegidas excepto login y register

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

---

¡Disfruta usando Two to Tango! 🎉