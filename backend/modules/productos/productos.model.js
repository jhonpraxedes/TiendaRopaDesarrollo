// Modelo para productos (simulación de base de datos)
class Producto {
  constructor(id, nombre, descripcion, precio, categoria, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen || 'no-image.jpg';
  }
}

module.exports = Producto;