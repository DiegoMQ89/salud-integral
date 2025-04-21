const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  listAppointments,
  addAppointment,
  editAppointment,
  removeAppointment
} = require('../controllers/appointmentController');
const { getAppointmentById } = require('../models/appointmentModel');

// Todas las rutas requieren autenticación
router.use(auth);

// GET /api/appointments
router.get('/', listAppointments);

// GET /api/appointments/:id → detalles de una cita
router.get('/:id', async (req, res) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    if (!appointment || appointment.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    res.json(appointment);
  } catch (err) {
    console.error('Error al obtener cita:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// POST /api/appointments
router.post('/', addAppointment);

// PUT /api/appointments/:id
router.put('/:id', editAppointment);

// DELETE /api/appointments/:id
router.delete('/:id', removeAppointment);

module.exports = router;

