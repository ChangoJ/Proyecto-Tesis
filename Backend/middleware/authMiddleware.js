const jwt = require('jsonwebtoken');
secretKey = 'MRCHANGO&CRISMASTERSON';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: 'Token de autenticación inválido' });
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = {
  authenticateToken,
};