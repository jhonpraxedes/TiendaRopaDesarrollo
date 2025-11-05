import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { auth } from '../../auth';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    categoria: 'Hombre',
    imagen: '',
    descripcion: '',
  });

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigate('/admin/login', { replace: true });
      return;
    }
    cargarProductos();
    cargarVentas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarProductos = async () => {
    const res = await fetch(api.productos);
    const data = await res.json();
    setProductos(data);
  };

  const cargarVentas = async () => {
    try {
      const res = await fetch(api.ventas);
      if (!res.ok) throw new Error('No se pudo cargar ventas');
      const data = await res.json();
      const ordenado = [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
      setVentas(ordenado);
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('pedidos') || '[]');
      const ordenado = [...local].reverse();
      setVentas(ordenado);
    }
  };

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const agregar = async (e) => {
    e.preventDefault();
    const res = await fetch(api.productos, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, precio: parseFloat(form.precio) }),
    });
    if (!res.ok) {
      alert('Error al agregar el producto');
      return;
    }
    setForm({ nombre: '', precio: '', categoria: 'Hombre', imagen: '', descripcion: '' });
    cargarProductos();
  };

  const eliminar = async (id) => {
    const res = await fetch(`${api.productos}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Error al eliminar el producto');
      return;
    }
    cargarProductos();
  };

  const logout = () => {
    auth.logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <section className="admin">
      <div className="container">
        <h2>Panel de Administración</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="secondary" onClick={logout}>Cerrar sesión</button>
          <button className="secondary" onClick={cargarVentas}>Actualizar pedidos</button>
        </div>

        {/* 🧾 Sección de Pedidos */}
        <div style={{ marginTop: 24 }}>
          <h3>Pedidos recientes</h3>
          {ventas.length === 0 ? (
            <p className="no-data">No hay pedidos registrados.</p>
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr 120px 140px',
                  gap: 0,
                }}
              >
                <div
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #2a1f52',
                    color: 'var(--text-dim)',
                  }}
                >
                  Fecha
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #2a1f52',
                    color: 'var(--text-dim)',
                  }}
                >
                  Cliente
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #2a1f52',
                    color: 'var(--text-dim)',
                  }}
                >
                  Entrega
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #2a1f52',
                    color: 'var(--text-dim)',
                  }}
                >
                  Pago
                </div>
              </div>

              {ventas.map((v) => {
                const fecha = v.fecha
                  ? new Date(v.fecha)
                  : new Date(v.id || Date.now());
                const fechaTxt = fecha.toLocaleString();
                const clienteNombre = v.cliente?.nombre || '—';
                const entrega = v.entrega || '—';
                const pago = v.pago || '—';

                return (
                  <div
                    key={v.id || fecha.getTime()}
                    className="admin-producto-item"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '160px 1fr 120px 140px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setVentaSeleccionada(v)}
                  >
                    <div>{fechaTxt}</div>
                    <div>{clienteNombre}</div>
                    <div style={{ textTransform: 'capitalize' }}>{entrega}</div>
                    <div style={{ textTransform: 'capitalize' }}>{pago}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 📦 Detalle del Pedido */}
        {ventaSeleccionada && (
          <div style={{ marginTop: 16 }}>
            <h3>Detalle del pedido</h3>
            <div className="card" style={{ display: 'grid', gap: 12 }}>
              <div
                style={{
                  display: 'grid',
                  gap: 12,
                  gridTemplateColumns: '1fr 1fr',
                }}
              >
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>Cliente</div>
                  <div>
                    <strong>{ventaSeleccionada.cliente?.nombre || '—'}</strong>
                  </div>
                  <div>{ventaSeleccionada.cliente?.telefono || ''}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>Entrega y pago</div>
                  <div>Método: {ventaSeleccionada.entrega || '—'}</div>
                  <div>Pago: {ventaSeleccionada.pago || '—'}</div>
                </div>
              </div>

              {ventaSeleccionada.entrega === 'domicilio' && (
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>Dirección</div>
                  <div>
                    {ventaSeleccionada?.cliente?.direccion?.calle || ''}
                    <br />
                    {ventaSeleccionada?.cliente?.direccion?.ciudad || ''}{' '}
                    {ventaSeleccionada?.cliente?.direccion?.depto || ''}
                    <div style={{ color: 'var(--text-dim)' }}>
                      {ventaSeleccionada?.cliente?.direccion?.referencias || ''}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div style={{ color: 'var(--text-dim)' }}>Productos</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {(ventaSeleccionada.items || []).map((it, idx) => (
                    <div
                      key={idx}
                      className="carrito-item"
                      style={{ padding: 8 }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'center',
                        }}
                      >
                        {it.imagen && (
                          <img
                            src={`${api.public}/${it.imagen}`}
                            alt={it.nombre}
                            style={{
                              width: 54,
                              height: 54,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                        )}
                        <div>
                          <div>
                            <strong>{it.nombre}</strong>
                          </div>
                          <div>Cant: {it.cantidad}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {ventaSeleccionada.notas && (
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>Notas</div>
                  <div>{ventaSeleccionada.notas}</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="secondary"
                  onClick={() => setVentaSeleccionada(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 👕 Productos */}
        <div style={{ marginTop: 32 }}>
          <h3>Productos</h3>
          <div className="admin-form">
            <form onSubmit={agregar}>
              <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={onChange}
                required
              />
              <input
                name="precio"
                type="number"
                step="0.01"
                placeholder="Precio (Q)"
                value={form.precio}
                onChange={onChange}
                required
              />
              <select
                name="categoria"
                value={form.categoria}
                onChange={onChange}
              >
                <option>Hombre</option>
                <option>Mujer</option>
                <option>Unisex</option>
              </select>
              <input
                name="imagen"
                placeholder="imagen.jpg"
                value={form.imagen}
                onChange={onChange}
                required
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={onChange}
                required
              />
              <button type="submit">Agregar Producto</button>
            </form>
          </div>

          <div className="admin-lista">
            {productos.map((p) => (
              <div className="admin-producto-item" key={p.id}>
                <div>
                  <strong>{p.nombre}</strong> - Q{p.precio.toFixed(2)} (
                  {p.categoria})
                </div>
                <button className="danger" onClick={() => eliminar(p.id)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;