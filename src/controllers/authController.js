const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const { findUserByEmail, createUser } = require('../models/userModel');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verificar email único
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }
    // Hashear contraseña
    const salt    = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);
    // Crear usuario
    const user = await createUser({ name, email, password: hashPwd });
    // Generar token
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    // Generar token
    const token = generateToken(user);
    // No devolvemos la contraseña
    const { id, name, role_id } = user;
    res.json({ user: { id, name, email, role_id }, token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { register, login };
