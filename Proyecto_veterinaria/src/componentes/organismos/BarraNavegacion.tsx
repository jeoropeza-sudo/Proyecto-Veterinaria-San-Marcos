import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAutenticacion } from "../../context/useAutenticacion";
import { useCarrito } from "../../context/useCarrito";

function BarraNavegacion() {
    const { usuario, cerrarSesion } = useAutenticacion();
    const { articulos } = useCarrito();
    const [estaExpandido, establecerEstaExpandido] = useState(false);
    const cantidadCarrito = articulos.reduce((count, articulo) => count + articulo.cantidad, 0);

    const cerrarMenu = () => establecerEstaExpandido(false);
    const claseEnlaceNavegacion = ({ isActive }: { isActive: boolean }) =>
        `nav-link fw-bold${isActive ? ' active' : ''}`;

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#153259' }}>
                <div className="container-fluid px-4 px-lg-5">
                    <Link className="navbar-brand me-4" to="/" onClick={cerrarMenu}>
                        <img
                            src="/imagenes/logo.svg"
                            alt="Logo Veterinaria San Marcos"
                            width="150"
                            height="72"
                            style={{ objectFit: 'contain' }}
                        />
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-controls="navbarSanMarcos"
                        aria-expanded={estaExpandido}
                        aria-label={estaExpandido ? 'Cerrar navegación' : 'Abrir navegación'}
                        onClick={() => establecerEstaExpandido((expanded) => !expanded)}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className={`collapse navbar-collapse${estaExpandido ? ' show' : ''}`} id="navbarSanMarcos">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className={claseEnlaceNavegacion} to="/" end onClick={cerrarMenu}>Inicio</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={claseEnlaceNavegacion} to="/servicios" onClick={cerrarMenu}>Servicios</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={claseEnlaceNavegacion} to="/productos" onClick={cerrarMenu}>Productos</NavLink>
                            </li>
                        </ul>

                        <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2" id="contenedor-auth">
                            <NavLink
                                className="btn btn-sm text-white fw-bold"
                                style={{ backgroundColor: '#36BBD9' }}
                                to="/carrito"
                                onClick={cerrarMenu}
                            >
                                Mi carrito <span className="badge text-bg-light ms-1">{cantidadCarrito}</span>
                            </NavLink>
                            {usuario?.rol === 'Administrador' && (
                                <NavLink className="btn btn-outline-light btn-sm fw-bold" to="/admin" onClick={cerrarMenu}>
                                    Administración
                                </NavLink>
                            )}
                            {usuario ? (
                                <>
                                    <span className="text-white fw-semibold px-lg-2 py-1 text-center">
                                        {usuario.nombre}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light btn-sm fw-bold"
                                        onClick={() => {
                                            cerrarSesion();
                                            cerrarMenu();
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <Link
                                    className="btn btn-outline-light btn-sm fw-bold"
                                    to="/login"
                                    onClick={cerrarMenu}
                                >
                                    Ingresar
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default BarraNavegacion;