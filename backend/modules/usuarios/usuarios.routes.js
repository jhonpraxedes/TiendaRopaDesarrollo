const express = require('express');
const router = express.Router();
const controller = require('./usuarios.controller');

// Rutas de usuarios (no usamos login de backend)
router.get('/', controller.listarUsuarios);
router.post('/', controller.crearUsuario);

module.exports = router;