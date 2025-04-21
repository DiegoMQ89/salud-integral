const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Incluimos id y rol en el payload
  return jwt.sign(
    { id: user.id, role: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

module.exports = generateToken;
