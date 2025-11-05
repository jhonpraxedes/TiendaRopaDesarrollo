import React, { useState } from 'react';
import { auth } from '../../auth';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = auth.loginLocal(form.email, form.password);
      if (!ok) {
        alert('Credenciales inválidas');
        return;
      }
      navigate('/admin', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin">
      <div className="container" style={{ maxWidth: 420 }}>
        <h2>Acceso de Administrador</h2>
        <form onSubmit={submit} className="card" style={{ display: 'grid', gap: 12 }}>
          <input
            name="email"
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={onChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;