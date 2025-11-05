const host = window.location.hostname; // ej: 192.168.1.86 o localhost
const defaultBase = `http://${host}:3001`;
export const API_BASE = process.env.REACT_APP_API_BASE || defaultBase;

export const api = {
  productos: `${API_BASE}/api/productos`,
  usuarios: `${API_BASE}/api/usuarios`,
  ventas: `${API_BASE}/api/ventas`,
  public: `${API_BASE}/public`,
};