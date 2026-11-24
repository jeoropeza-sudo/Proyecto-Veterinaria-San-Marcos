import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { Reserva } from '../types';
import {
  actualizarMiPerfil,
  obtenerMiPerfil,
  obtenerMisOrdenes,
  type DatosActualizacionPerfil,
  type OrdenCliente,
  type PerfilCliente,
} from '../services/servicioPerfilCliente';
import { obtenerReservasCliente } from '../services/servicioReservas';

type CampoPerfil = 'run' | 'nombre' | 'apellidos' | 'fechaNacimiento' | 'region' | 'comuna' | 'direccion';
type ErroresPerfil = Partial<Record<CampoPerfil, string>>;

function mostrarError(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar la solicitud.';
}

function formatearFecha(fecha: string | null | undefined): string {
  if (!fecha) return 'Sin fecha';
  const fechaParaMostrar = fecha.length === 10 ? `${fecha}T00:00:00` : fecha;
  const fechaConvertida = new Date(fechaParaMostrar);
  const opciones: Intl.DateTimeFormatOptions = fecha.length === 10
    ? { dateStyle: 'medium' }
    : { dateStyle: 'medium', timeStyle: 'short' };
  return Number.isNaN(fechaConvertida.getTime())
    ? 'Fecha no disponible'
    : fechaConvertida.toLocaleString('es-CL', opciones);
}

function formatearMonto(monto: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(monto);
}

function datosDelPerfil(perfil: PerfilCliente): DatosActualizacionPerfil {
  return {
    run: perfil.run ?? '',
    nombre: perfil.nombre ?? '',
    apellidos: perfil.apellidos ?? '',
    fechaNacimiento: perfil.fechaNacimiento,
    region: perfil.region ?? '',
    comuna: perfil.comuna ?? '',
    direccion: perfil.direccion ?? '',
  };
}

