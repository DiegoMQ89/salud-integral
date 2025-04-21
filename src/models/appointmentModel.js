const pool = require('../config/db');

const getAppointmentsByUser = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM appointments WHERE user_id = ? ORDER BY date',
    [userId]
  );
  return rows;
};

const getAppointmentById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM appointments WHERE id = ?',
    [id]
  );
  return rows[0];
};

const createAppointment = async ({ userId, type, date, notes }) => {
  const [result] = await pool.query(
    'INSERT INTO appointments (user_id, type, date, notes) VALUES (?, ?, ?, ?)',
    [userId, type, date, notes]
  );
  return getAppointmentById(result.insertId);
};

const updateAppointment = async (id, { type, date, notes }) => {
  await pool.query(
    'UPDATE appointments SET type = ?, date = ?, notes = ? WHERE id = ?',
    [type, date, notes, id]
  );
  return getAppointmentById(id);
};

const cancelAppointment = async (id) => {
  await pool.query(
    'UPDATE appointments SET status = "cancelada" WHERE id = ?',
    [id]
  );
  return getAppointmentById(id);
};

module.exports = {
  getAppointmentsByUser,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment
};
