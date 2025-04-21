const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, password, role_id FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0];
};

const createUser = async ({ name, email, password }) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  // Devolvemos el usuario recién creado
  const [rows] = await pool.query(
    'SELECT id, name, email, role_id FROM users WHERE id = ?',
    [result.insertId]
  );
  return rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
};
