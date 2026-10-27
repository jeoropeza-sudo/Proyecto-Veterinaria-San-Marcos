import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ItemCarrito } from '../types';
import { useAutenticacion } from '../context/useAutenticacion';
import { useCarrito } from '../context/useCarrito';

function obtenerEtiquetaArticulo(articulo: ItemCarrito): string {
  return articulo.tipo === 'producto' ? 'Producto' : 'Solicitud de reserva';
}

export function PaginaCarrito() {
  const { articulos, establecerCantidad, quitarArticulo, vaciar } = useCarrito();
  const { usuario } = useAutenticacion();
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmacion, establecerConfirmacion] = useState<string | null>(null);
  const cantidadTotal = articulos.reduce((sum, articulo) => sum + articulo.cantidad, 0);
  const total = articulos.reduce((sum, articulo) => sum + articulo.producto.precio * articulo.cantidad, 0);

  const manejarConfirmacion = () => {
    if (!usuario) {
      navigate('/login', { state: { from: { pathname: location.pathname } } });
      return;
    }

    if (articulos.length === 0) return;
    const tieneProductos = articulos.some((articulo) => articulo.tipo === 'producto');
    const tieneServicios = articulos.some((articulo) => articulo.tipo === 'servicio');
    const completado = vaciar();
    if (completado) {
      const tipoSolicitud = tieneProductos && tieneServicios
        ? 'compra y reserva'
        : tieneProductos
          ? 'compra'
          : 'solicitud de reserva';
      establecerConfirmacion(`Tu ${tipoSolicitud} de demostración se preparó correctamente. No se envió a la veterinaria porque este proyecto aún no tiene un sistema de pagos ni backend.`);
    }
  };

  return (
    <main>
      <header className="py-4 py-lg-5 text-white" style={{ background: 'linear-gradient(120deg, #153259, #36BBD9)' }}>
        <div className="container-fluid px-4 px-lg-5">
          <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#04BFAD', color: '#153259' }}>Tu selección</span>
          <h1 className="display-5 fw-bold mb-2">Mi carrito</h1>
          <p className="lead mb-0 text-white-50">Revisa tus productos y solicitudes de reserva antes de continuar.</p>
        </div>
      </header>

      <section className="container-fluid px-4 px-lg-5 py-5">
        {confirmacion && (
          <div className="alert alert-success" role="status">
            <h2 className="h5">Solicitud preparada</h2>
            <p className="mb-0">{confirmacion}</p>
          </div>
        )}

        {articulos.length === 0 ? (
          <div className="text-center bg-light rounded-4 p-5">
            <h2 className="h4">Tu carrito está vacío</h2>
            <p className="text-secondary mb-4">Agrega productos o servicios para preparar tu solicitud.</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link className="btn text-white fw-bold" style={{ backgroundColor: '#153259' }} to="/productos">
                Ver productos
              </Link>
              <Link className="btn text-white fw-bold" style={{ backgroundColor: '#04BFAD' }} to="/servicios">
                Ver servicios
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4 align-items-start">
            <div className="col-lg-8">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Artículos ({cantidadTotal})</h2>
                <button type="button" className="btn btn-link text-danger" onClick={vaciar}>
                  Vaciar carrito
                </button>
              </div>
              <div className="d-grid gap-3">
                {articulos.map((entrada) => {
                  const key = `${entrada.tipo}-${entrada.producto.codigo}`;
                  const detailPath = entrada.tipo === 'producto'
                    ? `/productos/${entrada.producto.codigo}`
                    : `/servicios/${entrada.producto.codigo}`;
                  const image = entrada.producto.imagen;
                  const maximumReached = entrada.tipo === 'producto' && entrada.cantidad >= entrada.producto.stock;

                  return (
                    <article className="card border-0 shadow-sm" key={key}>
                      <div className="card-body p-3 p-md-4">
                        <div className="row g-3 align-items-center">
                          <div className="col-4 col-md-3">
                            {image ? (
                              <img
                                src={image}
                                alt={entrada.producto.nombre}
                                className="img-fluid rounded-3 bg-light w-100"
                                style={{ height: '130px', objectFit: 'contain' }}
                              />
                            ) : (
                              <div className="rounded-3 bg-light w-100" style={{ height: '130px' }} />
                            )}
                          </div>
                          <div className="col-8 col-md-5">
                            <span className="badge rounded-pill mb-2" style={{ backgroundColor: '#e5f8f6', color: '#153259' }}>
                              {obtenerEtiquetaArticulo(entrada)}
                            </span>
                            <h3 className="h5 mb-1">
                              <Link className="text-decoration-none" style={{ color: '#153259' }} to={detailPath}>
                                {entrada.producto.nombre}
                              </Link>
                            </h3>
                            <p className="small text-secondary mb-1">{entrada.producto.categoria} · Código {entrada.producto.codigo}</p>
                            {entrada.tipo === 'servicio' && (
                              <p className="small text-secondary mb-0">{entrada.producto.especie} · {entrada.producto.duracion}</p>
                            )}
                            {entrada.tipo === 'producto' && (
                              <p className="small text-secondary mb-0">
                                Stock: {entrada.producto.stock} · {entrada.producto.especie}
                              </p>
                            )}
                          </div>
                          <div className="col-7 col-md-2">
                            <div className="input-group input-group-sm" aria-label={`Cantidad de ${entrada.producto.nombre}`}>
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                aria-label={`Reducir cantidad de ${entrada.producto.nombre}`}
                                disabled={entrada.cantidad <= 1}
                                onClick={() => establecerCantidad(entrada.tipo, entrada.producto.codigo, entrada.cantidad - 1)}
                              >
                                −
                              </button>
                              <span className="input-group-text">{entrada.cantidad}</span>
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                aria-label={`Aumentar cantidad de ${entrada.producto.nombre}`}
                                disabled={maximumReached}
                                onClick={() => establecerCantidad(entrada.tipo, entrada.producto.codigo, entrada.cantidad + 1)}
                              >
                                +
                              </button>
                            </div>
                            {maximumReached && <span className="small text-secondary">Stock máximo</span>}
                          </div>
                          <div className="col-5 col-md-2 text-end">
                            <strong>${(entrada.producto.precio * entrada.cantidad).toLocaleString('es-CL')}</strong>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger d-block ms-auto px-0"
                              onClick={() => quitarArticulo(entrada.tipo, entrada.producto.codigo)}
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="col-lg-4">
              <section className="card border-0 shadow-sm sticky-lg-top" style={{ top: '1rem' }}>
                <div className="card-body p-4">
                  <h2 className="h5 mb-3">Resumen</h2>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Artículos</span>
                    <span>{cantidadTotal}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-3 mb-3">
                    <strong>Total estimado</strong>
                    <strong className="fs-5" style={{ color: '#153259' }}>${total.toLocaleString('es-CL')}</strong>
                  </div>
                  <p className="small text-secondary">
                    Los valores de servicios son referenciales. El pago o confirmación definitiva requiere coordinación con la veterinaria.
                  </p>
                  {!usuario && (
                    <p className="small rounded-3 p-3" style={{ backgroundColor: '#e5f8f6' }}>
                      Iniciarás sesión solo al confirmar la compra o reserva. Tu carrito se conservará.
                    </p>
                  )}
                  {usuario && (
                    <p className="small text-secondary">Sesión iniciada como {usuario.nombre}.</p>
                  )}
                  <button
                    type="button"
                    className="btn text-white fw-bold w-100"
                    style={{ backgroundColor: '#04BFAD' }}
                    onClick={manejarConfirmacion}
                  >
                    {usuario ? 'Confirmar solicitud' : 'Iniciar sesión para confirmar'}
                  </button>
                </div>
              </section>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}