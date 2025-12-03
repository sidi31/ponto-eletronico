const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRES_IN || '8h';

async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ message: 'Email e senha obrigatórios' });
  try {
    const result = await db.query('SELECT * FROM servidores WHERE email = $1', [email]);
    if (result.rowCount === 0) return res.status(401).json({ message: 'Usuário não encontrado' });
    const user = result.rows[0];
    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) return res.status(401).json({ message: 'Senha incorreta' });
    const token = jwt.sign({ id: user.id, isAdmin: user.is_admin }, SECRET, { expiresIn: EXPIRES });
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, isAdmin: user.is_admin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}

async function registerAdmin(req, res) {
  // Endpoint usado apenas para criar um admin inicial. Em produção, remova ou proteja.
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ message: 'Dados incompletos' });
  try {
    const hashed = await bcrypt.hash(senha, 10);
    const q = `INSERT INTO servidores (nome, email, senha_hash, is_admin) VALUES ($1, $2, $3, true) RETURNING id, nome, email`;
    const result = await db.query(q, [nome, email, hashed]);
    res.json({ admin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar admin' });
  }
}

module.exports = { login, registerAdmin };