export function PaginaPerfilCliente() {
  const [perfil, establecerPerfil] = useState<PerfilCliente | null>(null);
  const [formulario, establecerFormulario] = useState<DatosActualizacionPerfil>({
    run: '',
    nombre: '',
    apellidos: '',
    fechaNacimiento: null,
    region: '',
    comuna: '',
    direccion: '',
  });
  const [ordenes, establecerOrdenes] = useState<OrdenCliente[]>([]);
  const [reservas, establecerReservas] = useState<Reserva[]>([]);
  const [cargandoPerfil, establecerCargandoPerfil] = useState(true);
  const [cargandoOrdenes, establecerCargandoOrdenes] = useState(true);
  const [cargandoReservas, establecerCargandoReservas] = useState(true);
  const [guardando, establecerGuardando] = useState(false);
  const [errorPerfil, establecerErrorPerfil] = useState<string | null>(null);
  const [errorOrdenes, establecerErrorOrdenes] = useState<string | null>(null);
  const [errorReservas, establecerErrorReservas] = useState<string | null>(null);
  const [erroresCampos, establecerErroresCampos] = useState<ErroresPerfil>({});
  const [mensajeGuardado, establecerMensajeGuardado] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    establecerCargandoPerfil(true);
    establecerCargandoOrdenes(true);
    establecerCargandoReservas(true);
    establecerErrorPerfil(null);
    establecerErrorOrdenes(null);
    establecerErrorReservas(null);

    const [resultadoPerfil, resultadoOrdenes] = await Promise.allSettled([
      obtenerMiPerfil(),
      obtenerMisOrdenes(),
    ]);

    if (resultadoPerfil.status === 'fulfilled') {
      establecerPerfil(resultadoPerfil.value);
      establecerFormulario(datosDelPerfil(resultadoPerfil.value));
      try {
        const datosReservas = await obtenerReservasCliente(resultadoPerfil.value.email);
        establecerReservas(datosReservas);
      } catch (error) {
        establecerErrorReservas(mostrarError(error));
      }
    } else {
      establecerErrorPerfil(mostrarError(resultadoPerfil.reason));
      establecerErrorReservas('No se pudieron cargar las reservas de este perfil.');
    }

    if (resultadoOrdenes.status === 'fulfilled') {
      establecerOrdenes(resultadoOrdenes.value);
    } else {
      establecerErrorOrdenes(mostrarError(resultadoOrdenes.reason));
    }

    establecerCargandoPerfil(false);
    establecerCargandoOrdenes(false);
    establecerCargandoReservas(false);
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const cambiarCampo = <K extends CampoPerfil>(campo: K, valor: DatosActualizacionPerfil[K]) => {
    establecerFormulario((actual) => ({ ...actual, [campo]: valor }));
    establecerErroresCampos((actual) => ({ ...actual, [campo]: undefined }));
    establecerMensajeGuardado(null);
  };

  const guardarPerfil = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const errores: ErroresPerfil = {};
    if (!formulario.nombre.trim()) errores.nombre = 'Ingresa tu nombre.';
    if (!formulario.apellidos.trim()) errores.apellidos = 'Ingresa tus apellidos.';
    establecerErroresCampos(errores);
    establecerMensajeGuardado(null);
    establecerErrorPerfil(null);
    if (Object.keys(errores).length > 0) return;

    establecerGuardando(true);
    try {
      const actualizado = await actualizarMiPerfil({
        ...formulario,
        run: formulario.run.trim(),
        nombre: formulario.nombre.trim(),
        apellidos: formulario.apellidos.trim(),
        region: formulario.region.trim(),
        comuna: formulario.comuna.trim(),
        direccion: formulario.direccion.trim(),
      });
      establecerPerfil(actualizado);
      establecerFormulario(datosDelPerfil(actualizado));
      establecerMensajeGuardado('Tus datos se actualizaron correctamente.');
    } catch (error) {
      establecerErrorPerfil(mostrarError(error));
    } finally {
      establecerGuardando(false);
    }
  };

  return (
    <main className="container py-4 py-lg-5">
      <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-uppercase small fw-semibold text-secondary mb-1">Mi cuenta</p>
          <h1 className="h2 mb-0" style={{ color: '#153259' }}>Perfil del cliente</h1>
        </div>
        <button type="button" className="btn btn-outline-primary" onClick={() => void cargarDatos()}>
          Actualizar información
        </button>
      </header>

      <div className="row g-4">
        <section className="col-12" aria-labelledby="perfil-title">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 id="perfil-title" className="h4 mb-3">Datos personales</h2>
              {errorPerfil && (
                <div className="alert alert-danger" role="alert">
                  {errorPerfil}
                  {!perfil && <button type="button" className="btn btn-sm btn-outline-danger ms-3" onClick={() => void cargarDatos()}>Reintentar</button>}
                </div>
              )}
              {mensajeGuardado && <div className="alert alert-success" role="status">{mensajeGuardado}</div>}
              {cargandoPerfil ? (
                <p className="text-secondary mb-0" role="status">Cargando tus datos…</p>
              ) : perfil ? (
                <form onSubmit={guardarPerfil} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="perfil-email">Correo electrónico</label>
                      <input id="perfil-email" className="form-control" value={perfil.email} readOnly />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="perfil-run">RUT</label>
                      <input
                        id="perfil-run"
                        className="form-control"
                        value={formulario.run}
                        onChange={(evento) => cambiarCampo('run', evento.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="perfil-nombre">Nombre</label>
                      <input
                        id="perfil-nombre"
                        className={`form-control${erroresCampos.nombre ? ' is-invalid' : ''}`}
                        value={formulario.nombre}
                        aria-invalid={Boolean(erroresCampos.nombre)}
                        aria-describedby={erroresCampos.nombre ? 'perfil-nombre-error' : undefined}
                        onChange={(evento) => cambiarCampo('nombre', evento.target.value)}
                      />
                      {erroresCampos.nombre && <div id="perfil-nombre-error" className="invalid-feedback">{erroresCampos.nombre}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="perfil-apellidos">Apellidos</label>
                      <input
                        id="perfil-apellidos"
                        className={`form-control${erroresCampos.apellidos ? ' is-invalid' : ''}`}
                        value={formulario.apellidos}
                        aria-invalid={Boolean(erroresCampos.apellidos)}
                        aria-describedby={erroresCampos.apellidos ? 'perfil-apellidos-error' : undefined}
                        onChange={(evento) => cambiarCampo('apellidos', evento.target.value)}
                      />
                      {erroresCampos.apellidos && <div id="perfil-apellidos-error" className="invalid-feedback">{erroresCampos.apellidos}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="perfil-nacimiento">Fecha de nacimiento</label>
                      <input
                        id="perfil-nacimiento"
                        type="date"
                        className="form-control"
                        value={formulario.fechaNacimiento ?? ''}
                        onChange={(evento) => cambiarCampo('fechaNacimiento', evento.target.value || null)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="perfil-region">Región</label>
                      <input
                        id="perfil-region"
                        className="form-control"
                        value={formulario.region}
                        onChange={(evento) => cambiarCampo('region', evento.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="perfil-comuna">Comuna</label>
                      <input
                        id="perfil-comuna"
                        className="form-control"
                        value={formulario.comuna}
                        onChange={(evento) => cambiarCampo('comuna', evento.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="perfil-direccion">Dirección</label>
                      <input
                        id="perfil-direccion"
                        className="form-control"
                        value={formulario.direccion}
                        onChange={(evento) => cambiarCampo('direccion', evento.target.value)}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn text-white fw-semibold mt-4" style={{ backgroundColor: '#153259' }} disabled={guardando}>
                    {guardando ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </section>

        <section className="col-lg-6" aria-labelledby="ordenes-title">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 id="ordenes-title" className="h4 mb-1">Boletas y compras</h2>
              <p className="small text-secondary">Historial de órdenes registradas en tu cuenta.</p>
              <p className="small text-secondary">El servicio disponible registra órdenes; no emite boletas tributarias.</p>
              {errorOrdenes && <div className="alert alert-danger" role="alert">{errorOrdenes}</div>}
              {cargandoOrdenes ? (
                <p className="text-secondary" role="status">Cargando compras…</p>
              ) : ordenes.length === 0 ? (
                <p className="text-secondary mb-0">Todavía no hay compras registradas.</p>
              ) : (
                <div className="d-grid gap-3">
                  {ordenes.map((orden) => (
                    <article key={orden.id} className="border rounded-3 p-3">
                      <div className="d-flex justify-content-between gap-2">
                        <strong>Orden #{orden.id}</strong>
                        <span className="badge text-bg-light">{orden.estado}</span>
                      </div>
                      <p className="small text-secondary mt-2 mb-2">{formatearFecha(orden.fechaCreacion)}</p>
                      <p className="fw-semibold mb-2">Total: {formatearMonto(orden.total)}</p>
                      <details>
                        <summary className="small fw-semibold">Ver artículos</summary>
                        <ul className="small mt-2 mb-0">
                          {orden.items.map((item) => (
                            <li key={`${orden.id}-${item.codigoProducto}`}>
                              {item.nombreProducto} × {item.cantidad} — {formatearMonto(item.subtotal)}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="col-lg-6" aria-labelledby="reservas-title">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 id="reservas-title" className="h4 mb-3">Mis reservas</h2>
              {errorReservas && <div className="alert alert-danger" role="alert">{errorReservas}</div>}
              {cargandoReservas ? (
                <p className="text-secondary" role="status">Cargando reservas…</p>
              ) : reservas.length === 0 ? (
                <p className="text-secondary mb-0">Todavía no hay reservas registradas.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr><th>Servicio</th><th>Mascota</th><th>Fecha y hora</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                      {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                          <td>{reserva.servicio}</td>
                          <td>{reserva.nombreMascota}</td>
                          <td>{reserva.fecha} · {reserva.hora}</td>
                          <td>{reserva.estado || 'Pendiente'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
