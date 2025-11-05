import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import ProductosPage from './modules/productos/ProductosPage';
import CarritoPage from './modules/carrito/CarritoPage';
import AdminPage from './modules/admin/AdminPage';
import AdminLogin from './modules/admin/AdminLogin';
import './App.css';

function App() {
  return (
    <Router>
      <header>
        <div className="container">
          <h1>🛍️ PraxShop</h1>
          <nav>
            <NavLink to="/" end>Productos</NavLink>
            <NavLink to="/hombres">Hombre</NavLink>
            <NavLink to="/mujeres">Mujer</NavLink>
            <NavLink to="/carrito">Carrito</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ProductosPage />} />
          <Route path="/hombres" element={<ProductosPage categoria="Hombre" />} />
          <Route path="/mujeres" element={<ProductosPage categoria="Mujer" />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;