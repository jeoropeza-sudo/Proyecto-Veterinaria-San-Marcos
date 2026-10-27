import { Link, useLocation, useParams } from 'react-router-dom';
import { useCatalog } from '../context/useCatalog';

export function DetailViewPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const { pathname } = useLocation();
  const { productos, servicios } = useCatalog();
  const isProductPage = pathname.startsWith('/productos/');
  const product = isProductPage
    ? productos.find((item) => item.codigo === codigo)
    : undefined;
  const service = !isProductPage
    ? servicios.find((item) => item.codigo === codigo)
    : undefined;

  if (!product && !service) {
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

  if (product) {
    return (
      <main className="container py-5">
        <Link to="/productos" className="btn btn-link px-0 mb-3">← Volver a productos</Link>
        <div className="row g-5 align-items-center">
          <div className="col-md-5">
            <img className="img-fluid rounded shadow-sm" src={product.imagen} alt={product.nombre} />
          </div>
          <div className="col-md-7">
            <span className="badge text-bg-light mb-2">{product.categoria}</span>
            <h1 className="display-6 fw-bold">{product.nombre}</h1>
            <p className="text-secondary">Código: {product.codigo}</p>
            <p>{product.detalle ?? product.presentacion}</p>
            {product.principio && <p><strong>Principio:</strong> {product.principio}</p>}
            {product.presentacion && <p><strong>Presentación:</strong> {product.presentacion}</p>}
            <p><strong>Especie:</strong> {product.especie}</p>
            <p><strong>Stock disponible:</strong> {product.stock}</p>
            <p className="fs-4 fw-bold">${product.precio.toLocaleString('es-CL')}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <Link to="/servicios" className="btn btn-link px-0 mb-3">← Volver a servicios</Link>
      <article className="card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <span className="badge text-bg-light mb-2">{service?.categoria}</span>
          <h1 className="display-6 fw-bold">{service?.nombre}</h1>
          <p className="text-secondary">Código: {service?.codigo}</p>
          <p className="lead">{service?.detalle}</p>
          <p><strong>Especie:</strong> {service?.especie}</p>
          <p><strong>Duración estimada:</strong> {service?.duracion}</p>
          <p className="fs-4 fw-bold">Desde ${service?.precio.toLocaleString('es-CL')}</p>
        </div>
      </article>
    </main>
  );
}
