import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#153259' }}>
            <div className="container px-4">
                <Link className="navbar-brand fw-bold" to="/">
                    Veterinaria San Marcos
                </Link>

                <div className="navbar-nav ms-auto gap-2">
                    <Link className="nav-link text-white" to="/">Inicio</Link>
                    <Link className="nav-link text-white" to="/nosotros">Nosotros</Link>
                    <Link className="nav-link text-white" to="/servicios">Servicios</Link>
                    <Link className="nav-link text-white" to="/productos">Productos</Link>
                    <Link className="nav-link text-white" to="/novedades">Novedades</Link>
                    <Link className="nav-link text-white" to="/contacto">Contacto</Link>
                    <Link className="nav-link text-white btn btn-sm px-3" style={{ backgroundColor: '#04BFAD' }} to="/login">
                        Ingresar
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;