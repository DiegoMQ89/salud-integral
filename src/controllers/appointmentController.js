const {
    getAppointmentsByUser,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    cancelAppointment
  } = require('../models/appointmentModel');
  
  const listAppointments = async (req, res) => {
    try {
      const appointments = await getAppointmentsByUser(req.user.id);
      res.json(appointments);
    } catch (err) {
      console.error('Error listando citas:', err);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };
  
  const addAppointment = async (req, res) => {
    const { type, date, notes } = req.body;
    try {
      // Verificar que no exista ya una cita en la misma fecha y hora (no cancelada)
      const existing = await getAppointmentsByUser(req.user.id);
      const conflict = existing.find(a => a.date.toISOString() === new Date(date).toISOString() && a.status !== 'cancelada');
      if (conflict) {
        return res.status(400).json({ message: 'Ya tienes una cita en esa fecha y hora' });
      }
      const appointment = await createAppointment({
        userId: req.user.id,
        type, date, notes
      });
      res.status(201).json(appointment);
    } catch (err) {
      console.error('Error creando cita:', err);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };
  
  const editAppointment = async (req, res) => {
    const { id } = req.params;
    const { type, date, notes } = req.body;
    try {
      const appointment = await getAppointmentById(id);
      if (!appointment || appointment.user_id !== req.user.id) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
      const updated = await updateAppointment(id, { type, date, notes });
      res.json(updated);
    } catch (err) {
      console.error('Error actualizando cita:', err);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };
  
  const removeAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      const appointment = await getAppointmentById(id);
      if (!appointment || appointment.user_id !== req.user.id) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
      const cancelled = await cancelAppointment(id);
      res.json({ message: 'Cita cancelada', appointment: cancelled });
    } catch (err) {
      console.error('Error cancelando cita:', err);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };
  
  module.exports = {
    listAppointments,
    addAppointment,
    editAppointment,
    removeAppointment
  };
  