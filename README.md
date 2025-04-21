# Salud Integral API & Frontend

Este proyecto consiste en una aplicación full-stack para la gestión de citas médicas, con un backend en Node.js y Express conectado a MySQL (mediante XAMPP) y un frontend estático servido desde Express.

---

## Tabla de contenidos
1. [Tecnologías](#tecnologías)
2. [Requisitos](#requisitos)
3. [Instalación](#instalación)
4. [Configuración de la base de datos](#configuración-de-la-base-de-datos)
5. [Variables de entorno](#variables-de-entorno)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Ejecutar en desarrollo](#ejecutar-en-desarrollo)
8. [Endpoints principales](#endpoints-principales)
9. [Funcionalidades](#funcionalidades)
10. [Modo oscuro & UI](#modo-oscuro--ui)
11. [Autor](#autor)

---

## Tecnologías
- **Node.js** (v16+)
- **Express**
- **MySQL** (XAMPP)
- **dotenv** para variables de entorno
- **cors** para Cross-Origin Resource Sharing
- **bcrypt** para hashear contraseñas
- **jsonwebtoken** para autenticación JWT
- **Frontend**: HTML, CSS (variables, flexbox), JavaScript puro

---
## Requisitos
- [Node.js](https://nodejs.org/) instalado
- [XAMPP](https://www.apachefriends.org/) con MySQL corriendo
- Navegador moderno

---
## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/salud-integral-api.git
   cd salud-integral-api
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```

---
## Configuración de la base de datos
1. Inicia Apache y MySQL desde XAMPP.
2. Accede a **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Crea la base de datos `salud_integral` con cotejamiento `utf8mb4_general_ci`.
4. Ejecuta el siguiente script SQL para crear tablas:
   ```sql
   USE salud_integral;

   CREATE TABLE roles (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(50) NOT NULL UNIQUE
   );
   INSERT INTO roles (name) VALUES ('admin'), ('user');

   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(150) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     role_id INT NOT NULL DEFAULT 2,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (role_id) REFERENCES roles(id)
   );

   CREATE TABLE appointments (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     type ENUM('medicina_general','odontologia') NOT NULL,
     date DATETIME NOT NULL,
     notes TEXT,
     status ENUM('pendiente','completada','cancelada') NOT NULL DEFAULT 'pendiente',
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

---
## Variables de entorno
Crea un archivo `.env` en la raíz con:
```dotenv
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=salud_integral
DB_PORT=3306

JWT_SECRET=TuSecretoParaJWT
JWT_EXPIRES_IN=1h

PORT=3000
```

---
## Estructura del proyecto
```
salud-integral-api/
├── public/             # Archivos estáticos served por Express
│   ├── *.html          # Páginas: index, login, register, appointments, create, edit, success
│   ├── css/            # Estilos con variables y tema oscuro
│   ├── js/             # Lógica de frontend (menu, auth, api, appointments, edit)
│   └── images/         # Iconos (menu-icon.png)
└── src/                # Backend
    ├── app.js          # Configuración Express (CORS, estáticos, rutas)
    ├── config/db.js    # Conexión MySQL con mysql2/promise
    ├── controllers/    # authController, appointmentController
    ├── middlewares/    # authMiddleware (JWT check)
    ├── models/         # userModel, appointmentModel
    ├── routes/         # authRoutes, appointmentRoutes
    └── utils/          # generateToken
```

---
## Ejecutar en desarrollo
```bash
npm run dev
```
- El servidor arranca en `http://localhost:3000`.
- El frontend se sirve automáticamente desde `/public`.

---
## Endpoints principales
- `GET /ping` → comprobar conexión BD
- **Auth**:
  - `POST /api/auth/register` → registro (name, email, password)
  - `POST /api/auth/login` → login (email, password)
- **Citas** (JWT required):
  - `GET /api/appointments` → listar citas del usuario
  - `GET /api/appointments/:id` → obtener datos de una cita
  - `POST /api/appointments` → crear cita
  - `PUT /api/appointments/:id` → editar cita
  - `DELETE /api/appointments/:id` → cancelar cita

---
## Funcionalidades
- Registro, login con JWT
- CRUD completo de citas (medicina general / odontología)
- Validación de token y permisos (solo dueño de la cita)
- UI responsiva con menú lateral desplegable
- Modo oscuro con persistencia de preferencia

---
## Modo oscuro & UI
- Toggle de tema en el header (🌙/☀️)
- Guardado de preferencia en `localStorage`
- Icono de menú coloreado con CSS `filter` en modo oscuro

---
## Autor
Diego Meza - Estudiante de Programación de Software, SENA

¡Listo! Con esta guía tendrás todo lo necesario para instalar, ejecutar y entender el proyecto.