import { Link } from 'react-router-dom';
import type { Servicio } from '../../types';

export function CardService({ service }: { service: Servicio }) {
  return (
    <article className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light align-self-start mb-2">{service.categoria}</span>
        <h2 className="h5 card-title">{service.nombre}</h2>
        <p className="text-secondary small">{service.especie} · {service.duracion}</p>
        <p className="card-text flex-grow-1">{service.detalle}</p>
        <p className="fw-bold fs-5 mb-3">Desde ${service.precio.toLocaleString('es-CL')}</p>
        <Link className="btn btn-outline-primary mt-auto" to={`/servicios/${service.codigo}`}>
          Ver detalle
        </Link>
      </div>
    </article>
  );
}