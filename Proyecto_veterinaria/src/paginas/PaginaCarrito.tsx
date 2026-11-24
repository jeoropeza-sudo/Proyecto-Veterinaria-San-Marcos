import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ItemCarrito } from '../types';
import { useAutenticacion } from '../context/useAutenticacion';
import { useCarrito } from '../context/useCarrito';
import { crearOrden, obtenerMiPerfil } from '../services/servicioPerfilCliente';
import { crearReserva } from '../services/servicioReservas';

type CampoReserva = 'nombreMascota' | 'fecha' | 'hora';
type ErroresReserva = Partial<Record<CampoReserva, string>>;

function mostrarError(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar la solicitud.';
}

function obtenerFechaMinima(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function obtenerNombreArticulo(articulo: ItemCarrito): string {
  return articulo.producto.nombre;
}

export function PaginaCarrito() {
  const { articulos, establecerCantidad, quitarArticulo, quitarArticulos, vaciar } = useCarrito();
  const { usuario } = useAutenticacion();
  const location = useLocation();
  const navigate = useNavigate();
  const [erroresReserva, establecerErroresReserva] = useState<ErroresReserva>({});
  const [nombreMascota, establecerNombreMascota] = useState('');
  const [fecha, establecerFecha] = useState('');
  const [hora, establecerHora] = useState('');
  const [procesandoCompra, establecerProcesandoCompra] = useState(false);
  const [procesandoReserva, establecerProcesandoReserva] = useState(false);
  const [errorCompra, establecerErrorCompra] = useState<string | null>(null);
  const [errorReserva, establecerErrorReserva] = useState<string | null>(null);
  const [mensajeCompra, establecerMensajeCompra] = useState<string | null>(null);
  const [mensajeReserva, establecerMensajeReserva] = useState<string | null>(null);

  const productos = articulos.filter((articulo) => articulo.tipo === 'producto');
  const servicios = articulos.filter((articulo) => articulo.tipo === 'servicio');
  const hayOperacionEnCurso = procesandoCompra || procesandoReserva;
  const cantidadTotal = articulos.reduce((sum, articulo) => (
    sum + (articulo.tipo === 'producto' ? articulo.cantidad : 1)
  ), 0);
  const total = articulos.reduce((sum, articulo) => (
    sum + articulo.producto.precio * (articulo.tipo === 'producto' ? articulo.cantidad : 1)
  ), 0);

  const solicitarInicioSesion = () => {
    navigate('/login', { state: { from: { pathname: location.pathname } } });
  };

  const confirmarCompra = async () => {
    if (!usuario) {
      solicitarInicioSesion();
      return;
    }
    if (productos.length === 0) return;

    establecerProcesandoCompra(true);
    establecerErrorCompra(null);
    establecerMensajeCompra(null);
    try {
      const orden = await crearOrden(productos.map((articulo) => ({
        codigo: articulo.producto.codigo,
        cantidad: articulo.cantidad,
      })));

      const carritoActualizado = quitarArticulos('producto', productos.map((articulo) => articulo.producto.codigo));
      if (!carritoActualizado) {
        establecerErrorCompra(`La orden #${orden.id} se creó, pero no se pudo actualizar el carrito. Revisa tu perfil antes de volver a intentarlo.`);
        return;
      }

      establecerMensajeCompra(`Compra registrada como orden #${orden.id}. Puedes consultar su detalle en tu perfil.`);
    } catch (error) {
      establecerErrorCompra(mostrarError(error));
    } finally {
      establecerProcesandoCompra(false);
    }
  };

  const confirmarReservas = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!usuario) {
      solicitarInicioSesion();
      return;
    }

    const errores: ErroresReserva = {};
    if (!nombreMascota.trim()) errores.nombreMascota = 'Ingresa el nombre de tu mascota.';
    if (!fecha) errores.fecha = 'Selecciona la fecha de la reserva.';
    else if (fecha < obtenerFechaMinima()) errores.fecha = 'La fecha no puede ser anterior a hoy.';
    if (!hora) errores.hora = 'Selecciona la hora de la reserva.';
    establecerErroresReserva(errores);
    establecerErrorReserva(null);
    establecerMensajeReserva(null);
    if (Object.keys(errores).length > 0) return;

    establecerProcesandoReserva(true);
    let reservasRegistradas = 0;
    const codigosReservados: string[] = [];
    try {
      const perfilCliente = await obtenerMiPerfil();
      const nombreCliente = `${perfilCliente.nombre ?? usuario.nombre} ${perfilCliente.apellidos ?? usuario.apellidos}`.trim();
      for (const articulo of servicios) {
        if (articulo.tipo !== 'servicio') continue;
        await crearReserva({
          nombreCliente,
          emailCliente: perfilCliente.email,
          nombreMascota: nombreMascota.trim(),
          servicio: articulo.producto.nombre,
          fecha,
          hora,
          estado: 'PENDIENTE',
        });
        reservasRegistradas += 1;
        codigosReservados.push(articulo.producto.codigo);
      }

      if (!quitarArticulos('servicio', codigosReservados)) {
        establecerErrorReserva('Las reservas se registraron, pero no se pudo actualizar el carrito.');
        return;
      }

      establecerMensajeReserva(
        reservasRegistradas === 1
          ? 'Tu reserva quedó registrada. Puedes revisar su estado en tu perfil.'
          : `Se registraron ${reservasRegistradas} reservas. Puedes revisar su estado en tu perfil.`,
      );
      establecerNombreMascota('');
      establecerFecha('');
      establecerHora('');
    } catch (error) {
      if (codigosReservados.length > 0) quitarArticulos('servicio', codigosReservados);
      const detalle = mostrarError(error);
      establecerErrorReserva(
        reservasRegistradas > 0
          ? `Se registraron ${reservasRegistradas} reservas. Una reserva pendiente no se pudo guardar: ${detalle}`
          : detalle,
      );
    } finally {
      establecerProcesandoReserva(false);
    }
  };

  return (
    <main>
      <header className="py-4 py-lg-5 text-white" style={{ background: 'linear-gradient(120deg, #153259, #36BBD9)' }}>
        <div className="container-fluid px-4 px-lg-5">
          <span className="badge rounded-pill mb-3" style={{ backgroundColor: '#04BFAD', color: '#153259' }}>Tu selección</span>
          <h1 className="display-5 fw-bold mb-2">Mi carrito</h1>
          <p className="lead mb-0 text-white-50">Confirma tus compras y agenda las reservas de tus servicios.</p>
        </div>
      </header>

      <section className="container-fluid px-4 px-lg-5 py-5">
        {articulos.length === 0 ? (
          <div className="text-center bg-light rounded-4 p-5">
            <h2 className="h4">Tu carrito está vacío</h2>
            <p className="text-secondary mb-4">Agrega productos o servicios para continuar.</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link className="btn text-white fw-bold" style={{ backgroundColor: '#153259' }} to="/productos">Ver productos</Link>
              <Link className="btn text-white fw-bold" style={{ backgroundColor: '#04BFAD' }} to="/servicios">Ver servicios</Link>
            </div>
          </div>
        ) : (
          <div className="row g-4 align-items-start">
            <div className="col-lg-8">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Artículos ({cantidadTotal})</h2>
                <button type="button" className="btn btn-link text-danger" onClick={vaciar} disabled={hayOperacionEnCurso}>Vaciar carrito</button>
              </div>
              <div className="d-grid gap-3">
                {articulos.map((entrada) => {
                  const key = `${entrada.tipo}-${entrada.producto.codigo}`;
                  const detailPath = entrada.tipo === 'producto'
                    ? `/productos/${entrada.producto.codigo}`
                    : `/servicios/${entrada.producto.codigo}`;
                  const maximumReached = entrada.tipo === 'producto' && entrada.cantidad >= entrada.producto.stock;

                  return (
                    <article className="card border-0 shadow-sm" key={key}>
                      <div className="card-body p-3 p-md-4">
                        <div className="row g-3 align-items-center">
                          <div className="col-4 col-md-3">
                            {entrada.producto.imagen ? (
                              <img
                                src={entrada.producto.imagen}
                                alt={entrada.producto.nombre}
                                className="img-fluid rounded-3 bg-light w-100"
                                style={{ height: '130px', objectFit: 'contain' }}
                              />
                            ) : <div className="rounded-3 bg-light w-100" style={{ height: '130px' }} />}
                          </div>
                          <div className="col-8 col-md-5">
                            <span className="badge rounded-pill mb-2" style={{ backgroundColor: '#e5f8f6', color: '#153259' }}>
                              {entrada.tipo === 'producto' ? 'Producto' : 'Reserva de servicio'}
                            </span>
                            <h3 className="h5 mb-1">
                              <Link className="text-decoration-none" style={{ color: '#153259' }} to={detailPath}>
                                {obtenerNombreArticulo(entrada)}
                              </Link>
                            </h3>
                            <p className="small text-secondary mb-1">{entrada.producto.categoria} · Código {entrada.producto.codigo}</p>
                            {entrada.tipo === 'servicio' && (
                              <p className="small text-secondary mb-0">{entrada.producto.especie} · {entrada.producto.duracion}</p>
                            )}
                            {entrada.tipo === 'producto' && (
                              <p className="small text-secondary mb-0">Stock: {entrada.producto.stock} · {entrada.producto.especie}</p>
                            )}
                          </div>
                          <div className="col-7 col-md-2">
                            {entrada.tipo === 'producto' ? (
                              <>
                                <div className="input-group input-group-sm" aria-label={`Cantidad de ${entrada.producto.nombre}`}>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    aria-label={`Reducir cantidad de ${entrada.producto.nombre}`}
                                    disabled={entrada.cantidad <= 1 || hayOperacionEnCurso}
                                    onClick={() => establecerCantidad(entrada.tipo, entrada.producto.codigo, entrada.cantidad - 1)}
                                  >−</button>
                                  <span className="input-group-text">{entrada.cantidad}</span>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    aria-label={`Aumentar cantidad de ${entrada.producto.nombre}`}
                                    disabled={maximumReached || hayOperacionEnCurso}
                                    onClick={() => establecerCantidad(entrada.tipo, entrada.producto.codigo, entrada.cantidad + 1)}
                                  >+</button>
                                </div>
                                {maximumReached && <span className="small text-secondary">Stock máximo</span>}
                              </>
                            ) : <span className="small text-secondary">1 reserva</span>}
                          </div>
                          <div className="col-5 col-md-2 text-end">
                            <strong>
                              ${(entrada.producto.precio * (entrada.tipo === 'producto' ? entrada.cantidad : 1)).toLocaleString('es-CL')}
                            </strong>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger d-block ms-auto px-0"
                              onClick={() => quitarArticulo(entrada.tipo, entrada.producto.codigo)}
                              disabled={hayOperacionEnCurso}
                            >Quitar</button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="col-lg-4">
              <section className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h2 className="h5 mb-3">Resumen</h2>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Artículos</span><span>{cantidadTotal}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-3">
                    <strong>Valor estimado</strong>
                    <strong className="fs-5" style={{ color: '#153259' }}>${total.toLocaleString('es-CL')}</strong>
                  </div>
                  {usuario ? (
                    <p className="small text-secondary mt-3 mb-0">Sesión iniciada como {usuario.nombre}.</p>
                  ) : (
                    <p className="small text-secondary mt-3 mb-0">Inicia sesión para confirmar compras o reservar servicios.</p>
                  )}
                </div>
              </section>

              {productos.length > 0 && (
                <section className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h2 className="h5">Compra de productos</h2>
                    <p className="small text-secondary">La orden confirmada quedará disponible en tu perfil.</p>
                    {errorCompra && <div className="alert alert-danger" role="alert">{errorCompra}</div>}
                    {mensajeCompra && <div className="alert alert-success" role="status">{mensajeCompra}</div>}
                    <button
                      type="button"
                      className="btn text-white fw-bold w-100"
                      style={{ backgroundColor: '#153259' }}
                      onClick={() => void confirmarCompra()}
                      disabled={hayOperacionEnCurso}
                    >
                      {!usuario ? 'Iniciar sesión para comprar' : procesandoCompra ? 'Procesando compra…' : 'Confirmar compra'}
                    </button>
                  </div>
                </section>
              )}

              {servicios.length > 0 && (
                <section className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h2 className="h5">Agendar servicios</h2>
                    <p className="small text-secondary">Indica a qué mascota y cuándo corresponde la atención.</p>
                    {errorReserva && <div className="alert alert-danger" role="alert">{errorReserva}</div>}
                    {mensajeReserva && <div className="alert alert-success" role="status">{mensajeReserva}</div>}
                    <form onSubmit={confirmarReservas} noValidate>
                      <div className="mb-3">
                        <label htmlFor="nombre-mascota" className="form-label">Nombre de la mascota</label>
                        <input
                          id="nombre-mascota"
                          className={`form-control${erroresReserva.nombreMascota ? ' is-invalid' : ''}`}
                          value={nombreMascota}
                          aria-invalid={Boolean(erroresReserva.nombreMascota)}
                          aria-describedby={erroresReserva.nombreMascota ? 'nombre-mascota-error' : undefined}
                          onChange={(evento) => {
                            establecerNombreMascota(evento.target.value);
                            establecerErroresReserva((actual) => ({ ...actual, nombreMascota: undefined }));
                          }}
                          disabled={hayOperacionEnCurso}
                        />
                        {erroresReserva.nombreMascota && <div id="nombre-mascota-error" className="invalid-feedback">{erroresReserva.nombreMascota}</div>}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="fecha-reserva" className="form-label">Fecha</label>
                        <input
                          id="fecha-reserva"
                          type="date"
                          min={obtenerFechaMinima()}
                          className={`form-control${erroresReserva.fecha ? ' is-invalid' : ''}`}
                          value={fecha}
                          aria-invalid={Boolean(erroresReserva.fecha)}
                          aria-describedby={erroresReserva.fecha ? 'fecha-reserva-error' : undefined}
                          onChange={(evento) => {
                            establecerFecha(evento.target.value);
                            establecerErroresReserva((actual) => ({ ...actual, fecha: undefined }));
                          }}
                          disabled={hayOperacionEnCurso}
                        />
                        {erroresReserva.fecha && <div id="fecha-reserva-error" className="invalid-feedback">{erroresReserva.fecha}</div>}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="hora-reserva" className="form-label">Hora</label>
                        <input
                          id="hora-reserva"
                          type="time"
                          className={`form-control${erroresReserva.hora ? ' is-invalid' : ''}`}
                          value={hora}
                          aria-invalid={Boolean(erroresReserva.hora)}
                          aria-describedby={erroresReserva.hora ? 'hora-reserva-error' : undefined}
                          onChange={(evento) => {
                            establecerHora(evento.target.value);
                            establecerErroresReserva((actual) => ({ ...actual, hora: undefined }));
                          }}
                          disabled={hayOperacionEnCurso}
                        />
                        {erroresReserva.hora && <div id="hora-reserva-error" className="invalid-feedback">{erroresReserva.hora}</div>}
                      </div>
                      <button
                        type="submit"
                        className="btn text-white fw-bold w-100"
                        style={{ backgroundColor: '#04BFAD' }}
                        disabled={hayOperacionEnCurso}
                      >
                        {!usuario ? 'Iniciar sesión para reservar' : procesandoReserva ? 'Registrando reserva…' : 'Confirmar reserva'}
                      </button>
                    </form>
                  </div>
                </section>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
