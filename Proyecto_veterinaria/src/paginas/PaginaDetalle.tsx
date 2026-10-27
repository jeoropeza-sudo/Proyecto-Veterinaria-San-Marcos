import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useCatalogo } from '../context/useCatalogo';
import { useCarrito } from '../context/useCarrito';

export function PaginaDetalle() {
  const { codigo } = useParams<{ codigo: string }>();
  const { pathname } = useLocation();
  const { productos, servicios } = useCatalogo();
  const { agregarProducto, solicitarServicio } = useCarrito();
  const [mensajeAccion, establecerMensajeAccion] = useState<string | null>(null);
  const isProductPage = pathname.startsWith('/productos/');
  const producto = isProductPage
    ? productos.find((articulo) => articulo.codigo === codigo)
    : undefined;
  const servicio = !isProductPage
    ? servicios.find((articulo) => articulo.codigo === codigo)
    : undefined;

  if (!producto && !servicio) {
    const backPath = isProductPage ? '/productos' : '/servicios';
    return (
      <main className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h1 className="h4">No encontramos ese artículo</h1>
          <p>Revisa el código o vuelve al catálogo.</p>
          <Link className="alert-link" to={backPath}>Volver al catálogo</Link>
        </div>
      </main>
    );
  }

  if (producto) {
    return (
      <main className="container-fluid px-4 px-lg-5 py-4 py-lg-5">
        <nav aria-label="Ruta de navegación" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
          </ol>
        </nav>
        <div className="row g-4 g-lg-5 align-items-stretch">
          <div className="col-lg-6">
            <div className="bg-white border rounded-4 shadow-sm p-3 p-md-5 h-100 d-flex align-items-center justify-content-center">
              <img
                className="img-fluid"
                src={producto.imagen}
                alt={producto.nombre}
                style={{ maxHeight: 'min(60vh, 560px)', objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <article className="h-100 bg-white border rounded-4 shadow-sm p-4 p-md-5">
              <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#e7f6f7', color: '#153259' }}>
                {producto.categoria}
              </span>
              <p className="small text-secondary mb-2">Código {producto.codigo}</p>
              <h1 className="display-6 fw-bold mb-3">{producto.nombre}</h1>
              <p className="text-secondary">{producto.detalle ?? producto.presentacion}</p>
              <div className="d-flex align-items-center justify-content-between border-top border-bottom py-3 my-4">
                <span className="text-secondary">Precio</span>
                <span className="fs-3 fw-bold" style={{ color: '#153259' }}>
                  ${producto.precio.toLocaleString('es-CL')}
                </span>
              </div>
              <div className="row g-3">
                {producto.principio && (
                  <div className="col-sm-6">
                    <div className="rounded-3 bg-light p-3 h-100">
                      <span className="d-block small text-secondary">Principio activo</span>
                      <strong>{producto.principio}</strong>
                    </div>
                  </div>
                )}
                {producto.presentacion && (
                  <div className="col-sm-6">
                    <div className="rounded-3 bg-light p-3 h-100">
                      <span className="d-block small text-secondary">Presentación</span>
                      <strong>{producto.presentacion}</strong>
                    </div>
                  </div>
                )}
                <div className="col-sm-6">
                  <div className="rounded-3 bg-light p-3 h-100">
                    <span className="d-block small text-secondary">Mascota</span>
                    <strong>{producto.especie}</strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="rounded-3 bg-light p-3 h-100">
                    <span className="d-block small text-secondary">Disponibilidad</span>
                    <strong>{producto.stock > 0 ? `${producto.stock} unidades` : 'Sin stock'}</strong>
                  </div>
                </div>
              </div>
              <p className="small text-secondary mt-4 mb-0">
                Los medicamentos deben utilizarse bajo orientación de un profesional veterinario.
              </p>
              {mensajeAccion && <p className="alert alert-success mt-3 mb-0" role="status">{mensajeAccion}</p>}
              <button
                type="button"
                className="btn text-white fw-bold w-100 mt-4"
                style={{ backgroundColor: '#04BFAD' }}
                disabled={producto.stock < 1}
                onClick={() => {
                  if (agregarProducto(producto)) establecerMensajeAccion(`${producto.nombre} se agregó al carrito.`);
                }}
              >
                {producto.stock < 1 ? 'Producto sin stock' : 'Agregar al carrito'}
              </button>
            </article>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-fluid px-4 px-lg-5 py-4 py-lg-5">
      <nav aria-label="Ruta de navegación" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/servicios">Servicios</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{servicio?.nombre}</li>
        </ol>
      </nav>
      <article className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="row g-0 align-items-stretch">
          {servicio?.imagen && (
            <div className="col-lg-5">
              <img
                className="img-fluid h-100 w-100"
                src={servicio.imagen}
                alt={`Atención de ${servicio.nombre}`}
                style={{ minHeight: '360px', maxHeight: '600px', objectFit: 'cover' }}
              />
            </div>
          )}
          <div className={servicio?.imagen ? 'col-lg-7' : 'col-12'}>
            <div className="card-body p-4 p-md-5">
              <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#e7f6f7', color: '#153259' }}>
                {servicio?.categoria}
              </span>
              <p className="small text-secondary mb-2">Código {servicio?.codigo}</p>
              <h1 className="display-6 fw-bold mb-3">{servicio?.nombre}</h1>
              <p className="lead text-secondary mb-4">{servicio?.detalle}</p>
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="rounded-3 bg-light p-3 h-100">
                    <span className="d-block small text-secondary">Atención para</span>
                    <strong>{servicio?.especie}</strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="rounded-3 bg-light p-3 h-100">
                    <span className="d-block small text-secondary">Duración estimada</span>
                    <strong>{servicio?.duracion}</strong>
                  </div>
                </div>
              </div>
              <div className="border-top pt-3">
                <span className="d-block small text-secondary">Valor referencial</span>
                <span className="fs-3 fw-bold" style={{ color: '#153259' }}>
                  Desde ${servicio?.precio.toLocaleString('es-CL')}
                </span>
              </div>
              {mensajeAccion && <p className="alert alert-success mt-3 mb-0" role="status">{mensajeAccion}</p>}
              <button
                type="button"
                className="btn text-white fw-bold mt-4"
                style={{ backgroundColor: '#04BFAD' }}
                onClick={() => {
                  if (servicio && solicitarServicio(servicio)) {
                    establecerMensajeAccion('La solicitud de reserva se agregó al carrito. Para confirmarla, inicia sesión.');
                  }
                }}
              >
                Solicitar reserva
              </button>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
