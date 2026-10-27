import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Navbar() {
    const { user, signOut } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);

    const closeMenu = () => setIsExpanded(false);
    const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
        `nav-link fw-bold${isActive ? ' active' : ''}`;

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#153259' }}>
                <div className="container-fluid px-4 px-lg-5">
                    <Link className="navbar-brand me-4" to="/" onClick={closeMenu}>
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
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Cerrar navegación' : 'Abrir navegación'}
                        onClick={() => setIsExpanded((expanded) => !expanded)}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className={`collapse navbar-collapse${isExpanded ? ' show' : ''}`} id="navbarSanMarcos">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className={navLinkClassName} to="/" end onClick={closeMenu}>Inicio</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={navLinkClassName} to="/servicios" onClick={closeMenu}>Servicios</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={navLinkClassName} to="/productos" onClick={closeMenu}>Productos</NavLink>
                            </li>
                        </ul>

                        <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2" id="contenedor-auth">
                            {user?.rol === 'Administrador' && (
                                <NavLink className="btn btn-outline-light btn-sm fw-bold" to="/admin" onClick={closeMenu}>
                                    Administración
                                </NavLink>
                            )}
                            {user ? (
                                <>
                                    <span className="text-white fw-semibold px-lg-2 py-1 text-center">
                                        {user.nombre}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light btn-sm fw-bold"
                                        onClick={() => {
                                            signOut();
                                            closeMenu();
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <Link
                                    className="btn btn-outline-light btn-sm fw-bold"
                                    to="/login"
                                    onClick={closeMenu}
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

export default Navbar;