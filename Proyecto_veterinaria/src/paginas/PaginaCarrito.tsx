import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ItemCarrito } from '../types';
import { useAutenticacion } from '../context/useAutenticacion';
import { useCarrito } from '../context/useCarrito';
import { crearOrden } from '../services/servicioOrdenes';

function obtenerEtiquetaArticulo(articulo: ItemCarrito): string {
  return articulo.tipo === 'producto' ? 'Producto' : 'Solicitud de reserva';
}

export function PaginaCarrito() {
  const { articulos, establecerCantidad, quitarArticulo, vaciar, vaciarProductos } = useCarrito();
  const { usuario } = useAutenticacion();
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmacion, establecerConfirmacion] = useState<string | null>(null);
  const [errorCompra, establecerErrorCompra] = useState<string | null>(null);
  const [procesandoCompra, establecerProcesandoCompra] = useState(false);
  const cantidadTotal = articulos.reduce((sum, articulo) => sum + articulo.cantidad, 0);
  const totalProductos = articulos.reduce(
    (sum, articulo) => sum + (articulo.tipo === 'producto' ? articulo.producto.precio * articulo.cantidad : 0),
    0,
  );
  const totalServicios = articulos.reduce(
    (sum, articulo) => sum + (articulo.tipo === 'servicio' ? articulo.producto.precio * articulo.cantidad : 0),
    0,
  );
  const hayProductos = articulos.some((articulo) => articulo.tipo === 'producto');

  const manejarConfirmacion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!usuario) {
      navigate('/login', { state: { from: { pathname: location.pathname } } });
      return;
    }

    if (articulos.length === 0) return;
    const productos = articulos.filter((articulo) => articulo.tipo === 'producto');
    const tieneServicios = articulos.some((articulo) => articulo.tipo === 'servicio');
    establecerErrorCompra(null);
    establecerConfirmacion(null);

    if (productos.length === 0) {
      establecerConfirmacion('Las solicitudes de reserva todavía no se han enviado. Se conservaron en tu carrito hasta que ms-reservas esté disponible.');
      return;
    }

    establecerProcesandoCompra(true);
    try {
      const orden = await crearOrden(usuario.token, productos.map((articulo) => ({
        codigo: articulo.producto.codigo,
        cantidad: articulo.cantidad,
      })));
      const carritoActualizado = vaciarProductos();
      establecerConfirmacion(carritoActualizado
        ? `Tu orden #${orden.id} quedó registrada.`
        : `La orden #${orden.id} quedó registrada, pero no se pudo actualizar el carrito. No vuelvas a enviar esta compra; recarga la página y revisa tu perfil.`);
      if (tieneServicios) {
        establecerConfirmacion((actual) => `${actual} Las solicitudes de reserva se conservaron y siguen pendientes de ms-reservas.`);
      }
    } catch (error) {
      establecerErrorCompra(error instanceof Error
        ? error.message
        : 'No se pudo confirmar la compra. Tu carrito se conservó.');
    } finally {
      establecerProcesandoCompra(false);
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
            <h2 className="h5">Resultado de la operación</h2>
            <p className="mb-0">{confirmacion}</p>
          </div>
        )}

        {articulos.length === 0 ? (
          <div className="text-center bg-light rounded-4 p-5">
            <h2 className="h4">Tu carrito está vacío</h2>
            <p className="text-secondary mb-4">Agrega productos o servicios para continuar.</p>
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
                  {totalServicios > 0 && (
                    <div className="d-flex justify-content-between mb-2 small">
                      <span className="text-secondary">Servicios (referencial, no incluido)</span>
                      <span>${totalServicios.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between border-top pt-3 mb-3">
                    <strong>Total estimado de productos</strong>
                    <strong className="fs-5" style={{ color: '#153259' }}>${totalProductos.toLocaleString('es-CL')}</strong>
                  </div>
                  <p className="small text-secondary">
                    Los productos se registran como órdenes de compra. Las reservas aún dependen de la integración con ms-reservas.
                  </p>
                  {!usuario && (
                    <p className="small rounded-3 p-3" style={{ backgroundColor: '#e5f8f6' }}>
                      Iniciarás sesión solo al confirmar la compra o reserva. Tu carrito se conservará.
                    </p>
                  )}
                  {usuario && (
                    <p className="small text-secondary">Sesión iniciada como {usuario.nombre || usuario.correo}.</p>
                  )}
                  <form onSubmit={manejarConfirmacion}>
                    {errorCompra && <div className="alert alert-danger" role="alert">{errorCompra}</div>}
                    <button
                      type="submit"
                      className="btn text-white fw-bold w-100"
                      style={{ backgroundColor: '#04BFAD' }}
                      disabled={procesandoCompra || articulos.length === 0}
                    >
                      {procesandoCompra
                        ? 'Procesando compra…'
                        : usuario
                          ? hayProductos
                            ? 'Confirmar compra'
                            : 'Continuar con reserva (pendiente)'
                          : 'Iniciar sesión para continuar'}
                    </button>
                  </form>
                </div>
              </section>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}