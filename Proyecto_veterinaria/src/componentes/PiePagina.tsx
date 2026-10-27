import { Link } from 'react-router-dom';

export function PiePagina() {
  return (
    <footer className="mt-auto text-white pt-5 pb-3" style={{ backgroundColor: '#153259' }}>
      <div className="container-fluid px-4 px-lg-5">
        <div className="row g-4">
          <div className="col-12 col-md-5">
            <Link to="/" aria-label="Veterinaria San Marcos, inicio">
              <img
                src="/imagenes/logo.svg"
                alt="Veterinaria San Marcos"
                width="150"
                height="72"
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <p className="small text-white-50 mt-3">
              Atención veterinaria integral en Rancagua desde 2009. Cuidamos a tus mascotas con el profesionalismo y cariño que se merecen.
            </p>
            <p className="small text-white-50 mb-0">
              <strong>Proyecto académico:</strong> Desarrollo FullStack II (Duoc UC).
            </p>
          </div>

          <div className="col-12 col-md-3">
            <h2 className="h6 fw-bold mb-3" style={{ color: '#36BBD9' }}>Navegación</h2>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/">Inicio</Link></li>
              <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/servicios">Servicios</Link></li>
              <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/productos">Productos</Link></li>
              <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/nosotros">Nosotros</Link></li>
              <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/novedades">Novedades</Link></li>
              <li className="mb-2"><Link className="text-white-50 text-decoration-none" to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <h2 className="h6 fw-bold mb-3" style={{ color: '#36BBD9' }}>Ubicación y horario</h2>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-2">Av. San Marcos #123, Rancagua</li>
              <li className="mb-2">Región de O'Higgins, Chile</li>
              <li className="mb-2">Lunes a viernes: 09:00 - 19:00 hrs</li>
              <li className="mb-2">Sábados: 09:00 - 14:00 hrs</li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center small text-white-50">
          <div className="col-md-6 text-center text-md-start">
            &copy; 2026 Veterinaria San Marcos. Todos los derechos reservados.
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            Desarrollado por: <strong>Alexis, Martín y Vicente</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
