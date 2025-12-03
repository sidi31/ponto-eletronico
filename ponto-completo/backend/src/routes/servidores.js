const express = require('express');
const router = express.Router();
const servidorCtrl = require('../controllers/servidorController');
const { verifyToken, requireAdmin } = require('../middleware/authJwt');

router.post('/', verifyToken, requireAdmin, servidorCtrl.createServidor);
router.get('/', verifyToken, requireAdmin, servidorCtrl.listServidores);
router.get('/:id', verifyToken, servidorCtrl.getServidor);
router.put('/:id', verifyToken, requireAdmin, servidorCtrl.updateServidor);
router.delete('/:id', verifyToken, requireAdmin, servidorCtrl.deleteServidor);

module.exports = router;
