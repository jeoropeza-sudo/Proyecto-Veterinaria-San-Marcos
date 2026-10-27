import { Link } from 'react-router-dom';

const valores = [
  {
    icono: '🎯',
    titulo: 'Nuestra misión',
    descripcion: 'Proporcionar atención veterinaria de calidad, promover la prevención y fomentar la tenencia responsable en nuestra comunidad.',
  },
  {
    icono: '👁️',
    titulo: 'Nuestra visión',
    descripcion: "Ser un centro veterinario referente en la Región de O'Higgins por la innovación, la calidad médica y el trato humano.",
  },
  {
    icono: '❤️',
    titulo: 'Nuestros valores',
    descripcion: 'Trabajamos con compromiso, empatía con las familias, transparencia y capacitación continua.',
  },
];

export function PaginaNosotros() {
  return (
    <main>
      <header className="py-5 text-white" style={{ background: 'linear-gradient(120deg, #153259, #36BBD9)' }}>
        <div className="container-fluid px-4 px-lg-5 py-lg-3">
          <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#04BFAD', color: '#153259' }}>
            Veterinaria San Marcos
          </span>
          <h1 className="display-5 fw-bold">Sobre nosotros</h1>
          <p className="lead mb-0">Más de 15 años acompañando la salud y el bienestar de las mascotas de Rancagua.</p>
        </div>
      </header>

      <section className="container-fluid px-4 px-lg-5 py-5">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-12 col-lg-6">
            <p className="text-uppercase small fw-bold mb-2" style={{ color: '#008f83' }}>Nuestra historia</p>
            <h2 className="h1 fw-bold" style={{ color: '#153259' }}>Comprometidos con tus mascotas desde 2009</h2>
            <p className="text-secondary">
              Veterinaria San Marcos nació en Rancagua con la misión de ofrecer una atención integral, cercana y profesional.
              Desde sus inicios, ha crecido para brindar servicios de salud y acompañamiento a las mascotas y sus familias.
            </p>
            <p className="text-secondary">
              Nuestro trabajo pone en el centro la prevención, el bienestar animal y una relación de confianza con cada tutor.
              Queremos que cada familia encuentre orientación y atención para las distintas etapas de vida de su mascota.
            </p>
            <Link to="/servicios" className="btn text-white fw-bold" style={{ backgroundColor: '#153259' }}>
              Conoce nuestros servicios
            </Link>
          </div>
          <div className="col-12 col-lg-6">
            <img
              src="/imagenes/clinica-veterinaria-san marcos.jpg"
              alt="Instalaciones de Veterinaria San Marcos"
              className="img-fluid rounded-4 shadow"
              style={{ width: '100%', maxHeight: '440px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: '#EBF3F5' }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: '#153259' }}>Lo que nos guía</h2>
            <p className="text-secondary mb-0">Principios que acompañan nuestro trabajo cada día.</p>
          </div>
          <div className="row g-4">
            {valores.map((valor) => (
              <div className="col-12 col-md-4" key={valor.titulo}>
                <article className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <span className="fs-2" aria-hidden="true">{valor.icono}</span>
                    <h3 className="h5 fw-bold mt-3" style={{ color: '#153259' }}>{valor.titulo}</h3>
                    <p className="text-secondary mb-0">{valor.descripcion}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
