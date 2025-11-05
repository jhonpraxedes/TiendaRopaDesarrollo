const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const ventasRoutes = require('./modules/ventas/ventas.routes');
app.use('/api/ventas', ventasRoutes);
app.use(cors());
app.use(express.json()); // ¡Importante para req.body!

// static si usas imágenes/archivos
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas
const productosRoutes = require('./modules/productos/productos.routes');
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');

app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});