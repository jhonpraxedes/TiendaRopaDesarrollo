import React, { useMemo, useState } from 'react';
import { api } from '../../api';

function CarritoPage() {
  const [carrito, setCarrito] = useState(() => {
    const raw = localStorage.getItem('carrito');
    return raw ? JSON.parse(raw) : [];
  });

  const [checkout, setCheckout] = useState({
    nombre: '',
    telefono: '',
    entrega: 'domicilio',
    pago: 'efectivo',
    direccion: {
      calle: '',
      ciudad: '',
      depto: '',
      referencias: '',
    },
    notas: '',
  });

  const setField = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('direccion.')) {
      const key = name.split('.')[1];
      setCheckout((c) => ({ ...c, direccion: { ...c.direccion, [key]: value } }));
    } else {
      setCheckout((c) => ({ ...c, [name]: value }));
    }
  };

  const total = useMemo(
    () => carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [carrito]
  );

  const actualizarLocal = (items) => {
    setCarrito(items);
    localStorage.setItem('carrito', JSON.stringify(items));
  };

  const cambiarCantidad = (id, delta) => {
    const items = carrito
      .map((it) => (it.id === id ? { ...it, cantidad: Math.max(1, it.cantidad + delta) } : it))
      .filter((it) => it.cantidad > 0);
    actualizarLocal(items);
  };

  const eliminar = (id) => {
    const items = carrito.filter((it) => it.id !== id);
    actualizarLocal(items);
  };

  const vaciar = () => actualizarLocal([]);

  const validar = () => {
    if (!checkout.nombre.trim()) return 'Ingresa tu nombre';
    if (!checkout.telefono.trim()) return 'Ingresa tu teléfono';
    if (checkout.entrega === 'domicilio') {
      const { calle, ciudad, depto } = checkout.direccion;
      if (!calle.trim() || !ciudad.trim() || !depto.trim())
        return 'Completa la dirección: calle, ciudad y departamento';
    }
    if (!['efectivo', 'tarjeta', 'transferencia'].includes(checkout.pago))
      return 'Selecciona un método de pago válido';
    if (carrito.length === 0) return 'Tu carrito está vacío';
    return null;
  };

  const confirmarPedido = async () => {
    const error = validar();
    if (error) {
      alert(error);
      return;
    }

    const pedido = {
      cliente: {
        nombre: checkout.nombre.trim(),
        telefono: checkout.telefono.trim(),
        direccion:
          checkout.entrega === 'domicilio'
            ? {
                calle: checkout.direccion.calle.trim(),
                ciudad: checkout.direccion.ciudad.trim(),
                depto: checkout.direccion.depto.trim(),
                referencias: checkout.direccion.referencias.trim(),
              }
            : null,
      },
      entrega: checkout.entrega,
      pago: checkout.pago,
      notas: checkout.notas.trim(),
      items: carrito.map((it) => ({
        id: it.id,
        nombre: it.nombre,
        precio: it.precio,
        cantidad: it.cantidad,
        subtotal: it.precio * it.cantidad,
      })),
      total,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
    };

    try {
      // Si tienes backend de ventas:
      const res = await fetch(api.ventas, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al registrar el pedido');
      }
      alert('Pedido registrado. ¡Gracias por tu compra!');
      vaciar();
      // Opcional: redirigir a / gracias
    } catch (err) {
      // Si no tienes backend de ventas, guarda localmente:
      console.error(err);
      const historico = JSON.parse(localStorage.getItem('pedidos') || '[]');
      historico.push(pedido);
      localStorage.setItem('pedidos', JSON.stringify(historico));
      alert('Pedido guardado localmente. ¡Gracias por tu compra!');
      vaciar();
    }
  };

  return (
    <section className="carrito">
      <div className="container">
        <h2>Tu Carrito</h2>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">No hay productos en tu carrito.</p>
        ) : (
          <>
            {carrito.map((item) => (
              <div key={item.id} className="carrito-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={`${api.public}/${item.imagen}`}
                    alt={item.nombre}
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div>
                    <div><strong>{item.nombre}</strong></div>
                    <div>Q{item.precio.toFixed(2)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="secondary" onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                  <span>{item.cantidad}</span>
                  <button className="secondary" onClick={() => cambiarCantidad(item.id, +1)}>+</button>
                </div>

                <div style={{ minWidth: 80, textAlign: 'right' }}>
                  <div>Subtotal</div>
                  <strong>Q{(item.precio * item.cantidad).toFixed(2)}</strong>
                </div>

                <button className="danger" onClick={() => eliminar(item.id)}>Eliminar</button>
              </div>
            ))}

            <div className="carrito-total">
              <strong>Total</strong>
              <strong>Q{total.toFixed(2)}</strong>
            </div>
          </>
        )}

        <h3 style={{ marginTop: 24 }}>Datos de entrega y pago</h3>
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
            <input name="nombre" placeholder="Nombre completo" value={checkout.nombre} onChange={setField} />
            <input name="telefono" placeholder="Teléfono" value={checkout.telefono} onChange={setField} />
          </div>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Método de entrega</label>
              <select name="entrega" value={checkout.entrega} onChange={setField}>
                <option value="domicilio">Envío a domicilio</option>
                <option value="tienda">Recoger en tienda</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Método de pago</label>
              <select name="pago" value={checkout.pago} onChange={setField}>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          {checkout.entrega === 'domicilio' && (
            <>
              <div style={{ display: 'grid', gap: 12 }}>
                <input
                  name="direccion.calle"
                  placeholder="Calle y número"
                  value={checkout.direccion.calle}
                  onChange={setField}
                />
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <input
                    name="direccion.ciudad"
                    placeholder="Ciudad/Municipio"
                    value={checkout.direccion.ciudad}
                    onChange={setField}
                  />
                  <input
                    name="direccion.depto"
                    placeholder="Departamento"
                    value={checkout.direccion.depto}
                    onChange={setField}
                  />
                </div>
                <input
                  name="direccion.referencias"
                  placeholder="Referencias (opcional)"
                  value={checkout.direccion.referencias}
                  onChange={setField}
                />
              </div>
            </>
          )}

          <textarea
            name="notas"
            placeholder="Notas adicionales (opcional)"
            value={checkout.notas}
            onChange={setField}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <button className="secondary" onClick={vaciar} disabled={carrito.length === 0}>Vaciar carrito</button>
            <button className="btn-comprar" onClick={confirmarPedido} disabled={carrito.length === 0}>
              Confirmar pedido
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CarritoPage;