import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAutenticacion } from '../context/useAutenticacion';
import { obtenerMisOrdenes, type Orden } from '../services/servicioOrdenes';

function mostrarFecha(fecha: string): string {
  const fechaOrden = new Date(fecha);
  return Number.isNaN(fechaOrden.getTime())
    ? 'Fecha no disponible'
    : fechaOrden.toLocaleString('es-CL');
}

export function PaginaPerfil() {
  const { usuario } = useAutenticacion();
  const [ordenes, establecerOrdenes] = useState<Orden[]>([]);
  const [cargandoOrdenes, establecerCargandoOrdenes] = useState(true);
  const [errorOrdenes, establecerErrorOrdenes] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    let activo = true;

    obtenerMisOrdenes(usuario.token)
      .then((resultados) => {
        if (activo) establecerOrdenes(resultados);
      })
      .catch((error: unknown) => {
        if (activo) {
          establecerErrorOrdenes(error instanceof Error
            ? error.message
            : 'No se pudieron cargar tus órdenes.');
        }
      })
      .finally(() => {
        if (activo) establecerCargandoOrdenes(false);
      });

    return () => {
      activo = false;
    };
  }, [usuario]);

  if (!usuario) return null;

  return (
    <main className="container py-5">
      <header className="mb-4">
        <p className="text-uppercase small fw-bold mb-1" style={{ color: '#04BFAD' }}>Mi cuenta</p>
        <h1 className="display-6 fw-bold" style={{ color: '#153259' }}>Mi perfil</h1>
        <p className="text-secondary">Revisa tus compras y el estado de las integraciones de tu cuenta.</p>
      </header>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <section className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5">Datos de la cuenta</h2>
              <dl className="mb-0">
                <dt className="small text-secondary mt-3">Correo</dt>
                <dd>{usuario.correo}</dd>
                <dt className="small text-secondary">Tipo de cuenta</dt>
                <dd className="mb-0">{usuario.rol}</dd>
              </dl>
              <div className="alert alert-info mt-4 mb-0" role="status">
                La edición de datos personales estará disponible cuando se integre ms-usuarios. No se guardan cambios localmente para evitar mostrar información desactualizada.
              </div>
              <button type="button" className="btn btn-outline-secondary w-100 mt-3" disabled>
                Editar datos personales (pendiente)
              </button>
            </div>
          </section>
        </div>

        <div className="col-12 col-lg-8">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                <div>
                  <h2 className="h5 mb-1">Mis compras y comprobantes</h2>
                  <p className="small text-secondary mb-0">Resumen de órdenes confirmadas; no es una boleta tributaria.</p>
                </div>
                <Link className="btn btn-outline-primary btn-sm" to="/productos">Ver productos</Link>
              </div>

              {cargandoOrdenes && <p role="status">Cargando tus órdenes…</p>}
              {errorOrdenes && <div className="alert alert-danger" role="alert">{errorOrdenes}</div>}
              {!cargandoOrdenes && !errorOrdenes && ordenes.length === 0 && (
                <div className="text-center rounded-3 bg-light p-4">
                  <p className="mb-0">Aún no tienes compras registradas.</p>
                </div>
              )}
              {ordenes.length > 0 && (
                <div className="d-grid gap-3">
                  {ordenes.map((orden) => (
                    <article key={orden.id} className="border rounded-3 p-3">
                      <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                        <div>
                          <h3 className="h6 mb-1">Orden #{orden.id}</h3>
                          <time className="small text-secondary" dateTime={orden.fechaCreacion}>
                            {mostrarFecha(orden.fechaCreacion)}
                          </time>
                        </div>
                        <span className="badge text-bg-success align-self-start">{orden.estado}</span>
                      </div>
                      <ul className="list-unstyled mb-2">
                        {orden.items.map((item) => (
                          <li key={item.codigoProducto} className="d-flex justify-content-between gap-3 small py-1">
                            <span>{item.nombreProducto} × {item.cantidad}</span>
                            <span>${item.subtotal.toLocaleString('es-CL')}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-top pt-2 d-flex justify-content-between">
                        <strong>Total</strong>
                        <strong>${orden.total.toLocaleString('es-CL')}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
              <h2 className="h5">Mis reservas</h2>
              <p className="mb-0 text-secondary">
                El historial de reservas se habilitará al integrar ms-reservas. Las solicitudes de servicios en el carrito no se confirman ni se eliminan por una compra de productos.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
