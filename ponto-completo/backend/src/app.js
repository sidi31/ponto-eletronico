const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const servidorRoutes = require('./routes/servidores');
const pontoRoutes = require('./routes/pontos');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/servidores', servidorRoutes);
app.use('/api/pontos', pontoRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'Controle de Ponto API' }));

module.exports = app;
