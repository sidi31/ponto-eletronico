const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token inválido' });
  const token = parts[1];
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Falha na autenticação do token' });
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.isAdmin) return res.status(403).json({ message: 'Acesso negado. Admins apenas.' });
  next();
}

module.exports = { verifyToken, requireAdmin };
