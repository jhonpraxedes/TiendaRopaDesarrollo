const fs = require('fs');
const path = require('path');
const usuariosPath = path.join(__dirname, '../../../db/usuarios.json');

const leerUsuarios = () =>
  JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));

const guardarUsuarios = (data) =>
  fs.writeFileSync(usuariosPath, JSON.stringify(data, null, 2));

exports.listarUsuarios = (req, res) => {
  try {
    const usuarios = leerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.crearUsuario = (req, res) => {
  try {
    const usuarios = leerUsuarios();
    const nuevo = { id: usuarios.length + 1, ...req.body };
    usuarios.push(nuevo);
    guardarUsuarios(usuarios);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al guardar usuario' });
  }
};