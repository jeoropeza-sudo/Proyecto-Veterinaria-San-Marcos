import { Link } from 'react-router-dom';
import type { Producto } from '../../types';

export function CardProduct({ product }: { product: Producto }) {
  return (
    <article className="card h-100 border-0 shadow-sm">
      <img
        src={product.imagen}
        className="card-img-top"
        alt={product.nombre}
        loading="lazy"
        style={{ height: '220px', objectFit: 'contain', padding: '1rem' }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light align-self-start mb-2">{product.categoria}</span>
        <h2 className="h5 card-title">{product.nombre}</h2>
        <p className="text-secondary small mb-2">{product.especie} · {product.presentacion}</p>
        <p className="fw-bold fs-5 mb-3">${product.precio.toLocaleString('es-CL')}</p>
        <Link className="btn btn-outline-primary mt-auto" to={`/productos/${product.codigo}`}>
          Ver detalle
        </Link>
      </div>
    </article>
  );
}