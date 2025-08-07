# Two to Tango 💃🕺

Una aplicación web moderna para la gestión y descubrimiento de eventos sociales. Conecta con personas que comparten tus intereses y encuentra eventos emocionantes en tu área.

## 🚀 Características

- **Autenticación de usuarios** - Registro e inicio de sesión seguro
- **Gestión de perfiles** - Personaliza tu perfil con intereses
- **Creación de eventos** - Organiza tus propios eventos
- **Búsqueda y filtrado** - Encuentra eventos por intereses del organizador
- **Sistema RSVP** - Confirma tu asistencia a eventos
- **Interfaz moderna** - Diseño responsive con Tailwind CSS

## 🛠️ Tecnologías

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios

### Backend
- NestJS
- Prisma ORM
- SQLite
- JWT Authentication
- bcrypt

## 📋 Configuración del Proyecto

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Git

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd two-to-tango
```

### 2. Instalar dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Configurar variables de entorno

#### Backend
Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="tu_jwt_secret_muy_seguro_aqui"
JWT_EXPIRES_IN="7d"

# Application
PORT=3001
```

#### Frontend
Crea un archivo `.env.local` en la carpeta `frontend/` con el siguiente contenido:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Inicializar la base de datos

```bash
cd backend

# Generar el cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Poblar la base de datos con datos de ejemplo
npm run seed
```

### 5. Ejecutar la aplicación

#### Iniciar el backend
```bash
cd backend
npm run start:dev
```
El backend estará disponible en: `http://localhost:3001`

#### Iniciar el frontend (en otra terminal)
```bash
cd frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:3000`

### 6. Acceder a herramientas adicionales

#### Prisma Studio (opcional)
Para visualizar y editar la base de datos:
```bash
cd backend
npx prisma studio
```
Disponible en: `http://localhost:5555`

## 👤 Credenciales de Prueba

Puedes usar las siguientes credenciales para probar la aplicación:

### Usuario de Prueba 1
- **Email:** `john.doe@example.com`
- **Contraseña:** `password123`
- **Nombre:** John Doe
- **Intereses:** Dancing, Music, Technology

### Usuario de Prueba 2
- **Email:** `jane.smith@example.com`
- **Contraseña:** `password123`
- **Nombre:** Jane Smith
- **Intereses:** Art, Photography, Reading

### Usuario de Prueba 3
- **Email:** `mike.johnson@example.com`
- **Contraseña:** `password123`
- **Nombre:** Mike Johnson
- **Intereses:** Sports, Travel, Food

> **Nota:** Estos usuarios se crean automáticamente al ejecutar el comando `npm run seed` en el backend.

## 📸 Capturas de Pantalla

### Página de Inicio de Sesión
![Login Page](screenshots/login.png)
*Interfaz de autenticación con diseño moderno y responsive*

### Lista de Eventos
![Events List](screenshots/events-list.png)
*Vista principal mostrando eventos disponibles con filtros por intereses*

### Página de Perfil
![Profile Page](screenshots/profile.png)
*Gestión de perfil de usuario con selección de intereses*

### Búsqueda de Eventos
![Events Search](screenshots/events-search.png)
*Funcionalidad de búsqueda y filtrado de eventos*

## 🌐 Demo en Vivo

[ENLACE_DEMO]

> **Nota:** Si el enlace de demo no está disponible, puedes ejecutar la aplicación localmente siguiendo las instrucciones de configuración.

## 📁 Estructura del Proyecto

```
two-to-tango/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   ├── auth/
│   │   ├── events/
│   │   ├── interests/
│   │   ├── users/
│   │   └── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── auth/
│   │       ├── events/
│   │       ├── profile/
│   │       └── services/
│   └── package.json
└── README.md
```

## 🔧 Scripts Disponibles

### Backend
- `npm run start:dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run seed` - Pobla la base de datos con datos de ejemplo
- `npm run test` - Ejecuta las pruebas

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Asegúrate de que el archivo `.env` esté configurado correctamente
- Ejecuta `npx prisma generate` y `npx prisma db push`

### Error de CORS
- Verifica que las URLs en las variables de entorno sean correctas
- Asegúrate de que el backend esté ejecutándose en el puerto 3001

### Problemas con dependencias
- Elimina `node_modules` y `package-lock.json`
- Ejecuta `npm install` nuevamente

## 📝 Funcionalidades Principales

1. **Autenticación**
   - Registro de nuevos usuarios
   - Inicio de sesión con JWT
   - Protección de rutas

2. **Gestión de Eventos**
   - Crear nuevos eventos
   - Ver lista de eventos
   - Filtrar por intereses del organizador
   - Sistema RSVP

3. **Perfiles de Usuario**
   - Editar información personal
   - Seleccionar intereses
   - Ver eventos creados

4. **Búsqueda y Filtrado**
   - Buscar eventos por título
   - Filtrar por intereses
   - Vista de eventos sugeridos

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

¡Disfruta usando Two to Tango! 🎉