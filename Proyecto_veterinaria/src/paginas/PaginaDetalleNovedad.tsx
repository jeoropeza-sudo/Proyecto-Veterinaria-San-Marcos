import { Link, useParams } from 'react-router-dom';
import { novedades } from '../datos/novedades';

export function PaginaDetalleNovedad() {
  const { codigo } = useParams<{ codigo: string }>();
  const novedad = novedades.find((elemento) => elemento.codigo === codigo);

  if (!novedad) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h1 className="h4">No encontramos esta novedad</h1>
          <p>Puede que el contenido ya no esté disponible.</p>
          <Link className="alert-link" to="/novedades">Volver a novedades</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-fluid px-4 px-lg-5 py-4 py-lg-5">
      <nav aria-label="Ruta de navegación" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/novedades">Novedades</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{novedad.titulo}</li>
        </ol>
      </nav>

      <article className="card border-0 shadow-sm rounded-4 overflow-hidden mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="row g-0">
          <div className="col-12 col-lg-6">
            <img
              src={novedad.imagen}
              alt={novedad.textoAlternativo}
              className="w-100 h-100"
              style={{ minHeight: '300px', maxHeight: '600px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-12 col-lg-6">
            <div className="card-body p-4 p-md-5">
              <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#e7f6f7', color: '#153259' }}>
                {novedad.etiqueta}
              </span>
              <h1 className="display-6 fw-bold mb-4" style={{ color: '#153259' }}>{novedad.titulo}</h1>
              <p className="lead text-secondary">{novedad.resumen}</p>
              <p className="text-secondary">{novedad.contenido}</p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link to={novedad.rutaRelacionada} className="btn text-white fw-bold" style={{ backgroundColor: '#153259' }}>
                  {novedad.textoEnlace}
                </Link>
                <Link to="/novedades" className="btn btn-outline-secondary fw-bold">
                  Ver todas las novedades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
