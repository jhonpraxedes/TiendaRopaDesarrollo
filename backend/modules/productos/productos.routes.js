const express = require('express');
const router = express.Router();
const controller = require('./productos.controller');

// Rutas públicas (sin middleware de admin)
router.get('/', controller.obtenerProductos);
router.post('/', controller.agregarProducto);
router.delete('/:id', controller.eliminarProducto);

module.exports = router;