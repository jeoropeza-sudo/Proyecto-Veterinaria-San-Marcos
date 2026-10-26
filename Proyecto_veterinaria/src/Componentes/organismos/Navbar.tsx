import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg py-3" style={{ backgroundColor: '#102A43' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center text-white fw-bold" to="/">
          <span style={{ color: '#00C9A7', fontSize: '1.5rem', marginRight: '8px' }}>🐾</span>
          <div className="lh-1">
            <span className="d-block text-uppercase" style={{ fontSize: '1.1rem' }}>SAN MARCOS</span>
            <small className="text-uppercase" style={{ fontSize: '0.65rem', color: '#00C9A7', letterSpacing: '1px' }}>VETERINARIA</small>
          </div>
        </Link>

        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold active" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white-50" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white-50" to="/servicios">Servicios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white-50" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white-50" to="/novedades">Novedades</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white-50" to="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link to="/carrito" className="btn btn-sm text-white" style={{ backgroundColor: '#00C9A7', fontWeight: 600 }}>
            Mi Carrito
          </Link>
          <Link to="/login" className="btn btn-sm btn-outline-light" style={{ fontWeight: 600 }}>
            Ingresar
          </Link>
          <Link to="/registro" className="btn btn-sm text-white" style={{ backgroundColor: '#00C9A7', fontWeight: 600 }}>
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;