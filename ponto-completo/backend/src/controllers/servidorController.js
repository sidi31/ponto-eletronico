const db = require('../config/db');
const bcrypt = require('bcrypt');

async function createServidor(req, res) {
  const { nome, matricula, cpf, email, cargo, senha, is_admin } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  try {
    const hash = await bcrypt.hash(senha, 10);
    const q = `INSERT INTO servidores (nome, matricula, cpf, email, cargo, senha_hash, is_admin)
               VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,nome,email`;
    const r = await db.query(q, [nome, matricula, cpf, email, cargo, hash, !!is_admin]);
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar servidor', err: err.message });
  }
}

async function listServidores(req, res) {
  try {
    const r = await db.query('SELECT id, nome, matricula, cpf, email, cargo, status FROM servidores ORDER BY nome');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar servidores' });
  }
}

async function getServidor(req, res) {
  try {
    const r = await db.query('SELECT id, nome, matricula, cpf, email, cargo, status FROM servidores WHERE id=$1', [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ message: 'Servidor não encontrado' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar servidor' });
  }
}

async function updateServidor(req, res) {
  const { nome, matricula, cpf, email, cargo, status } = req.body;
  try {
    const q = `UPDATE servidores SET nome=$1, matricula=$2, cpf=$3, email=$4, cargo=$5, status=$6 WHERE id=$7 RETURNING id, nome, email`;
    const r = await db.query(q, [nome, matricula, cpf, email, cargo, status, req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ message: 'Servidor não encontrado' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar' });
  }
}

async function deleteServidor(req, res) {
  try {
    await db.query('DELETE FROM servidores WHERE id=$1', [req.params.id]);
    res.json({ message: 'Servidor removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover' });
  }
}

module.exports = { createServidor, listServidores, getServidor, updateServidor, deleteServidor };
