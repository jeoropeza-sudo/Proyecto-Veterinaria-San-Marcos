import { Link } from 'react-router-dom';
import { novedades } from '../datos/novedades';

export function PaginaNovedades() {
  return (
    <main>
      <header className="py-5 text-white" style={{ background: 'linear-gradient(120deg, #153259, #36BBD9)' }}>
        <div className="container-fluid px-4 px-lg-5 py-lg-3">
          <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#04BFAD', color: '#153259' }}>
            Noticias y beneficios
          </span>
          <h1 className="display-5 fw-bold">Novedades</h1>
          <p className="lead mb-0">Conoce iniciativas, servicios y noticias de Veterinaria San Marcos.</p>
        </div>
      </header>

      <section className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-4">
          {novedades.map((novedad) => (
            <div className="col-12 col-md-6 col-xl-3" key={novedad.codigo}>
              <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img
                  src={novedad.imagen}
                  className="card-img-top"
                  alt={novedad.textoAlternativo}
                  style={{ height: '210px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column p-4">
                  <span className="badge align-self-start mb-3" style={{ backgroundColor: '#e7f6f7', color: '#153259' }}>
                    {novedad.etiqueta}
                  </span>
                  <h2 className="h5 fw-bold" style={{ color: '#153259' }}>{novedad.titulo}</h2>
                  <p className="text-secondary small flex-grow-1">{novedad.resumen}</p>
                  <Link
                    className="btn text-white fw-bold mt-2"
                    style={{ backgroundColor: '#153259' }}
                    to={`/novedades/${novedad.codigo}`}
                  >
                    Leer más
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
        <p className="small text-secondary mt-4 mb-0">
          La disponibilidad de servicios, productos y beneficios puede variar. Consulta sus condiciones antes de asistir.
        </p>
      </section>
    </main>
  );
}
