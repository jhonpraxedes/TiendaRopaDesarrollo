const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ventasPath = path.join(__dirname, '../../data/ventas.json');

router.get('/', (req, res) => {
  if (!fs.existsSync(ventasPath)) return res.json([]);
  const raw = fs.readFileSync(ventasPath, 'utf8') || '[]';
  res.json(JSON.parse(raw));
});

router.post('/', (req, res) => {
  try {
    const venta = req.body || {};
    const current = fs.existsSync(ventasPath) ? JSON.parse(fs.readFileSync(ventasPath, 'utf8') || '[]') : [];
    current.push({ id: Date.now(), ...venta });
    fs.writeFileSync(ventasPath, JSON.stringify(current, null, 2), 'utf8');
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo guardar la venta' });
  }
});

module.exports = router;