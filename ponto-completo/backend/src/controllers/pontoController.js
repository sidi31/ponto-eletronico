const db = require('../config/db');

async function registrarPonto(req, res) {
  const userId = req.userId;
  const { tipo, observacoes } = req.body;
  if (!tipo) return res.status(400).json({ message: 'Tipo é obrigatório' });

  try {
    const data = new Date();
    const dataStr = data.toISOString().slice(0,10); // YYYY-MM-DD
    const horaStr = data.toTimeString().slice(0,8); // HH:MM:SS

    const q = `INSERT INTO registro_ponto (id_servidor, data_registro, hora_registro, tipo, observacoes)
               VALUES ($1,$2,$3,$4,$5) RETURNING id, data_registro, hora_registro, tipo, observacoes`;
    const r = await db.query(q, [userId, dataStr, horaStr, tipo, observacoes || null]);
    res.json({ message: 'Ponto registrado com sucesso', registro: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registrar ponto' });
  }
}

async function historicoDoUsuario(req, res) {
  const userId = req.userId;
  try {
    const r = await db.query('SELECT * FROM registro_ponto WHERE id_servidor=$1 ORDER BY data_registro DESC, hora_registro DESC', [userId]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
}

async function historicoPorServidor(req, res) {
  const serverId = req.params.id;
  try {
    const r = await db.query('SELECT * FROM registro_ponto WHERE id_servidor=$1 ORDER BY data_registro DESC, hora_registro DESC', [serverId]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
}

module.exports = { registrarPonto, historicoDoUsuario, historicoPorServidor };
