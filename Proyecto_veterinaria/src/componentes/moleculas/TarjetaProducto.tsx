import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../../types';
import { useCarrito } from '../../context/useCarrito';

export function TarjetaProducto({ producto }: { producto: Producto }) {
  const { agregarProducto } = useCarrito();
  const [agregado, establecerAgregado] = useState(false);

  return (
    <article className="card h-100 border-0 shadow-sm overflow-hidden">
      <div className="bg-light d-flex align-items-center justify-content-center p-3" style={{ height: '220px' }}>
        <img
          src={producto.imagen}
          className="img-fluid"
          alt={producto.nombre}
          loading="lazy"
          style={{ maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>
      <div className="card-body d-flex flex-column p-4">
        <span className="badge rounded-pill text-bg-light align-self-start mb-3">{producto.categoria}</span>
        <h2 className="h5 card-title fw-bold">{producto.nombre}</h2>
        <p className="text-secondary small mb-2">{producto.especie} · {producto.presentacion}</p>
        <p className="fw-bold fs-4 mb-3" style={{ color: '#153259' }}>${producto.precio.toLocaleString('es-CL')}</p>
        <div className="d-grid gap-2 mt-auto">
          <Link
            className="btn btn-outline-primary"
            style={{ borderColor: '#153259', color: '#153259' }}
            to={`/productos/${producto.codigo}`}
          >
            Ver producto
          </Link>
          <button
            type="button"
            className="btn text-white fw-semibold"
            style={{ backgroundColor: '#04BFAD' }}
            disabled={producto.stock < 1}
            onClick={() => {
              if (agregarProducto(producto)) establecerAgregado(true);
            }}
          >
            {producto.stock < 1 ? 'Sin stock' : agregado ? 'Agregar otra unidad' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </article>
  );
}