const fs = require('fs');
const path = require('path');
const ventasPath = path.join(__dirname, '../../../db/ventas.json');

const leerVentas = () =>
  JSON.parse(fs.readFileSync(ventasPath, 'utf8'));

const guardarVentas = (data) =>
  fs.writeFileSync(ventasPath, JSON.stringify(data, null, 2));

exports.listarVentas = (req, res) => {
  try {
    const ventas = leerVentas();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar ventas' });
  }
};

exports.registrarVenta = (req, res) => {
  try {
    const ventas = leerVentas();
    const nueva = { id: ventas.length + 1, fecha: new Date().toISOString(), ...req.body };
    ventas.push(nueva);
    guardarVentas(ventas);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar venta' });
  }
};