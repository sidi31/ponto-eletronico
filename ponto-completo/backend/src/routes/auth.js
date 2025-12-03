const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/login', authCtrl.login);
router.post('/register-admin', authCtrl.registerAdmin); // use APENAS para inicializar em dev

module.exports = router;
