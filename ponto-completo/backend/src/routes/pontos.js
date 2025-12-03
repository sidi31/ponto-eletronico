const express = require('express');
const router = express.Router();
const pontoCtrl = require('../controllers/pontoController');
const { verifyToken } = require('../middleware/authJwt');

router.post('/registrar', verifyToken, pontoCtrl.registrarPonto);
router.get('/historico', verifyToken, pontoCtrl.historicoDoUsuario);
router.get('/admin/:id', verifyToken, pontoCtrl.historicoPorServidor);

module.exports = router;
