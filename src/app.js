const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./config/db');
require('dotenv').config();

const app = express();

// 1) Habilitar CORS para todas las rutas (en desarrollo)
app.use(cors());

// 2) Parsear bodies en JSON
app.use(express.json());

// 3) Servir archivos estáticos del frontend
//    La carpeta 'public' está un nivel arriba de 'src'
app.use(express.static(path.join(__dirname, '..', 'public')));

// 4) Ruta de prueba para verificar conexión a la BD
app.get('/ping', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ db: rows[0].result, status: 'API funcionando' });
  } catch (err) {
    console.error('Error al conectar a la BD:', err);
    res.status(500).json({ error: 'No se pudo conectar a la base de datos' });
  }
});

// 5) Rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 6) Rutas de citas (todas protegidas con JWT en el middleware)
const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

// 7) Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
