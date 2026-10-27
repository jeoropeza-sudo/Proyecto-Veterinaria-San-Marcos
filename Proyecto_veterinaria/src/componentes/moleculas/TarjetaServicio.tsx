import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Servicio } from '../../types';
import { useCarrito } from '../../context/useCarrito';

export function TarjetaServicio({ servicio }: { servicio: Servicio }) {
  const { solicitarServicio } = useCarrito();
  const [solicitudRealizada, establecerSolicitudRealizada] = useState(false);

  return (
    <article className="card h-100 border-0 shadow-sm overflow-hidden">
      {servicio.imagen && (
        <img
          src={servicio.imagen}
          className="card-img-top"
          alt=""
          loading="lazy"
          style={{ height: '190px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column p-4">
        <span className="badge rounded-pill text-bg-light align-self-start mb-3">{servicio.categoria}</span>
        <h2 className="h5 card-title fw-bold">{servicio.nombre}</h2>
        <p className="text-secondary small mb-3">{servicio.especie} · {servicio.duracion}</p>
        <p className="card-text flex-grow-1">{servicio.detalle}</p>
        <p className="fw-bold fs-4 mb-3" style={{ color: '#153259' }}>Desde ${servicio.precio.toLocaleString('es-CL')}</p>
        <div className="d-grid gap-2 mt-auto">
          <Link
            className="btn btn-outline-primary"
            style={{ borderColor: '#153259', color: '#153259' }}
            to={`/servicios/${servicio.codigo}`}
          >
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn text-white fw-semibold"
            style={{ backgroundColor: '#04BFAD' }}
            onClick={() => {
              if (solicitarServicio(servicio)) establecerSolicitudRealizada(true);
            }}
          >
            {solicitudRealizada ? 'Agregar otra solicitud' : 'Solicitar reserva'}
          </button>
        </div>
      </div>
    </article>
  );
}