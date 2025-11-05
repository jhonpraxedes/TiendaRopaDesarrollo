import React, { useEffect, useState } from 'react';
import { api } from '../../api';

function ProductosPage({ categoria }) {
  const [productos, setProductos] = useState([]);
  const [filtroPrecio, setFiltroPrecio] = useState('todos');

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => {
        let lista = data;
        if (categoria) lista = lista.filter(p => p.categoria === categoria);

        if (filtroPrecio === '0-100') {
          lista = lista.filter(p => p.precio <= 100);
        } else if (filtroPrecio === '100-200') {
          lista = lista.filter(p => p.precio > 100 && p.precio <= 200);
        } else if (filtroPrecio === '200-300') {
          lista = lista.filter(p => p.precio > 200 && p.precio <= 300);
        }
        setProductos(lista);
      })
      .catch(err => console.error('Error productos:', err));
  }, [categoria, filtroPrecio]);

  // Aquí defines la función
  const addToCart = (prod) => {
    const actual = JSON.parse(localStorage.getItem('carrito') || '[]');
    actual.push(prod);
    localStorage.setItem('carrito', JSON.stringify(actual));
    alert('Producto agregado al carrito');
  };

  return (
    <section className="tienda">
      <div className="container">
        <h2>{categoria ? `Productos ${categoria}` : 'Todos los productos'}</h2>

        <div className="filtros">
          <select value={filtroPrecio} onChange={(e) => setFiltroPrecio(e.target.value)}>
            <option value="todos">Todos los precios</option>
            <option value="0-100">Q0 - Q100</option>
            <option value="100-200">Q100 - Q200</option>
            <option value="200-300">Q200 - Q300</option>
          </select>
        </div>

        <div className="productos-grid">
          {productos.length === 0 ? (
            <p>No hay productos</p>
          ) : (
            productos.map((prod) => (
              <div key={prod.id} className="producto-card">
                <img
                  src={`http://localhost:3001/public/${prod.imagen}`}
                  alt={prod.nombre}
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ecf0f1%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%2395a5a6%22%3EImagen%3C/text%3E%3C/svg%3E';
                  }}
                />
                <span className="categoria">{prod.categoria}</span>
                <h3>{prod.nombre}</h3>
                <p>{prod.descripcion}</p>
                <div className="precio">Q{prod.precio.toFixed(2)}</div>

                {/* Aquí usas la función en el botón */}
                <button onClick={() => addToCart(prod)}>
                  Agregar al Carrito
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductosPage;