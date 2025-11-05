const fs = require('fs');
const path = require('path');

// Lee el JSON desde backend/db/productos.json
const productosPath = path.join(__dirname, '../../db/productos.json');

const leerProductos = () =>
  JSON.parse(fs.readFileSync(productosPath, 'utf8'));

const guardarProductos = (data) =>
  fs.writeFileSync(productosPath, JSON.stringify(data, null, 2));

exports.obtenerProductos = (req, res) => {
  try {
    const productos = leerProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error?.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.agregarProducto = (req, res) => {
  try {
    const productos = leerProductos();
    const nuevo = {
      id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1,
      ...req.body,
    };
    productos.push(nuevo);
    guardarProductos(productos);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al agregar producto:', error?.message);
    res.status(500).json({ error: 'Error al guardar producto' });
  }
};

exports.eliminarProducto = (req, res) => {
  try {
    let productos = leerProductos();
    productos = productos.filter(p => p.id !== parseInt(req.params.id, 10));
    guardarProductos(productos);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error?.message);
    res.status(500).json({ error: 'No se pudo eliminar producto' });
  }
};